import Vue from 'vue'
import { Toast } from 'vant';
import App from './App.vue'
import { router } from './router'

Vue.config.productionTip = false

Vue.use(Toast);

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
