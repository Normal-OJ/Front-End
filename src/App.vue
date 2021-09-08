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
  }
}
</script>

<style>
@import 'https://unpkg.com/katex@0.6.0/dist/katex.min.css';
@import "./styles/markdownstyle.css";

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
