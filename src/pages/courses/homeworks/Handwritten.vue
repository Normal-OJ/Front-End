<template>
  <v-container>
    <v-simple-table class="px-3">
      <template v-slot:default>
        <thead v-if="probs">
          <tr>
            <th>username</th>
            <th
              v-for="(prob, idx) in probs"
              :key="idx"
              class="font-weight-bold subtitle-1 text--primary"
            >#{{idx+1}} - <a :href="`/problem/${prob}`">Pid:{{prob}}</a></th>
          </tr></thead>
        <tbody v-if="items">
          <tr
            v-for="[username, item] in Object.entries(items)"
            :key="username"
          >
            <td class="subtitle-1" v-text="username"></td>
            <td
              v-for="prob in probs"
              :key="prob"
              class="subtitle-1"
            >
              <div>

                <span
                  v-if="item[prob].problemStatus!=null"
                  :style="{ color: SUBMISSION_COLOR[`${item[prob].problemStatus}`] }"
                >{{ SUBMISSION_STATUS[item[prob].problemStatus] }}</span>
                <span v-else>Unsolved</span>

                {{ ' / ' + item[prob].score + 'pts' }}

                <ui-button v-if="item['submissionId']" small class="mx-2">
                  <template slot="content">
                      <a :href="`/api/submission/${item['submissionId']}/pdf/upload`" rel="noopener noreferrer" target="_blank"><v-icon color="white">mdi-file-download</v-icon></a>
                  </template>
                </ui-button>
                <ui-dialog
                  v-if="item['submissionId']"
                  v-model="dialog"
                  :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"
                  persistent
                  alert
                >
                  <template slot="activator">
                    <ui-button small @click.native="dialog = true; scoring(item[prob])">
                      <template slot="content"><v-icon>mdi-chart-bar</v-icon></template>
                    </ui-button>
                  </template>
                  <template slot="title">{{ 'Score & Comment' }}</template>
                  <template slot="body">
                    <v-card-text class="subtitle-1 text--primary">
                      <v-text-field
                        label="Score"
                        v-model="data.score"
                        :rules="[v => !!v && 0 <= v && v <= 100 || 'Score must be in range: 0 to 100']"
                        prepend-icon="mdi-check-bold"
                      ></v-text-field>
                      <v-file-input
                        v-model="data.file"
                        show-size
                        label="Upload Comment PDF (zip)"
                        prepend-icon="mdi-file"
                      ></v-file-input>
                      <a :href="`/api/submission/${item['submissionId']}/pdf/comment`" rel="noopener noreferrer" target="_blank">/api/submission/{{item['submissionId']}}/pdf/comment (Past comment PDF)</a>

                    </v-card-text>
                  </template>
                  <template slot="action-ok">
                    <ui-button color="primary" @click.native="comment(item['submissionId'])">
                      <template slot="content">Submit</template>
                    </ui-button>
                  </template>
                </ui-dialog>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import { SUBMISSION_STATUS, SUBMISSION_COLOR } from '@/constants/submissions'

export default {

  name: 'Status',

  data () {
    return {
      items: null,
      probs: null,
      dialog: false,
      data: {
        score: null,
        file: null
      },
    }
  },

  computed: {
    SUBMISSION_STATUS() { return SUBMISSION_STATUS },
    SUBMISSION_COLOR() { return SUBMISSION_COLOR },
  },

  created () {
    this.getData()
  },

  methods: {
    async getData () {
      try {
        this.items = null
        const res = await this.$agent.Homework.getInfo(this.$route.params.id)
        // stash student status
        const items = res.data.data.studentStatus
        // get handwritten problem ids
        const pids = res.data.data.problemIds
        const handwrittens = await Promise.all(pids.map(async pid => {
          return ((await this.$agent.Problem.getInfo(pid)).data.data.type === 2)
        }))
        this.probs = pids.filter((pid, idx) => handwrittens[idx])
        // get submission ids
        await Promise.all(this.probs.map(async pid => {
          // query submission ids by pid
          const sRes = await this.$agent.Submission.getList({
            offset: 0,
            count: -1,
            course: this.$route.params.name,
            problemId: pid
          })
          // update student status
          for (const subm of sRes.data.data.submissions) {
            if (items[subm.user.username]) {
              items[subm.user.username].submissionId = subm.submissionId
            }
          }
        }))
        this.items = items
      } catch (err) {
        console.log(err)
      }
    },
    scoring (item) {
      this.data.score = item.score
      this.data.file = null
    },
    comment (sid) {
      this.$agent.Submission.grade(sid, { score: Number(this.data.score) })
        .then(() => {
          if (this.data.file) {
            var formData = new FormData()
            formData.append('comment', this.data.file)
            return this.$agent.Submission.modify(sid, formData)
          }
          return true
        })
        .then(() => { this.dialog = false; this.$router.go(0) })
        .catch((err) => console.log(err))
    },
  }
}
</script>
