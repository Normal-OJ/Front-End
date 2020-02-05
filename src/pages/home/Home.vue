<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '60vw' : '95vw', height: '100%' }"
  >
    <!-- Pinned -->
    <v-card height="100%" elevation="12">
      <v-card elevation="0">
        <v-card-title><v-icon style="transform: rotate(45deg);">mdi-pin</v-icon>Pinned</v-card-title>
        <v-card-text class="pl-10">
          <a class="ml-6 subtitle-1"><v-icon>mdi-file-document</v-icon>How to create account?</a><br>
          <a class="ml-6 subtitle-1"><v-icon>mdi-file-document</v-icon>Get started with Normal OJ</a><br>
          <a class="ml-6 subtitle-1"><v-icon>mdi-file-document</v-icon>Normal OJ Problem Format</a>
        </v-card-text>
      </v-card>

      <v-divider></v-divider>

      <!-- Ann -->
      <v-card-title>System Announcement</v-card-title>
      <v-card-text>
        <ShowAnn course="Public" :width="$vuetify.breakpoint.mdAndUp ? '50vw': '90vw'"></ShowAnn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Ranking from './Ranking'

export default {

  name: 'Home',

  components: {
    Ranking
  },

  data () {
    return {

    }
  },

  // created() {
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
  // },

  // methods: {
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
  // }
}
</script>

<style lang="css" scoped>
</style>