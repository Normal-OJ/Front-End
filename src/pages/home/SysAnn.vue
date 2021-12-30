<template>
  <v-container>
    <ShowAnn
      v-if="items"
      :items="items"
      :menu="role === 0"
      updateInfo
      @delete="deleteAnn"
    ></ShowAnn>
  </v-container>
</template>

<script>
import ShowAnn from '@/components/courses/ShowAnn'
import { mapState } from 'vuex'
export default {

  name: 'SysAnn',

  components: {
    ShowAnn
  },

  data () {
    return {
      items: []
    }
  },

  mounted () {
    this.getAnn()
  },

  computed: {
    ...mapState({
      role: state => state.role
    })
  },

  methods: {
    getAnn () {
      this.$agent.SystemAnn.getInfo(this.$route.params.id)
        .then((res) => {
          this.items = res.data.data.map(r => ({
            annId: r.annId,
            title: r.title,
            author: r.creator,
            content: r.markdown,
            createdTime: this.$formatTime(r.createTime),
            lastUpdatedTime: this.$formatTime(r.updateTime),
            lastUpdater: r.updater
          }))
        })
    },
    operate (idx) {
      if (idx === 0) { this.annDialog = true } else if (idx === 1) this.deleteAnn()
    },
    editAnn () {
      if (this.$refs.form.validate()) {
        this.$agent.Ann.modify({ title: this.newTitle, markdown: this.newContent, annId: this.$route.params.id })
          .then(() => {
            this.annDialog = false
          })
      }
    },
    deleteAnn () {
      this.$agent.Ann.delete({ annId: this.$route.params.id })
        .then(() => {
          this.$router.push(`/course/${this.$route.params.name}/announcement`)
        })
    }
  }
}
</script>
