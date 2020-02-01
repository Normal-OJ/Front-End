<template>
  <div class="ma-0 pa-0">
    <v-app-bar
      app
      color="#003865"
      dark
      dense
    >
      
      <!-- Small Down Menu -->
      <v-app-bar-nav-icon
        app
        class="hidden-md-and-up"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <!-- LOGO -->
      <v-img
        :src="require('@/assets/NOJ-LOGO.png')"
        :aspect-ratio="593/100"
        height="85%"
        :max-width="$vuetify.breakpoint.mdAndUp ? '20%' : '80%'"
        :position="$vuetify.breakpoint.mdAndUp ? 'center center' : 'left center'"
        contain
      ></v-img>

      <!-- Nav Bar -->
      <v-toolbar-items>
        <ui-button
          v-for="link in links"
          v-if="link.show && $vuetify.breakpoint.mdAndUp"
          :key="link.title"
          :to="link.path"
          color="white"
          text
        ><template slot="content">{{ link.title }}</template></ui-button>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <!-- Sign in, up, User -->
      <v-menu v-if="isLogin && $vuetify.breakpoint.mdAndUp" offset-y>
        <template v-slot:activator="{ on: { click } }">
          <ui-button
            text
            color="white"
            @click.native="click"
          ><template slot="content">{{ displayedName+'('+username+')' }}</template></ui-button>
        </template>
        <v-list>
          <v-list-item link :to="{path: '/profile'}">
            <v-list-item-title v-text="'Profile'"></v-list-item-title>
          </v-list-item>
          <v-list-item link @click="signout">
            <v-list-item-title v-text="'Sign Out'"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <Auth v-else :smDown="false" v-on:signinSuccessToHeader="showAlert(0)"></Auth>

    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer"
      app
      disable-resize-watcher
    >
      <v-list-item>
        <v-list-item-avatar v-if="isLogin">
          <v-img
            :src="avatar"
            :aspect-ratio="1"
            height="100%"
            contain
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-title v-if="isLogin">
          {{ displayedName }}
          <br>
          {{ '('+username+')'}}
        </v-list-item-title>
        <v-list-item-title v-else>
          <Auth :smDown="true" v-on:signinSuccessToHeader="showAlert(0)"></Auth>
        </v-list-item-title>
        <ui-button
          icon
          @click.native="drawer = !drawer"
        ><template slot="content"><v-icon>mdi-chevron-left</v-icon></template></ui-button>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="link in links"
          v-if="link.show"
          :key="link.title"
          :to="link.path"
          link
        ><v-list-item-title v-text="link.title"></v-list-item-title></v-list-item>
        <v-divider></v-divider>
        <v-list-item v-if="isLogin" link :to="{path: '/profile'}">
          <v-list-item-title v-text="'Profile'"></v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isLogin" link @click="signout">
          <v-list-item-title v-text="'Sign Out'"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-snackbar
      v-model="alertBar"
      color="success"
      vertical
      bottom
      right
      :timeout="4000"
    >
      <h3>{{ alertText }}</h3>
      <v-btn
        text
        @click="alertBar = false"
      >Close</v-btn>
      <pre></pre>
      <v-progress-linear
        v-model="progress"
        :active="showProgress"
      ></v-progress-linear>
    </v-snackbar>
  </div>
</template>

<script>
import Auth from './Auth';

const API_BASE_URL = '/api';
const MSG = ['Welcome! Signed in successfully!', 'Bye! Signed out successfully'];

export default {

  name: 'Header',

  components: {
    'Auth': Auth,
  },

  data () {
    return {
      links: [
        {'title': 'Home', 'path': '/', 'show': true},
        {'title': 'Problems', 'path': '/problems', 'show': true},
        {'title': 'Submissions', 'path': '/submissions', 'show': false},
        {'title': 'Courses', 'path': '/courses', 'show': false},
        {'title': 'Inbox', 'path': '/inbox', 'show': false},
      ],
      drawer: false,
      isLogin: false,
      alertBar: false,
      alertText: '',
      progress: 0,
      showProgress: true,
      payload: null,
      avatar: this.setAvatar(''),
      username: '',
      displayedName: '',
    }
  },

  beforeMount () {
    this.setProfile();
  },

  methods: {
    async showAlert() {
      this.drawer = false;
      this.$router.go(0);
      // this.$forceUpdate();
      // this.setProfile();
      // this.alertBar = true;
      // this.alertText = MSG[type];
      // this.progress = 100;
      // for ( let i=0; i<40; ++i ) {
      //   this.progress -= 2.5;
      //   await this.delay(100);
      // }
    },
    // delay(delayInms) {
    //   return new Promise(resolve  => {
    //     setTimeout(() => {
    //       resolve(2);
    //     }, delayInms);
    //   });
    // },
    setProfile() {
      if ( this.$cookies.isKey('jwt') ) {
        this.payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( this.payload.active === true ) {
          this.isLogin = true;
          this.links.forEach((obj) => {
            obj.show = true;
          })
          this.username = this.payload.username;
          this.displayedName = this.payload.profile.displayedName;
          this.avatar = this.setAvatar(this.payload.md5);
        }
      }
    },
    setAvatar(payload) {
      var d = encodeURI("noj.tw/defaultAvatar.png");
      return `https://www.gravatar.com/avatar/${payload}?d=${d}`;
    },
    parseJwt(token) {
      console.log(atob(token.split('.')[1]));
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    signout() {
      this.$http.get(`${API_BASE_URL}/auth/session`)
        .then((res) => {
          console.log(res);
          this.isLogin = false;
          // this.links.forEach((obj) => {
          //   if ( obj.title != 'Home' && obj.title != 'Problems' )
          //     obj.show = false;
          // })
          this.$router.push('/');
          this.showAlert();
          // this.$forceUpdate();
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>