<template>
  <v-container>
    <v-row v-if="perm">
      <v-col cols="12">
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            style="cursor: pointer;"
            @click="newCourse = true"
          >
            <v-card-title class="display-1"><v-icon color="black" size="48">mdi-plus</v-icon>Create Course</v-card-title>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(item, idx) in items"
        class="ma-0"
        :key="idx"
        cols="12"
        md="6"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            :to="{'path': '/course'+item.path}"
            style="cursor: pointer;"
          >
            <v-card-title class="headline" v-text="item.title"></v-card-title>
            <v-card-subtitle class="title">
              Teacher: {{ item.teacher.username }}
            </v-card-subtitle>
            <v-card-text class="title">
              TA: 
              <a
                v-for="ta in item.ta"
                class="mx-1"
                v-text="ta.username"
              ></a>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-dialog v-model="newCourse" width="70vw">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="headline">New Course</div>
          <v-spacer></v-spacer>
          <v-btn tile icon @click="newCourse = false"><v-icon>mdi-close</v-icon></v-btn>
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
              label="Course Name"
              counter="64" 
              :rules="[v => !!v || 'Course Name is Required!', v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters.']" 
              v-model="courseName">
            </v-text-field>
            <v-text-field
              label="Teacher(Admin Only)"
              v-model="teacher">
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            outlined
            @click="newCourse = false"
            class="text-none title"
          >Cancel</v-btn>
          <v-btn
            color="primary"
            dark
            @click="post"
            class="text-none title"
          >Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const API_BASE_URL = '/api';

export default {

  name: 'Courses',

  data () {
    return {
      items: [],
      newCourse: false,
      validForm: false,
      teacher: '',
      courseName: '',
      errAlert: false,
      errMsg: [],
      perm: false,
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
          console.log(res);
          res.data.data.forEach(ele => {
            if ( ele.course !== 'Public' ) {
              this.items.push({'title': ele.course, 'teacher': ele.teacher, 'path': `/${ele.course}`, 'ta': ele.TAs})
            }
          })
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProfile() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true ) {
          if ( payload.role <= 1 ) {
            this.perm = true;
          }
        } else {
          this.$router.push('/');
        }
      } else {
        this.$router.push('/');
      }
    },
    parseJwt(token) {
      console.log(atob(token.split('.')[1]));
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    post() {
      if ( this.$refs.form.validate() ) {
        this.$http.post('/api/course', {'course': this.courseName, 'teacher': this.teacher})
          .then((res) => {
            this.newCourse = false;
            this.$router.go(0);
          })
          .catch((err) => {
            this.errMsg = [err.response.data.message];
            this.errAlert = true;
          })
      }
    },
  }
}
</script>

<style lang="css" scoped>
</style>