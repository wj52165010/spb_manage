/* eslint-disable */
/**
 * 关注人员
 */
import * as types from './types'

const state={
  tags:[],//标签集合
}

const mutations={
    [types.SetTag](state,tags){
        state.tags=tags;
    }
}

const actions={
    [types.GetTags]({commit},callback){
        ser.GetFocusPeopleTags().then(res=>{
            commit(types.SetTag,res.biz_body);
            callback();
        });
    }
}

export default{
    state,
    mutations,
    actions
}