<template>
  <v-container>
    <ShowAnn
      v-if="items"
      :items="items"
      :menu="perm"
      updateInfo
      @edit="edit" @delete="deleteAnn"
    ></ShowAnn>
  </v-container>
</template>

<script>
import ShowAnn from '@/components/courses/ShowAnn'
export default {

  name: 'SysAnn',

  components: {
    ShowAnn
  },

  data () {
    return {
      items: null,
      perm: false
    }
  },

  beforeMount () {
    this.getAnn()
    this.checkUser(this.getUsername())
  },

  methods: {
    getAnn () {
      this.$http.get(`/api/ann/${this.$route.params.id}`)
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
    operate (idx) {
      if (idx === 0) { this.annDialog = true } else if (idx === 1) this.deleteAnn()
    },
    editAnn () {
      if (this.$refs.form.validate()) {
        this.$http.put('/api/ann', { title: this.newTitle, markdown: this.newContent, annId: this.$route.params.id })
          .then(() => {
            this.annDialog = false
          })
      }
    },
    deleteAnn () {
      this.$http.delete('/api/ann', { headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' }, data: { annId: this.$route.params.id } })
        .then(() => {
          this.$router.push(`/course/${this.$route.params.name}/announcement`)
        })
        .catch((err) => {
          console.log(err)
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
