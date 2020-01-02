import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import Problemset from '@/components/problemset/Problemset'
import Problem from '@/components/problemset/Problem'
import Submissions from '@/components/submissions/Submissions'
import Submission from '@/components/submissions/Submission'
import Courses from '@/components/courses/Courses'
import Course from '@/components/courses/Course'
import CoursesAnnouncement from '@/components/courses/element/CoursesAnnouncement'
import CoursesAnnouncementPost from '@/components/courses/element/CoursesAnnouncementPost'
import CoursesHomework from '@/components/courses/element/CoursesHomework'
import CoursesContest from '@/components/courses/element/CoursesContest'
import CoursesDiscussion from '@/components/courses/element/CoursesDiscussion'
import CoursesDiscussionPost from '@/components/courses/element/CoursesDiscussionPost'
import CoursesScore from '@/components/courses/element/CoursesScore'
import CoursesManage from '@/components/courses/element/CoursesManage'
import Inbox from '@/components/inbox/Inbox'
import EmailVerify from '@/components/header/EmailVerify'
import EmailResend from '@/components/header/EmailResend'
import Profile from '@/components/header/Profile'

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
    }
  ]
})
