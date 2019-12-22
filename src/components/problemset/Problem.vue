<template>
  <v-row no-gutters style="height: 100%;">
    <v-col cols="6" style="height: 100%;">
      <v-card tile outlined elevation="0" height="100%">
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
            <v-container>
              <vue-markdown>{{ desc }}</vue-markdown>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <!-- Table of Submissions -->
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
    <v-col cols="6">
    </v-col>
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'

const API_BASE_URL = '/api';

export default {

  name: 'Problem',

  components: {
    VueMarkdown,
  },

  data () {
    return {
      id: this.$route.params.id,
      name: '',
      type: '',
      tags: ['NCPC', 'DFS'],
      owner: '',
      desc: '# Problem  \n### description  \n```1 2 3 4 5```  \n- a  \n- b',
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