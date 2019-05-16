<template>
  <div id="app" class="app">
    <!--<router-view/>-->
    <EWMap />
  </div>
</template>

<script>
import Vue from 'vue'
import compileVue from '@/wraplib/compileVue' 

import EWMap from '@/modules/EW_analysis/EW_Map'

export default {
  name: 'App',
  components:{EWMap},
  created(){
    //注册弹窗插件的到VUE对象原型链上以便获取上级对象上下文(在main.js文件中注册时，编译时会有警告提示,因此把此操作放到这里来处理)
    Object.keys(dialog).forEach(k=>Vue.prototype[`$${k}`]=dialog[k]);
    //注册全局vue模板编译函数
    Vue.prototype[`$compileVue`]=compileVue;
  },

}
</script>
<style lang="less">
html,
body,
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding:0px;
  margin:0px;
  height:100%;
  width:100%;
  overflow:hidden;
}
</style>
