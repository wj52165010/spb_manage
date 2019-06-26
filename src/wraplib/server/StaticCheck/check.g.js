export default {
// 考核任务列表
  ExamineTaskList(data={}){
    this.baseBag.type='GET';
    this.baseBag.method='checkandcount/statCheckTasks';
    data.query = JSON.stringify(data.query);
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  // 考核任务-考核结果列表
  ExamineResultList(data){
    this.baseBag.type='GET';
    this.baseBag.method='checkandcount/statCheckTasks/result';
    data.query=JSON.stringify(data.query);
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  // 考核任务-考核规则新增
  ExamineRuleAdd(data){
    this.baseBag.type='POST';
    this.baseBag.method='checkandcount/statCheckTasks/standard';
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //添加考核任务
  AddExamineTask(data={}){
    this.baseBag.type='POST';
    this.baseBag.method='checkandcount/statCheckTasks';
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //获取考核的厂商配置
  GetExamineFirmSet(data={}){
    this.baseBag.type='GET';
    this.baseBag.method='checkandcount/statCheckTasks/firmSettings';
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //保存厂商配置
  SaveExamineFirmSet(data={}){
    this.baseBag.type='POST';
    this.baseBag.method='checkandcount/statCheckTasks/firmSettings';
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //获取考核任务规则
  GetExamineTaskRule(data={}){
    this.baseBag.type='GET';
    this.baseBag.method='checkandcount/statCheckTasks/standard';
    data.query=JSON.stringify(data.query);
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //删除考核规则
  DelExamineTaskRule(id){
    this.baseBag.type='DELETE';
    this.baseBag.path=true;
    this.baseBag.method='checkandcount/statCheckTasks/standard';
    this.baseBag.data={id:id};
    return this.post(this.baseBag);
  },
  //获取定时考核任务
  GetTimeRule(){
    this.baseBag.type='GET';
    this.baseBag.method='checkandcount/statCheckTasks/timing';
    this.baseBag.data={};
    return this.post(this.baseBag);
  },
  //修改定时考核任务
  UpdateTimeRule(data={}){
    this.baseBag.type='PATCH';
    this.baseBag.method='checkandcount/statCheckTasks/timing';
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //删除考核任务
  DelCheckTask(id){
    this.baseBag.type='DELETE';
    this.baseBag.path=true;
    this.baseBag.method='checkandcount/statCheckTasks';
    this.baseBag.data={id:id};
    return this.post(this.baseBag);
  }
}