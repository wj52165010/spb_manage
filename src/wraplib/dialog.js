/***************** 弹窗封装类 *****************/
import 'layer'
import 'lib/layer/theme/default/layer.css'

let Dialog={
    msg(){
        layer.msg(...arguments);
    },

    close(){
        layer.close(...arguments);
    },

    open(){
        layer.open(...arguments);
    },

    confirm(){
        layer.confirm(...arguments);
    },

    full(){
        layer.full(...arguments);
    },
}


export default Dialog;