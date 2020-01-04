<template>
  <v-card>
    <v-card-title>
      Ranking
    </v-card-title>
    <v-simple-table
      style="max-height: 80vh"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th>User</th>
            <th>AC problems</th>
            <th>AC Submissions</th>
            <th>Total Submissions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.user.username">
            <td>{{
              (index < 3 ? ['🥇', '🥈', '🥉'][index] + ' ' : '') +
              item.user.username +
              (item.user.displayedName.length > 0 ? ` (${item.user.displayedName})` : '')
            }}</td>
            <td>{{item.ACProblem}}</td>
            <td>{{item.ACSubmission}}</td>
            <td>{{item.Submission}}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>

const API_BASE_URL = '/api';

export default {

  name: 'Ranking',

  data () {
    return {
      items: []
    }
  },

  beforeMount () {
    this.getRanking();
  },

  methods: {
    getRanking() {
      this.$http.get(`${API_BASE_URL}/ranking`)
        .then((res) => {
          console.log(res.data);
          this.showRanking(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showRanking(ranking) {
      this.items = ranking.sort((a, b) => (a.ACProblem - b.ACProblem));
    }
  }
}
</script>

<style lang="css" scoped>
</style>