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
          text: 'Run Time',
          value: 'runTime',
          align: 'left'
        },
        {
          text: 'Memory Usage',
          value: 'memoryUsage',
          align: 'left'
        },
        {
          text: 'Language',
          value: 'languageType',
          align: 'left'
        },
        {
          text: 'Score',
          value: 'score',
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
      this.items = submissions;
    }
  }
}
</script>

<style lang="css" scoped>
</style>