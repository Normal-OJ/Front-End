<template>
  <v-container
    :style="{width: $vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'}"
    class="pt-0"
  >
    <h2>Hello, {{ username }}</h2>
    <h3>Please fill out the form to complete your registeration.</h3>
    <v-card
      class="my-3 mx-auto flex-column d-flex"
      :width="$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw'"
    >
      <v-card-subtitle>
        Profile avatar is powered by<a target="_blank" rel="noopener noreferrer" href="https://zh-tw.gravatar.com/" style="white-space: pre;"> Gravatar</a>
      </v-card-subtitle>
      <v-card-title>
        <v-row justify="center">
          <v-avatar size="100"><v-img :src="avatar"></v-img></v-avatar>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">

          <ui-alert
            v-model="errAlert"
            dense
            type="error"
            :alertMsg="errMsg"
          ></ui-alert>

          <v-text-field
            v-model="profile.displayedName"
            label="Display Name (Optional)"
            hint="If display name is empty, username will be displayed on pages."
            :rules="[v => v.length <= 16 || 'Display name\'s length must <= 16!']"
            prepend-icon="mdi-account-badge-horizontal-outline"
          ></v-text-field>

          <v-textarea
            v-model="profile.bio"
            label="Bio (Optional)"
            hide-details
            outlined
          ></v-textarea>

          <v-checkbox
            v-model="agree"
            color="primary"
            label="Agree our Terms of Service."
            :rules="[val => val || 'Sorry, you can\'t create account without agreement']"
          >
          </v-checkbox>

          <ui-button
            block
            color="primary"
            @click.native="submit"
          ><template slot="content">Submit</template></ui-button>
        </v-form>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {

  name: 'EmailVerify',

  data () {
    return {
      payload: null,
      profile: {
        displayedName: '',
        bio: ''
      },
      agree: false,
      errAlert: false,
      errMsg: ''
    }
  },

  mounted () {
    this.profile = {
      displayedName: this.displayedName,
      bio: this.bio
    }
  },

  computed: {
    ...mapState({
      username: state => state.username,
      displayedName: state => state.displayedName,
      bio: state => state.bio,
      avatar: state => state.avatar
    })
  },

  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.$agent.Auth.activate({ agreement: this.agree, profile: this.profile })
          .then(() => {
            this.$router.push('/')
          })
          .catch((error) => {
            this.errMsg = 'Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'
            this.errAlert = true
            throw error
          })
      }
    }
  }
}
</script>
