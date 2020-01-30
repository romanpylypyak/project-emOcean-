import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './quasar'
import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
