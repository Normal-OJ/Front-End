<template>
  <v-card
    class="my-3"
    :elevation="elevation"
    :width="width"
    :height="height"
  >
    <!-- subtitle -->
    <v-card-subtitle>
      <v-row no-gutters>
        <v-card-subtitle class="pa-0">
          <div v-if="author">
            <v-icon>mdi-account-edit</v-icon> Written by <a style="white-space: pre"> {{ author }} </a>
            <v-icon>mdi-clock-outline</v-icon> {{ createdTime }}.
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
            <v-list-item v-for="(item, i) in menuItems" :key="i" @click="menuEmit(item)">
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-card-subtitle>

    <!-- title -->
    <v-card-title class="display-1 py-0">{{ title }}</v-card-title>

    <!-- before markdown area -->
    <v-card-text v-if="this.$slots.beforeMarkdown">
      <slot name="beforeMarkdown"></slot>
    </v-card-text>
    <!-- markdown content -->
    <v-card-text v-if="markdown" class="text--primary pt-4">
      <div :class="mask ? 'mask' : ''">
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
          <ui-button class="mx-3" large color="primary" @click.native="$emit('delete'); dialog = false">
            <template slot="content">Yes</template>
          </ui-button>
          <ui-button class="mx-3" large color="secondary" @click.native="dialog = false">
            <template slot="content">No</template>
          </ui-button>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {

  name: 'UiPost',

  components: {
    VueMarkdown
  },

  props: {
    width: {
      type: String,
      default: '50vw'
    },
    height: {
      type: String,
      default: 'auto'
    },
    menu: {
      type: Boolean,
      default: false
    },
    menuItems: {
      type: Array,
      default: () => ['edit', 'delete']
    },
    elevation: {
      type: String,
      default: '2'
    },
    markdown: {
      type: String,
      default: null
    },
    mask: {
      type: Boolean,
      default: false
    },
    readmore: {
      type: String,
      default: null
    },
    author: {
      type: String,
      default: null
    },
    createdTime: {
      type: String,
      default: null
    },
    updater: {
      type: String,
      default: null
    },
    updatedTime: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      dialog: false
    }
  },

  methods: {
    menuEmit (item) {
      if (item === 'edit') {
        this.$emit(item)
      } else {
        this.dialog = true
      }
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
