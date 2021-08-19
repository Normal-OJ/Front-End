<template>
  <v-container class="page1" style="height: 100%;">
    <v-row justify="center">
      <p class="display-3">Contributors</p>
    </v-row>
    <v-row v-for="team in teams" :key="team.title">
      <v-container class="mt-3">
        <v-row justify="center">
          <p class="headline text-center">{{ team.title }}</p>
        </v-row>
        <v-row justify="center">
          <v-row justify="start">
            <v-col cols="6" sm="3" md="2" :key="name" v-for="name in team.people">
              <v-row justify="center">
                <v-avatar>
                  <img :src="`https://github.com/${name}.png`" :alt="`${name}'s github profile avatar`">
                </v-avatar>
              </v-row>
              <v-row justify="center">
                {{ name }}
              </v-row>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      teams: [
        {
          title: 'Maintainer',
          people: ['AlaRduTP', 'as535364', 'asef18766', 'Bogay', 'skps2010', 'Uier']
        },
        {
          title: 'NTNU CSIE Service Learning 2021 Spring',
          people: ['AlaRduTP', 'as535364', 'asef18766', 'BirkhoffLee', 'Bogay', 'eoleedi', 'jw910731', 'littlepenguin89106', 'PoHsien-Liu', 'QQ1010', 'RuiRabbit', 'RUJRSJ', 'simon5955687', 'skps2010', 'sophie8909', 'toto6038', 'Uier', 'YingMuo']
        },
        {
          title: 'Red Team of Software Engineering 2019 Fall',
          people: ['aisu-programming', 'AlaRduTP', 'as535364', 'asef18766', 'Bogay', 'brianchangtw', 'Dynzer', 'fuji37450', 'hackbabu9033', 'Ikaros1110', 'shangchiwu', 'skps2010', 'Snowball0409', 'Uier']
        }
      ]
    }
  }
}
</script>

<style lang="css" scoped>
.page1 {
  background: #fafafa;
}
</style>
