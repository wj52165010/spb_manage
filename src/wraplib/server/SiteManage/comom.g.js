//通用
export default{
    //获取问题摘要信息
    GetIssueDigest(data){
        this.baseBag.type="GET";
        this.baseBag.method='pushedAbnProblem/detail';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取异常问题详情列表
    GetExperIssueList(data){
        this.baseBag.type="GET";
        this.baseBag.method='pushedAbnProblem/detailList';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
}