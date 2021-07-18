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
      title: () => '系統公告',
    }
  },
  {
    path: '/problem/:id',
    name: 'Problem',
    component: Problem,
    meta: {
      title: () => '題目'
    }
  },
  {
    path: '/problem/:id/statistic',
    name: 'Statistic',
    component: Statistic,
    meta: {
      title: () => '解題狀態'
    }
  },
  {
    path: '/submission/:id',
    name: 'Submission',
    component: Submission,
    meta: {
      title: () => '提交'
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
        meta: { title: () => '課程公告欄' }
      },
      {
        path: 'announcement/:id',
        component: CoursesAnnouncement,
        meta: { title: () => '課程公告' }
      },
      {
        path: 'homeworks',
        component: CoursesHomeworks,
        meta: { title: () => '作業集' }
      },
      {
        path: 'homework/:id',
        component: CoursesHomeworkStatus,
        meta: { title: () => '作業' }
      },
      {
        path: 'homework/:id/handwritten',
        component: CoursesHomeworkHandwritten,
        meta: { title: () => '手寫' }
      },
      {
        path: 'problems',
        component: CoursesProblems,
        meta: { title: () => '題目集' }
      },
      {
        path: 'submissions',
        component: CoursesSubmissions,
        meta: { title: () => '提交狀態' }
      },
      {
        path: 'discussions',
        component: CoursesDiscussions,
        meta: { title: () => '討論' }
      },
      {
        path: 'discussion/:id',
        component: CoursesDiscussion,
        meta: { title: () => '討論區' }
      },
      {
        path: 'grades',
        component: CoursesGrades,
        meta: { title: () => '成績' }
      },
      {
        path: 'manages',
        component: CoursesManages,
        meta: { title: () => '課程管理' }
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
    meta: { title: () => '郵件重寄' }
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

router.beforeEach((to, from, next) => {
  document.title = `Normal-OJ | ${to.meta.title(to)}`
  next()
})

export default router
