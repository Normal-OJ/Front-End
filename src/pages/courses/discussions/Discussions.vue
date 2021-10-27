<template>
  <div>
    <Creator v-if="perm" v-model="dialog" :type="type" title="Discussion" @cancel="cancel" @post="submit">
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
      :menu="perm"
      :content="false"
      :readmore="`/course/${$route.params.name}/discussion`"
      @edit="edit" @delete="deletePost"
    ></ShowPost>
  </div>
</template>

<script>
import Creator from '@/components/courses/Creator'
import ShowPost from '@/components/courses/ShowPost'
const API_BASE_URL = '/api'

export default {

  name: 'Discussions',

  components: {
    Creator, ShowPost
  },

  data () {
    return {
      dialog: false,
      type: 'New',
      validForm: false,
      items: [],
      post: {
        course: this.$route.params.name,
        title: '',
        content: '',
        targetThreadId: null
      },
      perm: false,
      username: null
    }
  },
  created () {
    this.getPosts()
    this.checkUser(this.getUsername())
  },
  methods: {
    getPosts () {
      this.$http.get(`${API_BASE_URL}/post/${this.$route.params.name}`)
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
        .catch((err) => {
          console.log(err)
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
          this.$http.put(`${API_BASE_URL}/post`, this.post)
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.$http.post(`${API_BASE_URL}/post`, this.post)
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
            .catch((err) => {
              console.log(err)
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
      this.$http.delete(`${API_BASE_URL}/post`, { headers: { 'Content-Type': 'application/json' }, data: { targetThreadId: this.post.targetThreadId } })
        .then(() => {
          this.$router.go(0)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getAvatar (payload) {
      var d = encodeURI('https://noj.tw/defaultAvatar.png')
      return `https://www.gravatar.com/avatar/${payload}?d=${d}`
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
          this.username = payload.username
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
