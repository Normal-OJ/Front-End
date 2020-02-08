<template>
  <v-card tile outlined height="100%" v-if="mail">
    <v-card-title>
      <v-list-item two-line>
        <v-list-item-avatar size="64px">
          <v-img :src="mail.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline" v-text="mailFromTo"/>
          <v-list-item-subtitle v-text="mail.timestamp"/>
        </v-list-item-content>
        <v-spacer/>
        <v-tooltip bottom v-for="btn in btns" v-if="btn.show || mail.sender">
          <template v-slot:activator="{ on }">
            <v-btn class="ml-1" icon outlined v-on="on" >
              <v-icon v-text="btn.icon" @click="$emit(btn.text, mail.value)"/>
            </v-btn>
          </template>
          <span v-text="btn.text"/>
        </v-tooltip>
      </v-list-item>
    </v-card-title>
    <v-divider/>
    <v-card-text>
      <v-list-item>
        <v-list-item-content class="ma-3">
          <v-list-item-title class="headline">{{ mail.subject }}</v-list-item-title>
          <v-divider></v-divider>
          <v-container>
            <vue-markdown class="body-1" :source="mail.content"/>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
  </v-card>
  <v-card tile outlined height="100%" v-else>
    <v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-icon size="200" color="grey">mdi-email-outline</v-icon>
          <v-list-item-subtitle class="text-center display-1">Empty</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'InboxViewer',

  components: {
    VueMarkdown,
  },

  data() {
    return {
      btns: [
        { icon: 'mdi-reply', text: 'reply', show: false },
        { icon: 'mdi-delete', text: 'delete', show: true },
      ]
    }
  },

  props: {
    mail: {
      type: Object,
      default: null
    }
  },

  computed: {
    mailFromTo() {
      return this.mail.sender || this.mail.receivers;
    },
  }
}
</script>