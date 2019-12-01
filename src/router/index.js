import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import Problemset from '@/components/problemset/Problemset'
import Problems from '@/components/problems/Problems'
import Submissions from '@/components/submissions/Submissions'
import Courses from '@/components/courses/Courses'
import Inbox from '@/components/inbox/Inbox'
import EmailVerify from '@/components/header/EmailVerify'
import EmailResend from '@/components/header/EmailResend'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/problems',
      name: 'Problemset',
      component: Problemset
    },
    {
      path: '/problems/:id',
      name: 'Problems',
      component: Problems
    },
    {
      path: '/submissions',
      name: 'Submissions',
      component: Submissions
    },
    {
      path: '/courses',
      name: 'Courses',
      component: Courses
    },
    {
      path: '/inbox',
      name: 'Inbox',
      component: Inbox
    },
    {
      path: '/email_verify/:token',
      name: 'EmailVerify',
      component: EmailVerify
    },
    {
      path: '/email_resend',
      name: 'EmailResend',
      component: EmailResend
    }
  ]
})
