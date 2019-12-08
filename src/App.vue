<template>
  <v-app>
    <Inbox/>
  </v-app>
</template>

<script>
import Inbox from './components/inbox/Inbox';

export default {
  name: 'App',

  components: {
    //
    Inbox,
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