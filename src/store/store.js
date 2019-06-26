import Vue from 'vue'
import Vuex from 'vuex'

import * as types from './types'

import Login from './Login'
import Menu from './Menu'
import UserManage from './UserManage'
import SiteManage from './SiteManage'
import AttentPerson from './IdentityLib/AttentPerson'
import Export from './Export'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menus:[],//菜单集合
    MenuKind:[],//菜单类型
    BaseData:{},//全局基础对象
  },
  mutations: {
    
  },
  actions: {
    //加载网站基础类型
    async [types.BaseType]({state}){
      let baseData={};
      let baseDataKind=[
        'netsite_type',           //场所类型
        'business_state',         //场所经营类型
        'online_state',           //场所设备在离线状态
        'equipment_type',         //设备类型
        'certificate_type',       //证件类型
        'account_type',           //虚拟身份类型
        //'microprobe_type',        //所有数据来源
        'microprobe_web_type',    //数据来源
      ];

      baseData['Firms'] = _.invert((await ser.GetFirmsCollect()).biz_body);

      let serData=_.map(baseDataKind,b=>ser.GetVariousData(b));

      var i=0;
      for await (let x of serData) {
        baseData[baseDataKind[i]=='microprobe_web_type'?'microprobe_type':baseDataKind[i]]=_.invert(x.biz_body);
        i=i+1;
      }

      state.BaseData=baseData;
      
    },
    //监听Token失效socket
    [types.SocketToken](){
      let url=window.url.replace('http:','').replace('https:','');
      var ws = new WebSocket(`ws:${url}/websocket`);

      ws.onmessage = function(message) {
        if(!message) return;
        if(message.data=='连接成功') return;
        let msg=JSON.parse(message.data);
        switch(msg.key){
          case 'loginout'://token失效退出到登录界面
            if(ser.baseBag.token==msg.token){
              _t.info('Token失效,页面将在5秒后自动退出!');

              setTimeout(()=>{
                window.location='login.html';
              },5000)
            }
            break;
        }
      }
    }
  },
  modules:{
    Login,
    Menu,
    UserManage,
    SiteManage,
    AttentPerson,
    Export
  }
})
