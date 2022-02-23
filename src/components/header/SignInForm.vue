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

  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.btnLoading = true
        this.$agent.Auth.signin(this.authData)
          .then(() => {
            this.$emit('signin')
          })
          .catch((error) => {
            this.errMsg = 'Sorry, your login information was incorrect\nOr, you haven\'t verify your email yet. (you can verify email by link at bottom.)'
            this.errAlert = true
            throw error
          })
          .finally(() => {
            this.btnLoading = false
          })
      }
    },
    emailResend () {
      const routeData = this.$router.resolve({ name: 'EmailResend' })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>
