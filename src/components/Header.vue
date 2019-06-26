<!-- 头部页面插件 -->
<template>
    <div class="Header bgCol">
      <div class="header" onselectstart="return false">
        <div class="logo">
          <img class="user_img" @click="$emit('logoClick')" style="height:50px;cursor:pointer;" :src="`${baseUrl}${logo}`" />
        </div>
        <div class="info HeaderInfoBg">
          <div class="user">
            <ul>
              <li class="user_imgae"><img id="user_imgae" class="user_img" src="../assets/noperson.png" style="width:40px;height:40px;" /></li>
              <li class="user_info"><div class="user_info_name" :title="userInfo.name" :class="{simpleName:!userInfo.department}">{{userInfo.name}}</div><div class="user_info_desc" :title="userInfo.department">{{userInfo.department}}</div></li>
              </ul>

              <!--切换皮肤-->
              <div class="skin">
                <el-tooltip class="item" content="切换主题" placement="right" v-if="false">
                  <i class="fa fa-road"></i>
                </el-tooltip>

                <!--皮肤选择区域-->
                <div class="fadeIn skin_container">
                  <div class="item" @click="changeSkin('defTheme')" style="background-color:rgb(3, 171, 103);"></div>
                  <div class="item" @click="changeSkin('blueTheme')" style="background-color:#007acc;"></div>
                </div>
              </div>
          </div>
          <div class="setting" @click="settingMenu_click()" style="display:none;">
            <el-tooltip class="item" content="定制" placement="left">
              <i class="fa fa-cog fa-fw"></i>
              <div style="font-size:12px;">定制</div>
            </el-tooltip>
          </div>
          <div class="menu" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <i class="iconfont icon-list" style="font-size:25px;"></i>
            <div style="font-size:12px;">菜单</div>
            </div>
        </div>
        <!--历史导航栏-->
        <HNav :menu="historyMenu" @meunClick="menu_click" @menuDel="menu_del"></HNav>
        <!--工具栏-->
        <div id="toolbar-options" class="hidden">
            <a href="#" id="close"><i class="iconfont icon-guanbi"></i></a>
        </div>   
      </div>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import HNav from './HNav'
import 'lib/toolbar/jquery.toolbar.css'
import 'lib/toolbar/jquery.toolbar.min.js'

import {TriggerPageSwitch,NavPage,DelNavPage,AddHistoryMenu} from '@/store/Menu/types'
import {DelUserCookie} from '@/store/Login/types'

export default {
  name: 'Header',
  props:['logo'],
  components: {
    HNav
  },
  data () {
    return {
      baseUrl: process.env.BASE_URL,
      historyMenu:[
          // {id:1,type:'templatePage',name:'上网场所库',icon:'fa fa-search'},
          // {id:2,type:'templatePage',name:'实名人员库',icon:'fa fa-bullhorn'},
          // {id:3,type:'templatePage',name:'手机号码库',icon:'fa fa-gift'},
      ],
    }
  },
  computed:{
    ...mapState({
      userInfo:state=>state.Login.userInfo
    })
  },
  methods:{
    //历史菜单单击事件
    menu_click(menu){
      this.$store.commit(TriggerPageSwitch,menu);
      this.$store.commit(NavPage,{name:menu.type,id:menu.id,params:{model:menu},action:menu.action});
    },
    //历史菜单删除事件
    menu_del(menu){
      this.$store.commit(TriggerPageSwitch,menu);
      this.$store.commit(DelNavPage,{name:menu.type,id:menu.id,params:{model:menu}})
    },
    //配置菜单单击事件
    settingMenu_click(){
      this.$store.commit(AddHistoryMenu,{
          id:'settingPage',
          name:'系统定制',
          type:'Setting',//'settingPage',
          icon:'fa fa-cog fa-fw'
      });
     
    },
    mouseenter(){
      this.$emit('mouseenter');
    },
    mouseleave(){
      this.$emit('mouseleave');
    },
    //切换皮肤
    changeSkin(){
      
    }
  },
  mounted(){
    document.body.ondrag=document.body.oncontextmenu=function(){ return false;} 
    document.images.ondragstart=function (){return false;}
		document.images.onselectstart=function(){return false;}

    //初始化头部工具栏插件
    $(this.$el).find('#user_imgae').toolbar({
      content: '#toolbar-options',
      position: 'bottom'
    }).on('toolbarItemClick',(e,el)=>{
      let tag=$(el).attr('id');
      if(tag=='close'){//退出
        ser.LoginOut(_t.cookie.get('account')).then(res=>{
          if(!_t.msg(res,'','退出失败!'))return;
          
          this.$store.dispatch(DelUserCookie);
          window.location='login.html';
        });
      }
    });

  }
}
</script>

<style lang="less" scoped>
.Header{
    width:100%;height:60px;
}

@titleW:270px;
@infoW:420px;

.header{height:100%;width:100%;text-align:left;position:
        relative;-moz-user-select: none; -webkit-user-select: none;  -webkit-user-drag: none;
        -ms-user-select:none;-ms-user-drag:none;-khtml-user-select:none;-khtml-user-drag:none;
        .border('bottom');
        }
/*系统标题*/
.header .logo{float:left;color:white;width:@titleW;text-align:center;padding-top:5px;}
.header .title{font-size:16px;}
.header .title .titleInfo{color:#03c1d7;font-style: italic;}
.header .title .titleExtra{color:#98e32c;font-style: italic;}
.header .extra_title{font-size: 12px;font-style: italic;margin-top:-5px;}
/*系统信息栏*/

@menBtnW:75px;

.header .info{float:right;height:100%;width:@infoW;}
.header .info .user{float:left;width:~'calc(100% - @{menBtnW})';height:100%;position:relative;color:white;}
.header .info .user ul{list-style:none;padding:10px;padding-right:0px;margin:0px;height:100%;width:100%;box-sizing: border-box;}
.header .info .user ul li{float:left;height:100%;}
.header .info .user ul .user_img{border-radius:50%;}
.header .info .user ul li .user_info_desc{font-size:12px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.header .info .user ul li .user_info_name{font-weight:600;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;font-size:14px;}
.header .info .user ul .user_info{padding-left:15px;width: calc(100% - 60px);}

.header .info .menu{width:@menBtnW;float: right;.border('left',rgba(0, 0, 0, 0.125));height:100%;text-align:center;font-size:25px;cursor:pointer;color:white;padding-top:5px;box-sizing:border-box;}
.header .info .setting{float: left;width: 19%;.border('left');height:100%;text-align:center;font-size:25px;cursor:pointer;}

.simpleName{margin-top:10px;}

.Header .info .user .skin{position:absolute;right:10px;top:5px;}

.Header .info .user .skin:hover{cursor:pointer;}

@skin_containerW:50px;
.Header .info .user .skin .skin_container{
  display:none;
  position:absolute;width:@skin_containerW;height:20px;right:0px;
  border-radius:5px;overflow:hidden;
}

.Header .info .user .skin:hover .skin_container{display:block;}

.Header .info .user .skin .skin_container .item{float:left;width:50%;height:20px;}

.Header .info .user .skin .skin_container .item:hover{cursor:pointer;}

#close {text-decoration:none;color:white;}
</style>