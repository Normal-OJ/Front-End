<template>
  <v-form
    v-model="validForm"
    ref="form"
  >
    
    <v-text-field
      v-model="authData.email"
      label="E-mail*"
      prepend-icon="mdi-email"
      hint="We will send mail to this address."
      autofocus
      ref="mail"
      :rules="mailRule"
      @keypress="keying('mail')"
    ></v-text-field>

    <v-text-field
      v-model="authData.username"
      label="Username*"
      prepend-icon="mdi-account"
      hint="Username must be ≤ 16 characters"
      counter="16"
      ref="name"
      :rules="usernameRule"
      @keypress="keying('name')"
    ></v-text-field>

    <v-text-field
      v-model="authData.password"
      label="Password*"
      prepend-icon="mdi-lock"
      :rules="passwordRule"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
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
</template>

<script>
const API_BASE_URL = '/api'
var globKey = {'mail': 0, 'name': 0}, typeKey = ['email', 'username'];

export default {

  name: 'SignUpForm',

  data () {
    return {
      validForm: false,
      authData: {
        'username': '',
        'password': '',
        'email': ''
      },
      used: {
        'mail': false, 'name': false
      },
      mailRule: [
        val => !!val || 'E-maill is required!',
        val => /.+@.+/.test(val) || 'E-mail must be valid',
        () => this.used['mail'] || 'Sorry, this E-mail has been used!'
      ],
      usernameRule: [
        val => !!val || 'Username is required!',
        val => (val && val.length <= 16) || 'Username must be ≤ 16 characters',
        () => this.used['name'] || 'Sorry, this Username has been used!'
      ],
      passwordRule: [
        val => !!val || 'Password is required!',
      ],
      showPassword: false,
      btnLoading: false,
    }
  },

  methods: {
    submit() {
      this.btnLoading = true;
      if ( this.$refs.form.validate() ) {
        this.$http.post('API_BASE_URL/auth/signup', this.authData)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      }
      this.btnLoading = false;
    },
    reset() {
      this.authData = new Map(Object.keys(this.authData).map(item => [item, '']))
    },
    check(type, cnt) {
      if ( cnt == globKey[type] ) {
        this.$http.post(`${API_BASE_URL}/auth/check/${type}`, {[type]: this.authData[type]})
          .then(() => {
            this.used[type] = true;
          })
          .catch(() => {
            this.used[type] = false;
            this.$refs[type].validate();
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