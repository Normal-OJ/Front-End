<template>
  <v-container>
    <ShowAnn 
      v-if="items"
      :items="items"
      :menu="perm"
      updateInfo
      @edit="edit" @delete="deleteAnn" 
    ></ShowAnn>
  </v-container>
</template>

<script>
import ShowAnn from '@/components/courses/ShowAnn'
export default {

  name: 'SysAnn',

  components: {
    ShowAnn,
  },

  data () {
    return {
      items: null,
      perm: false,
    }
  },

  beforeMount() {
    this.getAnn();
    this.checkUser(this.getUsername());
    // console.log(this.perm);
  },

  methods: {
    getAnn() {
      this.$http.get(`/api/ann/${this.$route.params.id}`)
        .then((res) => {
          console.log(`/api/ann/${this.$route.params.id}`);
          console.log(res);
          this.items = [];
          res.data.data.forEach(ele => {
            this.items.push({
              'annId': ele.annId,
              'title': ele.title,
              'author': ele.creator,
              'content': ele.markdown,
              'createdTime': this.timeFormat(ele.createTime),
              'lastUpdatedTime': this.timeFormat(ele.updateTime),
              'lastUpdater': ele.updater});
          });
        })
        .catch((err) => {
          // console.log(err);
        })
    },
    operate(idx) {
      if ( idx === 0 )
        this.annDialog = true;
      else if ( idx === 1 ) this.deleteAnn();
    },
    edit(idx, id) {
      console.log();
    },
    editAnn() {
      if ( this.$refs.form.validate() ) {
        this.$http.put(`/api/ann`, {'title': this.newTitle, 'markdown': this.newContent, 'annId': this.$route.params.id})
          .then((res) => {
            this.annDialog = false;
            // this.$router.go(0);
            // console.log(res);
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    },
    deleteAnn() {
      this.$http.delete(`/api/ann`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}, data: {'annId': this.$route.params.id}})
        .then((res) => {
          this.$router.push(`/course/${this.$route.params.name}/announcement`);
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
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
    checkUser(username) {
      this.$http.get(`/api/course/${this.$route.params.name}`)
        .then((res) => {
          var data = res.data.data;
          data.TAs.forEach(ele => {
            if ( ele.username === username ) {
              this.perm = true;
              return;
            }
          })
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUsername() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true ) {
          if ( payload.role <= 1 ) this.perm = true;
          return payload.username;
        }
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
  }
}
</script>

<style lang="css" scoped>
</style>