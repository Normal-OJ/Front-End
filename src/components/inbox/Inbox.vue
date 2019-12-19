<template>
  <v-row no-gutters>
    <!-- Side Bar Begin -->
    <v-col cols="2" class="hidden-sm-and-down">
      <v-card tile outlined height="93vh">
        <v-card-title>
        <!-- <v-row justify="center" align="center"> -->
          <!-- <v-col cols="4" class="pl-6"> -->
            <v-dialog v-model="composeDialog" scrollable width="80%">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" fab v-on="on" small>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <!-- Compose Mail Begin -->
              <v-card>
                <v-toolbar color="primary" dark dense>
                  <div class="subtitle-1">New mail</div>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn tile icon @click="cancelCompose()" v-on="on"><v-icon>mdi-close</v-icon></v-btn>
                    </template>
                    <span>close</span>
                  </v-tooltip>
                </v-toolbar>
                <!-- New Mail Form -->
                <v-card-text class="mt-2">
                  <v-form v-model="validForm" ref="form">
                    <v-text-field 
                      label="To" 
                      required 
                      v-model="newMail.receiver"
                    ></v-text-field>
                    <v-text-field 
                      label="title" 
                      required 
                      counter="32" 
                      :rules="titleRule" 
                      v-model="newMail.title"
                    ></v-text-field>
                    <v-textarea 
                      label="Message" 
                      required
                      v-model="newMail.message"
                    ></v-textarea>
                  </v-form>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined color="secondary" @click="cancelCompose()">cancel</v-btn>
                    <v-btn dark color="primary" @click="send()">send</v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
              <!-- Compose Mail End -->
            </v-dialog>
          <!-- </v-col> -->
          <div class="ml-4">Compose</div>
        <!-- </v-row> -->
        </v-card-title>

        <v-divider></v-divider>
        <!-- Nav Bar -->
        <v-list nav>
          <v-list-item-group color="primary">
            <v-list-item 
              v-for="(item, i) in navbar"
              :key="i"
              @click="Clear(i)"
            >
              <v-list-item-icon><v-icon>{{item.icon}}</v-icon></v-list-item-icon>
              <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
    <!-- Side Bar End -->
    <!-- Middle Area -->
    <v-col cols="12" md="3" style="overflow-y: hidden;">
      <!-- Mobile: Display Mail Begin -->
      <v-slide-x-reverse-transition>
        <v-card
          v-if="showMail && (displaymail !== -1)"
          tile
          elevation="0" 
          outlined
          height="93vh" 
          class="hidden-md-and-up"
        >
          <v-card tile elevation="0" height="100%" class="pt-3 px-3">
            <v-card-title class="pa-0">
              <v-btn icon @click="showMail = false"><v-icon large>mdi-chevron-left</v-icon></v-btn>
              <v-spacer></v-spacer>
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
            </v-card-title>
            <v-divider></v-divider>
            <!-- why icon??? -->
            <v-card-text>
              <v-list-item v-if="displaymail === -1">
                <v-list-item-content>
                  <v-icon x-large color="grey">mdi-email</v-icon>
                  <v-list-item-subtitle class="text-center">Empty</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-else>
                <v-list-item-content class="ma-3">
                  <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].title}}</v-list-item-title>
                  <vue-markdown>{{mail[displayfolder].folder[displaymail].message}}</vue-markdown>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
          <!-- <v-divider></v-divider> -->
          <!-- <v-card tile elevation="0" height="5%">
            <v-list-item v-if="displaymail === -1"></v-list-item>
            <v-list-item v-else>
              <v-list-item-subtitle>Attachment</v-list-item-subtitle>
            </v-list-item>
          </v-card>-->
        </v-card>
      </v-slide-x-reverse-transition>
      <!-- Mobile: Display Mail End -->
      <!-- Mail List Begin -->
      <v-card tile elevation="0" outlined height="93vh" v-if="ShowMailSet()">
        <v-card-title fixed>
          <v-text-field
            outlined
            append-icon="mdi-magnify"
            label="Search author, title ..."
            hide-details
            @click:append=""
          ></v-text-field>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 100%;" class="overflow-x-auto pa-0">
          <v-list style="width: 100%;" class="pa-0"><v-list-item-group>
            <v-list-item 
              two-line
              v-for="(item, i) in mail[displayfolder].folder"
              :key="i"
            >
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content v-if="item.status === 1 && displayfolder === 0" class="font-weight-bold" @click="Click(i)">
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>{{item.sender}} - {{item.timestamp}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content v-else @click="Click(i)">
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>{{item.sender}} - {{item.timestamp}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-btn icon color="primary" text x-small v-if="displayfolder === 0" @click="Read(displayfolder,i)">
                <v-icon size="10" v-if="item.status === 1" >mdi-checkbox-blank-circle</v-icon>
                <v-icon size="10" v-else>mdi-checkbox-blank-circle-outline</v-icon>
              </v-btn>
            </v-list-item></v-list-item-group>
          </v-list>
        </v-card-text>
        <!-- Mail List End -->
      </v-card>
      <!-- Mobile: Compose & Drawer Button Begin-->
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
      <!-- Mobile: Compose & Drawer Button End-->
    </v-col>
    <!-- Display Mail Begin -->
    <v-col cols="7" class="ma-0 hidden-sm-and-down">
      <v-card tile elevation="0" outlined height="93vh">
        <v-card-title class="pt-3 px-3">
          <v-list-item v-if="displaymail !== -1" two-line>
            <v-list-item-avatar size="64px">
              <v-img :src="mail[displayfolder].folder[displaymail].avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">
                {{mail[displayfolder].folder[displaymail].sender}}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{mail[displayfolder].folder[displaymail].timestamp}}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <!-- Reply Btn -->
            <v-tooltip bottom v-if="displayfolder != 1">
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined >
                  <v-icon @click="Reply(displayfolder,displaymail)">mdi-reply</v-icon>
                </v-btn>
              </template>
              <span>reply</span>
            </v-tooltip>
            <!-- Delete Btn -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined v-on="on" @click="Remove(displayfolder,displaymail)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>delete</span>
            </v-tooltip>
          </v-list-item>
        </v-card-title>
        <!-- if no display main, no divider??? -->
        <v-divider></v-divider>
        <v-card-text>
          <v-list-item v-if="displaymail === -1">
            <v-list-item-content>
              <v-icon x-large color="grey">mdi-email</v-icon>
              <v-list-item-subtitle class="text-center">Empty</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content class="ma-3">
              <v-list-item-title class="headline">{{mail[displayfolder].folder[displaymail].title}}</v-list-item-title>
              <vue-markdown>{{mail[displayfolder].folder[displaymail].message}}</vue-markdown>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <!-- <v-divider></v-divider> -->
        <!-- <v-card tile elevation="0" height="10%">
          <v-list-item v-if="displaymail === -1"></v-list-item>
          <v-list-item v-else>
            <v-list-item-subtitle>Attachment</v-list-item-subtitle>
          </v-list-item>
        </v-card> -->
      </v-card>
    </v-col>
    <!-- Display Mail End -->
  </v-row>
</template>

<script>
// import VueMarkdown from 'vue-markdown'
const API_BASE_URL = '/api';

export default {

  name: 'Inbox',

  components: {
    // VueMarkdown,
  },

  data () {
    return {
      newMail: {
        'receiver': '',
        'title': '',
        'message': ''
      },
      validForm: false,
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
              title: '資工營面試通知',
              message: '**As** title, u! ~~As~~ title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903052332
            },
            { 
              status: 1,
              sender: 'Kelly',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: 'test',
              message: '資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面試通知資工營面',
              timestamp: 201912131213
            },
            { 
              status: 1,
              sender: 'ysl',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: '測',
              message: '0991234567890qwer tyuioasdfghjklzxcvbnm,098765edkdftgyhunfd6csxexbabiubcuibgfwvgurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguvurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguvurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguv',
              timestamp: 201905110511
            },
            { 
              status: 1,
              sender: '黃欣欣',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201911021102
            },
            { 
              status: 1,
              sender: '臻臻',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201904060406
            },
            { 
              status: 1,
              sender: 'Ku Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903080309
            },
            { 
              status: 1,
              sender: 'Ku Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903080312
            },
            { 
              status: 1,
              sender: 'Ku Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903080008
            },
            { 
              status: 1,
              sender: 'Lily',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: '資工營面試通知',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201903088808
            },
            { 
              status: 1,
              sender: '黃欣欣',
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: '資工營面試通知通知通知通知通知',
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
              title: 'iiiiiiiiii',
              message: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
              timestamp: 201909020902
            }
          ]
        }
      ],
    }
  },
  beforeMount() {
    this.getInbox();
    this.getSent();
  },
  methods: {
    getInbox() {
      this.$http.get(`${API_BASE_URL}/inbox`)
        .then((res) => {
          console.log(res)
          res.data.data.forEach(ele => {
            this.mail[0].push({'messageId': ele.messageId, 'status': ele.status, 'sender': ele.sender, 'title': ele.title, 'message': ele.message, 'timestamp': ele.timestamp})
          })
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSent() {
      this.$http.get(`${API_BASE_URL}/inbox/sent`)
        .then((res) => {
          console.log(res)
          res.data.data.forEach((ele) => {
            this.mail[1].push({'messageId': ele.messageId, 'receiver': ele.receiver, 'title': ele.title, 'message': ele.message, 'timestamp': ele.timestamp})
          })
        })
        .catch((err) => {
          console.log(err);
        });
    },
    send() {
      // validate form
      // loading btn
      if ( this.$refs.form.validate() ) {
        console.log(this.check(this.newMail.receiver));
        if ( this.check(this.newMail.receiver) ) {
          this.$http.post(`${API_BASE_URL}/inbox`,this.newMail)
            .then((res) => {
              console.log(res)
              res.data.data.forEach((ele) => {
                this.mail[1].push({'messageId': ele.messageId, 'receiver': this.newMail.receiver, 'title': this.newMail.title, 'message': this.newMail.message, 'timestamp': ele.timestamp})
              })
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
      this.composeDialog = false
    },
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
      this.showMail = false
      this.displaymail = -1
      this.$http.delete(`${API_BASE_URL}/inbox`, this.mail[f].folder[idx].messageId)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
      // if(idx === this.mail[f].folder.length) {
      //   this.displaymail--
      // }
    },
    cancelCompose() {
      this.newMail.receiver = ''
      this.newMail.title = ''
      this.newMail.message = ''
      this.composeDialog = false
    },
    Reply(f,m) {
      this.newMail.receiver = this.mail[f].folder[m].sender
      this.newMail.title = 'Re: ' + this.mail[f].folder[m].title
      this.composeDialog = true
    },
    Read(f,idx) {
      if(this.mail[f].folder[idx].status === 1) {
        this.mail[f].folder[idx].status = 0
      }
      else this.mail[f].folder[idx].status = 1
      this.$http.put(`${API_BASE_URL}/inbox`, this.mail[f].folder[idx].messageId)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    check(user) {
      this.$http.post(`${API_BASE_URL}/auth/check/username`, {username: user})
        .then((response) => {
          if ( response.data.data.valid === 0 ) {
            return true;
          } else if ( response.data.data.valid === 1 ) {
            // user not found
            return false;
          }
        })
        .catch((error) => {
          return false;
          // this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'];
          // this.errAlert = true;
        })
    },
  },
}
</script>

<style lang="css" scoped>
</style>