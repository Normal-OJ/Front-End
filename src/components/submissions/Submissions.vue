<template>
  <v-card>
    <v-card-title>
      Submissions
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :footer-props="{itemsPerPageOptions: rowsPerPageItems}"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
    >

      <template v-slot:item="{item}">
        <tr>
          <td>
            <a :href="`/submission/${item.submissionId}`" title="Click to view the details.">
              {{item.submissionId}}
            </a>
          </td>
          <td>
            <a :href="`/problem/${item.problemId}`" title="Click to view the problem.">
              {{item.problemId}}
            </a>
          </td>
          <td>{{item.username}}</td>
          <td>
            <v-chip
              :label="true"
              :ripple="false"
              small
              v-text="STATUS[item.status + 1]"
              text-color="white"
              :color="STATUS_COLOR[item.status + 1]"
              :title="STATUS_REASON[item.status + 1]"
            ></v-chip>
          </td>
          <td class="text-right">{{item.score}}</td>
          <td class="text-right">{{item.runTime}}</td>
          <td class="text-right">{{item.memoryUsage}}</td>
          <td>
            <v-chip
              :label="true"
              :ripple="false"
              small
              v-text="LANG[item.languageType]"
              text-color="white"
              :color="LANG_COLOR[item.languageType]"
            ></v-chip>
          </td>
          <td>
            <span style="color: grey">{{timeFormat(item.timestamp).split(' ')[0]}}</span>
            &nbsp;
            <span>{{timeFormat(item.timestamp).split(' ')[1]}}</span>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

const API_BASE_URL = '/api';

export default {

  name: 'Submissions',

  data () {
    return {
      headers: [
        {text: '#', value: 'submissionId'},
        {text: 'Problem ID', value: 'problemId'},
        {text: 'User', value: 'username'},
        {text: 'Result', value: 'status'},
        {text: 'Score', value: 'score'},
        {text: 'Run Time (ms)', value: 'runTime'},
        {text: 'Memory Usage (KB)', value: 'memoryUsage'},
        {text: 'Language', value: 'languageType'},
        {text: 'Timestamp', value: 'timestamp'},
      ],
      items: [],
      itemsPerPage: 10,
      loading: false,
      page: 1,
      rowsPerPageItems: [5, 10, 20, 50, 100],

      LANG: ['C (c11)', 'C++ (c++11)', 'Python (py3)'],
      LANG_COLOR :['#1565C0', '#4527A0', '#2E7D32'],
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      STATUS_COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C', '#BF360C'],
      STATUS_REASON: [
        'Your code is pending by our judge, please wait.',
        'You solved the problem! Congrats!',
        'Output is not correct. keep going!',
        'Your code cannot be compiled correctly.',
        'Runtime of your program is over the limit.',
        'Memory Usage of your program over the limit.',
        'Errors occurred while your prgram was running or invalid system call.',
        'Bang! you broke our judge, please contact us.',
        'Output of your program is over the limit.',
      ]
    }
  },

  created () {
    // for ( let i=0; i<10; i++ ) {
    //   this.$http.post(`${API_BASE_URL}/submission`, {'problemId': `ds0${i}`, 'languageType': 0})
    //     .then((res) => {
    //       console.log(res.data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    // }
  },

  beforeMount () {
    this.getSubmissions();
  },

  watch: {
    page() {
      this.getSubmissions();
    },
    itemsPerPage() {
      this.getSubmissions();
    }
  },

  methods: {
    getSubmissions() {
      const offset = (this.page - 1) * this.itemsPerPage;
      const count = this.itemsPerPage;
      this.loading = true;

      this.$http.get(`${API_BASE_URL}/submission?offset=${offset}&count=${count}`)
        .then((res) => {
          this.loading = false;
          console.log(res.data);
          this.showSubmissions(res.data.data.submissions);
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },

    showSubmissions(submissions) {
      this.items = [...submissions, ...this.getFakeData()];
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

    getFakeData() {
      return [
        {
          problemId: '0070',
          submissionId: '0171',
          username: 'aa5376537',
          languageType: 1,
          timestamp: 1578037200,
          status: 1,
          score: 40,
          runTime: 330,
          memoryUsage: 23
        },
        {
          problemId: '0070',
          submissionId: '0172',
          username: 'aa5376537',
          languageType: 2,
          timestamp: 1578037220,
          status: 1,
          score: 80,
          runTime: 120,
          memoryUsage: 17
        },
        {
          problemId: '0071',
          submissionId: '0173',
          username: 'shu_kong_kai',
          languageType: 1,
          timestamp: 1578037240,
          status: 2,
          score: 0,
          runTime: 2500,
          memoryUsage: 560
        },
      ];
    }
  }
}
</script>

<style lang="css" scoped>
</style>