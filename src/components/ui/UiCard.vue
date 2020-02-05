<template>
  <v-card
    class="my-6 mx-auto flex-column d-flex"
    :elevation="elevation"
    :width="width"
    :height="height"
  >
    <!-- subtitle -->
    <v-card-subtitle class="pb-0">
      <v-row no-gutters>
        <v-card-subtitle class="pa-0">
          <slot name="subtitle">subtitle</slot> 
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
        <!-- Menu -->
      </v-row>
    </v-card-subtitle>

    <!-- title -->
    <v-card-title class="display-1 pb-0 text-center">
      <slot name="title">title</slot>
    </v-card-title>

    <!-- markdown content -->
    <v-card-text v-if="markdown" class="text--primary mask pt-4 pb-0">
      <vue-markdown :source="mdContent"></vue-markdown>
    </v-card-text>
    <!-- plain content -->
    <v-card-text v-else>
      <slot name="content"></slot>
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

  name: 'UiCard',

  components: {
    VueMarkdown,
  },

  props: {
    menu: {
      type: Boolean,
      default: false,
    },
    menuItems: {
      type: Array,
      default: () => ['edit', 'delete'],
    },
    markdown: {
      type: Boolean,
      default: false,
    },
    mdContent: {
      type: String,
      default: '',
    },
    elevation: {
      type: String,
      default: '6',
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: 'auto',
    },
    readmore: {
      type: String,
      default: null,
    }
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
.mask {
  max-height: 10vh;
  overflow: hidden;
  mask-image: linear-gradient(180deg, #000 60%, transparent);
}
</style>