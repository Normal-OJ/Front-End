<template>
  <v-form
    v-model="validForm"
    ref="form"
  >
    
    <v-text-field
      v-model="authData.username"
      label="Username / Email"
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
      usernameRule: [val => !!val || 'Username is required!'],
      passwordRule: [val => !!val || 'Password is required!'],
      showPassword: false,
      btnLoading: false,
    }
  },

  methods: {
    submit() {
      this.btnLoading = true;
      if ( this.$refs.form.validate() ) {
        this.$http.post('API_BASE_URL/auth/session', this.authData)
          .then((response) => {
            console.log(response.data)
          })
          .catch((error) => {
            console.log(error.response.data)
          });
      }
      this.btnLoading = false;
    }
  }
}
</script>

<style lang="css" scoped>
</style>