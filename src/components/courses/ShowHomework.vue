<template>
  <div>
    <v-row no-gutters v-for="(item, idx) in items" :key="idx" justify="center">
      <v-card
        class="my-3"
        elevation="2"
        :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'"
      >
        <v-card-title>
          <v-row>
            <!-- title -->
            <v-card-title class="headline font-weight-bold py-0">{{ item.title }}</v-card-title>
            <v-spacer></v-spacer>
            <v-chip
              class="mr-3"
              :color="item.status === 'End' ? 'error' : 'success'"
              label
            >{{ item.status }}</v-chip>
            <!-- Menu -->
            <v-menu v-if="perm" offset-x>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(menu, i) in menuItems" :key="i" @click="$emit(menu,i,item.id)">
                  <v-list-item-title>{{ menu }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-card-title>
        <v-divider class="mt-0"></v-divider>
        <!-- info -->
        <v-card-text class="py-0">
          <v-alert
            type="info"
            dense
            dark
            colored-border
            elevation="0"
          >{{ 'Due Time: ' + item.end }}</v-alert>
        </v-card-text>
        <v-card-title class="font-weight-bold">Description</v-card-title>
          <v-card-text class="text--primary">
            <vue-markdown :source="item.content"></vue-markdown>
          </v-card-text>
          <v-divider></v-divider>
        <v-card-title class="font-weight-bold">Problem</v-card-title>
          <v-simple-table class="px-3">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'#'"></th>
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'Problem id'"></th>
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'Problem Name'"></th>
                  <!-- <th v-if="item.studentStatus" class="title text-left" v-text="'Score'"></th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(id, idx) in item.problemIds" :key="idx">
                  <td class="subtitle-1" v-text="idx+1"></td>
                  <td class="subtitle-1" v-text="id"></td>
                  <td class="subtitle-1">
                    <a target="_blank" rel="noopener noreferrer" :href="'problem/'+id" v-text="findProb(id)"></a>
                  </td>
                  <!-- <td v-if="item.studentStatus" class="title text-left" v-text="item.studentStatus ? item.studentStatus.id : ''"></td> -->
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-if="perm">
            <v-card-text>
              <HomeworkScoreboard :items="item.studentStatus" :probs="item.problemIds" :probsName="item.problem">
              </HomeworkScoreboard>
            </v-card-text>
          </div>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-if="!items || items.length===0" justify="center">
      <h3>🦄 There's no homework yet.</h3>
    </v-row>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import HomeworkScoreboard from './HomeworkScoreboard'

export default {

  name: 'ShowHomework',

  components: {
    VueMarkdown, HomeworkScoreboard,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },
    probs: {
      type: Array,
      required: true,
    },
    perm: {
      type: Boolean,
      default: false,
    },
    menuItems: {
      type: Array,
      default: () => ['edit', 'delete'],
    },
  },

  data () {
    return {

    }
  },

  methods: {
    findProb(id) {
      for ( var i=0; i<this.probs.length; i++ ) {
        if ( this.probs[i].problemId === id ) {
          return this.probs[i].problemName;
        }
      }
    },
  }
}
</script>

<style lang="css" scoped>
</style>