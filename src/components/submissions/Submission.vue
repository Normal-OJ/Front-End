<template>
  <v-col style="height: 100%; width: 100%">
    <v-row no-gutters class="px-6">
      <h3>Submission Information</h3>
    </v-row>
    <v-row no-gutters justify="center" style="width: 100%;">
      <v-simple-table id="info-table">
        <template v-slot:default>
          <thead>
            <tr>
              <th 
                v-for="info in submInfo"
                :key="info.title"
                class="title text-left"
                v-text="info.title"
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                v-for="info in submInfo"
                :key="info.title"
                class="title text-left"
              >
                <a v-if="info.title==='Problem'" :href="'/problem/'+info.text" v-text="info.text+'. '+info.name"></a>
                <p v-else-if="info.title==='Status'" :style="{ color:COLOR[info.text] }" v-text="STATUS[info.text]"></p>
                <p v-else>{{ info.text }}</p>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-row no-gutters class="px-6">
      <h3>Subtask Information</h3>
    </v-row>
    <v-row no-gutters justify="center" style="width: 100%;">
      <v-simple-table id="data-table">
        <template v-slot:default>
          <thead>
            <tr>
              <th 
                v-for="header in submHeader"
                :key="header"
                class="title text-left"
                v-text="header"
              ></th>
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
                class="title text-left"
              >
                <v-btn 
                  v-if="header==='Standard Error' || header==='Standard Output'"
                  class="title text-none"
                  outlined
                  color="primary lighten-2"
                  elevation="3"
                  @click.stop="() => {diaTitle = header; diaText = data[header]; dialog = true;}"
                >View</v-btn>
                <p v-else-if="header==='Status'" :style="{ color:COLOR[data[header]] }" v-text="STATUS[data[header]]"></p>
                <p v-else v-text="data[header]"></p> 
              </td>
            </tr>
            <v-dialog v-model="dialog" height="50vh" width="50vw">
              <v-card height="100%" width="100%">
                <v-card-title class="headline primary white--text">
                  {{ diaTitle }}
                  <v-spacer></v-spacer>
                  <v-btn icon @click="dialog = false"><v-icon class="white--text">mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text class="py-3 title black--text" v-text="diaText==='' ? 'None' : diaText"></v-card-text>
              </v-card>
            </v-dialog>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-row v-if="codeShow" no-gutters class="px-6" style="width: 100%;">
      <h3>Source Code</h3>
      <v-switch class="mt-10 ml-6" v-model="darkTheme" label="Dark Mode"></v-switch>
    </v-row>
    <v-row v-if="codeShow" no-gutters justify="center" style="width: 100%;">
      <codemirror
        v-model="code"
        :options="{readOnly: 'nocursor', theme: darkTheme ? 'dracula' : 'eclipse', lineNumbers: true, mode: langMode}"
        style="width: 90%;"
      ></codemirror>
    </v-row>
  </v-col>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/eclipse.css'
var LANG_MODE = ['text/x-csrc', 'text/x-c++src', {name: "python", version: 3}];
// grey, green, red, yellow, purple, orange, blue, shida-red

export default {

  name: 'Submission',

  components: {
    codemirror
  },

  data () {
    return {
      submInfo: [],
      submHeader: ['#', 'Run Time (ms)', 'Memory (KB)', 'Status', 'Standard Error', 'Standard Output'],
      submData: [],
      codeShow: false,
      code: '',
      langMode: '', 
      darkTheme: false,
      dialog: false,
      diaTitle: '',
      diaText: '',
      LANG: ['C (c11)', 'C++ (c++11)', 'Python (py3)'],
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C'],
    }
  },

  beforeMount() {
    this.getSubm();
  },

  methods: {
    getSubm() {
      this.$http.get(`/api/submission/${this.$route.params.id}`)
        .then((res) => {
          console.log(res);
          var data = res.data.data;
          this.submInfo = [
            { 'title': 'Username', 'text': data.user, },
            { 'title': 'Timestamp', 'text': this.timeFormat(data.timestamp), },
            { 'title': 'Run Time (ms)', 'text': data.runTime, },
            { 'title': 'Memory (KB)', 'text': data.memoryUsage, },
            { 'title': 'Status', 'text': data.status+1 },
            { 'title': 'Score', 'text': data.score, },
            { 'title': 'Language', 'text': this.LANG[data.languageType], },
          ];
          this.langMode = LANG_MODE[data.languageType];
          this.$http.get(`/api/problem/view/${data.problemId}`)
            .then((resp) => {this.submInfo.splice(0,0,{'title': 'Problem', 'text': data.problemId, 'name': resp.data.data.problemName})})
            .catch((err) => {});
          data.cases.forEach((ele, idx) => {
            this.submData.push({
              '#': idx+1,
              'Run Time (ms)': ele.execTime,
              'Memory (KB)': ele.memoryUsage,
              'Status': ele.status+1,
              'Standard Error': ele.stderr,
              'Standard Output': ele.stdout,
            })
          });
          if ( this.isKey('code', data) ) {
            this.codeShow = true;
            this.code = data.code;
          } else {
            this.codeShow = false;
          }
        })
        .catch((err) => {
          console.log(err);
        })
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
    isKey(key, obj) {
      var keys = Object.keys(obj).map(function(x) {
          return x.toLowerCase();
      });
      return keys.indexOf( key.toLowerCase() ) !== -1;
    },
  }
}
</script>

<style lang="css" scoped>
#info-table, #data-table {
  width: 90%;
  background-color: transparent;
}

#info-table th {
  background-color: #003865;
  color: white;
}

a:hover {
  text-decoration: underline;
}
</style>