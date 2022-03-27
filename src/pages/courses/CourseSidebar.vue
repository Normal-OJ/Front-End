<template>
  <v-card tile outlined height="100%">
    <v-list>
      <v-list-item>
        <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ courseName }}</v-list-item-title>
          <v-list-item-subtitle class="title">{{ teacherName }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav>
      <v-list-item-group color="primary">
        <template v-for="link in links">
          <v-list-item
            :key="link.title"
            v-if="!link.invisible"
            :to="link.path"
            link
            dense
          >
            <v-list-item-icon><v-icon class="mt-1">{{ link.icon }}</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="subtitle-1">{{ link.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { setAvatar } from '@/utils/utils'

export default {

  name: 'CourseSidebar',

  data () {
    return {
      teacherName: '',
      avatar: setAvatar(''),
      perm: false
    }
  },

  mounted () {
    this.getInfo()
  },

  computed: {
    courseName () {
      return this.$route.params.name
    },
    links () {
      return [
        {
          title: 'Announcements',
          path: `/course/${this.courseName}/announcements`,
          icon: 'mdi-bulletin-board'
        },
        {
          title: 'Homeworks',
          path: `/course/${this.courseName}/homeworks`,
          icon: 'mdi-book-multiple',
          invisible: this.courseName === 'Public'
        },
        {
          title: 'Problems',
          path: `/course/${this.courseName}/problems`,
          icon: 'mdi-view-list'
        },
        {
          title: 'Submissions',
          path: `/course/${this.courseName}/submissions`,
          icon: 'mdi-history'
        },
        {
          title: 'Discussions',
          path: `/course/${this.courseName}/discussions`,
          icon: 'mdi-comment-text',
          invisible: this.courseName === 'Public'
        },
        {
          title: 'Grades',
          path: `/course/${this.courseName}/grades`,
          icon: 'mdi-chart-bar',
          invisible: this.courseName === 'Public'
        },
        {
          title: 'Manages',
          path: `/course/${this.courseName}/manages`,
          icon: 'mdi-cog',
          invisible: !this.canManageCourse
        }
      ]
    },
    ...mapState({
      role: state => state.role,
      username: state => state.username
    }),
    // isTA () {
    //   return this.ta.includes(t => t.username === this.username)
    // },
    canManageCourse () {
      return this.role <= 1
      // return this.role <= 1 || this.isTA
    }
  },

  methods: {
    getInfo () {
      this.$agent.Course.getInfo(this.$route.params.name)
        .then((res) => {
          this.teacherName = res.data.data.teacher.username
          // this.ta = res.data.data.TAs
          this.avatar = setAvatar(res.data.data.teacher.md5)
        })
    }
  }
}
</script>
