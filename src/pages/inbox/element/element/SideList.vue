<template>
  <v-card tile outlined height="100%">
    <v-card-title>
      <slot name="header">Header</slot>
    </v-card-title>
    <v-divider/>
    <v-list :nav="nav" :two-line="subtitle" :flat="flat">
      <v-subheader v-if="search && !hideSearchHint">
        <v-icon>mdi-magnify</v-icon>
        Search for "{{ search }}":
      </v-subheader>
      <v-list-item-group v-model="selected" v-if="searchedItems.length" color="primary">
        <v-list-item
          v-for="(item, i) in searchedItems"
          :key="i"
          @click="$emit('click', item.value)"
        >
          <v-list-item-icon v-if="item.icon">
            <v-icon v-text="item.icon"/>
          </v-list-item-icon>
          <v-list-item-avatar v-if="item.avatar">
            <v-img :src="item.avatar"/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
            <v-list-item-subtitle v-if="subtitle" v-text="item.subtitle"/>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-list-item-group v-else color="primary">
        <slot name="empty">
          <v-list-item disabled>
            <v-list-item-content>
              <v-list-item-subtitle class="text-center subtitle-1">Empty</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </slot>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>
<script>
export default {
  name: 'SideList',

  data() {
    return {
       selected: -1
    }
  },

  props: {
    value: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      default: [
        { icon: 'mdi-plus', title: 'Plus', value: 0 },
        { icon: 'mdi-minus', title: 'Minus', value: 1 },
      ]
    },
    flat: {
      type: Boolean,
      default: false
    },
    nav: {
      type: Boolean,
      default: false
    },
    search: {
      type: String,
      default: ''
    },
    subtitle: {
      type: Boolean,
      default: false
    },
    hideSearchHint: Boolean,
  },

  computed: {
    searchedItems() {
      let search = this.search;
      return search ? this.items.filter(item => item.title.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1) : this.items;
    }
  },

  watch: {
    value() {
      this.selected = this.value;
    },
    selected() {
      this.$emit('input', this.selected);
    }
  }
}
</script>