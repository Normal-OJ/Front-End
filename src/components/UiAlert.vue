<template>
  <v-alert
    v-model="alert"
    dismissible
    colored-border
    border="left"
    elevation="2"
    style="white-space: pre-line;"
    transition="scroll-y-transition"
    :dense="dense"
    :type="type"
    :icon="icon"
    :color="color"
    :width="width"
  >{{ alertMsg }}</v-alert>
</template>

<script>
export default {

  name: 'UiAlert',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    alertMsg: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info', // info, success, warning, error
    },
    icon: {
      type: String,
      default: undefined,
    },
    color: {
      type: String,
      default: undefined,
    },
    width: {
      type: String,
      default: '100%',
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    value() {
      this.alert = this.value;
    },
    alert() {
      this.$emit('input', this.alert);
    },
  },

  data () {
    return {
      alert: this.value,
    }
  }
}
</script>

<style lang="css" scoped>
</style>