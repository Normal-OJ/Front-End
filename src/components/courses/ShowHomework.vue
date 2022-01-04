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
                <v-list-item v-for="(menu, i) in menuItems" :key="i" @click="menuEmit(menu,idx,item.id)">
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
          <v-row v-if="prob">
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
          <spinner v-else />
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
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'Quota'"></th>
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'Score'"></th>
                  <th class="font-weight-bold subtitle-1 text--primary" v-text="'Statistic'"></th>
                </tr>
              </thead>
              <tbody v-if="ready">
                <tr v-for="(id, idx) in item.problemIds" :key="idx">
                  <td class="subtitle-1" v-text="idx+1"></td>
                  <td class="subtitle-1" v-text="id"></td>
                  <td class="subtitle-1">
                    <a target="_blank" rel="noopener noreferrer" :href="'/problem/'+id" v-text="findProb(id)"></a>
                  </td>
                  <td class="subtitle-1" v-text="findType(id)"></td>
                  <td class="subtitle-1" v-text="findQuota(id)==-1 ? 'unlimited' : findQuota(id)-findCount(id)"></td>
                  <td v-if="user !== '' && item.studentStatus[`${id}`]" class="subtitle-1" v-text="item.studentStatus[`${id}`]['score']"></td>
                  <td v-else>Not a student</td>
                  <td v-if="findType(id) === 'Programming'">
                    <v-btn :to="`/problem/${id}/statistic`" class="text-none subtitle-1" color="info" small text>
                      <v-icon>mdi-chart-arc</v-icon>
                    </v-btn>
                  </td>
                  <td v-else></td>
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
            </v-card-text>
          </div>
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
import Spinner from '../ui/Spinner.vue'
var TYPE = ['Programming', 'Template', 'Handwritten']
export default {

  name: 'ShowHomework',

  components: {
    VueMarkdown,
    Spinner
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    probs: {
      type: Array,
      required: true
    },
    perm: {
      type: Boolean,
      default: false
    },
    menuItems: {
      type: Array,
      default: () => ['edit', 'delete']
    },
    user: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      dialog: false,
      menu: {
        i: null,
        id: null
      },
      ready: false,
      prob: null
    }
  },

  mounted () {
    this.prob = {}
    for (let i = 0; i < this.probs.length; i++) {
      this.prob[String(this.probs[i].problemId)] = this.probs[i]
    }
    this.ready = true
  },

  methods: {
    totalScore (item) {
      let ret = 0; let flag = false
      item.problemIds.forEach(id => {
        if (!Object.prototype.hasOwnProperty.call(item.studentStatus, `${id}`)) {
          if (!Object.prototype.hasOwnProperty.call(item.studentStatus, `${this.user}`)) flag = true
          else ret += Math.max(0, item.studentStatus[`${this.user}`][`${id}`].score)
        } else {
          ret += Math.max(0, item.studentStatus[`${id}`].score)
        }
      })
      return (flag ? -1 : ret)
    },
    totalAC (item) {
      let ret = 0; let cnt = 0; let flag = false
      item.problemIds.forEach(id => {
        if (!Object.prototype.hasOwnProperty.call(item.studentStatus, `${id}`)) {
          if (!Object.prototype.hasOwnProperty.call(item.studentStatus, `${this.user}`)) flag = true
          else {
            if (this.findType(id) !== TYPE[2]) {
              cnt++
              ret += Number(item.studentStatus[`${this.user}`][`${id}`].problemStatus === 0)
            }
          }
        } else {
          if (this.findType(id) !== TYPE[2]) {
            cnt++
            ret += Number(item.studentStatus[`${id}`].problemStatus === 0)
          }
        }
      })
      return (flag ? [-1, 0] : [ret, cnt])
    },
    findType (id) {
      if (this.prob[`${id}`]) { return TYPE[this.prob[`${id}`].type] }
    },
    findProb (id) {
      if (this.prob[`${id}`]) { return this.prob[`${id}`].problemName }
    },
    findQuota (id) {
      if (this.prob[`${id}`]) { return this.prob[`${id}`].quota }
    },
    findCount (id) {
      if (this.prob[`${id}`]) { return this.prob[`${id}`].submitCount }
    },
    menuEmit (item, i, id) {
      this.menu.i = i
      this.menu.id = id
      if (item === 'edit') {
        this.$emit(item, i, id)
      } else {
        this.dialog = true
      }
    }
  }
}
</script>
