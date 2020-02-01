<template>
	<v-dialog v-model="dialog" :width="width" :persistent="persistent">
    <template v-slot:activator="{ on: { click } }">
      <slot name="activator">
        <ui-button @click.native="click">
          <template v-slot:content>
            <v-icon>mdi-plus</v-icon>
            Activator
          </template>
        </ui-button>
      </slot>
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
        <slot name="body">
          <p class="subtitle-1 text--primary">
            <slot name="content">
              Content
            </slot>
          </p>
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="action-cancel">
          <ui-button outlined color="primary" @click.native="dialog = false">
            <template slot="content">Cancel</template>
          </ui-button>
        </slot>
        <slot name="action-ok">
          <ui-button color="primary" @click.native="ok()">
            <template slot="content">Ok</template>
          </ui-button>
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