export default{
    /**
       * 日数据统计/data_count/data_day_count)
       * {
          region:'',         //地区ID
          firm_id:'',        //厂商ID
          microprobe_type:'' //采集类型
          date:'',           //查询时间 格式20170905
          type:'' //all               采集总量
                  //customer_archives 真实身份
                  //virtual_archives  虚拟身份
                  //mobile_archives   手机号
                  //mac_archives      MAC
                  //netlogs           上网日志
       * 
       */
      DayCount(data){
        this.baseBag.type='GET';
        this.baseBag.method='checkAndCount/dailyCount';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
      } 
}