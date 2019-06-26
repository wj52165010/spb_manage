export default {
    //获取实名身份库条数
    GetIdInfoCount(){
        this.baseBag.type="GET";
        this.baseBag.method='identitylibrary/uniqueidentity/count';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    //根据证件号码获取唯一身份信息
    GetIdInfoByCardNum(id){
        this.baseBag.type="GET";
        this.baseBag.path=true;
        this.baseBag.method='identitylibrary/uniqueidentity/details';
        this.baseBag.data={_id:id};
        return this.post(this.baseBag);
    },
    //从唯一身份库中移除关注人员
    DelIdInfoFocus(id){
        this.baseBag.type="DELETE";
        this.baseBag.path=true;
        this.baseBag.method='identitylibrary/uniqueidentity/focus';
        this.baseBag.data={_id:id};
        return this.post(this.baseBag);
    },
    //对唯一身份库人员执行关注
    AddIdInfoFocus(id){
        this.baseBag.type="PUT";
        this.baseBag.pathVal=id;
        this.baseBag.method='identitylibrary/uniqueidentity/focus';
        this.baseBag.data={_id:id};
        return this.post(this.baseBag);
    },
    //获取唯一身份库列表信息
    GetIdInfoList(data){
        this.baseBag.type="GET";
        this.baseBag.method='identitylibrary/uniqueidentity/list';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //分页获取指定身份关联的证件信息
    GetIdInfoListRelation(data){
        this.baseBag.type="GET";
        this.baseBag.method='identitylibrary/uniqueidentity/relations';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取指定唯一身份的关联信息
    GetIdInfoRlationById(id){
        this.baseBag.type="GET";
        this.baseBag.path=true;
        this.baseBag.method='identitylibrary/uniqueidentity/relations';
        this.baseBag.data={_id:id};
        return this.post(this.baseBag);
    }
}