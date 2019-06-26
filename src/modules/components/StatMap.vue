<!-- 场所/设备统计地图页面插件 -->
<template>
    <div class="StatMap">
        <!--中间地图伸缩尺-->
        <div class="scaleContainer">
            <ScaleBar :start="mapLevel[0]" :end="mapLevel[1]" :defVal="mapLevel[2]" @change="zoomChange" ref="scaleBar" />
        </div>

        <!--图标解释框-->
        <div class="icon_conatainer">
            <span style="margin-right:10px;" v-for="(p,i) in showIcon" :key="i">
                <img  :src="p" style="width:20px;" />{{i}}
            </span>
        </div>

        <!--加载中-->
        <Loading v-if="Loading" />

        <div :id="mapId" class="map_container"></div>
    </div>
</template>

<script>

//type:(0/场所,1/设备);
//import {scaleLinear,scaleSequential,interpolateCool} from "d3-scale"
import map,{FlickerIcon} from '@/wraplib/Map/map'
import ScaleBar from '@/components/ScaleBar'
import Loading from '@/components/Loading'

export default {
  name: 'StatMap',
  props:['type'],
  components:{ScaleBar,Loading},
  data(){
    return {
       Loading:false,
       mapId:'StatMap'+_t.guid(),
       mapLevel:ser.map,
       mapIns:null,
       baseUrl: process.env.BASE_URL,
       photo:{
        '120online':'imgs/StatMap/site_online.png',
        '120offline':'imgs/StatMap/site_unline.png',
        '120abnormal':'imgs/StatMap/site_unline.png',
        '123online':'imgs/StatMap/hotal_online.png',
        '123offline':'imgs/StatMap/hotal_unline.png',
        '145online':'imgs/StatMap/wifi_online.png',
        '145offline':'imgs/StatMap/wifi_unline.png',
        '145abnormal':'imgs/StatMap/wifi_unline.png',
        '146online':'imgs/StatMap/wifi_online.png',
        '146offline':'imgs/StatMap/wifi_unline.png',
        '146abnormal':'imgs/StatMap/wifi_unline.png',
        },
        showIcon:{
            '网吧':'imgs/StatMap/site_online.png',
            '宾馆酒店':'imgs/StatMap/hotal_online.png',
            '无线采集':'imgs/StatMap/wifi_online.png',
        },
        clus:null,
        countFunc:['GetRegionCount','DeviceMapRegion'],//获取统计点接口函数名
        placeFunc:['GetSiteMap','GetDeviceMap'],
        markers:[],
        id:'netbarInfo|netbarWacode',
        cachePlace:{},
        cacheData:{},
    }
  },
  mounted(){
    this.initMap();
  },
  methods:{
    refresh(){
        this.initMap();
    },
    reset(){
        this.mapIns.reset();
    },
    initMap(){
        // var data = [
        //     map.Point(106.55,29.57),
        //     //map.Point(116.321768,39.88748),
        //     //map.Point(116.494243,39.956539)
        // ];
        this.mapIns = new map(this.mapId,map.Point(ser.centerPoint.lng,ser.centerPoint.lat),this.mapLevel[2]);
       
        this.clus = new BMapLib.MarkerClusterer(this.mapIns.ins, {
            markers:[]
        });

        this.setMarks();


        //添加地图鼠标拖动事件
        this.mapIns.addEventListener('dragend',()=>{
            _t.DelayTrigger(()=>{
                this.setMarks();
            }, this.mapIns, 200);
        });

        //添加地图层级改变事件
        this.mapIns.addEventListener('zoomend',()=>{
            var zoom= this.mapIns.getZoom();
            this.$refs.scaleBar.setVal(zoom);
            this.setMarks();
        });
    },
    setMarks(){
        // let markers=[];
        // let centerPointer = map.getCenter();
        this.clearOverlays();

        let bounds=this.mapIns.getBounds();
        let lb=bounds.getSouthWest(),rt=bounds.getNorthEast();
        let zoom=this.mapIns.getZoom();
        let regionFuncName=this.countFunc[this.type];
        let plaeFuncName=this.placeFunc[this.type];

        this.Loading=true;
        if(zoom<=15){//统计数据
            if(this.clus){this.clus.clearMarkers();this.cachePlace={};this.cacheData={};}

            ser[regionFuncName]({
                query:{
                    microprobe_type:''
                }
            }).then(res=>{
                this.Loading=false;
                let data=_.filter(res.biz_body,r=>r.latitude);
                _.each(data,d=>{
                    let m= new FlickerIcon(this.mapIns,map.Point(d.longitude,d.latitude),`${d.regionName}(${d.countNum})`);
                    m.add();
                    this.markers.push(m);
                });
            });

        }else{//根据试图经纬度来获取集合
            let tempMarker=[];
            let labels={};
            ser[plaeFuncName]({
                    query:{
                        ditu:{lb:lb, rt:rt}
                    }
                },
            ).then(res=>{
                this.Loading=false;
                let data=_.filter(res.biz_body,r=>r.latitude),s=this;
                let primaryKey=s.id.split('|');

                for (var i = 0; i < data.length; i++) {
                    if (s.cachePlace[data[i][primaryKey[1]] || (data[i][primaryKey[0]]+'_'+data[i][primaryKey[1]])]) {
                        continue;
                    }
                   
                    s.cachePlace[data[i][primaryKey[1]] || (data[i][primaryKey[0]]+'_'+data[i][primaryKey[1]])] = data[i];
                    let objId= parseFloat(data[i].longitude)+'-'+parseFloat(data[i].latitude);

                    if(s.cacheData[objId]){
                        //数组
                        if((typeof s.cacheData[objId] === 'object' && !isNaN(s.cacheData[objId].length))){
                            s.cacheData[objId]=[...s.cacheData[objId],data[i]];
                        }else{//对象
                            s.cacheData[objId]=[s.cacheData[objId],data[i]]
                        }
                    }else{
                        s.cacheData[objId]=data[i];
                    }

                    var myIcon = map.Icon(s.photo[data[i].microprobeType+data[i].onlineState] || `${s.baseUrl}imgs/StatMap/site_online.png`, map.Size(28,36));

                    var marker=map.Marker(map.Point(data[i].longitude, data[i].latitude),{icon:myIcon});

                    //添加数遍移上/移下事件(添加描述遮罩)
                    var marker_triangle_html='<div class="pulse subBgColtwo" style="color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;max-height:130px;overflow-y: auto;">{0}</div>';
                    var posSearchHtml=function(data){
                        if(s.type==1){                      
                            data.netbarName=data.equipmentName;
                            data.netbarAddress=data.equipmentAddress;
                            data.netbarWacode=data.equipmentId;
                        }
                        var result='';
                        var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
                        let isArr=data instanceof Array; 
                        if(!isArr){
                            result+=_t.format(template,'全称',data.netbarName || '');
                            result+=_t.format(template,'地址',data.netbarAddress || '');
                            result+=_t.format(template,'状态',data.onlineStateNote || '');
                            result+=_t.format(template,'类型',(data.microprobeTypeNode || '').replace('非经','宾馆酒店'));
                            result+=_t.format(template,'编码',data.netbarWacode || '');
                        }else{
                            result=_.map(data,(d,i)=>{
                                let res='';
                                res+=_t.format(template,'全称',d.netbarName || '');
                                res+=_t.format(template,'地址',d.netbarAddress || '');
                                res+=_t.format(template,'状态',d.onlineStateNote || '');
                                res+=_t.format(template,'类型',(d.microprobeTypeNode || '').replace('非经','宾馆酒店'));
                                res+=_t.format(template,'编码',d.netbarWacode || '');
                                if(i<data.length-1)res+='<div style="height:1px;width:100%;background-color:white;"></div>'
                                return res;
                            }).join('');
                        }

                        return result;
                    };
                    marker.addEventListener("mouseover",function(e){
                            var point=e.target.point;
                            $('.BMapLabel').parent('div').css('z-index',10000);

                            if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                            var label= new BMap.Label(_t.format(marker_triangle_html,posSearchHtml(s.cacheData[point.lng+'-'+point.lat])),{position:point, offset:map.Size(-70, -150)});
                            label.setStyle({
                            fontSize : "12px",
                            lineHeight : "20px",
                            fontFamily:"微软雅黑",
                            fontWeight:'600',
                            border:'0px solid black',
                            'background-color':'transparent',
                            'max-width':'none'
                            });
                            s.mapIns.addOverlay(label);
                            labels[point.lng+'-'+point.lat]=label;

                            label.addEventListener("mouseover",function(){
                                label.isMouseover=true;
                            });

                            label.addEventListener("mouseout",function(){

                                label.isMouseover=false;
                                setTimeout(()=>{
                                    if(label.isMouseover) return;
                                    $('.BMapLabel').parent('div').css('z-index',500);
                                    s.mapIns.removeOverlay(label);
                                    delete labels[point.lng+'-'+point.lat];
                                },100);
                            });
                    });

                    marker.addEventListener("mouseout",function(e){

                        var point=e.target.point;
                        if(!s.cacheData[point.lng+'-'+point.lat]){return;}

                        var label=labels[point.lng+'-'+point.lat];
 
                        setTimeout(()=>{
                            if(label.isMouseover) return;
                            $('.BMapLabel').parent('div').css('z-index',500);
                            s.mapIns.removeOverlay(label);
                            delete labels[point.lng+'-'+point.lat];
                        },100);
                    });

                    tempMarker.push(marker);
                }

                s.clus.addMarkers(tempMarker);
                
            });
        }

    },
    zoomChange(zoom){
      if(!this.mapIns)return;
      this.mapIns.setZoom(zoom);
    },
    clearOverlays(){
        this.mapIns.clearOverlays();
    }
  }
}
</script>

<style lang="less" scoped>
.StatMap{width:100%;height:100%;box-sizing:border-box;}
.StatMap .scaleContainer{position:absolute;top:20px;left:0px;z-index: 1000;} 
.StatMap .map_container{width:100%;height:100%;box-sizing:border-box;}
.StatMap .icon_conatainer{position:absolute;bottom:0px;left:10px;z-index: 10000;color:black;}
</style>