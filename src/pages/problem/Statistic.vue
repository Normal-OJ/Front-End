<template>
  <div>
    <v-row justify="center">
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
              <th class="font-weight-bold subtitle-1 text--primary">Username</th>
              <th class="font-weight-bold subtitle-1 text--primary">Runtime</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in subm" :key="item.submissionId">
              <td class="subtitle-1">{{ item.user.username }}</td>
              <td class="subtitle-1">{{ item.runTime + 'ms' }}</td>
            </tr>
          </tbody>
        </v-simple-table>

      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {

  name: 'Statistic',

  data () {
    return {
      prob: null,
      subm: null,
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      students: null,
    }
  },

  created() {
    this.getProb();
  },

  mounted() {
    let canvasScript = document.createElement('script')
    canvasScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js')
    document.head.appendChild(canvasScript)
  },

  methods: {
    getProb() {
      this.$http.get(`/api/problem/view/${this.$route.params.id}`)
        .then((res) => {
          this.prob = res.data.data;
          return this.prob.courses[0];
        })
        .then((co) => {
          return this.$http.get(`/api/course/${co}`)
        })
        .then((res) => {
          this.students = res.data.data.studentNicknames;
          return this.$http.get(`/api/submission?offset=0&count=-1&course=${this.prob.courses[0]}&problemId=${this.$route.params.id}`)
        })
        .then((res) => {
          res.data.data.submissions.forEach((ele, idx) => {
            if ( this.inCourse(ele.user.username) ) {
              if ( ele.status != -1 ) {
                this.data[ele.status]++;
              } else {
                delete res.data.data.submissions[idx];
              }
            } else {
              delete res.data.data.submissions[idx];
            }
          })
          draw(this.data);
          this.subm = res.data.data.submissions
            .sort((a, b) => {
              return a.runTime - b.runTime;
            }).filter((value, index, self) => { 
              for ( let i=0; i<index; i++ ) {
                if ( self[i].user.username === value.user.username ) return false;
              }
              return true;
            }).slice(0, 10);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    inCourse(user) {
      for ( var key in this.students ) {
        if ( key === user ) return true;
      }
      return false;
    },
  },
}
import Statistic from './Statistic'
var draw = function(data) {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      datasets: [{
        label: '# of Votes',
        data: data,
        backgroundColor: [
          "#00C853CC",
          "#F44336CC",
          "#DD2C00CC",
          "#9C27B0CC",
          "#FF9800CC",
          "#2196F3CC",
          "#93282CCC",
          "#BF360CCC",
        ],
      }]
    },
    options: {
      tooltips: {
        titleFontSize: 18,
        bodyFontSize: 16,
      },
      legend: {
        labels: {
          fontColor: 'black',
          fontSize: 16,
        }
      }
    }
  });
}
</script>

<style lang="css" scoped>
</style>