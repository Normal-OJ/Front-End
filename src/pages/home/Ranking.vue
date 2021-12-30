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
              // eslint-disable-next-line vue/no-parsing-error
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
export default {

  name: 'Ranking',

  data () {
    return {
      items: []
    }
  },

  created () {
    this.getRanking()
  },

  methods: {
    getRanking () {
      this.$agent.Ranking.getInfo()
        .then((res) => {
          this.items = res.data.data.sort((a, b) => (b.ACProblem - a.ACProblem))
        })
    }
  }
}
</script>
