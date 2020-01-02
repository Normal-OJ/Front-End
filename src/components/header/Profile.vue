<template>
  <div style="width: 50vw; margin: 0 auto;">
    <v-card class="px-3 ma-3">
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title class="headline" v-text="'Avatar'"></v-card-title>
        </div>
        <div class="d-flex align-center">
          <v-card-title>
            <p>
              Your avatar depends on&nbsp;
              <a href="https://en.gravatar.com/">Gravatar</a>
            </p>
          </v-card-title>
        </div>
        <v-avatar :src="avatar" :aspect-ratio="1" size="125" contain class="ma-3" tile>
          <v-img :src="avatar"></v-img>
        </v-avatar>
      </div>
    </v-card>
    <v-form v-model="profileForm" ref="profileForm">
      <v-card class="px-3 ma-3">
        <v-card-title>User Information</v-card-title>
        <v-divider></v-divider>
        <v-alert
          v-if="errAlert === 'profile'"
          dismissible
          colored-border
          border="left"
          dense
          elevation="2"
          type="error"
          transition="scroll-y-transition"
        >
          <v-row v-for="(msg, idx) in errMsg" :key="idx">{{ msg }}</v-row>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-text-field
              v-model="info.displayedName"
              label="Display Name"
              class="mx-1"
              outlined
              :rules="[v => v.length <= 16 || 'Display name\'s length must <= 16!']"
            ></v-text-field>
            <v-text-field
              v-model="info.username"
              label="Username"
              class="mx-1"
              color="secondary"
              filled
              readonly
            ></v-text-field>
            <v-text-field
              v-model="info.email"
              label="Email"
              class="mx-1"
              color="secondary"
              filled
              readonly
            ></v-text-field>
          </v-row>
          <v-row>
            <v-textarea
              v-model="info.bio"
              label="Bio"
              class="mx-1"
              outlined
              :rules="[v => v.length <= 64 || 'Bio must shorter than 64!']"
            ></v-textarea>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" class="mb-2" @click="update">
            <v-icon class="mr-2">mdi-send</v-icon>Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-form v-model="passwdForm" ref="passwdForm">
      <v-card class="px-3 ma-3">
        <v-card-title>Change Password</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-alert
            v-if="errAlert === 'passwd'"
            dismissible
            colored-border
            border="left"
            dense
            elevation="2"
            type="error"
            transition="scroll-y-transition"
          >
            <v-row v-for="(msg, idx) in errMsg" :key="idx">{{ msg }}</v-row>
          </v-alert>
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
          <v-btn block color="primary" class="mb-2" @click="submit">
            <v-icon class="mr-2">mdi-send</v-icon>Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import MD5 from './utils.js';

const API_BASE_URL = '/api';

export default {

  name: 'Profile',

  data() {
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
      avatar: null,
      errAlert: '',
      errMsg: [],
      profileForm: false
    }
  },

  beforeMount() {
    this.getProfile();
  },

  methods: {
    getProfile() {
      // this.$http.get(`${API_BASE_URL}/profile`)
      //   .then((res) => {
      //     // console.log(res.data.data);
      //     this.info = res.data.data;
      //   })
      //   .catch((err) => {
      //     // console.log(err);
      //   })
      if (this.$cookies.isKey('jwt')) {
        this.payload = this.parseJwt(this.$cookies.get('jwt'));
        if (this.payload.active === true) {
          this.info.username = this.payload.username;
          this.info.email = this.payload.email;
          this.info.displayedName = this.payload.profile.displayedName;
          this.info.bio = this.payload.profile.bio;
          this.setAvatar(this.payload.email);
        }
      } else {
        this.$router.push('/');
      }
    },
    setAvatar(payload) {
      this.avatar = `https://www.gravatar.com/avatar/${MD5(payload)}`;
    },
    parseJwt(token) {
      console.log(atob(token.split('.')[1]));
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    update() {
      if (this.$refs.profileForm.validate()) {
        this.$http.post(`${API_BASE_URL}/profile`, this.info)
          .then((res) => {
            this.$router.go(0);
            // console.log(res);
          })
          .catch((err) => {
            this.errMsg = ['Invalid data!'];
            this.errAlert = 'profile';
          })
      }
    },
    submit() {
      if (this.$refs.passwdForm.validate()) {
        this.$http.post(`${API_BASE_URL}/auth/change-password`, this.passwd)
          .then((res) => {
            this.$router.go(0);
            // console.log(res);
          })
          .catch((err) => {
            this.errMsg = ['Sorry, your password do not match.'];
            this.errAlert = 'passwd';
            // console.log(err);
          })
      }
    },
  }
}
</script>

<style lang="css" scoped>
</style>