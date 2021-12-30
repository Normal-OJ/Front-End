<template>
  <v-container :style="{ height: '100%' }">
    <v-card>
      <v-card-title>
        Submissions
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search user, submission id"
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
          <span>Refresh Submissions</span>
        </v-tooltip>
      </v-card-title>
      <v-card-title>
        <v-col cols="6" md="3" v-if="isTeacherOrAdmin">
          <v-select
            v-model="whosSubm"
            :items="['My Submissions', 'All Submissions']"
            solo
            hide-details
            @change="getSubmissions"
          ></v-select>
        </v-col>
        <v-col cols="6" md="3">
          <v-combobox
            v-model="selectedProblem"
            label="Problem"
            :items="problems"
            solo
            hide-details
            multiple
          ></v-combobox>
        </v-col>
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
        :loading="loading"
      >
        <template v-slot:[`item.submissionId`]="{ item }">
          <a :href="'/submission/'+item.submissionId" rel="noopener noreferrer" target="_blank">{{ item.submissionId.substr(-6) }}</a>
          <ui-button class="copy-code ml-2" :id="item.submissionId" color="gray" icon x-small>
            <template slot="content">
              <v-icon>mdi-content-copy</v-icon>
            </template>
          </ui-button>
        </template>
        <template v-slot:[`item.problemId`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <a class="subtitle-1" :href="'/problem/'+item.problemId" rel="noopener noreferrer" target="_blank" v-on="on" v-bind="attrs">{{ item.problemId }}</a>
            </template>
            <span>{{ pid2Pname[`${item.problemId}`] }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.user`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span class="subtitle-1" v-on="on" v-bind="attrs">{{ item.user.username }}</span>
            </template>
            <span>{{ item.user.displayedName }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <span :style="{ color: COLOR[item.status+1] }">{{ STATUS[item.status+1] }}</span>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar" color="info">{{ alertMsg }}</v-snackbar>
  </v-container>
</template>

<script>
import User from '@/utils/user'
import Clipboard from 'clipboard'
import { mapState } from 'vuex'

export default {
  name: 'Submissions',
  data () {
    return {
      search: '',
      whosSubm: 'My Submissions',
      items: [],
      problems: [],
      submStatus: [
        { text: 'Pending', value: -1 },
        { text: 'AC', value: 0 },
        { text: 'WA', value: 1 },
        { text: 'CE', value: 2 },
        { text: 'TLE', value: 3 },
        { text: 'MLE', value: 4 },
        { text: 'RE', value: 5 },
        { text: 'JE', value: 6 },
        { text: 'OLE', value: 7 }
      ],
      selectedProblem: [],
      selectedStatus: [],
      selectedLanguage: [],
      loading: false,
      LANG: ['C', 'C++', 'Python', 'Handwritten'],
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C', '#BF360C'],
      user: new User(this.$cookies.get('jwt')),
      snackbar: false,
      alertMsg: '',
      pid2Pname: {}
    }
  },
  computed: {
    headers () {
      return [
        { text: 'ID', value: 'submissionId', class: 'font-weight-bold subtitle-1 text--primary', sortable: false },
        { text: 'PID', value: 'problemId', class: 'font-weight-bold subtitle-1 text--primary', sortable: false, filterable: false },
        { text: 'User', value: 'user', class: 'font-weight-bold subtitle-1 text--primary', sortable: false },
        { text: 'Result', value: 'status', class: 'font-weight-bold subtitle-1 text--primary', sortable: false, filterable: false },
        { text: 'Run Time', value: 'runTime', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
        { text: 'Memory', value: 'memoryUsage', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
        { text: 'Score', value: 'score', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
        { text: 'Language', value: 'languageType', class: 'font-weight-bold subtitle-1 text--primary', sortable: false, filterable: false },
        { text: 'Submit Time', value: 'timestamp', class: 'font-weight-bold subtitle-1 text--primary', filterable: false }
      ]
    },
    submissions () {
      const selectedPid = this.selectedProblem.map(sp => sp.value)
      return this.items.filter(s => {
        if (this.search.length > 0 && !s.submissionId.includes(this.search) && !s.user.username.includes(this.search) && !s.user.displayedName.includes(this.search)) return false
        if (selectedPid.length > 0 && !selectedPid.includes(s.problemId)) return false
        if (this.selectedStatus.length > 0 && !this.selectedStatus.includes(s.status)) return false
        if (this.selectedLanguage.length > 0 && !this.selectedLanguage.includes(s.languageType)) return false
        return true
      })
    },
    ...mapState({
      username: state => state.username,
      role: state => state.role
    }),
    isTeacherOrAdmin () {
      return this.role <= 1
    }
  },
  methods: {
    async getSubmissions () {
      this.loading = true
      const filter = {
        offset: 0,
        count: -1,
        course: this.$route.params.name
      }
      if (this.whosSubm === 'My Submissions') {
        filter.username = this.username
      }
      this.items = []
      this.$agent.Submission.getList(filter)
        .then((res) => {
          this.items = res.data.data.submissions.map(s => ({
            ...s,
            languageType: this.LANG[s.languageType],
            timestamp: this.$formatTime(s.timestamp)
          }))
        })
        .finally(() => (this.loading = false))
    },
    async getProblems () {
      this.problems = []
      const filter = {
        offset: 0,
        count: -1,
        course: this.$route.params.name
      }
      try {
        const res = await this.$agent.Problem.getList(filter)
        this.problems = res.data.data.map(p => ({
          text: p.problemId + ' - ' + p.problemName,
          value: p.problemId
        }))
        this.pid2Pname = {}
        res.data.data.forEach(p => {
          this.pid2Pname[`${p.problemId}`] = p.problemName
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }
  },
  async beforeMount () {
    await this.getProblems()
    await this.getSubmissions()
  },
  mounted () {
    const clipboard = new Clipboard('.copy-code', { text: trigger => trigger.id })
    clipboard.on('success', evt => {
      this.snackbar = false
      this.alertMsg = 'submission id copied!'
      this.snackbar = true
      evt.clearSelection()
    })
    clipboard.on('error', err => {
      alert(`Could not copy text: ${err}`)
    })
  }
}
</script>
