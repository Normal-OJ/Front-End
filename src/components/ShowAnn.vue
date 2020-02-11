<template>
  <div>
    <v-row v-for="(item, idx) in items" :key="idx" justify="center">
      <ui-post
        :markdown="item.content"
        :readmore="readmore ? `${readmore}/${item.annId}` : null"
        :mask="mask"
        :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'"
        :author="item.author.username"
        :createdTime="item.createdTime"
        :updater="updateInfo ? item.lastUpdater.username : null"
        :updatedTime="updateInfo ? item.lastUpdatedTime : null"
        :title="item.title"
        :menu="menu"
        @edit="$emit('edit', idx, item.annId)"
        @delete="$emit('delete', idx, item.annId)"
      ></ui-post>
    </v-row>
    <v-row v-if="!items || items.length===0" justify="center">
      <h3>🦄 There's no announcement yet.</h3>
    </v-row>
  </div>
</template>

<script>
export default {

  name: 'ShowAnn',

  props: {
    items: {
      type: Array,
      required: true,
    },
    course: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '50vw'
    },
    updateInfo: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: Boolean,
      default: false,
    },
    readmore: {
      type: String,
      default: null,
    },
    mask: {
      type: Boolean,
      default: false,
    }
  },

  data () {
    return {
    }
  },

}
</script>

<style lang="css" scoped>
</style>