<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab fixed small
          :to="{ path: '../discussions' }"
          color="secondary"
          v-on="on"
          class="ma-3"
        ><v-icon>mdi-backburger</v-icon></v-btn>
      </template>
      <span>Return</span>
    </v-tooltip>
    <Creator v-if="canWriteCourse" v-model="dialog" :type="type" title="Discussion" @cancel="cancel" @post="submit" noActivator>
      <template slot="content">
        <v-form v-model="validForm" ref="form">
          <v-text-field
            label="Discussion Title"
            counter="64"
            :rules="[v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters']"
            v-model="post.title"
          ></v-text-field>
          <v-textarea
            label="Discussion Content"
            :rules="[v => !!v || 'Sorry, the content cannot be empty']"
            v-model="post.content"
            no-resize
            auto-grow
          ></v-textarea>
        </v-form>
      </template>
    </Creator>
    <ShowPost
      v-if="items"
      :items="items"
      :menu="canWriteCourse"
      @edit="edit" @delete="deletePost"
    />
    <spinner v-else />
    <v-row justify="center">
      <v-card :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'" elevation="0" style="background: transparent;">
        <ui-button
          v-if="items && items.length > 0"
          @click.native="focus = !focus"
        >
          <template slot="content"><v-icon class="mr-1">mdi-comment</v-icon>Comment</template>
        </ui-button>
      </v-card>
    </v-row>
    <template v-if="items">
      <div v-for="item in items" :key="item.postId">
        <ShowReply :items="item.reply" :focus="focus" @newComment="newComment" @editComment="editComment">
        </ShowReply>
      </div>
    </template>
    <v-snackbar
      v-model="snackbar" class="subtitle-1"
      :color="alert.color"
    >
      {{ alert.msg }}
      <v-btn icon @click="snackbar = false"><v-icon>mdi-close-circle</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Creator from '@/components/courses/Creator'
import ShowPost from '@/components/courses/ShowPost'
import ShowReply from '@/components/courses/ShowReply'
import { mapState } from 'vuex'
import Spinner from '@/components/ui/Spinner.vue'

export default {

  name: 'Discussion',

  components: {
    Creator, ShowPost, ShowReply, Spinner
  },

  data () {
    return {
      dialog: false,
      type: 'New',
      validForm: false,
      items: null,
      post: {
        title: '',
        content: '',
        targetThreadId: null
      },
      focus: false,
      snackbar: false,
      alert: {
        color: '',
        msg: ''
      },
      // tas: []
    }
  },
  computed: {
    ...mapState({
      username: state => state.username,
      role: state => state.role
    }),
    canWriteCourse () {
      return this.role <= 1
      // return this.role <= 1 || this.tas.include(ta => ta.username === this.username)
    }
  },
  created () {
    this.getPost()
    this.getCourseInfo()
  },
  methods: {
    getPost () {
      this.$agent.Post.getInfo(this.$route.params.name, this.$route.params.id)
        .then((res) => {
          this.items = []
          res.data.data.forEach(ele => {
            if (ele.thread.status !== 1) {
              this.items.push({
                postId: ele.thread.id,
                title: ele.title,
                status: ele.status,
                author: ele.thread.author,
                content: ele.thread.content,
                createdTime: this.$formatTime(ele.thread.created),
                updated: this.$formatTime(ele.thread.updated),
                reply: ele.thread.reply
              })
            }
          })
          this.items.reverse()
        })
    },
    cancel () {
      this.post.targetThreadId = null
      this.dialog = false
    },
    submit () {
      if (this.$refs.form.validate()) {
        if (this.post.targetThreadId) {
          this.$agent.Post.modify(this.post)
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
        } else {
          this.$agent.Post.create(this.post)
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
        }
      }
    },
    edit (idx, id) {
      this.type = 'Update'
      this.post.title = this.items[idx].title
      this.post.content = this.items[idx].content
      this.post.targetThreadId = id
      this.dialog = true
    },
    deletePost (idx, id) {
      this.post.targetThreadId = id
      this.$agent.Post.delete({ targetThreadId: id })
        .then(() => {
          this.$router.push(`/course/${this.$route.params.name}/discussions`)
        })
    },
    newComment (id, content) {
      this.$agent.Post.create({ targetThreadId: id, content: content })
        .then(() => {
          this.$router.go(0)
        })
        .catch((err) => {
          this.snackbar = false
          this.alert = {
            color: 'secondary',
            msg: err.response.data.message
          }
          this.snackbar = true
        })
    },
    editComment (id, content) {
      this.$agent.Post.modify({ targetThreadId: id, content: content })
        .then(() => {
          this.$router.go(0)
        })
        .catch((err) => {
          this.snackbar = false
          this.alert = {
            color: 'secondary',
            msg: err.response.data.message
          }
          this.snackbar = true
        })
    },
    getCourseInfo () {
      // this.$agent.Course.getInfo(this.$route.params.name)
      //   .then((res) => {
      //     this.tas = res.data.data.TAs
      //   })
    }
  }
}
</script>
