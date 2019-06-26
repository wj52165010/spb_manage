<!-- 页面切换插件 -->
<template>
    <transition name="fade">
      <keep-alive :include="pagesIds">
        <component :is="view.name" :params="view.params || {}" :action="view.action" v-on="$listeners" ref="pages"></component>
      </keep-alive>
    </transition>
</template>

<script>
import {subResize} from '@/wraplib/event'
export default {
  name: 'PageSwitch',
  data(){
    return {
      pages:[],
      view:{},
      pagesIds:[],
    }
  },
  methods:{
    show(page){
       let index =_.findIndex(this.pages,p=>p.id==page.id);
       if(index<0) {this.pages.push(page),this.pagesIds.push(page.name)}

       this.$nextTick(()=>{
         this.view=page;
         
         this.$nextTick(()=>{
          if(this.$refs.pages && this.$refs.pages.layout)this.$refs.pages.layout();
          setTimeout(()=>{
            subResize.next(null)
          },100)
         })
         
       });
    },
    del(page){
       let index = _.findIndex(this.pages,p=>p.id==page.id);
       if(index>=0){this.pages.splice(index,1);this.pagesIds.splice(index,1);}
       this.view=this.pages[0] || '';
    },
    refresh(){
      if(!(this.$refs.pages && this.$refs.pages.refresh))return;
      this.$refs.pages.refresh();
    }
  }
}
</script>

<style lang="less" scoped>

.fade-enter-active{
  transition: opacity .2s;
}
.fade-enter{
  opacity: 0;
}
.fade-leave-to{
  display:none;
}
</style>