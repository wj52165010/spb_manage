//未实名导出
export default{
    //未实名列表导出
    NoRealNameListExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='identitylibrary/nonrealname/list/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}