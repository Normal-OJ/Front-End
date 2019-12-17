<template>
  <div>
    <v-row no-gutters v-for="(item, idx) in items" :key="idx" justify="center">
    	<v-card
        class="my-6 flex-column d-flex"
        elevation="6"
        height="60vh"
        width="50vw"
      >
        <v-card-subtitle>
          Written by <a>{{ item.author }}</a>, {{ item.createdTime }}.<br>
          <i>Last update on {{ item.lastUpdatedTime }}.</i>
        </v-card-subtitle>
        <v-row class="ma-0 pa-0" justify="center"><v-card-title class="display-1">{{ item.title }}</v-card-title></v-row>
        <v-card-text class="grow mask"><p class="body-1 black--text">{{ item.content }}</p></v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            class="text-none subtitle-1"
            text
          ><u>Continue reading</u></v-btn>
        </v-card-actions>
      </v-card>    
    </v-row>
  </div>
</template>

<script>
export default {

  name: 'CoursesAnnouncement',

  data () {
    return {
      items: [
        {'title': 'This is annoucement Title', 'author': 'Po-Wen Chi', 'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet risus eget massa porttitor scelerisque in vitae dolor. Pellentesque finibus fermentum nunc, vitae facilisis erat rutrum eu. Nam sollicitudin hendrerit vehicula. Ut eleifend ornare augue, ac vehicula ligula aliquet vitae. Cras imperdiet quam ligula, non pharetra lacus aliquam sed. Nam eget ante sit amet diam sodales maximus vel et turpis. Sed dui tellus, pulvinar aliquam viverra nec, suscipit quis nulla. Praesent lacinia ut tortor at feugiat. Etiam tristique, diam eget viverra hendrerit, nibh quam commodo mi, a mollis dolor lacus vitae nunc. Quisque maximus posuere scelerisque. Duis pretium nunc a sem efficitur ultrices. Mauris lacinia metus ac urna consequat fermentum.', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Presentation I', 'author': 'Po-Wen Chi', 'content': 'wow annoucement', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Presentation I', 'author': 'Po-Wen Chi', 'content': 'wow annoucement', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Presentation I', 'author': 'Po-Wen Chi', 'content': 'wow annoucement', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Presentation I', 'author': 'Po-Wen Chi', 'content': 'wow annoucement', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
        {'title': 'Presentation I', 'author': 'Po-Wen Chi', 'content': 'wow annoucement', 'createdTime': '2019/12/10 13:59', 'lastUpdatedTime': '2019/12/10 13:59'},
      ],
    }
  }
}
</script>

<style lang="css" scoped>
.mask {
  max-height: 20vh;
  overflow: hidden;
  mask-image: linear-gradient(180deg, #000 60%, transparent);
}
</style>