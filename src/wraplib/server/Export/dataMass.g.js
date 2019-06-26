//数据质量
export default{
    //数据接收详情导出
    DataReciverExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/cleanLog/firmCount/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //数据文件出书导出
    DataTransExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/cleanLog/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}