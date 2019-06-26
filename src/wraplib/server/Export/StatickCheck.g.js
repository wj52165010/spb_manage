//统计考核导出接口
export default{
    //考核任务导出
    CheckTaskResultExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/statCheckTasks/result/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //接入统计任务导出
    AccessCountTaskExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/dataaccessStatTask/result/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //所有厂商采集详情导出
    AllFirmsCollectInfoExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/firmCollectCount/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}