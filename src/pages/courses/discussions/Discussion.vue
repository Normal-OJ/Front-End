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
    <Creator v-if="perm" v-model="dialog" :type="type" title="Discussion" @cancel="cancel" @post="submit" noActivator>
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
      @edit="edit" @delete="deletePost" 
    ></ShowPost>
    <v-row justify="center">
      <v-card :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'" elevation="0" style="background: transparent;">
        <ui-button
          v-if="items && items.length > 0"
          color="white"
          @click.native="focus = !focus"
        >
          <template slot="content"><v-icon class="mr-1">mdi-comment</v-icon>Comment</template>
        </ui-button>
      </v-card>
    </v-row>
    <div v-if="items" v-for="item in items">
      <ShowReply :items="item.reply" :focus="focus" @newComment="newComment" @editComment="editComment">
      </ShowReply>
    </div>
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
import Creator from '@/components/courses/Creator';
import ShowPost from '@/components/courses/ShowPost';
import ShowReply from '@/components/courses/ShowReply';
const API_BASE_URL = '/api';

export default {

  name: 'Discussion',

  components: {
    Creator, ShowPost, ShowReply,
  },

  data () {
    return {
      // postDialog: false,
      dialog: false,
      type: 'New',
      validForm: false,
      items: [],
      post: {
        title: '',
        content: '',
        targetThreadId: null,
      },
      perm: false,
      username: null,
      focus: false,
      snackbar: false,
      alert: {
        color: '',
        msg: '',
      },
    }
  },
  created() {
    // this.init();
    this.getPost();
    this.checkUser(this.getUsername());
  },
  methods: {
    getPost() {
      this.$http.get(`${API_BASE_URL}/post/view/${this.$route.params.name}/${this.$route.params.id}`)
        .then((res) => {
          this.items = [];
          res.data.data.forEach(ele => {
            if ( ele.thread.status != 1 ) {
              this.items.push({
                'postId': ele.thread.id,
                'title': ele.title,
                'status': ele.status,
                'author': ele.thread.author,
                'content': ele.thread.content,
                'createdTime': this.timeFormat(ele.thread.created),
                'updated': this.timeFormat(ele.thread.updated),
                'reply': ele.thread.reply,
              });
            } 
          })
          this.items.reverse();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {
      this.post.targetThreadId = null;
      this.dialog = false;
    },
    submit() {
      if(this.$refs.form.validate()) {
        if ( this.post.targetThreadId ) {
          this.$http.put(`${API_BASE_URL}/post`, this.post)
            .then((res) => {
              this.cancel()
              this.$router.go(0);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$http.post(`${API_BASE_URL}/post`, this.post)
            .then((res) => {
              this.cancel()
              this.$router.go(0);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    edit(idx, id) {
      this.type = 'Update';
      this.post.title = this.items[idx].title;
      this.post.content = this.items[idx].content;
      this.post.targetThreadId = id;
      this.dialog = true;
    },
    deletePost(idx,id) {
      console.log(id);
      this.post.targetThreadId = id;
      this.$http.delete(`${API_BASE_URL}/post`, {headers: {'Content-Type': 'application/json'}, data: {targetThreadId: id}})
        .then((res) => {
          this.$router.push(`/course/${this.$route.params.name}/discussions`);
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    newComment(id, content) {
      this.$http.post(`${API_BASE_URL}/post`, {targetThreadId: id, content: content})
        .then((res) => {
          // console.log(res);
          this.$router.go(0);
        })
        .catch((err) => {
          this.snackbar = false;
          this.alert = {
            color: 'secondary',
            msg: err.response.data.message,
          }
          this.snackbar = true;
        })
    },
    editComment(id, content) {
      this.$http.put(`${API_BASE_URL}/post`, {targetThreadId: id, content: content})
        .then((res) => {
          // console.log(res);
          this.$router.go(0);
        })
        .catch((err) => {
          this.snackbar = false;
          this.alert = {
            color: 'secondary',
            msg: err.response.data.message,
          }
          this.snackbar = true;
        })
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
    getAvatar(payload) {
      var d = encodeURI("noj.tw/defaultAvatar.png");
      return `https://www.gravatar.com/avatar/${payload}?d=${d}`;
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
          this.username = payload.username;
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