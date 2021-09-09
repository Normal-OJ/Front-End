import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home.vue'
import SysAnn from '@/pages/home/SysAnn.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/post/:id',
      name: 'SysAnn',
      component: SysAnn
    },
    {
      path: '/problem/:id',
      name: 'Problem',
      component: () => import('@/pages/problem/Problem.vue')
    },
    {
      path: '/problem/:id/statistic',
      name: 'Statistic',
      component: () => import('@/pages/problem/Statistic.vue')
    },
    {
      path: '/submission/:id',
      name: 'Submission',
      component: () => import('@/pages/submission/Submission.vue')
    },
    {
      path: '/courses',
      name: 'Courses',
      component: () => import('@/pages/courses/Courses.vue')
    },
    {
      path: '/course/:name',
      name: 'Course',
      component: () => import('@/pages/courses/Course.vue'),
      children: [
        {
          path: 'announcements',
          component: () => import('@/pages/courses/announcements/Announcement.vue')
        },
        {
          path: 'announcement/:id',
          component: () => import('@/pages/courses/announcements/Announcements.vue')
        },
        {
          path: 'homeworks',
          component: () => import('@/pages/courses/homeworks/Homeworks.vue')
        },
        {
          path: 'homework/:id',
          component: () => import('@/pages/courses/homeworks/Status.vue')
        },
        {
          path: 'homework/:id/handwritten',
          component: () => import('@/pages/courses/homeworks/Handwritten.vue')
        },
        {
          path: 'problems',
          component: () => import('@/pages/courses/problems/Problems.vue')
        },
        {
          path: 'submissions',
          component: () => import('@/pages/courses/submissions/Submissions.vue')
        },
        {
          path: 'discussions',
          component: () => import('@/pages/courses/discussions/Discussion.vue')
        },
        {
          path: 'discussion/:id',
          component: () => import('@/pages/courses/discussions/Discussions.vue')
        },
        {
          path: 'grades',
          component: () => import('@/pages/courses/grades/Grades.vue')
        },
        {
          path: 'manages',
          component: () => import('@/pages/courses/manages/Manages.vue')
        }
      ],
      redirect: '/course/:name/announcements'
    },
    {
      path: '/inbox',
      name: 'Inbox',
      component: () => import('@/pages/inbox/Inbox.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/pages/about/About.vue')
    },
    {
      path: '/email_verify',
      name: 'EmailVerify',
      component: () => import('@/pages/help/EmailVerify.vue')
    },
    {
      path: '/email_resend',
      name: 'EmailResend',
      component: () => import('@/pages/help/EmailResend.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/pages/profile/Profile.vue')
    },
    {
      path: '/ui/demo',
      name: 'Demo',
      component: () => import('@/components/Demo.vue')
    }
  ]
})
