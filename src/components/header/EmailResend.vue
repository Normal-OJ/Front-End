<template>
  <v-container fuild>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-row justify="center" class="px-3">
          <h2>Hi, how can we help you?</h2>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="6"
            v-for="(item, idx) in items"
            :key="idx"
          >
            <v-hover v-slot:default="{ hover }">
              <v-card :elevation="hover ? 12 : 2" class="ma-auto" height="200" width="400" @click="open(idx)" style="cursor: pointer;" ripple>
                <v-card-subtitle class="display-1" style="text-align: center; color: black;">{{ item.title }}</v-card-subtitle>
                <!-- <v-row justify="center" align="center"><h3>{{ item.title }}</h3></v-row> -->
                <v-card-subtitle class="title" style="text-align: center;">{{ item.text[0] }}<br>{{ item.text[1] }}</v-card-subtitle>
                <!-- <v-row justify="center" align="center"><h6>{{ item.text[0] }}<br>{{ item.text[1] }}</h6></v-row> -->
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent :height="$vuetify.breakpoint.mdAndUp ? '50vh' : '75vh'" :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'">
          <v-card height="100%" width="100%">
            <v-card-title class="headline primary white--text">
              {{ diaTitle }}
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog = false"><v-icon class="white--text">mdi-close</v-icon></v-btn>
            </v-card-title>
            <div v-if="show">
              <v-card-text>
                <v-alert
                  v-model="errAlert"
                  class="mt-6"
                  dismissible
                  colored-border
                  border="left"
                  elevation="2"
                  type="error"
                  transition="scroll-y-transition"
                ><v-row v-for="(msg, idx) in errMsg" :key="idx">{{ msg }}</v-row></v-alert>
                <p>{{ diaText }}</p>
                <v-row class="my-3" justify="center">
                  <v-form v-model="form" ref="form">
                    <v-text-field
                      class="title"
                      label="Email address"
                      outlined
                      v-model="email"
                      :rules="rule"
                      @keyup.enter="submit"
                    ></v-text-field>
                  </v-form>
                </v-row>
                <v-row class="my-3" justify="center">
                  <v-btn
                    class="title text-none"
                    color="primary"
                    dark
                    @click="submit"
                  >Submit</v-btn>
                </v-row>
              </v-card-text>
            </div>
            <v-slide-x-transition v-else>
              <v-container class="text-center" style="color: #2a2f35;">
                  <p class="headline font-weight-bold">Please Check Your E-mail</p>
                  <v-icon size="10em">mdi-email-newsletter</v-icon>
              </v-container>
            </v-slide-x-transition>
          </v-card>
        </v-dialog>
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
        { 'title': 'Active Account', 'text': ['Did not receive verification email?','Click here to resend.'] },
        { 'title': 'Forget Password', 'text': ['Forget your password?','Click here to reset.'] },
      ],
      rule: [ 
        v => !!v || 'Please enter Email address!',
        v => /.+@.+/.test(v) || 'Not a valid Email address!',
      ],
      errAlert: false,
      errMsg: null,
    }
  },

  methods: {
    open(idx) {
      this.diaTitle = this.items[idx].title;
      this.diaText = `Please enter Email address which you registered with, we\'ll ${this.text[idx]}`;
      this.dialog = true;
      this.diaIdx = idx;
    },
    submit() {
      if ( this.$refs.form.validate() ) {
        this.$http.post('/api/auth/check/email', {'email': this.email})
          .then((res) => {
            if ( res.data.data.valid === 1 ) {
              this.errMsg = ['Sorry, we couldn\'t find any account with this E-mail.'];
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
            this.errMsg = ['Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'];
            this.errAlert = true;
          })
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>