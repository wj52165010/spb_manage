//双系统
export default {
    //获取双系统列表信息
    GetDaulSystemList(data){
        this.baseBag.type="GET";
        this.baseBag.method='pushedAbnProblem/dualSystem';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}