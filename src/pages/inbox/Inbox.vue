<template>
  <v-row no-gutters style="height: 100%">
    <v-col cols="2" class="hidden-sm-and-down" style="height: 100%">
      <InboxNavbar :selected="folder" @change="refreshFolder" ref="navbar"/>
    </v-col>
    <v-col cols="12" md="3" style="height: 100%; overflow-y: hidden;">
      <InboxMailList :mails="mailList" :selected="mail" @read="index => mail = index"/>
    </v-col>
    <v-col cols="7" class="ma-0 hidden-sm-and-down" style="height: 100%">
      <InboxViewer :mail="mailContent" @reply="replyMail" @delete="deleteMail"/>
    </v-col>
  </v-row>
</template>

<script>
import InboxNavbar from "./element/InboxNavbar"
import InboxMailList from "./element/InboxMailList"
import InboxViewer from "./element/InboxViewer"

const API_BASE_URL = '/api';
const DEFAULT_AVATAR = encodeURI("noj.tw/defaultAvatar.png");

function timeFormat(time) {
  var tmp = new Date(time * 1000);
  var year = tmp.getFullYear();
  var month = '0' + (tmp.getMonth()+1);
  var date = '0' + tmp.getDate();
  var hour = '0' + tmp.getHours();
  var min = '0' + tmp.getMinutes();
  var sec = '0' + tmp.getSeconds();
  var time = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
  return time;
}

export default {
  name: 'Inbox',

  components: {
    InboxNavbar,
    InboxMailList,
    InboxViewer,
  },

  data() {
    return {
      folder: -1,
      mail: -1,
      mails: [],
    }
  },

  computed: {
    mailContent() {
      let index = this.mail;
      if(index > -1) {
        let m = this.mails[index];
        return {
          avatar: `https://www.gravatar.com/avatar/${m.sender ? m.sender.md5 : JSON.parse(atob(this.$cookies.get('jwt').split('.')[1])).data.md5}?d=${DEFAULT_AVATAR}`,
          sender: m.sender && `From: ${m.sender.username}`,
          receivers: m.receivers && `To: ${m.receivers.map(r => r.username).join(', ')}`,
          timestamp: timeFormat(m.timestamp),
          subject: `Subject: ${m.title}`,
          content: m.message,
          value: index,
        };
      }
      return null
    },
    mailList() {
      return this.mails.map((m, i) => {
        return {
          avatar: `https://www.gravatar.com/avatar/${m.sender ? m.sender.md5 : JSON.parse(atob(this.$cookies.get('jwt').split('.')[1])).data.md5}?d=${DEFAULT_AVATAR}`,
          title: m.title,
          subtitle: timeFormat(m.timestamp).slice(0, 11) + (m.sender ? `From: ${m.sender.username}` : `To: ${m.receivers.map(r => r.username).join(', ')}`),
          value: i,
        }
      });
    },
  },

  methods: {
    refreshFolder(index) {
      this.folder = index;
      this.$http.get(`${API_BASE_URL}/inbox${this.folder ? '/sent': ''}`)
        .then(res => this.mails = res.data.data);
    },
    replyMail(index) {
      let navbar = this.$refs.navbar;
      let mail = this.mails[index];
      navbar.newMail.receivers = [mail.sender.username];
      navbar.newMail.title = `Re: ${mail.title}`;
      navbar.composeDialog = true;
    },
    deleteMail(index) {
      if(this.mails.length - this.mail < 2) {
        this.mail -= 1;
      }
      let mail = this.mails.splice(index, 1)[0];
      this.$http.delete(`${API_BASE_URL}/inbox${mail.sender ? '' : '/sent'}`, {
        headers: {'Content-Type': 'application/json'},
        data: {'messageId': mail.messageId}
      });
    },
  },

  watch: {
    folder: {
      handler() {
        this.mail = -1;
        this.refreshFolder(this.folder);
      },
      immediate: true,
    }
  },

  mounted() {
    this.$nextTick(_ => this.folder = 0);
  }
}
</script>