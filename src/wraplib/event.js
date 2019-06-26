/****************************** Eventjs封装包 ***************************/

import {fromEvent,Subject} from 'rxjs'
import {debounceTime,map} from 'rxjs/operators'

let regEvent={};
export let subResize=new Subject();
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
        ()=>subResize.subscribe(cb),
        ()=>fromEvent(window,'resize').pipe(debounceTime(200)).subscribe(e=>subResize.next(e))
    )
}

//页面鼠标移动事件
export const ListenMouseMove=(cb)=>{

    return EventMap('mousemove',
        (o)=>o.subscribe(cb),
        ()=>fromEvent(window,'mousemove')
    )
}

//页面元素单击事件(节流阀)
export const ListenClick = (dom,cb)=>{
    return fromEvent(dom,'click')
           .pipe(map(e=>{
                if (e.stopPropagation){
                    e.stopPropagation(); 
                }else{
                    e.cancelBubble=true;
                }
                return e;
            }))
           .pipe(debounceTime(200))
           .subscribe(cb);
}
