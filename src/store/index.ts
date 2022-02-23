import Vue from 'vue'
import Vuex from 'vuex'
import { setAvatar } from '@/utils/utils'
import agent from '@/model/agent'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isFetching: false,
    isLogin: false,
    username: '',
    displayedName: '',
    role: -1,
    bio: '',
    email: '',
    avatar: setAvatar('')
  },
  actions: {
    async fetchUserData() {
      this.commit('switchFetching', true)
      try {
        const userData = (await agent.Auth.me()).data.data
        this.commit('updateJwt', userData)
      } finally {
        this.commit('switchFetching', false)
      }
    }
  },
  mutations: {
    switchFetching(state, isFetching) {
      state.isFetching = isFetching
    },
    updateJwt(state, { active, username, displayedName, bio, role, email, md5 }) {
      state.isLogin = active
      state.username = username
      state.displayedName = displayedName
      state.role = role
      state.bio = bio
      state.email = email
      state.avatar = setAvatar(md5)
    }
  }
})

export default store
