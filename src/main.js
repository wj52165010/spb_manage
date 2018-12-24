import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Mixin from './mixin.js'
import AutoCmp from './autoCmp'

import 'bootstrap/scss/custom.scss'
import 'assets/fonticons/iconfont.css'
import './theme/default/default.less'
import 'assets/Animate.css'

Vue.config.productionTip = false

Vue.component('Atest', function (resolve) {

  require(['./views/Atest.g.vue'], resolve)
})
//注册全局混入对象
Mixin.register()
//注册页面组件自动全局注册
AutoCmp.register();


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
