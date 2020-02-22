<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '50vw' : '75vw', height: '100%' }"
  >
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
              <th class="font-weight-bold subtitle-1 text--primary">AC rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.submissionId">
              <td>{{ item.problemId }}</td>
              <td>
                <a target="_blank" rel="noopener noreferrer" :href="'/problem/'+item.problemId">
                  {{ item.problemName }}
                </a>
              </td>
              <td>{{ item.type }}</td>
              <td>
                <v-chip 
                  class="mx-1"
                  v-for="tag in item.tags"
                  :key="tag"
                  label small
                >{{ tag }}</v-chip>
              </td>
              <td>{{ item.ACUser + '/' + item.submitter }}</td>
            </tr>
            <tr v-if="items && items.length===0">
              <td colspan="5">🦄 No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
export default {

  name: 'CoursesProblems',

  data () {
    return {
      page: 1,
      items: null,
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
      var query = `?offset=${(this.page-1)*10}&count=${10}`;

      // this.loading = true;

      this.$http.get(`/api/problem${query}`)
        .then((res) => {
          console.log(res.data.data);
          this.items = res.data.data;
          // this.loading = false;
        })
        .catch((err) => {
          // this.loading = false;
          // console.log(err);
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