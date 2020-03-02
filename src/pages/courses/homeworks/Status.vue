<template>
  <v-container>
    <v-simple-table class="px-3">
      <template v-slot:default>
        <thead v-if="probs">
          <tr>
            <th class="font-weight-bold subtitle-1 text--primary" v-text="'username'"></th>
            <th
              v-for="(prob, idx) in probs"
              :key="idx"
              class="font-weight-bold subtitle-1 text--primary"
            >#{{idx+1}} - <a :href="`/problem/${prob}`">Pid:{{prob}}</a></th>
          </tr></thead>
        <tbody v-if="items">
          <!-- <tr>
            <td>Report</td>
            <td v-for="prob in probs"></td>
          </tr> -->
          <tr
            v-for="(item, idx) in Object.keys(items)"
            :key="-idx"
          >
            <td class="subtitle-1" v-text="item"></td>
            <td
              v-for="prob in probs"
              class="subtitle-1"
            >
              {{ (items[item][prob].problemStatus === 0 ? 'Solved' : 'Unsolved') + ' / ' + items[item][prob].score + 'pts' + ' / ' + items[item][prob].submissionIds.length + 'tries' }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
export default {

  name: 'Status',

  data () {
    return {
      items: null,
      probs: null,
    }
  },

  created() {
    this.getHW();
  },

  methods: {
    getHW() {
      this.$http.get(`/api/homework/${this.$route.params.id}`)
        .then((res) => {
          // console.log(res.data.data);
          this.items = res.data.data.studentStatus;
          this.probs = res.data.data.problemIds;
          
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>