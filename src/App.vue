<template>
  <v-app>
    <Header/> 
    <v-content>
      <router-view/>
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
