<template>
  <v-container 
    fuild 
    style="width: 80vw"
  >

    <p class="display-3 mt-3">Hello, {{ username }}</p>
    <p class="display-1 mt-3">Please fill out the form to complete your registeration.</p>

    <v-card>
      <v-card-title class="display-1">Profile</v-card-title>
      <div class="text-center"><v-avatar
        size="100"
        color="grey"
      >
        <v-img 
          v-if="image" 
          :src="image"
        ></v-img>
        <v-img 
          v-else
          :src="require('@/assets/defaultAvatar.png')"
        ></v-img>
      </v-avatar></div>

      <v-card-text>
        <v-form
          ref="form"
        >
          <!-- <v-file-input 
            v-model="profile.avatar"
            @change="uploadImage($event)"
            show-size
            :rules="avatarRules"
            accept="image/png, image/jpeg, image/bmp"
            label="Avatar (Optional) (Limit: 1MB)"
            prepend-icon="mdi-camera"
          ></v-file-input> -->

          <v-alert
            v-model="errAlert"
            dismissible
            colored-border
            border="left"
            dense
            elevation="2"
            type="error"
            transition="scroll-y-transition"
          >{{ errMsg }}</v-alert>

          <v-text-field
            v-model="profile.displayedName"
            label="Display Name (Optional)"
            hint="If display name is empty, username will be displayed on pages."
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

          <v-btn
            block
            class="mt-3"
            color="primary"
            @click="submit"
          >submit</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
const API_BASE_URL = '/api';

export default {

  name: 'EmailVerify',

  data () {
    return {
      payload: '',
      username: '',
      profile: {
        // 'avatar': null,
        'displayedName': '',
        'bio': '',
      },
      image: null,
      agree: false,
      errAlert: false,
      errMsg: '',
      // file: null,
      // avatarRules: [
      //   val => !val || val.size < 1048576 || 'Sorry, the limit of avatar size is 1MB.'
      // ],
    }
  },

  beforeMount () {
    this.payload = this.parseJwt(this.$route.params.token);
    this.username = this.payload.username;
    this.profile.displayedName = this.username;
    // console.log('creating');
    // this.getAvatar();
  },

  methods: {
    parseJwt(token) {
      console.log(atob(token.split('.')[1]));
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    submit() {
      if ( this.$refs.form.validate() ) {
        this.$http.post(`${API_BASE_URL}/auth/active`, {'agreement': this.agree, 'profile': this.profile})
          .then((response) => {
            this.$router.push('/');
            console.log(response.data);
          })
          .catch((error) => {
            this.errMsg = 'Some issue occurred, please check out your network connection, refresh the page or contact with administrator.'
            this.errAlert = true;
            console.log(error.response.data);
          });
      }
    },
    // getAvatar() {
    //   this.$http.get(`https://www.gravatar.com/${md5(toLowerCase(this.payload.email))}.json`)
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    uploadImage(event) {
      console.log(event)
      this.image = URL.createObjectURL(event)
    },
  },
}
</script>

<style lang="css" scoped>
</style>