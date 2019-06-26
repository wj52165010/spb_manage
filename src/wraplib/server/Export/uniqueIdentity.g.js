//唯一身份库
export default {
    //唯一身份列表导出
    UniqueIdentityListExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='identitylibrary/uniqueidentity/list/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}