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
                    <v-alert
                      v-model="errAlert"
                      dismissible
                      colored-border
                      border="left"
                      dense
                      elevation="2"
                      type="error"
                      transition="scroll-y-transition"
                    ><v-row v-for="(msg, idx) in errMsg" :key="idx">{{ msg }}</v-row></v-alert>
                    <v-text-field 
                      label="To" 
                      :rules="[v => !!v || 'Sorry, cannot send without Receiver']"
                      v-model="newMail.receiver"
                    ></v-text-field>
                    <v-text-field 
                      label="Title" 
                      counter="32" 
                      :rules="[v => !!v && v.length <= 32 || 'Sorry, the length must be ≤ 32 characters']" 
                      v-model="newMail.title"
                    ></v-text-field>
                    <v-textarea 
                      label="Message" 
                      :rules="[v => !!v || 'Sorry, cannot send empty message']"
                      v-model="newMail.message"
                    ></v-textarea>
                  </v-form>
                </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined color="secondary" @click="cancelCompose()">cancel</v-btn>
                    <v-btn dark color="primary" @click="send()">send</v-btn>
                  </v-card-actions>
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
              @click="clear(i)"
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
                <v-btn class="ma-1" icon outlined v-if="displayfolder === 0"><v-icon @click="reply(displayfolder,displaymail)">mdi-reply</v-icon></v-btn>
                <v-btn class="ma-1" icon outlined @click="remove(displayfolder,displaymail)"><v-icon>mdi-delete</v-icon></v-btn>
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
      <v-card tile elevation="0" outlined height="93vh" v-if="showMailSet()">
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
              <v-list-item-content v-if="item.status === 1 && displayfolder === 0" class="font-weight-bold" @click="open(i)">
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>{{item.sender}} - {{item.timestamp}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content v-else @click="open(i)">
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>{{item.sender}} - {{item.timestamp}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-btn icon color="primary" text x-small v-if="displayfolder === 0" @click="read(displayfolder,i)">
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
        <v-btn fab small color="grey--text" @click="clear(1)">
          <v-icon>mdi-send</v-icon>
        </v-btn>
        <v-btn fab small color="grey--text" @click="clear(0)">
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
                  <v-icon @click="reply(displayfolder,displaymail)">mdi-reply</v-icon>
                </v-btn>
              </template>
              <span>reply</span>
            </v-tooltip>
            <!-- Delete Btn -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined v-on="on" @click="remove(displayfolder,displaymail)">
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
      errAlert: false,
      errMsg: [],
      composeDialog: false,
      showMail: false,
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
          folder: []
        },
        { // sent
          folder: []
        }
      ],
    }
  },
  beforeMount() {
    this.getInbox();
    this.getSent();
  },
  methods: {
    convertTime(time) {
      var a = new Date(time * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = '0' + a.getHours();
      var min = '0' + a.getMinutes();
      var sec = '0' + a.getSeconds();
      var time = date + ' ' + month + ' ' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return time;
    },
    getInbox() {
      this.$http.get(`${API_BASE_URL}/inbox`)
        .then((res) => {
          console.log(res)
          res.data.data.forEach(ele => {
            this.mail[0].folder.push({'messageId': ele.messageId, 'status': ele.status, 'sender': ele.sender, 'title': ele.title, 'message': ele.message, 'timestamp': this.convertTime(ele.timestamp)})
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
            this.mail[1].folder.push({'messageId': ele.messageId, 'receiver': ele.receiver, 'title': ele.title, 'message': ele.message, 'timestamp': ele.timestamp})
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
        this.$http.post(`${API_BASE_URL}/auth/check/username`, {username: this.newMail.receiver})
          .then((response) => {
            if ( response.data.data.valid === 0 ) {
              this.$http.post(`${API_BASE_URL}/inbox`, {'receivers': [this.newMail.receiver], 'title': this.newMail.title, 'message': this.newMail.message})
                .then((res) => {
                  console.log(res)
                  res.data.forEach((ele) => {
                    this.mail[1].folder.push({'messageId': ele.messageId, 'receiver': this.newMail.receiver, 'title': this.newMail.title, 'message': this.newMail.message, 'timestamp': ele.timestamp})
                  })
                })
                .catch((err) => {
                  console.log(err);
                });
              this.composeDialog = false
            } else if ( response.data.data.valid === 1 ) {
              this.errMsg = ['User not found']
              this.errAlert = true
            }
          })
          .catch((error) => {
            this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'];
            this.errAlert = true;
          })
      } 
    },
    showMailSet() {
      if(this.$vuetify.breakpoint.mdAndUp) return true;
      else if(!this.showMail) return true;
      else return false;
    },
    open(i) {
      this.showMail = true
      this.displaymail = i
      if ( this.mail[this.displayfolder].folder[i].status === 1) {
        this.read(this.displayfolder,i)
      }
    },
    clear(i) {
      this.showMail = false
      this.displayfolder = i
      this.displaymail = -1
    },
    remove(f,idx) {
      this.$http.delete(`${API_BASE_URL}/inbox`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}, data: {'messageId': this.mail[f].folder[idx].messageId}})
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
      this.mail[f].folder.splice(idx, 1)
      this.showMail = false
      this.displaymail = -1
    },
    cancelCompose() {
      this.newMail.receiver = ''
      this.newMail.title = ''
      this.newMail.message = ''
      this.composeDialog = false
    },
    reply(f,m) {
      this.newMail.receiver = this.mail[f].folder[m].sender
      this.newMail.title = 'Re: ' + this.mail[f].folder[m].title
      this.composeDialog = true
    },
    read(f,idx) {
      if(this.mail[f].folder[idx].status === 1) {
        this.mail[f].folder[idx].status = 0
      }
      else {
        this.mail[f].folder[idx].status = 1
      }
      this.$http.put(`${API_BASE_URL}/inbox`, {'messageId': this.mail[f].folder[idx].messageId})
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
    },
  },
}
</script>

<style lang="css" scoped>
</style>