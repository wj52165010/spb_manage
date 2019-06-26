/* eslint-disable */
/**
 * 导出
 */
import * as types from './types'

let limitCount=5000;//限制下载条数

const state={
  
}

const mutations={
    
}

const actions={
    //通用列表导出
    [types.Export]({},{type,pageCount=0,data,blnNoLimit}){
        //是否下载条数超出了限制条数
        let blnBeyondLimit=(
                (data.query.ids && data.query.ids.split(',').length<=0 && pageCount>limitCount) || 
                (!data.query.ids && pageCount>limitCount) ||
                (data.query.ids && data.query.ids.split(',').length>limitCount) 
            );

        let count=blnBeyondLimit?limitCount:data.query.ids && data.query.ids.split(',').length;//下载条数
        let tip=blnBeyondLimit?`下载条数最多${count}条确定要下载吗?`:`请确认是否要将已选的${count}条数据导出?`;

        return new Promise((resolve)=>{
            _t.confirmCanClose(tip,count<=0 && !blnBeyondLimit,['确定','取消'],()=>{
                return ser[type]((data.query.ids && data.query.ids.split(',').length>0 && !blnNoLimit)?{
                    query:{ids:data.query.ids},
                    sidx:data.sidx,
                    order:data.order,
                }:data).then(res=>{
                    if(!_t.msg(res,'操作成功!'))return resolve(res);;
                    ser.DownloadFile(res.biz_body);
                    resolve(res);
                });

            },()=>{resolve()});
        });
    },
    //特殊导出
    [types.ExportSep]({},{type,data}){
        return ser[type](data).then(res=>{
            if(!_t.msg(res,'操作成功!'))return res;
            ser.DownloadFile(res.biz_body);
            return res;
        })
    }
}

export default{
    state,
    mutations,
    actions
}