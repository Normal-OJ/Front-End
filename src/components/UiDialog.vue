<template>
	<v-dialog v-model="dialog" :width="width" :persistent="persistent">
    <template v-slot:activator="{ on: { click } }">
      <ui-button @click.native="click">
        <template v-slot:content>
          <slot name="activator">
            <v-icon large>mdi-plus</v-icon>
            Activator
          </slot>
        </template>
      </ui-button>
    </template>
    <v-card>
      <v-toolbar color="primary" dark dense>
        <slot name="title">
          Title
        </slot>
        <v-spacer></v-spacer>
        <v-btn tile icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <slot name="content">
          <p class="subtitle-1 text--primary">
            Content
          </p>
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="action-cancel">
          <v-btn class="text-none subtitle-1" outlined color="secondary" @click="dialog = false">
            Cancel
          </v-btn>
        </slot>
        <slot name="action-ok">
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
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '75vw',
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    value() {
      this.dialog = this.value;
    },
    dialog() {
      this.$emit('input', this.dialog);
    },
  },

  data () {
    return {
      dialog: this.value,
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