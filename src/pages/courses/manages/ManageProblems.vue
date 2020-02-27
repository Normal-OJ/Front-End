<template>
  <v-container
    fluid
    width="100%"
    height="100%"
  >
    <v-card height="100%" elevation="2" v-if="creating === false">
      <v-card-title class="font-weight-bold">Manage Problems</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-chip v-if="items" label class="ml-3">
        {{ 'Total Problems: ' + items.length }}
      </v-chip>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary">ID</th>
              <th class="font-weight-bold subtitle-1 text--primary">Name</th>
              <th class="font-weight-bold subtitle-1 text--primary">Status</th>
              <th class="font-weight-bold subtitle-1 text--primary">Type</th>
              <th class="font-weight-bold subtitle-1 text--primary">Tags</th>
              <th class="font-weight-bold subtitle-1 text--primary">Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? '#eee' : '#fff' }"
                    @click="toCreate(-1)"
                  >
                    <v-card-title class="subtitle-1"><v-icon color="black">mdi-plus</v-icon>Add Problems</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr v-for="(item, idx) in items" :key="item.problemId">
              <td class="subtitle-1"><a :href="`/problem/${item.problemId}`">{{ item.problemId }}</a></td>
              <td class="subtitle-1"><a :href="`/problem/${item.problemId}`">{{ item.problemName }}</a></td>
              <td class="subtitle-1">{{ item.status }}</td>
              <td class="subtitle-1">{{ item.type }}</td>
              <td class="subtitle-1">
                <v-chip 
                  class="mx-1"
                  v-for="tag in item.tags"
                  :key="tag"
                  label small
                >{{ tag }}</v-chip>
              </td>
              <td>
                <ui-button class="mr-1" color="info" @click.native="edit(idx)">
                  <template slot="content">
                    <v-icon>mdi-pencil</v-icon>Edit
                  </template>
                </ui-button>
                <ui-button class="mr-1" color="error" alert @alertClick="del(idx)">
                  <template slot="content">
                    <v-icon>mdi-delete</v-icon>Delete
                  </template>
                </ui-button>
              </td>
            </tr>
            <tr v-if="items.length===0">
              <td colspan="6">🦄 No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>


    <v-card height="100%" elevation="2" v-else>
      <v-card-title class="font-weight-bold">
        Create Problems
        <v-spacer></v-spacer>
        Preview {{ $vuetify.breakpoint.mdAndUp ? '' : 'at bottom' }}
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-row class="px-4">
        <!-- From -->
        <v-col cols="12" md="6">
          <v-form ref="form" v-model="form">
            <ui-alert
              v-model="errAlert"
              dense
              type="error"
              :alertMsg="errMsg"
            ></ui-alert>
            <v-container fuild>
              <v-row>
                <v-text-field
                  v-model="prob.problemName"
                  label="Name*"
                  counter="64"
                  :rules="[
                    v => !!v || 'Please enter the problem name.',
                    v => !!v && v.length <= 64 || 'Sorry, the length is at most 64 characters.',
                  ]"
                  filled
                ></v-text-field>
              </v-row>
              <v-row>
                <v-col cols="auto" md="6" class="px-0">
                  <v-select
                    v-model="prob.status"
                    label="Status*"
                    :items="[{text: 'Online', value: 0}, {text: 'Offline (hidden)', value: 1}]"
                    filled
                    class="pr-1"
                  ></v-select>
                </v-col>
                <v-col cols="auto" md="6" class="px-0">
                  <v-select
                    v-model="prob.type"
                    label="Type*"
                    :items="[{text: 'Defult (programming)', value: 0}, {text: 'Handwritten', value: 2}]"
                    filled
                    class="pl-1"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-combobox
                  label="Tags(you can create new tag)"
                  v-model="prob.tags"
                  :items="tags"
                  filled
                  chips
                  multiple
                ></v-combobox>
              </v-row>
              <v-row>
                <v-textarea
                  v-model="prob.description.description"
                  label="Description*"
                  rows="2"
                  :rules="[
                    v => !!v || 'Sorry, problem description is required.',
                  ]"
                  auto-grow
                  filled
                ></v-textarea>
              </v-row>
              <v-row v-show="prob.type != 2">
                <v-select
                  v-model="prob.allowedLanguage"
                  label="Allowed Languages"
                  :rules="[v => !!v || 'At least one language should be chosen.']"
                  multiple
                  :items="[{text: 'C', value: 1}, {text: 'C++', value: 2}, {text: 'Python', value: 4}]"
                  filled
                >
                </v-select>
              </v-row>
              <v-row v-show="prob.type != 2">
                <v-textarea
                  v-model="prob.description.input"
                  label="Input"
                  rows="2"
                  auto-grow
                  filled
                  class="pr-1"
                ></v-textarea>
                <v-textarea
                  v-model="prob.description.output"
                  label="Output"
                  rows="2"
                  auto-grow
                  filled
                  class="pl-1"
                ></v-textarea>
              </v-row>
              <v-row class="pb-4" v-show="prob.type != 2">
                <h4 class="my-0">Examples</h4>
                <ui-button color="primary" icon @click.native="editSample(1)">
                  <template slot="content">
                    <v-icon>mdi-plus</v-icon>
                  </template>
                </ui-button>
                <ui-button color="secondary" icon @click.native="editSample(-1)">
                  <template slot="content">
                    <v-icon>mdi-minus</v-icon>
                  </template>
                </ui-button>
              </v-row>
              <v-row v-for="idx in sampleLength" :key="'sample'+idx" v-show="prob.type != 2">
                <v-textarea
                  v-model="prob.description.sampleInput[idx-1]"
                  :label="'Sample Input' + idx"
                  rows="2"
                  auto-grow
                  filled
                  class="pr-1"
                ></v-textarea>
                <v-textarea
                  v-model="prob.description.sampleOutput[idx-1]"
                  :label="'Sample Output' + idx"
                  rows="2"
                  auto-grow
                  filled
                  class="pl-1"
                ></v-textarea>
              </v-row>
              <v-row v-show="prob.type != 2">
                <v-textarea
                  v-model="prob.description.hint"
                  label="Hint"
                  rows="2"
                  auto-grow
                  filled
                ></v-textarea>
              </v-row>
              <v-row v-show="prob.type != 2">
                <h4 class="my-0">Subtask</h4>
                <ui-button color="primary" icon @click.native="editSubtask(1)">
                  <template slot="content">
                    <v-icon>mdi-plus</v-icon>
                  </template>
                </ui-button>
                <ui-button color="secondary" icon @click.native="editSubtask(-1)">
                  <template slot="content">
                    <v-icon>mdi-minus</v-icon>
                  </template>
                </ui-button>
              </v-row>
              <div v-for="idx in subtaskLength" :key="'subtask'+idx" v-show="prob.type != 2">
                <v-row>
                  <h5 class="my-0">{{ 'Subtask' + idx }}</h5>
                </v-row>
                <v-row>
                  <v-text-field
                    v-model="prob.testCaseInfo.tasks[idx-1].caseCount"
                    label="Number of testdata"
                    :rules="[
                      v => !!v || prob.type == 2 || 'Please enter the number of testdata.',
                      v => !!v && v <= 100 || prob.type == 2 || 'The maximum number of testdata is 100.'
                    ]"
                    filled
                    class="pr-1"
                  ></v-text-field>
                  <v-text-field
                    v-model="prob.testCaseInfo.tasks[idx-1].taskScore"
                    label="Score of this subtask"
                    :rules="[v => !!v || prob.type == 2 || 'Please enter the score.']"
                    filled
                    class="pl-1"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field
                    v-model="prob.testCaseInfo.tasks[idx-1].memoryLimit"
                    label="Memory Limit(KB)"
                    :rules="[v => !!v || prob.type == 2 || 'Please enter the memory limit.']"
                    filled
                    class="pr-1"
                  ></v-text-field>
                  <v-text-field
                    v-model="prob.testCaseInfo.tasks[idx-1].timeLimit"
                    label="Time Limit(ms)"
                    :rules="[v => !!v || prob.type == 2 || 'Please enter the time limit.']"
                    filled
                    class="pl-1"
                  ></v-text-field>
                </v-row>
              </div>
              <v-row v-show="prob.type != 2">
                <h4 class="my-0 mr-3">Testdata</h4>
                <ui-dialog v-model="rule">
                  <template slot="activator">
                    <ui-button @click.native="rule = !rule">
                      <template slot="content"><v-icon class="mr-1">mdi-alert-circle-outline</v-icon>How to upload</template>
                    </ui-button>
                  </template>
                  <template slot="title">Rule</template>
                  <template slot="content">
                    Put all your files(testdata) in a single zip.<br>
                    Please follow the Naming rule:<br>
                    Input file: <pre>sstt.in</pre>ss is for what number of subtask, tt is for what number of testdata. <strong>Note that number is beginning from <code>0</code>.</strong><br>
                    Output file: <pre>sstt.out</pre>the rest is same as Input file<br>
                    <br>
                    For example, a problem with <code>3</code> subtasks, and the number of testdata of each subtask is <code>3, 5, 15</code>.<br>
                    The content of zip file is:<br>
                    <pre>0000.in<br>0000.out<br>0001.in<br>0001.out<br>0002.in<br>0002.out<br><br>0100.in<br>0100.out<br>...<br>0104.in<br>0104.out<br><br>0200.in<br>0200.out<br>...<br>0214.in<br>0214.out<br></pre>
                  </template>
                  <template slot="action-cancel"><span></span></template>
                </ui-dialog>
              </v-row>
              <v-row v-show="prob.type != 2">
                <v-file-input v-model="zip" show-size label="Upload Testdata(zip)"></v-file-input>
              </v-row>
              <v-row>
                <v-spacer></v-spacer>
                <ui-button color="secondary" alert @alertClick="creating = false" class="mr-3">
                  <template slot="content">Cancel</template>
                </ui-button>
                <ui-button color="primary" @click.native="submit">
                  <template slot="content">Submit</template>
                </ui-button>
              </v-row>
              <v-row v-show="prob.type != 2">
                <h4 class="my-0 mr-3">Current Testdata</h4>
              </v-row>
              <v-row v-show="prob.type != 2">
                <ui-button v-if="testdata" color="info" @click.native="download">
                  <template slot="content"><v-icon>mdi-download</v-icon></template>
                </ui-button>
                <h5 v-else>No data</h5>
              </v-row>
            </v-container>
          </v-form>
        </v-col>

        <!-- Preview -->
        <v-col cols="12" md="6">
          <v-container>
            <v-card height="100%" elevation="2">
              <v-card-title class="headline font-weight-bold justify-center">
                {{ prob.problemName }}
              </v-card-title>
              <v-divider class="mt-0"></v-divider>
              <v-card-subtitle>
                <v-row class="pl-4">
                  Tags:
                  <v-chip 
                    class="mx-1"
                    v-for="tag in prob.tags"
                    :key="tag"
                    small label
                  ><a href="" target="_blank" rel="noopener noreferrer">{{ tag }}</a></v-chip>
                </v-row>
              </v-card-subtitle>
              <div class="px-6" style="width: 100%" wrap>
                <h2>Problem Description</h2>
                <vue-markdown :source="prob.description.description"></vue-markdown>
                <div v-show="prob.type != 2">
                  <h2>Input</h2>
                  <vue-markdown :source="prob.description.input"></vue-markdown>
                  <h2>Output</h2>
                  <vue-markdown :source="prob.description.output"></vue-markdown>
                  <h2>Examples</h2>
                  <v-row v-for="idx in sampleLength" :key="'preview'+idx">
                    <v-card width="100%" outlined class="mb-1">
                      <v-card-title class="pb-0">
                        Input
                        <ui-button color="grey" icon class="ml-3">
                          <template slot="content"><v-icon>mdi-content-copy</v-icon></template>
                        </ui-button>
                      </v-card-title>
                      <v-card-text><code style="width: 100%;">{{ prob.description.sampleInput[idx-1] }}</code></v-card-text>
                      <v-card-title class="py-0">
                        Output
                        <ui-button color="grey" icon class="ml-3">
                          <template slot="content"><v-icon>mdi-content-copy</v-icon></template>
                        </ui-button>
                      </v-card-title>
                      <v-card-text><code style="width: 100%;">{{ prob.description.sampleOutput[idx-1] }}</code></v-card-text>
                    </v-card>
                  </v-row>
                  <h2>Hint</h2>
                  <vue-markdown :source="prob.description.hint"></vue-markdown>
                </div>
                <br>
              </div>
            </v-card>
          </v-container>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import JSZip from 'jszip';

export default {

  name: 'ManageStudents',

  components: {
    VueMarkdown,
  },

  data () {
    return {
      creating: false,
      items: [],
      errAlert: false,
      errMsg: '',
      tags: [],
      form: true,
      prob: null,
      rule: false,
      zip: null,
      testdata: null,
    }
  },

  computed: {
    sampleLength() {
      if ( this.prob.description.sampleInput )
        return this.prob.description.sampleInput.length;
    },
    subtaskLength() {
      if ( this.prob.testCaseInfo.tasks )
        return this.prob.testCaseInfo.tasks.length;
    },
  },

  watch: {
    zip() {
      var zip = new JSZip();
      zip.file('testdata.zip', this.zip);
      zip.generateAsync({type:"base64"})
        .then((base64) => {
          this.testdata = "data:application/zip;base64," + base64;
        })
        .catch(() => {
          this.testdata = null;
        })
    },
  },

  created() {
    this.init();
    this.getProbs();
  },

  methods: {
    init() {
      this.prob = {
        problemName: '',
        status: 0,
        tags: [],
        type: 0,
        courses: [this.$route.params.name],
        description: {
          description: '',
          input: '',
          output: '',
          sampleInput: [''],
          sampleOutput: [''],
          hint: '',
        },
        testCaseInfo: {
          language: 0,
          fillInTemplate: '',
          tasks: [{
            "caseCount": null,
            "taskScore": null,
            "memoryLimit": 536871,
            "timeLimit": 1000,
          }],
        },
        canViewStdout: false,
        allowedLanguage: [1, 2, 4],
      };
    },
    getProbs() {
      this.items = [];
      this.tags = [];
      this.$http.get('/api/problem?offset=0&count=-1')
        .then((res) => {
          // console.log(res);
          res.data.data.forEach(ele => {
            ele.status = ele.status===0 ? 'Online' : 'Offline';
            ele.type = ele.type===0 ? 'default' : (ele.type===1 ? 'fillInTemplate' : 'handwritten');
            this.items.push(ele);
            ele.tags.forEach(tag => {
              this.tags.push(tag);
            })
          })
          this.tags = [...new Set(this.tags)];
        })
        .catch((err) => {
          // console.log(err);
        })
    },
    submit() {
      if ( this.prob.testCaseInfo ) {
        if ( this.prob.type === 2 ) {
          delete this.prob.testCaseInfo;
        } else {
          this.prob.testCaseInfo.tasks.forEach(ele => {
            ele.caseCount = Number(ele.caseCount);
            ele.taskScore = Number(ele.taskScore);
            ele.memoryLimit = Number(ele.memoryLimit);
            ele.timeLimit = Number(ele.timeLimit);
          });
        }
      }
      if ( this.prob.allowedLanguage ) {
        var temp = 0;
        this.prob.allowedLanguage.forEach(ele => {
          temp += ele;
        });
        this.prob.allowedLanguage = temp;
      }
      if ( this.$refs.form.validate() ) {
        if ( this.creating === -1 ) {
          this.$http.post('/api/problem/manage', this.prob)
            .then((res) => {
              // console.log(res);
              if ( !this.zip ) {
                this.$router.go(0);
              }
              var formData = new FormData();
              formData.append('case', this.zip); 
              if ( this.prob.type !== 2 ) {
               return this.$http.put(`/api/problem/manage/${res.data.data.problemId}`, 
                                    formData,
                                    {
                                      headers: { 'Content-Type' : 'multipart/form-data' }, 
                                    })
              }
            })
            .then((res) => {
              // console.log(res);
              this.$router.go(0);
            })
            .catch((err) => {
              console.log(err);
            })
        } else {
          this.$http.put(`/api/problem/manage/${this.items[this.creating].problemId}`, this.prob)
            .then((res) => {
              if ( !this.zip ) {
                this.$router.go(0);
              }
              var formData = new FormData();
              formData.append('case', this.zip); 
              if ( this.prob.type !== 2 ) {
                return this.$http.put(`/api/problem/manage/${this.items[this.creating].problemId}`, 
                                      formData,
                                      {
                                        headers: { 'Content-Type' : 'multipart/form-data' }, 
                                      })
              }
            })
            .then((res) => {
              this.$router.go(0);
            })
            .catch((err) => {
              console.log(err);
            })
        }
      }
    },
    editSample(val) {
      if ( val > 0 )   {
        this.prob.description.sampleInput.push('');
        this.prob.description.sampleOutput.push('');
      } else if ( this.sampleLength > 1 ) {
        this.prob.description.sampleInput.pop();
        this.prob.description.sampleOutput.pop();
      }
      // this.sampleLength += val;
      // this.sampleLength = Math.max(this.sampleLength, 1);
    },
    editSubtask(val) {
      if ( val > 0 )   {
        this.prob.testCaseInfo.tasks.push({
            "caseCount": null,
            "taskScore": null,
            "memoryLimit": 536871,
            "timeLimit": 1000,
          });
      } else if ( this.subtaskLength > 1 ) {
        this.prob.testCaseInfo.tasks.pop();
      }
      // this.subtaskLength += val; 
      // this.subtaskLength = Math.max(this.subtaskLength, 1);
    },
    toCreate(idx) {
      this.creating = idx;
      if ( idx === -1 ) {
        this.init();
      }
    },
    edit(idx) {
      this.toCreate(idx);
      var zip = new JSZip();
      this.$http.get(`/api/problem/manage/${this.items[idx].problemId}`)
        .then(async(res) => {
          // console.log(res.data.data);
          var data = res.data.data
          console.log(data);
          for (const [key, value] of Object.entries(data)) {
            if ( key === 'testCase' ) {
              this.prob['testCaseInfo'] = value;
            } else if ( key === 'allowedLanguage' ) {
              this.prob[key] = [];
              var temp = value;
              if ( temp >= 4 ) {
                this.prob[key].push(4);
                temp -= 4;
              }
              if ( temp >= 2 ) {
                this.prob[key].push(2);
                temp -= 2;
              }
              if ( temp >= 4 ) {
                this.prob[key].push(4);
                temp -= 4;
              }
              if ( temp >= 1 ) {
                this.prob[key].push(1);
                temp -= 1;
              }
              this.prob[key].reverse();
            } else {
              this.prob[key] = value;
            }
          }
          
          var isFile = false;
          if ( data.testCase ) {
            data.testCase.tasks.forEach((ele, idx) => {
              this.prob.testCaseInfo.tasks[idx]['caseCount'] = ele.input.length;
              ele.input.forEach((file, jdx) => {
                isFile = true;
                zip.file(`${('0'+idx).substr(-2)}${('0'+jdx).substr(-2)}.in`, file);
              })
              ele.output.forEach((file, jdx) => {
                zip.file(`${('0'+idx).substr(-2)}${('0'+jdx).substr(-2)}.out`, file);
              })
              delete this.prob.testCaseInfo.tasks[idx]['input'];
              delete this.prob.testCaseInfo.tasks[idx]['output'];
            })
          }

          console.log(this.prob);
          if ( isFile ) {
            await zip.generateAsync({type:"base64"})
              .then((base64) => {
                this.testdata = "data:application/zip;base64," + base64;
              })
          } else {
            this.testdata = null;
          }
          this.create = true;
        })
        .catch((err) => {
          // console.log(err);
        })
      // this.prob = this.items[idx];
      // this.create = true;
    },
    del(idx) {
      this.$http.delete(`/api/problem/manage/${this.items[idx].problemId}`, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.$router.go(0);
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    download() {
      window.location = this.testdata;
    },
  }
}
</script>

<style lang="css" scoped>
</style>