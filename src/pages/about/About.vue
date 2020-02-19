<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6">
        <h1>Our Team</h1>
        6 students at NTNU CSIE 111
        <v-row v-for="i in items.length/2" :key="i">
          <v-col cols="6" v-for="j in 2">
            <v-card :color="items[(i-1)*2+j-1].color" dark>
              <div class="d-flex flex-no-wrap justify-space-between">
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
        <h3>Contributors</h3>
        members of Red Team - Software Engineering 2019 Fall
        <v-row>
          <v-col cols="auto" v-for="cont in conts">
            <v-avatar><v-img :src="require('@/assets/members/contributors/'+cont+'.png')"></v-img></v-avatar>
            {{ cont }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <h1>Development</h1>
        <v-row v-for="dev in devs" :key="dev.date">
          <v-card class="mx-3" width="100%" tile outlined>
            <v-card-title v-text="dev.title"></v-card-title>
            <v-card-subtitle v-text="dev.date"></v-card-subtitle>
            <v-card-text v-text="dev.content"></v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

  name: 'About',

  data () {
    return {
      items: [
        {
          name: 'AlaRduTP',
          info: '陳映達 / PM / Backend',
          color: 'secondary',
          // color: 'rgb(82,111,138)',
        },
        {
          name: 'as535364',
          info: '蕭于傑 / Sandbox',
          color: 'primary',
          // color: 'rgb(23,40,56)',
        },
        {
          name: 'asef18766',
          info: '陳兆閔 / Sandbox',
          color: 'secondary',
          // color: 'rgb(33,49,84)',
        },
        {
          name: 'Bogay',
          info: '莊博傑 / Backend / Sandbox',
          color: 'primary',
          // color: 'rgb(84,106,119)',
        },
        {
          name: 'skps2010',
          info: '盧昭華 / Backend',
          color: 'secondary',
          // color: 'rgb(76,80,87)',
        },
        {
          name: 'Uier',
          info: '于子緯 / Frontend',
          color: 'primary',
        },
      ],
      devs: [
        {
          title: 'First Release',
          content: 'Release for demo. (SE 2019 Fall)',
          date: '2020/01/07',
        },
      ],
      conts: ['aisu170232', 'brianchangtw', 'Dynzer', 'fuji', 'hackbabu9033', 'Ikaros1110', 'shangchiwu', 'Snowball0409'],
    }
  }
}
</script>

<style lang="css" scoped>
</style>