/* eslint-disable */
/**
 * 用户管理
 */
import * as types from './types'

const state={
  Roles:[],//角色对象
}

const mutations={
   [types.SetRoles](state,roles){
        state.Roles=roles;
   }
}

const actions={
    [types.GetRoles]({commit}){
        ser.GetRoles().then(res=>{
            commit(types.SetRoles,res.biz_body);
        });
    }
}

export default{
    state,
    mutations,
    actions
}