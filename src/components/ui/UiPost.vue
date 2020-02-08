<template>
  <v-card
    class="my-3 mx-auto flex-column d-flex"
    :elevation="elevation"
    :width="width"
    :height="height"
  >
    <!-- subtitle -->
    <v-card-subtitle class="pb-0">
      <v-row no-gutters>
        <v-card-subtitle class="pa-0">
          <div v-if="author">
            Written by <a style="white-space: pre"> {{ author }}</a> on {{ createdTime }}.
          </div>
          <div v-if="updater">
            <i>Last update on {{ updatedTime }}, updated by <a>{{ updater }}</a>.</i>
          </div>
        </v-card-subtitle>
        <v-spacer></v-spacer>
        <!-- Menu -->
        <v-menu v-if="menu" offset-x>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="item in menuItems" :key="item">
              <v-list-item-title @click="this.$emit(item)">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-card-subtitle>

    <!-- title -->
    <v-card-title class="display-1 pb-0 text-center">
      <slot name="title">title</slot>
    </v-card-title>

    <!-- before markdown area -->
    <v-card-text v-if="this.$slots.beforeMarkdown">
      <slot name="beforeMarkdown"></slot>
    </v-card-text>
    <!-- markdown content -->
    <v-card-text v-if="markdown" class="text--primary pt-4 pb-0">
      <div v-if="mask" class="mask">
        <vue-markdown :source="markdown"></vue-markdown>
      </div>
    </v-card-text>
    <!-- plain content -->
    <v-card-text v-if="this.$slots.afterMarkdown">
      <slot name="afterMarkdown"></slot>
    </v-card-text>

    <!-- actions -->
    <v-card-actions v-if="readmore">
      <slot name="action">
        <ui-button text :to="readmore">
          <template slot="content">
            <v-icon class="mr-1">mdi-page-next</v-icon><u>Read More</u>
            <!-- <v-icon>mdi-open-in-new</v-icon>Read More -->
          </template>
        </ui-button>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {

  name: 'UiPost',

  components: {
    VueMarkdown,
  },

  props: {
    width: {
      type: String,
      default: '50vw',
    },
    height: {
      type: String,
      default: 'auto',
    },
    menu: {
      type: Boolean,
      default: false,
    },
    menuItems: {
      type: Array,
      default: () => ['edit', 'delete'],
    },
    elevation: {
      type: String,
      default: '2',
    },
    markdown: {
      type: String,
      default: null,
    },
    mask: {
      type: Boolean,
      default: false,
    },
    readmore: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: null,
    },
    createdTime: {
      type: String,
      default: null,
    },
    updater: {
      type: String,
      default: null,
    },
    updatedTime: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
.mask {
  max-height: 20vh;
  overflow: hidden;
  mask-image: linear-gradient(180deg, #000 60%, transparent);
}
</style>