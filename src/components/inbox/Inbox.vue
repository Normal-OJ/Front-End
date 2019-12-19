<template>
  <v-row no-gutters>
    <v-col cols="2" class="hidden-sm-and-down">
      <v-card tile outlined height="93vh">
        <v-row justify="center" align="center"><v-col cols="4" class="pl-6">
          <v-dialog v-model="composeDialog" scrollable width="80%">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" fab v-on="on" small>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-toolbar color="primary" dark dense>
                <div class="subtitle-1">New mail</div>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn tile icon @click="ResetNewmail()" v-on="on"><v-icon>mdi-close</v-icon></v-btn>
                  </template>
                  <span>close</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text class="mt-2">
                <v-text-field label="To" required></v-text-field>
                <v-text-field label="Subject" required counter="32" :rules="titleRule" v-model="draftSubject"
                ></v-text-field>
                <v-textarea label="Message" v-model="draftMessage"></v-textarea>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-card-actions>
                    <v-btn outlined color="primary" @click="ResetNewmail()">cancel</v-btn>
                    <v-btn dark color="primary" @click="composeDialog = false">send</v-btn>
                  </v-card-actions>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog></v-col>
          <v-col><div class="subtitle-1">Compose</div></v-col>
        </v-row>
        <v-divider></v-divider>
        <v-list nav>
          <v-list-item-group color="primary">
            <v-list-item 
              v-for="(item, i) in navbar"
              :key="i"
              dense
              @click="Clear(i)"
            >
              <v-list-item-icon><v-icon>{{item.icon}}</v-icon></v-list-item-icon>
              <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-slide-x-reverse-transition><v-card tile elevation="0" outlined v-if="showMail && displaymail !== -1" height="93vh" class="hidden-md-and-up">
        <v-card tile elevation="0" height="25%" class="pt-3 px-3">
          <v-card-title class="pa-0">
            <v-btn icon @click="showMail = false"><v-icon large>mdi-chevron-left</v-icon></v-btn>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-list-item two-line>
            <v-list-item-avatar size="64px">
              <v-img :src="mail[displayfolder].folder[displaymail].avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].sender}}</v-list-item-title>
              <v-list-item-subtitle>{{mail[displayfolder].folder[displaymail].timestamp}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-btn class="ma-1" icon outlined v-if="displayfolder === 0"><v-icon @click="Reply(displayfolder,displaymail)">mdi-reply</v-icon></v-btn>
            <v-btn class="ma-1" icon outlined @click="Remove(displayfolder,displaymail)"><v-icon>mdi-delete</v-icon></v-btn>
          </v-list-item>
        </v-card>
        <v-divider></v-divider>
        <v-card tile elevation="0" height="60%" class="overflow-y-auto">
          <v-list-item v-if="displaymail === -1">
            <v-list-item-content>
              <v-icon x-large color="grey">mdi-email</v-icon>
              <v-list-item-subtitle class="text-center">Empty</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content class="ma-3">
              {{displaymail}}
              <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].subject}}</v-list-item-title>
              <vue-markdown>{{mail[displayfolder].folder[displaymail].message}}</vue-markdown>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-divider></v-divider>
        <!-- <v-card tile elevation="0" height="5%">
          <v-list-item v-if="displaymail === -1"></v-list-item>
          <v-list-item v-else>
            <v-list-item-subtitle>Attachment</v-list-item-subtitle>
          </v-list-item>
        </v-card>-->
      </v-card></v-slide-x-reverse-transition>
      <v-card tile elevation="0" outlined height="93vh" v-if="ShowMailSet()" class="overflow-y-auto">
        <v-card-title fixed>
          <v-text-field
            outlined
            append-icon="mdi-magnify"
            label="Search author, subject ..."
            hide-details
            @click:append=""
          ></v-text-field>
        </v-card-title>
        <v-divider></v-divider>
        <v-container style="max-height: 100%;" class="overflow-x-auto pa-0">
          <v-list style="width: 100%;" class="pa-0"><v-list-item-group>
            <v-list-item 
              two-line
              v-for="(item, i) in mail[displayfolder].folder"
              :key="item.time"
            >
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content v-if="item.status === 1 && displayfolder === 0" class="font-weight-bold" @click="Click(i)">
                <v-list-item-title>{{item.subject}}</v-list-item-title>
                <v-list-item-subtitle>{{item.sender}} - {{item.timestamp}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content v-else @click="Click(i)">
                <v-list-item-title>{{item.subject}}</v-list-item-title>
                <v-list-item-subtitle>{{item.sender}} - {{item.timestamp}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-btn icon color="primary" x-small  v-if="displayfolder === 0" @click="Read(displayfolder,i)">
                <v-icon size="1" v-if="item.status === 1" >mdi-checkbox-blank-circle</v-icon>
                <v-icon size="1" v-else>mdi-checkbox-blank-circle-outline</v-icon>
              </v-btn>
            </v-list-item></v-list-item-group>
          </v-list>
        </v-container>
      </v-card>
      <v-btn left bottom fixed fab class="text-center hidden-md-and-up" color="primary" @click="composeDialog = true" v-if="!showMail">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-speed-dial right fixed bottom v-model="speedDial" class="hidden-md-and-up" v-if="!showMail">
        <template v-slot:activator>
          <v-btn v-model="speedDial" color="primary" dark fab>
            <v-icon v-if="speedDial">mdi-close</v-icon>
            <v-icon v-else>mdi-folder-open</v-icon>
          </v-btn>
        </template>
        <v-btn fab small color="grey--text" @click="Clear(1)">
          <v-icon>mdi-send</v-icon>
        </v-btn>
        <v-btn fab small color="grey--text" @click="Clear(0)">
          <v-icon>mdi-inbox</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-col>
    <v-col cols="7" class="ma-0 hidden-sm-and-down">
      <v-card tile outlined height="93vh">
        <v-card tile elevation="0" height="20%" class="pt-3 px-3">
          <v-list-item v-if="displaymail === -1"></v-list-item>
          <v-list-item v-else two-line>
            <v-list-item-avatar size="64px">
              <v-img :src="mail[displayfolder].folder[displaymail].avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].sender}}</v-list-item-title>
              <v-list-item-subtitle>{{mail[displayfolder].folder[displaymail].timestamp}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <v-tooltip bottom v-if="displayfolder != 1">
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined v-on="on">
                  <v-icon @click="Reply(displayfolder,displaymail)">mdi-reply</v-icon>
                </v-btn>
              </template>
              <span>reply</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined v-on="on" @click="Remove(displayfolder,displaymail)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>delete</span>
            </v-tooltip>
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
              <vue-markdown>{{mail[displayfolder].folder[displaymail].message}}</vue-markdown>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-divider></v-divider>
        <!-- <v-card tile elevation="0" height="10%">
          <v-list-item v-if="displaymail === -1"></v-list-item>
          <v-list-item v-else>
            <v-list-item-subtitle>Attachment</v-list-item-subtitle>
          </v-list-item>
        </v-card> -->
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {

  name: 'Inbox',

  data () {
    return {
      draftSentTo: '',
      draftSubject: '',
      draftMessage: '',
      composeDialog: false,
      showMail: false,
      displayfolder: 0,
      displaymail: -1,
      speedDial: false,
    	navbar: [
    		{ icon: 'mdi-inbox', title: 'Inbox'},
    		{ icon: 'mdi-send', title: 'Sent'},
    	],
      titleRule: [
        val => val.length <= 32 || 'Sorry, the length must be ≤ 32 characters',
      ],
      mail: [
        {
          // inbox
          folder: [
            { 
              status: 1,
              sender: 'Uier',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: '**As** title, u! ~~As~~ title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903052332
            },
            { 
              status: 1,
              sender: 'Kelly',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'test',
              message: '資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面',
              timestamp: 201912131213
            },
            { 
              status: 1,
              sender: 'ysl',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '測',
              message: '0991234567890qwer tyuioasdfghjklzxcvbnm,098765edkdftgyhunfd6csxexbabiubcuibgfwvgurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguvurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguvurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguv',
              timestamp: 201905110511
            },
            { 
              status: 1,
              sender: '黃欣欣',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201911021102
            },
            { 
              status: 1,
              sender: '臻臻',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201904060406
            },
            { 
              status: 1,
              sender: 'Ku Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903080309
            },
            { 
              status: 1,
              sender: 'Ku Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903080312
            },
            { 
              status: 1,
              sender: 'Ku Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903080008
            },
            { 
              status: 1,
              sender: 'Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903088808
            },
            { 
              status: 1,
              sender: '黃欣欣',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知通知通知通知通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201910021102
            },
          ]
        },
        { // sent
          folder: [
            {
              status: 1,
              sender: 'cpj',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'iiiiiiiiii',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201909020902
            }
          ]
        }
      ],
    }
  },
  methods: {
    ShowMailSet() {
      if(this.$vuetify.breakpoint.mdAndUp) return true;
      else if(!this.showMail) return true;
      else return false;
    },
    Click(i) {
      this.showMail = true
      this.displaymail = i
      this.mail[this.displayfolder].folder[i].status = 0
    },
    Clear(i) {
      this.showMail = false
      this.displayfolder = i
      this.displaymail = -1
    },
    Remove(f,idx) {
      this.mail[f].folder.splice(idx, 1)
      if(idx === this.mail[f].folder.length) {
        this.displaymail--
      }
    },
    ResetNewmail() {
      this.draftSentTo = ''
      this.draftSubject = ''
      this.draftMessage = ''
      this.composeDialog = false
    },
    Reply(f,m) {
      this.draftSentTo = this.mail[f].folder[m].sender
      this.draftSubject = 'Re: ' + this.mail[f].folder[m].subject
      this.composeDialog = true
    },
    Read(f,idx) {
      if(this.mail[f].folder[idx].status === 1) {
        this.mail[f].folder[idx].status = 0
      }
      else this.mail[f].folder[idx].status = 1
    }
  },
  components: {
    VueMarkdown
  },
}
</script>

<style lang="css" scoped>
</style>