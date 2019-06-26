/* eslint-disable */
/**
 * 菜单
 */
import * as types from './types'
import {Subject} from 'rxjs'

const state={
  menuKind:[],//菜单类型
  menus:[
    // {
    //     title:'测试',
    //     menus:[
    //         {
    //             type:"HomePage",
    //             blnShow:0,
    //             icon: "fa fa-home",
    //             keyid:'1232sdfdsffdsfds',
    //             fixed:true,
    //             name:'首页',
    //             orderby:6
    //         },
    //         {
    //             type:"UserManagePage",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232sdfdsf',
    //             name:'用户测试',
    //             orderby:6
    //         },
    //         {
    //             type:"IdentityLib",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232543341',
    //             name:'身份库',
    //             orderby:5
    //         },
    //         {
    //             type:"EW_analysis",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232sdfdsf343',
    //             name:'预警分析',
    //             orderby:6
    //         },
    //         {
    //             type:"WarnWordLib",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232sdfdsfdsfdsff',
    //             name:'预警词库',
    //             orderby:6
    //         },
    //         {
    //             type:"LogManage",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232sdfdsfdsfdsfhfdhfdff',
    //             name:'日志管理',
    //             orderby:6
    //         },
    //         {
    //             type:"sitePage",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232sdfdsfdsfdsfhfdhfdffasdsad',
    //             name:'场所管理',
    //             orderby:6
    //         },
    //         {
    //             type:"devicePage",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232sdfdsfdsfdsfhfdhfdffasdsaddsfds',
    //             name:'设备管理',
    //             orderby:6
    //         },
    //         {
    //             type:"staticCheckPage",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232sdfdsfdsfdsfhfdhfdffasdsaddsfdsddss',
    //             name:'统计考核',
    //             orderby:6
    //         },
    //         {
    //             type:"dataMassPage",
    //             blnShow:1,
    //             icon: "fa fa-opera",
    //             keyid:'1232sdfdsfdsfdsfhfdhfdffasdsaddsfdsddssfgg22',
    //             name:'数据质量',
    //             orderby:6
    //         },
    //     ]
    // }
  ],//菜单集合
  switchSub:new Subject(),
  navPageFunc:()=>{},
  delNavPageFunc:()=>{},
  addHistoryMenuFunc:()=>{},
  navPageRefreshFunc:()=>{},
}

const mutations={
    [types.RegPageSwitch](state,sub){
        state.switchSub.subscribe(sub);
    },
    [types.TriggerPageSwitch](state,menu){
        state.switchSub.next(menu);
    },
    [types.RegNavPage](state,func){
        state.navPageFunc=func;
    },
    [types.NavPage](state,page){
        state.navPageFunc(page);
    },
    [types.RegDelNavePage](state,func){
        state.delNavPageFunc=func;
    },
    [types.DelNavPage](state,page){
        state.delNavPageFunc(page);
    },
    [types.RegAddHistoryMenuFunc](state,func){
        state.addHistoryMenuFunc=func;
    },
    [types.AddHistoryMenu](state,menu){
        state.addHistoryMenuFunc(menu);
    },
    [types.RegPageRefresh](state,func){
        state.navPageRefreshFunc=func;
    },
    [types.PageRefresh](state,index){
        state.navPageRefreshFunc(index);
    },
    [types.SetMenuKind](state,kinds){
        state.menuKind=kinds;
    },
    [types.SetMenuData](state,menu){
        if(menu instanceof Array){
            _.each(menu,itemMenu=>{
                let pMenu=(_.find(state.menuKind,item=>{return item.id==(itemMenu.menu_type || {id:''}).id;}) ||  _.find(state.menuKind,m=>m.isDefault));
                pMenu.menus=pMenu.menus || [];
                let menus = pMenu.menus;
                menus.push(itemMenu);
                pMenu.menus=_.sortBy(pMenu.menus,'orderby');
            });

            
        }else{
            let pMenu=(_.find(state.menuKind,item=>{return item.id==(menu.menu_type || {id:''}).id;}) ||  _.find(state.menuKind,m=>m.isDefault));
            pMenu.menus=pMenu.menus || [];
            let menus = pMenu.menus;
            menus.push(menu);
            pMenu.menus=_.sortBy(pMenu.menus,'orderby');
        }
 
        state.menus=_t.Clone(state.menuKind);

        // //测试加菜单(可删除)
        // state.menus[state.menus.length-1].menus.push({
        //     type:"IdentityLib",
        //     blnShow:1,
        //     icon: "fa fa-opera",
        //     keyid:'1232543341',
        //     name:'身份库',
        //     orderby:5
        // },
        // {
        //     type:"EW_analysis",
        //     blnShow:1,
        //     icon: "fa fa-opera",
        //     keyid:'1232sdfdsf',
        //     name:'预警分析',
        //     orderby:6
        // },
        // {
        //     type:"WarnWordLib",
        //     blnShow:1,
        //     icon: "fa fa-opera",
        //     keyid:'1232sdfdsfdsfdsff',
        //     name:'预警词库',
        //     orderby:6
        // },
        // {
        //     type:"LogManage",
        //     blnShow:1,
        //     icon: "fa fa-opera",
        //     keyid:'1232sdfdsfdsfdsfhfdhfdff',
        //     name:'日志管理',
        //     orderby:6
        // },
        // )
    }

}

const actions={
    [types.GetMenuKind]({commit,dispatch}){
        return ser.GetMenuKind().then(res=>{
            commit(types.SetMenuKind,res.biz_body);
            return dispatch(types.GetMenuData);
        }).catch(()=>{
            return null;
        })
    },
    [types.GetMenuData]({commit}){
        return ser.getOperate().then(res=>{
            commit(types.SetMenuData,res.biz_body);
            return res.biz_body;
        })
    }
}

export default{
    state,
    mutations,
    actions
}