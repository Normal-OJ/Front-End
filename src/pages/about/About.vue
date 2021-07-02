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
        <v-row justify="center">
          <v-col cols="12" lg="2" md="3" sm="12" v-for="item in items.slice(0,3)" :key="item.name">
            <div class="d-flex justify-center">
              <v-avatar size="128">
                <v-img :src="require('@/assets/members/'+item.name+'.png')"></v-img>
              </v-avatar>
            </div>
            <div class="d-flex justify-center">
              <p class="headline font-weight-bold my-1">
                <font color="#003865">{{ item.name }}</font></p>
            </div>
            <div class="d-flex" style="flex-direction: column; align-items: center;">
              <p class="subtitle-1 font-weight-medium my-0">{{ item.realName }}</p>
              <p class="subtitle-1 font-weight-medium my-0">{{ item.info }}</p>
            </div>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" lg="2" md="3" sm="12" v-for="item in items.slice(3)" :key="item.name">
            <div class="d-flex justify-center">
              <v-avatar size="128">
                <v-img :src="require('@/assets/members/'+item.name+'.png')"></v-img>
              </v-avatar>
            </div>
            <div class="d-flex justify-center">
              <p class="headline font-weight-bold my-1">
                <font color="#003865">{{ item.name }}</font></p>
            </div>
            <div class="d-flex" style="flex-direction: column; align-items: center;">
              <p class="subtitle-1 font-weight-medium my-0">{{ item.realName }}</p>
              <p class="subtitle-1 font-weight-medium my-0">{{ item.info }}</p>
            </div>
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
          <v-col cols="6" sm="3" md="1" v-for="cont in conts" :key="cont">
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
          realName: '陳映達',
          info: 'PM / Backend',
        },
        {
          name: 'as535364',
          realName: '蕭于傑',
          info: 'Sandbox',
        },
        {
          name: 'asef18766',
          realName: '陳兆閔',
          info: 'Sandbox / Testing',
        },
        {
          name: 'Bogay',
          realName: '莊博傑',
          info: 'Backend / Sandbox',
        },
        {
          name: 'skps2010',
          realName: '盧昭華',
          info: 'Backend',
        },
        {
          name: 'Uier',
          realName: '于子緯',
          info: 'Frontend / Designer',
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
