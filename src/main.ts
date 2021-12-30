import Vue from 'vue'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import agent from './model/agent'
import dayjsPlugin from './utils/dayjsPlugin'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import UiDialog from './components/ui/UiDialog.vue'
import UiButton from './components/ui/UiButton.vue'
import UiAlert from './components/ui/UiAlert.vue'
import UiPost from './components/ui/UiPost.vue'

// use cookie package
Vue.use(VueCookies)

// setup axios
Vue.prototype.$agent = agent

// use custom dayjs plugin
Vue.use(dayjsPlugin)

Vue.config.productionTip = false

// globally register custom component
Vue.component('ui-dialog', UiDialog)
Vue.component('ui-button', UiButton)
Vue.component('ui-alert', UiAlert)
Vue.component('ui-post', UiPost)

Sentry.init({
  Vue,
  enabled: process.env.NODE_ENV === 'production' && process.env.VUE_APP_SENTRY_DSN,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['noj.tw']
    })
  ],
  tracesSampleRate: 0.6,
  logErrors: true
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
