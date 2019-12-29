<template>
  <v-row no-gutters style="height: 100%; width: 100%">
    <v-row no-gutters style="height: 100%; width: 100%">
      <v-col cols="6" style="height: 100%;">
        <v-card tile outlined elevation="0" height="100%" width="100%">
          <v-row no-gutters justify="center">
            <v-card-title class="display-2 font-weight-bold" v-text="id + ' - ' + name"></v-card-title>
          </v-row>
          <v-divider color="dark"></v-divider>
          <v-card-subtitle class="py-1 title">
            <v-row>
              <v-col cols="10">
                Tags:
                <v-chip 
                  class="ma-1 title"
                  v-for="tag in tags"
                  :key="tag" 
                  label
                ><a :href="`/problems?tag=${tag}`" target="_blank" rel="noopener noreferrer">{{ tag }}</a></v-chip>
              </v-col>
              <v-col cols="2">
                Type: {{ type===0 ? 'default' : 'fill-in' }}
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-tabs v-model="tab" fixed-tabs slider-size="4">
            <v-tab class="text-none title">Description</v-tab>
            <v-tab class="text-none title">Submission</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" style="width: 100%">
            <v-tab-item style="width: 100%">
              <div class="px-6" style="width: 100%" wrap>
                <vue-markdown :source="desc"></vue-markdown>
              </div>
            </v-tab-item>
            <v-tab-item style="width: 100%">
              <v-card class="pa-3" elevation="0" width="100%">
              <!-- Table of Submissions -->
                <HistorySubmissions :submData.sync="submData" :show.sync="show"></HistorySubmissions>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col cols="6" style="height: 100%;">
        <Editor v-on:getSubmission="setSubmission"></Editor>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import Editor from './Editor'
import HistorySubmissions from './HistorySubmissions'

const LANG = ['C (c11)', 'C++ (c++11)', 'Python (py3)'];
const STATUS = ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error'];
const API_BASE_URL = '/api';

export default {

  name: 'Problem',

  components: {
    VueMarkdown,
    'Editor': Editor,
    'HistorySubmissions': HistorySubmissions,
  },

  data () {
    return {
      id: this.$route.params.id,
      name: '',
      type: '',
      tags: [],
      owner: '',
      desc: '',
      tab: null,
      submHeader: ['Timestamp', 'Status', 'Score', 'Run Time', 'Memory', 'Language'],
      submData: [],
      show: true,
    }
  },

  beforeMount() {
    this.getProb();
    this.getSubm();
  },

  methods: {
    getProb() {
      this.$http.get(`${API_BASE_URL}/problem/view/${this.$route.params.id}`)
        .then((res) => {
          console.log('res:', res)
          this.name = res.data.data.problemName;
          this.desc = res.data.data.description;
          this.tags = res.data.data.tags;
          this.type = res.data.data.type;
        })
        .catch((err) => {

        })
    },
    getSubm() {
      this.$http.get(`${API_BASE_URL}/submission?offset=0&count=-1&problemId=${this.$route.params.id}`)
        .then((res) => {
          console.log('subm:', res);
          res.data.data.submissions.forEach((ele) => {
            if ( ele.status === -1 ) {
              this.submData.splice(0,0,{
                'Timestamp' : null,
                'Status' : STATUS[ele.status+1],
                'Score' : null,
                'Run Time' : null,
                'Memory' : null,
                'Language' : null,
                'id' : ele.submissionId,
              })
              this.updateSubm(ele.submissionId);
            } else {
              this.submData.push({
                'Timestamp' : this.timeFormat(ele.timestamp),
                'Status' : STATUS[ele.status+1],
                'Score' : ele.score,
                'Run Time' : ele.runTime,
                'Memory' : ele.memoryUsage,
                'Language' : LANG[ele.languageType],
                'id' : ele.submissionId,
              })
            }
          });
          console.log(this.submData);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    setSubmission() {
      this.tab = 1;
      this.getSubm();
    },
    updateSubm(sid) {
      this.$http.get(`${API_BASE_URL}/submission/${sid}`)
        .then(async(res) => {
          // console.log(res);
          var data = res.data.data;
          console.log(data);
          if ( data.status === -1 ) {
            this.show = false;
            await this.delay(4000);
            this.updateSubm(sid);
          } else {
            this.submData = [];
            this.getSubm();
            this.show = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delay(delayInms) {
      return new Promise(resolve  => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    },
    timeFormat(time) {
      var tmp = new Date(time * 1000);
      var year = tmp.getFullYear();
      var month = '0' + (tmp.getMonth()+1);
      var date = '0' + tmp.getDate();
      var hour = '0' + tmp.getHours();
      var min = '0' + tmp.getMinutes();
      var sec = '0' + tmp.getSeconds();
      var time = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return time;
    },
  }
}
</script>

<style lang="css" scoped>
a:hover {
  text-decoration: underline;
}
</style>