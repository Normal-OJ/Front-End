<template>
  <div>
    <CoursesSidebar/>
    <router-view/>
  </div>
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