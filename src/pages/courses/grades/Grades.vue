<template>
  <div>
    <v-card class="ma-3">
      <v-simple-table class="px-3">
        <thead>
          <tr>
            <th class="subtitle-1 font-weight-bold text--primary">Title</th>
            <th class="subtitle-1 font-weight-bold text--primary">Score</th>
            <th class="subtitle-1 font-weight-bold text--primary">Description</th>
            <th class="subtitle-1 font-weight-bold text--primary">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="item in items"
            :key="item.title"
          >
            <td class="subtitle-1">{{ item.title }}</td>
            <td class="subtitle-1">{{ item.score }}</td>
            <td class="subtitle-1" style="white-space: pre;">{{ item.content }}</td>
            <td class="subtitle-1">{{ timeFormat(item.timestamp) }}</td>
          </tr>
          <tr v-show="loading">
            <td colspan="4">
              <v-skeleton-loader
                class="mx-auto"
                type="table-row"
              ></v-skeleton-loader>
            </td>
          </tr>
          <tr v-if="!loading && (!items || items.length===0)">
            <td class="subtitle-1" colspan="4">🦄 No data available.</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
export default {

  name: 'Grades',

  data () {
    return {
      items: null,
      loading: false,
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
    getGrade(user) {
      this.loading = true;
      this.$http.get(`/api/course/${this.$route.params.name}/grade/${user}`)
        .then((res) => {
          this.items = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
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