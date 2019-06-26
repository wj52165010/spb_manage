//预警导出接口
export default{
    //关键词列表导出
    KeyWordListExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='keywordlibrary/alarmkeywords/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //URL列表导出
    UrlListExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='keywordlibrary/alarmurls/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    //词类
    WordKindListExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='keywordlibrary/keywordtypes/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}