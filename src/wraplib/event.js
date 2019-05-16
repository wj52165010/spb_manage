/****************************** Eventjs封装包 ***************************/

import {fromEvent} from 'rxjs'
import {debounceTime} from 'rxjs/operators'

let regEvent={};
//事件映射处理
let EventMap=(eventName,truecb,falsecb)=>{
        if(!regEvent[eventName]){
            regEvent[eventName]=falsecb()
        }
        
        let res= truecb(regEvent[eventName]);
        return ()=>{
            res.unsubscribe();
        }
    };

//页面大小改变事件(注册或监听)
export const ListenResize = (cb)=>{

    return EventMap('resize',
        (o)=>o.subscribe(cb),
        ()=>fromEvent(window,'resize').pipe(debounceTime(200))
    )
}

//页面元素单击事件(节流阀)
export const ListenClick = (dom,cb)=>{
    return fromEvent(dom,'click')
           .pipe(debounceTime(200))
           .subscribe(cb)
           .unsubscribe;
}
