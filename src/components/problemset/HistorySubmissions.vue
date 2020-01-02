<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th 
              v-for="header in submHeader"
              :key="header"
              class="text-left"
            ><p class="title" v-text="header"></p></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!show">
            <td v-for="header in submHeader" :key="header">
              <v-skeleton-loader
                class="mx-auto"
                type="text"
              ></v-skeleton-loader>
            </td>
          </tr>
          <tr 
            v-for="(data, idx) in submData"
            :key="idx"
          >
            <td
              v-for="header in submHeader"
              :key="header"
            ><p class="title" v-if="header=='Status'"><a target="_blank" rel="noopener noreferrer" :href="'/submission/'+data.id" v-text="STATUS[data[header]]" :style="{color: COLOR[data[header]]}"></a></p>
             <p class="body-1" v-else-if="header==='Run Time' && data[header]" v-text="data[header]+'ms'"></p>
             <p class="body-1" v-else-if="header==='Memory' && data[header]" v-text="data[header]+'KB'"></p>
             <p class="body-1" v-else v-text="data[header]"></p></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {

  name: 'HistorySubmissions',

  props: ['submData', 'show'],

  data () {
    return {
      submHeader: ['Timestamp', 'Status', 'Score', 'Run Time', 'Memory', 'Language'],
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceen', 'Runtime Error', 'Judge Error'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C'],
    }
  }
}
</script>

<style lang="css" scoped>
</style>