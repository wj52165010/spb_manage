import {ListenClick} from 'event'
export default {
    bind(el,binding){
        let {arg,value} = binding;
        let close;

        //const func=new Function('$event',`with(this){ return ${expression}}`);
        switch(arg){
            case 'click':
                close = ListenClick(el,value);
                break;
        }

        el.closeListen=close;
    },
    unbind(el){
        el.closeListen && el.closeListen();
    }
}