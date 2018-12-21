/*************************** 全局注册混入对象(以.g.js作为判断依据需要全局注册的混合对象) *****************************/

import Vue from 'vue'
let mixinContext = require.context('@/mixins', false, /\.g\.js$/)

let importAll = (r) => {
  return r.keys().map(key => r(key));
}

export default{
    register(){
        importAll(mixinContext).forEach(m=>Vue.mixin(m.default));
    }
}