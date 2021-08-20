import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const API_BASE_URL = '/api'

export function apiSetup() {
  Vue.use(VueAxios, axios)
  Vue.axios.defaults.baseURL = API_BASE_URL
  Vue.axios.interceptors.response.use(
    res => res,
    error => {
      if (error && error.response && error.response.data) {
        // TODO: catch Authorization Expired
        throw error.response.data
      }
      throw error
    },
  )
}
