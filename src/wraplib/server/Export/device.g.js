//设备导出接口
export default{
    //场所列表导出
    DeviceListExport(data){
        this.baseBag.type='GET';
        this.baseBag.method='netbarEquipment/export';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    }
}