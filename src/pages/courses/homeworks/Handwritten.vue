<template>
  <v-container>
    <v-simple-table class="px-3">
      <template v-slot:default>
        <thead v-if="probs">
          <tr>
            <th class="font-weight-bold subtitle-1 text--primary" v-text="'username'"></th>
            <th
              v-for="(prob, idx) in probs"
              :key="idx"
              class="font-weight-bold subtitle-1 text--primary"
            >#{{idx+1}} - <a :href="`/problem/${prob}`">Pid:{{prob}}</a></th>
          </tr></thead>
        <tbody v-if="items">
          <tr
            v-for="[username, item] in Object.entries(items)"
            :key="username"
          >
            <td class="subtitle-1" v-text="username"></td>
            <td
              v-for="prob in probs"
              class="subtitle-1"
            >
              <div>
                
                <font v-if="item[prob].problemStatus!=null" :color="COLOR[item[prob].problemStatus+1]">{{ STATUS[item[prob].problemStatus+1] }}</font>
                <font v-else>Unsolved</font>

                {{ ' / ' + item[prob].score + 'pts' }}

                <ui-button v-if="item['submissionId']" small class="mx-2">
                  <template slot="content">
                      <a :href="`/api/submission/${item['submissionId']}/pdf/upload`" rel="noopener noreferrer" target="_blank"><v-icon color="white">mdi-file-download</v-icon></a>
                  </template>
                </ui-button>
                <ui-dialog v-if="item['submissionId']"
                  v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'" persistent alert>
                  <template slot="activator">
                    <ui-button small @click.native="dialog = true; scoring(item[prob])">
                      <template slot="content"><v-icon>mdi-chart-bar</v-icon></template>
                    </ui-button>
                  </template>
                  <template slot="title">Score & Comment</template>
                  <template slot="body">
                    <v-card-text class="subtitle-1 text--primary">
                      <v-text-field
                        label="Score"
                        v-model="data.score"
                        :rules="[v => !!v && 0 <= v && v <= 100 || 'Score must be in range: 0 to 100']" 
                        prepend-icon="mdi-check-bold"
                      ></v-text-field>
                      <v-file-input
                        v-model="data.file"
                        show-size
                        label="Upload Comment PDF(zip)"
                        prepend-icon="mdi-file"
                      ></v-file-input>
                      <a :href="`/api/submission/${item['submissionId']}/pdf/comment`" rel="noopener noreferrer" target="_blank">/api/submission/{{item['submissionId']}}/pdf/comment (Past comment PDF)</a>

                    </v-card-text>
                  </template>
                  <template slot="action-ok">
                    <ui-button color="primary" @click.native="comment(item['submissionId'])">
                      <template slot="content">Submit</template>
                    </ui-button>
                  </template>
                </ui-dialog>

              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
export default {

  name: 'Status',

  data () {
    return {
      items: null,
      probs: null,
      dialog: false,
      data: {
        score: null,
        file: null,
      },
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C', '#BF360C'],
    }
  },

  created() {
    this.getData();
  },

  methods: {
    async getData() {
      try {
        this.items = null
        let res = await this.$http.get(`/api/homework/${this.$route.params.id}`)
        // stash student status
        let items = res.data.data.studentStatus;
        // get handwritten problem ids
        let pids = res.data.data.problemIds
        let handwrittens = await Promise.all(pids.map(async pid => {
          return ((await this.$http.get(`/api/problem/view/${pid}`)).data.data.type === 2)
        }))
        this.probs = pids.filter((pid, idx) => handwrittens[idx])
        // get submission ids
        await Promise.all(this.probs.map(async pid => {
          // query submission ids by pid
          let sRes = await this.$http.get(
          '/api/submission',
          {
            params: {
              course: this.$route.params.name,
              problemId: pid,
              offset: 0,
              count: -1,
            }
          })
          // update student status
          for ( let subm of sRes.data.data.submissions ) {
            if ( items[subm.user.username] ) {
              items[subm.user.username]['submissionId'] = subm.submissionId;
            }
          }
        }))
        this.items = items
      } catch(err) {
        console.log(err)
      }
    },
    scoring(item) {
      this.data.score = item.score;
      this.data.file = null;
    },
    comment(sid) {
      this.$http.put(`/api/submission/${sid}/grade`, {score: Number(this.data.score)})
        .then((res) => {
          if ( this.data.file ) {
            var formData = new FormData();
            formData.append('comment', this.data.file);
            return this.$http.put(`/api/submission/${sid}/comment`,
                                  formData,
                                  {
                                    headers: { 'Content-Type' : 'multipart/form-data' }, 
                                  }
                                ).then()
          }
          return true;
        })
        .then((res) => {this.dialog = false; this.$router.go(0);})
        .catch((err) => console.log(err))
    },
    getUrl() {
      // this.copycat = {};
      // this.probs.forEach(ele => {
        // this.copycat[`${ele}`] = {};
        // this.copycat[`${ele}`]['valid'] = false;
        // while ( !this.copycat[`${ele}`]['valid'] ) {
          // this.$http.get('/api/copycat', {
          //                                   'problemId': ele,
          //                                   'course': this.$route.params.name,
          //                                })
          //   .then(async(res) => {
          //     var flag = false;
          //     if ( res.data.data.cppReport ) {
          //       flag = true;
          //       this.copycat[`${ele}`]['cpp'] = res.data.data.cppReport;
          //     }
          //     if ( res.data.data.pythonReport ) {
          //       if ( flag ) this.copycat[`${ele}`]['valid'] = true;
          //       this.copycat[`${ele}`]['py'] = res.data.data.pythonReport;
          //     }
          //     await delay(1000);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   })
        // }
      // })
    },
    delay(delayInms) {
      return new Promise(resolve  => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    },
  }
}
</script>

<style lang="css" scoped>
</style>