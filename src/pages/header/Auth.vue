<template>
  <ui-dialog
    v-model="authDialog"
    :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"
  >
    <template slot="activator">
      <ui-button
        v-for="sign in $vuetify.breakpoint.smAndDown ? signs : signs.slice().reverse()"
        :key="sign.title"
        v-show="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.smAndDown"
        :color="$vuetify.breakpoint.smAndDown ? 'primary' : 'white'"
        :outlined="sign.outline"
        :text="sign.text"
        @click.native="authDialog = !authDialog; tabEntry = sign.entry;"
      ><template slot="content">{{ sign.title }}</template></ui-button>
    </template>

    <template slot="title">Welcome to Normal OJ</template>

    <template slot="body">
      <v-tabs
        class="mt-3"
        v-model="tabEntry"
        grow
        color="secondary"
      >
        <v-tab class="text-none subtitle-1">Sign in</v-tab>
        <v-tab class="text-none subtitle-1">Sign up</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabEntry">
        <v-tab-item>
          <v-container>
            <SignInForm v-on:signinSuccess="signinSuccessHideDialog"></SignInForm>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <SignUpForm v-on:signupSuccess="signupSuccessHideDialog"></SignUpForm>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </template>
    <template slot="actions"><br></template>
  </ui-dialog>
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
    }
  },

  methods: {
    signinSuccessHideDialog() {
      this.authDialog = false;
      this.$emit('signinSuccessToHeader');
    },
    signupSuccessHideDialog() {
      this.authDialog = false;
    }
  }
}
</script>

<style lang="css" scoped>
</style>