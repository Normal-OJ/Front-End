<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '60vw' : '95vw', height: '100%' }"
  >
    <v-card height="100%" elevation="12">
      <v-card-title class="headline font-weight-bold">All Courses</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th style="width: 50%;">Course</th>
              <th style="width: 20%;">Teacher</th>
              <th style="width: 30%;">TA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="perm!==-1 && perm <= 1">
              <td colspan="3" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? 'var(--v-gray)' : 'var(--v-white)' }"
                    @click="dialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon>mdi-plus</v-icon>New Course</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr v-for="item in items" :key="item.title">
              <td class="subtitle-1"><a :href="item.path">{{ item.title }}</a></td>
              <td class="subtitle-1">{{ item.teacher.username }}</td>
              <td class="subtitle-1">
                <span class="pr-1" v-for="ta in item.ta" :key="ta">{{ ta }}</span>
              </td>
            </tr>
            <tr v-if="!items">
              <td colspan="3"><Spinner /></td>
            </tr>
            <tr v-else-if="items.length===0">
              <td colspan="3">You have not enrolled in any course.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'">
      <template slot="title">New Course</template>
      <template slot="body">
        <v-card-text>
          <v-form
            ref="form"
            v-model="form"
          >
            <ui-alert
              v-model="errAlert"
              dense
              type="error"
              :alertMsg="errMsg"
            ></ui-alert>
            <v-text-field
              v-model="courseName"
              label="Course Name"
              :rules="courseNameRules"
              counter="64"
            ></v-text-field>
            <v-text-field
              v-if="perm===0"
              v-model="teacher"
              label="Teacher"
            ></v-text-field>
          </v-form>
        </v-card-text>
      </template>
      <template slot="action-ok">
        <ui-button color="primary" @click.native="create">
          <template slot="content">Submit</template>
        </ui-button>
      </template>
    </ui-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Spinner from '@/components/ui/Spinner.vue'

export default {

  name: 'Courses',

  components: { Spinner },

  data () {
    return {
      items: null,
      dialog: false,
      form: false,
      teacher: '',
      courseName: '',
      courseNameRules: [
        v => !!v || 'Please enter the course name you wanna create.',
        v => (!!v && v.length <= 64) || 'Sorry, the length must be ≤ 64 characters.'
      ],
      errAlert: false,
      errMsg: ''
    }
  },

  computed: {
    ...mapState({
      perm: state => state.role
    })
  },

  beforeMount () {
    this.getCourses()
  },

  methods: {
    getCourses () {
      this.$agent.Course.getList()
        .then((res) => {
          this.items = res.data.data.map(r => ({
            title: r.course,
            teacher: r.teacher,
            path: `/course/${r.course}`,
            ta: r.TAs
          }))
        })
    },
    create () {
      if (this.$refs.form.validate()) {
        this.$agent.Course.create({ course: this.courseName, teacher: this.teacher })
          .then(() => {
            this.dialog = false
            this.$router.push(`/course/${this.courseName}`)
          })
          .catch((error) => {
            this.errMsg = `${error.response.data.message}`
            this.errAlert = true
            throw error
          })
      }
    }
  }
}
</script>
