<template>
  <v-app>
    <v-content>
      <v-container>
        <Header/>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Header from './components/header/Header';

export default {
  name: 'App',

  components: {
    Header,
  },

  data: () => ({
    //
    aa: false
  }),

  created () {
    () => {
      this.aa = true;
    }
  }
};
</script>

<style>
#app {
  font-family: 'Lato';
}
</style>
