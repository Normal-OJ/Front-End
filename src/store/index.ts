import Vue from 'vue'
import Vuex from 'vuex'
import { setAvatar } from '@/utils/utils'

Vue.use(Vuex)

function parseJwt (token) {
  return JSON.parse(atob(token.split('.')[1])).data
}

const store = new Vuex.Store({
  state: {
    isLogin: false,
    username: '',
    displayedName: '',
    role: -1,
    bio: '',
    email: '',
    avatar: setAvatar('')
  },
  mutations: {
    updateJwt (state) {
      const jwt = parseJwt(Vue.$cookies.get('jwt'))
      if (jwt) {
        state.isLogin = jwt.active
        state.username = jwt.username
        state.displayedName = jwt.profile.displayedName
        state.role = jwt.role
        state.bio = jwt.profile.bio
        state.email = jwt.email
        state.avatar = setAvatar(jwt.md5)
      }
    }
  }
})

export default store
