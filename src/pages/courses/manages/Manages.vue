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

    <Spinner v-if="!items" />
    <ManageStudents
      v-if="items && activeBtn==='students'"
      :items="items"
      :users="users"
    ></ManageStudents>

    <ManageProblems v-show="activeBtn==='problems'"></ManageProblems>

  </div>
</template>

<script>
import ManageStudents from './ManageStudents'
import ManageProblems from './ManageProblems'
import Spinner from '@/components/ui/Spinner.vue'

export default {

  name: 'Manages',

  components: {
    ManageStudents, ManageProblems, Spinner
  },

  data () {
    return {
      activeBtn: 'students',
      dialog: false,
      users: [],
      items: null,
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
          this.items = res.data.data.students
          this.getUsers()
        })
    },
    getUsers () {
      this.$agent.Course.getInfo('Public')
        .then((res) => {
          this.users = res.data.data.students
            .filter(r => !this.items.includes(({ username }) => username === r.username))
        })
    }
  }
}
</script>
