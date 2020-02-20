<template>
  <v-btn
    class="text-none"
    style="font-size: 1rem"
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
    color: {
      type: String,
      default: 'primary',
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

    }
  }
}
</script>

<style lang="css">
.v-btn {
  letter-spacing: 0;
  text-indent: 0;
}
</style>