/*************************** 页面大小改变全局混合对象(自动注册页面大小改变事件) ***************************/
import {ListenResize} from 'event'
export default {
    mounted(){
        if(!this.ResizeHandler) return;
        let listenClose = ListenResize(()=>{
            this.ResizeHandler();
        })
      
        this.$once('hook:beforeDestroy', function () {
            listenClose()
        });
      
    }
}