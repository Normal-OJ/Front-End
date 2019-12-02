<template>
  <v-app>
    <Header/>
    <router-view/>
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
  }),
};
</script>

<style>
#app {
  font-family: 'Lato';
}
</style>
