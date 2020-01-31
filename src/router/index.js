import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import Problemset from '@/pages/problemset/Problemset'
import Problem from '@/pages/problemset/Problem'
import ProblemsManage from '@/pages/problemset/ProblemsManage/'
import Submissions from '@/pages/submissions/Submissions'
import Submission from '@/pages/submissions/Submission'
import Courses from '@/pages/courses/Courses'
import Course from '@/pages/courses/Course'
import CoursesAnnouncement from '@/pages/courses/element/CoursesAnnouncement'
import CoursesAnnouncementPost from '@/pages/courses/element/CoursesAnnouncementPost'
import CoursesHomework from '@/pages/courses/element/CoursesHomework'
import CoursesContest from '@/pages/courses/element/CoursesContest'
import CoursesDiscussion from '@/pages/courses/element/CoursesDiscussion'
import CoursesDiscussionPost from '@/pages/courses/element/CoursesDiscussionPost'
import CoursesScore from '@/pages/courses/element/CoursesScore'
import CoursesManage from '@/pages/courses/element/CoursesManage'
import Inbox from '@/pages/inbox/Inbox'
import EmailVerify from '@/pages/header/EmailVerify'
import EmailResend from '@/pages/header/EmailResend'
import Profile from '@/pages/header/Profile'
import Demo from '@/components/Demo'

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
      path: '/problems/manage',
      name: 'ProblemsManage',
      component: ProblemsManage
    },
    {
      path: '/problem/:id',
      name: 'Problem',
      component: Problem
    },
    {
      path: '/submissions',
      name: 'Submissions',
      component: Submissions
    },
    {
      path: '/submission/:id',
      name: 'Submission',
      component: Submission
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
        { path: 'announcement/:id', component: CoursesAnnouncementPost },
        { path: 'homework', component: CoursesHomework },
        { path: 'contest', component: CoursesContest },
        { path: 'discussion', component: CoursesDiscussion },
        { path: 'discussion/:id', component: CoursesDiscussionPost },
        { path: 'score', component: CoursesScore },
        { path: 'manage', component: CoursesManage},
      ],
      redirect: '/course/:name/announcement',
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
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/ui/demo',
      name: 'Demo',
      component: Demo
    }
  ]
})
