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

import UiDialog from './components/ui/UiDialog'
import UiButton from './components/ui/UiButton'
import UiAlert from './components/ui/UiAlert'
import UiPost from './components/ui/UiPost'
Vue.component('ui-dialog', UiDialog);
Vue.component('ui-button', UiButton);
Vue.component('ui-alert', UiAlert);
Vue.component('ui-post', UiPost);

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
