<template>
	<v-dialog v-model="dialog" :width="width" :persistent="persistent">
    <template v-slot:activator="{ on }">
      <slot name="activator">
        <ui-button color="primary" v-on="on">
          <template v-slot:content>
            <v-icon large>mdi-plus</v-icon>
            activator
          </template>
        </ui-button>
      </slot>
    </template>
    <v-card>
      <v-toolbar color="primary" dark dense>
        <slot name="title">
          title
        </slot>
        <v-spacer></v-spacer>
        <v-btn tile icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <slot name="content">
          <p class="subtitle-1 text--primary">
            content
          </p>
        </slot>
      </v-card-text>
      <v-card-actions>
        <slot name="action">
          <v-spacer></v-spacer>
          <v-btn class="text-none subtitle-1" outlined color="secondary" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn class="text-none subtitle-1" dark color="primary" @click="ok()">
            Ok
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {

  name: 'UiDialog',

  props: {
    width: {
      type: String,
      default: '75vw',
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      dialog: false,
    }
  },

  methods: {
    ok() {
      this.dialog = false;
    },
  }
}
</script>

<style lang="css" scoped>
</style>