<template>
  <div>
    <v-row no-gutters v-for="(item, idx) in items" :key="idx" justify="center">
      <v-card
        class="my-6 flex-column d-flex"
        elevation="6"
        height="60vh"
        width="50vw"
      >
        <v-card-title class="display-1 ma-1">
          <v-chip
            color="blue lighten-2"
            label
            style="left: -40px;"
          >{{ status }}</v-chip>
          {{ item.title }}
        </v-card-title>
        <v-card-subtitle>
          Written by <a>{{ item.author }}</a>, {{ item.createdTime }}.<br>
          <i>Last update on {{ item.lastUpdatedTime }}.</i>
        </v-card-subtitle>
        <v-card-title class="headline ma-1">Statistic</v-card-title>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {

  name: 'CoursesHomework',

  data () {
    return {
      status: 'Running',
      items: [
        {'title': 'Homework #1', 'author': 'Po-Wen Chi', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Homework', 'author': 'Po-Wen Chi', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Homework', 'author': 'Po-Wen Chi', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Homework', 'author': 'Po-Wen Chi', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Homework', 'author': 'Po-Wen Chi', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Homework', 'author': 'Po-Wen Chi', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
      ],
    }
  }
}
</script>

<style lang="css" scoped>
</style>