export default{
    //获取未实名身份库条数
    GetNoRealNameCount(){
        this.baseBag.type="GET";
        this.baseBag.method='identitylibrary/nonrealname/count';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    //获取指定的未实名虚拟身份详情
    GetNoRealNameDetail(id){
        this.baseBag.type="GET";
        this.baseBag.path=true;
        this.baseBag.method='identitylibrary/nonrealname/details';
        this.baseBag.data={_id:id};
        return this.post(this.baseBag);
    },
    //移除指定证件信息的关注人员
    DelNoRealNameFocus(id){
        this.baseBag.type="DELETE";
        this.baseBag.path=true;
        this.baseBag.method='identitylibrary/nonrealname/focus';
        this.baseBag.data={_id:id};
        return this.post(this.baseBag);
    },
    //对指定证件信息进行关注操作
    AddNorelNameFocus(id){
        this.baseBag.type="PUT";
        this.baseBag.pathVal=id;
        this.baseBag.method='identitylibrary/nonrealname/focus';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    //分页获取未实名身份库列表
    GetNoRealNameList(data){
        this.baseBag.type="GET";
        this.baseBag.method='identitylibrary/nonrealname/list';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //分页获取未实名虚拟身份关联的证件列表
    GetNoRealNameRelation(data){
        this.baseBag.type="GET";
        this.baseBag.method='identitylibrary/nonrealname/relations';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取未实名虚拟身份关联的证件列表
    GetNoRealNameRelationById(id){
        this.baseBag.type="GET";
        this.baseBag.path=true;
        this.baseBag.method='identitylibrary/nonrealname/relations';
        this.baseBag.data={_id:id};
        return this.post(this.baseBag);
    }
}