/*************************** 全局自动ser分支对象 *****************************/
/* eslint-disable */
import {server} from '@/wraplib/server/server'
let pageContext = require.context('@/wraplib/server', true, /\.g\.js$/)

let importAll = (r) => { 
    let reg=/([^<>/\\\|:""\*\?]+)\.\w+$/;//匹配文件名称

    return r.keys().map(key => { return {name:key.match(reg)[1].replace('.g',''),key,r}});
}

export default{
    register(){
       
        importAll(pageContext).forEach(m=>{
            server.prototype=Object.assign(server.prototype,m.r(m.key).default);
        });
    }
}