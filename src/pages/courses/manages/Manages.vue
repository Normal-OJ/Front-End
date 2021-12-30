<template>
  <div>
    <div class="pa-3">
      <v-bottom-navigation
        v-model="activeBtn"
        color="primary"
        style="
          -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
        "
        grow
      >
        <v-btn class="subtitle-2" value="students">
          <span>Students</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>

        <v-btn class="subtitle-2" value="problems">
          <span>Problems</span>
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>

    <ManageStudents
      v-show="activeBtn==='students'"
      :items="items"
      :users="users"
    ></ManageStudents>

    <ManageProblems v-show="activeBtn==='problems'"></ManageProblems>

  </div>
</template>

<script>
import ManageStudents from './ManageStudents'
import ManageProblems from './ManageProblems'

export default {

  name: 'Manages',

  components: {
    ManageStudents, ManageProblems
  },

  data () {
    return {
      activeBtn: 'students',
      dialog: false,
      users: [],
      items: [],
      errAlert: false,
      errMsg: '',
      newUsers: []
    }
  },

  created () {
    this.getStudents()
  },

  methods: {
    getStudents () {
      this.$agent.Course.getInfo(this.$route.params.name)
        .then((res) => {
          const data = res.data.data
          this.items = []
          for (const key in data.studentNicknames) {
            this.items.push({ username: key, displayName: data.studentNicknames[key] })
          }
          this.getUsers()
        })
    },
    getUsers () {
      this.$agent.Course.getInfo('Public')
        .then((res) => {
          var data = res.data.data
          this.users = []
          for (var key in data.studentNicknames) {
            if (!this.findInItems(key)) {
              this.users.push({ username: key, displayName: data.studentNicknames[key] })
            }
          }
        })
    }
  }
}
</script>
