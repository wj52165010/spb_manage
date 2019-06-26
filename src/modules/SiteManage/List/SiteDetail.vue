<!-- 场所详细页面插件 -->
<template>
    <div class="SiteDetail">
        <Loading v-if="blnLoading" />
        <!--网吧-->
        <template v-if="type=='网吧'">
            <div  class="row title">
                <div class="col-md-12 label_title">场所信息：</div>
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">场所名称：</div>
                <div class="col-md-4">{{d.netbarName}}</div>
                <div class="col-md-2">场所编码：</div>
                <div class="col-md-4">{{d.netbarWacode}}</div>                            
            </div>

            <div class="row item">
                <div class="col-md-2 text-right">营业状态：</div>
                <div class="col-md-4">{{d.businessState}}</div>
                <div class="col-md-2">场所状态：</div>
                <div class="col-md-4">{{d.onlineState}}</div>                                
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">上网方式：</div>
                <div class="col-md-4">{{d.connectMode  }}</div>
                <div class="col-md-2">申报IP：</div>
                <div class="col-md-4">{{d.accessIp}}</div>                                
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">终端状况：</div>
                <div class="col-md-4">申报终端：{{d.terminalCount.netTerminalNum || 0}}/
                                      检测终端：{{d.terminalCount.termiTotal || 0}}/
                                      在线终端：{{d.terminalCount.internetUsers || 0}}</div>
                <div class="col-md-2">最近联系时间：</div>
                <div class="col-md-4">{{d.captureTimeNote}}</div>                                
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">所属派出所：</div>
                <div class="col-md-4">{{d.policestationName}}</div>
                <div class="col-md-2 ">所属地区：</div>
                <div class="col-md-4">{{d.regionName}}</div>                                
            </div>   

            <div  class="row title">
                <div class="col-md-12 label_title">场所负责人：</div>
            </div>                                                                                  
            <div class="row item">
                <div class="col-md-2 text-right">法人姓名：</div>
                <div class="col-md-2">{{d.lawPrincipalName}}</div>
                <div class="col-md-2 text-right">证件号：</div>
                <div class="col-md-2">{{d.lawPrincipalCertificateId}}</div>     
                <div class="col-md-2 text-right">联系电话：</div>
                <div class="col-md-2">{{d.lawPrincipalTel}}</div>                           
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">信息安全员：</div>
                <div class="col-md-2">{{d.infomanName}}</div> 
                <div class="col-md-2 text-right">证件号：</div>
                <div class="col-md-2">{{d.infomanCertificateId}}</div>
                <div class="col-md-2 text-right">联系电话：</div>
                <div class="col-md-2">{{d.infomanTel}}</div>                                  
            </div>
            <div  class="row title">
                <div class="col-md-12 label_title">所属网监：</div>
            </div>     
            <div class="row item">
                <div class="col-md-2 text-right">网监部门：</div>
                <div class="col-md-2">{{d.waDepartment}}</div>   
                <div class="col-md-2 text-right">网监负责人：</div>
                <div class="col-md-2">{{d.supervisor}}</div>
                <div class="col-md-2 text-right">联系电话：</div>
                <div class="col-md-2">{{d.supervisorTel}}</div>                                     
            </div>
            <div  class="row title">
                <div class="col-md-12 label_title">所属厂商：</div>
            </div>                                   
            <div class="row item">
                <div class="col-md-2 text-right">所属厂商：</div>
                <div class="col-md-2">{{d.securitySoftwareOrgname}}</div>       
                <div class="col-md-2 text-right">厂商负责人：</div>
                <div class="col-md-2">{{d.contactor}}</div>     
                <div class="col-md-2 text-right">联系电话：</div>
                <div class="col-md-2">{{d.contactorTel}}</div>                    
            </div>
        </template>

        <!--非网吧-->
        <template v-if="type!='网吧'">
            <div  class="row title">
                <div class="col-md-12 label_title">场所信息：</div>
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">场所名称：</div>
                <div class="col-md-4">{{d.netbarName}}</div>
                <div class="col-md-2 ">场所编码：</div>
                <div class="col-md-4">{{d.netbarWacode}}</div>                                
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">营业状态：</div>
                <div class="col-md-4">{{d.businessState}}</div>
                <div class="col-md-2">场所状态：</div>
                <div class="col-md-4">{{d.onlineState}}</div>                                
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">挂载设备：</div>
                <div class="col-md-4"><span style="color:green">在线：{{d.equipments[0].num}}</span>/
                                      <span style="color:red">异常：{{d.equipments[2].num}}</span>/
                                      <span style="color:#000">离线：{{d.equipments[1].num}}</span></div>
                <div class="col-md-2 ">最近联系时间：</div>
                <div class="col-md-4">{{d.captureTime}}</div>                                
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">经营性质：</div>
                <div class="col-md-4">{{d.businessNature}}</div>
                <div class="col-md-2 ">数据来源：</div>
                <div class="col-md-4">{{d.microprobeType}}</div>                                
            </div>
            <div class="row item">
                <div class="col-md-2 text-right">场所类型：</div>
                <div class="col-md-4">{{d.netsiteType}}</div>
                <div class="col-md-2">所属派出所：</div>
                <div class="col-md-4">{{d.policestationName}}</div>                                
            </div>     
            <div  class="row title">
                <div class="col-md-12 label_title">网络接入信息：</div>
            </div>                                                                                  
            <div class="row item">
                <div class="col-md-2 text-right">网络服务商：</div>
                <div class="col-md-2">{{d.accessServicecode}}</div>
                <div class="col-md-2 text-right">接入方式:</div>
                <div class="col-md-2">{{d.connectMode}}</div>     
                <div class="col-md-2 text-right">账号或IP：</div>
                <div class="col-md-2">{{d.accessIp}}&nbsp;&nbsp;&nbsp;&nbsp;{{d.authAccount}}</div>                           
            </div>
            <div  class="row item">
                <div class="col-md-12 label_title">场所负责人：</div>
            </div>                                                                                  
            <div class="row item">
                <div class="col-md-2 text-right">法人姓名：</div>
                <div class="col-md-2">{{d.lawPrincipalName}}</div>
                <div class="col-md-2 text-right">证件号:</div>
                <div class="col-md-2">{{d.lawPrincipalCertificateId}}</div>     
                <div class="col-md-2 text-right">联系电话：</div>
                <div class="col-md-2">{{d.lawPrincipalTel}}</div>                           
            </div>
            <div  class="row title">
                <div class="col-md-12 label_title">所属厂商：</div>
            </div>                                   
            <div class="row item">
                <div class="col-md-2 text-right">所属厂商：</div>
                <div class="col-md-2">{{d.securitySoftwareOrgname}}</div>       
                <div class="col-md-2 text-right">厂商负责人：</div>
                <div class="col-md-2">{{d.contactor}}</div>     
                <div class="col-md-2 text-right">联系电话：</div>
                <div class="col-md-2">{{d.contactorTel}}</div>                    
            </div>
        </template>

        <div :id="mapId" class="map"></div>
    </div>
</template>

<script>
import Loading from '@/components/Loading'
import map,{FlickerIcon} from '@/wraplib/Map/map'

export default {
  name: 'SiteDetail',
  props:['id','type'],
  components:{Loading},
  data(){
    return {
        blnLoading:false,
        d:{
            terminalCount:{},
            equipments:[{},{},{}],
        },
        mapId:_t.guid(),
        mapIns:null,
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        ser.SiteDetail({netbar_wacode:this.id}).then(res=>{
            if(!_t.msg(res,'','获取场所信息失败!')) return;
            this.d=res.biz_body;
            this.initMap(map.Point(this.d.longitude,this.d.latitude),!!this.d.latitude);
        });
    },
    initMap(point,blnExist){
        this.mapIns =new map(this.mapId,point,12);
        let marker=new FlickerIcon(this.mapIns,point,blnExist?`场所地址:${this.d.netbarAddress}(${this.d.longitude},${this.d.latitude})`:'未知');
        marker.add();

    }
  }
}
</script>

<style lang="less" scoped>
.SiteDetail{width:100%;height:100%;box-sizing:border-box;position:relative;padding:10px;text-align:left;background:white;color:black;}
.SiteDetail .label_title{font-weight: 900;text-indent: 10px;}
.SiteDetail .title{line-height:25px;}
.SiteDetail .item{line-height:30px;}
.SiteDetail .map{
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