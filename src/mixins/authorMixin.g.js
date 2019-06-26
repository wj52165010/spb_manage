/************************** 权限配置 ***************************/

export default {
    beforeMount(){
        //setTimeout(()=>{
            let oriOptions=this.$vnode?this.$vnode.componentOptions.Ctor.options:{};
            let parentRole=this.$parent?this.$parent.$children.$role:this.$caller && this.$caller.$role;

            if(!oriOptions.role && !this.parent && !parentRole) return;

            this.$children.forEach(c=>c.$role=oriOptions.role || parentRole || this.parent.$role);
            this.$children.$role=oriOptions.role || parentRole || this.parent.$role;
            this.$role=this.$children.$role;
          
        //},0);
    }
}