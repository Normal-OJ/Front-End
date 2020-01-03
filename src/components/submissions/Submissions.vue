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

      <template v-slot:item.submissionId="{item}">
        <a :href="`/submission/${item.submissionId}`" title="Click to view the details.">
          {{item.submissionId}}
        </a>
      </template>

      <template v-slot:item.problemId="{item}">
        <a :href="`/problem/${item.problemId}`" title="Click to view the problem.">
          {{item.problemId}}
        </a>
      </template>

      <template v-slot:item.status="{item}">
        <v-chip
          :label="true"
          :ripple="false"
          small
        >
          {{ ['Pending', 'AC', 'WA', 'CE', 'TLE', 'MLE', 'RE', 'JE', 'OLE'][item.status + 1] }}
        </v-chip>
      </template>

      <template v-slot:item.languageType="{item}">
        <v-chip
          :label="true"
          :ripple="false"
          small
        >
          {{ ['C', 'C++', 'Python 3'][item.languageType] }}
        </v-chip>
      </template>

      <template v-slot:item.timestamp="{item}">
        {{(() => {
          const leadingZero = (num, pad) => {
            let str = num.toString(10);
            while (str.length < pad)
              str = `0${str}`;
            return str;
          };

          date = new Date(parseInt(item.timestamp, 10));
          return
              leadingZero(date.getFullYear(), 4) + '-' +
              leadingZero(date.getMonth() + 1, 2) + '-' +
              leadingZero(date.getDate(), 2) + ' ' +
              leadingZero(date.getHours(), 2) + ':' +
              leadingZero(date.getMinutes(), 2) + ':' +
              leadingZero(date.getSeconds(), 2);
        })()}}
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
        {
          text: '#',
          value: 'submissionId',
          align: 'left'
        },
        {
          text: 'Problem ID',
          value: 'problemId',
          align: 'left'
        },
        {
          text: 'User',
          value: 'username',
          align: 'left'
        },
        {
          text: 'Result',
          value: 'status',
          align: 'left'
        },
        {
          text: 'Score',
          value: 'score',
          align: 'right'
        },
        {
          text: 'Run Time (ms)',
          value: 'runTime',
          align: 'right'
        },
        {
          text: 'Memory Usage (KB)',
          value: 'memoryUsage',
          align: 'right'
        },
        {
          text: 'Language',
          value: 'languageType',
          align: 'left'
        },
        {
          text: 'Timestamp',
          value: 'timestamp',
          align: 'left'
        },
      ],
      items: [],
      itemsPerPage: 10,
      loading: false,
      page: 1,
      rowsPerPageItems: [5, 10, 20, 50, 100]
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

    getFakeData() {
      return [
        {
          problemId: '0070',
          submissionId: '0171',
          username: 'aa5376537',
          languageType: 1,
          timestamp: 1578037200000,
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
          timestamp: 1578037220000,
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
          timestamp: 1578037240000,
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