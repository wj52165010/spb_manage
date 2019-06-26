export default{
    /**
     * 根据编码/中文/拼音/字母获取场所信息
     * 
     */
    GetSitesInfoByInfo(condition,types,records,isRegCtrl,microprobe_type){
        this.baseBag.type="GET";
        //this.baseBag.target='site';
        this.baseBag.method='search/area';
        this.baseBag.data={query:JSON.stringify({search:condition,types:types,records:records || '',microprobe_type:microprobe_type || '',isRegCtrl:!!isRegCtrl})};
        return this.post(this.baseBag);
    },
    //获取地区下的场所信息(用于地区选择插件)
    //code:编码(默认不传,则根据当前用户登录数据获取一级信息)
    //type:数据类型(1:地区,2:派出所,3:场所)
    //defaultVal:[{code:"50015",type:"1"}]默认选中的值
    PlaceByArea(code,type,defaultVal,isRegCtrl){
        //this.baseBag.target='site';
        this.baseBag.type="GET";
        this.baseBag.method='search/area/tree';
        this.baseBag.data={query:JSON.stringify({code:code,type:type,default:defaultVal,isRegCtrl:!!isRegCtrl})};
        return this.post(this.baseBag);
    },
    // 获取场所详情
    SiteDetail(data){
        this.baseBag.type='GET';
        this.baseBag.path=true;
        this.baseBag.method='netbarInfo';
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    // 场所选择控件-精确查询(SearchExact)
    /**
    "data":
        [
            {
                "code": "500115",  编码 
                "type": "1" 类型 1-地区，2-派出所,3-场所
            }
        ]
    **/
    SearchExact(data) {
        this.baseBag.type='GET';
        this.baseBag.method='search/area/exact';
        this.baseBag.data={query:JSON.stringify(data)};
        return this.post(this.baseBag);
    },
    //地图查找范围内场所
    //"data": {
    //    "lb": { 左下角经纬度
    //        "lng": "108.377121",
    //        "lat": "30.797873"
    //    },
    //    "rt": { 右上角经纬度
    //        "lng": "108.377121",
    //        "lat": "30.797873"
    //    }
    //}
    SearchRangeSites(lb,rt){
        this.baseBag.target='site';
        this.baseBag.method='searchRangeSites';
        this.baseBag.data={lb:lb,rt:rt};
        return this.post(this.baseBag);
    },

    //获取场所列表信息
    GetSiteList(data){
        this.baseBag.type="GET";
        this.baseBag.method='netbarInfo';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取场所历史采集详情
    GetSiteHistoryDetail(data){
        this.baseBag.type="GET";
        this.baseBag.method='netbarInfo/detectDetails/history';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取场所昨日采集详细
    GetSiteLastCollct(code){
        this.baseBag.type="GET";
        this.baseBag.path=true;
        this.baseBag.method='netbarInfo/detectDetails/yesterday';
        this.baseBag.data={netbar_wacode:code};
        return this.post(this.baseBag);
    },
    //获取场所采集趋势
    GetSiteCollctTrend(data){
        this.baseBag.type="GET";
        this.baseBag.method='netbarInfo/detectTendency';
        data.query=JSON.stringify(data.query);
   
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取场所地图描点信息
    GetSiteMap(data){
        this.baseBag.type="GET";
        this.baseBag.method='netbarInfo/map';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //获取网吧终端列表
    GetNetbarTerminal(code){
        this.baseBag.type="GET";
        this.baseBag.path=true;
        this.baseBag.method='netbarInfo/terminal';
        this.baseBag.data={netbar_wacode:code};
        return this.post(this.baseBag);
    },
    //区域场所统计(地图)
    GetRegionCount(data){
        this.baseBag.type="GET";
        this.baseBag.method='region/siteCount';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }

}