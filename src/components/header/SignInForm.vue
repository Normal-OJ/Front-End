<template>
  <v-form
    v-model="validForm"
    ref="form"
  >
    <ui-alert
      v-model="errAlert"
      dense
      type="error"
      :alertMsg="errMsg"
    ></ui-alert>

    <v-text-field
      v-model="authData.username"
      label="Username / E-mail"
      ref="username"
      prepend-icon="mdi-account"
      :rules="usernameRule"
      @keyup.enter="submit"
    ></v-text-field>

    <v-text-field
      v-model="authData.password"
      label="Password"
      prepend-icon="mdi-lock"
      :rules="passwordRule"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
      @keyup.enter="submit"
    ></v-text-field>

    <v-row>
      <v-col cols="12" sm="auto" md="auto">
        <ui-button
          color="secondary"
          outlined
          @click.native="emailResend"
        ><template slot="content">Reset Password</template></ui-button>
      </v-col>
      <v-col cols="12" sm="auto" md="auto">
        <ui-button
          color="secondary"
          outlined
          @click.native="emailResend"
        ><template slot="content">Verify Email Address</template></ui-button>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="auto" md="auto">
        <ui-button
          color="primary"
          :loading="btnLoading"
          @click.native="submit"
        ><template slot="content">Sign in</template></ui-button>
      </v-col>
    </v-row>

  </v-form>
</template>

<script>
const API_BASE_URL = '/api'

export default {

  name: 'SignInForm',

  data () {
    return {
      validForm: false,
      authData: {
        username: '',
        password: ''
      },
      usernameRule: [val => !!val || 'Please enter your Username.'],
      passwordRule: [val => !!val || 'Please enter your Password.'],
      showPassword: false,
      btnLoading: false,
      errAlert: false,
      errMsg: ''
    }
  },

  beforeMount () {
    this.authData.username = ''
    this.authData.password = ''
  },

  methods: {
    signin () {
      this.$http.post(`${API_BASE_URL}/auth/session`, this.authData)
        .then((response) => {
          // successful sign in
          this.$emit('signin')
        })
        .catch(() => {
          // wrong password or not active
          this.errMsg = 'Sorry, your password do not match.\nOr, you haven\'t verify your email yet. (you can verify email by link at bottom.)'
          this.errAlert = true
        })
    },
    submit () {
      this.btnLoading = true
      if (this.$refs.form.validate()) {
        var type = (/.+@.+/.test(this.authData.username)) ? 'email' : 'username'
        this.$http.post(`${API_BASE_URL}/auth/check/${type}`, { [type]: this.authData.username })
          .then((response) => {
            if (response.data.data.valid === 1) {
              // this user is not exist
              type = (type === 'email') ? 'username' : 'email'

              this.$http.post(`${API_BASE_URL}/auth/check/${type}`, { [type]: this.authData.username })
                .then((response) => {
                  if (response.data.data.valid === 1) {
                    this.errMsg = 'Sorry, we couldn\'t find an account with that E-mail/Username.'
                    this.errAlert = true
                  } else if (response.data.data.valid === 0) {
                    this.signin()
                  }
                })
                .catch(() => {
                  this.errMsg = 'Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'
                  this.errAlert = true
                })
            } else if (response.data.data.valid === 0) {
              // this uesr is exist
              this.signin()
            }
          })
          .catch(() => {
            this.errMsg = 'Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'
            this.errAlert = true
          })
      }
      this.btnLoading = false
    },
    emailResend () {
      const routeData = this.$router.resolve({ name: 'EmailResend' })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>
