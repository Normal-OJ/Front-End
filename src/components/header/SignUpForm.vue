<template>
  <v-form
    v-model="validForm"
    v-if="signup"
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
      v-model="authData.email"
      label="E-mail*"
      prepend-icon="mdi-email"
      hint="We will send mail to this address."
      autofocus
      ref="email"
      :rules="mailRule"
      @keyup.enter="submit"
    ></v-text-field>

    <v-text-field
      v-model="authData.username"
      label="Username*"
      prepend-icon="mdi-account"
      hint="You can set Username at most 16 characters."
      counter="16"
      ref="username"
      :rules="usernameRule"
      @keyup.enter="submit"
    ></v-text-field>

    <v-text-field
      v-model="authData.password"
      label="Password*"
      prepend-icon="mdi-lock"
      :rules="passwordRule"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
      @keyup.enter="submit"
    ></v-text-field>

    <v-icon color="white">mdi-lock</v-icon>
    <v-btn
      ref="btn"
      class="text-none subtitle-1 mt-1 ml-2 mr-3"
      color="primary"
      :loading="btnLoading"
      @click="submit"
    >Sign up</v-btn>

    <v-btn
      class="text-none subtitle-1 mt-1"
      color="secondary"
      outlined
      @click="reset"
    >Reset</v-btn>

  </v-form>

  <v-slide-x-transition v-else>
    <v-container class="text-center" style="color: #2a2f35;">
        <p class="headline font-weight-bold">Please Check Your E-mail</p>
        <p class="subtitle-1">You will need to verify your email address.</p>
        <v-icon size="10em">mdi-email-newsletter</v-icon>
    </v-container>
  </v-slide-x-transition>
</template>

<script>
const API_BASE_URL = '/api';
var globKey = {'email': 0, 'username': 0}, typeKey = ['email', 'username'];

export default {

  name: 'SignUpForm',

  data () {
    return {
      validForm: false,
      authData: {
        'email': '',
        'username': '',
        'password': '',
      },
      used: {
        'email': false, 'username': false
      },
      mailRule: [
        val => !!val || 'Please enter your E-mail.',
        val => this.isMailFormat(val) || 'Please enter in format: \'example@example.com\'.',
        () => this.used['email'] || 'Sorry, this E-mail has been used.'
      ],
      usernameRule: [
        val => !!val || 'Please enter your Username.',
        val => this.isNameFormat(val) || 'Sorry, the length must be ≤ 16 characters',
        () => this.used['username'] || 'Sorry, this Username has been used.'
      ],
      passwordRule: [
        val => !!val || 'Please enter your Password.',
      ],
      showPassword: false,
      btnLoading: false,
      errAlert: false,
      errMsg: [],
      signup: true,
    }
  },

  computed: {
    email() {
      return this.authData.email;
    },
    username() {
      return this.authData.username;
    },
  },

  watch: {
    email() {
      this.keying('email');
    },
    username() {
      this.keying('username');
    }
  },

  beforeMount() {
    this.$refs.form.reset();
  },

  mounted () {
    this.$nextTick(() => {
      this.$refs.email.focus();
    });
  },

  methods: {
    isMailFormat(val) {
      return /.+@.+/.test(val);
    },
    isNameFormat(val) {
      return (val && val.length <= 16);
    },
    submit() {
      this.btnLoading = true;
      if ( this.$refs.form.validate() ) {
        this.$http.post(`${API_BASE_URL}/auth/signup`, this.authData)
          .then((response) => {
            this.signup = false;
            // console.log(response.data);
          })
          .catch((error) => {
            this.errMsg = [error.response.data.data.email, error.response.data.data.username, error.response.data.data.password];
            this.errAlert = true;
          });
      }
      this.btnLoading = false;
    },
    reset() {
      this.authData = Object.fromEntries(new Map(Object.keys(this.authData).map(item => [item, ''])));
    },
    check(type, cnt) {
      if ( cnt == globKey[type] && ((type=='email' && this.isMailFormat(this.authData[type])) || (type=='username' && this.isNameFormat(this.authData[type]))) ) {
        this.$http.post(`${API_BASE_URL}/auth/check/${type}`, {[type]: this.authData[type]})
          .then((response) => {
            if ( response.data.data.valid === 0 ) {
              this.used[type] = false;
              this.$refs[type].validate();
            } else if ( response.data.data.valid === 1 ) {
              this.used[type] = true;
            }
          })
          .catch((error) => {
            this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'];
            this.errAlert = true;
          })
      }
    },
    keying(type) {
      this.used[type] = true;
      globKey[type]++;
      setTimeout(this.check, 800, type, globKey[type]);
    },
  }
}
</script>

<style lang="css" scoped>
</style>