<!-- 设备详细页面插件 -->
<template>
    <div class="DeviceDetail">
        <Loading v-if="blnLoading" />

        <div  class="row title">
            <div class="col-md-12 label_title">设备信息：</div>
        </div>
        <div class="row item">
            <div class="col-md-2 text-right">设备名称：</div>
            <div class="col-md-4">{{d.equipmentName}}</div>
            <div class="col-md-2">设备编码：</div>
            <div class="col-md-4">{{d.equipmentId}}</div>                            
        </div>

        <div class="row item">
            <div class="col-md-2 text-right">设备状态：</div>
            <div class="col-md-4">{{d.equipmentStatus}}</div>
            <div class="col-md-2">最近联系时间：</div>
            <div class="col-md-4">{{d.captureTimeNote}}</div>                                
        </div>
        <div class="row item">
            <div class="col-md-2 text-right">设备类型：</div>
            <div class="col-md-4">{{d.equipmentTypeNote}}</div>
            <div class="col-md-2">设备MAC：</div>
            <div class="col-md-4">{{d.mac}}</div>                                
        </div>
        <div class="row item">
            <div class="col-md-2 text-right">设备楼层：</div>
            <div class="col-md-4">{{d.floor}}</div>
            <div class="col-md-2">数据来源：</div>
            <div class="col-md-4">{{d.microprobeTypeNode}}</div>                                
        </div>

        <div  class="row title">
            <div class="col-md-12 label_title">所属场所：</div>
        </div>                                                                                  
        <div class="row item">
            <div class="col-md-2 text-right">场所名称：</div>
            <div class="col-md-4">{{d.netbarName  }}</div>
            <div class="col-md-2">场所地址：</div>
            <div class="col-md-4">{{d.netbarAddress}}</div>                 
        </div> 
        
        <div  class="row title">
            <div class="col-md-12 label_title">所属厂商：</div>
        </div>                                   
        <div class="row item">
            <div class="col-md-2 text-right">所属厂商：</div>
            <div class="col-md-2">{{d.securitySoftwareOrgname}}</div>       
            <div class="col-md-2 text-right">厂商负责人：</div>
            <div class="col-md-2">{{d.firmContactor}}</div>     
            <div class="col-md-2 text-right">联系电话：</div>
            <div class="col-md-2">{{d.firmContactorTel}}</div>                    
        </div>

        <div :id="mapId" class="map"></div>
    </div>
</template>

<script>
import Loading from '@/components/Loading'
import map,{FlickerIcon} from '@/wraplib/Map/map'

export default {
  name: 'DeviceDetail',
  props:['netbar_wacode','equipment_id'],
  components:{Loading},
  data(){
    return {
        blnLoading:false,
        d:{},
        mapId:_t.guid(),
        mapIns:null,
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        ser.GetDeviceDetail({
            netbar_wacode:this.netbar_wacode,
            equipment_id:this.equipment_id,
        }).then(res=>{
            this.d=res.biz_body;
            this.initMap(map.Point(this.d.longitude,this.d.latitude),!!this.d.latitude);
        });
    },
    initMap(point,blnExist){
        this.mapIns =new map(this.mapId,point,12);
        let marker=new FlickerIcon(this.mapIns,point,blnExist?`设备地址:${this.d.equipmentAddress}(${this.d.longitude},${this.d.latitude})`:'未知');
        marker.add();

    }
  }
}
</script>

<style lang="less" scoped>
.DeviceDetail{width:100%;height:100%;box-sizing:border-box;position:relative;padding:10px;text-align:left;background:white;color:black;}
.DeviceDetail .label_title{font-weight: 900;text-indent: 10px;}
.DeviceDetail .title{line-height:25px;}
.DeviceDetail .item{line-height:30px;}
.DeviceDetail .map{
    width: 94%;
    height: 200px;
    margin: 0px auto;
    border: 1px solid rgb(170, 170, 170);
    overflow: hidden;
    position: relative;
    z-index: 0;
    background-color: rgb(243, 241, 236);
    color: rgb(0, 0, 0);
    text-align: left;
}
</style>