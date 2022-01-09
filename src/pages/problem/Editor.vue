<template>
  <v-card tile elevation="0" color="transparent">
    <codemirror
      v-model="code"
      v-if="type !== 2"
      ref="CM"
      :options="cmOption"
      placeholder="paste or upload your code for submitting"
      :style="{ height: '80vh', width: '100%', fontSize: editorConfig.fontSize+'px' }"
    ></codemirror>
    <v-simple-table v-else>
      <thead v-if="type === 2 && submData && submData.length > 0">
        <tr>
          <th>Last update</th>
          <th>Score</th>
          <th>Uploaded File</th>
          <th>Feedback</th>
        </tr>
      </thead>
      <tbody v-if="type === 2 && submData && submData.length > 0">
        <tr>
          <td class="subtitle-1" v-text="submData[0]['Timestamp']"></td>
          <td class="subtitle-1" v-text="submData[0]['Score']===-1 ? 'Pending' : submData[0]['Score']"></td>
          <td>
            <a class="subtitle-1" v-if="submData[0]['Status'] > -1" :href="`/api/submission/${submData[0]['id']}/pdf/upload`" rel="noopener noreferrer" target="_blank"><v-icon color="primary">mdi-file-download</v-icon></a>
          </td>
          <td>
            <a class="subtitle-1" v-if="submData[0]['Score'] > -1" :href="`/api/submission/${submData[0]['id']}/pdf/comment`" rel="noopener noreferrer" target="_blank"><v-icon color="primary">mdi-file-download</v-icon></a>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <div class="px-4" style="height: 15%; width: 100%;">
      <v-form ref="form">
        <v-row>
          <ui-alert v-if="type === 2" v-model="alert" dense type="error" :alertMsg="errMsg"></ui-alert>
          <v-col :cols="type !== 2 ? 4 : 6">
            <v-file-input
              prepend-icon="mdi-upload"
              show-size
              ref="file"
              v-model="file"
              :rules="[v => type!==2 || !!v || 'Please upload your pdf.']"
              label="Upload File"
            ></v-file-input>
          </v-col>
          <v-spacer v-if="type !== 2"></v-spacer>
          <v-col cols="4" v-if="type !== 2">
            <v-select
              :rules="[v => type===2 || (0 <= v && v <= 2) || 'Please select programming language.']"
              label="Select Language"
              v-model="editorConfig.language"
              :items="languageItem"
              @change="modifyConfig"
            ></v-select>
          </v-col>
          <v-spacer v-if="type !== 2"></v-spacer>
          <v-col cols="auto" align-self="center">
            <ui-button color="primary" :loading="loading" @click.native="submit">
              <template slot="content">Submit</template>
            </ui-button>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-card>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import './EditorConfig.js'
import JSZip from 'jszip'

const LANG = ['text/x-csrc', 'text/x-c++src', { name: 'python', version: 3 }]
const LANG_EXT = ['.c', '.cpp', '.py']

export default {
  name: 'Editor',
  components: {
    codemirror
  },
  props: {
    type: {
      type: Number,
      required: true
    },
    languageItem: {
      type: Array,
      required: true
    },
    submData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      editorConfig: null,
      code: '',
      file: null,
      cmOption: {
        autoCloseBrackets: true,
        indentUnit: 4,
        styleActiveLine: true,
        line: true,
        lineNumbers: true,
        keyMap: 'sublime',
        mode: '',
        theme: '',
        tabSize: 4,
        indentWithTabs: true,
        extraKeys: {
          Tab: function (cm) {
            if (!cm.getOption('indentWithTabs')) {
              var spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
              cm.replaceSelection(spaces)
            } else {
              cm.replaceSelection('\t')
            }
          }
        }
      },
      loading: false,
      alert: false,
      errMsg: ''
    }
  },
  watch: {
    file () {
      if (this.type !== 2 && this.file) {
        const reader = new FileReader()
        reader.readAsText(this.file)
        reader.onload = e => (this.code = e.target.result)
      }
    }
  },
  beforeMount () {
    this.setConfig()
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        var zip = new JSZip()
        // handwritten problem
        if (this.type === 2) {
          zip.file(`main.${this.file.name.split('.').pop()}`, this.file)
          this.editorConfig.language = 3
        } else {
          zip.file(`main${LANG_EXT[this.editorConfig.language]}`, this.code)
        }
        // generate zip file
        var code = await zip.generateAsync({ type: 'blob' })
        // setup form data
        var formData = new FormData()
        formData.append('code', code)
        try {
          // create submission
          const res = await this.$agent.Submission.create({
            problemId: Number(this.$route.params.id),
            languageType: Number(this.editorConfig.language)
          })
          const submissionId = res.data.data.submissionId
          // upload source code
          await this.$agent.Submission.modify(submissionId, formData)
          this.$refs.file.reset()
          this.alert = false
          this.loading = false
          this.$emit('getSubmission', submissionId)
        } catch (err) {
          this.errMsg = err.response.data.message
          this.loading = false
          // alert dialog
          this.$emit('exceedRateLimit', this.errMsg)
        }
      }
    },
    setConfig () {
      this.editorConfig = {
        fontSize: 16,
        indentType: 1,
        tabSize: 4,
        theme: 'monokai',
        language: this.languageItem.length === 1 ? this.languageItem[0].value : -1 // 0: c, 1: cpp, 2: py
      }
      this.code = ''
      this.updateOption()
    },
    modifyConfig () {
      this.updateOption()
    },
    updateOption () {
      this.cmOption.indentWithTabs = this.editorConfig.indentType
      this.cmOption.tabSize = this.editorConfig.tabSize
      this.cmOption.indentUnit = this.editorConfig.tabSize
      this.cmOption.theme = this.editorConfig.theme
      this.cmOption.mode = LANG[this.editorConfig.language]
    }
  }
}
</script>

<style lang="css">
.CodeMirror {
  font-family: "Monaco";
  height: 100%;
  width: 100%;
  direction: ltr;
}
.CodeMirror-placeholder {
  color: grey !important;
}
</style>
