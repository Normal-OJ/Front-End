import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import SysAnn from '@/pages/home/SysAnn'
import Problem from '@/pages/problem/Problem'
import Statistic from '@/pages/problem/Statistic'
import Submission from '@/pages/submission/Submission'
import Courses from '@/pages/courses/Courses'
import Course from '@/pages/courses/Course'
import CoursesAnnouncement from '@/pages/courses/announcements/Announcement'
import CoursesAnnouncements from '@/pages/courses/announcements/Announcements'
import CoursesHomeworks from '@/pages/courses/homeworks/Homeworks'
import CoursesHomeworkStatus from '@/pages/courses/homeworks/Status'
import CoursesHomeworkHandwritten from '@/pages/courses/homeworks/Handwritten'
import CoursesProblems from '@/pages/courses/problems/Problems'
import CoursesSubmissions from '@/pages/courses/submissions/Submissions'
import CoursesDiscussion from '@/pages/courses/discussions/Discussion'
import CoursesDiscussions from '@/pages/courses/discussions/Discussions'
import CoursesGrades from '@/pages/courses/grades/Grades'
import CoursesManages from '@/pages/courses/manages/Manages'
import Inbox from '@/pages/inbox/Inbox'
import About from '@/pages/about/About'
import EmailVerify from '@/pages/help/EmailVerify'
import EmailResend from '@/pages/help/EmailResend'
import Profile from '@/pages/profile/Profile'
import Demo from '@/components/Demo'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: () => '首頁',
    }
  },
  {
    path: '/post/:id',
    name: 'SysAnn',
    component: SysAnn,
    meta: {
      title: async (route) => {
        const { data: rspData } = await Vue.axios.get(`/api/ann/${route.params.id}`)
        const annTitle = rspData.data[0].title
        return `系統公告:${annTitle}`
      },
    }
  },
  {
    path: '/problem/:id',
    name: 'Problem',
    component: Problem,
    meta: {
      title: async (route) => {
        const { data: rspData } = await Vue.axios.get(`/api/problem/view/${route.params.id}`)
        const probTitle = rspData.data.problemName
        return `題目:${probTitle}`
      }
    }
  },
  {
    path: '/problem/:id/statistic',
    name: 'Statistic',
    component: Statistic,
    meta: {
      title: async (route) => {
        const { data: rspData } = await Vue.axios.get(`/api/problem/view/${route.params.id}`)
        const probTitle = rspData.data.problemName
        return `解題狀態-${probTitle}`
      }
    }
  },
  {
    path: '/submission/:id',
    name: 'Submission',
    component: Submission,
    meta: {
      title: (route) => `提交:${route.params.id.slice(0, 6)}`
    }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
    meta: {
      title: () => '課程',
    }
  },
  {
    path: '/course/:name',
    name: 'Course',
    component: Course,
    children: [
      {
        path: 'announcements',
        component: CoursesAnnouncements,
        meta: { title: (route) => `公告欄-${route.params.name}` }
      },
      {
        path: 'announcement/:id',
        component: CoursesAnnouncement,
        meta: {
          title: async (route) => {
            const { data: rspData } = await Vue.axios.get(`/api/ann/${route.params.name}/${route.params.id}`)
            const annTitle = rspData.data[0].title
            return `課程公告:${annTitle}-${route.params.name}`
          }
        }
      },
      {
        path: 'homeworks',
        component: CoursesHomeworks,
        meta: { title: (route) => `作業集-${route.params.name}` }
      },
      {
        path: 'homework/:id',
        component: CoursesHomeworkStatus,
        meta: {
          title: async (route) => {
            const { data: rspData } = await Vue.axios.get(`/api/course/${route.params.name}/homework`)
            const currHw = rspData.data.find(ele => ele.id === route.params.id)
            const hwTitle = currHw.name
            return `作業:${hwTitle}-${route.params.name}`
          }
        }
      },
      {
        path: 'homework/:id/handwritten',
        component: CoursesHomeworkHandwritten,
        meta: {
          title: async (route) => {
            const { data: rspData } = await Vue.axios.get(`/api/course/${route.params.name}/homework`)
            const currHw = rspData.data.find(ele => ele.id === route.params.id)
            const hwTitle = currHw.name
            return `手寫:${hwTitle}-${route.params.name}`
          }
        }
      },
      {
        path: 'problems',
        component: CoursesProblems,
        meta: { title: (route) => `題目集-${route.params.name}` }
      },
      {
        path: 'submissions',
        component: CoursesSubmissions,
        meta: { title: (route) => `提交狀態-${route.params.name}` }
      },
      {
        path: 'discussions',
        component: CoursesDiscussions,
        meta: { title: (route) => `討論-${route.params.name}` }
      },
      {
        path: 'discussion/:id',
        component: CoursesDiscussion,
        meta: {
          title: async (route) => {
            const { data: rspData } = await Vue.axios.get(`/api/post/view/${route.params.name}/${route.params.id}`)
            const discussTitle = rspData.data[0].title
            return `討論區:${discussTitle}-${route.params.name}`
          },
        }
      },
      {
        path: 'grades',
        component: CoursesGrades,
        meta: { title: (route) => `成績-${route.params.name}` }
      },
      {
        path: 'manages',
        component: CoursesManages,
        meta: { title: (route) => `課程管理-${route.params.name}` }
      },
    ],
    redirect: '/course/:name/announcements',
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: Inbox,
    meta: { title: () => '站內信箱' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: () => '關於' }
  },
  {
    path: '/email_verify',
    name: 'EmailVerify',
    component: EmailVerify,
    meta: { title: () => '信箱確認' }
  },
  {
    path: '/email_resend',
    name: 'EmailResend',
    component: EmailResend,
    meta: { title: () => '重寄認證信' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: () => '個人頁面' }
  },
  {
    path: '/ui/demo',
    name: 'Demo',
    component: Demo,
    meta: { title: () => 'Demo' }
  },
]

const router = new Router({
  mode: 'history',
  routes,
})

router.beforeEach(async (to, from, next) => {
  const routeTitle = await to.meta.title(to)
  document.title = `${routeTitle} | Normal-OJ`
  next()
})

export default router
