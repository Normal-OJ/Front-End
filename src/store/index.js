import Vue from 'vue'
import Vuex from 'vuex'

function parseJwt (token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').data)
}

function setAvatar (payload) {
  var d = encodeURI('https://noj.tw/defaultAvatar.png')
  return `https://www.gravatar.com/avatar/${payload}?d=${d}`
}

export default new Vuex.Store({
  state: {
    isLogin: false,
    username: '',
    displayedName: '',
    bio: '',
    avatar: setAvatar('')
  },
  mutations: {
    getJwt (state) {
      const jwt = parseJwt(Vue.$cookies.get('jwt'))
      if (jwt) {
        state.isLogin = jwt.active
        state.username = jwt.username
        state.displayedName = jwt.profile.displayedName
        state.bio = jwt.profile.bio
        state.avatar = setAvatar(jwt.md5)
      }
    }
  }
})
