/*************************** 页面刷新混入对象(重置页面初始化数据,重置页面包含组件状态) ***************************/
export default{
    beforeMount(){
        let oriOptions=this.$vnode?this.$vnode.componentOptions.Ctor.options:{};
        
        if(!oriOptions.refresh  && (!this.$parent || !this.$parent.$children.$refresh)) return;//是否需要刷新功能
        //默认父组件包含刷新功能,则子组件默认继承刷新功能
        this.$children.$refresh=true;
        
    },
    mounted(){
        let oriOptions=this.$vnode?this.$vnode.componentOptions.Ctor.options:{};
        
        if(!oriOptions.refresh  && (!this.$parent || !this.$parent.$children.$refresh)) return;//是否需要刷新功能

        // this.$once('hook:beforeMount',()=>{
        //     //setTimeout(()=>{
        //         this._cloneData={...this.$data}
        //     //},0)
        // })

        let oldFunc = this.refresh || function(){},s=this;

        this.refresh=function(){
            //重置页面中所包含的组件
            s.$children.forEach(c=>c.refresh && c.refresh());
            Object.assign(s.$data,s._cloneData);
            oldFunc.apply(s,arguments);
        }
    },
}