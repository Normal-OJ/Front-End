<template>
  <div class="page1" style="height: 100%;">
    <v-slide-x-transition>
      <v-container style="min-height: 100vh" v-show="show">
        <v-row justify="center">
          <p class="display-3">Our Team</p>
        </v-row>
        <v-row justify="center">
          <p class="headline">NTNU CSIE 111</p>
        </v-row>
        <v-row v-for="i in items.length/2" :key="i" justify="center">
          <v-col cols="12" md="6" lg="4" v-for="j in 2">
            <v-card color="primary" dark>
              <div class="d-flex  justify-space-between">
                <div>
                  <v-card-title
                    class="headline"
                    v-text="items[(i-1)*2+j-1].name"
                  ></v-card-title>
                  <v-card-subtitle v-text="items[(i-1)*2+j-1].info"></v-card-subtitle>
                </div>
                <v-avatar class="ma-3" size="96" tile>
                  <v-img :src="require('@/assets/members/'+items[(i-1)*2+j-1].name+'.png')"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-slide-x-transition>
    <v-container style="min-height: 100vh">
      <v-row justify="center">
        <p class="display-3">Contributors</p>
      </v-row>
      <v-row justify="center">
        <p class="headline text-center">members of Red Team - Software Engineering 2019 Fall</p>
      </v-row>
      <v-row justify="center">
        <p class="body-2">sort by lexicographical order</p>
      </v-row>
      <v-row justify="center">
        <v-row justify="space-around">
          <v-col cols="6" sm="3" md="1" v-for="cont in conts">
            <v-row justify="center">
              <v-avatar><v-img :src="require('@/assets/members/contributors/'+cont+'.png')"></v-img></v-avatar>
            </v-row>
            <v-row justify="center">
              {{ cont }}
            </v-row>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {

  name: 'About',

  data () {
    return {
      show: false,
      items: [
        {
          name: 'AlaRduTP',
          info: '陳映達 / PM / Backend',
        },
        {
          name: 'as535364',
          info: '蕭于傑 / Sandbox',
        },
        {
          name: 'asef18766',
          info: '陳兆閔 / Sandbox / Testing',
        },
        {
          name: 'Bogay',
          info: '莊博傑 / Backend / Sandbox',
        },
        {
          name: 'skps2010',
          info: '盧昭華 / Backend',
        },
        {
          name: 'Uier',
          info: '于子緯 / Frontend / Designer',
        },
      ],
      conts: ['aisu170232', 'brianchangtw', 'Dynzer', 'fuji', 'hackbabu9033', 'Ikaros1110', 'shangchiwu', 'Snowball0409'],
    }
  },

  mounted() {
    this.show = true;
  },
}
</script>

<style lang="css" scoped>
.page1 {
  background: #fafafa;
  /*background: rgb(238,174,202);*/
  /*background: linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%); */
}
</style>