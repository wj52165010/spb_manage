/* eslint-disable */
/**
 * 场所管理
 */
import * as types from './types'

const state={
  
}

const mutations={
   
}

const actions={
    [types.GetSitesByInfo]({rootState},data,vm){
        return new Promise((resolve)=>{
            let menu = _.chain(rootState.Menu.menus).pluck('menus').flatten().find(d=>d.type==vm.$role).value() || {};
            ser.GetSitesInfoByInfo(data.condition || '',data.types || '','',menu.isRegCtrl,data.microprobe_type || '').then(res=>{
                resolve(res.biz_body);
            });
        });
    },
    [types.PlaceByArea]({rootState},data,vm){
        return new Promise((resolve)=>{
            let menu = _.chain(rootState.Menu.menus).pluck('menus').flatten().compact().find(d=>d.type==vm.$role).value() || {};
            ser.PlaceByArea(data.code || '',data.type || '',data.defaultVal || [],menu.isRegCtrl).then(res=>{

                let data= res.biz_body?_t.isArray(res.biz_body)?res.biz_body:[res.biz_body]:[];
                resolve(data);
            });
        });
    },
    // 场所选择控件-精确查询(SearchExact)
    [types.SearchExact]({rootState},data,vm){
        return new Promise((resolve)=>{
            let menu = _.chain(rootState.Menu.menus).pluck('menus').flatten().find(d=>d.type==vm.$role).value() || {};

            ser.SearchExact({search:data,isRegCtrl:!!menu.isRegCtrl}).then(res=>{
                resolve(res.biz_body);
            });
        });
    },
}

export default{
    state,
    mutations,
    actions
}