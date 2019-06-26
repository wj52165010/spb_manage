export default{
    /**
     * 获取厂商列表信息
     * 
     */
    GetFirms(){
        this.baseBag.target='data';
        this.baseBag.method='firm';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
}