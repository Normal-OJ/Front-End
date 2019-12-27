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
          <i>Last update on {{ item.lastUpdatedTime }} by <a>{{ item.lastUpdater }}</a>.</i>
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
const API_BASE_URL = '/api';

export default {

  name: 'CoursesAnnouncement',

  data () {
    return {
      items: [],
    }
  },
  beforeMount() {
    this.init();
  },
  methods: {
    init() {
      this.getAnnouncements();
    },
    timeFormat(time) {
      var tmp = new Date(time * 1000);
      var year = tmp.getFullYear();
      var month = '0' + (tmp.getMonth()+1);
      var date = '0' + tmp.getDate();
      var hour = '0' + tmp.getHours();
      var min = '0' + tmp.getMinutes();
      var sec = '0' + tmp.getSeconds();
      var time = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return time;
    },
    getAnnouncements() {
      console.log('ann');
      this.$http.get(`${API_BASE_URL}/ann/${this.$route.params.name}`)
        .then((res) => {
          // console.log(res)
          res.data.data.forEach(ele => {
            this.items.push({
              'annId': ele.annnId,
              'title': ele.title,
              'author': ele.creater,
              'content': ele.markdown,
              'createdTime': this.timeFormat(ele.createTime),
              'lastUpdatedTime': this.timeFormat(ele.updateTime),
              'lastUpdater': ele.updater});
          })
        })
        .catch((err) => {
          // console.log(err);
        });
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