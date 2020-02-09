<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '60vw' : '95vw', height: '100%' }"
  >
    <v-card height="100%" elevation="12">
      <v-card-title class="headline">All Courses</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: 50%;">Course</th>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: 20%;">Teacher</th>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: 30%;">TA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="perm!==-1 && perm <= 1">
              <td colspan="3" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? '#eee' : '#fff' }"
                    @click="dialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon color="black">mdi-plus</v-icon>New Course</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr v-for="item in items" :key="item.title">
              <td class="subtitle-1"><a :href="`/course/${item.title}`">{{ item.title }}</a></td>
              <td class="subtitle-1">{{ item.teacher.username }}</td>
              <td class="subtitle-1">
                <span class="pr-1" v-for="ta in item.ta">{{ ta }}</span>
              </td>
            </tr>
            <tr v-if="items.length===0">
              <td>You have not enrolled in any course.</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'">
      <template slot="activator"><span></span></template>
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
const API_BASE_URL = '/api';

export default {

  name: 'Courses',

  data () {
    return {
      items: [],
      dialog: false,
      form: false,
      teacher: '',
      courseName: '',
      courseNameRules: [
        v => !!v || 'Please enter the course name you wanna create.', 
        v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters.',
      ],
      errAlert: false,
      errMsg: '',
      perm: -1,
    }
  },

  beforeMount () {
    this.getCourses();
    this.getProfile();
  },

  methods: {
    getCourses() {
      this.$http.get('/api/course')
        .then((res) => {
          // console.log(res);
          res.data.data.forEach(ele => {
            this.items.push({'title': ele.course, 'teacher': ele.teacher, 'path': `/${ele.course}`, 'ta': ele.TAs})
          })
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    getProfile() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true ) {
          this.perm = payload.role;
        } else {
          // this.$router.push('/');
        }
      } else {
        // this.$router.push('/');
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    create() {
      if ( this.$refs.form.validate() ) {
        this.$http.post('/api/course', {'course': this.courseName, 'teacher': this.teacher})
          .then((res) => {
            this.dialog = false;
            this.$router.go(0);
          })
          .catch((err) => {
            this.errMsg = `${err.response.data.message}`;
            this.errAlert = true;
          })
      }
    },
  }
}
</script>

<style lang="css" scoped>
table {

}
</style>