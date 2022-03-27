<template>
  <div>
    <v-container>
      <template v-if="role >= 2">
        <v-row justify="center" style="margin-top: 48px">
          See the stats on&nbsp; <a href="https://v2.noj.tw">https://v2.noj.tw</a>!
        </v-row>
      </template>
      <template v-else>
        <div class="d-flex align-center">
          <h3>Submission Status</h3>
          <v-spacer />
          <v-chip v-if="prob != null" label color="primary" class="subtitle-1">
            <a :href="`/problem/${$route.params.id}`" style="color: white;">{{ 'Problem: ' + $route.params.id }} - {{ prob.problemName }}</a>
          </v-chip>
        </div>

        <v-row v-if="isHandwritten" no-gutters justify="center">
          <h3>No statistic for Handwritten!</h3>
        </v-row>

        <spinner v-if="isLoading" />
        <v-chart
          v-else
          :theme="$vuetify.theme.dark ? 'dark' : null"
          :option="pieChartOption"
          style="min-height: 400px"
        />

        <h3>Runtime Top 10</h3>

        <v-simple-table class="px-6">
          <thead>
            <tr>
              <th class="text-center">Rank</th>
              <th>Username</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in submissions" :key="item.submissionId">
              <td v-if="idx<3" class="headline text-center">{{ (idx == 0 ? '🥇' : (idx == 1 ? '🥈' : '🥉')) }}</td>
              <td v-else class="subtitle-1 text-center">{{ (idx+1) }}</td>
              <td class="subtitle-1">{{ item.user.username }}</td>
              <td class="subtitle-1">{{ item.runTime + 'ms' }}</td>
              <td class="subtitle-1">{{ item.memoryUsage + 'KB' }}</td>
              <td class="subtitle-1">{{ LANG[item.languageType] }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </template>
    </v-container>
  </div>
</template>

<script>
import { SUBMISSION_COLOR, SUBMISSION_STATUS, SUBMISSION_STATUS_CODE } from '@/constants/submissions'
import { mapState } from 'vuex'
import Spinner from '@/components/ui/Spinner.vue'

export default {
  components: { Spinner },

  name: 'Statistic',

  data () {
    return {
      LANG: ['C', 'C++', 'Python'],
      isLoading: true,
      prob: null,
      submissions: [],
      students: [],
      pieChartOption: {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            label: {
              textBorderColor: 'none',
            },
            data: [],
            color: [],
          }
        ]
      }
    }
  },

  computed: {
    isHandwritten() {
      if (!this.prob) return false
      return this.prob.type === 2
    },
    ...mapState({
      role: state => state.role
    })
  },

  created () {
    if (this.role < 2) {
      this.getProb()
    }
  },

  methods: {
    async getProb () {
      this.prob = (await this.$agent.Problem.getInfo(this.$route.params.id)).data.data
      if (this.prob.type === 2) return

      this.students = (await this.$agent.Course.getInfo(this.prob.courses[0])).data.data.students

      const params = {
        offset: 0,
        count: -1,
        course: this.prob.courses[0],
        problemId: this.$route.params.id,
      }
      const submissions = (await this.$agent.Submission.getList(params)).data.data.submissions

      const submissionStatusCount = {}
      Object.values(SUBMISSION_STATUS).forEach(status => {
        submissionStatusCount[status] = 0
      })
      const studentSubmissions = submissions.filter(subm => {
        return this.students.find(({ username }) => username === subm.user.username)
      })
      studentSubmissions.forEach(subm => {
        submissionStatusCount[SUBMISSION_STATUS[subm.status]] += 1
      })
      const submissionStatusCountArray = []
      const submissionStatusColor = []
      Object.entries(SUBMISSION_STATUS).forEach(([key, name]) => {
        if ( submissionStatusCount[name] > 0 ) {
          submissionStatusCountArray.push({ name, value: submissionStatusCount[name] })
          submissionStatusColor.push(SUBMISSION_COLOR[key])
        }
      })
      this.pieChartOption.series[0].data = submissionStatusCountArray
      this.pieChartOption.series[0].color = submissionStatusColor
      const studentACSubmissions = studentSubmissions.filter(subm => {
        return subm.status === SUBMISSION_STATUS_CODE.ACCEPTED
      })
      this.submissions = studentACSubmissions
        .sort((a, b) => {
          if (a.runTime === b.runTime) return a.memoryUsage - b.memoryUsage
          return a.runTime - b.runTime
        }).filter((value, index, arr) => {
          for (let i = 0; i < index; i++) {
            if (arr[i].user.username === value.user.username) return false
          }
          return true
        }).slice(0, 10)
      this.isLoading = false
    },
  }
}
</script>
