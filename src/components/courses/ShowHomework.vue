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
                <v-list-item v-for="(menu, i) in menuItems" :key="i" @click="menuEmit(menu,i,item.id)">
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
        <v-card-text class="py-0 text--primary">
          <v-row>
            <v-col cols="6" class="pb-0">
              <v-row justify="center">
                <span v-if="totalScore(item) === item.problemIds.length*100" class="headline mt-4">🎉</span>
                <span class="display-3">{{ totalScore(item) }}</span>
                <span class="title mt-8">{{ ' / ' + item.problemIds.length*100 }}</span>
              </v-row>
              <v-row justify="center"><h3>Total Score</h3></v-row>
            </v-col>
            <v-col cols="6" class="pb-0">
              <v-row justify="center">
                <span v-if="totalAC(item)[0] === totalAC(item)[1]" class="headline mt-4">🎉</span>
                <span class="display-3">{{ totalAC(item)[0] }}</span>
                <span class="title mt-8">{{ ' / ' + totalAC(item)[1] }}</span>
              </v-row>
              <v-row justify="center"><h3>Solved Programming Problem</h3></v-row>
            </v-col>
          </v-row>
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
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'PID'"></th>
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'Name'"></th>
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'Type'"></th>
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'Score'"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(id, idx) in item.problemIds" :key="idx">
                  <td class="subtitle-1" v-text="idx+1"></td>
                  <td class="subtitle-1" v-text="id"></td>
                  <td class="subtitle-1">
                    <a target="_blank" rel="noopener noreferrer" :href="'/problem/'+id" v-text="findProb(id)"></a>
                  </td>
                  <td class="subtitle-1" v-text="findType(id)"></td>
                  <td v-if="user !== '' && item.studentStatus[`${id}`]" class="subtitle-1" v-text="item.studentStatus[`${id}`]['score']"></td>
                  <td v-else>Not a student</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-if="perm">
            <v-card-text>
              <ui-button :to="`homework/${item.id}/handwritten`" color="warning" class="mr-3">
                <template slot="content">Check Handwritten</template>
              </ui-button>
              <ui-button :to="`homework/${item.id}`" color="info">
                <template slot="content">View Student Status</template>
              </ui-button>
              <!-- <HomeworkScoreboard :items="item.studentStatus" :probs="item.problemIds" :probsName="item.problem">
              </HomeworkScoreboard> -->
            </v-card-text>
          </div>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-show="!items">
      <v-skeleton-loader
        class="mx-auto"
        type="image"
        :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'" 
      ></v-skeleton-loader>
    </v-row>
    <v-row v-if="items && items.length === 0" justify="center">
      <h3>🦄 There's no homework yet.</h3>
    </v-row>
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
          <ui-button class="mx-3" large color="primary" @click.native="$emit('delete', menu.i, menu.id); dialog = false">
            <template slot="content">Yes</template>
          </ui-button>
          <ui-button class="mx-3" large color="secondary" @click.native="dialog = false">
            <template slot="content">No</template>
          </ui-button>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import HomeworkScoreboard from './HomeworkScoreboard'
var TYPE = ['Programming', 'Template', 'Handwritten'];
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
    user: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      dialog: false,
      menu: {
        i: null,
        id: null,
      },

    }
  },

  methods: {
    totalScore(item) {
      let ret = 0, flag = false;
      item.problemIds.forEach(id => {
        if ( !(item.studentStatus.hasOwnProperty(`${id}`)) ) {
          if ( !(item.studentStatus.hasOwnProperty(`${this.user}`)) ) flag = true;
          else ret += Math.max(0,item.studentStatus[`${this.user}`][`${id}`]['score']);
        } else {
          ret += Math.max(0,item.studentStatus[`${id}`]['score']);
        }
      })
      return (flag ? -1 : ret);
    },
    totalAC(item) {
      let ret = 0, cnt = 0, flag = false;
      item.problemIds.forEach(id => {
        if ( !(item.studentStatus.hasOwnProperty(`${id}`)) ) {
          if ( !(item.studentStatus.hasOwnProperty(`${this.user}`)) )  flag = true;
          else {
            if ( this.findType(id) !== TYPE[2] ) {
              cnt++;
              ret += Number(item.studentStatus[`${this.user}`][`${id}`]['problemStatus']===0); 
            }
          } 
        } else {
          if ( this.findType(id) !== TYPE[2] ) {
            cnt++;
            ret += Number(item.studentStatus[`${id}`]['problemStatus']===0);
          }
        }
      })
      return (flag ? [-1, 0] : [ret, cnt]);
    },
    findType(id) {
      for ( var i=0; i<this.probs.length; i++ ) {
        if ( this.probs[i].problemId === id ) {
          return TYPE[this.probs[i].type];
        }
      }
    },
    findProb(id) {
      for ( var i=0; i<this.probs.length; i++ ) {
        if ( this.probs[i].problemId === id ) {
          return this.probs[i].problemName;
        }
      }
    },
    menuEmit(item, i, id) {
      this.menu.i = i;
      this.menu.id = id;
      if ( item === 'edit' ) {
        this.$emit(item,i,id);
      } else {
        this.dialog = true;
      }
    },
  }
}
</script>

<style lang="css" scoped>
</style>