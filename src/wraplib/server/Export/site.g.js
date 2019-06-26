//场所导出接口
export default{
    //场所列表导出
    SiteListExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='netbarInfo/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //双系统列表导出
    DualSystemExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='pushedAbnProblem/dualSystem/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //外挂系统列表导出
    PluginExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='pushedAbnProblem/plugin/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //双系统/外挂详细信息导出
    DualSystemPluginInfoExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='pushedAbnProblem/detailList/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}