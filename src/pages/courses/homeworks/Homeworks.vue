<template>
  <div>
    <Creator v-if="canWriteCourse" v-model="dialog" type="New" title="Homework" @cancel="cancel" @post="post">
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

    <ShowHomework v-if="probs && items" :items="items" :probs="probs" :perm="canWriteCourse" :user="username"
      @edit="edit" @delete="deleteHw"
    />
    <Spinner v-else />
  </div>
</template>

<script>
import Creator from '@/components/courses/Creator'
import ShowHomework from '@/components/courses/ShowHomework'
import Spinner from '@/components/ui/Spinner.vue'
import { mapState } from 'vuex'

var offset = (new Date().getTimezoneOffset()) * 60 * 1000

export default {

  name: 'Homeworks',

  components: {
    Creator, ShowHomework, Spinner
  },

  data () {
    return {
      items: null,
      validForm: false,
      dialog: false,
      titleRules: [
        v => !!v || 'Sorry, the title cannot be empty',
        v => (!!v && v.length <= 64) || 'Sorry, the length must be ≤ 64 characters'
      ],
      contentRules: [
        v => !!v || 'Sorry, the content cannot be empty',
        v => (!!v && v.length <= 100000) || 'Sorry, the length must be ≤ 100000 characters'
      ],
      hw: {
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        problemIds: [],
        scoreboardStatus: false
      },
      menu: [false, false, false, false],
      editing: -1,
      datetimes: [
        { lower: 'start', upper: 'Start' },
        { lower: 'end', upper: 'End' }
      ],
      probs: null,
      errAlert: false,
      errMsg: '',
      // tas: []
    }
  },

  computed: {
    ...mapState({
      username: state => state.username,
      role: state => state.role
    }),
    canWriteCourse () {
      return this.role <= 1
      // return this.role <= 1 || this.tas.include(ta => ta.username === this.username)
    }
  },

  beforeMount () {
    this.getCourseInfo()
    this.getProblems()
    this.getHomework()
  },

  methods: {
    getHomework () {
      this.$agent.Course.getHomeworks(this.$route.params.name)
        .then((res) => {
          var temp = [[], [], []]
          res.data.data.sort((a, b) => { return a.end - b.end })
          res.data.data.forEach(ele => {
            var status = this.getStatus(ele.start, ele.end)
            temp[status === 'Running' ? 0 : status === 'Not Started' ? 1 : 2].push({
              title: ele.name,
              content: ele.markdown,
              status: status,
              start: this.$formatTime(ele.start),
              stStamp: ele.start * 1000,
              end: this.$formatTime(ele.end),
              edStamp: ele.end * 1000,
              problemIds: ele.problemIds,
              scoreboardStatus: ele.scoreboardStatus,
              studentStatus: ele.studentStatus,
              id: ele.id
            })
          })
          this.items = [...temp[0], ...temp[1], ...temp[2]]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getProblems () {
      this.$agent.Problem.getList({ offset: 0, count: -1, course: this.$route.params.name })
        .then((res) => {
          this.probs = res.data.data
          this.probs.forEach(ele => {
            ele.displayedName = ele.problemId + ' - ' + ele.problemName
          })
        })
    },
    getStatus (st, ed) {
      var now = Math.floor(new Date().getTime() / 1000)
      if (now < st) return 'Not Started'
      else if (now <= ed) return 'Running'
      else return 'End'
    },
    cancel () {
      this.editing = -1
      this.$refs.form.reset()
      this.dialog = false
    },
    edit (idx, id) {
      this.editing = id
      this.type = 'Update'
      this.hw.title = this.items[idx].title
      this.hw.content = this.items[idx].content

      this.hw.startDate = new Date(this.items[idx].stStamp - offset).toISOString().substr(0, 10)
      this.hw.endDate = new Date(this.items[idx].edStamp - offset).toISOString().substr(0, 10)
      this.hw.startTime = new Date(this.items[idx].stStamp - offset).toISOString().substr(11, 5)
      this.hw.endTime = new Date(this.items[idx].edStamp - offset).toISOString().substr(11, 5)

      this.hw.problemIds = this.items[idx].problemIds
      this.hw.scoreboardStatus = this.items[idx].scoreboardStatus
      this.dialog = true
    },
    post () {
      if (this.$refs.form.validate()) {
        var stD = this.hw.startDate.split('-')
        var edD = this.hw.endDate.split('-')
        var data = {
          markdown: this.hw.content,
          start: new Date(stD[0] + '/' + stD[1] + '/' + stD[2] + ' ' + this.hw.startTime).getTime() / 1000,
          end: new Date(edD[0] + '/' + edD[1] + '/' + edD[2] + ' ' + this.hw.endTime).getTime() / 1000,
          problemIds: this.hw.problemIds,
          scordboardStatus: this.hw.scordboardStatus
        }
        if (this.editing !== -1) {
          data.newName = this.hw.title
          this.$agent.Homework.modify(this.editing, data)
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
            .catch(() => {
              this.errMsg = 'error'
              this.errAlert = true
            })
        } else {
          data.courseName = this.$route.params.name
          data.name = this.hw.title
          this.$agent.Homework.create(data)
            .then(() => {
              this.cancel()
              this.$router.go(0)
            })
            .catch(() => {
              this.errMsg = 'error'
              this.errAlert = true
            })
        }
      }
    },
    deleteHw (idx, id) {
      this.$agent.Homework.delete(id)
        .then(() => {
          this.$router.go(0)
        })
    },
    getCourseInfo () {
      // this.$agent.Course.getInfo(this.$route.params.name)
      //   .then((res) => {
      //     this.tas = res.data.data.TAs
      //   })
    }
  }
}
</script>

<style lang="css">
.v-date-picker-table {
  height: 100% !important;
}
</style>
