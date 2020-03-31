<template>
  <v-card tile elevation="0" color="transparent">
    <!-- <v-row class="px-6" style="height: 10%;">
      <v-col v-for="(item, key, idx) in editorConfig" :key="idx" :cols="selectItem.width[idx]">
        <v-select
          :label="selectItem.title[key]"
          v-model="editorConfig[key]"
          :items="selectItem[key+'Item']"
          @change="modifyConfig"
        ></v-select>
      </v-col>
    </v-row>-->
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
          <th class="subtitle-1 font-weight-bold">Last update</th>
          <th class="subtitle-1 font-weight-bold">Score</th>
          <th class="subtitle-1 font-weight-bold">Uploaded File</th>
          <th class="subtitle-1 font-weight-bold">Feedback</th>
        </tr>
      </thead>
      <tbody v-if="type === 2 && submData && submData.length > 0">
        <tr>
          <td class="subtitle-1" v-text="submData[0]['Timestamp']"></td>
          <td class="subtitle-1" v-text="submData[0]['Score']===-1 ? 'Pending' : submData[0]['Score']"></td>
          <!-- {{submData[0]['Status']}} -->
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
import { codemirror } from 'vue-codemirror';
import './EditorConfig.js';
import JSZip from 'jszip';

var LANG = ['text/x-csrc', 'text/x-c++src', { name: "python", version: 3 }];
var LANG_EXT = ['.c', '.cpp', '.py'];
// var FONT_SIZE = [], THEME_ITEM = ['default', 'monokai', 'dracula', 'base16-dark', 'base16-light', 'eclipse', 'material'], THEME = [];
// for ( var i=8; i<=28; ++i ) FONT_SIZE.push({ 'text': `${i}`, 'value': i });
// THEME_ITEM.forEach((theme) => {THEME.push({ 'text': theme, 'value': theme })});

export default {
  name: 'Editor',
  components: {
    codemirror
  },
  props: {
    type: {
      type: Number,
      required: true,
    },
    languageItem: {
      type: Array,
      required: true,
    },
    submData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      editorConfig: null,
      // selectItem: {
      // title: {
      //   'fontSize': 'Font Size',
      //   'theme': 'Theme',
      //   'language': 'Language',
      //   'indentType': 'Indent',
      //   'tabSize': 'Indent Width',
      // },
      // width: ['2', '2', '2', '3', '3'],
      // fontSizeItem: FONT_SIZE,
      // themeItem: THEME,
      // languageItem: [
      //   { 'text': 'C (c11)', 'value': 0 },
      //   { 'text': 'C++ (c++11)', 'value': 1 },
      //   { 'text': 'Python (python3)', 'value': 2 },
      // ],
      // indentTypeItem: [
      //   { 'text': 'space', 'value': 0 },
      //   { 'text': 'tab', 'value': 1 },
      // ],
      // tabSizeItem: [
      //   { 'text': '2', 'value': 2 },
      //   { 'text': '4', 'value': 4 },
      //   { 'text': '8', 'value': 8 },
      // ],
      // },
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
            if (!cm.getOption("indentWithTabs")) {
              var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
              cm.replaceSelection(spaces);
            } else {
              cm.replaceSelection('\t');
            }
          }
        },
      },
      loading: false,
      alert: false,
      errMsg: '',
    }
  },
  watch: {
    file() {
      // console.log(this.file);
      if (this.type !== 2 && this.file) {
        const reader = new FileReader()
        reader.readAsText(this.file)
        reader.onload = e => this.code = e.target.result;
      }
    },
  },
  // created() {
  // document.addEventListener('beforeunload', this.setCode);
  // },
  beforeMount() {
    this.setConfig();
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        var zip = new JSZip();
        // handwritten problem
        if ( this.type===2 ) {
          zip.file(`main.${this.file.name.split('.').pop()}`, this.file);
          this.editorConfig.language = 3;
        } else {
          zip.file(`main${LANG_EXT[this.editorConfig.language]}`, this.code);
        }
        // generate zip file
        var code = await zip.generateAsync({ type: "blob" });
        // setup form data
        var formData = new FormData(), submId;
        formData.append('code', code);
        try {
          // create submission
          let res = await this.$http.post(
            '/api/submission',
            {
              problemId: Number(this.$route.params.id),
              languageType: Number(this.editorConfig.language),
            })
          let submissionId = res.data.data.submissionId
          // upload source code
          await this.$http.put(
            `/api/submission/${submissionId}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
          this.$refs.file.reset();
          this.alert = false;
          this.loading = false;
          this.$emit('getSubmission', submissionId);
          // console.log(res);
          // console.log('submissionId:'+ submissionId);
        } catch (err) {
          this.errMsg = err.response.data.message;
          // this.alert = true;
          this.loading = false;
          // alert dialog
          this.$emit('exceedRateLimit', this.errMsg);
          // console.log(err);
          // console.log(this.errMsg);
        }
      }
    },
    setConfig() {
      // if ( this.$cookies.isKey('jwt') ) {
      //   var payload = this.parseJwt(this.$cookies.get('jwt'));
      //   if ( payload.active === true ) {
      //     // console.log(payload.editorConfig);
      //     this.editorConfig = payload.editorConfig;
      //     if ( !this.editorConfig ) {
      this.editorConfig = {
        'fontSize': 16,
        'indentType': 1, // 0: space, 1: tab
        'tabSize': 4,
        'theme': 'monokai',
        'language': -1, // 0: c, 1: cpp, 2: py
      }
      // }
      // console.log(this.editorConfig);
      this.code = '';
      // this.code = '// you can paste or upload your code for submitting';
      // this.code = this.getCode(this.editorConfig.language);
      this.updateOption();
      //   }
      // }
    },
    modifyConfig() {
      // this.$http.put('/api/profile/config', this.editorConfig)
      //   .then((res) => {
      //     // console.log(res);
      //   })
      //   .catch((err) => {
      //     // console.log(err);
      //   })
      this.updateOption();
    },
    updateOption() {
      this.cmOption.indentWithTabs = this.editorConfig.indentType;
      this.cmOption.tabSize = this.editorConfig.tabSize;
      this.cmOption.indentUnit = this.editorConfig.tabSize;
      this.cmOption.theme = this.editorConfig.theme;
      // this.code = this.setCode(LANG.indexOf(this.cmOption.mode));
      this.cmOption.mode = LANG[this.editorConfig.language];
      // this.code = this.getCode(this.editorConfig.language);
    },
    // setCode(lang) {
    //   this.$cookies.set(`code-${this.$route.param}-${lang}`, this.code);
    // },
    // getCode(lang) {
    //   if ( this.$cookies.isKey(`code-${this.$route.params.id}-${lang}`) ) {
    //     return this.$cookies.get(`code-${this.$route.params.id}-${lang}`);
    //   } else {
    //     this.$cookies.set(`code-${this.$route.params.id}-${lang}`, DEFAULT_CODE[lang]);
    //     return DEFAULT_CODE[lang];
    //   }
    // },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
  }
}
</script>

<style lang="css">
@font-face {
  font-family: "Monako";
  src: url("/monaco.ttf") format("truetype");
}
.CodeMirror {
  font-family: "Monako";
  height: 100%;
  width: 100%;
  direction: ltr;
}
.CodeMirror-placeholder {
  color: grey !important;
}
</style>