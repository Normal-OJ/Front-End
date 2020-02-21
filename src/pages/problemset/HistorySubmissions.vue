<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th 
            v-for="header in submHeader" :key="header"
          ><p class="subtitle-1 font-weight-bold" v-text="header"></p></th>
        </tr>
      </thead>
      <tbody>
        <!-- Loading -->
        <tr 
          v-if="!show"
          v-for="(data, idx) in submData"
          :key="idx"
        >
          <td v-if="data['Status']===0" v-for="header in submHeader" :key="header">
            <v-skeleton-loader
              v-if="header!=='Status'"
              class="mx-auto"
              type="text"
            ></v-skeleton-loader>
            <p v-else class="subtitle-1"><a target="_blank" rel="noopener noreferrer" :href="'/submission/'+data.id" v-text="STATUS[data[header]]" :style="{color: COLOR[data[header]]}"></a></p>
          </td>
        </tr>

        <tr 
          v-for="(data, idx) in submData"
          :key="-idx"
          v-if="data['Status']"
        >
          <td class="subtitle-1">{{ data['Timestamp'] }}</td>
          <td class="subtitle-1">
            <a target="_blank" rel="noopener noreferrer" :href="'/submission/'+data.id"
              :style="{color: COLOR[data['Status']]}"
            >{{ STATUS[data['Status']] }}</a>
          </td>
          <td class="subtitle-1">{{ data['Score'] }}</td>
          <td class="subtitle-1">{{ data['Run Time'] }}</td>
          <td class="subtitle-1">{{ data['Memory'] }}</td>
          <td class="subtitle-1">{{ data['Language'] }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {

  name: 'HistorySubmissions',

  props: ['submData', 'show'],

  data () {
    return {
      submHeader: ['Timestamp', 'Status', 'Score', 'RunTime(ms)', 'Memory(KB)', 'Language'],
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C', '#BF360C'],
    }
  }
}
</script>

<style lang="css" scoped>
</style>