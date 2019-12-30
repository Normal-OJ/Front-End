<template>
  <v-row no-gutters justify="center">
    <v-card
      class="my-6 flex-column d-flex"
      elevation="6"
      width="50vw"
      v-for="(item, i) in posts"
      :key="i"
    >
      <v-card-subtitle>
        Postsed by <a>{{ item.author }}</a>, {{ item.created }}.<br>
          <i>Last update on {{ item.updated }}.</i>
          <v-btn icon right bottom @click="deletemsg(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-subtitle>
      <v-card-title class="headline ma-1 py-0">
        <vue-markdown>{{item.title}}</vue-markdown>
      </v-card-title>
      <v-card-title class="my-1 py-0 px-6">
        <vue-markdown>{{item.content}}</vue-markdown>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none subtitle-1"
          text
          outlined
          @click="reply(i)"
        >Comment</v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-list two-line expand class="pa-0" dense>
        <!-- Comments With Subcomment -->
        <v-list-group
          v-for="(msg, j) in item.comment"
          v-if="msg.subcomment.length !== 0"
          :key="j"
          no-action
          class="pt-1"
        >
          <template v-slot:activator> 
            <v-col cols="1" class="pa-0">
              <v-list-item-avatar class="ml-1">
                <v-img :src="msg.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-title class="font-weight-medium text-center">{{msg.name}}</v-list-item-title>
            </v-col>
            <!-- Edit Message -->
            <v-col cols="10" class="pl-2" v-if="msg.editing == true">
              <v-list-item-content class="py-0">
                <v-textarea
                  @keydown="inputHandler($event,i,j,-1)"
                  @blur="checkTrim(msg.content) ? edit(msg.id,i,j,-1) : deletemsg(msg.id)"
                  v-model="msg.content"
                  no-resize
                  auto-grow
                  rows="1"
                  autofocus
                  :label="msg.content == '' ? 'Write some comment...' : ''"
                  :rules="[commentRules.required]"
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
              <v-menu offset-x>
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
            <v-col cols="1" class="pa-0">
              <v-list-item-avatar class="ml-1">
                <v-img :src="submsg.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-title class="font-weight-medium text-center">{{submsg.name}}</v-list-item-title>
            </v-col>
            <!-- Edit Submessage -->
            <v-col cols="10" class="pl-2" v-if="submsg.editing == true">
              <v-list-item-content class="py-0">
                <v-textarea
                  @keydown="inputHandler($event,i,j,k)"
                  @blur="checkTrim(submsg.content) ? edit(submsg.id,i,j,k) : deletemsg(submsg.id)"
                  v-model="submsg.content"
                  no-resize
                  auto-grow
                  rows="1"
                  autofocus
                  :label="submsg.content == '' ? 'Write some comment...' : ''"
                  :rules="[commentRules.required]"
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
              <v-menu offset-x>
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
          <v-col cols="1" class="pa-0">
            <v-list-item-avatar class="ml-1">
              <v-img :src="msg.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-title class="font-weight-medium text-center">{{msg.name}}</v-list-item-title>
          </v-col>
          <!-- Edit Message -->
          <v-col cols="10" class="pl-2" v-if="msg.editing == true">
            <v-list-item-content class="py-0">
              <v-textarea
                @keydown="inputHandler($event,i,j,-1)"
                @blur="checkTrim(msg.content) ? edit(msg.id,i,j,-1) : deletemsg(msg.id)"
                v-model="msg.content"
                no-resize
                auto-grow
                rows="1"
                autofocus
                :label="msg.content == '' ? 'Write some comment...' : ''"
                :rules="[commentRules.required]"
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
            <v-menu offset-x>
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
    <v-dialog v-model="postDialog" :width="this.$vuetify.breakpoint.mdAndUp ? '80%' : '100%'" persistent>
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
          <v-form>
            <v-text-field
              label="Title"
              counter="64" 
              :rules="[v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters']" 
              v-model="newPost.title">
            </v-text-field>
            <v-textarea 
              label="Post Content" 
              :rules="[v => !!v || 'Sorry, the post content cannot be empty']"
              v-model="newPost.content"
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
      newPost: {
        'content': '',
        'title': ''
      },
      commentMenu: [
        'reply',
        'edit',
        'delete',
      ],
      commentRules: {
        required: v => !!v || 'The message will be delete if the field is blank'
      },
      posts: [
      ],
      id: '5e09e5419d06607b2fca2b5d',
    }
  },
  beforeMount() {
    this.init();
  },
  methods: {
    init() {
      this.posts = [];
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
          console.log(res)
          res.data.data.forEach(ele => {
            this.posts.push({
              'id': ele.thread.id,
              'title': ele.title,
              'author': ele.thread.author,
              'content': ele.thread.content,
              'created': this.timeFormat(ele.thread.created),
              'updated': this.timeFormat(ele.thread.updated),
              'reply': ele.thread.reply,
            });
          })
        })
        .catch((err) => {
          console.log(err);
        });
        console.log(this.posts);
    },
    post() {
      this.$http.post(`${API_BASE_URL}/post`, {'course': this.$route.params.name, 'title': this.newPost.title, 'content': this.newPost.content})
        .then((res) => {
          this.cancelDialog()
          this.init()
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reply(threadId) {
      console.log(threadId);
      this.$http.post(`${API_BASE_URL}/post`, {'content': this.newPost.content, 'target_thread_id': threadId})
        .then((res) => {
          this.init()
          // console.log(err);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    edit(threadId,i,j,k) {
      this.$http.put(`${API_BASE_URL}/post`, {'title': this.newPost.title, 'content':this.newPost.content, 'target_thread_id': threadId})
        .then((res) => {
          this.init()
          if(k === -1) this.posts[i].reply[j].editing = false
          else this.posts[i].reply[j].reply[k].editing = false
          // console.log(res);
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    deletemsg(threadId) {
      console.log(threadId);
      console.log(threadId);
      this.$http.delete(`${API_BASE_URL}/post`, {'target_thread_id': threadId})
        .then((res) => {
          this.init()
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelDialog() {
      this.newPost.title = ''
      this.newPost.content = ''
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
            if(!this.posts[i].reply[j].reply[k].content.trim())
              this.deletemsg(this.posts[i].reply[j].reply[k].id)
            else edit(this.posts[i].reply[j].reply[k].id,i,j,k)
          }
          else {
            if(!this.posts[i].reply[j].content.trim())
              this.deletemsg(this.posts[i].reply[j].id)
            else edit(this.posts[i].reply[j].editing.id,i,j,k)
          }
        }
      }
    },
    optionMenu(idx,i,j,k) {
      if(k === -1) {
        if(idx === 0) this.reply(this.posts[i].reply[j].id)
        else if(idx === 1) this.posts[i].reply[j].editing = true
        else this.deletemsg(this.posts[i].reply[j].id)
      }
      else {
        if(idx === 1) this.posts[i].reply[j].reply[k].editing = true
        else this.deletemsg(this.posts[i].reply[j].reply[k].id)
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>