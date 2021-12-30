<template>
  <div>
    <!-- Comment -->
    <v-row v-for="(item, idx) in items" :key="idx" justify="center" class="my-12">
      <v-card :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'">
        <v-row v-if="editing !== item.id">
          <v-col cols="1">
            <v-avatar class="ma-3">
              <v-img :src="getAvatar(item.author.md5)"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="11">
            <v-row no-gutters>
              <v-card-subtitle class="py-0 text--primary" v-text="item.author.username" />
              <v-card-subtitle class="py-0" v-text="displayTimeAndIsEdited(item)" />
              <v-spacer />
              <!-- Menu -->
              <v-menu v-if="perm(item)" offset-x>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(menu, i) in menuItems" :key="i" @click="operation(menu, item.id, item.content, false)">
                    <v-list-item-title>{{ menu }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
            <v-card-subtitle class="subtitle-1 text--primary">
              <vue-markdown :source="item.content"></vue-markdown>
            </v-card-subtitle>
            <v-row>
              <ui-button v-if="item.status===0" text small @click.native="$refs.item[idx].style.display = ''; $refs.reply[idx].focus();">
                <template slot="content">&#8594; Reply</template>
              </ui-button>
            </v-row>
          </v-col>
        </v-row>
        <div v-else>
          <v-row>
            <v-col cols="1" class="pb-0">
              <v-avatar class="mx-3">
                <v-img :src="getAvatar(item.author.md5)"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="11" class="pb-0">
              <v-textarea
                ref="editingReply"
                v-model="editingReply"
                class="mx-3"
                outlined
                single-line
                rows="1"
                auto-grow
                label="leave a comment"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="auto" class="pt-0">
              <ui-button alert @alertClick="editing = -1; editingReply = '';" color="secondary" outlined>
                <template slot="content">discard</template>
              </ui-button>
            </v-col>
            <v-col cols="auto" class="pt-0">
              <ui-button class="mr-3" @click.native="$emit('editComment', item.id, editingReply)">
                <template slot="content">send</template>
              </ui-button>
            </v-col>
          </v-row>
        </div>
      </v-card>
      <!-- Reply -->
      <v-row v-for="thread in item.reply" :key="thread.id" justify="center" class="mt-2">
        <div style="width: 3vw;"></div>
        <v-card :width="$vuetify.breakpoint.smAndDown ? '72vw' : '47vw'">
          <v-row v-if="editing !== thread.id">
            <v-col cols="1">
              <v-avatar class="ma-3">
                <v-img :src="getAvatar(thread.author.md5)"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="11">
              <v-row no-gutters>
                <v-card-subtitle class="py-0 text--primary" v-text="thread.author.username"></v-card-subtitle>
                <v-card-subtitle class="py-0" v-text="$formatTime(thread.created)"></v-card-subtitle>
                <v-spacer></v-spacer>
                <!-- Menu -->
                <v-menu v-if="perm(item)" offset-x>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="(menu, i) in menuItems" :key="i" @click="operation(menu, thread.id, thread.content, false)">
                      <v-list-item-title>{{ menu }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
              <v-card-subtitle class="subtitle-1 text--primary">
                <vue-markdown :source="thread.content"></vue-markdown>
              </v-card-subtitle>
            </v-col>
          </v-row>
          <div v-else>
            <v-row>
              <v-col cols="1" class="pb-0">
                <v-avatar class="mx-3">
                  <v-img :src="getAvatar(thread.author.md5)"></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="11" class="pb-0">
                <v-textarea
                  ref="editingReply"
                  v-model="editingReply"
                  class="mx-3"
                  outlined
                  single-line
                  rows="1"
                  auto-grow
                  label="leave a comment"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="auto" class="pt-0">
                <ui-button alert @alertClick="editing = -1; editingReply = '';" color="secondary" outlined>
                  <template slot="content">discard</template>
                </ui-button>
              </v-col>
              <v-col cols="auto" class="pt-0">
                <ui-button class="mr-3" @click.native="$emit('editComment', thread.id, editingReply)">
                  <template slot="content">send</template>
                </ui-button>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-row>
      <!-- New Reply -->
      <v-row justify="center" class="my-3" ref="item" v-show="false">
        <div style="width: 3vw;"></div>
        <v-card :width="$vuetify.breakpoint.smAndDown ? '72vw' : '47vw'">
          <v-row>
            <v-col cols="1" class="pb-0">
              <v-avatar class="mx-3">
                <v-img :src="avatar"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="11" class="pb-0">
              <v-textarea
                ref="reply"
                v-model="reply[idx]"
                class="mx-3"
                outlined
                single-line
                rows="1"
                auto-grow
                label="leave a comment"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="auto" class="pt-0">
              <ui-button class="mx-3" @click.native="$emit('newComment', item.id, reply[idx])">
                <template slot="content">send</template>
              </ui-button>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-row>
    <!-- New Comment -->
    <v-row justify="center" class="my-3">
      <v-card :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'">
        <v-row>
          <v-col cols="1" class="pb-0">
            <v-avatar class="mx-3">
              <v-img :src="avatar"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="11" class="pb-0">
            <v-textarea
              ref="comment"
              v-model="comment"
              class="mx-3"
              outlined
              single-line
              rows="1"
              auto-grow
              label="leave a comment"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="auto" class="pt-0">
            <ui-button class="mx-3" @click.native="$emit('newComment', $route.params.id, comment)">
              <template slot="content">send</template>
            </ui-button>
          </v-col>
        </v-row>
      </v-card>
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
          <ui-button class="mx-3" large color="primary" @click.native="operation('delete', deleting, null, true); dialog = false">
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
import { setAvatar } from '@/utils/utils'
import { mapState } from 'vuex'

export default {

  name: 'ShowReply',

  components: {
    VueMarkdown
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    focus: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    focus () {
      this.$refs.comment.focus()
    }
  },

  data () {
    return {
      dialog: false,
      comment: '',
      reply: new Array(this.items.length),
      menuItems: [
        'edit',
        'delete'
      ],
      editingReply: '',
      editing: -1,
      deleting: -1
    }
  },

  computed: {
    ...mapState({
      username: state => state.username,
      role: state => state.role,
      avatar: state => state.avatar
    })
  },

  methods: {
    operation (op, id, content, check) {
      if (op === 'delete') {
        if (check) {
          this.$agent.Post.delete({ targetThreadId: id })
            .then(() => {
              this.$router.go(0)
            })
        } else {
          this.deleting = id
          this.dialog = true
        }
      } else {
        if (this.editing === -1) {
          this.editingReply = content
          this.editing = id
        } else {
          this.$refs.editingReply[0].focus()
        }
      }
    },
    displayTimeAndIsEdited (item) {
      return this.$formatTime(item.created) + (item.created !== item.updated ? ' (edited)' : '')
    },
    perm (item) {
      return this.role <= 1 || this.username === item.author.username
    },
    getAvatar (payload) {
      setAvatar(payload)
    }
  }
}
</script>
