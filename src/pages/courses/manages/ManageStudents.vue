<template>
  <v-container
    fluid
    width="100%"
    height="100%"
  >
    <v-card height="100%" elevation="2" v-if="!grade">
      <v-card-title class="font-weight-bold">Manage Students</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <div class="d-flex">
        <v-chip v-if="items" label class="ml-3">
          {{ 'Total Students: ' + items.length }}
        </v-chip>
        <v-spacer />
        <ui-button
          class="mx-3"
          color="secondary"
          @click.native="batchSignupDialog = true"
        >
          <template slot="content">batch signup</template>
        </ui-button>
        <ui-dialog v-model="batchSignupDialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"
          @cancel="cancel"
        >
          <template slot="title">Batch Signup</template>
          <template slot="body">
            <v-card-text>
              <div>CSV headers: <code>username</code>, <code>email</code>, <code>password</code>,  <code>displayedName</code> (optional), <code>role</code> (optional)</div>
              <v-file-input v-model="csvFile" label="CSV File" accept=".csv" />
              <div v-if="csvString != null">預覽</div>
              <v-simple-table class="mt-4" v-if="csvString != null">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th v-for="h in csvHeaders" :key="h">{{ h }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(b, index) in csvBodies" :key="index">
                      <td v-for="h in csvHeaders" :key="`${h}-${index}`">
                        {{ b[h] }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <ui-alert
                v-model="errAlert"
                dense
                type="error"
                :alertMsg="errMsg"
              ></ui-alert>
            </v-card-text>
          </template>
          <template slot="action-cancel">
            <v-btn outlined color="secondary" :loading="batchSignupLoading" @click.native="cancel">Cancel</v-btn>
          </template>
          <template slot="action-ok">
            <v-btn class="ml-3" color="primary" :disabled="!csvString" :loading="batchSignupLoading" @click.native="submitBatchSignup">
              Submit
            </v-btn>
          </template>
        </ui-dialog>
      </div>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th>Username</th>
              <th>Display Name</th>
              <th>Role</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? 'var(--v-gray)' : 'var(--v-white)' }"
                    @click="dialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon>mdi-plus</v-icon>Add Students</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr v-for="(item, idx) in items" :key="item.title">
              <td class="subtitle-1">{{ item.username }}</td>
              <td class="subtitle-1">{{ item.displayedName }}</td>
              <td class="subtitle-1">Student</td>
              <td class="subtitle-1">
                <ui-button class="mr-1" small color="info" @click.native="grade = item.username">
                  <template slot="content">
                    <v-icon small>mdi-chart-bar</v-icon>
                  </template>
                </ui-button>
                <ui-button class="mr-1" small color="error" alert @alertClick="del(idx)">
                  <template slot="content">
                    <v-icon small>mdi-account-remove</v-icon>
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
              <th>Title</th>
              <th>Score</th>
              <th>Description</th>
              <th>Time</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? 'var(--v-gray)' : 'var(--v-white)' }"
                    @click="gradeDialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon>mdi-plus</v-icon>Add Score</v-card-title>
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
import Papa from 'papaparse'

export default {

  name: 'ManageStudents',

  props: {
    // Array of students' user object
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
      batchSignupDialog: false,
      data: {
        title: '',
        newtitle: '',
        score: '',
        content: ''
      },
      csvFile: null,
      csvString: null,
      csvHeaders: '',
      csvBodies: '',
      batchSignupLoading: false,
    }
  },

  watch: {
    grade () {
      if (this.grade) {
        this.$agent.Course.getGrade(this.$route.params.name, this.grade)
          .then((res) => {
            this.scores = res.data.data
          })
          .catch((err) => {
            console.log(err)
            this.scores = null
          })
      }
    },
    csvFile () {
      this.csvString = null
      if (this.csvFile) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          this.csvString = evt.target.result;
          Papa.parse(this.csvString, {
              header: true,
              complete: (results) => {
                this.csvHeaders = results.meta.fields
                this.csvBodies = results.data.slice(0, 10)
                console.log(this.csvHeaders, this.csvBodies)
              },
              error: (errors) => {
                this.csvString = null
                this.errMsg = errors
                this.errAlert = true
              },
            })
        };
        reader.readAsText(this.csvFile);
      }
    },
  },

  methods: {
    submitBatchSignup () {
      const body = { newUsers: this.csvString, course: this.$route.params.name }
      this.batchSignupLoading = true
      this.$agent.Auth.batchSignup(body)
        .then(() => {
          this.$router.go(0)
        })
        .catch((err) => {
          this.errMsg = err
          this.errAlert = true
        })
        .finally(() => {
          this.batchSignupLoading = false
        })
    },
    cancel () {
      this.dialog = false
      this.gradeDialog = false
      this.batchSignupDialog = false
      this.newUsers = []
    },
    submit () {
      const data = {}
      this.items.forEach(({ username, displayedName }) => {
        data[username] = displayedName
      })
      this.newUsers.forEach(student => {
        data[student] = student
      })
      this.$agent.Course.modify(this.$route.params.name, {
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
        data[ele.username] = ele.displayedName
      })
      this.$agent.Course.modify(this.$route.params.name, {
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
        this.$agent.Course.createGrade(this.$route.params.name, this.grade, this.data)
          .then(() => {
            this.gradeDialog = false
            this.$refs.form.reset()
            this.update(this.grade)
          })
      }
    },
    delscore (title) {
      this.$agent.Course.deleteGrade(this.$route.params.name, this.grade, { title: title })
        .then(() => {
          this.update(this.grade)
        })
    }
  }
}
</script>
