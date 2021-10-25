<template>
  <v-container
    :style="{ width: this.$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw' }"
  >
    <v-card class="px-3 pb-3 ma-3">
      <v-card-title>Avatar</v-card-title>
      <v-divider class="py-0 my-0"></v-divider>
      <v-card-subtitle>
        You can change your avatar via<a target="_blank" rel="noopener noreferrer" href="https://zh-tw.gravatar.com/" style="white-space: pre;"> Gravatar</a>
      </v-card-subtitle>
      <v-row justify="center">
        <v-avatar size="100"><v-img :src="avatar"></v-img></v-avatar>
      </v-row>
    </v-card>
    <v-form v-model="profileForm" ref="profileForm">
      <v-card class="px-3 pb-3 ma-3">
        <v-card-title>User Information</v-card-title>
        <v-divider class="py-0 my-0"></v-divider>
        <ui-alert
          v-show="errAlert === 'profile'"
          dense
          :type="errType"
          :alertMsg="errMsg"
        ></ui-alert>
        <v-card-text>
          <v-row>
            <v-text-field
              v-model="info.displayedName"
              label="Display Name"
              class="mx-1"
              outlined
              :rules="[v => v.length <= 16 || 'You can set Display name at most 16 characters!']"
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
              :rules="[v => v.length <= 64 || 'You can type at most 64 characters!']"
            ></v-textarea>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <ui-button block color="primary" @click.native="update">
            <template slot="content"><v-icon class="mr-2">mdi-send</v-icon>Update</template>
          </ui-button>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-form v-model="passwdForm" ref="passwdForm">
      <v-card class="px-3 pb-3 ma-3">
        <v-card-title>Change Password</v-card-title>
        <v-divider class="py-0 my-0"></v-divider>
        <v-card-text>
          <ui-alert
            v-show="errAlert === 'passwd'"
            dense
            :type="errType"
            :alertMsg="errMsg"
          ></ui-alert>
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
          <ui-button block color="primary" @click.native="submit">
            <template slot="content"><v-icon class="mr-2">mdi-send</v-icon>Submit</template>
          </ui-button>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
const API_BASE_URL = '/api'

export default {

  name: 'Profile',

  data () {
    return {
      passwdForm: false,
      passwd: {
        newPassword: '',
        oldPassword: ''
      },
      info: {
        username: '',
        email: '',
        displayedName: '',
        bio: ''
      },
      avatar: this.setAvatar(''),
      errAlert: '',
      errType: 'error',
      errMsg: '',
      profileForm: false
    }
  },

  beforeMount () {
    this.getProfile()
  },

  methods: {
    getProfile () {
      if (this.$cookies.isKey('jwt')) {
        this.payload = this.parseJwt(this.$cookies.get('jwt'))
        if (this.payload.active === true) {
          this.info.username = this.payload.username
          this.info.email = this.payload.email
          this.info.displayedName = this.payload.profile.displayedName
          this.info.bio = this.payload.profile.bio
          this.avatar = this.setAvatar(this.payload.md5)
        }
      } else {
        this.$router.push('/')
      }
    },
    setAvatar (payload) {
      var d = encodeURI('https://noj.tw/defaultAvatar.png')
      return `https://www.gravatar.com/avatar/${payload}?d=${d}&s=100`
    },
    parseJwt (token) {
      return JSON.parse(atob(token.split('.')[1])).data
    },
    update () {
      if (this.$refs.profileForm.validate()) {
        this.$http.post(`${API_BASE_URL}/profile`, this.info)
          .then((res) => {
            this.errMsg = 'Information updated successfully!'
            this.errType = 'success'
            this.errAlert = 'profile'
          })
          .catch(() => {
            this.errMsg = 'Invalid profile!'
            this.errType = 'error'
            this.errAlert = 'profile'
          })
      }
    },
    submit () {
      if (this.$refs.passwdForm.validate()) {
        this.$http.post(`${API_BASE_URL}/auth/change-password`, this.passwd)
          .then((res) => {
            this.errMsg = 'Password changed successfully!'
            this.errType = 'success'
            this.errAlert = 'passwd'
          })
          .catch(() => {
            this.errMsg = 'Sorry, your password do not match.'
            this.errType = 'error'
            this.errAlert = 'passwd'
          })
      }
    }
  }
}
</script>
