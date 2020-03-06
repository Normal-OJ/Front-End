<template>
  <v-container>
    <v-simple-table class="px-3">
      <!-- <template v-slot:default> -->
        <thead>
          <tr>
            <td class="subtitle-1 font-weight-bold text--primary">Title</td>
            <td class="subtitle-1 font-weight-bold text--primary">Score</td>
            <td class="subtitle-1 font-weight-bold text--primary">Description</td>
            <td class="subtitle-1 font-weight-bold text--primary">Time</td>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-if="items && items.length > 0"
            v-for="item in items"
            :key="item.title"
          >
            <td>{{ item.title }}</td>
            <td>{{ item.score }}</td>
            <td style="white-space: pre;">{{ item.content }}</td>
            <td>{{ timeFormat(item.timestamp) }}</td>
          </tr>
          <tr v-else>
            <td colspan="4">🦄 No data available.</td>
          </tr>
        </tbody>
      <!-- </template> -->
    </v-simple-table>
  </v-container>
</template>

<script>
export default {

  name: 'Grades',

  data () {
    return {
      items: null,
    }
  },

  created() {
    this.getGrade(this.getUser());
  },

  methods: {
    getUser() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true ) {
          return payload.username;
        } else {
          this.$router.push('/');
        }
      } else {
        this.$router.push('/');
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    getGrade() {
      this.$http.get(`/api/course/${this.$route.params.name}/grade/uier`)
        .then((res) => {
          this.items = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        })
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