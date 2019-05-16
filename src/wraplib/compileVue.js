import Vue from 'vue'


export default function compileVue(option){
    let s=this || {};
    let contentHtml=option.content || '';
    var res = Vue.compile(contentHtml);
    let tempV= new Vue({
        watch:option.watch || {},
        data:option.data || {},
        components:option.components || {},
        methods:option.methods || {},
        mounted:option.mounted || function(){},
        computed:option.computed || {},
        render: res.render,
        staticRenderFns: res.staticRenderFns,
        store:s.$store || option.store
    });

    tempV.$mount(option.el);

    return ()=> tempV.$destroy;
}