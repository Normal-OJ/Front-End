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
      <v-divider></v-divider>
      <!-- Comment -->
      <v-list two-line expand>
        <v-list-group
          v-for="(msg, j) in item.comment"
          :key="j"
          no-action
        >
          <template v-slot:activator>
            <v-col cols="1" class="pa-0">
              <v-avatar>
                <v-img :src="msg.avatar"></v-img>
              </v-avatar>
              <v-list-item-title class="font-weight-medium">{{msg.name}}</v-list-item-title>
            </v-col>
            <!-- Edit Message -->
            <v-col cols="9" class="pl-2" v-if="msg.editComment == true">
              <v-list-item-content class="py-0">
                <v-textarea
                  @keydown="inputHandler($event,i,j,-1)"
                  @blur="msg.editComment = false"
                  v-model="msg.message"
                  no-resize
                  auto-grow
                  rows="1"
                ></v-textarea>
              </v-list-item-content>
            </v-col>
            <v-col cols="9" class="pl-2" v-else>
              <v-list-item-content class="py-0">
                <vue-markdown>{{msg.message}}</vue-markdown>
              </v-list-item-content>
            </v-col>
            <!-- More Option Menu -->
<!--             <v-col cols="1">
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
                    @click="msg.editComment = true"
                  >
                    <v-list-item-title>{{item}}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col> -->
          </template>
          <!-- Subcomment -->
          <v-list-item
            v-for="(submsg, k) in msg.subcomment"
            :key="k"
          >
            <v-divider></v-divider>

            <v-col cols="1" class="pa-0">
              <v-avatar>
                <v-img :src="submsg.avatar"></v-img>
              </v-avatar>
              <v-list-item-title class="font-weight-medium">{{submsg.name}}</v-list-item-title>
            </v-col>
            <!-- Edit SubMessage -->
            <v-col cols="10" class="pl-2" v-if="submsg.editComment == true">
              <v-list-item-content class="py-0">
                <v-textarea
                  @keydown="inputHandler($event,i,j,k)"
                  @blur="submsg.editComment = false"
                  v-model="submsg.message"
                  no-resize
                  auto-grow
                  rows="1"
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
                    @click="submsg.editComment = true"
                  >
                    <v-list-item-title>{{item}}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-list-item>
        </v-list-group>
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
      newComment: '',
      newSubComment: '',
      commentMenu: [
        'edit',
        'delete',
      ],
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
              ]
            }
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
    inputHandler(e,i,j,k) {
      if (e.keyCode === 13) {
        if(!e.shiftKey) {
          if(k != -1) this.post[i].comment[j].subcomment[k].editComment = false;
          else this.post[i].comment[j].editComment = false;
          // this.editComment()
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>