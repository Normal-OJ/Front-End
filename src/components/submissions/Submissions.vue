<template>
  <v-card>
    <v-card-title>
      Submissions
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
    >
    </v-data-table>
  </v-card>
</template>

<script>
export default {

  name: 'Submissions',

  data () {
    return {
      headers: [
        {
          text: '#',
          value: 'submissionId',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'Problem ID',
          value: 'problemId',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'User',
          value: 'username',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'Result',
          value: 'status',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'Run Time',
          value: 'runTime',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'Memory Usage',
          value: 'memoryUsage',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'Language',
          value: 'languageType',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'Score',
          value: 'score',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'Timestamp',
          value: 'timestamp',
          align: 'left'
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          // width?: string | number
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
      ],
      items: []
    }
  },

  created () {
    for ( let i=0; i<10; i++ ) {
      this.$http.post('/api/submission', {'problemId': `ds0${i}`, 'languageType': 0})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  },

  beforeMount () {
    this.getSubmission();
  },

  methods: {
    getSubmission() {
      this.$http.get('/api/submission?offset=0&count=10')
        .then((res) => {
          console.log(res.data);
          console.log(res.data.length);
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