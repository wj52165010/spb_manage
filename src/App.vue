<template>
  <div id="app" class="app">
    <Header />
    <div style="height:calc(100% - 100px);width:100%;">
      <PageSwitch ref="PageSwitch" @ShowPage="showPage" />
    </div>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import compileVue from '@/wraplib/compileVue' 

import themeMixin from '@/mixins/themeMixin'
import PageSwitch from '@/components/PageSwitch'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: 'App',
  mixins:[themeMixin],
  components:{PageSwitch,Header,Footer},
  created(){
    //注册弹窗插件的到VUE对象原型链上以便获取上级对象上下文(在main.js文件中注册时，编译时会有警告提示,因此把此操作放到这里来处理)
    Object.keys(dialog).forEach(k=>Vue.prototype[`$${k}`]=dialog[k]);
    //注册全局vue模板编译函数
    Vue.prototype[`$compileVue`]=compileVue;
  },
  mounted(){
    this.showPage('EW_Map');
  },
  methods:{
    showPage(viewName){
      this.$refs.PageSwitch.show(viewName);
    }
  }

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
