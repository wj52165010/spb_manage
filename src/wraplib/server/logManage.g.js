//日志管理
export default {
    //获取操作日志列表
    OperLogs(data){
        this.baseBag.type='GET';
        this.baseBag.method='operationLog';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    }
}