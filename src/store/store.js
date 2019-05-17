import Vue from 'vue'
import Vuex from 'vuex'

import Login from './Login'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menus:[],//菜单集合
    MenuKind:[],//菜单类型
  },
  mutations: {

  },
  actions: {

  },
  modules:{
    Login
  }
})
