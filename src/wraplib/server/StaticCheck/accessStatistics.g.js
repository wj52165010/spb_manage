export default {
    /**
     * 数据库数据统计列表
     * params{
     *      
     * } 
     */
    AccessStatistics_Database_List(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/dbCount';
        data.query=JSON.stringify(data.query)
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },

    /**
     * 数据类型数据统计列表
     * params{
     *      
     * } 
     */
    AccessStatistics_DataTyp_List(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/dbCount';
        data.query=JSON.stringify(data.query)
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },

    AccessStatistics_DataTypCount_List(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/dataTypeCount';
        data.query=JSON.stringify(data.query)
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },

    

    /**
     * 添加统计考核统计任务
     * params{
     *      start_time: '', //开始时间 时间戳 必填
            end_time：'', //结束时间 时间戳 必填
            microprobe_types: '', //数据采集类型
            stat_dim: '', //按厂商区域统计
            // org 厂商
            // region 区域
            // region_and_org 场所加区域
            stat_target_type: '',
            // data_source, 数据库任务
            // data_extract 数据类型任务
            is_de_duplicate: 0 //是否排重 0 不排,1 排重
     * } 
     */
    AccessStatistics_Add_Task(data){
        this.baseBag.type='POST';
        this.baseBag.method='checkandcount/dataaccessStatTask';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },

    /**
     * 获取任务类表
     * params{
     *      stat_target_type:'' //任务类型 data_source 数据库,data_extract 数据类型
     * } 
     */
    AccessStatistics_Get_Task_List(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/dataaccessStatTask';
        let res={};
        res.query=JSON.stringify(data.query);
        this.baseBag.data=res || {};
        return this.post(this.baseBag);
    },

    /**
     * 删除任务
     * params{
     *      task_id:'' //任务名
     * } 
     */
    AccessStatistics_Del_Task(data){
        this.baseBag.type='DELETE';
        this.baseBag.path=true;
        this.baseBag.method='checkandcount/dataaccessStatTask';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },

    /**
     * 统计任务获取详细数据
     * params{
     *      task_id:'' //任务名
            stat_target_type:'' //任务类型 data_source 数据库,data_extract 数据类型

     * } 
     */
    AccessStatistics_Get_Task_Detail_List(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkandcount/dataaccessStatTask/result';
        let res={};
        res.query=JSON.stringify(data);
        this.baseBag.data=res || {};
        return this.post(this.baseBag);
    },

    /**
     * 导出考核任务
     * params{
     *     

     * } 
     */
    AccessStatistics_Export_Task(data){
        this.baseBag.target='data_check';
        this.baseBag.method='dataaccess_task_get_data_export';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },


    // 按数据来源统计采集量
    GetCollMicroprobe(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/microprobeTypeCount';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //所有厂商数据采集详情
    GetAllFirmsCountData(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/firmCollectCount';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //顶部统计信息(首页)
    TopDataCount(){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/getTodaySumAccessData';
        this.baseBag.data= {};
        return this.post(this.baseBag);
    },
    // 按厂商统计采集量
    GetFirmCollFirm(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/allFirmDetectCount';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
}