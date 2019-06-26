//外挂
export default {
    //获取外挂列表信息
    GetPlugList(data){
        this.baseBag.type="GET";
        this.baseBag.method='pushedAbnProblem/plugin';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}