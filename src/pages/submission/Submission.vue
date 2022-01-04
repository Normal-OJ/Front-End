<template>
  <v-col style="height: 100%; width: 100%; padding-left: 48px; padding-right: 48px">
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
    <v-row no-gutters justify="center" style="width: 100%">
      <v-simple-table style="width: 100%">
        <template v-slot:default>
          <thead>
            <tr>
              <template v-for="info in submInfo">
                <th
                  :key="info.title"
                  v-if="info.title!=='Run Time(ms)'&&info.title!=='Memory(KB)'||submInfo[6].text!=='Handwritten'"
                  class="subtitle-1 primary white--text"
                  v-text="info.title"
                />
              </template>
            </tr>
          </thead>
          <tbody>
            <tr>
              <template v-for="info in submInfo">
                <td
                  :key="info.title"
                  v-if="info.title!=='Run Time(ms)'&&info.title!=='Memory(KB)'||submInfo[6].text!=='Handwritten'"
                  class="subtitle-1"
                >
                  <a v-if="info.title==='Problem'" :href="'/problem/'+info.text" v-text="info.text+'. '+info.name"></a>
                  <p v-else-if="info.title==='Status'" :style="{ color:COLOR[info.text] }" v-text="STATUS[info.text]"></p>
                  <a v-else-if="info.title==='Uploaded File'" :href="`/api/submission/${$route.params.id}/pdf/upload`" rel="noopener noreferrer" target="_blank"><v-icon color="primary">mdi-file-download</v-icon></a>
                  <a v-else-if="info.title==='Feedback'" :href="`/api/submission/${$route.params.id}/pdf/comment`" rel="noopener noreferrer" target="_blank"><v-icon color="primary">mdi-file-download</v-icon></a>
                  <p v-else>{{ info.text }}</p>
                </td>
              </template>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-row no-gutters class="px-6">
      <h3>Subtask Information</h3>
    </v-row>
    <v-row no-gutters justify="center" style="width: 100%">
      <v-simple-table style="width: 100%" v-for="(subm, idx) in submData" :key="idx">
        <template v-slot:default>
          <thead>
            <tr>
              <th
                v-for="header in submHeader"
                :key="header"
                class="subtitle-1 primary white--text"
                v-text="(header==='#' ? (header+idx) : header)"
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in subm" :key="data['#']">
              <td v-for="header in submHeader" :key="header" class="subtitle-1">
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
    <template v-if="codeShow">
      <div no-gutters class="px-6 d-flex align-baseline">
        <h3 class="mr-4">Source Code</h3>
        <ui-button class="copy-code mr-4" color="gray" icon>
          <template slot="content">
            <v-icon>mdi-content-copy</v-icon>
          </template>
        </ui-button>
        <v-switch v-model="darkTheme" label="Dark Mode"></v-switch>
      </div>
      <codemirror
        v-model="code"
        :options="{ readOnly: true, theme: editorTheme, lineNumbers: true, mode: langMode }"
        style="width: 100%"
      />
    </template>
    <!-- just a padding -->
    <div style="height: 20vh"></div>
    <v-snackbar v-model="snackbar" class="subtitle-1" :color="alert.color">
      {{ alert.msg }}
      <v-btn icon @click="snackbar = false">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-snackbar>
  </v-col>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import '@/pages/problem/EditorConfig'
import User from '@/utils/user'
import Clipboard from 'clipboard'
var LANG_MODE = ['text/x-csrc', 'text/x-c++src', { name: 'python', version: 3 }]

export default {

  name: 'Submission',

  components: {
    codemirror
  },

  data () {
    return {
      submInfo: [],
      submHeader: ['#', 'Status', 'RunTime(ms)', 'Memory(KB)', 'Score'], //, 'Standard Error'],//, 'Standard Output'],
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
      snackbar: false,
      alert: {
        color: 'info',
        msg: 'Code has been copied into the clipboard!'
      },
    }
  },
  computed: {
    editorTheme () {
      return this.darkTheme ? 'dracula' : 'eclipse'
    }
  },
  beforeMount () {
    this.getSubm()
  },
  mounted () {
    const clipboard = new Clipboard('.copy-code', { text: () => { return this.code } })
    clipboard.on('success', evt => {
        this.snackbar = false
        this.alert = {
          color: 'info',
          msg: 'Code has been copied into the clipboard!'
        }
        this.snackbar = true
        evt.clearSelection()
      })
      clipboard.on('error', err => {
        this.snackbar = false
        this.alert = {
          color: 'error',
          msg: 'Failed to copy the code'
        }
        this.snackbar = true
        throw err
      })
  },
  methods: {
    getSubm () {
      this.$agent.Submission.getInfo(this.$route.params.id)
        .then((res) => {
          var data = res.data.data
          this.submInfo = [
            { title: 'Username', text: data.user.username },
            { title: 'Status', text: data.status + 1 },
            { title: 'Run Time(ms)', text: data.runTime },
            { title: 'Memory(KB)', text: data.memoryUsage },
            { title: 'Score', text: data.score },
            { title: 'Language', text: this.LANG[data.languageType] },
            { title: 'Submit Time', text: this.$formatTime(data.timestamp) }
          ]
          // a handwritten submission with feedback
          if (data.languageType === 3) {
            if (data.status > -2) {
              this.submInfo.push({
                title: 'Uploaded File'
              })
            }
            if (data.score > -1) {
              this.submInfo.push({
                title: 'Feedback'
              })
            }
          }
          this.langMode = LANG_MODE[data.languageType]
          this.$agent.Problem.getInfo(data.problemId)
            .then((resp) => { this.course = resp.data.data.courses[0]; this.submInfo.splice(0, 0, { title: 'Problem', text: data.problemId, name: resp.data.data.problemName }) })
          data.tasks.forEach((ele, idx) => {
            var sub = []
            sub.push({
              '#': 'Overall',
              'RunTime(ms)': ele.execTime,
              'Memory(KB)': ele.memoryUsage,
              Status: ele.status + 1,
              Score: ele.score,
              'Standard Error': '',
              'Standard Output': ''
            })
            ele.cases.forEach((ele, jdx) => {
              sub.push({
                '#': idx + '-' + (jdx),
                'RunTime(ms)': ele.execTime,
                'Memory(KB)': ele.memoryUsage,
                Status: ele.status + 1,
                Score: '-',
                'Standard Error': ele.stderr,
                'Standard Output': ele.stdout
              })
            })
            this.submData.push(sub)
          })
          if (this.isKey('code', data)) {
            this.codeShow = true
            this.code = data.code
          } else {
            this.codeShow = false
          }
        })
    },
    isKey (key, obj) {
      var keys = Object.keys(obj).map(function (x) {
        return x.toLowerCase()
      })
      return keys.indexOf(key.toLowerCase()) !== -1
    },
    rejudge () {
      this.isRejudge = true
      this.$agent.Submission.rejudge(this.$route.params.id)
        .then(() => {
          this.$router.go(0)
          this.isRejudge = false
        })
        .catch(() => {
          this.isRejudge = false
          alert('rejudge fail!')
        })
    }
  }
}
</script>

<style lang="css">
@font-face {
  font-family: "Monako";
  src: url("/monaco.ttf") format("truetype");
}
.CodeMirror {
  font-family: "Monako";
  height: 100%;
  width: 100%;
  direction: ltr;
}
.CodeMirror-placeholder {
  color: grey !important;
}
</style>
