<template>
  <v-row no-gutters style="height: 100%; width: 100%">
    <v-row no-gutters style="height: 100%; width: 100%">
      <v-col cols="6" style="height: 100%;">
        <v-card tile outlined elevation="0" height="100%" width="100%">
          <v-row no-gutters justify="center">
            <v-card-title class="display-2 font-weight-bold" v-text="id + ' - ' + name"></v-card-title>
          </v-row>
          <v-divider color="dark"></v-divider>
          <v-card-subtitle class="py-1">
            <v-row>
              <v-col cols="10">
                Tags:
                <v-chip 
                  class="ma-1"
                  v-for="tag in tags"
                  :key="tag" 
                  label
                  small
                >{{ tag }}</v-chip>
              </v-col>
              <v-col cols="2">
                Type: {{ type===0 ? 'default' : 'fill-in' }}
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-tabs v-model="tab" fixed-tabs slider-size="4">
            <v-tab class="text-none subtitle-1">Description</v-tab>
            <v-tab class="text-none subtitle-1">Submission</v-tab>
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
                <v-simple-table v-if="show">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th 
                          v-for="header in submHeader"
                          :key="header"
                          class="text-left"
                        ><p v-text="header"></p></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="(data, idx) in submData"
                        :key="idx"
                      >
                        <td
                          v-for="header in submHeader"
                          :key="header"
                        ><p v-if="header=='Status'"><a target="_blank" rel="noopener noreferrer" :href="'/submission/'+data.id" v-text="data[header]"></a></p>
                         <p v-else-if="header==='Run Time' && data[header]" v-text="data[header]+'ms'"></p>
                         <p v-else-if="header==='Memory Usage' && data[header]" v-text="data[header]+'KB'"></p>
                         <p v-else v-text="data[header]"></p></td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
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

const LANG = ['C (c11)', 'C++ (c++11)', 'Python (py3)'];
const STATUS = ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceen', 'Runtime Error', 'Judge Error'];
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
      tags: [],
      owner: '',
      desc: '',
      tab: null,
      submHeader: ['Timestamp', 'Status', 'Score', 'Run Time', 'Memory Usage', 'Language'],
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
            this.submData.push({
              'Timestamp': this.timeFormat(ele.timestamp/1000),
              'Status': STATUS[ele.status+1],
              'Score': ele.score,
              'Run Time': ele.runTime,
              'Memory Usage': ele.memoryUsage,
              'Language': LANG[ele.languageType],
              'id': ele.submissionId,
            })
          });
          console.log(this.submData);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    setSubmission(sid) {
      console.log('sid:' + sid);
      this.submData.splice(0,0,{
        'Timestamp': null,
        'Status': STATUS[0],
        'Score': null,
        'Run Time': null,
        'Memory Usage': null,
        'Language': null,
      });
      this.tab = 1;
      this.updateSubm(sid)
    },
    updateSubm(sid) {
      this.$http.get(`${API_BASE_URL}/submission/${sid}`)
        .then((res) => {
          // console.log(res);
          var data = res.data.data;
          console.log(data);
          if ( data.status === -1 ) {
            this.updateSubm(sid);
          } else {
            this.submData = [];
            this.getSubm();
            // var latest;
            // submData.forEach((ele, idx) => {
            //   if ( ele.status === -1 )  latest = idx;
            //   else  return;
            // })
            // this.submData.splice(latest-1,1,{
            //   'Timestamp': this.timeFormat(data.timestamp/1000),
            //   'Status': STATUS[data.status+1],
            //   'Score': data.score,
            //   'Run Time': data.runTime,
            //   'Memory Usage': data.memoryUsage,
            //   'Language': LANG[data.languageType],
            // });
            // this.show = false;
            // this.$nextTick(() => {
            //   this.show = true;
            // })
          }
        })
        .catch((err) => {
          console.log(err);
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
</style>