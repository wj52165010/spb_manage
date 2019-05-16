//主题混合对象

import theme from '@/enum/theme'

export default {
    methods:{
        //主题切换
        Theme(v){
            Object.values(theme).forEach((v)=>{
                $(`link[href="${v}"]`).remove();
            });
            _t.loadMulFile([theme[v]]);
        }
    }
}