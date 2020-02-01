import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#003865",
        secondary: "#93282C",
        success: "#4EB844",
        info: "#3584C9",
        warning: "#E08200",
        error: "#ff4343",
      },
    },
  },
});
