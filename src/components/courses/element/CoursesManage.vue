<!-- <template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <h3 class="mt-6 px-6">Manage Students</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6" md="3">
        <v-btn class="text-none title mt-6 ml-6" dark color="primary" @click="dialog = true" large>
          <v-icon class="pr-1">mdi-plus</v-icon>
          Add User
        </v-btn>
      </v-col>
    </v-row>
    <v-simple-table class="px-6">
      <template v-slot:default>
        <thead>
          <tr>
            <th
              v-for="(header, idx) in headers"
              :key="idx"
              class="title"
              v-text="header.title"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(ta, idx) in TAs"
            :key="idx"
            class="title"
          >
            <td class="title" v-text="ta.username"></td>
            <td class="title" v-text="ta.displayedName"></td>
            <td class="title">
              <v-select
                v-model="TAs[idx].role"
                value="TA"
                :items="['TA', 'Student', 'Remove from course']"
                @change="check(idx)"
              ></v-select>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-dialog v-model="dialog" width="70vw">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="headline">Add User</div>
          <v-spacer></v-spacer>
          <v-btn tile icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="title pt-3 black--text">
          <v-alert
            v-model="errAlert"
            dismissible
            colored-border
            border="left"
            dense
            elevation="2"
            type="error"
            transition="scroll-y-transition"
          ><v-row v-for="(msg, idx) in errMsg" :key="idx">{{ msg }}</v-row></v-alert>
          <v-combobox
            label="Users(you can create new tag)"
            v-model="newUsers"
            :items="users"
            item-name="username"
            chips
            multiple
          ></v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            outlined
            @click="dialog = false"
            class="text-none title"
          >Cancel</v-btn>
          <v-btn
            color="primary"
            dark
            @click="submit"
            class="text-none title"
          >Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="remove" width="70vw">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="headline">Remove User</div>
          <v-spacer></v-spacer>
          <v-btn tile icon @click="remove = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="title pt-3 black--text">
          Are you sure to remove this user?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="remove = false"
            class="text-none title"
          >No</v-btn>
          <v-btn
            color="secondary"
            dark
            @click="del"
            class="text-none title"
          >Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {

  name: 'CoursesManage',

  data () {
    return {
      headers: [
        { 'title': 'username', 'key': 'username' },
        { 'title': 'display name', 'key': 'displayedName' },
        { 'title': 'role', 'key': 'role' }
      ],
      dialog: false,
      remove: false,
      users: [],
      TAs: [],
      oldUsers: [],
      errAlert: false,
      errMsg: [],
      newUsers: [],
      editing: -1,
    }
  },

  beforeMount() {
    this.getOldUsers();
    this.getUsers();
  },  

  methods: {
    check(idx) {
      this.editing = idx;
      if ( editing >= this.TAs.length ) {

      } else {
        if ( this.oldUsers[editing-this.TAs.length].role === 'Remove from course' ) {
          this.remove = true;
        }
      }
    },
    submit() {
      
    },
    del() {
      if ( editing >= this.TAs.length ) {
        this.TAs.splice(editing,1);
      } else {
        this.oldUsers.splice(editing-this.TAs.length,1);
      }
      var studentNicknames = {};
      this.oldUsers.forEach(ele => {
        studentNicknames[ele.username] = ele.displayName;
      })
      this.$http.delete(`/api/course/${this.$route.params.name}`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}, data: {'TAs': TAs, 'studentNicknames': studentNicknames}})
    },
    getOldUsers() {
      this.$http.get(`/api/course/${this.$route.params.name}`)
        .then((res) => {
          var data = res.data.data;
          data.TAs.forEach(ele => {
            this.TAs.push(ele);
          })
          for ( var key in data.studentNicknames ) {
            this.oldUsers.push({'username': key, 'displayName': data.studentNicknames[key]});
          }
        })
        .catch((err) => {

        })
    },
    getUsers() {
      this.$http.get('/api/course/Public')
        .then((res) => {
          // console.log(res);
          var data = res.data.data;
          for ( var key in data.studentNicknames ) {
            if ( !find(key) ) {
              this.users.push({'username': key, 'displayName': data.studentNicknames[key]});
            }
          }
        })
        .catch((err) => {
          // console.log(err);
        })
    },
    find(username) {
      if ( this.oldUsers.indexOf(username) >= 0 ) return true;
      for ( var i=0; i<this.TAs.length; i++ ) {
        if ( this.TAs[i].usrname === username ) {
          return true;
        }
      }
      return false;
    },
  },
}
</script>

<style lang="css" scoped>
</style> -->