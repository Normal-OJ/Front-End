<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-card height="100%" width="100%">
          <v-card-title>problemId: {{ data.problemId }}</v-card-title>
          <v-card-title>languageType: {{ data.languageType }}</v-card-title>
          <v-card-title>timestamp: {{ data.timestamp }}</v-card-title>
          <v-card-title>status: {{ data.status }}</v-card-title>
          <v-card-title>score: {{ data.score }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th 
                  v-for="header in submHeader"
                  :key="header"
                  class="text-left"
                ><p class="title" v-text="header"></p></th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(data, idx) in submData"
                :key="idx"
              ><td
                  v-for="header in submHeader"
                  :key="header"
                ><p class="title" v-text="data[header]"></p></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-card height="100%" width="100%">
        <v-card-subtitle
          v-for="(data, idx) in submData"
          :key="idx"
        >{{ data.stderr }}</v-card-subtitle>
      </v-card>
    </v-row>
    <v-row>
      <v-card height="100%" width="100%">
        {{ data.code }}
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {

  name: 'Submission',

  data () {
    return {
      submHeader: ['#', 'Status', 'Run Time', 'Memory'],
      submData: [],
      data: [],
    }
  },

  beforeMount() {
    this.getSubm();
  },

  methods: {
    getSubm() {
      this.$http.get(`/api/submission/${this.$route.params.id}`)
        .then((res) => {
          console.log(res);
          this.data = res.data.data;
          res.data.data.cases.forEach((ele, idx) => {
            this.submData.push({
              '#': idx+1,
              'Status': ele.status,
              'Run Time': ele.runTime,
              'Memory': ele.memoryUsage,
              'stderr': ele.stderr,
              'code': ele.code,
            })
          });
          console.log(this.submData);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>