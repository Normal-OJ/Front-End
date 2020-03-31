<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '75vw' : '95vw', height: '100%' }"
  >
    <v-bottom-navigation
      v-if="0"
      class="mb-3"
      color="primary"
      style="
          -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
        "
    >
      <v-card elevation="0" tile><v-card-text class="subtitle-1">Problem Filter(Coming Soon)</v-card-text></v-card>
      <!-- <v-btn class="subtitle-2">
        <span>My Submissions</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn class="subtitle-2">
        <span>All Submissions</span>
        <v-icon>mdi-account-group</v-icon>
      </v-btn> -->
    </v-bottom-navigation>

    <v-card height="100%" elevation="2">
      <v-card-title class="font-weight-bold">
        Problems
        <v-pagination
          v-model="page"
          :page="page"
          :length="length"
          total-visible="7"
        ></v-pagination>
      </v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary">ID</th>
              <th class="font-weight-bold subtitle-1 text--primary">Name</th>
              <th class="font-weight-bold subtitle-1 text--primary">Type</th>
              <th class="font-weight-bold subtitle-1 text--primary">Tags</th>
              <th class="font-weight-bold subtitle-1 text--primary">Score</th>
              <th class="font-weight-bold subtitle-1 text--primary">Statistic</th>
              <!-- <th class="font-weight-bold subtitle-1 text--primary">AC rate</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.submissionId">
              <td class="subtitle-1">{{ item.problemId }}</td>
              <td class="subtitle-1">
                <a target="_blank" rel="noopener noreferrer" :href="'/problem/'+item.problemId">
                  {{ item.problemName }}
                </a>
              </td>
              <td class="subtitle-1">{{ item.type===0 ? 'Programming' : 'Handwritten' }}</td>
              <td class="subtitle-1">
                <v-chip 
                  class="mx-1"
                  v-for="tag in item.tags"
                  :key="tag"
                  label small
                >{{ tag }}</v-chip>
              </td>
              <td class="subtitle-1" v-text="item.score"></td>
              <td class="subtitle-1" v-if="item.type===0">
                <v-btn :to="`/problem/${item.problemId}/statistic`" class="text-none subtitle-1" color="info" small text>
                  <v-icon>mdi-chart-arc</v-icon>
                </v-btn>
              </td>
              <td v-else></td>
              <!-- <td>{{ item.ACUser + '/' + item.submitter }}</td> -->
            </tr>
            <tr v-show="loading">
              <td colspan="6">
                <v-skeleton-loader
                  class="mx-auto"
                  type="table-row"
                ></v-skeleton-loader>
              </td>
            </tr>
            <tr v-if="!loading && (!items || items.length===0)">
              <td class="subtitle-1" colspan="6">🦄 No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
export default {

  name: 'Problems',

  data () {
    return {
      page: 1,
      items: null,
      loading: false,
    }
  },

  created() {
    this.getProblems();
  },

  computed: {
    length() {
      return this.page+8;
    }
  },

  watch: {
    page() {
      this.getProblems();
    }
  },

  methods: {
    getProblems() {
      this.loading = true;
      var query = `?offset=${(this.page-1)*10}&count=${10}&course=${this.$route.params.name}`;
      this.items = [];
      this.$http.get(`/api/problem${query}`)
        .then((res) => {
          // console.log(res.data.data);
          this.items = res.data.data;
        })
        .then(() => {
          this.items.forEach((ele, idx) => {
            this.$http.get(`/api/problem/${ele.problemId}/high-score`)
              .then((res) => {this.$set(this.items[idx], 'score', res.data.data.score)})
              .catch((err) => console.log(err))
          })
          this.loading = false;
        })
        .catch((err) => {
          // console.log(err);
          this.loading = false;
        });
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
  }

}
</script>

<style lang="css" scoped>
</style>