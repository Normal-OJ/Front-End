import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import Problemset from '@/components/problemset/Problemset'
import Problems from '@/components/problemset/Problems'
import Submissions from '@/components/submissions/Submissions'
import Courses from '@/components/courses/Courses'
import Course from '@/components/courses/Course'
import CoursesAnnouncement from '@/components/courses/element/CoursesAnnouncement'
import CoursesHomework from '@/components/courses/element/CoursesHomework'
import CoursesContest from '@/components/courses/element/CoursesContest'
import CoursesDiscussion from '@/components/courses/element/CoursesDiscussion'
import CoursesScore from '@/components/courses/element/CoursesScore'
import CoursesManage from '@/components/courses/element/CoursesManage'
import Inbox from '@/components/inbox/Inbox'
import EmailVerify from '@/components/header/EmailVerify'
import EmailResend from '@/components/header/EmailResend'

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
      component: Courses,
    },
    {
      path: '/course/:name',
      name: 'Course',
      component: Course,
      children: [
        { path: 'announcement', component: CoursesAnnouncement },
        { path: 'homework', component: CoursesHomework },
        { path: 'contest', component: CoursesContest },
        { path: 'discussion', component: CoursesDiscussion },
        { path: 'score', component: CoursesScore },
        { path: 'manage', component: CoursesManage},
      ]
    },
    {
      path: '/inbox',
      name: 'Inbox',
      component: Inbox
    },
    {
      path: '/email_verify',
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
