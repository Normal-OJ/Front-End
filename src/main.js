import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'

Vue.use(VueAxios, axios);
Vue.use(VueCookies);
Vue.config.productionTip = false;

import UiDialog from './components/UiDialog'
import UiButton from './components/UiButton'
import UiAlert from './components/UiAlert'
import UiCard from './components/UiCard'
Vue.component('ui-dialog', UiDialog);
Vue.component('ui-button', UiButton);
Vue.component('ui-alert', UiAlert);
Vue.component('ui-card', UiCard);

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
