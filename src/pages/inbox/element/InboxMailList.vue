<template>
  <SideList v-model="selected" :items="mails" subtitle flat @click="readMail" :search="search">
    <template v-slot:header>
      <v-text-field
        v-model="search"
        outlined
        append-icon="mdi-magnify"
        label="Search for subject..."
        hide-details
        hide-no-data
        item-text="title"
      />
    </template>
    <template v-slot:empty>
      <v-list-item disabled>
        <v-list-item-content>
          <v-icon size="50" color="grey">mdi-email-outline</v-icon>
          <v-list-item-subtitle class="text-center subtitle-1">Empty</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </SideList>
</template>

<script>
import SideList from "./element/SideList"

export default {
  name: 'InboxMailList',

  components: {
    SideList
  },

  data() {
    return {
      search: '',
    }
  },

  props: {
    mails: {
      type: Array,
      required: true
    },
    selected: {
      type: Number,
      required: true
    }
  },

  methods: {
    readMail(mid) {
      this.$emit('read', mid);
    }
  },
}
</script>