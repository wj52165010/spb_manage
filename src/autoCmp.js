/*************************** 全局自动注入组件对象 *****************************/
/* eslint-disable */
import Vue from 'vue'
let pageContext = require.context('@/modules', true, /\.g\.vue$/)

let importAll = (r) => { 
    let reg=/([^<>/\\\|:""\*\?]+)\.\w+$/;//匹配文件名称

    return r.keys().map(key => { return {name:key.match(reg)[1].replace('.g',''),key,r}});
}

export default{
    register(){
       
        importAll(pageContext).forEach(m=>{
            Vue.component(m.name,(resolve)=>resolve(m.r(m.key).default))
        });
    }
}