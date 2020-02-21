<template>
  <ui-dialog
    v-model="statusDialog"
    width="95vw"
  >
    <template slot="activator">
      <ui-button
        @click.native="statusDialog = !statusDialog"
        block
        color="info"
      ><template slot="content">View Student Status</template></ui-button>
    </template>
    <template slot="title">Status</template>
    <template slot="body">
      <v-simple-table class="px-3">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary" v-text="'username'"></th>
              <th
                v-for="(prob, idx) in probs"
                :key="idx"
                class="font-weight-bold subtitle-1 text--primary"
                v-text="(idx+1) + ' (id: ' + prob + ')'"
              ></th>
            </tr></thead>
          <tbody>
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
    </template>
    <template slot="action-cancel"><span></span></template>
  </ui-dialog>
</template>

<script>
export default {

  name: 'CoursesHomeworkScoreboard',

  props: {
    items: {
      type: Object,
      required: true,
    },
    probs: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      statusDialog: false,
    }
  },

}
</script>

<style lang="css" scoped>
</style>