import Vue from 'vue'
import App from './App.vue'
import AutoCalender from '../packages/index.js'
// Vue.component('AutoCalender',AutoCalender)
Vue.use(AutoCalender)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
