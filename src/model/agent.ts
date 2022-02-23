import axios from 'axios'
import config from '@/constants/config'

// create axios instance with baseurl
export const fetcher = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
})

fetcher.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error && error.response) {
      // FIXME: catch Authorization Expired here
      // expected to logout
      throw error.response.data
    }
    throw error
  }
)

const Auth = {
  signin: (body) => fetcher.post('/auth/session', body),
  signout: () => fetcher.get('/auth/session'),
  signup: (body) => fetcher.post('/auth/signup', body),
  check: (type, body) => fetcher.post(`/auth/check/${type}`, body),
  activate: (body) => fetcher.post('/auth/active', body),
  recoveryPassword: (body) => fetcher.post('/auth/password-recovery', body),
  resendEmail: (body) => fetcher.post('/auth/resend-email', body),
  changePassword: (body) => fetcher.post('/auth/change-password', body),
  me: () => fetcher.get('/auth/me')
}

const Course = {
  getInfo: (name) => fetcher.get(`/course/${name}`),
  getList: () => fetcher.get('/course'),
  create: (body) => fetcher.post('/course', body),
  modify: (name, body) => fetcher.put(`/course/${name}`, body),
  delete: (name, body) => fetcher.delete(`/course/${name}`, {
    headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body
  }),
  getAnns: (name) => fetcher.get(`/course/${name}/ann`),
  getHomeworks: (name) => fetcher.get(`/course/${name}/homework`),
  getGrade: (name, user) => fetcher.get(`/course/${name}/grade/${user}`),
  createGrade: (name, user, body) => fetcher.post(`/course/${name}/grade/${user}`, body),
  deleteGrade: (name, user, body) => fetcher.delete(`/course/${name}/grade/${user}`, {
    headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body
  })
}

const SystemAnn = {
  getList: () => fetcher.get('/ann'),
  getInfo: (id) => fetcher.get(`/ann/${id}`)
}

const Ann = {
  getInfo: (name, id) => fetcher.get(`/ann/${name}/${id}`),
  create: (body) => fetcher.post('/ann', body),
  modify: (body) => fetcher.put('/ann', body),
  delete: (body) => fetcher.delete('/ann', {
    headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body
  })
}

const Homework = {
  getInfo: (id) => fetcher.get(`/homework/${id}`),
  create: (body) => fetcher.post('/homework', body),
  modify: (id, body) => fetcher.put(`/homework/${id}`, body),
  delete: (id) => fetcher.delete(`/homework/${id}`, {
    headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' }
  })
}

const Post = {
  getInfo: (name, id) => fetcher.get(`/post/view/${name}/${id}`),
  getList: (name) => fetcher.get(`/post/${name}`),
  create: (body) => fetcher.post('/post', body),
  modify: (body) => fetcher.put('/post', body),
  delete: (body) => fetcher.delete('/post', {
    headers: { 'Content-Type': 'application/json' },
    data: body
  })
}

const Problem = {
  getInfo: (id) => fetcher.get(`/problem/view/${id}`),
  getList: (params) => fetcher.get('/problem', { params }),
  getHighScore: (id) => fetcher.get(`/problem/${id}/high-score`),
  create: (body) => fetcher.post('/problem/manage', body),
  modify: (id, body) => fetcher.put(`/problem/manage/${id}`, body),
  modifyTestcase: (id, body) => fetcher.put(`/problem/manage/${id}`, body, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getManage: (id) => fetcher.get(`/problem/manage/${id}`),
  getTestcase: (id) => fetcher.get(`/problem/${id}/testcase`),
  delete: (id) => fetcher.delete(`/problem/manage/${id}`),
  downloadTestcaseUrl: (id) => `${config.API_BASE_URL}/problem/${id}/testcase`
}

const Submission = {
  getInfo: (id) => fetcher.get(`/submission/${id}`),
  getList: (params) => fetcher.get('/submission', { params }),
  create: (body) => fetcher.post('/submission', body),
  modify: (id, body) => fetcher.put(`/submission/${id}`, body, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  grade: (id, body) => fetcher.put(`/submission/${id}/grade`, body),
  comment: (id, body) => fetcher.put(`/submission/${id}/comment`, body),
  rejudge: (id) => fetcher.get(`/submission/${id}/rejudge`)
}

const Profile = {
  getInfo: () => fetcher.get('/profile'),
  create: (body) => fetcher.post('/profile', body),
  modifyConfig: (body) => fetcher.put('/profile/config', body)
}

const Inbox = {
  getInbox: () => fetcher.get('/inbox'),
  getSent: () => fetcher.get('/inbox/sent'),
  compose: (body) => fetcher.post('/inbox', body),
  read: (body) => fetcher.put('/inbox', body),
  delete: (url, body) => fetcher.delete(`/inbox${url}`, {
    headers: { Accept: 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body
  })
}

const Ranking = {
  getInfo: () => fetcher.get('/ranking')
}

const Copycat = {
  get: (params) => fetcher.get('/copycat', { params }),
  create: (body) => fetcher.post('/copycat', body)
}

export default {
  Auth,
  Course,
  SystemAnn,
  Ann,
  Homework,
  Post,
  Problem,
  Submission,
  Profile,
  Inbox,
  Ranking,
  Copycat
}
