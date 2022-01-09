<template>
  <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'" persistent @cancel="$emit('cancel')" alert>
    <template slot="activator">
      <v-card
        v-if="!noActivator"
        class="my-3 mx-auto"
        :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'"
        elevation="2"
        :style="{ cursor: 'pointer' }"
        @click="dialog = true"
      >
        <v-card-title class="title">
          <v-icon large>mdi-plus</v-icon>{{ type + ' ' + title }}
        </v-card-title>
      </v-card><span v-else></span>
    </template>
    <template slot="title">{{ type + ' ' + title }}</template>
    <template slot="body">
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
    </template>
    <template slot="action-cancel">
      <ui-button outlined color="secondary" alert @alertClick="$emit('cancel')">
        <template slot="content">Cancel</template>
      </ui-button>
    </template>
    <template slot="action-ok">
      <ui-button color="primary" @click.native="$emit('post')">
        <template slot="content">Submit</template>
      </ui-button>
    </template>
  </ui-dialog>
</template>

<script>
export default {

  name: 'Creator',

  props: {
    value: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    noActivator: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      dialog: false
    }
  },

  watch: {
    value () {
      this.dialog = this.value
    },
    dialog () {
      this.$emit('input', this.dialog)
    }
  }

}
</script>
