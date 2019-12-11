<template>
  <v-row no-gutters>
    <v-col cols="2">
      <v-card tile outlined height="93vh">
        <v-row justify="center" align="center"><v-col cols="4" class="pl-6">
          <v-dialog v-model="composeDialog" persistent width="50%">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" fab v-on="on" small>
                <v-icon>mdi-plus-thick</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-toolbar color="primary" dark dense>
                <div class="subtitle-1">New mail</div>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn tile icon @click="ToDraft()" v-on="on"><v-icon>mdi-close</v-icon></v-btn>
                  </template>
                  <span>save to Draft and close</span>
                </v-tooltip>
              </v-toolbar>
              <v-container>
                <v-text-field label="To" required hint="enter an username" v-model="draftSentTo"></v-text-field>
                <v-text-field label="Subject" required v-model="draftSubject"></v-text-field>
                <v-textarea label="Message" persistent-hint hint="the draft won't be save if 'Message' is blank" v-model="draftMessage"></v-textarea>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-card-actions>
                    <v-btn
                      outlined
                      color="primary"
                      @click="ResetNewmail()"
                    >cancel</v-btn>
                    <v-btn
                      dark
                      color="primary"
                      @click="composeDialog = false"
                    >send</v-btn>
                  </v-card-actions>
                </v-row>
              </v-container>
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
    <v-col cols="3">
      <v-card tile elevation="0" outlined height="93vh">
        <v-card tile elevation="0" height="92.5%">
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
            <v-tooltip bottom v-if="displayfolder != 1">
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined v-on="on">
                  <v-icon v-if="displayfolder === 2" @click="EditDraft(2)">mdi-pencil-outline</v-icon>
                  <v-icon v-else-if="displayfolder === 3" @click="Move(0)">mdi-inbox-arrow-down</v-icon>
                  <v-icon v-else @click="EditDraft(0)">mdi-reply</v-icon>
                </v-btn>
              </template>
              <span v-if="displayfolder === 0">reply</span>
              <span v-else-if="displayfolder === 2">edit</span>
              <span v-else-if="displayfolder === 3">move back to inbox</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined v-on="on" @click="Remove(displayfolder,displaymail)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span v-if="displayfolder === 0 || displayfolder === 1">move to trash</span>
              <span v-else>delete</span>
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
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              time: '2019/11/08 11:08'
            }
          ]
        }
      ],
    }
  },
  methods: {
    Clear(i) {
      this.displayfolder = i
      this.displaymail = -1
    },
    Remove(f,idx) {
      if(f === 0 || f === 1) {
        this.mail[3].folder.splice(0, 0, this.mail[f].folder[idx])
      } //move to trash
      this.mail[f].folder.splice(idx, 1)
      if(idx === this.mail[f].folder.length) {
        this.displaymail--
      }
    },
    ToDraft() {
      if(this.displayfolder == 2){
        this.mail[2].folder[this.displaymail].sender = this.draftSentTo
        this.mail[2].folder[this.displaymail].subject = this.draftSubject
        this.mail[2].folder[this.displaymail].message = this.draftMessage
      } //update the draft
      else if(this.draftMessage != ''){
        this.mail[2].folder.push({sender: this.draftSentTo, subject: this.draftSubject, message: this.draftMessage})
      } //push to draft
      this.ResetNewmail()
    },
    Move(to) {
      this.mail[to].folder.push(this.mail[3].folder[this.displaymail])
      this.Remove(3,this.displaymail)
    },
    ResetNewmail() {
      this.draftSentTo = ''
      this.draftSubject = ''
      this.draftMessage = ''
      this.composeDialog = false
    },
    EditDraft(f) {
      if(f === 0) this.draftSubject += 'Re:'
      this.draftSentTo = this.mail[f].folder[this.displaymail].sender
      this.draftSubject += this.mail[f].folder[this.displaymail].subject
      if(f === 2) this.draftMessage = this.mail[f].folder[this.displaymail].message
      this.composeDialog = !this.composeDialog
    }
  }
}
</script>

<style lang="css" scoped>
</style>