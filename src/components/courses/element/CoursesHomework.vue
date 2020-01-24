<template>
  <div>
    <v-row no-gutters v-for="(item, idx) in items" :key="idx" justify="center">
      <v-card
        class="my-6 flex-column d-flex"
        elevation="6"
        width="50vw"
      >
        <v-card-title class="display-2 ma-1">
          <v-chip
            :color="item.status === 'End' ? 'red lighten-2' : 'blue lighten-2'"
            label
            style="left: -40px;"
          >{{ item.status }}</v-chip>
          {{ item.title }}
        </v-card-title>
        <v-card-title class="display-1 ma-1">
          Information
        </v-card-title>
        <v-card-text class="black--text">
          <v-simple-table class="px-3">
            <template v-slot:default>
              <thead></thead>
              <tbody>
                <tr>
                  <td v-text="'Start:'"></td>
                  <td v-text="item.start"></td>
                </tr>
                <tr>
                  <td v-text="'End:'"></td>
                  <td v-text="item.end"></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <vue-markdown :source="item.content"></vue-markdown>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-title class="display-1 ma-1">
          Problems
        </v-card-title>
        <v-simple-table class="px-3">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="title text-left" v-text="'#'"></th>
                <th class="title text-left" v-text="'Problem'"></th>
                <!-- <th v-if="item.studentStatus" class="title text-left" v-text="'Score'"></th> -->
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(id, idx) in item.problemIds"
                :key="idx"
              >
                <td class="title text-left" v-text="idx+1"></td>
                <td class="title text-left">
                  <a target="_blank" rel="noopener noreferrer" :href="'problem/'+id" v-text="findProb(id)"></a>
                </td>
                <!-- <td v-if="item.studentStatus" class="title text-left" v-text="item.studentStatus ? item.studentStatus.id : ''"></td> -->
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-if="perm">
          <v-card-text>
            <CoursesHomeworkScoreboard :items="item.studentStatus" :probs="item.problemIds"></CoursesHomeworkScoreboard>
          </v-card-text>
        </div>
      </v-card>
    </v-row>
    <v-dialog v-if="perm" v-model="hwDialog" :width="this.$vuetify.breakpoint.mdAndUp ? '80%' : '100%'" persistent>
      <template v-slot:activator="{ on }">
        <v-btn right bottom fixed color="primary" fab v-on="on" @click="editing = -1">
          <v-icon large>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="subtitle-1" v-text="editing === -1 ? 'New Homework' : 'Update Homework'"></div>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn tile icon @click="cancelDialog()" v-on="on"><v-icon>mdi-close</v-icon></v-btn>
            </template>
            <span>close</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text class="mt-2">
          <v-form v-model="validForm" ref="form">
            <v-text-field
              label="Homework Title"
              counter="64" 
              :rules="titleRules" 
              v-model="hw.title">
            </v-text-field>
            <v-textarea 
              label="Homework Content" 
              :rules="contentRules"
              v-model="hw.content"
              no-resize
              auto-grow
            ></v-textarea>
            <v-row 
              no-gutters 
              v-for="(datetime, idx) in datetimes" 
              :key="idx"
            >
              <v-col cols="12" md="6">
                <v-menu
                  v-model="menu[idx*2]"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  :nudge-right="125"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="hw[`${datetime.lower}Date`]"
                      :label="`${datetime.upper} Date`"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker 
                    v-model="hw[`${datetime.lower}Date`]" 
                    no-title
                    calendar-class="my-datepicker_calendar"
                    @input="menu[idx*2] = false" 
                    color="primary"
                    full-width
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  ref="menu"
                  v-model="menu[idx*2+1]"
                  :close-on-content-click="false"
                  :return-value.sync="hw[`${datetime.lower}Time`]"
                  transition="scale-transition"
                  :nudge-right="100"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="hw[`${datetime.lower}Time`]"
                      :label="`${datetime.upper} Time`"
                      prepend-icon="mdi-clock"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu[idx*2+1]"
                    v-model="hw[`${datetime.lower}Time`]"
                    format="24hr"
                    color="primary"
                    @click:minute="$refs.menu[idx].save(hw[`${datetime.lower}Time`])"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-switch
              v-model="hw.scoreboardStatus"
              label="Show Scoreboard"
            ></v-switch>
            <v-select
              v-model="hw.problemIds"
              :items="probs"
              item-text="probname"
              item-value="problemId"
              :menu-props="{ maxHeight: '400' }"
              label="Select Problems"
              multiple
            ></v-select>
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="secondary" @click="cancelDialog()">cancel</v-btn>
          <v-btn dark color="primary" @click="post()">post</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
var localISOTime = (new Date()).toISOString().slice(0, -1);
import VueMarkdown from 'vue-markdown'
import CoursesHomeworkScoreboard from './CoursesHomeworkScoreboard'
export default {

  name: 'CoursesHomework',

  components: {
    VueMarkdown, CoursesHomeworkScoreboard,
  },

  data () {
    return {
      items: [],
      validForm: false,
      hwDialog: false,
      perm: false,
      titleRules: [
        v => !!v || 'Sorry, the title cannot be empty',
        v => v.length <= 64 || 'Sorry, the length must be ≤ 64 characters',
      ],
      contentRules: [
        v => !!v || 'Sorry, the content cannot be empty',
        v => v.length <= 100000 || 'Sorry, the length must be ≤ 100000 characters',
      ],
      hw: {
        'title': '',
        'content': '',
        'startDate': (new Date(Date.now() - tzoffset)).toISOString().substr(0, 10),
        'endDate': (new Date(Date.now() - tzoffset)).toISOString().substr(0, 10),
        'startTime': (new Date(Date.now() - tzoffset)).toISOString().substr(11, 5),
        'endTime': (new Date(Date.now() - tzoffset)).toISOString().substr(11, 5),
        'problemIds': [],
        'scoreboardStatus': false,
      },
      menu: [false, false, false, false],
      editing: -1,
      datetimes: [
        { lower: 'start', upper: 'Start' },
        { lower: 'end', upper: 'End' },
      ],
      probs: [],
      errAlert: false,
      errMsg: [],
      username: '',
    }
  },

  beforeMount() {
    this.checkUser(this.getUsername());
    this.getHomework();
    this.getProblems();
  },

  methods: {
    getHomework() {
      this.$http.get(`/api/course/${this.$route.params.name}/homework`)
        .then((res) => {
          console.log(res);
          var temp = [[], [], []];
          res.data.data.forEach(ele => {
            var status = this.getStatus(ele.start, ele.end);
            temp[status === 'Running' ? 0 : status === 'Not Started' ? 1 : 2].push({
              'title': ele.name,
              'content': ele.markdown,
              'status': status,
              'start': this.timeFormat(ele.start),
              'end': this.timeFormat(ele.end),
              'problemIds': ele.problemIds,
              'scoreboardStatus': ele.scoreboardStatus,
              'studentStatus': ele.studentStatus,
            })
          })
          for ( var i=0; i<3; ++i ) {
            temp[i].forEach(ele => {
              this.items.push(ele);
            })
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getProblems() {
      this.$http.get('/api/problem?offset=0&count=-1')
        .then((res) => {
          console.log(res);
          res.data.data.forEach(ele => {
            ele['probname'] = ele.problemId + ' - ' + ele.problemName;
            this.probs.push(ele);
          })
        })
        .catch((err) => {
          console.log(err);
        })
    },
    findProb(id) {
      for ( var i=0; i<this.probs.length; i++ ) {
        if ( this.probs[i].problemId === id ) {
          return this.probs[i].probname;
        }
      }
    },
    getStatus(st, ed) {
      var now = Math.floor(new Date().getTime() / 1000);
      if ( now < st ) return 'Not Started';
      else if ( now <= ed ) return 'Running';
      else  return 'End';
    },
    post() {
      if ( this.$refs.form.validate() ) {
        var stD = this.hw.startDate.split('-');
        var edD = this.hw.endDate.split('-');
        var data = {
          'courseName': this.$route.params.name,
          'name': this.hw.title,
          'markdown': this.hw.content,
          'start': new Date(stD[0]+'/'+stD[1]+'/'+stD[2]+' '+this.hw.startTime).getTime() / 1000,
          'end': new Date(edD[0]+'/'+edD[1]+'/'+edD[2]+' '+this.hw.endTime).getTime() / 1000,
          'problemIds': this.hw.problemIds,
          'scordboardStatus': this.hw.scordboardStatus,
        }
        this.$http.post('/api/homework', data)
          .then((res) => {
            console.log(res);
            this.hwDialog = false;
            this.$router.go(0);
          })
          .catch((err) => {
            console.log(err);
            this.errMsg = [err.response.data.message];
            this.errAlert = true;
          })
      }
    },
    cancelDialog() {
      this.hw.title = '';
      this.hw.content = '';
      this.hwDialog = false;
    },
    checkUser(username) {
      this.$http.get(`/api/course/${this.$route.params.name}`)
        .then((res) => {
          var data = res.data.data;
          data.TAs.forEach(ele => {
            if ( ele.username === username ) {
              this.perm = true;
              return;
            }
          })
        })
        .catch((err) => {
          console.log(err);
        });
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
    timeFormat(time) {
      var tmp = new Date(time * 1000);
      var year = tmp.getFullYear();
      var month = '0' + (tmp.getMonth()+1);
      var date = '0' + tmp.getDate();
      var hour = '0' + tmp.getHours();
      var min = '0' + tmp.getMinutes();
      var sec = '0' + tmp.getSeconds();
      var time = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return time;
    },
  },
}
</script>

<style lang="css">
.v-date-picker-table {
  height: 100% !important;
}
</style>