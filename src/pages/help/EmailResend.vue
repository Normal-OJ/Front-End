<template>
  <v-container fuild>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-row justify="center" class="px-3 my-12">
          <h2>Hi, how can we help you?</h2>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="6"
            v-for="(item, idx) in items"
            :key="idx"
          >
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? '6' : '2'"
                height="auto"
                :width="$vuetify.breakpoint.mdAndUp ? '30vw' : '95vw'"
                class="mx-auto"
                style="cursor: pointer;"
                @click="open(idx)"
              >
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-text>
                    {{ item.text[0] }}<br>{{ item.text[1] }}
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
        <ui-dialog
          v-model="dialog"
          :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'"
        >
          <template slot="title">{{ diaTitle }}</template>
          <template slot="body">
            <v-card-text v-if="show">
              <ui-alert
                v-model="errAlert"
                dense
                type="error"
                :alertMsg="errMsg"
              ></ui-alert>
              <p class="subtitle-1 text--primary">{{ diaText }}</p>
              <v-row justify="center">
                <v-form 
                  v-model="form"
                  lazy-validation
                  ref="form"
                  @submit="submit"
                  onSubmit="return false"
                >
                  <v-text-field
                    label="Email address"
                    outlined
                    v-model="email"
                    :rules="rule"
                  ></v-text-field>
                </v-form>
              </v-row>
              <v-row>
                <v-spacer></v-spacer>
                <ui-button color="primary" @click.native="submit">
                  <template slot="content">Submit</template>
                </ui-button>
                <v-spacer></v-spacer>
              </v-row>
            </v-card-text>
            <v-slide-x-transition v-else>
              <v-container class="text-center" style="color: #2a2f35;">
                  <p class="headline font-weight-bold">Please Check Your Inbox</p>
                  <v-icon size="10rem">mdi-email-newsletter</v-icon>
              </v-container>
            </v-slide-x-transition>
          </template>
          <template slot="actions" v-if="show"><span></span></template>
          <template slot="action-cancel" v-else><span></span></template>
        </ui-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

  name: 'EmailResend',

  data () {
    return {
      show: true,
      form: true,
      dialog: false,
      diaTitle: '',
      diaText: '',
      diaIdx: null,
      email: null,
      text: ['verify that account by sending email.', 'send email to recovery your password.'],
      items: [
        { 'title': 'Verify Email Address', 'text': ['Did not receive verification email?','Click here to resend.'] },
        { 'title': 'Reset Password', 'text': ['Forget your password?','Click here to reset.'] },
      ],
      rule: [ 
        v => !!v || 'Please enter Email address!',
        v => /.+@.+/.test(v) || 'Not a valid Email address!',
      ],
      errAlert: false,
      errMsg: '',
    }
  },

  beforeMount() {
    if ( this.$cookies.isKey('jwt') ) {
      this.$router.push('/');
    }
  },

  methods: {
    open(idx) {
      this.diaTitle = this.items[idx].title;
      this.diaText = `Please enter email address which you registered with, we\'ll ${this.text[idx]}`;
      this.dialog = true;
      this.diaIdx = idx;
      this.email = '';
      this.errAlert = false;
    },
    submit() {
      if ( this.$refs.form.validate() ) {
        this.$http.post('/api/auth/check/email', {'email': this.email})
          .then((res) => {
            if ( res.data.data.valid === 1 ) {
              this.errMsg = 'Sorry, we couldn\'t find any account with this E-mail.';
              this.errAlert = true;
            } else {
              this.$http.post(`/api/auth/${this.diaIdx ? 'password-recovery' : 'resend-email'}`, {'email': this.email})
                .then(res => {
                  // Nothing to do
                  console.log(res.data);
                })
                .catch(err => {
                  // Something to do
                  console.log(err.response.data);
                })
              this.show = false;
            }
          })
          .catch((err) => {
            this.errMsg = 'Some issue occurred, please check out your network connection, refresh the page or contact with administrator.';
            this.errAlert = true;
          })
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>