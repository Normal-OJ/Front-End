<template>
  <v-container>
    <v-row
      v-for="i in Math.ceil(items.length/2)"
      :key="i"
    >
      <v-col
        v-for="j in 2"
        :key="j"
        cols="6"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card
            v-if="(i-1)*2+(j-1) < items.length"
            class="mx-auto"
            max-width="40vw"
            :elevation="hover ? 12 : 2"
          >
            <v-card-title>
              <a :href="'/course'+items[(i-1)*2+(j-1)].path">
                {{ items[(i-1)*2+(j-1)].title }}
              </a>
            </v-card-title>
            <v-card-subtitle>
              {{ items[(i-1)*2+(j-1)].teacher }}
            </v-card-subtitle>
            <v-card-text>TA: 
              <a
                v-for="ta in items[(i-1)*2+(j-1)].ta"
                class="mx-1"
              >{{ ta }}</a>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const API_BASE_URL = '/api';

export default {

  name: 'Courses',

  data () {
    return {
      items: [
      ]
    }
  },

  beforeMount () {
    this.getCourses();
  },

  methods: {
    getCourses() {
      this.$http.get('/api/course')
        .then((res) => {
          console.log(res);
          res.data.data.forEach(ele => {
            this.items.push({'title': ele.course, 'teacher': ele.teacher, 'path': `/${ele.course}/announcement`, 'ta': []})
          })
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}
</script>

<style lang="css" scoped>
</style>