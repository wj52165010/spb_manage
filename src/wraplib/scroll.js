//滚动插件封装类
import 'lib/sly/sly.js'
export default class Scroll{
    constructor(frame, options, callbackMap){
      this.ins =  new Sly(frame, options, callbackMap);
      this.rel=this.ins.rel;

    }

    init(){ this.ins.init(...arguments);    }

    reload(){ this.ins.reload(...arguments); }

    destroy(){ this.ins.destroy(...arguments);}

    slideTo(){ this.ins.slideTo(...arguments);}

    slideBy(){ this.ins.slideBy(...arguments);}

    toStart(){ this.ins.toStart(...arguments);}

    toCenter(){ this.ins.toCenter(...arguments);}

    toEnd(){ this.ins.toEnd(...arguments);}

    moveBy(){ this.ins.moveBy(...arguments);}

    stop(){ this.ins.stop(...arguments);}

    activate(){ this.ins.activate(...arguments);}

    prev(){ this.ins.prev(...arguments);}

    next(){ this.ins.next(...arguments);}

    on(){ this.ins.on(...arguments);}
    
    off(){ this.ins.off(...arguments);}
}