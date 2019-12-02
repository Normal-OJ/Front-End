<template>
  <v-content>
    <v-app-bar
      id="navbar"
      color="#003865"
      dark
      >
    
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>

      <v-img
        :src="require('@/assets/NOJ-LOGO.png')"
        :aspect-ratio="29167/4921"
        height="100%"
        contain
      ></v-img>

      <v-toolbar-items>
        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.path"
          :show="link.show"
          class="text-none title hidden-sm-and-down"
          min-width="10vw"
          text
        >{{ link.title }}</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-btn
        class="hidden-xs-only"
        text
      >
        <!-- Auth Modal Reservation -->
      </v-btn>

    </v-app-bar>
  </v-content>
</template>

<script>
export default {

  name: 'Header',

  data () {
    return {
      links: [
        { 'title': 'Home', 'path': '/', 'show': 'true'},
        { 'title': 'Problems', 'path': '/problems', 'show': 'true'},
        { 'title': 'Submissions', 'path': '/submissions', 'show': 'true'},
        { 'title': 'Courses', 'path': '/courses', 'show': 'true'},
        { 'title': 'Inbox', 'path': '/inbox', 'show': 'true'},
      ],
    }
  }
}
</script>

<style lang="css" scoped>

@media screen and (max-width: 600px) {
  #navbar {
    padding: 0 1vw;
  }

  /*.logo {
    width: 70vw;
  }*/
}

@media screen and (min-width: 600px) and (max-width: 1904px) {
  #navbar {
    padding: 0 5vw;
  }

  /*.logo {
    width: 50vw;
  }*/
}

@media screen and (min-width: 1904px) {
  #navbar {
    padding: 0 10vw;
  }

  /*.logo {
    width: 8vw;
  }*/ 
}

</style>