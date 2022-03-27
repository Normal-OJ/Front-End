<template>
  <div>
    <Creator v-if="canWriteCourse" v-model="dialog" :type="type" title="Announcement" @cancel="cancel" @post="post">
      <template slot="content">
        <v-form v-model="validForm" ref="form">
          <v-text-field
            label="Announcement Title"
            counter="64"
            :rules="[v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters']"
            v-model="ann.title"
          ></v-text-field>
          <v-textarea
            label="Announcement Content"
            :rules="[v => !!v || 'Sorry, the content cannot be empty']"
            v-model="ann.content"
            no-resize
            auto-grow
          ></v-textarea>
          <v-switch
            label="pin at top"
            v-model="ann.pinned"
          ></v-switch>
        </v-form>
      </template>
    </Creator>
    <ShowAnn
      v-if="items"
      :items="items"
      :menu="canWriteCourse"
      :readmore="`/course/${$route.params.name}/announcement`"
      mask
      @edit="edit" @delete="deleteAnn"
    />
    <Spinner v-else />
  </div>
</template>

<script>
import Creator from '@/components/courses/Creator'
import ShowAnn from '@/components/courses/ShowAnn'
import Spinner from '@/components/ui/Spinner.vue'
import { mapState } from 'vuex'

export default {

  name: 'Announcements',

  components: {
    Creator, ShowAnn, Spinner
  },

  data () {
    return {
      items: null,
      dialog: false,
      validForm: true,
      ann: {
        title: '',
        content: '',
        pinned: false
      },
      editing: -1,
      type: 'New',
      // tas: []
    }
  },
  created () {
    this.getAnn()
    this.getCourseInfo()
  },

  computed: {
    ...mapState({
      role: state => state.role,
      username: state => state.username
    }),
    canWriteCourse () {
      return this.role <= 1
      // return this.role <= 1 || this.tas.includes(ta => ta.username === this.username)
    }
  },

  methods: {
    getAnn () {
      this.$agent.Course.getAnns(this.$route.params.name)
        .then((res) => {
          this.items = res.data.data.map(r => ({
            annId: r.annId,
            title: r.title,
            author: r.creator,
            content: r.markdown,
            createdTime: this.$formatTime(r.createTime),
            lastUpdatedTime: this.$formatTime(r.updateTime),
            lastUpdater: r.updater
          }))
        })
    },
    cancel () {
      this.editing = -1
      this.type = 'New'
      this.$refs.form.reset()
      this.dialog = false
    },
    post () {
      if (this.$refs.form.validate()) {
        if (this.editing !== -1) {
          this.$agent.Ann.modify({ title: this.ann.title, markdown: this.ann.content, annId: this.editing, pinned: this.ann.pinned })
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
        } else {
          this.$agent.Ann.create({ courseName: this.$route.params.name, title: this.ann.title, markdown: this.ann.content, pinned: this.ann.pinned })
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
        }
      }
    },
    edit (idx, id) {
      this.editing = id
      this.type = 'Update'
      this.ann.title = this.items[idx].title
      this.ann.content = this.items[idx].content
      this.dialog = true
    },
    deleteAnn (idx, id) {
      this.$agent.Ann.delete({ annId: id })
        .then(() => {
          this.$router.go(0)
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
