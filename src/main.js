import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Mixin from './mixin.js'

import 'bootstrap/scss/custom.scss'
import 'assets/fonticons/iconfont.css'
import './theme/default/default.less'

Vue.config.productionTip = false

//注册全局混入对象
Mixin.register()


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
