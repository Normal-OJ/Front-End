<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab fixed small
          :to="{ path: '../announcements' }"
          color="secondary"
          v-on="on"
          class="ma-3"
        ><v-icon>mdi-backburger</v-icon></v-btn>
      </template>
      <span>Return</span>
    </v-tooltip>
    <Creator v-if="perm" v-model="dialog" type="Update" title="Announcement" @cancel="cancel" @post="post" noActivator>
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
      :menu="perm"
      updateInfo
      @edit="edit" @delete="deleteAnn"
    ></ShowAnn>
  </div>
</template>

<script>
import Creator from '@/components/courses/Creator'
import ShowAnn from '@/components/courses/ShowAnn'
export default {

  name: 'Announcement',

  components: {
    Creator, ShowAnn
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
      perm: false
    }
  },

  beforeMount () {
    this.getAnn()
    this.checkUser(this.getUsername())
  },

  methods: {
    getAnn () {
      this.$http.get(`/api/ann/${this.$route.params.name}/${this.$route.params.id}`)
        .then((res) => {
          this.items = []
          res.data.data.forEach(ele => {
            this.items.push({
              annId: ele.annId,
              title: ele.title,
              author: ele.creator,
              content: ele.markdown,
              createdTime: this.$formatTime(ele.createTime),
              lastUpdatedTime: this.$formatTime(ele.updateTime),
              lastUpdater: ele.updater
            })
          })
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
          this.$http.put('/api/ann', { title: this.ann.title, markdown: this.ann.content, annId: this.editing })
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
        } else {
          this.$http.post('/api/ann', { courseName: this.$route.params.name, title: this.ann.title, markdown: this.ann.content })
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
      this.$http.delete('/api/ann', { headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' }, data: { annId: id } })
        .then(() => {
          this.$router.push(`/course/${this.$route.params.name}/announcements`)
        })
    },
    checkUser (username) {
      this.$http.get(`/api/course/${this.$route.params.name}`)
        .then((res) => {
          var data = res.data.data
          data.TAs.forEach(ele => {
            if (ele.username === username) {
              this.perm = true
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getUsername () {
      if (this.$cookies.isKey('jwt')) {
        var payload = this.parseJwt(this.$cookies.get('jwt'))
        if (payload.active === true) {
          if (payload.role <= 1) this.perm = true
          return payload.username
        }
      }
    },
    parseJwt (token) {
      return JSON.parse(atob(token.split('.')[1])).data
    }
  }

}
</script>
