<template>
  <v-card tile outlined elevation="0" height="100%" width="50%" style="position: fixed;">
    <v-row class="px-6" style="height: 10%;">
      <v-col v-for="(item, key, idx) in editorConfig" :key="idx" :cols="selectItem.width[idx]">
        <v-select
          :label="selectItem.title[key]"
          v-model="editorConfig[key]"
          :items="selectItem[key+'Item']"
          @change="modifyConfig"
        ></v-select>
      </v-col>
    </v-row>
    <codemirror
      v-model="code"
      v-if="show"
      ref="CM"
      :options="cmOption"
      :style="{ height: '75%', width: '100%', fontSize: editorConfig.fontSize+'px' }"  
    ></codemirror>
    <v-row class="pa-3" style="height: 15%;">
      <v-spacer></v-spacer>
      <v-btn
        class="text-none headline"
        color="primary"
        large
        @click="submit"
      ><v-icon>mdi-send</v-icon>Submit</v-btn>
      <v-spacer></v-spacer>
    </v-row>
  </v-card>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import './EditorConfig.js';
import JSZip from 'jszip';

var LANG = ['text/x-csrc', 'text/x-c++src', {name: "python", version: 3}];
var LANG_EXT = ['.c', '.cpp', '.py'];
var DEFAULT_CODE = [
  '#include<stdio.h>\n\nint main() {\n\n\n\treturn 0;\n}',
  '#include<iostream>\nusing namespace std;\n\nint main() {\n\n\n\treturn 0;\n}',
  ''
];
var FONT_SIZE = [], THEME_ITEM = ['default', 'monokai', 'dracula', 'base16-dark', 'base16-light', 'eclipse', 'material'], THEME = [];
for ( var i=8; i<=28; ++i ) FONT_SIZE.push({ 'text': `${i}`, 'value': i });
THEME_ITEM.forEach((theme) => {THEME.push({ 'text': theme, 'value': theme })});

export default {
  name: 'Editor',
  components: {
    codemirror
  },
  data () {
    return {
      show: true,
      editorConfig: null,
      selectItem: {
        title: {
          'fontSize': 'Font Size',
          'theme': 'Theme',
          'language': 'Language',
          'indentType': 'Indent',
          'tabSize': 'Indent Width',
        },
        width: ['2', '2', '2', '3', '3'],
        fontSizeItem: FONT_SIZE,
        themeItem: THEME,
        languageItem: [
          { 'text': 'C (c11)', 'value': 0 },
          { 'text': 'C++ (c++11)', 'value': 1 },
          { 'text': 'Python (python3)', 'value': 2 },
        ],
        indentTypeItem: [
          { 'text': 'space', 'value': 0 },
          { 'text': 'tab', 'value': 1 },
        ],
        tabSizeItem: [
          { 'text': '2', 'value': 2 },
          { 'text': '4', 'value': 4 },
          { 'text': '8', 'value': 8 },
        ],
      },
      code: '',
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
          Tab: function(cm) {
            if ( !cm.getOption("indentWithTabs") ) {
              var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
              cm.replaceSelection(spaces);
            } else {
              cm.replaceSelection('\t');
            }
          }
        },
      },
    }
  },
  created() {
    document.addEventListener('beforeunload', this.setCode);
  },
  beforeMount () {
    this.setConfig();
  },
  methods: {
    async submit() {
      this.setCode(this.editorConfig.language);
      var zip = new JSZip();
      zip.file(`main${LANG_EXT[this.editorConfig.language]}`, this.code);
      var code = await zip.generateAsync({type:"blob"});
      var formData = new FormData();
      formData.append( 'code', code ); 
      this.$http.post('/api/submission', {problemId: this.$route.params.id, languageType: this.editorConfig.language})
        .then((res) => {
          console.log(res);
          var submissionId = res.data.data.submissionId;
          this.$http.put(`/api/submission/${res.data.data.submissionId}?token=${res.data.data.token}`, 
            formData,
            {
              headers: {'Content-Type':'multipart/form-data'}, 
            })
            .then((res) => {
              console.log(res);
              console.log('submissionId:'+ submissionId);
              this.$emit('getSubmission');
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setConfig() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === true ) {
          console.log(payload.editorConfig);
          this.editorConfig = payload.editorConfig;
          if ( !this.editorConfig ) {
            this.editorConfig = {
              'fontSize': 14,
              'indentType': 1, // 0: space, 1: tab
              'tabSize': 4,
              'theme': 'default',
              'language': 0, // 0: c, 1: cpp, 2: py
            }
          }
          this.code = this.getCode(this.editorConfig.language);
          this.updateOption();
        }
      }
    },
    modifyConfig() {
      this.$http.put('/api/profile/config', this.editorConfig)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
      this.updateOption();
    },
    updateOption() {
      this.cmOption.indentWithTabs = this.editorConfig.indentType;
      this.cmOption.tabSize = this.editorConfig.tabSize;
      this.cmOption.indentUnit = this.editorConfig.tabSize;
      this.cmOption.theme = this.editorConfig.theme;
      this.code = this.setCode(LANG.indexOf(this.cmOption.mode));
      this.cmOption.mode = LANG[this.editorConfig.language];
      this.code = this.getCode(this.editorConfig.language);
    },
    setCode(lang) {
      this.$cookies.set(`code-${this.$route.param}-${lang}`, this.code);
    },
    getCode(lang) {
      if ( this.$cookies.isKey(`code-${this.$route.params.id}-${lang}`) ) {
        return this.$cookies.get(`code-${this.$route.params.id}-${lang}`);
      } else {
        this.$cookies.set(`code-${this.$route.params.id}-${lang}`, DEFAULT_CODE[lang]);
        return DEFAULT_CODE[lang];
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
  }
}
</script>

<style lang="css">
@font-face {
  font-family: 'Monako';
  src: url("/monaco.ttf") format("truetype");
}
.CodeMirror {
  font-family: 'Monako';
  height: 100%;
  width: 100%;
  direction: ltr;
}
</style>