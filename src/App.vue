<template>
  <v-app>
    <Header/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Header from './pages/header/Header';

export default {
  name: 'App',

  components: {
    Header
  },

  data: () => ({
  }),
};
</script>

<style>
@import "./styles/markdownstyle.css";

#app {
  font-family: 'Lato';
  font-size: 20px;
}

code::before, code::after {
  content: none !important;
}

.v-application code {
  background-color: #f8f8f8 !important;
  color: #bd4147;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}
</style>
