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

      <Auth/>

    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            :src="require('@/assets/NOJ.png')"
            :aspect-ratio="1"
            height="100%"
            contain
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Username</v-list-item-title>
        </v-list-item-content>
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
      drawer: false
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