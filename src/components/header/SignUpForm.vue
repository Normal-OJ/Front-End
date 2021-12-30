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
      v-model="authData.email"
      label="E-mail*"
      prepend-icon="mdi-email"
      hint="We will send mail to this address."
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

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="auto">
        <ui-button
          color="primary"
          :loading="btnLoading"
          @click.native="submit"
        ><template slot="content">Sign up</template></ui-button>
      </v-col>
    </v-row>

    <ui-dialog
      v-model="dialog"
      :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"
    >
      <template slot="title">Email Verification</template>
      <template slot="body">
        <v-container class="text-center text--primary">
          <h2>Verify your email address</h2>
          <p>Please check your inbox for a verification email, and click the link in the email to <strong>active your account</strong>.</p>
          <v-icon size="10rem">mdi-email-newsletter</v-icon>
          <p>Didn't receive the email? <a href="/email_resend"><u>Send it again.</u></a></p>
        </v-container>
      </template>
      <template slot="action-cancel"><span></span></template>
    </ui-dialog>
  </v-form>

</template>

<script>
const globKey = { email: 0, username: 0 }

export default {

  name: 'SignUpForm',

  data () {
    return {
      validForm: false,
      authData: {
        email: '',
        username: '',
        password: ''
      },
      used: {
        email: false, username: false
      },
      mailRule: [
        val => !!val || 'Please enter your E-mail.',
        val => /.+@.+/.test(val) || 'Please enter in format: \'example@example.com\'.',
        () => this.used.email || 'Sorry, this E-mail has been used.'
      ],
      usernameRule: [
        val => !!val || 'Please enter your Username.',
        val => (val && val.length <= 16) || 'Sorry, the length must be ≤ 16 characters',
        () => this.used.username || 'Sorry, this Username has been used.'
      ],
      passwordRule: [
        val => !!val || 'Please enter your Password.'
      ],
      showPassword: false,
      btnLoading: false,
      errAlert: false,
      errMsg: '',
      signup: true,
      dialog: false
    }
  },

  computed: {
    email () {
      return this.authData.email
    },
    username () {
      return this.authData.username
    }
  },

  watch: {
    email () {
      this.keying('email')
    },
    username () {
      this.keying('username')
    }
  },

  methods: {
    submit () {
      this.btnLoading = true
      if (this.$refs.form.validate()) {
        this.$agent.Auth.signup(this.authData)
          .then(() => {
            this.signup = false
            this.dialog = true
            this.$emit('signup')
          })
          .catch((error) => {
            // FIXME: set a good error message
            this.errMsg = JSON.stringify(error.data)
            this.errAlert = true
            throw error
          })
      }
      this.btnLoading = false
    },
    check (type, cnt) {
      const checker = {
        email: val => /.+@.+/.test(val),
        username: val => (val && val.length <= 16)
      }
      if (cnt === globKey[type] && checker[type] && checker[type](this.authData[type])) {
        this.$agent.Auth.check(type, { [type]: this.authData[type] })
          .then((response) => {
            if (response.data.data.valid === 0) {
              this.used[type] = false
              this.$refs[type].validate()
            } else if (response.data.data.valid === 1) {
              this.used[type] = true
            }
          })
          .catch((error) => {
            this.errMsg = 'Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'
            this.errAlert = true
            throw error
          })
      }
    },
    keying (type) {
      // FIXME: use lodash.debounce()
      this.used[type] = true
      globKey[type]++
      setTimeout(this.check, 800, type, globKey[type])
    }
  }
}
</script>
