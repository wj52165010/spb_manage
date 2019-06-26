export default {
    //添加预警URL
    AddWarnWordUrl(data={"urlPrefix": "string","wordType": 0}){
        this.baseBag.type='POST';
        this.baseBag.method='keywordlibrary/alarmurl';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //批量删除预警URL
    BatchWarnWordUrlRemove(data=[]){
        this.baseBag.type='DELETE';
        this.baseBag.method='keywordlibrary/alarmurl/batch';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //批量设置预警url启用状态
    BarhWarnWordUrlStatus(data){
        this.baseBag.type='POST';
        this.baseBag.method='keywordlibrary/alarmurl/batchsetstatus';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //更新预警URL
    UpdateWarnWordUrl(id,data){
        this.baseBag.type='PUT';
        this.baseBag.pathVal=id;
        this.baseBag.method='/keywordlibrary/alarmurl';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取预警URL列表
    GetWarnWordUrlList(data){
        this.baseBag.type='GET';
        this.baseBag.method='keywordlibrary/alarmurls';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}