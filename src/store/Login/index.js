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
            commit(types.GetUser,data)
        })
    }
}

export default{
    state,
    mutations,
    actions
}