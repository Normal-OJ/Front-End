<template>
  <v-dialog
    v-model="authDialog"
    :width="smDown ? '80vw' : '40vw'"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-show="$vuetify.breakpoint.mdAndUp || smDown"
        class="subtitle-1"
        :color="smDown ? 'primary' : 'white'"
        min-width="8vw"
        v-on="on"
        outlined
      ><v-icon class="pr-1">mdi-account</v-icon>SIGN IN | UP</v-btn>
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
          v-model="authTab"
          grow
          color="secondary"
        >
          <v-tab class="text-none subtitle-1" active>Sign in</v-tab>
          <v-tab class="text-none subtitle-1">Sign up</v-tab>
        </v-tabs>
        
        <v-tabs-items v-model="authTab">
          <v-tab-item>
            <v-container>
              <SignInForm/>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <SignUpForm/>
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
      authDialog: false,
      authTab: null,
    }
  },

  props: ['smDown'],
}
</script>

<style lang="css" scoped>
</style>