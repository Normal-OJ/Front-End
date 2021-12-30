<template>
  <v-row no-gutters style="height: 100%; width: 100%">
    <v-col cols="12" md="6" style="min-height: 100vh;">
      <v-card tile outlined height="100%" v-if="prob">
        <v-card-title
          class="headline font-weight-bold justify-center"
        >{{ id + ' - ' + prob.problemName }}</v-card-title>
        <v-divider class="mt-0"></v-divider>
        <v-card-subtitle class="subtitle-1">
          <v-row class="pl-4">
            <v-col>
              Tags:
              <v-chip class="mx-1" v-for="tag in prob.tags" :key="tag" label>
                {{ tag }}
              </v-chip>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="4" v-if="prob.type != 2 && user.role < 2">
              <v-btn :to="`${$route.params.id}/statistic`" class="text-none subtitle-1" color="info" small width="100%">
                <v-icon>mdi-chart-arc</v-icon>Statistic
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="pl-4" no-gutters>
            <v-col>
              <p>Quota: <strong class="text--primary">{{ this.prob.quota==-1 ? 'unlimited' : this.prob.quota-this.prob.submitCount }}</strong></p>
            </v-col>
            <v-spacer />
            <v-col cols="4" v-if="prob.type != 2 && user.role < 2">
              <v-btn class="text-none subtitle-1" color="info" small width="100%" @click="download">
                <v-icon>mdi-download</v-icon>Testdata
              </v-btn>
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-card-text class="text--primary px-6" style="width: 100%">
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
                  <ui-button
                    class="ml-3 copy-io"
                    :id="`copy-sample-i${idx}`"
                    :data-clipboard-target="`#sample-i${idx}`"
                    color="grey"
                    icon
                  >
                    <template slot="content">
                      <v-icon>mdi-content-copy</v-icon>
                    </template>
                  </ui-button>
                </v-card-title>
                <v-card-text>
                  <code
                    ref="sample-i"
                    :id="`sample-i${idx}`"
                    style="width: 100%;"
                    class="subtitle-1"
                  >{{ prob.description.sampleInput[idx] }}</code>
                </v-card-text>
                <v-card-title class="py-0">
                  Output
                  <ui-button
                    class="ml-3 copy-io"
                    :id="`copy-sample-o${idx}`"
                    :data-clipboard-target="`#sample-o${idx}`"
                    color="grey"
                    icon
                  >
                    <template slot="content">
                      <v-icon>mdi-content-copy</v-icon>
                    </template>
                  </ui-button>
                </v-card-title>
                <v-card-text>
                  <code
                    ref="sample-o"
                    :id="`sample-o${idx}`"
                    style="width: 100%;"
                    class="subtitle-1"
                  >{{ prob.description.sampleOutput[idx] }}</code>
                </v-card-text>
              </v-card>
            </v-row>
            <h2 v-if="prob.description.hint">Hint</h2>
            <vue-markdown :source="prob.description.hint"></vue-markdown>
            <h2 class="mb-0">Subtask Information</h2>
            <div>
              <v-simple-table>
                <thead>
                  <tr>
                    <th class="text--primary subtitle-1">Subtask</th>
                    <th class="text--primary subtitle-1">Time Limit(ms)</th>
                    <th class="text--primary subtitle-1">Memory Limit(KB)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(limit, idx) in problemLimit" :key="idx">
                    <td class="subtitle-1">{{ idx+1 }}</td>
                    <td class="subtitle-1">{{ limit[0] }}</td>
                    <td class="subtitle-1">{{ limit[1] }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </div>
          </div>
          <br />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" v-if="prob">
      <Editor
        @getSubmission="setSubmission"
        @exceedRateLimit="exceedRateLimit"
        :type="prob.type"
        :languageItem="allowedLang"
        :submData.sync="submData"
      ></Editor>
    </v-col>
    <v-snackbar v-model="snackbar" class="subtitle-1" :color="alert.color">
      {{ alert.msg }}
      <v-btn icon @click="snackbar = false">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import Editor from './Editor'
import User from '@/utils/user'
import Clipboard from 'clipboard'
import { mapState } from 'vuex'

export default {
  name: 'Problem',
  components: {
    VueMarkdown,
    Editor: Editor
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
      cnt: 0,
      alert: {
        color: 'info',
        msg: 'The example has been copied into the clipboard!'
      },
      user: new User(this.$cookies.get('jwt'))
    }
  },
  computed: {
    ...mapState({
      username: state => state.username
    }),
    allowedLang () {
      const temp = []
      const value = this.prob.allowedLanguage
      const langs = [
        { text: 'C (c11)', value: 0 },
        { text: 'C++ (c++17)', value: 1 },
        { text: 'Python (python3)', value: 2 }
      ]
      for (const [i] of langs.entries()) {
        if (value & (1 << i)) { temp.push(langs[i]) }
      }
      return temp
    },
    /**
    * An array denote the time limit & rate limit
    * of each test case.
    * Each item is a one-dim array of 2 Integers
    * consists of [time limit, memory limit]
    * @return {number[][]}
    */
    problemLimit () {
      if (this.prob) { var limit = this.prob.testCase.map(ele => [ele.timeLimit, ele.memoryLimit]) }
      return limit
    }
  },
  created () {
    this.getProb()
    this.getSubm()
    this.setupClipboard()
  },
  methods: {
    async getProb () {
      this.prob = (await this.$agent.Problem.getInfo(this.$route.params.id)).data.data
    },
    getSubm () {
      this.$agent.Submission.getList({ offset: 0, count: -1, username: this.username, problemId: this.$route.params.id })
        .then((res) => {
          this.submData = []
          res.data.data.submissions.forEach((ele) => {
            if (ele.status === -1 && this.prob.type !== 2) {
              this.submData.splice(0, 0, {
                Timestamp: null,
                Status: ele.status + 1,
                Score: null,
                'Run Time': null,
                Memory: null,
                id: ele.submissionId
              })
            } else {
              this.submData.push({
                Timestamp: this.$formatTime(ele.timestamp),
                Status: ele.status + 1,
                Score: ele.score,
                'Run Time': ele.runTime,
                Memory: ele.memoryUsage,
                id: ele.submissionId
              })
            }
          })
        })
    },
    setSubmission (id) {
      this.$router.push(`/submission/${id}`)
    },
    setupClipboard () {
      const clipboard = new Clipboard('.copy-io',
        {
          target: trigger => {
            const id = trigger.id.substr(5)
            return document.getElementById(id)
          }
        })
      clipboard.on('success', evt => {
        this.snackbar = false
        this.alert = {
          color: 'info',
          msg: 'The example has been copied into the clipboard!'
        }
        this.snackbar = true
        console.log('Async: Copying to clipboard was successful!')
        evt.clearSelection()
      })
      clipboard.on('error', err => {
        alert(`Async: Could not copy text: ${err}`)
      })
    },
    async updateSubm (sid) {
      if (this.prob.type !== 2) {
        let done = false
        this.cnt++
        this.tab = 1
        while (done === false) {
          await this.delay(1000)
          // get submission data
          const data = (await this.$agent.Submission.getInfo(sid)).data.data
          // haven't been judged
          if (data.status === -1) {
            this.show = false
            // successfully get submission info
          } else {
            done = true
          }
        }
        this.getSubm()
        this.cnt--
        this.show = true
      }
    },
    delay (delayInms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(2)
        }, delayInms)
      })
    },
    exceedRateLimit (resp) {
      this.snackbar = false
      this.alert = {
        color: 'secondary',
        msg: resp
      }
      this.snackbar = true
      this.getSubm()
    },
    download () {
      window.location = this.$agent.Problem.downloadTestcaseUrl(this.$route.params.id)
    }
  }
}
</script>
