/* eslint-disable */
/**
 * 登录
 */
import * as types from './types'

const state={
  userInfo:{} //当前登录用户信息
}

const mutations={
    [types.GetUser](state,info){
        state.userInfo=info;
    }
}

const actions={
    [types.GetUser]({commit},id){
        return ser.GetUser(id).then(data=>{
            commit(types.GetUser,data.biz_body[0])
        })
    },
    [types.SetUserCookie]({},data){
        let exp='s'+data.exp;
        _t.cookie.set('userInfo',JSON.stringify(data),exp);
    },
    [types.GetUserCookie]({commit}){
        let userInfo=JSON.parse(_t.cookie.get('userInfo'));
        let exp='s'+userInfo.exp;
        ser.baseBag.token=userInfo.token;
        ser.centerPoint={lat:userInfo.latitude,lng:userInfo.longitude};
        _t.cookie.set('region_code_obj',JSON.stringify(userInfo.region_code_obj),exp);
        _t.cookie.set('account',userInfo.account,exp);
        commit(types.GetUser,{
            name:userInfo.account
        });
    },
    [types.DelUserCookie](){
        _t.cookie.del('userInfo');
        _t.cookie.del('region_code_obj');
        _t.cookie.del('account');
    }
}

export default{
    state,
    mutations,
    actions
}