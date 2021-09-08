<template>
  <v-row no-gutters style="height: 100%">
    <!-- Side Bar Begin -->
    <v-col cols="2" class="hidden-sm-and-down" style="height: 100%">
      <v-card tile outlined height="100%">
        <v-card-title>
          <v-dialog v-model="composeDialog" scrollable :width="this.$vuetify.breakpoint.mdAndUp ? '80%' : '100%'" persistent>
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
                  <v-select
                    v-model="selectedCourse"
                    :items="courseList"
                    label="Course (Public can view all users)"
                  ></v-select>
                  <v-autocomplete
                    label="To"
                    v-model="newMail.receiver"
                    v-if="toShow"
                    :items="userList"
                    :rules="[v => !!v || 'Sorry, you have to select at least one User']"
                    chips
                    multiple
                    clearable
                    :menu-props="{ maxHeight: '25%' }"
                    :search-input.sync="userSearchValue"
                    @change="receiverChg"
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>User not found</v-list-item-title>
                      </v-list-item>
                    </template>
                    <template v-slot:selection="{ attr, on, item, selected }">
                      <v-chip
                        v-bind="attr"
                        :input-value="selected"
                        color="primary"
                        class="white--text"
                        close
                        @click:close="removeUser(item)"
                        v-on="on"
                      ><span v-text="item"></span></v-chip>
                    </template>
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
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
          </v-dialog>
          <div class="ml-4">Compose</div>
              <!-- Compose Mail End -->
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
    <v-col cols="12" md="3" style="height: 100%; overflow-y: hidden;">
      <!-- Mobile: Display Mail Begin -->
      <v-slide-x-reverse-transition>
        <v-card
          v-if="showMail && (displayMail !== -1)"
          tile
          elevation="0"
          outlined
          height="100%"
          class="hidden-md-and-up"
        >
          <v-card tile elevation="0" height="100%" class="pt-3 px-3">
            <v-card-title class="pa-0">
              <v-btn icon @click="showMail = false"><v-icon large>mdi-chevron-left</v-icon></v-btn>
              <v-spacer></v-spacer>
              <v-list-item two-line>
                <v-list-item-avatar v-if="displayFolder==='inbox'" size="64px">
                  <v-img :src="mail[displayFolder][displayMail].avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-avatar v-else>
                  <v-img :src="getAvatar(-1)"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-if="displayFolder==='inbox'" class="headline">Sender: {{mail[displayFolder][displayMail].sender.username}}</v-list-item-title>
                  <v-list-item-title v-else class="headline">Receivers: {{mail[displayFolder][displayMail].receiver.username}}</v-list-item-title>
                  <v-list-item-subtitle>{{mail[displayFolder][displayMail].timestamp}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-btn class="ma-1" icon outlined v-if="displayFolder === 'inbox'"><v-icon @click="reply(displayFolder,displayMail)">mdi-reply</v-icon></v-btn>
                <v-btn class="ma-1" icon outlined @click="remove(displayFolder,displayMail)"><v-icon>mdi-delete</v-icon></v-btn>
              </v-list-item>
            </v-card-title>
            <v-divider></v-divider>
            <!-- why icon??? -->
            <v-card-text>
              <v-list-item>
                <v-list-item-content class="ma-3" v-if="mailRender">
                  <v-list-item-title class="headline">Subject: {{mail[displayFolder][displayMail].title}}</v-list-item-title>
                  <v-divider></v-divider>
                  <vue-markdown>{{mail[displayFolder][displayMail].message}}</vue-markdown>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
        </v-card>
      </v-slide-x-reverse-transition>
      <!-- Mobile: Display Mail End -->
      <!-- Mail List Begin -->
      <v-card tile elevation="0" outlined height="100%" v-if="this.$vuetify.breakpoint.mdAndUp || !this.showMail">
        <v-card-title fixed>
          <v-autocomplete
            v-model="searchMail"
            outlined
            append-icon="mdi-magnify"
            label="Search for subject..."
            hide-details
            item-text="title"
            item-value="messageId"
            :items="mail[displayFolder]"
            search-input.sync="search"
            @change="open('id', searchMail)"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  No relevant data found
                </v-list-item-title>
              </v-list-item>
            </template>
            <template v-slot:item="{ item }">
              <v-list-item-avatar color="primary" class="headline font-weight-light white--text">
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
                <v-list-item-subtitle v-text="item.sender.username"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 100%;" class="overflow-x-auto pa-0">
          <v-list style="width: 100%;" class="pa-0"><v-list-item-group>
            <v-list-item v-if="mail[displayFolder].length === 0" disabled>
              <v-list-item-content>
                <v-icon size="50" color="grey">mdi-email-outline</v-icon>
                <v-list-item-subtitle class="text-center subtitle-1">Empty</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              two-line
              v-for="(item, i) in mail[displayFolder]"
              :key="i"
            >
              <v-list-item-avatar v-if="displayFolder === 'inbox'">
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-avatar v-else>
                <v-img :src="getAvatar(-1)"></v-img>
              </v-list-item-avatar>
              <v-list-item-content v-if="displayFolder === 'inbox'" :class="item.status === 0 ? 'font-weight-bold': ''" @click="open('idx', i)">
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>{{item.timestamp.substring(0,10)}}, From: {{item.sender.username}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content v-else @click="open('idx', i)">
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>{{item.timestamp.substring(0,10)}}, To: {{item.receiver.username}}</v-list-item-subtitle>
              </v-list-item-content>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon color="primary" text x-small v-if="displayFolder === 'inbox'" @click="read(displayFolder,i)">
                  <v-icon size="10" v-if="item.status === 0">mdi-checkbox-blank-circle</v-icon>
                  <v-icon size="10" v-else>mdi-checkbox-blank-circle-outline</v-icon>
                </v-btn>
              </template>
              <span v-if="item.status === 0">Mark as Read</span>
              <span v-else>Mark as Unread</span>
            </v-tooltip>
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
    <v-col cols="7" class="ma-0 hidden-sm-and-down" style="height: 100%">
      <v-card tile elevation="0" outlined height="100%">
        <v-card-title class="pt-3 px-3">
          <v-list-item v-if="displayMail !== -1" two-line>
            <v-list-item-avatar v-if="displayFolder==='inbox'" size="64px">
              <v-img :src="mail[displayFolder][displayMail].avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar v-else>
                <v-img :src="getAvatar(-1)"></v-img>
              </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline" v-if="displayFolder === 'inbox'">
                Sender: {{mail[displayFolder][displayMail].sender.username}}
              </v-list-item-title>
              <v-list-item-title class="headline" v-else>
                Receivers: {{mail[displayFolder][displayMail].receiver.username}}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{mail[displayFolder][displayMail].timestamp}}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <!-- Reply Btn -->
            <v-tooltip bottom v-if="displayFolder === 'inbox'">
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined v-on="on" >
                  <v-icon @click="reply(displayFolder,displayMail)">mdi-reply</v-icon>
                </v-btn>
              </template>
              <span>reply</span>
            </v-tooltip>
            <!-- Delete Btn -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="ml-1" icon outlined v-on="on" @click="remove(displayFolder,displayMail)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>delete</span>
            </v-tooltip>
          </v-list-item>
        </v-card-title>
        <!-- if no display main, no divider??? -->
        <v-divider v-if="displayMail !== -1"></v-divider>
        <v-card-text>
          <v-list-item v-if="displayMail === -1">
            <v-list-item-content>
              <v-icon size="200" color="grey">mdi-email-outline</v-icon>
              <v-list-item-subtitle class="text-center display-1">Empty</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content class="ma-3" v-if="mailRender">
              <v-list-item-title class="headline">Subject: {{mail[displayFolder][displayMail].title}}</v-list-item-title>
              <v-divider></v-divider>
              <v-container><vue-markdown class="body-1">{{mail[displayFolder][displayMail].message}}</vue-markdown></v-container>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-col>
    <!-- Display Mail End -->
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'
const API_BASE_URL = '/api'
var len = 0

export default {

  name: 'Inbox',

  components: {
    VueMarkdown
  },

  data () {
    return {
      newMail: {
        receiver: '',
        title: '',
        message: ''
      },
      validForm: false,
      errAlert: false,
      errMsg: [],
      composeDialog: false,
      showMail: false,
      displayFolder: 'inbox',
      displayMail: -1,
      speedDial: false,
      navbar: [
        { icon: 'mdi-inbox', title: 'Inbox' },
        { icon: 'mdi-send', title: 'Sent' }
      ],
      folder: [
        'inbox', 'sent'
      ],
      mail: {
        inbox: [],
        sent: []
      },
      mailRender: true,
      isLoading: false,
      search: null,
      searchMail: '',
      courseList: [],
      userList: [],
      userSearchValue: '',
      selectedCourse: 'Select Course',
      toShow: false,
      payload: ''
    }
  },
  watch: {
    selectedCourse () {
      if (this.selectedCourse === this.courseList[0]) this.toShow = false
      else {
        this.toShow = true
        this.userList = []
        this.getUser()
      }
    }
  },
  beforeMount () {
    this.getPayload()
    this.init()
  },
  methods: {
    init () {
      this.mail = { inbox: [], sent: [] }
      this.courseList = ['Select Course']
      this.showMail = false
      this.displayMail = -1
      this.getInbox()
      this.getSent()
      this.getCourse()
    },
    getPayload () {
      if (this.$cookies.isKey('jwt')) {
        var payload = this.parseJwt(this.$cookies.get('jwt'))
        if (payload.active === false) {
          this.$router.push('/')
        } else {
          this.payload = payload
        }
      } else {
        this.$router.push('/')
      }
    },
    parseJwt (token) {
      console.log(atob(token.split('.')[1]))
      return JSON.parse(atob(token.split('.')[1])).data
    },
    timeFormat (time) {
      var tmp = new Date(time * 1000)
      var year = tmp.getFullYear()
      var month = '0' + (tmp.getMonth() + 1)
      var date = '0' + tmp.getDate()
      var hour = '0' + tmp.getHours()
      var min = '0' + tmp.getMinutes()
      var sec = '0' + tmp.getSeconds()
      const formattedTime = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2)
      return formattedTime
    },
    getInbox () {
      this.$http.get(`${API_BASE_URL}/inbox`)
        .then((res) => {
          res.data.data.forEach(ele => {
            this.mail.inbox.push({ messageId: ele.messageId, status: ele.status, sender: ele.sender, title: ele.title, message: ele.message, timestamp: this.timeFormat(ele.timestamp), avatar: this.getAvatar(ele.sender.md5) })
          })
        })
    },
    getSent () {
      this.$http.get(`${API_BASE_URL}/inbox/sent`)
        .then((res) => {
          res.data.data.forEach((ele) => {
            var receiversFormat = ''
            ele.receivers.forEach((rec) => {
              if (receiversFormat !== '') receiversFormat += ', '
              receiversFormat += rec.username
            })
            this.mail.sent.push({ messageId: ele.messageId, receiver: { username: receiversFormat }, title: ele.title, message: ele.message, timestamp: this.timeFormat(ele.timestamp) })
          })
        })
    },
    getCourse () {
      this.$http.get(`${API_BASE_URL}/course`)
        .then((res) => {
          res.data.data.forEach((ele) => {
            this.courseList.push(ele.course)
          })
        })
    },
    getUser () {
      this.$http.get(`${API_BASE_URL}/course/${this.selectedCourse}`)
        .then((res) => {
          var data = res.data.data
          this.userList.push('Select All')
          this.userList.push(data.teacher.username)
          data.TAs.forEach((ele) => { this.userList.push(ele.username) })
          for (var key in data.studentNicknames) {
            this.userList.push(data.studentNicknames[key])
          }
        })
    },
    getAvatar (payload) {
      if (payload === -1) payload = this.payload.md5
      var d = encodeURI('https://noj.tw/defaultAvatar.png')
      return `https://www.gravatar.com/avatar/${payload}?d=${d}`
    },
    send () {
      // validate form
      // loading btn
      if (this.$refs.form.validate()) {
        if (!(this.newMail.receiver)) {
          this.errMsg = ['You have to select at least one receiver(and select course before)']
          this.errAlert = true
          return
        }
        this.errMsg = ['User not found', '']
        this.newMail.receiver.forEach((usr) => {
          this.$http.post(`${API_BASE_URL}/auth/check/username`, { username: usr })
            .then((response) => {
              if (response.data.data.valid === 1) {
                this.errMsg[1] += usr + ' '
              }
            })
            .catch(() => {
              this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.']
              this.errAlert = true
            })
        })
        if (this.errMsg[1]) {
          this.errAlert = true
          return
        }
        this.$http.post(`${API_BASE_URL}/inbox`, { receivers: this.newMail.receiver, title: this.newMail.title, message: this.newMail.message })
          .then((res) => {
            this.composeDialog = false
            this.init()
          })
          .catch(() => {
            this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.']
            this.errAlert = true
          })
      }
    },
    open (by, i) {
      if (by === 'id') {
        i = this.mail[this.displayFolder].map(function (e) { return e.messageId }).indexOf(i)
      }
      this.showMail = true
      this.displayMail = i
      if (this.mail[this.displayFolder][i].status === 0) {
        this.read(this.displayFolder, i)
      }
      this.mailRender = false
      this.$nextTick(() => {
        this.mailRender = true
      })
    },
    clear (i) {
      this.showMail = false
      this.displayFolder = this.folder[i]
      this.displayMail = -1
      this.init()
    },
    async remove (f, idx) {
      var url = ''
      if (f === 'sent') {
        url = '/sent'
      }
      await this.$http.delete(`${API_BASE_URL}/inbox${url}`, { headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' }, data: { messageId: this.mail[f][idx].messageId } })
      this.mail[f].splice(idx, 1)
      this.showMail = false
      this.displayMail = -1
      this.init()
    },
    cancelCompose () {
      this.selectedCourse = 'Select Course'
      this.newMail.receiver = ''
      this.newMail.title = ''
      this.newMail.message = ''
      this.composeDialog = false
    },
    reply (f, m) {
      this.selectedCourse = 'Public'
      this.newMail.receiver = [this.mail[f][m].sender.username]
      this.newMail.title = 'Re: ' + this.mail[f][m].title
      this.composeDialog = true
    },
    async read (f, idx) {
      this.mail[f][idx].status ^= 1
      await this.$http.put(`${API_BASE_URL}/inbox`, { messageId: this.mail[f][idx].messageId })
    },
    receiverChg () {
      this.userSearchValue = ''
      if (len > this.newMail.receiver.length) {
        if (this.newMail.receiver.indexOf('Select All') < 0) {
          this.userList.splice(0, 0, 'Select All')
        }
      }
      len = this.newMail.receiver.length
      if (this.newMail.receiver.indexOf('Select All') >= 0) {
        this.newMail.receiver = []
        this.userList.forEach(ele => {
          if (ele !== 'Select All') { this.newMail.receiver.push(ele) }
        })
        this.userList.shift()
      }
    },
    removeUser (item) {
      this.newMail.receiver.splice(this.newMail.receiver.indexOf(item), 1)
    }
  }
}
</script>
