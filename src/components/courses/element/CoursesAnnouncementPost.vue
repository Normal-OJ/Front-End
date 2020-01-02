<template>
  <v-container>
    <v-card
      class="my-6 flex-column d-flex"
      elevation="6"
      width="70vw"
    >
      <v-card-subtitle class="subtitle-1">
        Written by <a>{{ item.author.username }}</a>, {{ item.createdTime }}.<br>
        <i>Last update on {{ item.lastUpdatedTime }} by <a>{{ item.lastUpdater.username }}</a>.</i>
      </v-card-subtitle>
      <v-card-title class="display-2 font-weight-bold">
        <v-row no-gutters class="px-auto">
          {{ item.title }}
          <v-spacer></v-spacer>
          <v-menu v-if="perm" offset-x>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, idx) in commentMenu"
                :key="idx"
                @click="operate(idx)"
              >
                <v-list-item-title>{{item}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-card-title>
      <v-card-text class="grow black--text"><vue-markdown :source="item.content"></vue-markdown></v-card-text>
    </v-card>    
    <v-dialog v-model="annDialog" :width="this.$vuetify.breakpoint.mdAndUp ? '80%' : '100%'" persistent>
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="subtitle-1">Update Announcement</div>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn tile icon @click="annDialog = false" v-on="on"><v-icon>mdi-close</v-icon></v-btn>
            </template>
            <span>close</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text class="mt-2">
          <v-form v-model="validForm" ref="form">
            <v-text-field
              label="Announcement Title"
              counter="64" 
              :rules="[v => !!v && v.length <= 64 || 'Sorry, the length must be ≤ 64 characters']" 
              v-model="newTitle">
            </v-text-field>
            <v-textarea 
              label="Announcement Content" 
              :rules="[v => !!v || 'Sorry, the content cannot be empty']"
              v-model="newContent"
              no-resize
              auto-grow
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="secondary" @click="annDialog = false">cancel</v-btn>
          <v-btn dark color="primary" @click="editAnn()">update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {

  name: 'CoursesAnnouncementPost',

  components: {
    VueMarkdown,
  },

  data () {
    return {
      item: {
        author: '',
        createdTime: '',
        lastUpdatedTime: '',
        lastUpdater: '',
        title: '',
        content: '',
      },
      annDialog: false,
      validForm: true,
      newTitle: '',
      newContent: '',
      commentMenu: [
        'edit',
        'delete',
      ],
      perm: false,
    }
  },

  beforeMount() {
    this.getAnn();
    this.checkUser(this.getUsername());
    console.log(this.perm);
  },

  methods: {
    getAnn() {
      this.$http.get(`/api/ann/${this.$route.params.name}`)
        .then((res) => {
          console.log(res);
          var data = res.data.data, flag = 0;
          data.forEach((ele) => {
            if ( ele.annId === this.$route.params.id ) {
              this.item.author = ele.creater;
              this.newTitle = ele.title;
              this.item.title = ele.title;
              this.newContent = ele.markdown;
              this.item.content = ele.markdown;
              this.item.createdTime = this.timeFormat(ele.createTime);
              this.item.lastUpdatedTime = this.timeFormat(ele.updateTime);
              this.item.lastUpdater = ele.updater;
              flag = 1;
            }
          });
          if ( flag === 0 ) {
            this.$router.push(`/course/${this.$route.params.name}/announcement`);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    operate(idx) {
      if ( idx === 0 )
        this.annDialog = true;
      else if ( idx === 1 ) this.deleteAnn();
    },
    editAnn() {
      if ( this.$refs.form.validate() ) {
        this.$http.put(`/api/ann`, {'title': this.newTitle, 'markdown': this.newContent, 'annId': this.$route.params.id})
          .then((res) => {
            this.annDialog = false;
            this.$router.go(0);
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
          if ( data.teacher.username === username ) {
            this.perm = true;
            return;
          }
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
          if ( payload.role === 0 ) this.perm = true;
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