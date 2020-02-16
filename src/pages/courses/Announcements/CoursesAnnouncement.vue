<template>
  <div>
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

  name: 'CoursesAnnouncement',

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
      },
      perm: false,
    }
  },

  beforeMount() {
    this.getAnn();
    this.checkUser(this.getUsername());
    // console.log(this.perm);
  },

  methods: {
    getAnn() {
      this.$http.get(`/api/ann/${this.$route.params.name}/${this.$route.params.id}`)
        .then((res) => {
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
          });
        })
        .catch((err) => {
          // console.log(err);
        })
    },
    cancel() {
      this.editing = -1;
      this.type = 'New';
      this.$refs.form.reset();
      this.dialog = false;
    },
    post() {
      if ( this.$refs.form.validate() ) {
        // console.log(this.editing);
        if ( this.editing != -1 ) {
          this.$http.put('/api/ann', {'title': this.ann.title, 'markdown': this.ann.content, 'annId': this.editing})
            .then((res) => {
              this.cancel();
              this.$router.go(0);
            })
            .catch((err) => {
            });
        } else {
          this.$http.post('/api/ann', {'courseName': this.$route.params.name, 'title': this.ann.title, 'markdown': this.ann.content})
            .then((res) => {
              this.cancel();
              this.$router.go(0);
            })
            .catch((err) => {
            });
        }
      }
    },
    edit(idx, id) {
      this.editing = id;
      this.type = 'Update';
      this.ann.title = this.items[idx].title;
      this.ann.content = this.items[idx].content;
      this.dialog = true;
    },
    deleteAnn(idx, id) {
      this.$http.delete(`/api/ann`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}, data: {'annId': id}})
        .then((res) => {
          this.$router.go(0);
          // console.log(res);
        })
        .catch((err) => {
        });
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
    checkUser(username) {
      this.$http.get(`/api/course/${this.$route.params.name}`)
        .then((res) => {
          var data = res.data.data;
          data.TAs.forEach(ele => {
            if ( ele.username === username ) {
              this.perm = true;
              return;
            }
          })
        })
        .catch((err) => {
          console.log(err);
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
  }

}
</script>

<style lang="css" scoped>
</style>