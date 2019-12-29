<template>
  <v-container class="ma-0 pa-0" style="width: 100%">
    <div id="banner-container" class="ma-0 pa-0">
      <v-row
        class="ma-0 pa-0 left-top"
        style="height: 100%"
        align="center"
      >
        <v-col class="ma-0" cols="12">
          <h1 class="display-2">Normal Online Judge</h1>
          <h2 class="subtitle-1">An online judge that amazing you.</h2>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {

  name: 'Home',

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

#banner-container {
  position: relative;
  width: 100vw;
  height: 300px;
  background: url('~@/assets/home-master-banner.jpg') center/cover no-repeat;
  color: #eee;
}

#banner-container h1, h2 {
  display: block;
  border: none;
}

h2 {
  color: #fff59d;
}
</style>