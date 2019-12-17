<template>
  <div style="width: 70vw; margin: 0 auto;">
    <v-form>
      <v-card class="px-3 ma-3">
        <v-card-title>
          User Information
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-text-field
              v-model="info.displayedName"
              label="Display Name"
              class="mx-1"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="info.username"
              label="Username"
              class="mx-1"
              outlined
              readonly
            ></v-text-field>
            <v-text-field
              v-model="info.email"
              label="Email"
              class="mx-1"
              outlined
              readonly
            ></v-text-field>
          </v-row>
          <v-row>
            <v-textarea
              v-model="info.bio"
              label="Bio"
              class="mx-1"
              outlined
            ></v-textarea>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="primary"
            class="mb-2"
            @click="update"
          ><v-icon class="mr-2">mdi-send</v-icon>Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-form
      v-model="passwdForm"
      ref="passwdForm"
    >
      <v-card class="px-3 ma-3">
        <v-card-title>
          Change Password
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
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
          <v-row>
            <v-text-field
              v-model="passwd.newPassword"
              label="New Password"
              class="mx-1"
              type="password"
              :rules="[v => !!v || 'Please enter new password.']"
              outlined
            ></v-text-field>
            <v-text-field
              label="Confirm"
              class="mx-1"
              type="password"
              :rules="[v => !!v && v===passwd.newPassword || 'Sorry, password doesn\'t match']"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="passwd.oldPassword"
              label="Current Password"
              type="password"
              :rules="[v => !!v || 'Please enter current password']"
              class="mx-1"
              outlined
            ></v-text-field>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="primary"
            class="mb-2"
            @click="submit"
          ><v-icon class="mr-2">mdi-send</v-icon>Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
const API_BASE_URL = '/api';

export default {

  name: 'Profile',

  data () {
    return {
      passwdForm: false,
      passwd: {
        'newPassword': '',
        'oldPassword': '',
      },
      info: {
        'username': '',
        'email': '',
        'displayedName': '',
        'bio': '',
      },
      errAlert: false,
      errMsg: [],
    }
  },

  beforeMount () {
    if ( !this.$cookies.isKey('jwt') )
      this.$router.push('/');
    this.getProfile();
  },

  methods: {
    getProfile() {
      this.$http.get(`${API_BASE_URL}/profile`)
        .then((res) => {
          // console.log(res.data.data);
          this.info = res.data.data;
        })
        .catch((err) => {
          // console.log(err);
        })
    },
    update() {
      this.$http.post(`${API_BASE_URL}/profile`, this.info)
        .then((res) => {
          this.$router.go(0);
          // console.log(res);
        })
        .catch((err) => {
          // console.log(err);
        })
    },
    submit() {
      if ( this.$refs.passwdForm.validate() ) {
        this.$http.post(`${API_BASE_URL}/auth/change-password`, this.passwd)
        .then((res) => {
          this.$router.go(0);
          // console.log(res);
        })
        .catch((err) => {
          this.errMsg = ['Sorry, your password do not match.'];
          this.errAlert = true;
          // console.log(err);
        })
      }
    },
  }
}
</script>

<style lang="css" scoped>
</style>