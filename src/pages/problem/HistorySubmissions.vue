<template>
  <v-simple-table>
    <template v-slot:default>
      <thead v-if="type === 2">
        <tr>
          <th><p class="subtitle-1 font-weight-bold">Timestamp</p></th>
          <th><p class="subtitle-1 font-weight-bold">Score</p></th>
          <th><p class="subtitle-1 font-weight-bold">Feedback</p></th>
        </tr>
      </thead>
      <thead v-else>
        <tr>
          <th
            v-for="header in submHeader" :key="header"
          ><p class="subtitle-1 font-weight-bold" v-text="header"></p></th>
        </tr>
      </thead>
      <tbody v-if="type === 2">
        <tr
          v-for="(data, idx) in submData"
          :key="idx"
        >
          <td><p class="subtitle-1" v-text="data['Timestamp']"></p></td>
          <td><p class="subtitle-1" v-text="data['Score']===-1 ? 'Pending' : data['Score']"></p></td>
          <td></td>
        </tr>
      </tbody>
      <tbody v-else>
        <!-- Loading -->
        <template v-if="!show">
          <tr
            v-for="(data, idx) in submData"
            :key="idx"
          >
            <template v-if="data['Status'] === 0" >
              <td v-for="header in submHeader" :key="header">
                <v-skeleton-loader
                  v-if="header!=='Status'"
                  class="mx-auto"
                  type="text"
                ></v-skeleton-loader>
                <p v-else class="subtitle-1">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    :href="'/submission/'+data.id"
                    :style="{ color: SUBMISSION_COLOR[data[header]] }"
                  >{{ SUBMISSION_STATUS[data[header]] }}</a></p>
              </td>
            </template>
          </tr>
        </template>

        <template v-for="(data, idx) in submData">
          <tr :key="-idx" v-if="data['Status']">
            <td class="subtitle-1">{{ data['Timestamp'] }}</td>
            <td class="subtitle-1">
              <a
                target="_blank"
                rel="noopener noreferrer"
                :href="'/submission/'+data.id"
                :style="{ color: SUBMISSION_COLOR[`${data['Status']}`] }"
              >{{ SUBMISSION_STATUS[data['Status']] }}</a>
            </td>
            <td class="subtitle-1">{{ data['Score'] }}</td>
            <td class="subtitle-1">{{ data['Run Time'] }}</td>
            <td class="subtitle-1">{{ data['Memory'] }}</td>
            <td class="subtitle-1">{{ data['Language'] }}</td>
          </tr>
        </template>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { SUBMISSION_STATUS, SUBMISSION_COLOR } from '@/constants/submissions'

export default {

  name: 'HistorySubmissions',

  props: ['submData', 'show', 'type'],

  data () {
    return {
      submHeader: ['Timestamp', 'Status', 'Score', 'RunTime(ms)', 'Memory(KB)', 'Language'],
    }
  },

  computed: {
    SUBMISSION_STATUS() { return SUBMISSION_STATUS },
    SUBMISSION_COLOR() { return SUBMISSION_COLOR },
  },
}
</script>
