<template>
  <v-form
    v-model="validForm"
    ref="form"
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
    >{{ errMsg }}</v-alert>

    <v-text-field
      v-model="authData.username"
      label="Username / E-mail"
      prepend-icon="mdi-account"
      :rules="usernameRule"
      autofocus
    ></v-text-field>

    <v-text-field
      v-model="authData.password"
      label="Password"
      prepend-icon="mdi-lock"
      :rules="passwordRule"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
    ></v-text-field>

    <v-icon color="white">mdi-lock</v-icon>
    <v-btn
      class="text-none subtitle-1 mt-1 ml-2"
      color="primary"
      :loading="btnLoading"
      @click="submit"
    >Sign in</v-btn>

  </v-form>
</template>

<script>
const API_BASE_URL = '/api';

export default {

  name: 'SignInForm',

  data () {
    return {
      validForm: false,
      authData: {
        'username': '',
        'password': ''
      },
      usernameRule: [val => !!val || 'Please enter your Username.'],
      passwordRule: [val => !!val || 'Please enter your Password.'],
      showPassword: false,
      btnLoading: false,
      errAlert: false,
      errMsg: '',
    }
  },

  methods: {
    submit() {
      this.btnLoading = true;
      if ( this.$refs.form.validate() ) {
        var type = (/.+@.+/.test(this.authData.username)) ? 'email' : 'username';
        this.$http.post(`${API_BASE_URL}/auth/check/${type}`, this.authData[type])
          .then((response) => {
            console.log(response.data);
            this.$http.post('API_BASE_URL/auth/session', this.authData)
              .then((response) => {
                // successful sign in
                this.$emit('signinSuccess');
                console.log(response.data);
              })
              .catch((error) => {
                // wrong password
                this.errMsg = 'Sorry, your password do not match.';
                this.errAlert = true;
                console.log(error.response.data);
              });
          })
          .catch((error) => {
            // this user is not exist
            type = (type==='email') ? 'E-mail' : 'Username';
            this.errMsg = 'Sorry, we couldn\'t find an account with that ' + type + '.';
            this.errAlert = true;
            console.log(error.response.data);
          });
      }
      this.btnLoading = false;
    }
  }
}
</script>

<style lang="css" scoped>
</style>