<template>
  <v-card
    class="my-6 flex-column d-flex"
    elevation="6"
    width="70vw"
  >
    <!-- subtitle -->
    <v-card-subtitle class="subtitle-1">
      <v-row no-gutters class="px-auto">
        <slot name="subtitle">subtitle</slot> 
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
    <v-card-title class="display-1 font-weight-bold">
      <slot name="title">title</slot>
    </v-card-title>

    <!-- markdown content -->
    <v-card-text v-if="markdown">
      <vue-markdown :source="mdContent"></vue-markdown>
    </v-card-text>
    <!-- plain content -->
    <v-card-text v-else>
      <slot name="content"></slot>
    </v-card-text>

    <!-- actions -->
    <v-card-actions>
      <slot name="action">
        <ui-button text>
          <template slot="content">
            <v-icon>mdi-open-in-new</v-icon>Read More
          </template>
        </ui-button>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {

  name: 'UiCard',

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
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
</style>