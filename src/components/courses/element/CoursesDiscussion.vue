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
        Postsed by <a>{{ item.author }}</a>, {{ item.createdTime }}.<br>
          <i>Last update on {{ item.lastUpdatedTime }}.</i>
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
          @click="pushNewComment(i,-1)"
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
                  @blur="checkTrim(msg.message) ? edit(msg.id,i,j,-1) : deletemsg(msg.id)"
                  v-model="msg.message"
                  no-resize
                  auto-grow
                  rows="1"
                  autofocus
                  :label="msg.message == '' ? 'Write some comment...' : ''"
                  :rules="[commentRules.required]"
                ></v-textarea>
              </v-list-item-content>
            </v-col>
            <!-- Show Message -->
            <v-col cols="10" class="pl-2" v-else>
              <v-list-item-content class="py-0">
                <vue-markdown>{{msg.message}}</vue-markdown>
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
          <!-- Subcomment -->
          <v-list-item
            v-for="(submsg, k) in msg.subcomment"
            :key="k"
          >
            <v-col cols="1" class="pa-0">
              <v-list-item-avatar class="ml-1">
                <v-img :src="submsg.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-title class="font-weight-medium text-center">{{submsg.name}}</v-list-item-title>
            </v-col>
            <!-- Edit SubMessage -->
            <v-col cols="10" class="pl-2" v-if="submsg.editing == true">
              <v-list-item-content class="py-0">
                <v-textarea
                  @keydown="inputHandler($event,i,j,k)"
                  @blur="checkTrim(submsg.message) ? edit(submsg.id,i,j,k) : deletemsg(submsg.id)"
                  v-model="submsg.message"
                  no-resize
                  auto-grow
                  rows="1"
                  autofocus
                  :label="submsg.message == '' ? 'Write some comment...' : ''"
                  :rules="[commentRules.required]"
                ></v-textarea>
              </v-list-item-content>
            </v-col>
            <!-- Show SubMessage -->
            <v-col cols="10" class="pl-2" v-else>
              <v-list-item-content class="py-0">
                <vue-markdown>{{submsg.message}}</vue-markdown>
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
                @blur="checkTrim(msg.message) ? edit(msg.id,i,j,-1) : deletemsg(msg.id)"
                v-model="msg.message"
                no-resize
                auto-grow
                rows="1"
                autofocus
                :label="msg.message == '' ? 'Write some comment...' : ''"
                :rules="[commentRules.required]"
              ></v-textarea>
            </v-list-item-content>
          </v-col>
          <!-- Show Message -->
          <v-col cols="10" class="pl-2" v-else>
            <v-list-item-content class="py-0">
              <vue-markdown>{{msg.message}}</vue-markdown>
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
        {
          title: 'Want to eat something...',
          content: 'kkk',
          author: 'fuji',
          createdTime: '2019/12/10 13:59',
          lastUpdatedTime: '2019/12/24 21:21',
          editing: false,
          comment: [
            {
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              name: '七大卡',
              message: '~~7 kcal~~',
              editing: false,
              subcomment: [
                {
                  avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
                  name: '八卡',
                  message: '8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal ',
                  editing: false,
                },
                {
                  avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
                  name: 'fuji',
                  message: '-43',
                  editing: false,
                },
                {
                  avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
                  name: '九大卡',
                  message: '9 kcal',
                  editing: false,
                },
              ]
            },
            {
              avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
              name: '七卡',
              message: 'fujiwara',
              subcomment: [
              ],
              editing: false,
            },
            {
              avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
              name: '七',
              message: '7',
              subcomment: [
                {
                  avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
                  name: '九大卡',
                  message: '9 kcal',
                  editing: false,
                },
              ],
              editing: false,
            },
            {
              avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
              name: '千花',
              message: 'chika',
              subcomment: [
              ],
              editing: false,
            },
          ]
        },
        {
          title: '**test** *test*',
          content: '- rrr',
          author: 'jkdf',
          createdTime: '2019/12/10 04:00',
          lastUpdatedTime: '2019/12/24 21:21',
          editing: false,
          comment: [
          ]
        }
      ],
    }
  },
  beforeMount() {
    this.init();
  },
  methods: {
    init() {
      // this.posts = [];
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
              'title': ele.title,
              'thread': [],
            });
          })
          this.init()
        })
        .catch((err) => {
          console.log(err);
        });
    },
    post() {
      this.$http.post(`${API_BASE_URL}/post`, {'course': this.$route.params.name, 'title': this.newPost.title, 'content': this.newPost.content, 'target_thread_id': undefined})
        .then((res) => {
          this.cancelDialog()
          this.init()
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reply(threadId) {
      this.$http.post(`${API_BASE_URL}/post`, {'course': undefined, 'title': this.newPost.title, 'content': this.newPost.content, 'target_thread_id': threadId})
        .then((res) => {
          this.init()
          // console.log(err);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    edit(threadId,i,j,k) {
      this.$http.put(`${API_BASE_URL}/post`, {'course': undefined, 'title': this.newPost.title, 'content':this.newPost.content, 'target_thread_id': threadId})
        .then((res) => {
          this.init()
          if(k === -1) this.posts[i].comment[j].editing = false
          else this.posts[i].comment[j].subcomment[k].editing = false
          // console.log(err);
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    deletemsg(threadId) {
      this.$http.delete(`${API_BASE_URL}/post`, {'course': undefined, 'title': this.newPost.title, 'content': this.newPost.content, 'target_thread_id': threadId})
        .then((res) => {
          this.init()
          // console.log(err);
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
            if(!this.posts[i].comment[j].subcomment[k].message.trim())
              this.deletemsg(this.posts[i].comment[j].subcomment[k].id)
            else edit(this.posts[i].comment[j].subcomment[k].id,i,j,k)
          }
          else {
            if(!this.posts[i].comment[j].message.trim())
              this.deletemsg(this.posts[i].comment[j].id)
            else edit(this.posts[i].comment[j].editing.id,i,j,k)
          }
        }
      }
    },
    optionMenu(idx,i,j,k) {
      if(k === -1) {
        if(idx === 0) this.pushNewComment(i,j)
        else if(idx === 1) this.posts[i].comment[j].editing = true
        else this.deletemsg(this.posts[i].comment[j].id)
      }
      else {
        if(idx === 1) this.posts[i].comment[j].subcomment[k].editing = true
        else this.deletemsg(this.posts[i].comment[j].subcomment[k].id)
      }
    },
    pushNewComment(i,j) {
      if(j === -1) this.reply(posts[i].id)
      else this.reply(this.posts[i].comment[j].id)
    }
  }
}
</script>

<style lang="css" scoped>
</style>