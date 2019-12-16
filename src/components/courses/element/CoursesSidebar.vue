<template>
  <v-card tile outlined min-height="95vh">
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-wrap">{{ courseName }}</v-list-item-title>
          <v-list-item-subtitle class="text-wrap">{{ teacherName }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav>
      <v-list-item-group color="primary">
        <v-list-item 
          v-for="link in links"
          :key="link.title"
          :to="link.path"
          link
          dense
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-wrap">{{link.title}}</v-list-item-title>
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
      courseName: this.$route.params.name,
      teacherName: 'teacherName',
      links: [
        { 'title': 'Announcement', 'path': `/course/${this.$route.params.name}/announcement`, 'icon': 'mdi-bulletin-board'},
        { 'title': 'Homework', 'path': `/course/${this.$route.params.name}/homework`, 'icon': 'mdi-book-open-variant'},
        { 'title': 'Contest', 'path': `/course/${this.$route.params.name}/contest`, 'icon': 'mdi-flag'},
        { 'title': 'Discussion', 'path': `/course/${this.$route.params.name}/discussion`, 'icon': 'mdi-message-text'},
        { 'title': 'Score', 'path': `/course/${this.$route.params.name}/score`, 'icon': 'mdi-chart-bar'},
        { 'title': 'Manage', 'path': `/course/${this.$route.params.name}/manage`, 'icon': 'mdi-settings'},
      ],
    }
  }
}
</script>

<style lang="css" scoped>
</style>