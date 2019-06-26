export default {
  // 获取按区域汇总场所集合
  DeviceMapRegion(data){
    this.baseBag.type='GET';
    this.baseBag.method='region/equipCount';
    data.query=JSON.stringify(data.query);
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  // 获取可视范围内场所集合
  GetDeviceMap(data){
    this.baseBag.type="GET";
    this.baseBag.method='netbarEquipment/map';
    data.query=JSON.stringify(data.query);
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //获取设备列表信息
  GetDeviceList(data){
    this.baseBag.type="GET";
    this.baseBag.method='netbarEquipment';
    data.query=JSON.stringify(data.query);
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //获取设备详细
  GetDeviceDetail(data){
    this.baseBag.type="GET";
    this.baseBag.path=true;
    this.baseBag.method='netbarEquipment';
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //获取设备历史采集详情
  GetDeviceHistory(data){
    this.baseBag.type="GET";
    this.baseBag.method='netbarEquipment/detectDetails/history';
    data.query=JSON.stringify(data.query);
    this.baseBag.data=data;
    return this.post(this.baseBag);
  },
  //获取设备昨日采集详情
  GetDeviceYesterday(id){
    this.baseBag.type="GET";
    this.baseBag.path=true;
    this.baseBag.method='netbarEquipment/detectDetails/yesterday';
    this.baseBag.data={equipment_id:id};
    return this.post(this.baseBag);
  },
  //获取设备采集趋势
  GetDeviceTendency(data){
    this.baseBag.type="GET";
    this.baseBag.method='netbarEquipment/detectTendency';
    data.query=JSON.stringify(data.query);
    this.baseBag.data=data;
    return this.post(this.baseBag);
  }
}