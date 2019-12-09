<template>
  <v-card tile outlined height="91.5vh" width="20vw">
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-wrap">Course Name Example</v-list-item-title>
          <v-list-item-subtitle>Teacher Example</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav>
      <v-list-item-group color="primary">
        <v-list-item 
          v-for="link in links"
          :key="link.title"
          link
          :to="link.path"
          dense
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{link.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    
  </v-card>
</template>

<script>
export default {

  name: 'CoursesSidebar',

  data () {
    return {
      links: [
        { 'title': 'Announcement', 'path': `/course/${this.$route.params.name}/announcement`, 'icon': 'mdi-bulletin-board'},
        { 'title': 'Homework', 'path': `/course/${this.$route.params.name}/homework`, 'icon': 'mdi-book-open-variant'},
        { 'title': 'Contest', 'path': `/course/${this.$route.params.name}/contest`, 'icon': 'mdi-flag'},
        { 'title': 'Discussion', 'path': `/course/${this.$route.params.name}/discussion`, 'icon': 'mdi-message-text'},
        { 'title': 'Score', 'path': `/course/${this.$route.params.name}/score`, 'icon': 'mdi-chart-bar'},
      ],
    }
  }
}
</script>

<style lang="css" scoped>
</style>