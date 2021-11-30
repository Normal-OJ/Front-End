<template>
  <div>
    <v-row justify="center"  v-if="user.role >= 2">
      <h3>Sorry, statistic page is temporary closed due to technical issue. 😢</h3>
    </v-row>
    <v-row v-else justify="center">
      <v-card
        :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'"
        class="my-6"
      >
        <v-row no-gutters>
          <v-card-title class="headline text-center">
            Statistic
          </v-card-title>
          <v-spacer/>
          <v-chip v-if="prob != null" label color="primary" class="subtitle-1">
            <a :href="`/problem/${$route.params.id}`" style="color: white;">{{ 'Problem: ' + $route.params.id }} - {{ prob.problemName }}</a>
          </v-chip>
        </v-row>

        <v-row no-gutters justify="center">
          <h3 v-if="hand">No statistic for Handwritten!</h3>
          <h3 v-if="login">Not Found, login first if you haven't</h3>
        </v-row>
        <v-skeleton-loader
          v-show="loading"
          class="mx-auto"
          width="80%"
          type="image"
        ></v-skeleton-loader>

        <canvas
          id="myChart"
          :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'"
          height="30vh"
        ></canvas>

        <v-card-title class="headline text-center">
          Runtime Top 10
        </v-card-title>

        <v-simple-table class="px-6">
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary text-center">Rank</th>
              <th class="font-weight-bold subtitle-1 text--primary">Username</th>
              <th class="font-weight-bold subtitle-1 text--primary">Runtime</th>
              <th class="font-weight-bold subtitle-1 text--primary">Memory</th>
              <th class="font-weight-bold subtitle-1 text--primary">Language</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in subm" :key="item.submissionId">
              <td v-if="idx<3" class="headline text-center">{{ (idx == 0 ? '🥇' : (idx == 1 ? '🥈' : '🥉')) }}</td>
              <td v-else class="subtitle-1 text-center">{{ (idx+1) }}</td>
              <td class="subtitle-1">{{ item.user.username }}</td>
              <td class="subtitle-1">{{ item.runTime + 'ms' }}</td>
              <td class="subtitle-1">{{ item.memoryUsage + 'KB' }}</td>
              <td class="subtitle-1">{{ LANG[item.languageType] }}</td>
            </tr>
            <tr v-show="loading">
              <td colspan="4">
                <v-skeleton-loader
                  class="mx-auto"
                  type="table-row"
                ></v-skeleton-loader>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

      </v-card>
    </v-row>
  </div>
</template>

<script>
import User from '@/utils/user'

export default {

  name: 'Statistic',

  data () {
    return {
      LANG: ['C', 'C++', 'Python', 'Handwritten'],
      loading: true,
      prob: null,
      subm: null,
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      students: null,
      hand: false,
      login: false,
      user: new User(this.$cookies.get('jwt'))
    }
  },

  created () {
    // only teacher and admin can view statistic
    if (this.user.role < 2) {
      this.getProb()
    }
  },

  mounted () {
    const canvasScript = document.createElement('script')
    canvasScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js')
    document.head.appendChild(canvasScript)
  },

  methods: {
    getProb () {
      this.$http.get(`/api/problem/view/${this.$route.params.id}`)
        .then((res) => {
          this.prob = res.data.data
          if (this.prob.type === 2) {
            this.loading = false
            this.hand = true
            return
          }
          return this.prob.courses[0]
        })
        .then((co) => {
          return this.$http.get(`/api/course/${co}`)
        })
        .then((res) => {
          this.students = res.data.data.students
          const params = {
              offset: 0,
              count: -1,
              course: this.prob.courses[0],
              problemId: this.$route.params.id,
          }
          return this.$http.get('/api/submission', { params })
        })
        .then((res) => {
          res.data.data.submissions.forEach((ele, idx) => {
            if (this.inCourse(ele.user.username)) {
              if (ele.status !== -1) {
                this.data[ele.status]++
              }
              if (ele.status !== 0) {
                delete res.data.data.submissions[idx]
              }
            } else {
              delete res.data.data.submissions[idx]
            }
          })
          this.loading = false
          draw(this.data)
          this.subm = res.data.data.submissions
            .sort((a, b) => {
              if (a.runTime === b.runTime) {
                return a.memoryUsage - b.memoryUsage
              }
              return a.runTime - b.runTime
            }).filter((value, index, self) => {
              for (let i = 0; i < index; i++) {
                if (self[i].user.username === value.user.username) return false
              }
              return true
            }).slice(0, 10)
        })
        .catch((err) => {
          this.loading = false
          if (!this.hand) this.login = true
          console.log(err)
        })
    },
    inCourse (user) {
      for (const { username } of this.students) {
        if (username === user) return true
      }
      return false
    }
  }
}
var draw = function (data) {
  var ctx = document.getElementById('myChart').getContext('2d')
  // eslint-disable-next-line no-unused-vars, no-undef
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      datasets: [{
        label: '# of Votes',
        data: data,
        backgroundColor: [
          '#00C853CC',
          '#F44336CC',
          '#DD2C00CC',
          '#9C27B0CC',
          '#FF9800CC',
          '#2196F3CC',
          '#93282CCC',
          '#BF360CCC'
        ]
      }]
    },
    options: {
      tooltips: {
        titleFontSize: 18,
        bodyFontSize: 16
      },
      legend: {
        labels: {
          fontColor: 'black',
          fontSize: 16
        }
      }
    }
  })
}
</script>
