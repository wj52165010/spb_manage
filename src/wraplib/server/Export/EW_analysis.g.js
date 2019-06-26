//预警分析
export default{
    //预警分析列表导出
    EWAnalysisListExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='alarmanalysis/alarmdetaillog/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}