/*************************** 页面刷新混入对象(重置页面初始化数据,重置页面包含组件状态) ***************************/
export default{
    mounted(){
        if(!this.$blnRefresh) return;//是否需要刷新功能
        
        this.$once('hook:mounted',()=>{
            setTimeout(()=>{
                this._cloneData={...this.$data}
            },0)
        })

        let oldFunc = this.refresh || function(){},s=this;

        this.refresh=function(){
            //重置页面中所包含的组件
            s.$children.forEach(c=>c.refresh && c.refresh());
            
            Object.assign(s.$data,s._cloneData);
            oldFunc.apply(s,arguments);
        }
    },
}