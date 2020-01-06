<template>
  <v-container
    class="ma-0 pa-0"
  >
    <v-row id="banner-row"
      class="ma-0 pa-0 left-top"
      align="center"
    >
      <v-col class="ma-0" cols="12">
        <h1 class="display-2">Normal Online Judge</h1>
        <h2 class="subtitle-1">An online judge that amazing you.</h2>
      </v-col>
    </v-row>

    <v-row
      class="ma-0 pa-0 left-top"
      style="width: 100vw"
      align="center"
    >
      
      <v-col cols="6">
        <Announcement></Announcement>
      </v-col>
      
      <v-col cols="6">
        <Ranking></Ranking>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Announcement from './Announcement'
import Ranking from './Ranking'

export default {

  name: 'Home',

  components: {
    Announcement,
    Ranking
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
.left-top {
  position: relative;
  left: 0;
  top: 0;
}

#banner-row {
  position: relative;
  width: 100vw;
  height: 300px;
  background: url('~@/assets/home-master-banner.jpg') center/cover no-repeat;
  color: #eee;
}

#banner-row h1,
#banner-row h2 {
  display: block;
  border: none;
}

#banner-row h2 {
  color: #fff59d;
}
</style>