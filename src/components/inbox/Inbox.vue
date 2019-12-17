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
              <v-card-text>
                <v-text-field label="To" required hint="enter an username" v-model="draftSentTo"></v-text-field>
                <v-text-field label="Subject" required v-model="draftSubject"></v-text-field>
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
      <v-card tile elevation="0" outlined height="93vh">
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
          :key="item.time"
          class="pa-0"
        >
          <v-list-item @click="Click(i)">
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
        <v-dialog v-model="contentDialog" id="dialog">
          <v-card height="80vh">
            <v-list-item three-line>
              <!-- <v-list-item-avatar size="64px">
                <v-img :src="mail[displayfolder].folder[displaymail].avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].sender}}</v-list-item-title>
                <v-list-item-subtitle>{{mail[displayfolder].folder[displaymail].time}}</v-list-item-subtitle>
              </v-list-item-content> -->
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
        </v-dialog>
        <v-btn left bottom fixed fab class="text-center hidden-md-and-up" color="primary" @click="composeDialog = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-speed-dial right fixed bottom v-model="speedDial" class="hidden-md-and-up">
          <template v-slot:activator>
            <v-btn v-model="speedDial" color="primary" dark fab>
              <v-icon v-if="speedDial">mdi-close</v-icon>
              <v-icon v-else>mdi-folder-open</v-icon>
            </v-btn>
          </template>
          <v-btn fab small color="grey--text" @click="displayfolder = 1">
            <v-icon>mdi-send</v-icon>
          </v-btn>
          <v-btn fab small color="grey--text" @click="displayfolder = 0">
            <v-icon>mdi-inbox</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-card>
    </v-col>
    <v-col cols="7" class="ma-0 hidden-sm-and-down">
      <v-card tile outlined height="93vh">
        <v-card tile elevation="0" height="20%" class="pt-3 px-3">
          <v-list-item v-if="displaymail === -1"></v-list-item>
          <v-list-item v-else three-line>
            <v-list-item-avatar size="64px">
              <v-img :src="mail[displayfolder].folder[displaymail].avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].sender}}</v-list-item-title>
              <v-list-item-subtitle>{{mail[displayfolder].folder[displaymail].time}}</v-list-item-subtitle>
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
              <v-list-item-subtitle class="black--text text-wrap">{{mail[displayfolder].folder[displaymail].message}}</v-list-item-subtitle>
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
      draftSentTo: '',
      draftSubject: '',
      draftMessage: '',
      composeDialog: false,
      contentDialog: false,
      displayfolder: 0,
      displaymail: -1,
      speedDial: false,
    	navbar: [
    		{ icon: 'mdi-inbox', title: 'Inbox'},
    		{ icon: 'mdi-send', title: 'Sent'},
    	],
      mail: [
        {
          // inbox
          folder: [
            { 
              sender: 'Uier',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/03/05 23:32'
            },
            { 
              sender: 'Kelly',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'test',
              message: '資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面',
              time: '2019/12/13 12:13'
            },
            { 
              sender: 'ysl',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'ooo',
              message: '0991234567890qwer tyuioasdfghjklzxcvbnm,098765edkdftgyhunfd6csxexbabiubcuibgfwvgurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguvurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguvurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguv',
              time: '2019/05/11 05:11'
            },
            { 
              sender: '黃欣欣',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/11/02 11:02'
            },
            { 
              sender: '臻臻',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/04/06 04:06'
            },
            { 
              sender: 'Ku Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/03/08 03:08'
            },
            
          ]
        },
        { // sent
          folder: [
            {
              sender: 'cpj',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subject: 'iiiiiiiiii',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/09/02 09:02'
            }
          ]
        }
      ],
    }
  },
  methods: {
    Click(i) {
      this.contentDialog = true
      this.displaymail = i
    },
    Clear(i) {
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
    }
  }
}
</script>

<style lang="css" scoped>

@media screen and (max-width: 960px) {
  #dialog {
    visibility: visible;
  }
}

@media screen and (min-width: 960px) and (max-width: 1904px) {
  #dialog {
    visibility: hidden;
  }
}

@media screen and (min-width: 1904px) {
  #dialog {
    visibility: hidden;
  }
}

</style>