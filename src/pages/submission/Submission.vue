<template>
  <v-col style="height: 100%; width: 100%">
    <v-slide-x-transition>
      <v-row no-gutters v-if="course!==''">
        <ui-button small color="info" class="mt-3 mr-3" :to="`/course/${course}/submissions`">
          <template slot="content">back to submission list</template>
        </ui-button>
        <ui-button small color="info" class="mt-3 mr-3" :to="`/problem/${submInfo[0].text}`">
          <template slot="content">back to problem</template>
        </ui-button>
        <ui-button v-if="submInfo[6].text !== 'Handwritten' && user.role < 2" small color="info" class="mt-3 mr-3" :to="`/problem/${submInfo[0].text}/statistic`">
          <template slot="content">view statistic</template>
        </ui-button>
        <v-spacer />
        <v-btn v-if="user.role < 2" small color="error" class="mt-3" outlined @click="rejudge" :loading="isRejudge">
          rejudge
        </v-btn>
        <v-spacer />
      </v-row>
    </v-slide-x-transition>
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
                class="subtitle-1"
                v-text="info.title"
                v-if="info.title!=='Run Time(ms)'&&info.title!=='Memory(KB)'||submInfo[6].text!=='Handwritten'"
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                v-for="info in submInfo"
                :key="info.title"
                class="subtitle-1 text-left"
                v-if="info.title!=='Run Time(ms)'&&info.title!=='Memory(KB)'||submInfo[6].text!=='Handwritten'"
              >
                <a v-if="info.title==='Problem'" :href="'/problem/'+info.text" v-text="info.text+'. '+info.name"></a>
                <p v-else-if="info.title==='Status'" :style="{ color:COLOR[info.text] }" v-text="STATUS[info.text]"></p>
                <a v-else-if="info.title==='Uploaded File'" :href="`/api/submission/${$route.params.id}/pdf/upload`" rel="noopener noreferrer" target="_blank"><v-icon color="primary">mdi-file-download</v-icon></a>
                <a v-else-if="info.title==='Feedback'" :href="`/api/submission/${$route.params.id}/pdf/comment`" rel="noopener noreferrer" target="_blank"><v-icon color="primary">mdi-file-download</v-icon></a>
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
      <v-simple-table id="data-table" v-for="(subm, idx) in submData" :key="idx">
        <template v-slot:default>
          <thead>
            <tr>
              <th
                v-for="header in submHeader"
                :key="header"
                class="subtitle-1 text-left"
                v-text="(header==='#' ? (header+idx) : header)"
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in subm" :key="data['#']">
              <td v-for="header in submHeader" :key="header" class="subtitle-1 text-left">
                <v-btn
                  v-if="(header==='Standard Error' || header==='Standard Output') && !!data[header]"
                  class="subtitle-1 text-none"
                  text
                  color="primary"
                  @click.stop="() => {diaTitle = header; diaText = data[header]; dialog = true;}"
                >View</v-btn>
                <p
                  v-else-if="header==='Status'"
                  :style="{ color:COLOR[data[header]] }"
                  v-text="STATUS[data[header]]"
                ></p>
                <p v-else v-text="data[header]"></p>
              </td>
            </tr>
            <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'">
              <template slot="title">{{ diaTitle }}</template>
              <template slot="body">
                <v-container>
                  <codemirror
                    v-model="diaText"
                    :options="{readOnly: true, theme: darkTheme ? 'dracula' : 'eclipse'}"
                  ></codemirror>
                </v-container>
              </template>
              <template slot="action-cancel">
                <span></span>
              </template>
            </ui-dialog>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-row align="center" v-if="codeShow" no-gutters class="px-6" style="max-width: 50%;">
      <v-col cols="2" class="mr-4">
        <h3>Source Code</h3>
      </v-col>
      <v-col class="pt-2" cols="1">
        <ui-button class="copy-code" color="gray" icon>
          <template slot="content">
            <v-icon>mdi-content-copy</v-icon>
          </template>
        </ui-button>
      </v-col>
      <v-col class="pt-3" cols="2">
        <v-switch v-model="darkTheme" label="Dark Mode"></v-switch>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row v-if="codeShow" no-gutters justify="center" style="width: 100%;">
      <codemirror
        v-model="code"
        :options="{readOnly: true, theme: darkTheme ? 'dracula' : 'eclipse', lineNumbers: true, mode: langMode}"
        style="width: 90%;"
      ></codemirror>
    </v-row>
    <!-- just a padding -->
    <div style="height: 20vh"></div>
  </v-col>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/eclipse.css'
import User from '@/utils/user';
import Clipboard from 'clipboard'
var LANG_MODE = ['text/x-csrc', 'text/x-c++src', { name: "python", version: 3 }];

export default {

  name: 'Submission',

  components: {
    codemirror,
  },

  data() {
    return {
      submInfo: [],
      submHeader: ['#', 'Status', 'RunTime(ms)', 'Memory(KB)', 'Score'],//, 'Standard Error'],//, 'Standard Output'],
      submData: [],
      codeShow: false,
      code: '',
      course: '',
      langMode: '',
      darkTheme: false,
      dialog: false,
      diaTitle: '',
      diaText: '',
      LANG: ['C (c11)', 'C++ (c++17)', 'Python (py3)', 'Handwritten'],
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C', '#BF360C'],
      user: new User(this.$cookies.get('jwt')),
      isRejudge: false,
    }
  },

  beforeMount() {
    this.getSubm();
  },
  mounted() {
    const clipboard = new Clipboard('.copy-code', {text: (trigger => { return this.code; }).bind(this)});
  },
  methods: {
    getSubm() {
      this.$http.get(`/api/submission/${this.$route.params.id}`)
        .then((res) => {
          var data = res.data.data;
          this.submInfo = [
            { 'title': 'Username', 'text': data.user.username, },
            { 'title': 'Status', 'text': data.status + 1 },
            { 'title': 'Run Time(ms)', 'text': data.runTime, },
            { 'title': 'Memory(KB)', 'text': data.memoryUsage, },
            { 'title': 'Score', 'text': data.score, },
            { 'title': 'Language', 'text': this.LANG[data.languageType], },
            { 'title': 'Submit Time', 'text': this.timeFormat(data.timestamp), },
          ];
          // a handwritten submission with feedback
          if ( data.languageType === 3 ) {
            if ( data.status > -2 ) {
              this.submInfo.push({
                'title': 'Uploaded File',
              })  
            }
            if ( data.score > -1 ) {
              this.submInfo.push({
                'title': 'Feedback',
              })
            }
          }
          this.langMode = LANG_MODE[data.languageType];
          this.$http.get(`/api/problem/view/${data.problemId}`)
            .then((resp) => { this.course = resp.data.data.courses[0]; this.submInfo.splice(0, 0, { 'title': 'Problem', 'text': data.problemId, 'name': resp.data.data.problemName }) })
            .catch((err) => { });
          data.tasks.forEach((ele, idx) => {
            var sub = [];
            sub.push({
              '#': 'Overall',
              'RunTime(ms)': ele.execTime,
              'Memory(KB)': ele.memoryUsage,
              'Status': ele.status + 1,
              'Score': ele.score,
              'Standard Error': '',
              'Standard Output': '',
            })
            ele.cases.forEach((ele, jdx) => {
              sub.push({
                '#': idx + '-' + (jdx),
                'RunTime(ms)': ele.execTime,
                'Memory(KB)': ele.memoryUsage,
                'Status': ele.status + 1,
                'Score': '-',
                'Standard Error': ele.stderr,
                'Standard Output': ele.stdout,
              })
            })
            this.submData.push(sub);
          });
          if (this.isKey('code', data)) {
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
      var month = '0' + (tmp.getMonth() + 1);
      var date = '0' + tmp.getDate();
      var hour = '0' + tmp.getHours();
      var min = '0' + tmp.getMinutes();
      var sec = '0' + tmp.getSeconds();
      var time = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return time;
    },
    isKey(key, obj) {
      var keys = Object.keys(obj).map(function (x) {
        return x.toLowerCase();
      });
      return keys.indexOf(key.toLowerCase()) !== -1;
    },
    rejudge() {
      this.isRejudge = true;
      this.$http.get(`/api/submission/${this.$route.params.id}/rejudge`)
        .then(() => {
          this.$router.go(0);
          this.isRejudge = false;
        })
        .catch(() => {
          this.isRejudge = false;
          alert('rejudge fail!');
        })
    },
  }
}
</script>

<style lang="css" scoped>
#info-table,
#data-table {
  width: 90%;
  background-color: transparent;
}

#info-table th,
#data-table th {
  background-color: #003865;
  color: white;
}
</style>