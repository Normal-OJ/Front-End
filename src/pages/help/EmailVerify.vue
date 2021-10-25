<template>
  <v-container
    :style="{width: $vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'}"
    class="pt-0"
  >
    <h2>Hello, {{ username }}</h2>
    <h3>Please fill out the form to complete your registeration.</h3>
    <v-card
      class="my-3 mx-auto flex-column d-flex"
      :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'"
    >
      <v-card-subtitle>
        Profile avatar is powered by<a target="_blank" rel="noopener noreferrer" href="https://zh-tw.gravatar.com/" style="white-space: pre;"> Gravatar</a>
      </v-card-subtitle>
      <v-card-title>
        <v-row justify="center">
          <v-avatar size="100"><v-img :src="avatar"></v-img></v-avatar>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">

          <ui-alert
            v-model="errAlert"
            dense
            type="error"
            :alertMsg="errMsg"
          ></ui-alert>

          <v-text-field
            v-model="profile.displayedName"
            label="Display Name (Optional)"
            hint="If display name is empty, username will be displayed on pages."
            :rules="[v => v.length <= 16 || 'Display name\'s length must <= 16!']"
            prepend-icon="mdi-account-badge-horizontal-outline"
          ></v-text-field>

          <v-textarea
            v-model="profile.bio"
            label="Bio (Optional)"
            hide-details
            outlined
          ></v-textarea>

          <v-checkbox
            v-model="agree"
            color="primary"
            label="Agree our Terms of Service."
            :rules="[val => val || 'Sorry, you can\'t create account without agreement']"
          >
          </v-checkbox>

          <ui-button
            block
            color="primary"
            @click.native="submit"
          ><template slot="content">Submit</template></ui-button>
        </v-form>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
const API_BASE_URL = '/api'

export default {

  name: 'EmailVerify',

  data () {
    return {
      payload: null,
      username: '',
      profile: {
        displayedName: '',
        bio: ''
      },
      avatar: this.getAvatar(''),
      agree: false,
      errAlert: false,
      errMsg: ''
    }
  },

  beforeMount () {
    this.payload = this.getPayload()
    this.username = this.payload.username
    this.profile.displayedName = this.username
    this.avatar = this.getAvatar(this.payload.md5)
  },

  methods: {
    getPayload () {
      if (this.$cookies.isKey('jwt')) {
        var payload = this.parseJwt(this.$cookies.get('jwt'))
        if (payload.active === false) {
          return this.parseJwt(this.$cookies.get('jwt'))
        }
      }
    },
    parseJwt (token) {
      return JSON.parse(atob(token.split('.')[1])).data
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.$http.post(`${API_BASE_URL}/auth/active`, { agreement: this.agree, profile: this.profile })
          .then((response) => {
            this.$router.push('/')
          })
          .catch((error) => {
            this.errMsg = 'Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'
            this.errAlert = true
            console.log(error.response.data)
          })
      }
    },
    getAvatar (payload) {
      var d = encodeURI('https://noj.tw/defaultAvatar.png')
      return `https://www.gravatar.com/avatar/${payload}?d=${d}`
    }
  }
}
</script>
