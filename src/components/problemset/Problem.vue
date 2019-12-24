<template>
  <v-row no-gutters style="height: 100%;">
    <v-col cols="6" style="height: 100%;">
      <v-card tile outlined elevation="0" height="100%" max-height="100%" style="overflow-y: scroll;">
        <v-row no-gutters justify="center">
          <v-card-title class="display-2 font-weight-bold" text>{{ id }} - Name</v-card-title>
        </v-row>
        <v-divider color="dark"></v-divider>
        <v-card-subtitle class="py-1">
          Tags:
          <v-chip 
            class="ma-1" 
            v-for="tag in tags" 
            :key="tag" 
            label
            small
          >{{ tag }}</v-chip>
          Type: 
        </v-card-subtitle>
        <v-tabs v-model="tab" fixed-tabs slider-size="4">
          <v-tab>Problem</v-tab>
          <v-tab>Submission</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item style="height: 100%;">
            <div class="px-12">
              <vue-markdown :source="desc"></vue-markdown>
            </div>
          </v-tab-item>
          <v-tab-item>
            <!-- Table of Submissions -->
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
    <v-col cols="6">
      <Editor/>
    </v-col>
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import Editor from './Editor'

const API_BASE_URL = '/api';

export default {

  name: 'Problem',

  components: {
    VueMarkdown,
    'Editor': Editor,
  },

  data () {
    return {
      id: this.$route.params.id,
      name: '',
      type: '',
      tags: ['NCPC', 'DFS'],
      owner: '',
      desc: '# Simply Emirp    \n    \n## Problem    \n    \nAn integer greater than 1 is called a prime number if its only positive divisors (factors) are 1 and itself.    \n    \nPrime numbers have been studied over the years by a lot of mathematicians.    \n    \nApplications of prime numbers arise in Cryptography and Coding Theory among others.    \n    \nHave you tried reversing a prime?    \n    \nFor most primes, you get a composite (43 becomes 34).     \n    \nAn Emirp (Prime spelt backwards) is a Prime that gives you a different Prime when its digits are reversed.    \n    \nFor example, 17 is Emirp because 17 as well as 71 are Prime.    \n    \nIn this problem, you have to decide whether a number N is Non-prime or Prime or Emirp.    \n    \nAssume that 1 < N < 1000000.    \n    \nInterestingly, Emirps are not new to NTU students.    \n    \nWe have been boarding 199 and 179 buses for quite a long time!    \n    \n## Input    \n    \nInput consists of several lines specifying values for N.    \n    \n## Output    \n    \nFor each N given in the input, output should contain one of the following:    \n1. `N is not prime.`, if N is not a Prime number.    \n2. `N is prime.`, if N is Prime and N is not Emirp.    \n3. `N is emirp.`, if N is Emirp.    \n    \n## Sample Input    \n    \n```    \n17    \n18    \n19    \n179    \n199    \n```    \n    \n## Sample Output    \n    \n```    \n17 is emirp.    \n18 is not prime.    \n19 is prime.    \n179 is emirp.    \n199 is emirp.    \n```    \n    \n## Source    \n    \n[UVa - 10235](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=14&page=show_problem&problem=1176)    \n',
      tab: null,
    }
  },

  beforeMount() {
    this.getProb();
  },

  methods: {
    getProb() {
      this.$http.get(`${API_BASE_URL}/problem/view/${this.$route.params.id}`)
        .then((res) => {  

        })
        .catch((err) => {

        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>