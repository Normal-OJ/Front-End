<template>
  <v-card>
    <v-card-title>
      Problems

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>

    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :sort-by="['problemId']"
      :sort-desc="[false]"
      :loading="loading"
      :footer-props="{itemsPerPageOptions: rowsPerPageItems}"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
    >

      <template v-slot:item.problemName="{item}">
        <a :href="item.link" title="Click to view the problem.">
          {{item.problemName}}
        </a>
      </template>

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
            :ripple="false"calories
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

const API_BASE_URL = '/api';

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
          text: 'Title',
          value: 'problemName',
          align: 'left'
        },
        {
          text: 'Type',
          value: 'type',
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
      items: [],
      search: '',
      itemsPerPage: 10,
      page: 1,
      rowsPerPageItems: [5, 10, 20, 50, 100]
    }
  },

  created () {
  },

  beforeMount () {
    this.getProblems(0, 10);
  },

  watch: {
    page() {
      this.getProblems((this.page - 1) * this.itemsPerPage, this.itemsPerPage);
    },
    itemsPerPage() {
      this.getProblems((this.page - 1) * this.itemsPerPage, this.itemsPerPage);
    }
  },

  computed: {
    filteredItems() {
      if (typeof (this.search) !== 'string' || this.search.length === 0)
        return this.items;

      console.log('search');
      console.log(this.items);

      let keys = this.search.split(' ');
      console.log(keys);

      let result = this.items.filter(item => {
        let ok = false;

        keys.forEach(key => {
          if (key.length > 0) {
            key = key.toLowerCase();
            if (item.problemId.toLowerCase() === key ||
                item.problemName.toLowerCase().indexOf(key) !== -1 ||
                item.type.toLowerCase() === key ||
                item.tags.findIndex(v => v.toLowerCase() === key) !== -1
                ) {
              ok = true;
            }
          }
          console.log({item: item.problemName, key, ok});
        });

        return ok;
      });

      return result;
    }
  },

  methods: {
    getProblems(offset=0, count=10) {
      this.loading = true;
      this.$http.get(`${API_BASE_URL}/problem?offset=${offset | 0}&count=${count | 0}`)
        .then((res) => {
          this.loading = false;
          console.log(this);
          console.log(this.loading);
          console.log(res.data);
          this.showProblems(res.data.data);
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        })
    },

    // transform problems: compute their type, link, AC rate, activity
    showProblems(problems) {
      const items = [];
      problems.forEach(problem => {
        items.push({
          ...problem,
          type: problem.type == 0 ? 'Normal' : 'Fill-in-the-blank',
          acRate: `${Math.round(problem.ACUser / problem.submitter * 100)}%`,
          activity: `${problem.ACUser}/${problem.submitter}`,
          link: `/problem/${problem.problemId}`
        });
      });
      this.items = items;
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
        type: 1,
        problemName: 'Forest',
        tags: ['DP', 'bonus'],
        ACUser: 7,
        submitter: 60
      }];
    }
  }
}
</script>

<style lang="css" scoped>
</style>