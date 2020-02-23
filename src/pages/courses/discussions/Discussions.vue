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
import Creator from '@/components/courses/Creator';
import ShowPost from '@/components/courses/ShowPost';
const API_BASE_URL = '/api';

export default {

  name: 'Discussions',

  components: {
    Creator, ShowPost,
  },

  data () {
    return {
      // postDialog: false,
      dialog: false,
      type: 'New',
      validForm: false,
      items: [],
      post: {
        course: this.$route.params.name,
        title: '',
        content: '',
        targetThreadId: null,
      },
      perm: false,
      username: null,
    }
  },
  created() {
    this.getPosts();
    this.checkUser(this.getUsername());
  },
  methods: {
    getPosts() {
      this.$http.get(`${API_BASE_URL}/post/${this.$route.params.name}`)
        .then((res) => {
          console.log(res);
          this.items = [];
          res.data.data.forEach(ele => {
            if ( ele.thread.status !== 1 ) {
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
      this.post.course = this.$route.params.name;
      this.type = 'New';
      this.$refs.form.reset();
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
      this.post.course = null;
      this.post.title = this.items[idx].title;
      this.post.content = this.items[idx].content;
      this.post.targetThreadId = id;
      this.dialog = true;
    },
    deletePost(idx,id) {
      // console.log(id);
      this.post.targetThreadId = id;
      this.$http.delete(`${API_BASE_URL}/post`, {headers: {'Content-Type': 'application/json'}, data: {targetThreadId: this.post.targetThreadId}})
        .then((res) => {
          this.$router.go(0);
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // setTarget(i,j,k) {
    //   if(k !== -1){
    //     this.target.title = ''
    //     this.target.content = this.posts[i].reply[j].reply[k].content
    //     this.target.targetThreadId = this.posts[i].reply[j].reply[k].id
    //   }
    //   else if(j !== -1){
    //     this.target.title = ''
    //     this.target.content = this.posts[i].reply[j].content
    //     this.target.targetThreadId = this.posts[i].reply[j].id
    //   }
    //   else{
    //     this.target.title = this.posts[i].title
    //     this.target.content = this.posts[i].content
    //     this.target.targetThreadId = this.posts[i].id
    //   }
    // },
    // reply(i,j,k) {
    //   this.setTarget(i,j,-1);
    //   if(k !== -1) this.target.content = this.posts[i].reply[j].reply[k].content
    //   else this.target.targetThreadId = this.posts[i].id
    //   this.$http.post(`${API_BASE_URL}/post`, this.target)
    //     .then((res) => {
    //       this.init();
    //     })
    //     .catch((err) => {
    //       // console.log(err);
    //       this.snackbar = true;
    //     });
    // },
    // pushNewReply(i,j) {
    //   if(j === -1) this.posts[i].reply. push({'reply': [], 'content': '', 'editing': true})
    //   else this.posts[i].reply[j].reply.push({'content': '', 'editing': true})
    // },
    // edit(i,j,k) {
    //   this.setTarget(i,j,k);
    //   if(k === -1) this.posts[i].reply[j].editing = false
    //   else this.posts[i].reply[j].reply[k].editing = false
    //   this.$http.put(`${API_BASE_URL}/post`, this.target)
    //     .then((res) => {
    //       // console.log(res);
    //     })
    //     .catch((err) => {
    //       // console.log(err);
    //     });
    // },
    // deletemsg(i,j,k) {
    //   this.setTarget(i,j,k);
    //   this.$http.delete(`${API_BASE_URL}/post`, {headers: {'Content-Type': 'application/json'}, data: this.target})
    //     .then((res) => {
    //       this.init()
    //       // console.log(res);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // cancelDialog() {
    //   this.target.title = ''
    //   this.target.content = ''
    //   this.postDialog = false
    // },
    // checkTrim(str) {
    //   if(str.trim()) return true
    //   else return false
    // },
    // inputHandler(e,i,j,k) {
    //   if (e.keyCode === 13) {
    //     if(!e.shiftKey) {
    //       if(k !== -1) {
    //         if(!this.posts[i].reply[j].reply[k].content.trim()) this.deletemsg(i,j,k)
    //         else if(!this.posts[i].reply[j].reply[k].id) this.reply(i,j,k)
    //         else this.edit(i,j,k)
    //       }
    //       else {
    //         if(!this.posts[i].reply[j].content.trim()) this.deletemsg(i,j,k)
    //         else if(!this.posts[i].reply[j].id) this.reply(i,j,k)
    //         else this.edit(i,j,k)
    //       }
    //     }
    //   }
    // },
    // optionMenu(idx,i,j,k) {
    //   if(k === -1) {
    //     if(idx === 0) this.pushNewReply(i,j)
    //     else if(idx === 1) this.posts[i].reply[j].editing = true
    //     else this.deletemsg(i,j,k)
    //   }
    //   else {
    //     if(idx === 1) this.posts[i].reply[j].reply[k].editing = true
    //     else this.deletemsg(i,j,k)
    //   }
    // },
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