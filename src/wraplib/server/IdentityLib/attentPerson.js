export default{
    /**
     * 获取关注人员报警信息
     * 
     * params:{
        enter_type:''       //in进入报警 out离开报警,可以为空
        key_identity_id:'', //具体关注人员报警信息
        startTime:'',       //开始时间 时间戳
        endTime:'',         //结束时间 时间戳
    }
    */
    GetFocusPeopleAlarmInfo(data){
        this.baseBag.target='key_identity';
        this.baseBag.method='getdata_focus_people';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    /********************** 关注人员标签 ************************/
    //获取关注人标签信息
    GetFocusPeopleTags(){
        this.baseBag.type="GET";
        //this.baseBag.target='key_identity';
        this.baseBag.method='focuspeople/focuspeopletag';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    //删除关注人员
    DelFocusPeopleTags(tagId){
        this.baseBag.type="DELETE";
        this.baseBag.path=true;
        this.baseBag.method='focuspeople/focuspeopletag';
        this.baseBag.data={tagId:tagId || ''};
        return this.post(this.baseBag);
    },
    //批量删除关注人员
    BatchDevFocusPeopleTags(groupTagId){
        this.baseBag.type="DELETE";
        this.baseBag.method='focuspeople/focuspeopletag';
        this.baseBag.data={groupTagId:groupTagId || []};
        return this.post(this.baseBag);
    },
    //新增关注人员标签
    AddFocusPeopleTags({tagTitle,gatherIds}){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeopletag';
        this.baseBag.data={tagTitle:tagTitle || '',gatherIds:gatherIds || []};
        return this.post(this.baseBag);
    },
    //修改关注人员
    UpdateFocusPeopleTags({tagTitle,tagId,gatherIds}){
        this.baseBag.type="PUT";
        this.baseBag.pathVal=tagId;
        this.baseBag.method='focuspeople/focuspeopletag';
        this.baseBag.data={tagTitle:tagTitle || '',gatherIds:gatherIds || []};
        return this.post(this.baseBag);
    },

    /********************** 关注人员************************/
    //获取关注人员列表
    GetFocusPeople(data){
        this.baseBag.type="GET";
        this.baseBag.method='focuspeople/focuspeople';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //新建关注人员
    AddFocusPeople(data){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeople';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //批量删除关注人员
    BatchDelFocusPeople(groupIds){
        this.baseBag.type="DELETE";
        this.baseBag.method='focuspeople/focuspeople/batch';
        this.baseBag.data=groupIds || [];
        return this.post(this.baseBag);
    },
    //批量设置关注人员标签
    BatchTags(data){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeople/batchsettag';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //根据身份证号自动关联身份信息
    Relatedidentity(data){
        this.baseBag.type="GET";
        this.baseBag.method='focuspeople/focuspeople/relatedidentity';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取关注人员
    GetFocusPeopleById(focusId){
        this.baseBag.type="GET";
        this.baseBag.path=true;
        this.baseBag.method='focuspeople/focuspeople';
        this.baseBag.data={focusId:focusId || ''};
        return this.post(this.baseBag);
    },
    //关注人员详情里的重新设置
    ResetFocusPeopleDetail(data={}){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeople/reset';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取关注人员统计
    GetFocusPeopleCount(){
        this.baseBag.type="GET";
        this.baseBag.method='focuspeople/focuspeople/count';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },

    /********************** 关注人员新来离开预警接口************************/
    //新建新来离开预警
    AddInWarn(data){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeoplelocusmonitor';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //批量设置离开预警
    BathLeaveWarn(data){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeoplelocusmonitor/batchsetleave';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //批量设置新来预警
    BatchInWarn(data){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeoplelocusmonitor/batchsetnewcome';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //删除新来离开预警
    DelInWarn(focusId){
        this.baseBag.type="DELETE";
        this.baseBag.method='focuspeople/focuspeoplelocusmonitor';
        this.baseBag.data={focusId:focusId || ''};
        return this.post(this.baseBag);
    },
    //获取新来离开预警详情
    GetInWarn(focusId){
        this.baseBag.type="GET";
        this.baseBag.path=true;
        this.baseBag.method='focuspeople/focuspeoplelocusmonitor';
        this.baseBag.data={focusId:focusId || ''};
        return this.post(this.baseBag);
    },
    //更新新来离开预警
    UpdateInWarn(data){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeoplelocusmonitor';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    /********************** 聚集配置接口************************/
    //获取聚集配置列表
    GetGatherList(data){
        this.baseBag.type="GET";
        this.baseBag.method='focuspeople/focuspeoplegathertask';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //新建聚集配置
    AddGatherSetting(data){
        this.baseBag.type="POST";
        this.baseBag.method='focuspeople/focuspeoplegathertask';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //删除聚集配置
    DelGatherSetting(taskId){
        this.baseBag.type="DELETE";
        this.baseBag.path=true;
        this.baseBag.method='focuspeople/focuspeoplegathertask';
        this.baseBag.data={taskId:taskId || ''};
        return this.post(this.baseBag);
    },
    //获取聚集配置详情
    GetGatherSettingDetail(taskId){
        this.baseBag.type="GET";
        this.baseBag.method='focuspeople/focuspeoplegathertask';
        this.baseBag.data={taskId:taskId || ''};
        return this.post(this.baseBag);
    },
}