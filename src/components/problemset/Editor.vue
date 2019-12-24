<template>
  <div>
    <v-card>
      <v-card-title class="row">
        Tool bar
      </v-card-title>
    </v-card>
    <codemirror v-model="code" :options="cmOption"></codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css'
// language
import 'codemirror/mode/python/python.js'
// theme css
import 'codemirror/theme/monokai.css'
// require active-line.js
import 'codemirror/addon/selection/active-line.js'
// closebrackets
import 'codemirror/addon/edit/closebrackets.js'
// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'

export default {
  name: 'Editor',
  data () {
    return {
      code: 'print([int(i) for i in range(0,5) if i >= 0])',
      cmOption: {
        autoCloseBrackets: true,
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/x-python',
        theme: 'monokai',
        keyMap: 'sublime'
      }
    }
  },
  components: {
    codemirror
  },
  methods: {
    
  }
}
</script>

<style lang="css" scoped>
</style>