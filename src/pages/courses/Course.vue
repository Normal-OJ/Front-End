<template>
  <v-row no-gutters>
    <v-col cols="2" style="position: fixed; height: 100%;">
      <CoursesSidebar></CoursesSidebar>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="10">
      <router-view/>
    </v-col>
  </v-row>
</template>

<script>
import CoursesSidebar from './CoursesSidebar';

export default {

  name: 'Course',

  components: {
    CoursesSidebar,
  },

  data () {
    return {

    }
  },

}
</script>

<style lang="css" scoped>
</style>