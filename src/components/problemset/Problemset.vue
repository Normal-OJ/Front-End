<template>
  <v-card class="px-6" style="height: 100%;">
    <v-card-title class="headline pt-6 pb-0">
      <v-row no-gutters>
        <v-col cols="12" md="2" class="pt-3">
          Problems
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="filter.problemId"
            label="Search Id"
            class="pr-6"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="filter.name"
            label="Search Name"
            class="pr-6"
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="2" class="pt-3">
          <v-btn
            class="text-none title"
            dark
            color="primary"
            @click="topFilter"
          >Filter</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="6" md="2" class="pt-3" v-if="perm">
          <v-btn
            class="text-none title"
            dark
            color="primary"
            :to="{'path': '/manage'}"
          ><v-icon>mdi-settings</v-icon>Manage Problems</v-btn>
        </v-col>
      </v-row>
      <!-- <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field> -->

    </v-card-title>
    <v-card-text>
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
          <a :href="item.link" class="title" title="Click to view the problem.">
            {{item.problemName}}
          </a>
        </template>

        <template v-slot:item.acRate="{item}">
          <v-progress-circular
            class="my-1"
            size="48"
            :color="item.acRate==='NaN%' ? 'rgba(1,1,1,0)' : 'green'"
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
            >
              {{tag}}
            </v-chip>
          </v-chip-group>
        </template>

      </v-data-table>
    </v-card-text>
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
          align: 'left',
          class: 'title',
          // sortable?: false
          // filterable?: false
          // divider?: false
          // class?: string | string[]
          width: '12%'
          // filter?: (value: any, search: string, item: any) => boolean
          // sort?: (a: any, b: any) => number
        },
        {
          text: 'Title',
          value: 'problemName',
          align: 'left',
          class: 'title',
        },
        {
          text: 'Type',
          value: 'type',
          align: 'left',
          class: 'title',
        },
        {
          text: 'tags',
          value: 'tags',
          align: 'left',
          class: 'title',
        },
        {
          text: 'AC rate',
          value: 'acRate',
          align: 'center',
          class: 'title',
          sort: (a, b) => (parseFloat(a) - parseFloat(b))
        },
        {
          text: 'Activity',
          value: 'activity',
          align: 'center',
          class: 'title',
          sort: (a, b) => (parseInt(a.split('/')[1], 10) - parseInt(b.split('/')[1], 10))
        },
      ],
      items: [],
      filter: {
        offset: '',
        count: '',
        problemId: '',
        name: '',
        tag: '',
      },
      // search: '',
      itemsPerPage: 10,
      page: 1,
      rowsPerPageItems: [5, 10, 20, 50, 100],
      loading: false,
      perm: false,
    }
  },

  created () {
  },

  beforeMount () {
    this.getUsername();
    this.getUrlParameter();
    this.getProblems();
  },

  watch: {
    // page() {
    //   this.getProblems((this.page - 1) * this.itemsPerPage, this.itemsPerPage);
    // },
    // itemsPerPage() {
    //   this.getProblems((this.page - 1) * this.itemsPerPage, this.itemsPerPage);
    // }
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
    getProblems() {
      if ( !this.filter.offset )  this.filter.offset = 0;
      if ( !this.filter.count ) this.filter.count = -1;
      var query = '?offset=' + this.filter.offset + '&count=' + this.filter.count;
      if ( !!this.filter.problemId )  query += '&problemId=' + this.filter.problemId;
      if ( !!this.filter.tags )  query += '&tags=' + this.filter.tags;
      if ( !!this.filter.name )  query += '&name=' + this.filter.name;
      this.loading = true;
      this.$http.get(`${API_BASE_URL}/problem${query}`)
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

    topFilter() {
      this.getProblems();
    },

    // filter() {
    //   this.getProblems(0, -1, )
    // },

    // transform problems: compute their type, link, AC rate, activity
    showProblems(problems) {
      const items = [];
      problems.forEach(problem => {
        items.push({
          ...problem,
          type: problem.type == 0 ? 'Default' : 'Fill-in-the-blank',
          acRate: `${Math.round(problem.ACUser / problem.submitter * 100)}%`,
          activity: `${problem.ACUser}/${problem.submitter}`,
          link: `/problem/${problem.problemId}`
        });
      });
      this.items = items;
    },

    getUrlParameter() {
      Object.keys(this.filter).forEach(key => {
        var name = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        this.filter[key] = (results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' ')));
      })
    },
    getUsername() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true && payload.role <= 1 ) {
          this.perm = true;
        }
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    // getFakeProblems() {
    //   return [{
    //     problemId: '0087',
    //     type: 0,
    //     problemName: 'Triangle Wave',
    //     tags: ['DP'],
    //     ACUser: 34,
    //     submitter: 42
    //   },
    //   {
    //     problemId: '0070',
    //     type: 1,
    //     problemName: 'Forest',
    //     tags: ['DP', 'bonus'],
    //     ACUser: 7,
    //     submitter: 60
    //   }];
    // }
  }
}
</script>

<style lang="css" scoped>
</style>