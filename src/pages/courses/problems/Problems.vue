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
        { text: 'ID', value: 'problemId', class: 'font-weight-bold subtitle-1 text--primary' },
        { text: 'Name', value: 'problemName', class: 'font-weight-bold subtitle-1 text--primary', sortable: false },
        { text: 'Type', value: 'type', class: 'font-weight-bold subtitle-1 text--primary' },
        { text: 'Tags', value: 'tags', class: 'font-weight-bold subtitle-1 text--primary' },
        { text: 'Quota', value: 'quota', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
        { text: 'Score', value: 'score', class: 'font-weight-bold subtitle-1 text--primary', filterable: false },
        { text: 'Statistic', value: 'statistic', class: 'font-weight-bold subtitle-1 text--primary', sortable: false, filterable: false }
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
      this.$http.get('/api/problem', { params: filter })
        .then((res) => {
          this.items = res.data.data
          this.items.forEach((ele, idx) => {
            this.$http.get(`/api/problem/${ele.problemId}/high-score`)
              .then(r => { this.$set(this.items[idx], 'score', r.data.data.score) })
              .catch(e => console.log(e))
          })
          return this.items
        })
        .then((r) => {
          this.items = r.map(p => {
            p.type = (p.type === 0 ? 'Programming' : 'Handwritten')
            if (p.quota === -1) p.quota = 'unlimited'
            return p
          })
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    }
  }

}
</script>
