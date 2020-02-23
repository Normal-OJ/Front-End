import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import SysAnn from '@/pages/home/SysAnn'
import Problem from '@/pages/problem/Problem'
import Submission from '@/pages/submission/Submission'
import Courses from '@/pages/courses/Courses'
import Course from '@/pages/courses/Course'
import CoursesAnnouncement from '@/pages/courses/announcements/Announcement'
import CoursesAnnouncements from '@/pages/courses/announcements/Announcements'
import CoursesHomeworks from '@/pages/courses/homeworks/Homeworks'
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
      component: Problem
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
        { path: 'announcements', component: CoursesAnnouncements },
        { path: 'announcement/:id', component: CoursesAnnouncement },
        { path: 'homeworks', component: CoursesHomeworks },
        { path: 'problems', component: CoursesProblems },
        { path: 'submissions', component: CoursesSubmissions },
        { path: 'discussions', component: CoursesDiscussions },
        { path: 'discussion/:id', component: CoursesDiscussion },
        { path: 'grades', component: CoursesGrades },
        { path: 'manages', component: CoursesManages },
      ],
      redirect: '/course/:name/announcements',
    },
    {
      path: '/inbox',
      name: 'Inbox',
      component: Inbox
    },
    {
      path: '/about',
      name: 'About',
      component: About
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
    },
  ]
})
