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
          <tr>
            <td>Report</td>
            <td v-for="prob in probs" :key="prob">{{ copycat[prob] }}</td>
          </tr>
          <tr
            v-for="(item, idx) in Object.keys(items)"
            :key="-idx"
          >
            <td class="subtitle-1" v-text="item"></td>
            <td v-for="prob in probs" class="subtitle-1" :key="prob">
              <span
                v-if="items[item][prob].problemStatus!=null"
                :style="{ color: SUBMISSION_COLOR[`${items[item][prob].problemStatus}`] }"
              >{{ SUBMISSION_STATUS[items[item][prob].problemStatus] }}</span>
              <span v-else>Unsolved</span>
              {{ ' / ' + items[item][prob].score + 'pts' }}
              {{ ' / ' + items[item][prob].submissionIds.length + 'tries' }}
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
      copycat: {},
    }
  },

  computed: {
    SUBMISSION_STATUS() { return SUBMISSION_STATUS },
    SUBMISSION_COLOR() { return SUBMISSION_COLOR },
  },

  created () {
    this.getHW()
  },

  methods: {
    getHW () {
      this.$agent.Homework.getInfo(this.$route.params.id)
        .then((res) => {
          this.items = res.data.data.studentStatus
          this.probs = res.data.data.problemIds
          this.getReport()
        })
    },
    getReport () {
      // this.probs.forEach(ele => {
      //   this.$agent.Copycat.create({
      //     problemId: ele,
      //     course: this.$route.params.name
      //   })
      //     .then((res) => {
      //       this.getUrl()
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //     })
      // })
    },
    delay (delayInms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(2)
        }, delayInms)
      })
    }
  }
}
</script>
