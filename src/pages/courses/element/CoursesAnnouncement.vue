<template>
  <div>
    <v-row no-gutters v-for="(item, idx) in items" :key="idx" justify="center">
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
                v-for="(menu, index) in commentMenu"
                :key="index"
                @click="operate(item.annId, index, idx)"
              >
                <v-list-item-title>{{menu}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
        </v-card-title>
        <v-card-text class="black--text mask"><vue-markdown :source="item.content"></vue-markdown></v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            class="text-none title"
            text
            :to="{ 'path': `./announcement/${item.annId}` }"
          ><u>Continue reading</u></v-btn>
        </v-card-actions>
      </v-card>    
    </v-row>
    <!-- New announcement form -->
    <v-dialog v-if="perm" v-model="annDialog" :width="this.$vuetify.breakpoint.mdAndUp ? '80%' : '100%'" persistent>
      <template v-slot:activator="{ on }">
        <v-btn right bottom fixed color="primary" fab v-on="on" @click="editing = -1">
          <v-icon large>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="subtitle-1" v-text="editing === -1 ? 'New Announcement' : 'Update Announcement'"></div>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn tile icon @click="cancelDialog()" v-on="on"><v-icon>mdi-close</v-icon></v-btn>
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
              v-model="ann.title">
            </v-text-field>
            <v-textarea 
              label="Announcement Content" 
              :rules="[v => !!v || 'Sorry, the content cannot be empty']"
              v-model="ann.content"
              no-resize
              auto-grow
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="secondary" @click="cancelDialog()">cancel</v-btn>
          <v-btn dark color="primary" @click="post()">post</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const API_BASE_URL = '/api';
import VueMarkdown from 'vue-markdown'

export default {

  name: 'CoursesAnnouncement',

  components: {
    VueMarkdown,
  },

  data () {
    return {
      items: [],
      annDialog: false,
      validForm: true,
      ann: {
        'title': '',
        'content': '',
      },
      commentMenu: [
        'edit',
        'delete',
      ],
      perm: false,
      editing: null,
    }
  },
  beforeMount() {
    this.init();
  },
  methods: {
    init() {
      this.items = [];
      this.getAnnouncements();
      this.checkUser(this.getUsername());
    },
    post() {
      if(this.$refs.form.validate()) {
        if ( this.editing === -1 ) {
          this.$http.post(`${API_BASE_URL}/ann`, {'courseName': this.$route.params.name, 'title': this.ann.title, 'markdown': this.ann.content})
            .then((res) => {
              this.cancelDialog();
              this.init()
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$http.put(`${API_BASE_URL}/ann`, {'title': this.ann.title, 'markdown': this.ann.content, 'annId': this.editing})
            .then((res) => {
              this.cancelDialog();
              this.init()
            })
            .catch((err) => {
              console.log(err);
            })
        }
      }
    },
    getAnnouncements() {
      this.$http.get(`${API_BASE_URL}/ann/${this.$route.params.name}`)
        .then((res) => {
          // console.log(res)
          res.data.data.forEach(ele => {
            this.items.push({
              'annId': ele.annId,
              'title': ele.title,
              'author': ele.creater,
              'content': ele.markdown,
              'createdTime': this.timeFormat(ele.createTime),
              'lastUpdatedTime': this.timeFormat(ele.updateTime),
              'lastUpdater': ele.updater});
          })
        })
        .catch((err) => {
          // console.log(err);
        });
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
    cancelDialog() {
      this.ann.title = ''
      this.ann.content = ''
      this.annDialog = false
    },
    operate(id, idx, itemIdx) {
      this.editing = id;
      if ( idx === 0 ) {
        this.ann.title = this.items[itemIdx].title;
        this.ann.content = this.items[itemIdx].content;
        this.annDialog = true;
      }
      else if ( idx === 1 ) this.deleteAnn();
    },
    editAnn() {
      if ( this.$refs.form.validate() ) {
        this.$http.put(`/api/ann`, {'title': this.newTitle, 'markdown': this.newContent, 'annId': this.editing})
          .then((res) => {
            this.cancelDialog();
            this.$router.to(0);
            // console.log(res);
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    },
    deleteAnn() {
      this.$http.delete(`/api/ann`, {headers: {'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json'}, data: {'annId': this.editing}})
        .then((res) => {
          this.$router.push(`/course/${this.$route.params.name}/announcement`);
          // console.log(res);
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
.mask {
  max-height: 35vh;
  overflow: hidden;
  mask-image: linear-gradient(180deg, #000 60%, transparent);
}
</style>