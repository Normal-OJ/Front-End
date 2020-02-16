<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '60vw' : '95vw', height: '100%' }"
  >
    <v-card height="100%" elevation="12">
      <!-- Pinned -->
      <v-card elevation="0" tile>
        <v-card-title class="headline font-weight-bold">
          <v-icon class="mr-1" style="transform: rotate(45deg);">mdi-pin</v-icon>Pinned
        </v-card-title>
        <v-divider class="mt-0"></v-divider>
        <v-card-text class="pl-10">
          <a class="ml-6 subtitle-1"><v-icon>mdi-file-document</v-icon>How to create account?</a><br>
          <a class="ml-6 subtitle-1"><v-icon>mdi-file-document</v-icon>Get started with Normal OJ</a><br>
          <a class="ml-6 subtitle-1"><v-icon>mdi-file-document</v-icon>Normal OJ Problem Format</a>
        </v-card-text>
      </v-card tile>

      <!-- <v-divider></v-divider> -->

      <!-- Ann -->
      <v-card-title class="headline font-weight-bold">System Announcement</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-card-text>
        <ShowAnn 
          v-if="items" 
          :items="items" 
          :width="$vuetify.breakpoint.mdAndUp ? '50vw': '90vw'"
          :readmore="`/post`"
          mask
        ></ShowAnn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ShowAnn from '@/components/courses/ShowAnn'
// import Ranking from './Ranking'

export default {

  name: 'Home',

  components: {
    ShowAnn,
    // Ranking
  },

  data () {
    return {
      items: null,
    }
  },

  created() {
    // window.onload = () => {
    //   for ( var i=0; i<100; ++i ) {
    //     var unicorn = document.createElement('span');
    //     unicorn.style.fontSize = '20px';
    //     unicorn.style.position = 'absolute';
    //     unicorn.innerText = '🦄';
    //     document.body.appendChild(unicorn);
    //     this.move(unicorn);
    //   }
    // }
    this.getAnn();
  },

  methods: {
    // move(obj) {
    //   var W = window.innerWidth - obj.offsetWidth;
    //   var H = window.innerHeight - obj.offsetHeight;
    //   // console.log(W);
    //   // console.log(H);
    //   var objTop = Math.random() * W;
    //   var objLeft = Math.random() * H;
    //   obj.style.top = String(objTop) + 'px';
    //   obj.style.left = String(objLeft) + 'px';
    //   setInterval(() => {
    //     objTop++;
    //     objLeft++;
    //     obj.style.top = String(objTop) + 'px';;
    //     obj.style.left = String(objLeft) + 'px';
    //     console.log(obj.style.posTop);
    //     if ( objTop > H ) objTop = 0;
    //     if ( objLeft > W )  objLeft = 0;
    //   }, 10);
    // }
    getAnn() {
      this.$http.get('/api/ann/')
        .then((res) => {
          // console.log(res);
          this.items = [];
          res.data.data.forEach(ele => {
            this.items.push({
              'annId': ele.annId,
              'title': ele.title,
              'author': ele.creator,
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