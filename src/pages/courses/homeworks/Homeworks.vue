<template>
  <div>
    <Creator v-if="perm" v-model="dialog" type="New" title="Homework" @cancel="cancel" @post="post">
      <template slot="content">
        <v-form v-model="validForm" ref="form">
          <ui-alert
            v-model="errAlert"
            dense
            type="error"
            :alertMsg="errMsg"
          ></ui-alert>
          <v-text-field
            label="Homework Title"
            counter="64"
            :rules="titleRules"
            v-model="hw.title"
          ></v-text-field>
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
                :nudge-right="100"
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
                  calendar-class="my-datepicker_calendar"
                  @input="menu[idx*2] = false" 
                  color="primary"
                  no-title
                  width="500px"
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
          <!-- <v-switch
            v-model="hw.scoreboardStatus"
            label="Show Scoreboard"
          ></v-switch> -->
          <v-select
            v-model="hw.problemIds"
            :items="probs"
            item-text="displayedName"
            item-value="problemId"
            :menu-props="{ maxHeight: '400' }"
            label="Select Problems"
            multiple
          ></v-select>
        </v-form>
      </template>
    </Creator>
    
    <ShowHomework :items="items" :probs="probs" :perm="perm"
      @edit="edit" @delete="deleteHw"
    ></ShowHomework>
  </div>
</template>

<script>
import Creator from '@/components/courses/Creator'
import ShowHomework from '@/components/courses/ShowHomework'
var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
var localISOTime = (v) => {
  return (new Date(new Date(v) - tzoffset)).toISOString().slice(0, -1);
}
export default {

  name: 'Homeworks',

  components: {
    Creator, ShowHomework,
  },

  data () {
    return {
      items: [],
      validForm: false,
      dialog: false,
      perm: false,
      titleRules: [
        v => !!v || 'Sorry, the title cannot be empty',
        v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters',
      ],
      contentRules: [
        v => !!v || 'Sorry, the content cannot be empty',
        v => !!v && v.length <= 100000 || 'Sorry, the length must be ≤ 100000 characters',
      ],
      hw: {
        'title': '',
        'content': '',
        'startDate': '',
        'endDate': '',
        'startTime': '',
        'endTime': '',
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
      errMsg: '',
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
              'id': ele.id,
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
          this.probs = res.data.data;
          this.probs.forEach(ele => {
            ele['displayedName'] = ele.problemId + ' - ' + ele.problemName;
          })
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getStatus(st, ed) {
      var now = Math.floor(new Date().getTime() / 1000);
      if ( now < st ) return 'Not Started';
      else if ( now <= ed ) return 'Running';
      else  return 'End';
    },
    cancel() {
      this.$refs.form.reset();
      this.dialog = false;
    },
    edit(idx, id) {
      this.editing = id;
      this.type = 'Update';
      this.hw.title = this.items[idx].title;
      this.hw.content = this.items[idx].content;
      this.hw.startDate = localISOTime(this.items[idx].start).substr(0,10);
      this.hw.endDate = localISOTime(this.items[idx].end).substr(0,10);
      this.hw.startTime = localISOTime(this.items[idx].start).substr(11,5);
      this.hw.endTime = localISOTime(this.items[idx].end).substr(11,5);
      this.hw.problemIds = this.items[idx].problemIds;
      this.hw.scoreboardStatus = this.items[idx].scoreboardStatus;
      this.dialog = true;
    },
    post() {
      if ( this.$refs.form.validate() ) {
        var stD = this.hw.startDate.split('-');
        var edD = this.hw.endDate.split('-');
        if ( this.editing != -1 ) {
          var data = {
            'newName': this.hw.title,
            'markdown': this.hw.content,
            'start': new Date(stD[0]+'/'+stD[1]+'/'+stD[2]+' '+this.hw.startTime).getTime() / 1000,
            'end': new Date(edD[0]+'/'+edD[1]+'/'+edD[2]+' '+this.hw.endTime).getTime() / 1000,
            'problemIds': this.hw.problemIds,
            'scordboardStatus': this.hw.scordboardStatus,
          }
          this.$http.put(`/api/homework/${this.editing}`, data)
            .then((res) => {
              console.log(res);
              this.cancel();
              this.$router.go(0);
            })
            .catch((err) => {
              console.log(err);
              this.errMsg = 'error';
              // this.errMsg = err.response.message;
              this.errAlert = true;
            })
        } else {
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
              this.cancel();
              this.$router.go(0);
            })
            .catch((err) => {
              console.log(err);
              this.errMsg = 'error';
              // this.errMsg = err.response.message;
              this.errAlert = true;
            })
        }
      }
    },
    deleteHw(idx, id) {
      this.$http.delete(`/api/homework/${id}`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}})
        .then((res) => {
          this.$router.go(0);
          // console.log(res);
        })
        .catch((err) => {
        });
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