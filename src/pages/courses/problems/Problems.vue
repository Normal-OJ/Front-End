<template>
  <v-container :style="{ height: '100%' }">
    <v-card>
      <v-card-title>
        Problems
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="15"
        :search="search"
        :loading="loading"
      >
        <template v-slot:[`item.problemId`]="{ item }">
          <a class="subtitle-1" :href="'/problem/'+item.problemId" rel="noopener noreferrer" target="_blank">{{ item.problemId }}</a>
        </template>
        <template v-slot:[`item.problemName`]="{ item }">
          <a class="subtitle-1" :href="'/problem/'+item.problemId" rel="noopener noreferrer" target="_blank">{{ item.problemName }}</a>
        </template>
        <template v-slot:[`item.tags`]="{ item }">
          <v-chip
            class="mx-1"
            v-for="tag in item.tags"
            :key="tag"
            label small
          >{{ tag }}</v-chip>
        </template>
        <template v-slot:[`item.statistic`]="{ item }">
          <v-btn :href="`/problem/${item.problemId}/statistic`" rel="noopener noreferrer" target="_blank" color="info" small text>
            <v-icon>mdi-chart-arc</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {

  name: 'Problems',

  data () {
    return {
      search: '',
      headers: [
        { text: 'ID', value: 'problemId' },
        { text: 'Name', value: 'problemName', sortable: false },
        { text: 'Type', value: 'type' },
        { text: 'Tags', value: 'tags' },
        { text: 'Quota', value: 'quota', filterable: false },
        { text: 'Score', value: 'score', filterable: false },
        { text: 'Statistic', value: 'statistic', sortable: false, filterable: false }
      ],
      items: null,
      loading: false
    }
  },

  created () {
    this.getProblems()
  },

  methods: {
    getProblems () {
      this.loading = true
      const filter = {
        offset: 0,
        count: -1,
        course: this.$route.params.name
      }
      this.items = []
      this.$agent.Problem.getList(filter)
        .then((res) => {
          this.items = res.data.data
          this.items.forEach((ele, idx) => {
            this.$agent.Problem.getHighScore(ele.problemId)
              .then(r => { this.$set(this.items[idx], 'score', r.data.data.score) })
          })
          return this.items
        })
        .then((r) => {
          this.items = r.map(p => {
            p.type = (p.type === 0 ? 'Programming' : 'Handwritten')
            if (p.quota === -1) p.quota = 'unlimited'
            return p
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }

}
</script>
