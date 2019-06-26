<!-- 关注人员报警地图组件 -->
<template>
    <div class="AttentAlarmMap">

      <!--地图容器-->
      <div :id="id" class="map"></div>

      <!--中间地图伸缩尺-->
      <div class="scaleContainer" :style="{left:'0px'}">
          <ScaleBar :start="mapLevel[0]" :end="mapLevel[1]" :defVal="mapLevel[2]" @change="zoomChange" ref="scaleBar" />
      </div>

      <!-- 搜索栏 -->
      <div class="option" :style="{right:blnhiddenList?'20px':'500px'}">
        <el-date-picker type="datetimerange" v-model="timeRange" :picker-options="simpleTime" placeholder="选择日期范围" ></el-date-picker>

        <button type="button" class="btn btn-default" style="float:right;background-color:#20a1ff;color:white;" @click="search()">
            <span v-show="!blnSearch">搜 索</span>
            <i v-show="blnSearch" class="fa fa-spinner fa-pulse"></i>
        </button>
      </div>

      <!--右边报警信息展示区域-->
      <div class="alarmInfo" v-if="!blnhiddenList">
        <!--关注人员出现报警-->
        <div class="title_bar">
          <i class="fa fa-list" style="margin-right:10px;" />关注人员出现报警({{alarmInData.length}})
        </div>
        <div class="content_bar">
          <Scroll :listen="alarmInData" ref="inScroll">  
            <div class="item ellipsis" v-for="(d,i) in alarmInData" :key="i" @click="getInAlarmData(d.key_identity_id)">{{i+1}}.{{d.focus_title}}&nbsp;&nbsp;{{converTime(d.logtime)}}&nbsp;&nbsp;有新的报警信息</div>
          </Scroll>
        </div>

        <!--关注人员离开报警-->
        <div class="title_bar">
          <i class="fa fa-list-ul" style="margin-right:10px;" />关注人员离开报警({{alarmOutData.length}})
        </div>
        <div class="content_bar">
          <Scroll :listen="alarmOutData" ref="outScroll">
            <div class="item ellipsis" v-for="(d,i) in alarmOutData" :key="i" @click="getOutAlarmData(d.key_identity_id)">{{i+1}}.{{d.focus_title}}&nbsp;&nbsp;{{converTime(d.logtime)}}&nbsp;&nbsp;离开报警</div>
          </Scroll>
        </div>

      </div>

      <!--底部显示内容-->
      <div class="bottom_info" :style="{right:blnhiddenList?'20px':'500px'}">
        <!--播放器-->
        <div class="player">
          <PointPlayer ref="mapPlayer" :data="traceData" :blnNoRefresh="true"  :range="range" @countChange="countChange" @timeChange="timeChange" />
        </div>
        <!--详细按钮-->
        <div class="detailbtn subBgColtwo" @click="blnShowDetail=!blnShowDetail">详 细<br>轨 迹</div>

      </div>


      <!--轨迹详细信息-->
       <div class="historyList" v-show="blnShowDetail" :style="{right:blnhiddenList?'20px':'500px'}">
          <!--删除按钮-->
          <div class="delBtn subBgColtwo" @click="blnShowDetail=false"><i class="fa fa-remove"></i></div>

           <v-table :listen="traceData" ref="listTable">
              
              <v-table-header>
                <v-table-column :width="150" >时间</v-table-column>
                <v-table-column :width="150" >场所编码</v-table-column>
                <v-table-column :width="150" >场所名称</v-table-column>
                <v-table-column :width="150" >账号类型</v-table-column>
                <v-table-column :width="150" >虚拟身份类型</v-table-column>
                <v-table-column >账号</v-table-column>   
              </v-table-header>

              <v-table-body>
                  <v-table-row v-for="(d,i) in traceData" :key="i">
                    <v-table-column><span><i class="fa fa-warning" v-if="d.direction>0" style="color:red;margin-right:5px;" />{{d.logtime_str}}</span></v-table-column>
                    <v-table-column>{{d.netbar_wacode}}</v-table-column>
                    <v-table-column>{{d.netbar.netbarName}}</v-table-column>
                    <v-table-column>{{d.alarm_target_str}}</v-table-column>
                    <v-table-column>{{d.alarm_type_str}}</v-table-column>
                    <v-table-column>{{d.alarm_key}}</v-table-column>   
                  </v-table-row>
              </v-table-body>

            </v-table>
       </div>
       <Loading v-if="loading" />
    </div>
</template>

<script>
/* eslint-disable */
import ScaleBar from '@/components/ScaleBar'
import PointPlayer from '@/components/PointPlayer'
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'

export default {
  name: 'TrackMap',
  props:['blnhiddenList','key_identity_id','startDate'],
  components:{ScaleBar,PointPlayer,Scroll,Loading},
  data () {
    return {
      loading:false,
      simpleTime:{//限制选择今天之前的日期
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
      },
      id:'AttentAlarmMap'+_t.guid(),
      map:null,
      mapLevel:ser.map,
      blnSearch:false,
      blnShowDetail:false,//是否显示轨迹详细列表
      timeRange:[],
      traceData:[],//轨迹数据
      cTraceData:[],
      mainPath:[],
      range:[],
      unAddData:[],
      addData:[],
      endTime:'',
      range:[],
      labels:{},
      cacheData:{},
      alarmInData:[],//出现区域报警
      alarmOutData:[],//离开区域报警

    }
  },
  watch:{
    blnShowDetail(){
      if(this.blnShowDetail){
        this.$nextTick(()=>{
          this.$refs.listTable.reloadScroll();
        })
      }
    }
  },
  mounted(){
    this.initMap();

    //设置默认日期范围(默认最近七天)
    let curDate=new Date();
    if(this.startDate){
      curDate=new Date(this.startDate);
    }else{
      curDate.setDate(curDate.getDate() - 3);
      curDate.setHours(0,0,0);
    }
    
    this.timeRange=[curDate,new Date];

    this.search();

    setTimeout(()=>{
      this.layout();
    },500);
  },
  methods:{
    layout(){
      this.$refs.mapPlayer.refresh();
      this.$refs.listTable.reloadScroll();
      if(this.blnhiddenList) return;
      this.$refs.inScroll.reloadyScroll();
      this.$refs.outScroll.reloadyScroll();
    },
    clearData(){
      this.map.clearOverlays();
      this.traceData=[];
      this.cTraceData=[];
      this.mainPath=[];
      this.range=[];
      this.unAddData=[];
      this.addData=[];
      this.endTime='';
      this.posPointers=[];
      this.labels={};
      this.cacheData={};
    },
    //搜索
    search(){
      this.GetTrackInfo(this.key_identity_id)

      this.clearData();
      this.$refs.mapPlayer.goStart();
      
    },
    //获取关注人员轨迹信息
    GetTrackInfo(id){
      if(!this.timeRange){_t.tipFailure('时间范围必填!');return;}
      this.loading=true;
      ser.GetFocusPersonTrackList({
        query:{
          sessionId:id,
          begin:_t.Timestamp(this.timeRange[0]),
          end:_t.Timestamp(this.timeRange[1])
        }
      }).then(res=>{
          this.loading=false;
          if(!_t.msg(res)) return;
          this.$refs.mapPlayer.goStart();
          this.map.clearOverlays();
          this.addData=[];
          this.mainPath=[];

          if(res.biz_body.length<=0){_t.info('暂无轨迹数据!');this.clearData(); return;}
          let data=_.map(res.biz_body,b=>{

            b.latitude=b.netbar.latitude;
            b.longitude=b.netbar.longitude;
            return b;
          });

          this.traceData=_t.Clone(data);
          this.cTraceData=_t.Clone(data);
          this.unAddData=_t.Clone(data);

          this.range=[
            data[0].logtime,
            data[data.length-1].logtime
          ];

          this.endTime=parseInt(this.range[0]);
        });
    },

    //获取关注人员进入区域报警信息(旧)
    getInAlarmData(id){
      ser.GetFocusPeopleAlarmInfo({
        enter_type:'in',
        key_identity_id:id || '',
        startTime:_t.Timestamp(this.timeRange[0]),
        endTime:_t.Timestamp(this.timeRange[1]),
      }).then(res=>{
        if(!_t.msg(res,'','获取进入区域报警信息失败!')) return;
        if(id){
          this.$refs.mapPlayer.goStart();
          this.map.clearOverlays();
          this.addData=[];
          this.mainPath=[];

          if(res.biz_body.length<=0){_t.info('暂无轨迹数据!');this.clearData(); return;}

          this.traceData=_t.Clone(res.biz_body);
          this.cTraceData=_t.Clone(res.biz_body);
          this.unAddData=_t.Clone(res.biz_body);

          this.range=[
            res.biz_body[0].logtime,
            res.biz_body[res.biz_body.length-1].logtime
          ];

          this.endTime=parseInt(this.range[0]);

        }else{
          this.alarmInData=res.biz_body; 
        }
      });
    },
    //获取关注人员离开区域报警信息(新)
    getOutAlarmData(id){
      ser.GetFocusPeopleAlarmInfo({
        enter_type:'out',
        key_identity_id:id || '',
        startTime:_t.Timestamp(this.timeRange[0]),
        endTime:_t.Timestamp(this.timeRange[1]),
      }).then(res=>{
        if(!_t.msg(res,'','获取离开区域报警信息失败!')) return;
        if(id){
          this.$refs.mapPlayer.goStart();
          this.map.clearOverlays();
          this.addData=[];
          this.mainPath=[];

          if(res.biz_body.length<=0){_t.info('暂无轨迹数据!');this.clearData(); return;}
          
          this.traceData=_t.Clone(res.biz_body);
          this.cTraceData=_t.Clone(res.biz_body);
          this.unAddData=_t.Clone(res.biz_body);

          this.range=[
            res.biz_body[0].logtime,
            res.biz_body[res.biz_body.length-1].logtime
          ];

          this.endTime=parseInt(this.range[0]);
        }else{
          this.alarmOutData=res.biz_body;
        }
        
      });
    },
    //构造地图点浮动显示内容
    posSearchHtml(data){
      var result='';
      var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
      result+=Fx.format(template,'出现场所',data.netbar_name || '');
      result+=Fx.format(template,'最近出现',this.converTime(data.logtime) || '');

      return result;
    },
    //初始化地图
    initMap(){
      this.map = new BMap.Map(this.id,{minZoom:this.mapLevel[0],maxZoom:this.mapLevel[1]});
     
      this.map.setZoom(this.mapLevel[2]);

      this.map.centerAndZoom(new BMap.Point(ser.centerPoint.lng,ser.centerPoint.lat),this.mapLevel[2]);
      this.map.enableScrollWheelZoom(true);

      //添加地图层级改变事件
      this.map.addEventListener('zoomend',(e)=>{
          var zoom=this.map.getZoom();
          this.$refs.scaleBar.setVal(zoom);
      });
    },
    zoomChange(zoom){
      if(!this.map)return;
      this.map.setZoom(zoom);
    },
    //根据多个点指定最佳地图显示位置
    setZoom(points){  
      var maxLng = points[0].lng;  
      var minLng = points[0].lng;  
      var maxLat = points[0].lat;  
      var minLat = points[0].lat;  
      var res;  
      for (var i = points.length - 1; i >= 0; i--) {  
          res = points[i];  
          if(res.lng > maxLng) maxLng =res.lng;  
          if(res.lng < minLng) minLng =res.lng;  
          if(res.lat > maxLat) maxLat =res.lat;  
          if(res.lat < minLat) minLat =res.lat;  
      };  
      var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;  
      var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;  
      var zoom = this.getZoom(maxLng, minLng, maxLat, minLat); 

      this.map.centerAndZoom(new BMap.Point(cenLng,cenLat), zoom>19?13:zoom);    
 
    }, 
    getZoom(maxLng, minLng, maxLat, minLat) {  
        var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。  
        var pointA = new BMap.Point(maxLng,maxLat);  // 创建点坐标A  
        var pointB = new BMap.Point(minLng,minLat);  // 创建点坐标B  
        var distance = this.map.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位  

        for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {  
            if(zoom[i] - distance > 0){  
                return 18-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
            }  
        };  
    },
    //描点(单个点)
    drawPoint(map,index,d,blnPanTo,pointOps,extraInfo){
      pointOps=pointOps || {};
      pointOps.size=pointOps.size || 30;
      pointOps.color=pointOps.color || 'red'

      let s=this;
      let point=new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude);
      let labelStyle={
                          fontSize : "12px",
                          lineHeight : "20px",
                          fontFamily:"微软雅黑",
                          fontWeight:'600',
                          border:'0px solid black',
                          'background-color':'transparent',
                          'max-width':'none'
                      };

      var label= new BMap.Label(`<div style="background:url(static/map_${pointOps.color}.png);background-size: contain;width:${pointOps.size}px;height:${pointOps.size}px;line-height:${pointOps.size}px;text-align:center;color:white;">
                                  <div style="display:${extraInfo?'block':'none'};position:absolute;bottom:0px;color:white;bottom:-20px;line-height:20px;left:${extraInfo?((-extraInfo.length*12-20)/2+15)+'px':'0px'};background-color:#30cc73;border-radius:5px;padding:0px 10px;"> 
                                    ${extraInfo}
                                  </div>
                                  </div>`,{position:point,offset:new BMap.Size(-pointOps.size/2,-pointOps.size)});
      label.setStyle(labelStyle);
      map.addOverlay(label);

      s.cacheData[parseFloat(d.longitude || d.equipment_longitude)+'-'+parseFloat(d.latitude || d.equipment_latitude)]=d;

      label.addEventListener("mouseover",function(e){
              var point=e.target.point;

              if(!s.cacheData[point.lng+'-'+point.lat]){return;}


               //添加数遍移上/移下事件(添加描述遮罩)
              var marker_triangle_html='<div class="triangle pulse" style="background-color:rgb(0, 204, 102);color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;">{0}</div>';
              var labelInfo= new BMap.Label(Fx.format(marker_triangle_html,s.posSearchHtml(s.cacheData[point.lng+'-'+point.lat])),{position:point, offset:new BMap.Size(-70, -((3)*26+10))});
              
              
              labelInfo.setStyle({
                  fontSize : "12px",
                  lineHeight : "20px",
                  fontFamily:"微软雅黑",
                  fontWeight:'600',
                  border:'0px solid black',
                  'background-color':'transparent',
                  'max-width':'none'
              });
              s.map.addOverlay(labelInfo);
              s.labels[point.lng+'-'+point.lat]=labelInfo;
      });

      label.addEventListener("mouseout",function(e){
          
          var point=e.target.point;
          if(!s.cacheData[point.lng+'-'+point.lat]){return;}
          var labelInfo=s.labels[point.lng+'-'+point.lat];
          s.map.removeOverlay(labelInfo);
          delete s.labels[point.lng+'-'+point.lat];
      });


      if(blnPanTo){
        map.panTo(point);
      }

      return label;
    },
    //描两点之间的线段
    drawLine(map,points,color){
      color=color || 'red';

      let polyline = new BMap.Polyline(points, {strokeColor:color || "#555555", strokeWeight:2, strokeOpacity:1,strokeStyle:'dashed'});   //创建折线
      map.addOverlay(polyline); //增加折线

      return polyline;
    },
    //描两点之间的三角箭头
    drawArrow(polyline,length,angleValue,distance,strokeColor,width){
     return []; //BaiduHelper.arrows(this.map,polyline,length,angleValue,distance,strokeColor,width);
    },
    macPath(map,res,mainPath,sOps,dOps,pOps,blnEnd){
      let startPointOps=sOps || {size:30,color:'green'},//路径起点样式
          drawPointOps=dOps || {size:30,color:'red'}, //画过后的点样式
          pointOps=pOps || {size:30,color:'blue'}; //正在画的点样式
      
      map=map || this.map;

      switch(res.flag){
        case 'Add':
          _.each(res.data,(d,i)=>{

            if(mainPath.length<=1){
              //map.panTo(new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude));
              let points=_.map(this.cTraceData,d=>{
                return new BMap.Point(d.longitude || d.equipment_longitude, d.latitude || d.equipment_latitude);
              });
              // map.setViewport(points);
              this.setZoom(points);
            }

            let lastPoint=mainPath.length<=0?
              this.drawPoint(map,mainPath.length,d,false,startPointOps,'起点') :
              this.drawPoint(map,mainPath.length,d,false,pointOps,blnEnd?'终点':'');
      

            //从第二个点开始画线
            if(mainPath.length>0){
              let firstPoint=new BMap.Point(mainPath[0].point.lng,mainPath[0].point.lat);
              let secondPoint=new BMap.Point(lastPoint.point.lng,lastPoint.point.lat);

              lastPoint._relLine=this.drawLine(map,[firstPoint,secondPoint],pointOps.color);
              lastPoint._relLine._arrows=this.drawArrow(lastPoint._relLine,10,Math.PI/7,drawPointOps.size/2,startPointOps.color,4);
              _.each(lastPoint._relLine._arrows,a=>{
                map.addOverlay(a);
              });

              if(mainPath.length>1){
                mainPath[0].setOffset(new BMap.Size(-drawPointOps.size/2,-drawPointOps.size));
                //mainPath[0].setContent(`<div style="background-color:${drawPointOps.color};width:${drawPointOps.size}px;height:${drawPointOps.size}px;line-height:${drawPointOps.size}px;text-align:center;border-radius:50%;color:white;"></div>`);
                mainPath[0].setContent(`<div style="background:url(static/map_${drawPointOps.color}.png);background-size: contain;width:${drawPointOps.size}px;height:${drawPointOps.size}px;line-height:${drawPointOps.size}px;text-align:center;color:white;"> </div>`);
                mainPath[0]._relLine.setStrokeColor(drawPointOps.color);
              }

            }


            mainPath.unshift(lastPoint);
            
          });
          break;
        case 'Del':
          _.each(res.data,(d)=>{
            let point=mainPath.shift();
            map.removeOverlay(point);
            if(point._relLine){
              map.removeOverlay(point._relLine);
              
              _.each(point._relLine._arrows || [],a=>{
                  map.removeOverlay(a);
              });
            }
          });

          break;
      }
     
    },
    //数据点播放器数据个数改变事件
    countChange(count){
      let res = this.getCountData(count,this.addData,this.unAddData,this.cTraceData);
 
      this.macPath(this.map,res,this.mainPath,null,null,null,this.cTraceData.length==count);
    },
    //播放器时间改变事件
    timeChange(start,end){
      end=parseInt(end);

      let res = this.getOptData(end,this.addData,this.unAddData,this.endTime,this.range);
      this.macPath(this.map,res,this.mainPath,null,null,null,parseInt(this.range[1])==end);
      
      
      this.endTime=end;

    },
    //获取点添加的数据或者删除的数据
    getCountData(count,addData,unAddData,mainMac){
      let data=[],s=this;
      let addCount=addData.length;
      if(count==0){//清除所有删除点

        data=_t.Clone(addData);
        for(let i=0;i<addData.length;i++){
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,addData.length);
        return {flag:'Del',data};

      }else if(count==mainMac.length){//添加所有点

        data=_t.Clone(unAddData);
        
        for(let i=0;i<unAddData.length;i++){
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,unAddData.length);
        return {flag:'Add',data};

      }else if(count>addCount){//增加点

        let ac=count-addCount;
        for(let i=0;i<ac;i++){
          if(!unAddData[i])break;
          data.push(unAddData[i]);
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,ac);

        return {flag:'Add',data};

      }else if(count<addCount){//删除点

        let dc=addCount-count;
        for(let i=0;i<dc;i++){
          if(!addData[i])break;
          data.push(addData[i]);
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,dc);

        return {flag:'Del',data};
      }

      return {flag:''};
    },
    //根据结束时间得到添加的数据或者删除的数据
    getOptData(end,addData,unAddData,endTime,range){
      let data = [],s=this;
      if(end>endTime){//添加点

        let removeIndex=0;

        for(let i=0;i<unAddData.length;i++){
          let time =parseInt(unAddData[i].logtime);
          if(time>end){break;}
          data.push(unAddData[i]);
          addData.unshift(unAddData[i]);
          removeIndex++;
        }

        unAddData.splice(0,removeIndex);
        

        return {flag:'Add',data};
      }
      else if(end==parseInt(range[1])){//等于结束点
        data=_t.Clone(unAddData);
        
        for(let i=0;i<unAddData.length;i++){
          addData.unshift(unAddData[i]);
        }

        unAddData.splice(0,unAddData.length);
        return {flag:'Add',data};
      }
      else if(end==parseInt(range[0])){//等于起始点删除全部添加点
        data=_t.Clone(addData);
        for(let i=0;i<addData.length;i++){
          unAddData.unshift(addData[i]);
        }

        addData.splice(0,addData.length);
        return {flag:'Del',data};
      }
      else{//删除点
        let removeIndex=0;
        //获取删除点内容
        for(let i=0;i<addData.length;i++){
            let time =parseInt(addData[i].logtime);
            if(time<end){removeIndex=i;break;}
            data.push(addData[i]);
            unAddData.unshift(addData[i]);
            removeIndex++
        }

        addData.splice(0,removeIndex);


        return {flag:'Del',data};
      }
    },
    //时间戳转日期
    converTime(t,format){
      return _t.DateByTimestamp(t,format || 'yyyy-MM-dd hh:mm:ss');
    },
  }
}
</script>

<style scoped lang="less">
.AttentAlarmMap{width:100%;height:100%;position:relative;}
.AttentAlarmMap .map{width:100%;height:100%;} 
.AttentAlarmMap .scaleContainer{
  position:absolute;top:20px;left:0px;z-index: 1000;
} 

.AttentAlarmMap .option{
  position:absolute;left:50px; right:500px; top:10px;
  background-color:rgba(47, 51, 65, 0.3);padding:10px;border-radius:5px;margin-top:5px;
  text-align:left;
}

@Distance:5px;
@bgColor:fade(@mainCol,90%);
.AttentAlarmMap .alarmInfo{
  padding-top:14px;
  padding-bottom:10px;
  position: absolute;
  right: 10px;
  top: 10px;
  bottom: 10px;
  width: 450px;
  padding: 10px;
  background-color:@bgColor;
  border-radius:@Distance;
}


.AttentAlarmMap .bottom_info{
  position:absolute;left:50px;right:500px;bottom:10px;padding:10px;
}


@detailBtnSize:60px;
.AttentAlarmMap  .bottom_info .player{
  position:absolute;left:0px;right:@detailBtnSize + 30px;padding-left: 10px;
}
.AttentAlarmMap  .bottom_info .detailbtn{
  width:@detailBtnSize;height:@detailBtnSize;
  color:white;border-radius:5px;padding-top:10px;float:right;cursor:pointer;text-align:center;box-sizing:border-box;
}

.AttentAlarmMap .historyList{
  position:absolute;top:14px;right:500px;left:10px;bottom:10px;z-index: 10000;background:white;
}

.AttentAlarmMap .historyList .delBtn{
    position:absolute;right:-10px;top:-10px;width:20px;height:20px;border-radius:50%;color:white;cursor:pointer;z-index:100;text-align:center;
}

.AttentAlarmMap .historyList .delBtn .fa-remove:hover{color:white;}

@titleBarH:40px;
.alarmInfo .title_bar{width:100%;height:@titleBarH;line-height:@titleBarH;.border('bottom');text-align:left;font-weight:600;padding:0px 10px;}

.alarmInfo .content_bar{width:100%;height:~'calc(50% - @{titleBarH})';color:white;}

.alarmInfo .content_bar .item{text-align:left;line-height:30px;cursor:pointer;}

</style>
