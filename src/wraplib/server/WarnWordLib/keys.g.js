export default{
    //获取关键词列表集合
    GetWarnWordKeysList(data={}){
        this.baseBag.type='GET';
        this.baseBag.method='keywordlibrary/alarmkeywords';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //添加关键词
    AddWarnWordKey(data){
        this.baseBag.type='POST';
        this.baseBag.method='keywordlibrary/alarmkeywords';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //修改关键词
    UpdateWarnWordKey(id,data){
        this.baseBag.type='PUT';
        this.baseBag.pathVal=id;
        this.baseBag.method='keywordlibrary/alarmkeywords';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //批量设置关键词启用状态
    BatchWarnKeyStatus(data){
        this.baseBag.type='POST';
        this.baseBag.method='keywordlibrary/alarmkeywords/batchsetstatus';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //批量删除关键词
    BatchWarnKeyRemove(data=[]){
        this.baseBag.type='DELETE';
        this.baseBag.method='keywordlibrary/alarmkeywords/batch';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}