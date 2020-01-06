<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <h3 class="mt-6 px-6">Manage Problems</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6" md="3">
        <v-btn class="text-none title mt-6 ml-6" dark color="primary" @click="openInfo(0)" large>
          <v-icon class="pr-1">mdi-information-outline</v-icon>
          Information
        </v-btn>
      </v-col>
      <v-col cols="6" md="3">
        <v-btn class="text-none title mt-6 ml-6" dark color="primary" @click="openEdit(-1)" large>
          <v-icon class="pr-1">mdi-plus</v-icon>
          New Problem
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
            v-for="(prob, idx) in probs"
            :key="idx"
          >
            <td
              v-for="(header, idx) in headers"
              :key="idx"
            >
              <p v-if="header.key==='problemName'"><a target="_blank" rel="noopener noreferrer" :href="'/problem/'+prob['id']" v-text="prob[header.key]"></a></p>
              <v-chip-group
                v-else-if="header.key==='tags'"
                :column="true"
              >
                <v-chip
                  v-for="(tag, idx) in prob[header.key]"
                  :key="idx"
                  label
                  color="secondary"
                  outlined
                  :ripple="false"
                >{{ tag }}</v-chip>
              </v-chip-group>
              <p v-else-if="header.key!=='action'" v-text="prob[header.key]"></p>
              <v-layout v-else-if="prob['owner']!==username">
                <v-btn class="text-none subtitle-2 mr-1" @click="openInfo(1,prob['problemId'])" color="secondary">
                  <v-icon color="white">mdi-delete</v-icon>
                  Delete
                </v-btn>
                <v-btn class="text-none subtitle-2 mr-1" @click="openInfo(2,prob['problemId'])">
                  <v-icon>mdi-content-copy</v-icon>
                  Clone
                </v-btn>
                <v-btn class="text-none subtitle-2 mr-1" @click="openInfo(3,prob['problemId'])">
                  <v-icon>mdi-share-all</v-icon>
                  Publish
                </v-btn>
                <v-btn class="text-none subtitle-2 mr-1" @click="openEdit(prob['problemId'])">
                  <v-icon>mdi-pencil</v-icon>
                  Edit
                </v-btn>
              </v-layout>
              <v-layout v-else>
                <v-btn class="text-none subtitle-2 mr-1" @click="openInfo(2,prob['problemId'])">
                  <v-icon>mdi-content-copy</v-icon>
                  Clone
                </v-btn>
              </v-layout>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-dialog v-model="infoDialog" width="70vw">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="headline">{{ info.title[info.id] }}</div>
          <v-spacer></v-spacer>
          <v-btn tile icon @click="infoDialog = false"><v-icon>mdi-close</v-icon></v-btn>
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
          <vue-markdown :source="info.content[info.id]"></vue-markdown>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="info.id<4"
            color="primary"
            outlined
            @click="infoDialog = false"
            class="text-none title"
          >Cancel</v-btn>
          <v-btn
            :color="info.id===0||info.id>3 ? 'primary' : 'secondary'"
            dark
            @click="confirm"
            class="text-none title"
          >{{ info.action[info.id] }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" width="70vw">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="headline">{{ postId===-1 ? 'New Problem' : 'Modify Problem' }}</div>
          <v-spacer></v-spacer>
          <v-btn tile icon @click="editDialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="title pt-3 black--text">
          <v-form
            ref="form"
            v-model="validForm"
          >
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
            <v-text-field
              label="Problem Name(Required)"
              counter="64" 
              :rules="nameRules" 
              v-model="prob.probName">
            </v-text-field>
            <v-textarea 
              label="Problem Description(Required)" 
              :rules="descRules"
              v-model="prob.description"
              no-resize
              auto-grow
            ></v-textarea>
            <v-combobox
              label="Tags(you can create new tag)"
              v-model="prob.tags"
              :items="tags"
              chips
              multiple
            ></v-combobox>
            <v-select
              label="Courses"
              v-model="prob.courses"
              :items="courses"
              chips
              multiple
            ></v-select>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  label="Status(Required)"
                  v-model="prob.status"
                  :items="['Online', 'Offline']"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  label="Type"
                  v-model="prob.type"
                  :items="['Default']"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  color="primary"
                  @click="openInfo(4)"
                  class="text-none title"
                  v-text="'TestCase Format'"
                ></v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  color="primary"
                  @click="openInfo(5)"
                  class="text-none title"
                  v-text="'View TestCase'"
                ></v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Case Score"
                  v-model="prob.caseScore">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Time Limit(ms)" 
                  v-model="prob.timeLimit">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Memory Limit(KB)" 
                  v-model="prob.memoryLimit">
                </v-text-field>
              </v-col>
            </v-row>
            <v-file-input 
              label="Test Case"
              v-model="prob.zip"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="editDialog = false"
            class="text-none title"
          >Cancel</v-btn>
          <v-btn
            color="primary"
            dark
            @click="post"
            class="text-none title"
          >Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {

  name: 'ProblemsManage',

  components: {
    VueMarkdown,
  },

  data () {
    return {
      username: '',
      probs: [],
      ownerBtn: true,
      publicBtn: true,
      headers: [
        { 'title': 'Id', 'key': 'id' }, 
        { 'title': 'Name', 'key': 'problemName' }, 
        { 'title': 'Owner', 'key': 'owner' }, 
        { 'title': 'Tags', 'key': 'tags' }, 
        { 'title': 'Status', 'key': 'status' }, 
        { 'title': 'Action', 'key': 'action' },
      ],
      editing: 0,
      infoDialog: false,
      info: {
        'id': 0,
        'title': ['Information', 'Delete', 'Clone', 'Publish', 'How to build Test Case', 'View Test Case'],
        'content': [
          'Click Action button(Delete, Clone, Publish and Edit) will show the detail of that function.',
          '**This problem will be deleted permanently**.\n  If you just wanna hide this problem, you can change problem `status` from Online to Offline.',
          'Cloning a problem, will **duplicate** a same problem whose `owner` is you.\n  Every problem can be cloned.',
          'Publish will make your problem **Public**.\n  Note that after publishing, `owner` will be replaced with **Admin**, and you will unable to modify it.(you can clone it again, of course)',
          'For a Problem, you can set one or several subtask.\n  For each subtask, exactly one input file & one output file is in need.\n  Please name in `1.in`, `1.out`, `2.in`, `2.out`, ...\n  And pack all of them in a **ZIP file** to upload it.\n\n  Case Score: [score_of_subtask1, score_of_subtask2, ...], the total need be 100. [30, 30, 40], for example.',
          this.getTestCase(),
        ],
        'action': ['Ok', 'Delete Problem', 'Clone Problem', 'Publish Problem', 'Return', 'Return'],
      },
      postId: -1,
      editDialog: false,
      STATUS: ['Online', 'Offline'],
      TYPE: ['Default', 'Fill-in-the-blank'],
      prob: {
        'problemName': '',
        'description': '',
        'tags': [],
        'courses': [],
        'status': 0,
        'type': 0,

        'caseScore': '[100]',
        'timeLimit': '2000',
        'memoryLimit': '32768',
        'zip': null,
      },
      nameRules: [
        v => !!v || 'Problem Name is required!', 
        v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters.'
      ],
      descRules: [
        v => !!v || 'Description is required!',
        v => !!v && v.length <= 100000 || 'Sorry, the length must be ≤ 100000 characters.',
      ],
      tags: [],
      courses: [],
      errAlert: false,
      errMsg: [],
      validForm: true,
    }
  },

  beforeMount() {
    this.username = this.getUsername();
    this.getProblems();
    this.getCourses();
  },

  methods: {
    getTestCase() {

    },
    openEdit(id) {
      this.postId = id;
      this.editDialog = true;
    },
    post() {

    },
    openInfo(id, pid=0) {
      this.info.id = id;
      this.infoDialog = true;
      this.editing = pid;
    },
    confirm() {
      if ( this.info.id === 1 ) {
        this.$http.delete(`/api/problem/manage/${this.editing}`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}, data: {}})
          .then((res) => {
            console.log(res);
            this.infoDialog = false;
          })
          .catch((err) => {
            console.log(err);
            this.errMsg = [err.response.data.message];
            this.errAlert = true;
          })
      } else if ( this.info.id === 2 ) {
        this.$http.post('/api/problem/clone', {'problemId': this.editing})
          .then((res) => {
            console.log(res);
            this.infoDialog = false;
          })
          .catch((err) => {
            console.log(err);
            this.errMsg = [err.response.data.message];
            this.errAlert = true;
          })
      } else if ( this.info.id === 3 ) {
        this.$http.post('/api/problem/publish', {'problemId': this.editing})
          .then((res) => {
            console.log(res);
            this.infoDialog = false;
          })
          .catch((err) => {
            console.log(err);
            this.errMsg = [err.response.data.message];
            this.errAlert = true;
          })
      } else if ( this.info.id > 3 ) {
        this.infoDialog = false;
      }
    },
    getProblems() {
      this.probs = [];
      this.$http.get('/api/problem?offset=0&count=-1')
        .then((res) => {
          console.log(res);
          res.data.data.forEach(ele => {
            ele.tags.forEach(tag => {
              this.tags.push(tag);
            })
            this.$http.get(`/api/problem/view/${ele.problemId}`)
              .then((res) => {
                console.log(res);
                res.data.data['id'] = ele.problemId;
                res.data.data['status'] = res.data.data['status']===0 ? 'Online' : 'Offline';
                this.probs.push(res.data.data);
              })
              .catch((err) => {
                console.log(err);
              })
          })
          this.tags = [...new Set(this.tags)];
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getCourses() {
      this.$http.get('/api/course')
        .then((res) => {
          console.log(res);
          res.data.data.forEach(ele => {
            if ( ele.course !== 'Public' ) {
              this.courses.push(ele.course);
            }
          })
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getUsername() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true ) {
          if ( payload.role <= 1 ) this.perm = true;
          this.username = payload.username;
          return payload.username;
        }
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
  }
}
</script>

<style lang="css" scoped>
</style>