export default{
    /**
     * 获取通用配置
     */ 
    WebSetting(){
        this.baseBag.target='data';
        this.baseBag.method='get_web_ui_setting';
        this.baseBag.data= {};
        return this.post(this.baseBag);
    },
    /** 
       * 获取虚拟身份类型（/vid_type/get）
       * data{
       * }
       */
    GetVidType(){
        this.baseBag.target='vid_type';
        this.baseBag.method='get';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    // 获取字典信息集合
    getDictTables(data){
        this.baseBag.target='custom';
        this.baseBag.method='get_dict_tables';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    

    //获取厂商集合数据
    GetFirmsCollect(){
        this.baseBag.type='GET';
        this.baseBag.method='securitySoftWareOrg';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    //获取各种基础数据
    GetVariousData(type){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='codeDefine';
        this.baseBag.data={type:type};
        return this.post(this.baseBag);
    },
    //获取预警类型
    GetPreWarnType(){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='codes';
        this.baseBag.data={codeName:'alarm_with_keyword_type'};
        return this.post(this.baseBag);
    }
}