import Vue from 'vue'

const Auth = {
  signin: (body) => Vue.axios.post('/auth/session'),
  signout: () => Vue.axios.get('/auth/session'),
  signup: (body) => Vue.axios.post('/auth/signup', body),
  check: (type, body) => Vue.axios.post(`/auth/checl/${type}`, post),
  activate: (body) => Vue.axios.post('/auth/active', body),
  recoveryPassword: (body) => Vue.axios.post('/auth/password-recovery', body),
  resendEmail: (body) => Vue.axios.post('/auth/resend-email', body),
  changePassword: (body) => Vue.axios.post('/auth/change-password', body),
}

const Course = {
  getInfo: (name) => Vue.axios.get(`/course/${name}`),
  getList: () => Vue.axios.get('/course'),
  create: (body) => Vue.axios.post('/course', body),
  modify: (name, body) => Vue.axios.put(`/course/${name}`, body),
  delete: (name, body) => Vue.axios.delete(`/course/${name}`, {
    headers: { 'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body,
  }),
  getAnns: (name) => Vue.axios.get(`/course/${name}/ann`),
  getHomeworks: (name) => Vue.axios.get(`/course/${name}/homework`),
  getGrade: (name, user) => Vue.axios.get(`/course/${name}/grade/${user}`),
  createGrade: (name, user, body) => Vue.axios.post(`/course/${name}/grade`/${user}, body),
  deleteGrade: (name, user, body) => Vue.axios.delete(`/course/${name}/grade/${user}`, {
    headers: { 'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body,
  }),
}

const SystemAnn = {
  getList: () => Vue.axios.get('/ann'),
  getInfo: (id) => Vue.axios.get(`/ann/${id}`),
}

const Ann = {
  getInfo: (name, id) => Vue.axios.get(`/ann/${name}/${id}`),
  create: (body) => Vue.axios.post('/ann', body),
  modify: (body) => Vue.axios.put('/ann', body),
  delete: (body) => Vue.axios.delete('/ann', {
    headers: { 'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body,
  }),
}

const Homework = {
  getInfo: (id) => Vue.axios.get(`/homework/${id}`),
  create: (body) => Vue.axios.post('/homework', body),
  modify: (id, body) => Vue.axios.put(`/homework/${id}`, body),
  delete: (id) => Vue.axios.delete(`/homework/${id}`, {
    headers: { 'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json' },
  }),
}

const Post = {
  get: (name, id) => Vue.axios.get(`/post/view/${name}/${id}`),
  getPosts: (name) => Vue.axios.get(`/post/${name}`),
  create: (body) => Vue.axios.post('/post', body),
  modify: (body) => Vue.axios.put('/post', body),
  delete: (body) => Vue.axios.delete('/post', {
    headers: { 'Content-Type': 'application/json' },
    data: body,
  }),
}

const Problem = {
  getInfo: (id) => Vue.axios.get(`/problem/view/${id}`),
  getList: (params) => Vue.axios.get('/problem', { params }),
  getHighScore: (id) => Vue.axios.get(`/problem/${id}/high-score`),
  create: (body) => Vue.axios.post('/problem/manage', body),
  modify: (id, body) => Vue.axios.put(`/problem/manage/${id}`, body),
  getManage: (id) => Vue.axios.get(`/problem/manage/${id}`),
  getTestcase: (id) => Vue.axios.get(`/problem/${id}/testcase`),
  delete: (id) => Vue.axios.delete('/problem/manage', {
    headers: { 'Content-Type': 'application/json' },
  }),
}

const Submission = {
  getInfo: (id) => Vue.axios.get(`/submission/${id}`),
  getList: (params) => Vue.axios.get('/submission', { params }),
  create: (body) => Vue.axios.post('/submission', body),
  modify: (id, body) => Vue.axios.put(`/submission/${id}`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  grade: (id, body) => Vue.axios.put(`/submission/${id}/grade`, body),
  comment: (id, body) => Vue.axios.put(`/submission/${id}/comment`, body),
  rejudge: (id) => Vue.axios.get(`/submission/${id}/rejudge`),
}

const Profile = {
  getInfo: () => Vue.axios.get('/profile'),
  create: (body) => Vue.axios.post('/profile', body),
  modifyConfig: (body) => Vue.axios.put('/profile/config', body),
}

const Inbox = {
  getInbox: () => Vue.axios.get('/inbox'),
  getSent: () => Vue.axios.get('/inbox/sent'),
  compose: (body) => Vue.axios.post('/inbox', body),
  read: (body) => Vue.axios.put('/inbox', body),
  deleteInbox: (body) => Vue.axios.delete('/inbox', {
    headers: { 'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body,
  }),
  deleteSent: (body) => Vue.axios.delete('/inbox/sent', {
    headers: { 'Accept': 'application/vnd.hal+json', 'Content-Type': 'application/json' },
    data: body,
  }),
}

const Ranking = {
  getInfo: () => Vue.axios.get('/ranking'),
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
}
