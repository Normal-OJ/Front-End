<template>
  <v-dialog v-model="dialog" :width="width" :persistent="persistent">
    <template v-slot:activator="{}" v-if="this.$slots.activator">
      <slot name="activator">
      </slot>
    </template>
    <v-card>
      <v-toolbar :color="$vuetify.theme.dark ? 'default' : 'primary'" dark dense>
        <slot name="title">
          Title
        </slot>
        <v-spacer></v-spacer>
        <ui-button tile icon color="white" :alert="alert" @alertClick="cancel(true)" @click.native="cancel(false)">
          <template slot="content"><v-icon>mdi-close</v-icon></template>
        </ui-button>
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
        <slot name="actions">
          <v-spacer></v-spacer>
          <slot name="action-cancel">
            <ui-button outlined color="secondary" :alert="alert" @alertClick="cancel(true)" @click.native="cancel(false)">
              <template slot="content">Cancel</template>
            </ui-button>
          </slot>
          <slot name="action-ok">
            <ui-button color="primary" @click.native="ok">
              <template slot="content">Ok</template>
            </ui-button>
          </slot>
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
      default: false
    },
    width: {
      type: String,
      default: '75vw'
    },
    persistent: {
      type: Boolean,
      default: false
    },
    alert: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    value () {
      this.dialog = this.value
    },
    dialog () {
      this.$emit('input', this.dialog)
    }
  },

  data () {
    return {
      dialog: this.value
    }
  },

  methods: {
    cancel (check) {
      if (!this.alert || check) {
        this.$emit('cancel')
        this.dialog = false
      }
    },
    ok () {
      this.dialog = false
    }
  }
}
</script>
