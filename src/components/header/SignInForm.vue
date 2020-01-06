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

    <v-icon color="white">mdi-lock</v-icon>
    <v-btn
      class="text-none subtitle-1 mt-1 mx-2"
      color="primary"
      :loading="btnLoading"
      @click="submit"
    >Sign in</v-btn>

    <v-btn
      class="text-none subtitle-1 mx-2"
      color="primary"
      text
      x-small
      @click="emailResend"
    ><u>Haven't Verify Email?</u></v-btn>
    <v-btn
      class="text-none subtitle-1 mx-2"
      color="primary"
      text
      x-small
      @click="emailResend"
    ><u>Forget Password?</u></v-btn>

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

  beforeMount() {
    this.authData.username = '';
    this.authData.password = '';
  },

  mounted () {
    this.$nextTick(() => {
      this.$refs.username.focus();
    });
  },

  methods: {
    signin() {
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
    },
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
              type = (type==='email') ? 'username' : 'email';

              this.$http.post(`${API_BASE_URL}/auth/check/${type}`, {[type]: this.authData.username})
                .then((response) => {
                  // console.log(response.data);
                  if ( response.data.data.valid === 1 ) {
                    this.errMsg = ['Sorry, we couldn\'t find an account with that E-mail/Username.'];
                    this.errAlert = true;
                  } else if ( response.data.data.valid === 0 ) {
                    this.signin();
                  }
                })
                .catch((error) => {
                  this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'];
                  this.errAlert = true;
                  // console.log(error);      
                })

            } else if ( response.data.data.valid === 0 ) {
              // this uesr is exist
              this.signin();
            }
          })
          .catch((error) => {
            this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'];
            this.errAlert = true;
            // console.log(error);
          });

      }
      this.btnLoading = false;
    },
    emailResend() {
      let routeData = this.$router.resolve({name: 'EmailResend'});
      window.open(routeData.href, '_blank');
    }
  }
}
</script>

<style lang="css" scoped>
</style>