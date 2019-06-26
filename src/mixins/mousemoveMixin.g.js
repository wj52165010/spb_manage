/*************************** 页面鼠标移动全局混合对象 ***************************/
import {ListenMouseMove} from 'event'
export default {
    mounted(){
        if(!this.MouseMoveHandler) return;
        let listenClose = ListenMouseMove((e)=>{
            this.MouseMoveHandler(e);
        })

        this.$once('hook:beforeDestroy', function () {
            listenClose()
        });
      
    }
}