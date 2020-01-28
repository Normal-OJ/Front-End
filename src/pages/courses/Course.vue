<template>
  <v-row no-gutters>
    <v-col cols="2"></v-col>
    <CoursesSidebar style="position: fixed; max-width: 16.66vw"></CoursesSidebar>
    <v-col cols="10">
        <router-view/>
    </v-col>
  </v-row>
</template>

<script>
import CoursesSidebar from './element/CoursesSidebar';

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