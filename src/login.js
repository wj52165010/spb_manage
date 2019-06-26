import Vue from 'vue'
import Login from './Login.vue'
import store from './store/store'
import AutoSer from './autoSer'

import 'assets/font-awesome-4.7.0/less/font-awesome.less'
import './theme/default/default.less'

Vue.config.productionTip = false

//注册全局ser实例分支
AutoSer.register();

new Vue({
  store,
  render: h => h(Login)
}).$mount('#login')
