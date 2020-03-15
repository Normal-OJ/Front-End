<template>
  <v-btn
    v-if="alert"
    class="text-none"
    :style="{ fontSize: fontSizeByProps }"
    :block="block"
    :tile="tile"
    :icon="icon"
    :color="color"
    :text="text"
    :outlined="outlined"
    :loading="loading"
    :x-large="xLarge"
    :large="large"
    :small="small"
    :x-small="xSmall"
    @click.native="dialog = true"
  >
    <slot name="content">
      <v-icon>mdi-lock</v-icon>
      content
    </slot>
    <v-dialog
      v-model="dialog"
      :width="$vuetify.breakpoint.mdAndUp ? '30vw' : '75vw'"
    >
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text class="text-center text--primary">
          <v-icon color="warning" size="5rem">mdi-alert-circle-outline</v-icon>
          <p class="display-1">Are you sure?</p>
          <p class="title">You won't be able to recover this!</p>
        </v-card-text>
        <v-card-actions class="pb-12">
          <v-spacer></v-spacer>
          <ui-button class="mx-3" large color="primary" @click.native="$emit('alertClick'); dialog = false">
            <template slot="content">Yes</template>
          </ui-button>
          <ui-button class="mx-3" large color="secondary" @click.native="dialog = false">
            <template slot="content">No</template>
          </ui-button>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
  <v-btn
    v-else
    class="text-none"
    :style="{ fontSize: fontSizeByProps }"
    :tile="tile"
    :block="block"
    :icon="icon"
    :color="color"
    :text="text"
    :outlined="outlined"
    :to="to"
    :loading="loading"
    :x-large="xLarge"
    :large="large"
    :small="small"
    :x-small="xSmall"
  >
    <slot name="content">
      <v-icon>mdi-lock</v-icon>
      content
    </slot>
  </v-btn>
</template>

<script>
export default {

  name: 'UiButton',

  props: {
    alert: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary',
    },
    tile: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    xLarge: {
      type: Boolean,
      default: false,
    },
    xSmall: {
      type: Boolean,
      default: false,
    }, 
  },

  data () {
    return {
      dialog: false,
    }
  },

  computed: {
    fontSizeByProps() {
      if ( this.xLarge )  return '2rem';
      if ( this.large )  return '1.5rem';
      if ( this.small )  return '0.85rem';
      if ( this.xSmall )  return '0.65rem';
      return '1rem';
    },
  },
}
</script>

<style lang="css">
.v-btn {
  letter-spacing: 0;
  text-indent: 0;
}
</style>