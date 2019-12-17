<template>
  <div>
    <v-app-bar
      app
      id="navbar"
      color="#003865"
      dark
      dense
    >
    
      <v-app-bar-nav-icon
        app
        class="hidden-md-and-up"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-img
        :src="require('@/assets/NOJ-LOGO.png')"
        :aspect-ratio="29167/4921"
        height="100%"
        contain
        class="mr-3"
      ></v-img>

      <v-toolbar-items>
        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.path"
          :show="link.show"
          class="text-none subtitle-1 hidden-sm-and-down"
          min-width="8vw"
          text
        >{{ link.title }}</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <div v-if="isLogin && $vuetify.breakpoint.mdAndUp" class="headline text-none">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              text
              v-on="on"
            >{{ displayedName }}({{ username }})</v-btn>
          </template>
          <v-list>
            <v-list-item
              link
              :to="{path: '/profile'}"
            >
              <v-list-item-title class="body-1">Profile</v-list-item-title>
            </v-list-item>
            <v-list-item
              link
              @click="signout"
            >
              <v-list-item-title class="body-1">Sign Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <Auth v-else :smDown="false" v-on:signinSuccessToHeader="showAlert(0)"></Auth>

    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer"
      app
      disable-resize-watcher
    >
      <v-list-item v-if="isLogin">
        <v-list-item-avatar>
          <v-img
            :src="require('@/assets/NOJ.png')"
            :aspect-ratio="1"
            height="100%"
            contain
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-title>{{ displayedName }}({{ username }})</v-list-item-title>
        <v-btn
          icon
          @click.stop="drawer = !drawer"
        ><v-icon>mdi-chevron-left</v-icon></v-btn>
      </v-list-item>
      
      <v-list-item v-else>
        <v-list-item-title>
          <Auth :smDown="true" v-on:signinSuccessToHeader="showAlert(0)"></Auth>
        </v-list-item-title>
        <v-btn
          icon
          @click.stop="drawer = !drawer"
        ><v-icon>mdi-chevron-left</v-icon></v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="link in links"
          :key="link.title"
          :to="link.path"
          link
        >
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-snackbar
      v-model="alertBar"
      color="success"
      vertical
      top
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
import Auth from './Auth'

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
        {'title': 'Home', 'path': '/', 'show': 'true'},
        {'title': 'Problems', 'path': '/problems', 'show': 'true'},
        {'title': 'Submissions', 'path': '/submissions', 'show': 'true'},
        {'title': 'Courses', 'path': '/courses', 'show': 'true'},
        {'title': 'Inbox', 'path': '/inbox', 'show': 'true'},
      ],
      drawer: false,
      isLogin: false,
      alertBar: false,
      alertText: '',
      progress: 0,
      showProgress: true,
      payload: null,
      username: '',
      displayedName: '',
    }
  },

  beforeMount () {
    this.setProfile();
  },

  methods: {
    async showAlert(type) {
      this.isLogin = true;
      this.setProfile();
      this.drawer = false;
      this.alertBar = true;
      this.alertText = MSG[type];
      this.progress = 100;
      for ( let i=0; i<40; ++i ) {
        this.progress -= 2.5;
        await this.delay(100);
      }
    },
    delay(delayInms) {
      return new Promise(resolve  => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    },
    setProfile() {
      if ( this.$cookies.isKey('jwt') ) {
        this.payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( this.payload.active === true ) {
          this.isLogin = true;
          this.username = this.payload.username;
          this.displayedName = this.payload.profile.displayedName;
        }
      }
    },
    parseJwt(token) {
      console.log(atob(token.split('.')[1]));
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    signout() {
      this.$http.get(`${API_BASE_URL}/auth/session`)
        .then((res) => {
          console.log(res);
          this.showAlert(1);
          this.isLogin = false;
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>

<style lang="css" scoped>

@media screen and (max-width: 600px) {
  #navbar {
    padding: 0 1vw;
  }
}

@media screen and (min-width: 600px) and (max-width: 1904px) {
  #navbar {
    padding: 0 5vw;
  }
}

@media screen and (min-width: 1904px) {
  #navbar {
    padding: 0 10vw;
  }
}

</style>