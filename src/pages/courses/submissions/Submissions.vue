<template>
  <v-container :style="{ height: '100%' }">
    <v-card>
      <v-card-title>
        Submissions
        <v-spacer></v-spacer>
        <v-text-field
          v-if="isTeacherOrAdmin"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search username (Exact match)"
          hint="Press enter to search"
          @keydown.enter="option.username = search || null"
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
            v-model="option.selectedProblem"
            label="Problem"
            :items="problems"
            clearable
            solo
            hide-details
          ></v-combobox>
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            v-model="option.selectedStatus"
            label="Status"
            :items="submStatus"
            clearable
            solo
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            v-model="option.selectedLanguage"
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
        :items="items"
        :page.sync="option.page"
        :items-per-page="option.itemsPerPage"
        :server-items-length="submissionCount"
        :loading="loading"
        :footer-props="{
          itemsPerPageOptions: [5, 10, 20, 30]
        }"
        @update:page="(val) => option.page = val"
        @update:items-per-page="(val) => option.itemsPerPage = val"
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
          <span :style="{ color: SUBMISSION_COLOR[`${item.status}`] }">
            {{ SUBMISSION_STATUS[item.status] }}
          </span>
        </template>
        <template v-slot:[`footer.prepend`]>
          <v-text-field
            :value="option.page"
            class="px-4"
            label="Page"
            type="number"
            min="1"
            :max="Math.floor(submissionCount / option.itemsPerPage) + 1"
            @input="option.page = parseInt($event, 10)"
          ></v-text-field>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar" color="info">{{ alertMsg }}</v-snackbar>
  </v-container>
</template>

<script>
import Clipboard from 'clipboard'
import { mapState } from 'vuex'
import { SUBMISSION_STATUS, SUBMISSION_COLOR } from '@/constants/submissions'

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
      loading: false,
      LANG: [
        { text: 'C', value: 0 },
        { text: 'C++', value: 1 },
        { text: 'Python', value: 2 },
        { text: 'Handwritten', value: 3 },
      ],
      snackbar: false,
      alertMsg: '',
      pid2Pname: {},
      submissionCount: 10,
      option: {
        itemsPerPage: 10,
        page: 1,
        selectedProblem: null,
        selectedStatus: null,
        selectedLanguage: [],
        username: '',
      }
    }
  },
  computed: {
    headers () {
      return [
        { text: 'ID', value: 'submissionId', sortable: false },
        { text: 'PID', value: 'problemId', sortable: false, filterable: false },
        { text: 'User', value: 'user', sortable: false },
        { text: 'Result', value: 'status', sortable: false, filterable: false },
        { text: 'Run Time', value: 'runTime', sortable: false, filterable: false },
        { text: 'Memory', value: 'memoryUsage', sortable: false, filterable: false },
        { text: 'Score', value: 'score', sortable: false, filterable: false },
        { text: 'Language', value: 'languageType', sortable: false, filterable: false },
        { text: 'Submit Time', value: 'timestamp', sortable: false, filterable: false }
      ]
    },
    SUBMISSION_STATUS() { return SUBMISSION_STATUS },
    SUBMISSION_COLOR() { return SUBMISSION_COLOR },
    ...mapState({
      username: state => state.username,
      role: state => state.role
    }),
    isTeacherOrAdmin () {
      return this.role <= 1
    },
  },
  watch: {
    option: {
      handler: function () {
        this.getSubmissions()
      },
      deep: true
    }
  },
  methods: {
    async getSubmissions () {
      this.loading = true
      const filter = {
        offset: (this.option.page - 1) * this.option.itemsPerPage,
        count: this.option.itemsPerPage,
        course: this.$route.params.name,
        problemId: this.option.selectedProblem && this.option.selectedProblem.value,
        status: this.option.selectedStatus,
        languageType: this.option.selectedLanguage.join(',') || null,
        username: this.option.username || null,
      }
      if (this.whosSubm === 'My Submissions') {
        filter.username = this.username
      }
      this.$agent.Submission.getList(filter)
        .then((res) => {
          this.items = res.data.data.submissions.map(s => ({
            ...s,
            languageType: this.LANG[s.languageType].text,
            timestamp: this.$formatTime(s.timestamp)
          }))
          this.submissionCount = res.data.data.submissionCount
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
    if (this.isTeacherOrAdmin) {
      this.whosSubm = 'All Submissions'
    }
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
