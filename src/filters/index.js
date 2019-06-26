import Vue from 'vue'

export default ()=>{
    //时间转换器
    Vue.filter('time',function(value,format){
        if(value==0){ return '';}
        return _t.DateByTimestamp(value,format || 'yyyy-MM-dd hh:mm:ss')
    })

}




