//接口主文件
let url=window.url || '';

let baseUri=url+'/api/v1';


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
        return $.ajax({
            type:'POST',
            //contentType:'multipart/form-data',
            dataType:'json',
            //jsonp:'callback',
            url:`${uri}/${data.target}/${data.method}`,
            data:{data:JSON.stringify(data)},
            // error:function (XMLHttpRequest, textStatus, errorThrown) {
            //     //console.log(XMLHttpRequest.status);
            // }
        }).then(function(res){
            if(res.msg.code!='successed' && res.msg.note){
                layer.msg(res.msg.note);
            }
            return res;
        });
    }
})(baseUri);

export class server {
    constructor(baseBag){
        this.baseBag=baseBag;
        this.map=[6,19,13];//地图显示层级
        this.post=post;
        this.baseBag={
            ver:'1.1.0',
            timestamp:'100000',
            session_id:'123',
            userid:'test',
            token:'123213'
        };

        this.exportLimit=5000;             //导出限制条数
        this.netVersion=window.PublicNet;  //是否为互联网版
    }
}
export default  new server(baseBag);



