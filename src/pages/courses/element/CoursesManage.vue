<template>
  <div>
    <div class="pa-3">
      <v-bottom-navigation
        v-model="activeBtn"
        color="primary"
        grow
      >
        <v-btn value="students">
          <span>Students</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>

        <v-btn value="problems">
          <span>Problems</span>
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>

    <ManageStudents v-show="activeBtn==='students'"></ManageStudents>

    <ManageProblems v-show="activeBtn==='problems'"></ManageProblems>

  </div>
</template>

<script>
import ManageStudents from './ManageStudents';
import ManageProblems from './ManageProblems';

export default {

  name: 'CoursesManage',

  components: {
    ManageStudents, ManageProblems,
  },

  data () {
    return {
      activeBtn: 'students',
      dialog: false,
      users: [],
      items: [],
      perm: true,
      errAlert: false,
      errMsg: '',
      newUsers: [],
    //   headers: [
    //     { 'title': 'username', 'key': 'username' },
    //     { 'title': 'display name', 'key': 'displayedName' },
    //     { 'title': 'role', 'key': 'role' }
    //   ],
    //   dialog: false,
    //   remove: false,
    //   users: [],
    //   TAs: [],
    //   oldUsers: [],
    //   editing: -1,
    }
  },

  // beforeMount() {
    // this.getOldUsers();
    // this.getUsers();
  // },  

  methods: {
    // check(idx) {
    //   this.editing = idx;
    //   if ( editing >= this.TAs.length ) {

    //   } else {
    //     if ( this.oldUsers[editing-this.TAs.length].role === 'Remove from course' ) {
    //       this.remove = true;
    //     }
    //   }
    // },
    // submit() {
      
    // },
    // del() {
    //   if ( editing >= this.TAs.length ) {
    //     this.TAs.splice(editing,1);
    //   } else {
    //     this.oldUsers.splice(editing-this.TAs.length,1);
    //   }
    //   var studentNicknames = {};
    //   this.oldUsers.forEach(ele => {
    //     studentNicknames[ele.username] = ele.displayName;
    //   })
    //   this.$http.delete(`/api/course/${this.$route.params.name}`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}, data: {'TAs': TAs, 'studentNicknames': studentNicknames}})
    // },
    // getOldUsers() {
    //   this.$http.get(`/api/course/${this.$route.params.name}`)
    //     .then((res) => {
    //       var data = res.data.data;
    //       data.TAs.forEach(ele => {
    //         this.TAs.push(ele);
    //       })
    //       for ( var key in data.studentNicknames ) {
    //         this.oldUsers.push({'username': key, 'displayName': data.studentNicknames[key]});
    //       }
    //     })
    //     .catch((err) => {

    //     })
    // },
    // getUsers() {
    //   this.$http.get('/api/course/Public')
    //     .then((res) => {
    //       // console.log(res);
    //       var data = res.data.data;
    //       for ( var key in data.studentNicknames ) {
    //         if ( !find(key) ) {
    //           this.users.push({'username': key, 'displayName': data.studentNicknames[key]});
    //         }
    //       }
    //     })
    //     .catch((err) => {
    //       // console.log(err);
    //     })
    // },
    // find(username) {
    //   if ( this.oldUsers.indexOf(username) >= 0 ) return true;
    //   for ( var i=0; i<this.TAs.length; i++ ) {
    //     if ( this.TAs[i].usrname === username ) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },
  },
}
</script>

<style lang="css" scoped>
</style>