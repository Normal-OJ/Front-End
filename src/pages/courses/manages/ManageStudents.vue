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
              <td class="subtitle-1">{{ item.displayedName }}</td>
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
      <v-card-title class="font-weight-bold">
        Manage Score: {{ grade }}
        <v-spacer></v-spacer>
        <ui-button
          class="mx-3"
          color="secondary"
          @click.native="grade = ''"
        >
          <template slot="content"><v-icon>mdi-back</v-icon>Back</template>
        </ui-button>
      </v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="subtitle-1 font-weight-bold text--primary">Title</th>
              <th class="subtitle-1 font-weight-bold text--primary">Score</th>
              <th class="subtitle-1 font-weight-bold text--primary">Description</th>
              <th class="subtitle-1 font-weight-bold text--primary">Time</th>
              <th class="subtitle-1 font-weight-bold text--primary">Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="px-0">
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
            <template v-if="scores && scores.length > 0">
              <tr v-for="(score, idx) in scores" :key="idx">
                <td>{{ score.title }}</td>
                <td>{{ score.score }}</td>
                <td style="white-space: pre;">{{ score.content }}</td>
                <td>{{ $formatTime(score.timestamp) }}</td>
                <td>
                  <ui-button
                    class="mr-1"
                    color="error"
                    alert
                    @alertClick="delscore(score.title)"
                  >
                    <template slot="content"><v-icon>mdi-trash-can</v-icon></template>
                  </ui-button>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="5">🦄 No data available.</td>
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
    // Array of students' username
    items: {
      type: Array,
      required: true
    },
    users: {
      type: Array,
      required: true
    }
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
        content: ''
      }
    }
  },

  watch: {
    grade () {
      if (this.grade) {
        this.$http.get(`/api/course/${this.$route.params.name}/grade/${this.grade}`)
          .then((res) => {
            this.scores = res.data.data
          })
          .catch((err) => {
            console.log(err)
            this.scores = null
          })
      }
    }
  },

  methods: {
    cancel () {
      this.dialog = false
      this.gradeDialog = false
      this.newUsers = []
    },
    submit () {
      var data = {}
      this.items.forEach(student => {
        data[student] = student
      })
      this.newUsers.forEach(student => {
        data[student] = student
      })
      this.$http.put(`/api/course/${this.$route.params.name}`,
        {
          TAs: [],
          studentNicknames: data
        })
        .then(() => {
          this.$router.go(0)
        })
    },
    del (idx) {
      const data = {}
      this.items.forEach((ele, index) => {
        if (index === idx) return
        data[ele.username] = ele.displayName
      })
      this.$http.put(`/api/course/${this.$route.params.name}`,
        {
          TAs: [],
          studentNicknames: data
        })
        .then(() => {
          this.$router.go(0)
        })
    },
    update (grade) {
      this.grade = null
      this.$nextTick(() => {
        this.grade = grade
      })
    },
    scoring () {
      if (this.$refs.form.validate()) {
        this.$http.post(`/api/course/${this.$route.params.name}/grade/${this.grade}`, this.data)
          .then(() => {
            this.gradeDialog = false
            this.$refs.form.reset()
            this.update(this.grade)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    delscore (title) {
      this.$http.delete(`/api/course/${this.$route.params.name}/grade/${this.grade}`, { headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' }, data: { title: title } })
        .then(() => {
          this.update(this.grade)
        })
        .catch((err) => {
          console.log(err)
        })
    }

  }
}
</script>
