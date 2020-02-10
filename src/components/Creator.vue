<template>
  <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'" persistent @cancel="$emit('cancel')">
    <template slot="activator">
      <v-hover v-slot:default="{ hover }">
        <v-card v-if="!noActivator" class="my-3 mx-auto" width="50vw" elevation="2"
          :style="{ cursor: 'pointer', backgroundColor: hover ? '#eee' : '#fff' }"
          @click="dialog = true"
        >
          <v-card-title class="title">
            <v-icon large color="black">mdi-plus</v-icon>{{ type + ' ' + title }}
          </v-card-title>
        </v-card><span v-else></span>
      </v-hover>
    </template>
    <template slot="title">{{ type + ' ' + title }}</template>
    <template slot="body">
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
    </template>
    <template slot="action-cancel">
      <ui-button outlined color="secondary" @click.native="$emit('cancel')">
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
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    noActivator: {
      type: Boolean,
      default: false,
    }
  },

  data () {
    return {
      dialog: false,
    }
  },

  watch: {
    value() {
      this.dialog = this.value;
    },
    dialog() {
      this.$emit('input', this.dialog);
    },
  }

}
</script>

<style lang="css" scoped>
</style>