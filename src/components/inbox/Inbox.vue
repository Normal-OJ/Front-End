<template>
  <v-row no-gutters>
    <v-col cols="2">
      <v-card tile outlined height="93vh">
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-btn color="primary" fab>
                <v-icon large>mdi-plus-thick</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Compose</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list nav>
          <v-list-item-group color="primary">
            <v-list-item 
              v-for="(item, i) in navbar"
              :key="i"
              dense
              @click="clear(i)"
            >
              <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card tile elevation="0" outlined height="93vh">
        <v-card tile height="92.5%">
          <v-card-title>
            <v-text-field
              outlined
              append-icon="mdi-magnify"
              label="Search author, subject ..."
              hide-details
              @click:append=""
            ></v-text-field>
          </v-card-title>
          <v-divider></v-divider>
          <v-list 
            two-line
            v-for="(item, i) in mail[displayfolder].folder"
            :key="i"
            class="pa-0"
          >
            <v-list-item @click="displaymail = i">
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{item.subject}}</v-list-item-title>
                <v-list-item-subtitle>{{item.sender}} - {{item.time}}</v-list-item-subtitle>
                <v-list-item-subtitle>{{item.content}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
        </v-card>
        <v-card tile elevation="0" height="7.5%">
          <v-pagination
            :length="2"
            v-model="page"
            v-if="displayfolder != -1"
          ></v-pagination>
        </v-card>
      </v-card>
    </v-col>
    <v-col cols="7" class="ma-0">
      <v-card tile outlined height="93vh">
        <v-card tile elevation="0" height="20%" class="pt-3 px-3">
          <v-list-item v-if="displaymail === -1"></v-list-item>
          <v-list-item v-else three-line>
            <v-list-item-avatar size="64px">
              <v-img :src="mail[displayfolder].folder[displaymail].avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].sender}}</v-list-item-title>
              <v-list-item-subtitle>From "Computer Programming II"</v-list-item-subtitle>
              <v-list-item-subtitle>{{mail[displayfolder].folder[displaymail].time}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <v-list-item-icon>
              <v-btn icon outlined>
                <v-icon>mdi-reply</v-icon>
              </v-btn>
              <v-btn icon outlined>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
        </v-card>
        <v-divider></v-divider>
        <v-card tile elevation="0" height="70%">
          <v-list-item v-if="displaymail === -1">
            <v-list-item-content>
              <v-icon x-large color="grey">mdi-email</v-icon>
              <v-list-item-subtitle class="text-center">Empty</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content class="ma-3">
              <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].subject}}</v-list-item-title>
              <v-list-item-subtitle class="black--text text-wrap">{{mail[displayfolder].folder[displaymail].content}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-divider></v-divider>
        <v-card tile elevation="0" height="10%">
          <v-list-item v-if="displaymail === -1"></v-list-item>
          <v-list-item v-else>
            <v-list-item-subtitle>Attachment</v-list-item-subtitle>
          </v-list-item>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {

  name: 'Inbox',

  data () {
    return {
      displayfolder: 0,
      displaymail: -1,
      page: 1,
    	navbar: [
    		{ icon: 'mdi-inbox', title: 'Inbox'},
    		{ icon: 'mdi-send', title: 'Sent'},
    		{ icon: 'mdi-file', title: 'Draft'},
    		{ icon: 'mdi-delete', title: 'Trash'}
    	],
      mail: [
        {
          // inbox
          folder: [
            { 
              sender: 'Uier',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              content: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/03/05 23:32'
            },
            { 
              sender: 'Kelly',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'test',
              content: '資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面',
              time: '2019/12/13 12:13'
            },
            { 
              sender: 'ysl',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'ooo',
              content: '0991234567890qwer tyuioasdfghjklzxcvbnm,098765edkdftgyhunfd6csxexbabiubcuibgfwvgurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguvurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguvurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguv',
              time: '2019/05/11 05:11'
            },
            { 
              sender: '黃欣欣',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              content: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/11/02 11:02'
            },
            { 
              sender: '臻臻',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              content: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/04/06 04:06'
            },
            { 
              sender: 'ooo',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              content: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/03/05 23:32'
            },
            
          ]
        },
        { // sent
          folder: [
            {
              sender: 'cpj',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'iiiiiiiiii',
              content: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/09/02 09:02'
            }
          ]
        },
        { //draft
          folder: [
          ]
        },
        { //trash
          folder: [
            {
              sender: 'ruei',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'iiiiiiiiii',
              content: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/11/08 11:08'
            }
          ]
        }
      ],
    }
  },
  methods: {
    clear(i) {
      this.displayfolder = i
      this.displaymail = -1
    },
  }
}
</script>

<style lang="css" scoped>
</style>