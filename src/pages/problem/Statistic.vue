<template>
  <div>
    <v-row justify="center">
      <v-card
        v-if="prob != null"
        :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'"
        class="my-6"
      >
        <v-card-title class="display-2 text-center">
          Statistic
        </v-card-title>
        <v-card-title class="headline" style="white-space: pre;">
          {{ 'Problem: ' }} 
          <a :href="`/problem/${$route.params.id}`">{{ $route.params.id }} - {{ prob.problemName }}</a>
        </v-card-title>
        <canvas 
          id="myChart"
          :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'"
          height="30vh"
        ></canvas>

        <v-card-title class="display-2 text-center">
          Top 10 efficient
        </v-card-title>

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
          // console.log('res:', res);
          this.prob = res.data.data;
        })
        .catch((err) => {
        })
    },
  },
}

window.onload = function() {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      datasets: [{
        label: '# of Votes',
        data: [78, 111, 3, 50, 2, 19, 0, 0],
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