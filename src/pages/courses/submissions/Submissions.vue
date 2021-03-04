<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '75vw' : '95vw', height: '100%' }"
  >
    <v-bottom-navigation
      v-model="nav"
      v-if="user.role < 2"
      class="mb-3"
      color="primary"
      style="
          -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
        "
      grow
    >
      <v-btn class="subtitle-2">
        <span>My Submissions</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn class="subtitle-2">
        <span>All Submissions</span>
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-card height="100%" elevation="2">
      <v-card-title class="font-weight-bold">
        Submissions
        <v-pagination
          v-model="page"
          :page="page"
          :length="length"
          total-visible="9"
        ></v-pagination>
      </v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary">ID</th>
              <th class="font-weight-bold subtitle-1 text--primary">PID</th>
              <th class="font-weight-bold subtitle-1 text--primary">User</th>
              <th class="font-weight-bold subtitle-1 text--primary">Result</th>
              <th class="font-weight-bold subtitle-1 text--primary">Run Time</th>
              <th class="font-weight-bold subtitle-1 text--primary">Memory</th>
              <th class="font-weight-bold subtitle-1 text--primary">Score</th>
              <th class="font-weight-bold subtitle-1 text--primary">Language</th>
              <th class="font-weight-bold subtitle-1 text--primary">Submit Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.submissionId">
              <td class="subtitle-1">
                <a target="_blank" rel="noopener noreferrer" :href="'/submission/'+item.submissionId">{{ item.submissionId.substr(-6) }}</a>
                <ui-button class="copy-code ml-2" :id="item.submissionId" color="gray" icon x-small>
                  <template slot="content">
                    <v-icon>mdi-content-copy</v-icon>
                  </template>
                </ui-button>
              </td>
              <td class="subtitle-1"><a target="_blank" rel="noopener noreferrer" :href="'/problem/'+item.problemId">{{ item.problemId }}</a></td>
              <td class="subtitle-1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-on="on" v-bind="attrs">{{ item.user.username }}</span>
                  </template>
                  <span>{{ item.user.displayedName }}</span>
                </v-tooltip>
              </td>
              <td class="subtitle-1" :style="{ color: COLOR[item.status+1] }">{{ STATUS[item.status+1] }}</td>
              <td class="subtitle-1">{{ item.runTime }}</td>
              <td class="subtitle-1">{{ item.memoryUsage }}</td>
              <td class="subtitle-1">{{ item.score }}</td>
              <td class="subtitle-1">{{ LANG[item.languageType] }}</td>
              <td class="subtitle-1">{{ timeFormat(item.timestamp) }}</td>
            </tr>
            <tr v-show="loading">
              <td colspan="9">
                <v-skeleton-loader
                  class="mx-auto"
                  type="table-row"
                ></v-skeleton-loader>
              </td>
            </tr>
            <tr v-if="!loading && (!items || items.length===0)">
              <td class="subtitle-1" colspan="9">🦄 No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-snackbar v-model="snackbar" color="info">{{ alertMsg }}</v-snackbar>
  </v-container>
</template>

<script>
import User from '@/utils/user'
import Clipboard from 'clipboard'

export default {

  name: 'Submissions',

  data () {
    return {
      page: 1,
      items: null,
      loading: false,
      LANG: ['C', 'C++', 'Python', 'Handwritten'],
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C', '#BF360C'],
      nav: 0,
      username: '',
      user: new User(this.$cookies.get('jwt')),
      snackbar: false,
      alertMsg: '',
    }
  },

  created() {
    this.username = this.getUsername();
    this.getSubmissions();
  },

  computed: {
    length() {
      return this.page+8;
    }
  },

  watch: {
    nav() {
      this.getSubmissions();
    },
    page() {
      this.getSubmissions();
    }
  },

  mounted() {
    const clipboard = new Clipboard('.copy-code', {text: (trigger => trigger.id).bind(this)});
    clipboard.on('success', evt => {
        this.snackbar = false;
        this.alertMsg = 'submission id copied!';
        this.snackbar = true;
        evt.clearSelection();
      });
    clipboard.on('error', err => {
      alert(`Could not copy text: ${err}`);
    });
  },

  methods: {
    getSubmissions() {
      this.loading = true;
      var query = `?offset=${(this.page-1)*10}&count=${10}&course=${this.$route.params.name}`;
      if ( this.nav === 0 ) {
        query += `&username=${this.username}`;
      }
      this.items = [];
      this.$http.get(`/api/submission${query}`)
        .then((res) => {
          console.log(res.data.data);
          this.items = res.data.data.submissions;
          this.loading = false;
        })
        .catch((err) => {
          // console.log(err);
          this.loading = false;
        });
    },
    timeFormat(time) {
      const tmp = new Date(time * 1000);
      const year = tmp.getFullYear();
      const month = '0' + (tmp.getMonth()+1);
      const date = '0' + tmp.getDate();
      const hour = '0' + tmp.getHours();
      const min = '0' + tmp.getMinutes();
      const sec = '0' + tmp.getSeconds();
      const timeString = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return timeString;
    },
    getUsername() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        return payload.username;
      }
      return '';
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
  }

}
</script>

<style lang="css" scoped>
</style>