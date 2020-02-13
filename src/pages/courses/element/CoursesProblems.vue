<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '50vw' : '75vw', height: '100%' }"
  >
    <v-card height="100%" elevation="2">
      <v-card-title>
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
              <th class="font-weight-bold subtitle-1 text--primary" style="width: auto;">ID</th>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: auto;">Problem</th>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: auto;">Type</th>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: auto;">Tags</th>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: auto;">AC rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.submissionId">
              <td>{{ item.problemId }}</td>
              <td>{{ item.problemName }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.tags }}</td>
              <td>{{ item.acRate }}</td>
            </tr>
          </tbody>
          <!-- <tbody>
            <tr v-if="perm!==-1 && perm <= 1">
              <td colspan="3" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? '#eee' : '#fff' }"
                    @click="dialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon color="black">mdi-plus</v-icon>New Course</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr v-for="item in items" :key="item.title">
              <td class="subtitle-1"><a :href="`/course/${item.title}`">{{ item.title }}</a></td>
              <td class="subtitle-1">{{ item.teacher.username }}</td>
              <td class="subtitle-1">
                <span class="pr-1" v-for="ta in item.ta">{{ ta }}</span>
              </td>
            </tr>
            <tr v-if="items.length===0">
              <td>You have not enrolled in any course.</td>
              <td></td>
              <td></td>
            </tr>
          </tbody> -->
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
      items: [],
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
      // var query = `?offset=${(this.page-1)*10}&count=${10}`;

      // // this.loading = true;

      // this.$http.get(`/api/submission${query}`)
      //   .then((res) => {
      //     // this.loading = false;
      //     console.log(res.data.data);
      //     this.items = res.data.data.submissions;
      //   })
      //   .catch((err) => {
      //     // this.loading = false;
      //     console.log(err);
      //   });
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