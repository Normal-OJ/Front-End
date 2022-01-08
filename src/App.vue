<template>
  <v-app>
    <Header/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Header from './components/header/Header'

export default {
  name: 'App',

  components: {
    Header
  },

  created () {
    this.$store.commit('updateJwt')
  }
}
</script>

<style>
@import 'https://unpkg.com/katex@0.6.0/dist/katex.min.css';
@import "./styles/markdownstyle.css";

a {
  text-decoration: none;
}

code::before, code::after {
  content: none !important;
}

.v-application code {
  background-color: var(--v-white) !important;
  color: var(--v-code-base) !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}
</style>
