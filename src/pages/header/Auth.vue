<template>
  <v-dialog
    v-model="authDialog"
    :width="smDown ? '95vw' : '50vw'"
  >
    <template v-slot:activator="{ on: { click } }">
      <ui-button
        v-for="sign in smDown ? signs : signs.slice().reverse()"
        :key="sign.title"
        v-show="$vuetify.breakpoint.mdAndUp || smDown"
        :color="smDown ? 'primary' : 'white'"
        :outlined="sign.outline"
        :text="sign.text"
        @click.native="click(); tabEntry = sign.entry;"
      ><template slot="content">{{ sign.title }}</template></ui-button>
    </template>
    <v-card>
      <v-card-title
        class="headline primary white--text"
      >
        Welcome
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="authDialog = false"
        ><v-icon class="white--text">mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text>
        <v-tabs
          v-model="tabEntry"
          grow
          color="secondary"
        >
          <v-tab 
            v-for="tab in tabs"
            :key="tab.id"
            class="text-none subtitle-1"
          >{{ tab.title }}</v-tab>
        </v-tabs>
        
        <v-tabs-items v-model="tabEntry">
          <v-tab-item>
            <v-container>
              <SignInForm v-on:signinSuccess="signinSuccessHideDialog"></SignInForm>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <SignUpForm></SignUpForm>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'

export default {

  name: 'Auth',

  components: {
    SignInForm,
    SignUpForm,
  },

  data () {
    return {
      signs: [
        {'title': 'Sign in', 'outline': false, 'text': true, 'entry': 0},
        {'title': 'Sign up', 'outline': true, 'text': false, 'entry': 1},
      ],
      authDialog: false,
      tabEntry: 0,
      tabs: [
        {'id': 0, 'title': 'Sign in'},
        {'id': 1, 'title': 'Sign up'},
      ]
    }
  },

  props: ['smDown'],

  methods: {
    signinSuccessHideDialog() {
      this.authDialog = false;
      this.$emit('signinSuccessToHeader');
    }
  }
}
</script>

<style lang="css" scoped>
</style>