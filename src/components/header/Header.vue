<template>
  <v-content>
    <v-app-bar
      id="navbar"
      color="#003865"
      dark
      dense
    >
    
      <v-app-bar-nav-icon
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

      <Auth :smDown="false" v-on:signinSuccessToHeader="signinSuccessShowAlert"></Auth>

    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer"
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
        <v-list-item-title>
          Username
        </v-list-item-title>
        <v-btn
          icon
          @click.stop="drawer = !drawer"
        ><v-icon>mdi-chevron-left</v-icon></v-btn>
      </v-list-item>
      
      <v-list-item v-else>
        <v-list-item-title>
          <Auth :smDown="true" v-on:signinSuccessToHeader="signinSuccessShowAlert"></Auth>
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
  </v-content>
</template>

<script>
import Auth from './Auth'

export default {

  name: 'Header',

  components: {
    'Auth': Auth,
  },

  data () {
    return {
      links: [
        { 'title': 'Home', 'path': '/', 'show': 'true'},
        { 'title': 'Problems', 'path': '/problems', 'show': 'true'},
        { 'title': 'Submissions', 'path': '/submissions', 'show': 'true'},
        { 'title': 'Courses', 'path': '/courses', 'show': 'true'},
        { 'title': 'Inbox', 'path': '/inbox', 'show': 'true'},
      ],
      drawer: false,
      isLogin: false,
      alertBar: false,
      alertText: 'Welcome! Signed in successfully!',
      progress: 0,
      showProgress: true,
    }
  },

  methods: {
    async signinSuccessShowAlert() {
      this.drawer = false;
      this.alertBar = true;
      for ( let i=0; i<40; ++i ) {
        this.progress += 2.5;
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