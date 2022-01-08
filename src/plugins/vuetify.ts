import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#003865',
        secondary: '#93282C',
        success: '#4EB844',
        info: '#3584C9',
        warning: '#E08200',
        error: '#ff4343',
        code: '#bd4147',
        gray: colors.grey.base,
      },
      dark: {
        primary: '#6cb1cc',
        secondary: '#c2958f',
        success: '#178C1B',
        info: '#5cb3bf',
        warning: '#994E03',
        error: '#C4505D',
        code: '#FAF9F2',
        gray: colors.grey.base,
      }
    }
  }
})
