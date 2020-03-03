<template>
  <v-container
    fluid
    width="100%"
    height="100%"
  >
    <v-card height="100%" elevation="2" v-if="!grade">
      <v-card-title class="font-weight-bold">Manage Students</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-chip v-if="items" label class="ml-3">
        {{ 'Total Students: ' + items.length }}
      </v-chip>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary">Username</th>
              <th class="font-weight-bold subtitle-1 text--primary">Display Name</th>
              <th class="font-weight-bold subtitle-1 text--primary">Role</th>
              <th class="font-weight-bold subtitle-1 text--primary">Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? '#eee' : '#fff' }"
                    @click="dialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon color="black">mdi-plus</v-icon>Add Students</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr v-for="(item, idx) in items" :key="item.title">
              <td class="subtitle-1">{{ item.username }}</td>
              <td class="subtitle-1">{{ item.displayName }}</td>
              <td class="subtitle-1">Student</td>
              <td class="subtitle-1">
                <ui-button class="mr-1" color="info" @click.native="grade = item.username">
                  <template slot="content">
                    <v-icon>mdi-chart-bar</v-icon>
                  </template>
                </ui-button>
                <ui-button class="mr-1" color="error" alert @alertClick="del(idx)">
                  <template slot="content">
                    <v-icon>mdi-account-remove</v-icon>
                  </template>
                </ui-button>
              </td>
            </tr>
            <tr v-if="items.length===0">
              <td colspan="4">🦄 No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"
      @cancel="cancel" persistent alert
    >
      <template slot="title">Add Students</template>
      <template slot="body">
        <v-card-text>
          <ui-alert
            v-model="errAlert"
            dense
            type="error"
            :alertMsg="errMsg"
          ></ui-alert>
          <v-combobox
            label="Users"
            v-model="newUsers"
            :items="users"
            item-text="username"
            chips
            multiple
          ></v-combobox>
        </v-card-text>
      </template>
      <template slot="action-cancel">
        <ui-button outlined class="mx-1" color="secondary" alert @alertClick="cancel">
          <template slot="content">Cancel</template>
        </ui-button>
      </template>
      <template slot="action-ok">
        <ui-button class="mx-1" color="primary" @click.native="submit">
          <template slot="content">Submit</template>
        </ui-button>
      </template>
    </ui-dialog>
    <v-card height="100%" elevation="2" v-if="grade">
      <v-card-title class="font-weight-bold">Manage Score: {{ grade }}</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <td class="subtitle-1 font-weight-bold text--primary">Title</td>
              <td class="subtitle-1 font-weight-bold text--primary">Score</td>
              <td class="subtitle-1 font-weight-bold text--primary">Description</td>
              <td class="subtitle-1 font-weight-bold text--primary">Time</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? '#eee' : '#fff' }"
                    @click="gradeDialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon color="black">mdi-plus</v-icon>Add Score</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr 
              v-if="scores && scores.length > 0" 
              v-for="score in scores"
              :key="score.title"
            >
              <td>{{ score.title }}</td>
              <td>{{ score.score }}</td>
              <td>{{ score.content }}</td>
              <td>{{ timeFormat(score.timestamp) }}</td>
            </tr>
            <tr v-else>
              <td colspan="4">🦄 No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <ui-dialog v-model="gradeDialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"
      @cancel="cancel" persistent alert
    >
      <template slot="title">Add Score</template>
      <template slot="body">
        <v-card-text>
          <ui-alert
            v-model="errAlert"
            dense
            type="error"
            :alertMsg="errMsg"
          ></ui-alert>
          <v-form ref="form">
            <v-text-field
              label="Title"
              v-model="data.title"
              :rules="[v => !!v || 'Please enter the title.']"
            ></v-text-field>
            <v-text-field
              label="Score"
              v-model="data.score"
              :rules="[v => !!v || 'Please enter the score.']"
            ></v-text-field>
            <v-textarea
              label="Description"
              v-model="data.content"
              :rules="[v => !!v || 'Please enter the description']"
            ></v-textarea>
          </v-form>
        </v-card-text>
      </template>
      <template slot="action-cancel">
        <ui-button outlined class="mx-1" color="secondary" alert @alertClick="cancel">
          <template slot="content">Cancel</template>
        </ui-button>
      </template>
      <template slot="action-ok">
        <ui-button class="mx-1" color="primary" @click.native="scoring">
          <template slot="content">Submit</template>
        </ui-button>
      </template>
    </ui-dialog>
  </v-container>
</template>

<script>
export default {

  name: 'ManageStudents',

  props: {
    items: {
      type: Array,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      dialog: false,
      errAlert: false,
      errMsg: '',
      newUsers: [],
      grade: '',
      scores: null,
      gradeDialog: false,
      data: {
        title: '',
        newtitle: '',
        score: '',
        content: '',
      }
    }
  },

  watch: {
    grade() {
      this.$http.get(`/api/course/${this.$route.params.name}/grade/${this.grade}`)
        .then((res) => {
          this.scores = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.scores = null;
        })
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.gradeDialog = false;
      this.grade = '';
      this.newUsers = [];
    },
    submit() {
      // console.dir(this.newUsers);
      var data = {};
      this.items.forEach(ele => {
        data[ele.username] = ele.displayName;
      })
      this.newUsers.forEach(ele => {
        data[ele.username] = ele.displayName;
      })
      this.$http.put(`/api/course/${this.$route.params.name}`,
                    {
                      TAs: [],
                      studentNicknames: data,
                    })
        .then((res) => {
          this.$router.go(0);
        })
        .catch((err) => {

        })
    },
    del(idx) {
      this.items.splice(idx,1);
      this.submit();
    },
    scoring() {
      this.$http.post(`/api/course/${this.$route.params.name}/grade/${this.grade}`, this.data)
        .then((res) => {
          this.grade = this.grade;
          this.cancel();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    editscore() {
      this.$http.put(`/api/course/${this.$route.params.name}/grade/${this.grade}`, this.data)
        .then((res) => {
          this.grade = this.grade;
          this.cancel();
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