<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '75vw' : '95vw', height: '100%' }"
  >
    <v-card>
      <v-card-title>
        Submissions
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search User"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn icon color="error" v-on="on" @click="getSubmissions">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Re-fetch Submissions</span>
        </v-tooltip>
      </v-card-title>
      <v-card-title>
        <v-col cols="6" md="3">
          <v-select
            v-model="whosSubm"
            :items="['My Submissions', 'All Submissions']"
            solo
            hide-details
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="6" md="3">
          <v-select
            v-model="selectedProblem"
            label="Problem"
            :items="problems"
            solo
            hide-details
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="6" md="3">
          <v-select
            v-model="selectedStatus"
            label="Status"
            :items="submStatus"
            solo
            hide-details
            multiple
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="6" md="3">
          <v-select
            v-model="selectedLanguage"
            label="Language"
            :items="LANG"
            solo
            hide-details
            multiple
          ></v-select>
        </v-col>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="submissions"
        :items-per-page="15"
        :search="search"
        :loading="loading"
      >
        <template v-slot:item.submissionId="{ item }">
          <a :href="'/submission/'+item.submissionId" rel="noopener noreferrer" target="_blank">{{ item.submissionId.substr(-6) }}</a>
        </template>
        <template v-slot:item.problemId="{ item }">
          <a class="subtitle-1" :href="'/problem/'+item.problemId" rel="noopener noreferrer" target="_blank">{{ item.problemId }}</a>
        </template>
        <template v-slot:item.user="{ item }">
          <span class="subtitle-1">{{ item.user }}</span>
        </template>
        <template v-slot:item.status="{ item }">
          <span :style="{ color: COLOR[item.status+1] }">{{ STATUS[item.status+1] }}</span>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {

  name: 'Submissions',
  data () {
    return {
      search: '',
      headers: [
        { text: 'ID', value: 'submissionId', class: 'font-weight-bold subtitle-1 text--primary', sortable: false, filterable: false },
        { text: 'PID', value: 'problemId', class: 'font-weight-bold subtitle-1 text--primary', sortable: false, filterable: false },
        { text: 'User', value: 'user', class: 'font-weight-bold subtitle-1 text--primary', sortable: false },
        { text: 'Result', value: 'status', class: 'font-weight-bold subtitle-1 text--primary', sortable: false, filterable: false },
        { text: 'Run Time', value: 'runTime', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
        { text: 'Memory', value: 'memoryUsage', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
        { text: 'Score', value: 'score', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
        { text: 'Language', value: 'languageType', class: 'font-weight-bold subtitle-1 text--primary', sortable: false, filterable: false },
        { text: 'Submit Time', value: 'timestamp', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
      ],
      whosSubm: 'My Submissions',
      items: [],
      submissions: [],
      problems: [],
      selectedProblem: 0,
      submStatus: [
        { text: 'Pending', value: -1 },
        { text: 'AC', value: 0 },
        { text: 'WA', value: 1 },
        { text: 'CE', value: 2 },
        { text: 'TLE', value: 3 },
        { text: 'MLE', value: 4 },
        { text: 'RE', value: 5 },
        { text: 'JE', value: 6 },
        { text: 'OLE', value: 7 },
      ],
      selectedStatus: [],
      selectedLanguage: [],
      loading: false,
      username: '',
      LANG: ['C', 'C++', 'Python', 'Handwritten'],
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C', '#BF360C'],
    }
  },

  async beforeMount() {
    this.username = this.getUsername();
    await this.getProblems();
    await this.getSubmissions();
  },

  watch: {
    whosSubm() {
      this.getSubmissions();
    },
    selectedProblem() {
      this.filterSelection();
    },
    selectedStatus() {
      this.filterSelection();
    },
    selectedLanguage() {
      this.filterSelection();
    },
  },

  methods: {
    filterSelection() {
      this.submissions = this.items.filter(s => {
        console.log(s)
        console.log(this.selectedProblem)
        console.log(this.selectedStatus)
        console.log(this.selectedLanguage)
        if ( this.selectedProblem != 0 && s.problemId != this.selectedProblem ) return false;
        if ( this.selectedStatus.length > 0 && !this.selectedStatus.includes(s.status) ) return false;
        if ( this.selectedLanguage.length > 0 && !this.selectedLanguage.includes(s.languageType) ) return false;
        return true;
      })
    },
    async getSubmissions() {
      this.loading = true;
      let filter = {
        offset: 0,
        count: -1,
        course: this.$route.params.name,
      }
      if ( this.whosSubm === 'My Submissions' ) {
        filter.username = this.username;
      }
      this.items = [];
      this.$http.get('/api/submission', { params: filter })
        .then((res) => {
          this.items = res.data.data.submissions.map(s => {
            s.user = s.user.username
            s.languageType = this.LANG[s.languageType];
            s.timestamp = this.timeFormat(s.timestamp);
            return s;
          });
          this.loading = false;
          this.submissions = this.items.slice();
          this.filterSelection();
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    async getProblems() {
      this.problems = [];
      let filter = {
        offset: 0,
        count: -1,
        course: this.$route.params.name,
      }
      try {
        let res = await this.$http.get('/api/problem', { params: filter })
        this.problems = res.data.data.map(p => {
          return {
            text: p.problemId + ' - ' + p.problemName,
            value: p.problemId,
          }
        })
        this.problems.splice(0,0,{ text: 'Select Problem', value: 0 })
      }
      catch(e) {
        console.log(e)
      };
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