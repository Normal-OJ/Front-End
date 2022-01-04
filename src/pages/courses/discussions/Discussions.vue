<template>
  <div>
    <Creator v-if="canWriteCourse" v-model="dialog" :type="type" title="Discussion" @cancel="cancel" @post="submit">
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
      :content="false"
      :readmore="`/course/${$route.params.name}/discussion`"
      @edit="edit" @delete="deletePost"
    />
    <spinner v-else />
  </div>
</template>

<script>
import Creator from '@/components/courses/Creator'
import ShowPost from '@/components/courses/ShowPost'
import { mapState } from 'vuex'
import Spinner from '@/components/ui/Spinner.vue'

export default {

  name: 'Discussions',

  components: {
    Creator, ShowPost, Spinner
  },

  data () {
    return {
      dialog: false,
      type: 'New',
      validForm: false,
      items: null,
      post: {
        course: this.$route.params.name,
        title: '',
        content: '',
        targetThreadId: null
      },
      tas: []
    }
  },
  computed: {
    ...mapState({
      username: state => state.username,
      role: state => state.role
    }),
    canWriteCourse () {
      return this.role <= 1 || this.tas.include(ta => ta.username === this.username)
    }
  },
  created () {
    this.getPosts()
    this.getCourseInfo()
  },
  methods: {
    getPosts () {
      this.$agent.Post.getList(this.$route.params.name)
        .then((res) => {
          this.items = res.data.data.filter(r => r.thread.status !== 1).map(r => ({
            postId: r.thread.id,
            title: r.title,
            status: r.status,
            author: r.thread.author,
            content: r.thread.content,
            createdTime: this.$formatTime(r.thread.created),
            updated: this.$formatTime(r.thread.updated),
            reply: r.thread.reply
          }))
          this.items.reverse()
        })
    },
    cancel () {
      this.post.targetThreadId = null
      this.post.course = this.$route.params.name
      this.type = 'New'
      this.$refs.form.reset()
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
      this.post.course = null
      this.post.title = this.items[idx].title
      this.post.content = this.items[idx].content
      this.post.targetThreadId = id
      this.dialog = true
    },
    deletePost (idx, id) {
      this.post.targetThreadId = id
      this.$agent.Post.delete({ targetThreadId: this.post.targetThreadId })
        .then(() => {
          this.$router.go(0)
        })
    },
    getCourseInfo () {
      this.$agent.Course.getInfo(this.$route.params.name)
        .then((res) => {
          this.tas = res.data.data.TAs
        })
    }
  }
}
</script>
