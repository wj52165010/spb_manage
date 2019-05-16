/*************************** 全局注册指令对象(以.g.js作为判断依据需要全局注册的混合对象) *****************************/
/* eslint-disable */
import Vue from 'vue'
let mixinContext = require.context('@/directives', false, /\.g\.js$/)

let importAll = (r) => {
    let reg=/([^<>/\\\|:""\*\?]+)\.\w+$/;//匹配文件名称

    return r.keys().map(key => { return {name:key.match(reg)[1].replace('.g',''),key,r}});
}

export default{
    register(){
        importAll(mixinContext).forEach(m=>Vue.directive(m.name,m.r(m.key).default));
    }
}