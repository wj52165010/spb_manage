export default {
    //获取开始时间至当前时间的预警统计(图表最近7天统计图)
    GetPreWarnCount(data={alarmTime:0}){
        this.baseBag.type='GET';
        this.baseBag.method='alarmanalysis/aggs';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取简短预警信息列表异常(仅获取300条)(地图报警记录)
    GetAlarmRecord(data={alarmTime:7}){
        this.baseBag.type='GET';
        this.baseBag.method='alarmanalysis/map/list';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取预警信息详情(报警记录地图显示信息)
    GetAlarmRecordDetail(data={sessionId:0}){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='alarmanalysis/map';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取预警分析列表
    GetPreWarnList(data){
        this.baseBag.type='GET';
        this.baseBag.method='alarmanalysis/alarmdetaillog';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取行为预警详情（网上言论）
    GetBBSWarnDetail(data={sessionId:0}){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='alarmanalysis/bbs';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取行为预警详情（email）
    GetEmailWarnDetail(data={sessionId:0}){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='alarmanalysis/email';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取行为预警详情（即时通讯）
    GetImlogWarnDetail(data={sessionId:0}){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='alarmanalysis/imlog';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取行为预警详情（搜索关键字）
    GetSearchwordWarnDetail(data={sessionId:0}){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='alarmanalysis/searchword';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取行为预警详情（URL）
    GetUrlWarnDetail(data={sessionId:0}){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='alarmanalysis/url';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取关注人员的活动轨迹列表
    GetFocusPersonTrackList(data){
        this.baseBag.type='GET';
        this.baseBag.method='alarmanalysis/focustrace';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取聚集预警详情
    GetGatherPreWarnDetail(data){
        this.baseBag.type='GET';
        this.baseBag.method='alarmanalysis/gatheralarm';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取各预警类型报警数据(首页使用)
    GetPreWarnTypeCount(){
        this.baseBag.type='GET';
        this.baseBag.method='keywordlibrary/alarmTypeCount';
        this.baseBag.data={};
        return this.post(this.baseBag);
    }
}