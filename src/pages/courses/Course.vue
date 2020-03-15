<template>
  <v-row no-gutters>
    <v-col cols="2" style="position: fixed; height: 100%;">
      <CourseSidebar></CourseSidebar>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="10">
      <router-view/>
    </v-col>
  </v-row>
</template>

<script>
import CourseSidebar from './CourseSidebar';

export default {

  name: 'Course',

  components: {
    CourseSidebar,
  },

  data () {
    return {

    }
  },

}
</script>

<style lang="css" scoped>
</style>