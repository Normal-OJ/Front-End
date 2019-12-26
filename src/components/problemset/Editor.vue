<template>
  <v-card tile outlined elevation="0" height="100%" style="position: fixed;">
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
      :style="{ height: '75%', fontSize: editorConfig.fontSize+'px' }"
    ></codemirror>
    <v-row class="pa-3" style="height: 15%;">
      <v-spacer></v-spacer>
      <v-btn
        class="text-none headline"
        color="primary"
        large
      ><v-icon>mdi-send</v-icon>Submit</v-btn>
      <v-spacer></v-spacer>
    </v-row>
  </v-card>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css'
// language
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/clike/clike.js'
// theme css
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/theme/material.css'
// require active-line.js
import 'codemirror/addon/selection/active-line.js'
// closebrackets
import 'codemirror/addon/edit/closebrackets.js'
// scrollbars
import 'codemirror/addon/scroll/simplescrollbars.js'
// keyMap
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'

var LANG = ['text/x-csrc', 'text/x-c++src', {name: "python", version: 3}];
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
      code: 'print([int(i) for i in range(0,5) if i >= 0])\nprintf("%d", n);\ncout << n << endl;',
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
            console.log()
            if ( !cm.getOption("indentWithTabs") ) {
              console.log(cm.getOption("indentUnit"));
              var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
              cm.replaceSelection(spaces);
            }
          }
        },
      },
    }
  },
  beforeMount () {
    this.setConfig();
  },
  methods: {
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
      this.cmOption.mode = LANG[this.editorConfig.language];
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
  width: 50vw;
  direction: ltr;
}
</style>