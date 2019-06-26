<!-- 首页页面插件 -->
<template>
    <div class="HomePage" :style="{bottom:bottom+'px'}">
      <div style="position:relative;width:100%;height:100%;overflow: hidden;">
        <div :id="mapId" class="map_container"></div>
        <!--顶部标题栏-->
        <div class="top_title" v-if="blnFullGreen">
            <div class="img_container"><img :src="`${baseUrl}logo_main.png`"/></div>
            <div class="fullGreen hoverSubBgColtwo">
              <el-tooltip  content="退出全屏">
                <i class="fa fa-arrows-alt" @click="toggleShow()" />
              </el-tooltip>
            </div>
        </div>

        <!--全屏按钮-->
        <div class="fullScreenBtn hoverSubBgColtwo" v-if="!blnFullGreen" @click="toggleShow()">
          <el-tooltip  content="全屏">
            <i class="fa fa-arrows-alt" />
          </el-tooltip>
        </div>

        <!--关注人员信息(左上角)-->
        <div class="attenPeson">

          <div class="itemInfo">
            <div class="title_bar">关注人员</div>
            <div class="info_bar">
              <span class="subInfo">今:</span>{{attenPesonInfo.today || 0}}/<span class="subInfo">总:</span>{{attenPesonInfo.total || 0}}
            </div>
          </div>

          <div class="itemInfo">
            <div class="title_bar">唯一身份库</div>
            <div class="info_bar">
              <span class="subInfo">总:</span>{{uniqueIdNum}}
            </div>
          </div>

          <div class="itemInfo">
            <div class="title_bar">未实名上网人员</div>
            <div class="info_bar">
              <span class="subInfo">总:</span>{{noRealNameNum}}
            </div>
          </div>

        </div>

        <!--标签内容(左下角)-->
        <div class="tags_container">
          <div class="tag_item" v-for="(t,i) in tags" :key="i">
            <div class="left">
              <div style="color:white;font-size:14px;text-align:center;">{{t.name}}</div>
              <div :id="t.id" style="height:calc(100% - 20px);">

              </div>
            </div>
            <div class="right">
              <div style="font-size:12px;">{{t.rate}}</div>
              <div style="font-size:14px;font-weight:600;">{{t.num}}</div>
            </div>
          </div>
        </div>

        <!--统计数据(右边)-->
        <div class="count_container">

            <!--近7日预警-->
            <div class="warmAlarm subBgColtwoBorder" >
                <div class="title_contain subBgColtwoBorder">报警数据统计</div>
                <div class="chart_contain" :id="chartId"></div>
                <Loading :simple="true" v-if="blnLoading" />
            </div>

            <!--报警记录-->
            <div class="alarmRecord subBgColtwoBorder">
                <div class="title_contain subBgColtwoBorder">报警记录</div>
                <div class="chart_contain" ><AlarmRecord @init="AlarmRecordInit" @itemClick="RecordClick" /></div>
            </div>
        </div>


        <!--关闭按钮-->
        <div class="closeBtn" :id="closeBtnId" v-show="false">
            <i class="fa fa-bars subColtwo" />
        </div>
      </div>
    </div>
</template>

<script>
import map from '@/wraplib/Map/map'
import chart from '@/wraplib/Chart/chart'
import Loading from '@/components/Loading'
import AlarmRecord from '@/modules/EW_analysis/Chart/components/AlarmRecord'
import EWMapInfo from '@/modules/EW_analysis/Chart/components/EW_Map_Info'
import {AlarmMarker} from '@/wraplib/Map/marker'

import 'lib/drag'

export default {
  name: 'HomePage',
  role:'IdentityLib',
  refresh:true,
  components:{Loading,AlarmRecord},
  data(){
    return {
      baseUrl: process.env.BASE_URL,
      closeBtnId:'closeBtn'+_t.guid(),
      chartId:'chart'+_t.guid(),
      mapId:'map'+_t.guid(),
      blnLoading:false,
      mapIns:null,
      bottom:0,
      markers:[],
      tags:[],
      chartIns:null,
      attenPesonInfo:{},
      uniqueIdNum:0,
      noRealNameNum:0,
      blnMoveBtn:false,
      blnFullGreen:false,
    }
  },
  mounted(){
    this.initMap();
    setTimeout(()=>{
        $('#'+this.closeBtnId).dragging({
          randomPosition:false,
          clickHandler:()=>{
            this.bottom=3000;
          }
        });

        this.GetFocusPersonCount();
        this.GetIdInfoCount();
        this.GetNoRealNameCount();
        this.initChartTag();
        this.initChart(()=>{
          this.GetLastSevenPreWarn();
        });
        
    },300);
  },
  methods:{
    refresh(){
      this.GetFocusPersonCount();
      this.GetIdInfoCount();
      this.GetNoRealNameCount();
      this.initChartTag();
      this.GetLastSevenPreWarn();
    },
    initMap(){
        this.mapIns=new map(this.mapId,
                            map.Point(ser.centerPoint.lng,ser.centerPoint.lat),
                            ser.map[2]
                            );
    },
    initChartTag(){
      ser.GetPreWarnTypeCount().then(res=>{
        this.tags = _.map(res.biz_body,r=>{
           let rateNum=parseFloat(r.percentage.replace('%'));
           return {
              id:'tag'+_t.guid(),
              name:r.type_name,
              rate:r.percentage,
              sers:[rateNum,100-rateNum],
              num:r.alarm_total_num
           }
        });

        this.$nextTick(()=>{
          _.each(this.tags,t=>{
            let chartIns=new chart(t.id);
            chartIns.focusTagsChart(t.sers);
          });
        });
        
      });
    },
    show(){this.bottom=0;},
    //获取唯一身份库条数
    GetIdInfoCount(){
      ser.GetIdInfoCount().then(res=>{
        this.uniqueIdNum=res.biz_body || 0;
      });
    },
    //获取未实名身份库条数
    GetNoRealNameCount(){
      ser.GetNoRealNameCount().then(res=>{
        this.noRealNameNum=res.biz_body || 0;
      });
    },
    //获取关注人员统计信息
    GetFocusPersonCount(){
      ser.GetFocusPeopleCount().then(res=>{
        this.attenPesonInfo=res.biz_body || {};
      });
    },
    //初始化近7日报警数据
    initChart(callback){
        this.chartIns=new chart(this.chartId);
        callback();
    },
    //获取近7日预警记录
    GetLastSevenPreWarn(){
      this.blnLoading=true;
      ser.GetPreWarnCount().then(res=>{
        this.blnLoading=false;
        this.chartIns.addBar(res.biz_body);
      });
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
    },
    //切换显示状态
    toggleShow(){
      let parent= $(this.$el).parent('.app_content');
      this.blnFullGreen=!this.blnFullGreen;
      
      $(this.$el).removeClass('animation');
      if(this.blnFullGreen){
        parent.css({'position':'initial'});
        $(this.$el).css({top:this.blnFullGreen?'60px':'0px'});
        setTimeout(()=>{
          $(this.$el).addClass('animation');
          $(this.$el).css({top:'0px'});
        },300)
      }else{
        $(this.$el).addClass('animation');
        $(this.$el).css({top:'60px'});
        setTimeout(()=>{
          parent.css({'position':'relative'});
          $(this.$el).removeClass('animation');
          $(this.$el).css({top:'0px'});
        },300)
      }

    }
  }
}
</script>

<style lang="less" scoped>
.HomePage{
    box-sizing:border-box;
    position:absolute;
    top:0px;left:0px;right:0px;bottom:0px;
    z-index:100;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}

.HomePage.animation{.transLine();}

@titleColor:#233b67;
@screenBtnSize:30px;
.HomePage .fullScreenBtn{
  position:absolute;width:@screenBtnSize;height:@screenBtnSize;line-height:@screenBtnSize;background:red;right:10px;top:10px;
  text-align:center;border-radius:50%;background:@titleColor;cursor:pointer;
}

.HomePage .map_container{position:absolute !important;top:0px;left:0px;right:0px;bottom:0px;}


.HomePage .top_title{
  position:absolute;top:0px;height:60px;width:100%;
  background:linear-gradient(@titleColor 30px,transparent 0%);
}

.HomePage .top_title .img_container{
  margin: 0px auto;
  width: 400px;
  background:linear-gradient(45deg,transparent 25px,@titleColor 0%),
             linear-gradient(315deg,transparent 25px,@titleColor 0%);
  background-size:50%,50%;
  background-position:0px 0px,100% 50%;
  background-repeat: no-repeat;
}

.HomePage .top_title .fullGreen{position:absolute;right:10px;top:4px;color:white;cursor:pointer;display:none;}
.HomePage .top_title:hover .fullGreen{display:block;}

.HomePage .attenPeson{position:absolute;left:20px;top:60px;background:fade(#062037,80%);border-radius:5px;}

@fontCol:@linkColor;
.HomePage .attenPeson .itemInfo{width:200px;border-bottom:1px dashed gray;padding:15px 10px;text-align:right;}
.HomePage .attenPeson .itemInfo:last-child{border-bottom:none;}
.HomePage .attenPeson .itemInfo .info_bar{color:@fontCol;font-size:20px;}
.HomePage .attenPeson .itemInfo .info_bar .subInfo{font-size:12px;}

@tagContainW:760px;
@tagContainH:180px;
.HomePage .tags_container{
  max-width:@tagContainW;
  position:absolute;bottom:10px;left:20px;
  background:fade(#062037,80%);text-align: left;
  border-radius:5px;
}
.HomePage .tags_container .tag_item{
  display:inline-block;width:@tagContainW/4;height:@tagContainH/2;
  color:@fontCol;padding:10px 10px;box-sizing:border-box;text-align:left;
}

@tagLeftW:100px;
.HomePage .tags_container .tag_item .left{
  float:left;width:@tagLeftW;height:100%;
}
.HomePage .tags_container .tag_item .right{
  margin-left:@tagLeftW;height:100%;padding-top:20px;
}

.HomePage .count_container{position:absolute;right:15px;top:60px;bottom:15px;width:300px;}
@warnAlarmH:200px;
.HomePage .warmAlarm{
  width:100%;height:@warnAlarmH;box-sizing:border-box;position:relative;
}

@warnTitleH:40px;

.HomePage .title_contain{
  height:@warnTitleH;line-height:@warnTitleH;margin:0px 0px;color:white;border-bottom:1px solid;
  background-image: url('./assets/imgs/homeListTop.png');
  background-size: 100% 100%;text-align:right;padding-right:70px;
}
.HomePage .chart_contain{
  height:~'calc(100% - @{warnTitleH})';
  background:linear-gradient(45deg,transparent 15px,#2c4359 0%);
}

.HomePage .alarmRecord{width:100%;margin-top:20px;height:~'calc(100% - @{warnAlarmH} - 20px)';box-sizing: border-box;}


.HomePage .closeBtn{
    position:absolute;bottom:10px;left:10px;width:40px;height:40px;line-height:40px;border-radius:50%;
    background-color:fade(white,30%);font-size:20px;cursor:pointer;
    border:4px solid fade(black,60%);cursor:pointer;
}
</style>