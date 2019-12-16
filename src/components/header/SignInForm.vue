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
    ><v-row v-for="(msg, idx) in errMsg" :key="idx">{{ msg }}</v-row></v-alert>

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
      class="text-none subtitle-1 mt-1 mx-2"
      color="primary"
      :loading="btnLoading"
      @click="submit"
    >Sign in</v-btn>

    <v-btn
      class="text-none caption mx-2"
      color="primary"
      text
      x-small
    >haven't verify your mail?</v-btn>

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
      errMsg: [],
    }
  },

  methods: {
    submit() {
      this.btnLoading = true;
      if ( this.$refs.form.validate() ) {
        var type = (/.+@.+/.test(this.authData.username)) ? 'email' : 'username';
        console.log('type: ' + type);
        this.$http.post(`${API_BASE_URL}/auth/check/${type}`, {[type]: this.authData.username})
          .then((response) => {
            // console.log(response.data);
            if ( response.data.data.valid === 1 ) {
              // this user is not exist
              console.log('user is not exist');
              type = (type==='email') ? 'E-mail' : 'Username';
              this.errMsg = ['Sorry, we couldn\'t find an account with that ' + type + '.'];
              this.errAlert = true;

            } else if ( response.data.data.valid === 0 ) {

              console.log('user exist');
              this.$http.post(`${API_BASE_URL}/auth/session`, this.authData)
                .then((response) => {
                  // successful sign in
                  // console.log(response);
                  this.$emit('signinSuccess');
                })
                .catch((error) => {
                  // wrong password or not active
                  // console.log(error);
                  this.errMsg = ['Sorry, your password do not match.', 'Or, you haven\'t verify your email yet. (you can verify email by link at bottom.)'];
                  this.errAlert = true;
                });

            }
          })
          .catch((error) => {
            this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'];
            this.errAlert = true;
            // console.log(error);
          });

      }
      this.btnLoading = false;
    }
  }
}
</script>

<style lang="css" scoped>
</style>