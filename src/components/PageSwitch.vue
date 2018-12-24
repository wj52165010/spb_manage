<!-- 页面切换插件 -->
<template>
    <transition name="fade">
      <keep-alive :include="pages">
        <component :is="view"></component>
      </keep-alive>
    </transition>
</template>

<script>
export default {
  name: 'PageSwitch',
  data(){
    return {
      pages:[],
      view:''
    }
  },
  methods:{
    show(page){
       if(this.pages.indexOf(page)<0) this.pages.push(page);
       this.view=page;
    },
    del(page){
       let index = this.pages.indexOf(page);
       if(index>=0){this.pages.splice(index,1);}
       this.view=this.pages[0] || '';
    }
  }
}
</script>

<style lang="less" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>