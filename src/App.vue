<template>
  <div id="app" class="app">
    <Header :logo="logo" @mouseleave="menu_mouseleave" @mouseenter="menu_mouseenter"/>
    <div class="app_content" style="height:calc(100% - 60px);width:100%;position:relative;">
      <PageSwitch ref="PageSwitch" @ShowPage="showPage" />
      <div class="menu_c_container" :class="{active:blnShowMenu}"><SideMenu ref="SideMenu" @Blnshow="blnShow" @LinekPage="LinekPage"></SideMenu></div>
    </div>
    <!--<Footer />-->

  </div>
</template>

<script>
import Vue from 'vue'
import compileVue from '@/wraplib/compileVue' 

import themeMixin from '@/mixins/themeMixin'
import PageSwitch from '@/components/PageSwitch'
import SideMenu from '@/components/SideMenu'
import Header from '@/components/Header'

//import Footer from '@/components/Footer'
import UI from 'lib/ui'

import {BaseType,SocketToken} from '@/store/types'
//import {GetUser} from '@/store/Login/types'
import {GetMenuKind,RegNavPage,RegPageRefresh,RegDelNavePage} from '@/store/Menu/types'
import {GetUserCookie} from '@/store/Login/types'

export default {
  name: 'App',
  mixins:[themeMixin],
  components:{PageSwitch,Header,SideMenu},
  beforeCreate(){
    //注册弹窗插件的到VUE对象原型链上以便获取上级对象上下文(在main.js文件中注册时，编译时会有警告提示,因此把此操作放到这里来处理)
    Object.keys(dialog).forEach(k=>Vue.prototype[`$${k}`]=dialog[k]);
    //注册全局vue模板编译函数
    Vue.prototype[`$compileVue`]=compileVue;

    //监听用户Token失效(sokect)
    this.$store.dispatch(SocketToken);
    //注册全局UI框架组件
    UI.register();

    //获取登录用户信息
    this.$store.dispatch(GetUserCookie)

  },
   data () {
    return {
      blnShowMenu:false,
      popMenu:null,
      showPopMenu:false,
      comSet:{},//通用配置
      logo:'logo_main.png'
    }
  },
  mounted(){

    //获取通用配置
    // ser.WebSetting().then(res=>{
    //   this.comSet=res.biz_body;
    // });

    //获取全局基础类型
    this.$store.dispatch(BaseType);

    //获取当前登录用户信息
    //this.$store.dispatch(GetUser,ser.baseBag.userid);

    //注册页面跳转方法
    this.$store.commit(RegNavPage,this.showPage);

    //注册页面刷新方法
    this.$store.commit(RegPageRefresh,this.$refs.PageSwitch.refresh);

    //注册页面删除方法
    this.$store.commit(RegDelNavePage,this.$refs.PageSwitch.del);

    //获取菜单类型
    this.$store.dispatch(GetMenuKind).then(menus=>{
      // let menus=res || [{
      //           type:"HomePage",
      //           blnShow:1,
      //           icon: "fa fa-home",
      //           keyid:'1232sdfdsffdsfds',
      //           fixed:true,
      //           name:'首页',
      //           orderby:6
      //       }];
      _.chain(menus).filter(m=>m.fixed).each(m=>{
        this.$refs.SideMenu.item_click(m);
      })
    
    });

  },
  methods:{
    menu_mouseenter(){
      this.blnShowMenu=true;
    },
    menu_mouseleave(){
      this.blnShowMenu=false;
    },
    blnShow(flag){
      this.blnShowMenu=flag;
    },
    showPage(view){
      this.$refs.PageSwitch.show(view);
    },
    LinekPage(menu){
      this.popMenu=menu;
      this.showPopMenu=true;
    },
  }

}
</script>
<style lang="less">
html,
body,
.app {
  font-family: 微软雅黑 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:white;
  padding:0px;
  margin:0px;
  height:100%;
  width:100%;
  overflow:hidden;
  font-size:14px;
  position:relative;
}


.menu_c_container{position: absolute;width: 75px;height: 100%;top: 0px;right: -80px;z-index: 1000;.transLine(.3s);}
.menu_c_container:hover,
.menu_c_container.active{right:0px;}

.app_content{
  background-image: url('./assets/page_bg.jpg');
  background-size:100% 100%;
  padding:25px;
  box-sizing: border-box;
}
</style>
