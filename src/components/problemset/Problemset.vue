<template>
  <v-card>
    <v-card-title>
      Problems
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
    >
      <template v-slot:item.acRate="{item}">
        <v-progress-circular
          color="green"
          :rotate="-90"
          :value="item.acRate"
        >
          <span class="caption" style="color: black">
            {{item.acRate}}
          </span>
        </v-progress-circular>
      </template>

      <template v-slot:item.tags="{item}">
        <v-chip-group
          :column="true"
        >
          <v-chip v-for="tag in item.tags" :key="tag"
            color="secondary"
            :label="true"
            :outlined="true"
            :ripple="false"
            x-small
          >
            {{tag}}
          </v-chip>
        </v-chip-group>
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
export default {

  name: 'Problemset',

  data () {
    return {
      headers: [
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
          text: 'Type',
          value: 'type',
          align: 'left'
        },
        {
          text: 'Title',
          value: 'problemName',
          align: 'left'
        },
        {
          text: 'tags',
          value: 'tags',
          align: 'left'
        },
        {
          text: 'AC rate',
          value: 'acRate',
          align: 'center',
          sort: (a, b) => (parseFloat(a) - parseFloat(b))
        },
        {
          text: 'Activity',
          value: 'activity',
          align: 'center',
          sort: (a, b) => (parseInt(a.split('/')[1], 10) - parseInt(b.split('/')[1], 10))
        },
      ],
      items: []
    }
  },

  created () {
  },

  beforeMount () {
    this.getProblems();
    this.transformProblems(this.getFakeProblems()).forEach(problem => {
      this.items.push(problem);
    });
  },

  methods: {
    getProblems() {
      this.$http.get('/api/problem?offset=0&count=10')
        .then((res) => {
          console.log(res.data);
          console.log(res.data.length);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    transformProblems(problems) {
      const items = [];
      problems.forEach(problem => {
        items.push({
          ...problem,
          acRate: `${Math.round(problem.ACUser / problem.submitter * 100)}%`,
          activity: `${problem.ACUser}/${problem.submitter}`});
      });
      return items;
    },
    getFakeProblems() {
      return [{
        problemId: '0087',
        type: 0,
        problemName: 'Triangle Wave',
        tags: ['DP'],
        ACUser: 34,
        submitter: 42
      },
      {
        problemId: '0070',
        type: 0,
        problemName: 'Forest',
        tags: ['DP', 'bonus'],
        ACUser: 2,
        submitter: 60
      }];
    }
  }
}
</script>

<style lang="css" scoped>
</style>