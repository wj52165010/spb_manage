/***************** 弹窗封装类 *****************/
import Vue from 'vue'
import 'layer'
import 'lib/layer/theme/default/layer.css'

let Dialog={
    msg(){
        layer.msg(...arguments);
    },

    close(){
        layer.close(...arguments);
    },

    open(option){
        let s=this;
        let contentHtml=option.content || '';
        var res = Vue.compile(contentHtml);
        let tempV= new Vue({
            watch:option.watch || {},
            data:option.data || option.context ||{},
            components:option.components || {},
            methods:option.methods || {},
            mounted:option.mounted || function(){},
            computed:option.computed || {},
            render: res.render,
            staticRenderFns: res.staticRenderFns,
            store:s.$store
        });
        layer.open({
            type: 1,
            anim:0,
            zIndex:3000,
            skin:(option.skin || ''),  //加上边框'layui-dialog-rim '
            title:option.title || '',
            maxmin:option.maxmin || false,
            shade: [1, 'rgba(0,0,0,.6)'],
            id:option.id || '',
            area:option.area || 'auto', //宽高
            offset:option.offset || '',
            move:option.move==undefined?'.layui-layer-title':option.move,
            content: `<div id="content"></div>`,
            full:option.full ||function(){},
            restore:option.restore || function(){},
            sizeChange:option.sizeChange || function(){},
            success: function(layero, index){
                tempV.$mount(layero.find('#content')[0]);
                tempV.close=()=>{layer.close(index);this.cancel();};
                tempV.$caller=s;
                if(option.initMaxMin){layer.full(index);option.full && option.full();}
                if(option.success){option.success(layero, index);}
            },
            cancel:function(layero, index){
                if(option.pop_close){option.pop_close(layero, index);}
                tempV.$destroy();
                option=null;
                tempV=null;
                s=null;
            }
        });
    },

    confirm(){
        layer.confirm(...arguments);
    },

    full(){
        layer.full(...arguments);
    },
}


export default Dialog;