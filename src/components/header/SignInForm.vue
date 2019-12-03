<template>
	<v-form
    v-model="validForm"
    ref="form"
  >
    
    <v-text-field
      v-model="authData.username"
      label="Username / Email"
      :rules="nameRule"
      prepend-icon="mdi-account"
      required
      autofocus
    ></v-text-field>

    <v-text-field
      v-model="authData.password"
      label="Password"
      prepend-icon="mdi-lock"
      required
      autofocus
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show ? 'text' : 'password'"
      @click:append="show = !show"
    ></v-text-field>

    <v-btn
      ref="btn"
      class="text-none subtitle-1 mt-3"
      color="primary"
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
      nameRule: [
        v => !!v || 'Username is required'
      ],
      show: false,
    }
  },

  methods: {
    submit() {
      if ( this.$refs.form.validate() ) {
        this.$http.post('API_BASE_URL/auth/session', this.authData)
          .then((response) => {
            console.log(response.data)
          })
          .catch((error) => {
            console.log(error.response.data)
          });
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>