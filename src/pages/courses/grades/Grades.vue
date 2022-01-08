<template>
  <div>
    <v-card class="ma-3">
      <v-simple-table class="px-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Score</th>
            <th>Description</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.title"
          >
            <td class="subtitle-1">{{ item.title }}</td>
            <td class="subtitle-1">{{ item.score }}</td>
            <td class="subtitle-1" style="white-space: pre;">{{ item.content }}</td>
            <td class="subtitle-1">{{ $formatTime(item.timestamp) }}</td>
          </tr>
          <tr v-show="loading">
            <td colspan="4">
              <v-skeleton-loader
                class="mx-auto"
                type="table-row"
              ></v-skeleton-loader>
            </td>
          </tr>
          <tr v-if="!loading && (!items || items.length===0)">
            <td class="subtitle-1" colspan="4">🦄 No data available.</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {

  name: 'Grades',

  data () {
    return {
      items: null,
      loading: false
    }
  },

  computed: {
    ...mapState({
      username: state => state.username
    })
  },

  created () {
    this.getGrade(this.username)
  },

  methods: {
    getGrade (user) {
      this.loading = true
      this.$agent.Course.getGrade(this.$route.params.name, user)
        .then((res) => {
          this.items = res.data.data
        })
        .finally(() => {
          this.loading = false
        })
    }

  }
}
</script>
