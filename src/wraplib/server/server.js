//接口主文件
let url=window.url || '';

let baseUri=url+'';


let baseBag={
    ver:'',          //数据包版本
    timestamp:0,     //时间戳
    target:'',       //对象
    method:'',       //行为
    session_id:'',   //会话ID
    userid:'',       //用户ID
    token:'',        //令牌
    interface:'',    //是否为远程数据(多个远程数据用逗号分隔)
    data:{}          //数据
};

var post=(function(uri){
    return (data)=>{
        let path=data.path;
        data.path=false;
        if(data.data && data.data.page!=undefined){data.data.page++}

        return $.ajax({
            headers: {
                token: data.token,
            },
            type:data.type || 'POST',
            //contentType:'multipart/form-data',
            contentType:'application/json',
            dataType:'json',
            //jsonp:'callback',
            url:`${uri}/${data.method}${path && data.type!='PUT'?`/${_.values(data.data).join('/')}`:`${data.pathVal?`/${data.pathVal}`:''}`}`,
            data:data.path?'':data.type=='GET'?data.data:JSON.stringify(data.data),//{data:JSON.stringify(data)},
            // error:function (XMLHttpRequest, textStatus, errorThrown) {
            //     //console.log(XMLHttpRequest.status);
            // }
        }).then(function(res){
            data.pathVal='';
            // if(res.msg.code!='successed' && res.msg.note){
            //     layer.msg(res.msg.note);
            // }

            return {code:res.code,msg:res.msg,biz_body:res.data};
        });
    }
})(baseUri);

export class server {
    constructor(baseBag,baseUri){
        this.baseBag=baseBag;
        this.map=[6,19,13];//地图显示层级
        this.post=post;
        this.baseBag={
            baseUri:baseUri,
            ver:'1.1.0',
            timestamp:'100000',
            session_id:'123',
            userid:'1',
            token:''
        };

        this.exportLimit=5000;             //导出限制条数
        this.netVersion=window.PublicNet;  //是否为互联网版
        this.centerPoint={};//中心点
    }
}
export default  new server(baseBag,baseUri);



