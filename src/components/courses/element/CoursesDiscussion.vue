<template>
  <v-row no-gutters justify="center">
    <v-card
      class="my-6 flex-column d-flex"
      elevation="6"
      width="50vw"
      v-for="(item, i) in post"
      :key="i"
    >
      <v-card-subtitle>
        Posted by <a>{{ item.author }}</a>, {{ item.createdTime }}.<br>
          <i>Last update on {{ item.lastUpdatedTime }}.</i>
      </v-card-subtitle>
      <v-card-title class="headline ma-1">
        <vue-markdown>{{item.title}}</vue-markdown>
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
            <v-col cols="10" class="pl-2" v-if="msg.editComment == true">
              <v-list-item-content class="py-0">
                <v-textarea
                  @keydown="inputHandler($event,i,j,-1)"
                  @blur="checkTrim(msg.message) ? msg.editComment = false : deleteComment(item.comment,j)"
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
            <v-col cols="10" class="pl-2" v-if="submsg.editComment == true">
              <v-list-item-content class="py-0">
                <v-textarea
                  @keydown="inputHandler($event,i,j,k)"
                  @blur="checkTrim(submsg.message) ? submsg.editComment = false : deleteComment(msg.subcomment,k)"
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
            <!-- SubMessage -->
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
          <v-col cols="10" class="pl-2" v-if="msg.editComment == true">
            <v-list-item-content class="py-0">
              <v-textarea
                @keydown="inputHandler($event,i,j,-1)"
                @blur="checkTrim(msg.message) ? msg.editComment = false : deleteComment(item.comment,j)"
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
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {

  name: 'CoursesDiscussion',

  components: {
    VueMarkdown,
  },

  data () {
    return {
      commentMenu: [
        'reply',
        'edit',
        'delete',
      ],
      commentRules: {
        required: v => !!v || 'The message will be delete if the field is blank'
      },
      post: [
        {
          title: 'Want to eat something...',
          author: 'fuji',
          createdTime: '2019/12/10 13:59',
          lastUpdatedTime: '2019/12/24 21:21',
          editComment: false,
          comment: [
            {
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              name: '七大卡',
              message: '~~7 kcal~~',
              editComment: false,
              subcomment: [
                {
                  avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
                  name: '八卡',
                  message: '8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal 8 cal ',
                  editComment: false,
                },
                {
                  avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
                  name: 'fuji',
                  message: '-43',
                  editComment: false,
                },
                {
                  avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
                  name: '九大卡',
                  message: '9 kcal',
                  editComment: false,
                },
              ]
            },
            {
              avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
              name: '七卡',
              message: 'fujiwara',
              subcomment: [
              ],
              editComment: false,
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
                  editComment: false,
                },
              ],
              editComment: false,
            },
            {
              avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
              name: '千花',
              message: 'chika',
              subcomment: [
              ],
              editComment: false,
            },
          ]
        },
        {
          title: '**test** *test*',
          author: 'jkdf',
          createdTime: '2019/12/10 04:00',
          lastUpdatedTime: '2019/12/24 21:21',
          editComment: false,
          comment: [
          ]
        }
      ],
    }
  },
  methods: {
    checkTrim(str) {
      if(str.trim()) return true
      else return false
    },
    deleteComment(arr,idx) {
      arr.splice(idx,1)
    },
    inputHandler(e,i,j,k) {
      if (e.keyCode === 13) {
        if(!e.shiftKey) {
          if(k !== -1) {
            console.log(this.post[i].comment[j].subcomment[k].message.trim())
            if(!this.post[i].comment[j].subcomment[k].message.trim())
              this.deleteComment(this.post[i].comment[j].subcomment,k)
            else this.post[i].comment[j].subcomment[k].editComment = false
          }
          else {
            if(!this.post[i].comment[j].message.trim()) this.deleteComment(this.post[i].comment,j)
            else this.post[i].comment[j].editComment = false
          }
          // this.editComment()
        }
      }
    },
    optionMenu(idx,i,j,k) {
      if(k === -1) {
        if(idx === 0) this.pushNewComment(i,j)
        else if(idx === 1) this.post[i].comment[j].editComment = true
        else this.deleteComment(this.post[i].comment,j)
      }
      else {
        if(idx === 1) this.post[i].comment[j].subcomment[k].editComment = true
        else this.deleteComment(this.post[i].comment[j].subcomment,k)
      }
    },
    pushNewComment(i,j) {
      if(j === -1) this.post[i].comment.push({'avatar': '', 'name': 'fuji', 'message': '', 'subcomment': [], 'editComment': true})
      else this.post[i].comment[j].subcomment.push({'avatar': '', 'name': 'fuji', 'message': '', 'subcomment': [], 'editComment': true})
    }
  }
}
</script>

<style lang="css" scoped>
</style>