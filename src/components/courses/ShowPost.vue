<template>
  <div>
    <v-row v-for="(item, idx) in items" :key="idx" justify="center">
      <ui-post
        :markdown="content ? item.content : null"
        :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'"
        :author="item.author.username"
        :createdTime="item.createdTime"
        :title="item.title"
        :menu="menu"
        :readmore="readmore"
        @edit="$emit('edit', idx, item.postId)"
        @delete="$emit('delete', idx, item.postId)"
      >
        <template slot="action">
          <ui-button v-if="readmore" text :to="`${readmore}/${item.postId}`" class="mt-3">
            <template slot="content">
              <v-icon class="mr-1">mdi-page-next</v-icon><u>Enter Discussion Area</u>
              <!-- <v-icon>mdi-open-in-new</v-icon>Read More -->
            </template>
          </ui-button>
          <div></div>
        </template>
      </ui-post>
    </v-row>
    <v-row v-show="!items">
      <v-skeleton-loader
        class="mx-auto"
        type="image"
        :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'"
      ></v-skeleton-loader>
    </v-row>
    <v-row v-if="items && items.length === 0" justify="center">
      <h3>🦄 There's no discussion yet.</h3>
    </v-row>
  </div>
</template>

<script>
export default {

  name: 'ShowPost',

  props: {
    items: {
      type: Array,
      required: true
    },
    width: {
      type: String,
      default: '50vw'
    },
    menu: {
      type: Boolean,
      default: false
    },
    readmore: {
      type: String,
      default: null
    },
    content: {
      type: Boolean,
      default: true
    }
  }
}
</script>
