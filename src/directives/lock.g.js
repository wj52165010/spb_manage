import {ListenClick} from 'event'

import {Subject} from 'rxjs'
import {debounceTime} from 'rxjs/operators'

let bindFunc=(el,binding)=>{
    let {arg,value} = binding;
        let close;
        //const func=new Function('$event',`with(this){ return ${expression}}`);
        switch(arg){
            case 'click':
                close = ListenClick(el,value);
                break;
        }

        el.closeListen=close;
};

let unBindFunc=(el)=>{
    el.closeListen && el.closeListen.unsubscribe();
    
};

export default {
    bind(el,binding){
        bindFunc(el,binding);

        el.sub=new Subject();
        el.unSub=el.sub.pipe(debounceTime(200)).subscribe(({el,binding})=>{ 
            unBindFunc(el);
            bindFunc(el,binding);
        });
    },
    componentUpdated(el,binding){
        el.sub.next({el,binding})
    },
    unbind(el){
        unBindFunc(el);
        el.unSub.unsubscribe();
    }
}