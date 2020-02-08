<template>
  <div>
    <Creator v-model="dialog" type="New" title="Announcement" @cancel="cancel" @post="post">
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
        </v-form>
      </template>
    </Creator>
    <ShowAnn v-if="items" :items="items" :course="$route.params.name"></ShowAnn>
  </div>
</template>

<script>
const API_BASE_URL = '/api';

export default {

  name: 'CoursesAnnouncement',

  data () {
    return {
      items: null,
      dialog: false,
      validForm: true,
      ann: {
        'title': 'aaa',
        'content': 'aaa',
      },
      perm: false,
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.checkUser(this.getUsername());
      this.getAnn();
    },
    getAnn() {
      this.$http.get(`/api/ann/${this.$route.params.name}`)
        .then((res) => {
          // console.log(res);
          this.items = [];
          res.data.data.forEach(ele => {
            this.items.push({
              'annId': ele.annId,
              'title': ele.title,
              'author': ele.creator,
              'content': ele.markdown,
              'createdTime': this.timeFormat(ele.createTime),
              'lastUpdatedTime': this.timeFormat(ele.updateTime),
              'lastUpdater': ele.updater});
          })
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    cancel() {
      this.ann.title = '';
      this.ann.content = '';
      this.dialog = false;
    },
    post() {
      if ( this.$refs.form.validate() ) {
        this.$http.post(`${API_BASE_URL}/ann`, {'courseName': this.$route.params.name, 'title': this.ann.title, 'markdown': this.ann.content})
          .then((res) => {
            this.cancel();
          })
          .catch((err) => {
          });
      }
    },
    editAnn() {
      if ( this.$refs.form.validate() ) {
        this.$http.put(`/api/ann`, {'title': this.newTitle, 'markdown': this.newContent, 'annId': this.editing})
          .then((res) => {
            this.cancel();
            this.$router.to(0);
            // console.log(res);
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    },
    deleteAnn() {
      this.$http.delete(`/api/ann`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}, data: {'annId': this.editing}})
        .then((res) => {
          this.$router.push(`/course/${this.$route.params.name}/announcement`);
          // console.log(res);
        })
        .catch((err) => {
        });
    },
    checkUser(username) {
      this.$http.get(`/api/course/${this.$route.params.name}`)
        .then((res) => {
          var data = res.data.data;
          data.TAs.forEach(ele => {
            if ( ele.username === username ) {
              this.perm = true;
            }
          })
        })
        .catch((err) => {
        });
    },
    getUsername() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true ) {
          if ( payload.role <= 1 ) this.perm = true;
          return payload.username;
        }
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    timeFormat(time) {
      var tmp = new Date(time * 1000);
      var year = tmp.getFullYear();
      var month = '0' + (tmp.getMonth()+1);
      var date = '0' + tmp.getDate();
      var hour = '0' + tmp.getHours();
      var min = '0' + tmp.getMinutes();
      var sec = '0' + tmp.getSeconds();
      var time = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return time;
    },
  }
}
</script>

<style lang="css" scoped>
</style>