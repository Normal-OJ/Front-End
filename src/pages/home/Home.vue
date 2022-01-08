<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '60vw' : '95vw', height: '100%' }"
  >
    <v-card height="100%" elevation="12">
      <!-- Pinned -->
      <v-card elevation="0" tile>
        <v-card-title class="headline font-weight-bold">
          <v-icon class="mr-1" style="transform: rotate(45deg);">mdi-pin</v-icon>Pinned
        </v-card-title>
        <v-divider class="mt-0"></v-divider>
        <v-card-text class="pl-10">
          <template v-if="pin">
            <a
              v-for="item in pin"
              :key="item.annId"
              class="ml-6 subtitle-1"
              target="_blank"
              rel="noopener noreferrer"
              :href="'/post/'+item.annId"
            >
              <v-icon>mdi-file-document</v-icon>
              {{ item.title }}
            </a>
          </template>
          <Spinner v-else />
          <br>
        </v-card-text>
      </v-card>

      <!-- Ann -->
      <v-card-title class="headline font-weight-bold">
        <v-icon color="transparent">mdi-pin</v-icon>System Announcement
      </v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-card-text>
        <ShowAnn
          v-if="items"
          :items="items"
          :width="$vuetify.breakpoint.mdAndUp ? '50vw': '90vw'"
          :readmore="`/post`"
          mask
        ></ShowAnn>
        <Spinner v-else />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ShowAnn from '@/components/courses/ShowAnn'
import Spinner from '@/components/ui/Spinner.vue'

export default {

  name: 'Home',

  components: {
    ShowAnn, Spinner
  },

  data () {
    return {
      items: null,
      pin: null
    }
  },

  created () {
    this.getAnn()
  },

  methods: {
    getAnn () {
      this.$agent.SystemAnn.getList()
        .then((res) => {
          const anns = res.data.data.map(r => ({
            pinned: r.pinned,
            annId: r.annId,
            title: r.title,
            author: r.creator,
            content: r.markdown,
            createdTime: this.$formatTime(r.createTime),
            lastUpdatedTime: this.$formatTime(r.updateTime),
            lastUpdater: r.updater
          }))
          this.pin = anns.filter(ann => ann.pinned)
          this.items = anns.filter(ann => !ann.pinned)
        })
    }

  }
}
</script>
