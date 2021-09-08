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
          <a
            v-for="item in pin"
            :key="item.annId"
            class="ml-6 subtitle-1" target="_blank" rel="noopener noreferrer" :href="'/post/'+item.annId">
            <v-icon>mdi-file-document</v-icon>{{ item.title }}</a><br>
        </v-card-text>
      </v-card>

      <!-- <v-divider></v-divider> -->

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
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ShowAnn from '@/components/courses/ShowAnn'

export default {

  name: 'Home',

  components: {
    ShowAnn
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
      this.$http.get('/api/ann/')
        .then((res) => {
          this.pin = []
          this.items = []
          res.data.data.forEach(ele => {
            if (ele.pinned) {
              this.pin.push({
                annId: ele.annId,
                title: ele.title,
                author: ele.creator,
                content: ele.markdown,
                createdTime: this.timeFormat(ele.createTime),
                lastUpdatedTime: this.timeFormat(ele.updateTime),
                lastUpdater: ele.updater
              })
            } else {
              this.items.push({
                annId: ele.annId,
                title: ele.title,
                author: ele.creator,
                content: ele.markdown,
                createdTime: this.timeFormat(ele.createTime),
                lastUpdatedTime: this.timeFormat(ele.updateTime),
                lastUpdater: ele.updater
              })
            }
          })
        })
    },
    timeFormat (time) {
      var tmp = new Date(time * 1000)
      var year = tmp.getFullYear()
      var month = '0' + (tmp.getMonth() + 1)
      var date = '0' + tmp.getDate()
      var hour = '0' + tmp.getHours()
      var min = '0' + tmp.getMinutes()
      var sec = '0' + tmp.getSeconds()
      var time = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2)
      return time
    }
  }
}
</script>
