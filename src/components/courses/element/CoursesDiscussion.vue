<template>
  <v-row no-gutters justify="center">
    <v-card
      class="my-6 flex-column d-flex"
      elevation="6"
      width="70vw"
      v-for="(item, i) in posts"
      :key="i"
    >
      <v-card-subtitle>
        Postsed by <a>{{ item.author }}</a>, {{ item.created }}.<br>
          <i>Last update on {{ item.updated }}.</i>
          <v-btn icon right bottom @click="deletemsg(i,-1,-1)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-subtitle>
      <v-card-title class="display-2 font-weight-bold">{{item.title}}</v-card-title>
      <v-card-text class="black--text"><vue-markdown :source="item.content"></vue-markdown></v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          class="text-none subtitle-1"
          text
          outlined
          @click="pushNewReply(i,-1)"
        >Comment</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-divider></v-divider>
      <v-list two-line expand class="pa-0" dense>
        <!-- Comments With Subcomment -->
        <v-list-group
          v-for="(msg, j) in item.reply"
          v-if="msg.reply.length !== 0"
          :key="j"
          no-action
          class="pt-1"
        >
          <template v-slot:activator> 
            <v-col cols="1" class="pa-1">
              <v-row no-gutters justify="center">
                <v-list-item-avatar class="mx-6">
                  <v-img :src="msg.avatar"></v-img>
                </v-list-item-avatar>
              </v-row>
              <v-list-item-title class="font-weight-medium text-center">{{msg.author}}</v-list-item-title>
            </v-col>
            <!-- Edit Message -->
            <v-col cols="10" class="pl-2" v-if="msg.editing == true">
              <v-list-item-content class="py-0">
                  <!-- @blur="checkTrim(msg.content) ? edit(i,j,-1) : deletemsg(i,j,-1)" -->
                <v-textarea
                  @keydown="inputHandler($event,i,j,-1)"
                  @blur="checkTrim(msg.content) && deletemsg(i,j,-1)"
                  v-model="msg.content"
                  no-resize
                  auto-grow
                  rows="1"
                  autofocus
                  :label="msg.content == '' ? 'Write some comment...' : ''"
                  :rules="commentRules"
                ></v-textarea>
              </v-list-item-content>
            </v-col>
            <!-- Show Message -->
            <v-col cols="10" class="pl-2" v-else>
              <v-list-item-content class="py-0">
                <vue-markdown>{{msg.content}}</vue-markdown>
              </v-list-item-content>
            </v-col>
            <!-- More Option Menu -->
            <v-col cols="1">
              <v-menu v-if="perm || msg.author === username" offset-x>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, idx) in commentMenu"
                    :key="idx"
                    @click="optionMenu(idx,i,j,-1)"
                  >
                    <v-list-item-title>{{item}}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </template>
          <!-- Submessage -->
          <v-list-item
            v-for="(submsg, k) in msg.reply"
            :key="k"
          >
            <v-col cols="1" class="pa-1">
              <v-row no-gutters justify="center">
                <v-list-item-avatar class="mx-6">
                  <v-img :src="submsg.avatar"></v-img>
                </v-list-item-avatar>
              </v-row>
              <v-list-item-title class="font-weight-medium text-center">{{submsg.author}}</v-list-item-title>
            </v-col>
            <!-- Edit Submessage -->
            <v-col cols="10" class="pl-2" v-if="submsg.editing == true">
              <v-list-item-content class="py-0">
                  <!-- @blur="checkTrim(submsg.content) ? edit(i,j,k) : deletemsg(i,j,k)" -->
                <v-textarea
                  @keydown="inputHandler($event,i,j,k)"
                  @blur="checkTrim(msg.content) && deletemsg(i,j,k)"
                  v-model="submsg.content"
                  no-resize
                  auto-grow
                  rows="1"
                  autofocus
                  :label="submsg.content == '' ? 'Write some comment...' : ''"
                  :rules="commentRules"
                ></v-textarea>
              </v-list-item-content>
            </v-col>
            <!-- Show Submessage -->
            <v-col cols="10" class="pl-2" v-else>
              <v-list-item-content class="py-0">
                <vue-markdown>{{submsg.content}}</vue-markdown>
              </v-list-item-content>
            </v-col>
            <!-- More Option Menu -->
            <v-col cols="1">
              <v-menu v-if="perm || msg.author === username" offset-x>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, idx) in commentMenu"
                    :key="idx"
                    @click="optionMenu(idx,i,j,k)"
                    v-if="idx != 0"
                  >
                    <v-list-item-title>{{item}}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-list-item>
        </v-list-group>
        <!-- Comments Without Subcomment -->
        <v-list-item v-else class="pt-1">
          <v-col cols="1" class="pa-1">
            <v-row no-gutters justify="center">
              <v-list-item-avatar class="mx-6">
                <v-img :src="msg.avatar"></v-img>
              </v-list-item-avatar>
            </v-row>
            <v-list-item-title class="font-weight-medium text-center">{{msg.author}}</v-list-item-title>
          </v-col>
          <!-- Edit Message -->
          <v-col cols="10" class="pl-2" v-if="msg.editing == true">
            <v-list-item-content class="py-0">
                <!-- @blur="checkTrim(msg.content) ? edit(i,j,-1) : deletemsg(i,j,-1)" -->
              <v-textarea
                @keydown="inputHandler($event,i,j,-1)"
                @blur="checkTrim(msg.content) && deletemsg(i,j,-1)"
                v-model="msg.content"
                no-resize
                auto-grow
                rows="1"
                autofocus
                :label="msg.content == '' ? 'Write some comment...' : ''"
                :rules="commentRules"
              ></v-textarea>
            </v-list-item-content>
          </v-col>
          <!-- Show Message -->
          <v-col cols="10" class="pl-2" v-else>
            <v-list-item-content class="py-0">
              <vue-markdown>{{msg.content}}</vue-markdown>
            </v-list-item-content>
          </v-col>
          <!-- More Option Menu -->
          <v-col cols="1">
            <v-menu v-if="perm || msg.author === username" offset-x>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, idx) in commentMenu"
                  :key="idx"
                  @click="optionMenu(idx,i,j,-1)"
                >
                  <v-list-item-title>{{item}}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-list-item>
      </v-list>
    </v-card>
    <!-- New Post Form -->
    <v-dialog v-if="perm" v-model="postDialog" :width="this.$vuetify.breakpoint.mdAndUp ? '80%' : '100%'" persistent>
      <template v-slot:activator="{ on }">
        <v-btn right bottom fixed color="primary" fab v-on="on">
          <v-icon large>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="subtitle-1">New Post</div>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn tile icon @click="cancelDialog()" v-on="on"><v-icon>mdi-close</v-icon></v-btn>
            </template>
            <span>close</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text class="mt-2">
          <v-form v-model="validForm" ref="form">
            <v-text-field
              label="Title"
              counter="64" 
              :rules="titleRules" 
              v-model="target.title">
            </v-text-field>
            <v-textarea 
              label="Post Content" 
              :rules="contentRules"
              v-model="target.content"
              no-resize
              auto-grow
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="secondary" @click="cancelDialog()">cancel</v-btn>
          <v-btn dark color="primary" @click="post()">post</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" left>
      This Comment or Post you replied has deleted.
      <v-btn
        color="pink"
        text
        @click="snackbar = false"
      >Close</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'
const API_BASE_URL = '/api';

export default {

  name: 'CoursesDiscussion',

  components: {
    VueMarkdown,
  },

  data () {
    return {
      postDialog: false,
      validForm: false,
      target: {
        'title': '',
        'content': '',
        'targetThreadId': ''
      },
      commentMenu: [
        'reply',
        'edit',
        'delete',
      ],
      commentRules: [
        // v => !!v || 'The message will be delete if the field is blank'
      ],
      titleRules: [
        v => !!v || 'Title is required.',
        v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters',
      ],
      contentRules: [
        v => !!v || 'Content is required.',
        v => !!v && v.length <= 100000 || 'Sorry, the length must be ≤ 100000 characters',
      ],
      posts: [],
      perm: false,
      username: '',
      snackbar: false,
    }
  },
  beforeMount() {
    this.init();
    this.checkUser(this.getUsername());
  },
  methods: {
    init() {
      this.posts = [];
      this.target = {'title': '', 'content': '', 'targetThreadId': ''};
      this.getPosts();
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
    getPosts() {
      this.$http.get(`${API_BASE_URL}/post/${this.$route.params.name}`)
        .then((res) => {
          res.data.data.forEach(ele => {
            console.log(ele);
            ele.thread.reply.forEach(rpl => {
              rpl.created = this.timeFormat(rpl.created);
              rpl.updated = this.timeFormat(rpl.updated);
              rpl.avatar = this.getAvatar(rpl.author.md5);
              rpl.author = rpl.author.username;
              rpl.reply.forEach(nestRpl => {
                nestRpl.created = this.timeFormat(nestRpl.created);
                nestRpl.updated = this.timeFormat(nestRpl.updated);
                nestRpl.avatar = this.getAvatar(nestRpl.author.md5);
                nestRpl.author = nestRpl.author.username;
              })
            })
            this.posts.push({
              'id': ele.thread.id,
              'title': ele.title,
              'author': ele.thread.author.username,
              'content': ele.thread.content,
              'created': this.timeFormat(ele.thread.created),
              'updated': this.timeFormat(ele.thread.updated),
              'reply': ele.thread.reply,
              'editing': false
            });
          })
          this.posts.reverse();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    post() {
      if(this.$refs.form.validate()) {
        this.$http.post(`${API_BASE_URL}/post`, {'course': this.$route.params.name, 'title': this.target.title, 'content': this.target.content})
          .then((res) => {
            this.cancelDialog()
            this.init()
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    setTarget(i,j,k) {
      if(k !== -1){
        this.target.title = ''
        this.target.content = this.posts[i].reply[j].reply[k].content
        this.target.targetThreadId = this.posts[i].reply[j].reply[k].id
      }
      else if(j !== -1){
        this.target.title = ''
        this.target.content = this.posts[i].reply[j].content
        this.target.targetThreadId = this.posts[i].reply[j].id
      }
      else{
        this.target.title = this.posts[i].title
        this.target.content = this.posts[i].content
        this.target.targetThreadId = this.posts[i].id
      }
    },
    reply(i,j,k) {
      this.setTarget(i,j,-1);
      if(k !== -1) this.target.content = this.posts[i].reply[j].reply[k].content
      else this.target.targetThreadId = this.posts[i].id
      this.$http.post(`${API_BASE_URL}/post`, this.target)
        .then((res) => {
          this.init();
        })
        .catch((err) => {
          // console.log(err);
          this.snackbar = true;
        });
    },
    pushNewReply(i,j) {
      if(j === -1) this.posts[i].reply. push({'reply': [], 'content': '', 'editing': true})
      else this.posts[i].reply[j].reply.push({'content': '', 'editing': true})
    },
    edit(i,j,k) {
      this.setTarget(i,j,k);
      if(k === -1) this.posts[i].reply[j].editing = false
      else this.posts[i].reply[j].reply[k].editing = false
      this.$http.put(`${API_BASE_URL}/post`, this.target)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    deletemsg(i,j,k) {
      this.setTarget(i,j,k);
      this.$http.delete(`${API_BASE_URL}/post`, {headers: {'Content-Type': 'application/json'}, data: this.target})
        .then((res) => {
          this.init()
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelDialog() {
      this.target.title = ''
      this.target.content = ''
      this.postDialog = false
    },
    checkTrim(str) {
      if(str.trim()) return true
      else return false
    },
    inputHandler(e,i,j,k) {
      if (e.keyCode === 13) {
        if(!e.shiftKey) {
          if(k !== -1) {
            if(!this.posts[i].reply[j].reply[k].content.trim()) this.deletemsg(i,j,k)
            else if(!this.posts[i].reply[j].reply[k].id) this.reply(i,j,k)
            else this.edit(i,j,k)
          }
          else {
            if(!this.posts[i].reply[j].content.trim()) this.deletemsg(i,j,k)
            else if(!this.posts[i].reply[j].id) this.reply(i,j,k)
            else this.edit(i,j,k)
          }
        }
      }
    },
    optionMenu(idx,i,j,k) {
      if(k === -1) {
        if(idx === 0) this.pushNewReply(i,j)
        else if(idx === 1) this.posts[i].reply[j].editing = true
        else this.deletemsg(i,j,k)
      }
      else {
        if(idx === 1) this.posts[i].reply[j].reply[k].editing = true
        else this.deletemsg(i,j,k)
      }
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