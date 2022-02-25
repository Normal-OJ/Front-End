<template>
  <div class="ma-0 pa-0">
    <v-app-bar
      app
      :color="$vuetify.theme.dark ? 'default' : 'primary'"
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
      <a class="ml-2 mr-4" style="height: 85%" href="/">
        <img :src="require('@/assets/NOJ-logo-white.svg')" height="100%" />
      </a>

      <!-- Nav Bar -->
      <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp">
        <template v-for="link in links">
          <ui-button
            :key="link.title"
            :to="link.path"
            color="white"
            text
          ><template slot="content">{{ link.title }}</template></ui-button>
        </template>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggleDarkMode" class="mr-3">
        <v-icon>{{ $vuetify.theme.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <!-- Sign in, up, User -->
      <Spinner v-if="isFetching" />
      <v-menu v-else-if="isLogin && $vuetify.breakpoint.mdAndUp" offset-y>
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
      <Auth v-else-if="$vuetify.breakpoint.mdAndUp" @signin="showAlert"></Auth>

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
          <Auth @signin="showAlert"></Auth>
        </v-list-item-title>
        <ui-button
          icon
          @click.native="drawer = !drawer"
        ><template slot="content"><v-icon>mdi-chevron-left</v-icon></template></ui-button>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <template v-for="link in links">
          <v-list-item
            :key="link.title"
            :to="link.path"
            link
          ><v-list-item-title v-text="link.title"></v-list-item-title></v-list-item>
        </template>
        <template v-if="isLogin">
          <v-divider></v-divider>
          <v-list-item link :to="{path: '/profile'}">
            <v-list-item-title v-text="'Profile'"></v-list-item-title>
          </v-list-item>
          <v-list-item link @click="signout">
            <v-list-item-title v-text="'Sign Out'"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Auth from './Auth'
import { mapState } from 'vuex'
import Spinner from '@/components/ui/Spinner.vue'

export default {

  name: 'Header',

  components: {
    Auth, Spinner,
  },

  data () {
    return {
      links: [
        { title: 'Home', path: '/' },
        { title: 'Courses', path: '/courses' },
        // { title: 'Inbox', path: '/inbox' },
        { title: 'About', path: '/about' }
      ],
      drawer: false
    }
  },

  mounted() {
    if ( localStorage.getItem('dark-theme') == 'true' ) {
      this.$vuetify.theme.dark = true
    } else {
      this.$vuetify.theme.dark = false
    }
  },

  computed: {
    ...mapState({
      isFetching: state => state.isFetching,
      isLogin: state => state.isLogin,
      username: state => state.username,
      displayedName: state => state.displayedName,
      avatar: state => state.avatar
    })
  },

  methods: {
    toggleDarkMode () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      window.localStorage.setItem('dark-theme', this.$vuetify.theme.dark);
    },
    showAlert () {
      this.drawer = false
      this.$router.go(0)
    },
    signout () {
      this.$agent.Auth.signout()
        .then(() => {
          this.$router.push('/')
          this.showAlert()
        })
        .catch((error) => {
          // FIXME: Alert user logout failed by dialog
          throw error
        })
    }
  }
}
</script>
