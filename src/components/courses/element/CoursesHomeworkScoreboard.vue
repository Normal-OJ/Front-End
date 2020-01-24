<template>
  <v-dialog
    v-model="statusDialog"
    :width="this.$vuetify.breakpoint.mdAndUp ? '95vw' : '50vw'"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="title text-none"
        v-on="on"
        dark
        block
        color="primary"
      >View Student Status</v-btn>
    </template>
    <v-card>
      <v-card-title
        class="headline primary white--text"
      >
        Status
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="statusDialog = false"
        ><v-icon class="white--text">mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
        <v-simple-table class="px-3">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left title" v-text="'username'"></th>
                <th
                  v-for="(prob,idx) in probs"
                  :key="idx"
                  class="text-left title"
                  v-text="prob"
                ></th>
              </tr></thead>
            <tbody>
              <tr
                v-for="(item,idx) in Object.keys(items)"
                :key="idx"
              >
                <td class="title text-left" v-text="item"></td>
                <td
                  v-for="(prob,idx) in probs"
                  :key="idx"
                  class="text-left title"
                  v-text="(items[item][prob].problemStatus===0 ? 'Solved' : 'Unsolved')+'('+items[item[prop].score]+'pts)'"
                ></td></tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {

  name: 'CoursesHomeworkScoreboard',

  props: ['items', 'probs'],

  data () {
    return {
      statusDialog: false,
    }
  },

}
</script>

<style lang="css" scoped>
</style>