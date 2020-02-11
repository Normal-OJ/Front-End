<template>
  <v-card tile outlined height="100%">
    <v-list>
      <v-list-item>
        <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ courseName }}</v-list-item-title>
          <v-list-item-subtitle class="title">{{ teacherName }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav>
      <v-list-item-group color="primary">
        <v-list-item 
          v-for="link in links"
          v-if="link.title!=='Manage'||perm"
          :key="link.title"
          :to="link.path"
          link
          dense
        >
          <v-list-item-icon><v-icon class="mt-1">{{ link.icon }}</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">{{ link.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {

  name: 'CoursesSidebar',

  data () {
    return {
      courseName: this.$route.params.name,
      teacherName: 'teacherName',
      avatar: this.setAvatar(''),
      links: [
        { 'title': 'Announcement', 'path': `/course/${this.$route.params.name}/announcement`, 'icon': 'mdi-bulletin-board'},
        { 'title': 'Homework', 'path': `/course/${this.$route.params.name}/homework`, 'icon': 'mdi-book-multiple'},
        { 'title': 'Submissions', 'path': `/course/${this.$route.params.name}/submissions`, 'icon': 'mdi-history'},
        { 'title': 'Problems', 'path': `/course/${this.$route.params.name}/problems`, 'icon': 'mdi-view-list'},
        { 'title': 'Discussion', 'path': `/course/${this.$route.params.name}/discussion`, 'icon': 'mdi-comment-text'},
        { 'title': 'Score', 'path': `/course/${this.$route.params.name}/score`, 'icon': 'mdi-chart-bar'},
        { 'title': 'Manage', 'path': `/course/${this.$route.params.name}/manage`, 'icon': 'mdi-settings'},
      ],
      perm: false,
      // drawer: false,
    }
  },

  beforeMount() {
    this.getInfo();
    this.checkUser(this.getUsername());
  },

  methods: {
    getInfo() {
      this.$http.get(`/api/course/${this.$route.params.name}`)
        .then((res) => {
          var data = res.data.data;
          this.teacherName = data.teacher.username;
          this.avatar = this.setAvatar(data.teacher.md5);
        })
        .catch((err) => {
          console.log(err);
        })
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
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    setAvatar(payload) {
      var d = encodeURI("noj.tw/defaultAvatar.png");
      return `https://www.gravatar.com/avatar/${payload}?d=${d}`;
    },
  }
}
</script>

<style lang="css" scoped>
</style>