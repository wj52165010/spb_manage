export default {
    //分页获取数据文件传输记录列表
    GetFileTranserList(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/cleanLog';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取厂商数据接收详情
    GetDataMassFirmDetail(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/cleanLog/firmCount';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取有效率数据
    GetDataMassRate(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/cleanLog/firmCountDays';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    }
}