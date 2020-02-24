<template>
  <v-row no-gutters style="height: 100%; width: 100%">
    <v-col cols="12" md="6" style="height: 100%;">
      <v-card tile outlined height="100%" v-if="prob">
        <v-card-title class="headline font-weight-bold justify-center">
          {{ id + ' - ' + prob.problemName }}
        </v-card-title>
        <v-divider class="mt-0"></v-divider>
        <v-card-subtitle class="subtitle-1">
          <v-row class="pl-4">
            Tags:
            <v-chip 
              class="mx-1"
              v-for="tag in prob.tags"
              :key="tag"
              label
            ><a href="" target="_blank" rel="noopener noreferrer">{{ tag }}</a></v-chip>
          </v-row>
        </v-card-subtitle>
        <v-tabs v-model="tab" fixed-tabs >
          <v-tab class="text-none subtitle-1">Description</v-tab>
          <v-tab class="text-none subtitle-1">Submission</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" style="width: 100%">
          <v-tab-item style="height: 100%; width: 100%;">
            <div class="px-6" style="width: 100%" wrap>
              <h2>Description</h2>
              <vue-markdown :source="prob.description.description"></vue-markdown>
              <div v-if="prob.type!==2">
                <h2>Input</h2>
                <vue-markdown :source="prob.description.input"></vue-markdown>
                <h2>Output</h2>
                <vue-markdown :source="prob.description.output"></vue-markdown>
                <h2>Examples</h2>
                <v-row v-for="(i, idx) in prob.description.sampleInput.length" :key="idx">
                  <v-card width="100%" outlined class="mb-1">
                    <v-card-title class="pb-0">
                      Input
                      <ui-button color="grey" icon class="ml-3" @click.native="copy('I', idx)">
                        <template slot="content"><v-icon>mdi-content-copy</v-icon></template>
                      </ui-button>
                    </v-card-title>
                    <v-card-text>
                      <code ref="sampleI" style="width: 100%;" class="subtitle-1">{{ prob.description.sampleInput[idx] }}</code>
                    </v-card-text>
                    <v-card-title class="py-0">
                      Output
                      <ui-button color="grey" icon class="ml-3" @click.native="copy('O', idx)">
                        <template slot="content"><v-icon>mdi-content-copy</v-icon></template>
                      </ui-button>
                    </v-card-title>
                    <v-card-text>
                      <code ref="sampleO" style="width: 100%;" class="subtitle-1">{{ prob.description.sampleOutput[idx] }}</code>
                    </v-card-text>
                  </v-card>
                </v-row>
                <h2 v-if="prob.description.hint">Hint</h2>
                <vue-markdown :source="prob.description.hint"></vue-markdown>
              </div>
              <br>
            </div>
          </v-tab-item>
          <v-tab-item style="height: 100%; width: 100%;">
            <v-card class="pa-3" elevation="0" width="100%">
            <!-- Table of Submissions -->
              <HistorySubmissions :submData.sync="submData" :show.sync="show" :type="prob.type"></HistorySubmissions>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" v-if="prob">
      <Editor @getSubmission="setSubmission" :type="prob.type"></Editor>
    </v-col>
    <v-snackbar
      v-model="snackbar" class="subtitle-1"
      color="secondary"
    >
      The example has been copied into the clipboard!
      <v-btn icon @click="snackbar = false"><v-icon>mdi-close-circle</v-icon></v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import Editor from './Editor'
import HistorySubmissions from './HistorySubmissions'
const LANG = ['C11', 'C++11', 'Python3'];
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
      prob: null,
      tab: null,
      submHeader: ['Timestamp', 'Status', 'Score', 'Run Time', 'Memory', 'Language'],
      submData: [],
      show: true,
      snackbar: false,
      username: '',
    }
  },
  created() {
    this.getUsername();
    this.getProb();
    this.getSubm();
  },
  methods: {
    getProb() {
      this.$http.get(`${API_BASE_URL}/problem/view/${this.$route.params.id}`)
        .then((res) => {
          // console.log('res:', res);
          this.prob = res.data.data;
        })
        .catch((err) => {
        })
    },
    getSubm() {
      this.$http.get(`${API_BASE_URL}/submission?offset=0&count=-1&username=${this.username}&problemId=${this.$route.params.id}`)
        .then((res) => {
          this.submData = [];
          // console.log('subm:', res);
          res.data.data.submissions.forEach((ele) => {
            if ( ele.status === -1 && this.prob.type !== 2 ) {
              this.submData.splice(0,0,{
                'Timestamp' : null,
                'Status' : ele.status+1,
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
                'Status' : ele.status+1,
                'Score' : ele.score,
                'Run Time' : ele.runTime,
                'Memory' : ele.memoryUsage,
                'Language' : LANG[ele.languageType],
                'id' : ele.submissionId,
              })
            }
          });
          // console.log(this.submData);
        })
        .catch((err) => {
          // console.log(err);
        })
    },
    setSubmission() {
      this.getSubm();
      this.tab = 1;
    },
    updateSubm(sid) {
      if ( this.prob.type !== 2 ) {
        this.$http.get(`${API_BASE_URL}/submission/${sid}`)
          .then(async(res) => {
            // console.log(res);
            var data = res.data.data;
            console.log(data);
            if ( data.status === -1 ) {
              this.show = false;
              await this.delay(1000);
              this.updateSubm(sid);
            } else {
              this.getSubm();
              this.show = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    delay(delayInms) {
      return new Promise(resolve  => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    },
    copy(op, idx) {
      var text = this.$refs[`sample${op}`][idx].textContent;
      console.log(text);
      navigator.clipboard.writeText(text)
        .then((res) => {
          this.snackbar = true;
          console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
          alert('Async: Could not copy text: ' + err);
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
    getUsername() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true ) {
          this.username = payload.username;
        } else {
          // this.$router.push('/');
        }
      } else {
        // this.$router.push('/');
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
  }
}
</script>

<style lang="css" scoped>
</style>