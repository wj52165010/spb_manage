/***************** 弹窗封装类 *****************/
import 'lib/layer-v3.1.1/layer/theme/default/layer.css'
import 'layer'

class Dialog {
    msg(){
        layer.msg(...arguments);
    }

    close(){
        layer.close(...arguments);
    }

    open(){
        layer.open(...arguments);
    }

    confirm(){
        layer.confirm(...arguments);
    }

    full(){
        layer.full(...arguments);
    }
}


export default new Dialog();