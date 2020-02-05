<template>
  <div>
    <v-row no-gutters v-for="(item, idx) in items" :key="idx" justify="center">
      <ui-card
        :width="width"
        elevation="2"
        markdown
        :mdContent="item.content"
        :readmore="`/course/${course}/announcement/${item.annId}`"
      >
        <template slot="subtitle">
          Written by <a style="white-space: pre"> {{ item.author.username }}</a>, {{ item.createdTime }}.
          <br>
          <i>Last update on {{ item.lastUpdatedTime }} by <a>{{ item.lastUpdater.username }}</a>.</i>
        </template>
        <template slot="title">{{ item.title }}</template>
      </ui-card>
    </v-row>
  </div>
</template>

<script>
export default {

  name: 'ShowAnn',

  props: {
    course: {
      type: String,
      Required: true,
    },
    width: {
      type: String,
      default: '50vw'
    },
  },

  data () {
    return {
      items: null,
    }
  },

  created() {
    if ( this.course ) this.getAnn();
  },

  methods: {
    getAnn() {
      this.items = [];
      this.$http.get(`/api/ann/${this.course}`)
        .then((res) => {
          // console.log(res);
          res.data.data.forEach(ele => {
            this.items.push({
              'annId': ele.annId,
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
  }
}
</script>

<style lang="css" scoped>
</style>