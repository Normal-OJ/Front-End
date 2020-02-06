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
import UiCard from './components/ui/UiCard'
import ShowAnn from './components/ShowAnn'
import Creator from './components/Creator'
Vue.component('ui-dialog', UiDialog);
Vue.component('ui-button', UiButton);
Vue.component('ui-alert', UiAlert);
Vue.component('ui-card', UiCard);
Vue.component('ShowAnn', ShowAnn);
Vue.component('Creator', Creator);


new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
