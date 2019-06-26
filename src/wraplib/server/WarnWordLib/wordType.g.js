export default{
    //获取所有预警词类
    GetWarnWordKinds(){
        this.baseBag.type='GET';
        this.baseBag.method='keywordlibrary/keywordtype';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    //添加预警词类
    AddWarnWordKind(data){
        this.baseBag.type='POST';
        this.baseBag.method='keywordlibrary/keywordtype';
        this.baseBag.data=data ||{};
        return this.post(this.baseBag);
    },
    //批量删除预警词类
    BatchWarnWordKindRemove(data=[]){
        this.baseBag.type='DELETE';
        this.baseBag.method='keywordlibrary/keywordtype/batch';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //批量设置预警关键词启用状态
    BatchWarnWordKindStatus(data){
        this.baseBag.type='POST';
        this.baseBag.method='keywordlibrary/keywordtype/batchsetstatus';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //更新预警词类
    UpdateWarnWordKind(id,data){
        this.baseBag.type='PUT';
        this.baseBag.pathVal=id;
        this.baseBag.method='keywordlibrary/keywordtype';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取预警词类列表
    GetWarnWordKindList(data){
        this.baseBag.type='GET';
        this.baseBag.method='keywordlibrary/keywordtypes';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}