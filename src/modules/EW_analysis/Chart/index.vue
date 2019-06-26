<template>
  <div class="EW_Map">
      <div :id="mapId" class="map_container"></div>
      <HangSide ref="HangSide">    
        <div class="left_info">

            <!--近7日预警-->
            <div class="warmAlarm subBgColtwoBorder" >
                <div class="title_contain subBgColtwoBorder">近7日预警</div>
                <div class="chart_contain" :id="chartId"></div>
                <Loading :simple="true" v-if="blnLoading" />
            </div>

            <!--报警记录-->
            <div class="alarmRecord subBgColtwoBorder">
                <div class="title_contain subBgColtwoBorder">报警记录</div>
                <div class="chart_contain" ><AlarmRecord @init="AlarmRecordInit" @itemClick="RecordClick" /></div>
            </div>
        
        </div>
      </HangSide>
  </div>
</template>

<script>

import map from '@/wraplib/Map/map'
import chart from '@/wraplib/Chart/chart'
import {AlarmMarker} from '@/wraplib/Map/marker' 

import  EWMapInfo from './components/EW_Map_Info'
import HangSide from '@/components/HangSide'
import AlarmRecord from './components/AlarmRecord'
import Loading from '@/components/Loading'

export default {
  name: 'EW_Map',
  refresh:true,
  components: {HangSide,AlarmRecord,Loading},
  data(){
    return {
      blnLoading:false,
      mapId:_t.guid(),
      mapIns:null,
      data:[], 
      blnshow:false, 
      chartId:'chart'+_t.guid(),
      chartIns:null,
      markers:[],
    };
  },
  mounted(){
    this.initMap();
    this.initChart(()=>{
      this.refresh();
    });
    this.$refs.HangSide.show();
  },
  methods:{
    refresh(){
      this.GetLastSevenPreWarn();
    },
    //获取近7日预警记录
    GetLastSevenPreWarn(){
      this.blnLoading=true;
      ser.GetPreWarnCount().then(res=>{
        this.blnLoading=false;
        this.chartIns.addBar(res.biz_body);
      });
    },
    initMap(){
      let point=map.Point(ser.centerPoint.lng,ser.centerPoint.lat);
      this.mapIns =new map(this.mapId,point,ser.map[2]);
    },
    initChart(callback){
        this.chartIns=new chart(this.chartId);
        callback();
    },
    //报警记录初始化完成
    AlarmRecordInit(data){
      let curD = _.filter(data,d=>{
        let c=d.netbar || {};
        return c.latitude && c.longitude; 
            
      });

      let group=_.groupBy(curD,c=>{
       return `${c.netbar.longitude},${c.netbar.latitude}`;
      });
      
      this.LoadMapMarker(group);
    },
    //报警记录单击事件
    RecordClick(d,data){
      let marker=d.marker,s=this;
      
      _.each(this.markers,m=>m.toggleInfo());
      
      marker.setBranchInfo([
        {
          content:'<EWMapInfo :data="d" />',
          store:s.$store,
          components:{EWMapInfo},
          data:{d:data},
        }
      ],true,{w:230,h:data.alarmType=='alarm_abn'?120:100});

      this.mapIns.panTo(map.Point(d.netbar.longitude,d.netbar.latitude))
    },
    //加载地图点
    LoadMapMarker(data){
      let s=this;
      //先删除之前加载的点
      _.each(this.markers,m=>m.remove())
      this.markers=[];

      for(let i in data){
        let marker=new AlarmMarker(this.mapIns,map.Point(i.split(',')[0],i.split(',')[1]),0,0,[],true);
        marker.add();
        _.each(data[i],d=>d.marker=marker);
        s.markers.push(marker);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.EW_Map{width:100%;height:100%;}
.EW_Map .map_container{width:100%;height:100%;}

@infoW:300px;
.EW_Map .left_info{width:@infoW;height:100%;padding:10px;}

@warnAlarmH:200px;
.EW_Map .warmAlarm{width:100%;height:@warnAlarmH;box-sizing:border-box;position:relative;}

@warnTitleH:40px;

.EW_Map .title_contain{
  height:@warnTitleH;line-height:@warnTitleH;margin:0px 0px;color:white;border-bottom:1px solid;
  background-image: url('../../HomePage/assets/imgs/homeListTop.png');
  background-size: 100% 100%;text-align:right;padding-right:70px;
}
.EW_Map .chart_contain{height:~'calc(100% - @{warnTitleH})';background:#0f283f;}

.EW_Map .alarmRecord{width:100%;margin-top:20px;height:~'calc(100% - @{warnAlarmH} - 40px)';}
</style>