<!-- 接入统计主页面组件 -->
<template>
    <div class="AccessBaseIndex">
      <!--数据库页面-->
      <AccessBaseIndex ref="Database" :detailId="curDataSourceDetailId" :type="curDataSourceStat_dim" v-show="showPage=='Database'" @PageChange="AccessBaseIndexPageChange" @TaskAdd="GetTaskData" />
      <!--身份数据页面-->
      <Identity ref="Identity"  :detailId="curDataTypeDetailId" :type="curDataTypeStat_dim" v-show="showPage=='Identity'" @PageChange="IdentityPageChange" @TaskAdd="GetTaskData" />
      <!--厂商数据接入页面-->
      <Firm ref="Firm" v-show="showPage=='Firm'" />
      <!--数据源数据接入页面-->
      <SourceData ref="Source" v-show="showPage=='Source'" />

      <!--侧边导航栏-->
      <div class="sidebar">
        <div class="sidebar_container">
          <div class="item"  @click="showPage='Database'">数据库    <i class="fa fa-check" v-if="showPage=='Database'" /></div>
          <div class="item"  @click="showPage='Identity'">身份数据  <i class="fa fa-check" v-if="showPage=='Identity'" /></div>
          <div class="item"  @click="showPage='Firm'">接入厂商  <i class="fa fa-check" v-if="showPage=='Firm'"/></div>
          <div class="item"  @click="showPage='Source'">接入数据源 <i class="fa fa-check" v-if="showPage=='Source'" /></div>
        </div>
      </div>

      <!--侧边统计任务(数据库)-->
      <div class="countTask bound" :class="{active:blnShowDataBasePop}" v-show="(showPage=='Database' && AccessBaseIndexShowPage==1)">
        <!--显示标签-->
          <div class="pop_lable" @click="blnShowDataBasePop=!blnShowDataBasePop">
              历史记录
          </div>
          <Scroll ref="DataBaseScroll" :listen="dataSourceTasks">
              <div v-for="(h,i) in dataSourceTasks" :key="i" class="countTask_item" :class="{active:h.task_id==curDataSourceDetailId}" @click="dataTaskClick(h)">
                <div class="item">创建时间 : {{h.createTime}}</div>
                <div class="item">完成时间 : {{h.taskStatus=='completed'?h.taskEndTime:''}}</div>
                <div class="item">创建人员 : {{h.userAccount}}</div>
                <div style="position: absolute;right: 20px;top: 10px;">{{h.taskStatus=='completed'?'完成':h.taskStatus=='created'?'已创建':'异常'}}</div>
                <div class="item_option_bar">
                   <el-tooltip class="option_item" effect="dark" content="条件" placement="top">
                      <i class="fa fa-eye" @click.stop="LookCond(h)"  />
                    </el-tooltip>
                    <el-tooltip class="option_item" effect="dark" content="删除" placement="top">
                      <i class="fa fa-remove" @click.stop="DelTask(h.taskId)" />
                    </el-tooltip>
                    <el-tooltip class="option_item" effect="dark" content="导出" placement="top">
                      <i class="fa fa-download" @click.stop="ExportTask(h.taskId,'data_source')" v-if="!exportSource" />
                      <i v-if="exportSource" class="fa fa-spinner fa-pulse" />
                    </el-tooltip>
                </div>
              </div>
          </Scroll>
      </div>

      <!--侧边统计任务(身份数据库)-->
      <div class="countTask bound" :class="{active:blnShowDataTypePop}" v-show="(showPage=='Identity' && IdentityShowPage==1)">
        <!--显示标签-->
          <div class="pop_lable" @click="blnShowDataTypePop=!blnShowDataTypePop">
              历史记录
          </div>
          <Scroll ref="DataTypeScroll" :listen="dataTypeTasks">
              <div v-for="(h,i) in dataTypeTasks" :key="i" class="countTask_item" :class="{active:h.task_id==curDataTypeDetailId}" @click="idTaskClick(h)">
                <div class="item">创建时间 : {{h.createTime}}</div>
                <div class="item">完成时间 : {{h.taskStatus=='completed'?h.taskEndTime:''}}</div>
                <div class="item">创建人员 : {{h.userAccount}}</div>
                <div style="position: absolute;right: 20px;top: 10px;">{{h.taskStatus=='completed'?'完成':h.taskStatus=='created'?'已创建':'异常'}}</div>
                <div class="item_option_bar">
                   <el-tooltip class="option_item" effect="dark" content="条件" placement="top">
                        <i class="fa fa-eye" @click.stop="LookCond(h)"  />
                    </el-tooltip>
                    <el-tooltip class="option_item" effect="dark" content="删除" placement="top">
                        <i class="fa fa-remove" @click.stop="DelTask(h.taskId)" />
                    </el-tooltip>
                    <el-tooltip class="option_item" effect="dark" content="导出" placement="top">
                        <i class="fa fa-download" @click.stop="ExportTask(h.taskId,'data_extract')" v-if="!exportExtract" />
                        <i v-if="exportExtract" class="fa fa-spinner fa-pulse" />
                    </el-tooltip>
                </div>
              </div>
          </Scroll>
      </div>
    </div>
</template>

<script>
/* eslint-disable */
import AccessBaseIndex from './Database/Database'
import Identity from './Identity/index'
import Firm from './Firm/index'
import SourceData from './Source/index'
import Scroll from '@/components/Scroll'
import DataSource from '@/enum/DataSource'

import {ExportSep,AccessCountTaskExport} from '@/store/Export/types.js'

export default {
  name: 'AccessStatistics',
  components:{AccessBaseIndex,Identity,Firm,SourceData,Scroll},
  data () {
    return {
      showPage:'Database',
      blnShowDataBasePop:false,
      blnShowDataTypePop:false,
      dataSourceTasks:[],
      dataTypeTasks:[],
      curDataSourceDetailId:0,
      curDataSourceStat_dim:'',
      curDataTypeDetailId:0,
      curDataTypeStat_dim:'',
      AccessBaseIndexShowPage:0,//0:图表1:列表
      IdentityShowPage:0, //0:图表1:列表
      exportSource:false,
      exportExtract:false,
    }
  },
  watch:{
    showPage(){
      this.$nextTick(()=>{
        this.$refs[this.showPage].layout();
      });
    },
    blnShowDataBasePop(){
      if(!this.blnShowDataBasePop) return;
      this.$nextTick(()=>{
        this.$refs.DataBaseScroll.reloadyScroll();
      })
    },
    blnShowDataTypePop(){
      if(!this.blnShowDataTypePop) return;
      this.$nextTick(()=>{
        this.$refs.DataTypeScroll.reloadyScroll();
      })
    }
  },
  mounted(){
    this.GetTaskData();
  },
  methods:{
    layout(){
      
    },
    //查看条件
    LookCond(d){
      let html=`
              <div style="line-height:25px;">时间范围&nbsp;:<span style="padding-left:20px;font-size:12px;">{{h.startTime}} —— {{h.endTime}}</span></div>
              <div style="line-height:25px;">数据来源&nbsp;:<span style="padding-left:20px;">{{source(h.microprobeTypes) || ''}}</span></div>
              <div style="line-height:25px;">统计方式&nbsp;:<span style="padding-left:20px;">{{h.statDimNote}}</span></div>
              <div style="line-height:25px;">是否去重&nbsp;:<span style="padding-left:20px;">{{h.isDeDuplicate=='0' || !h.isDeDuplicate?'否':'是'}}</span></div>
        `;
      this.$open({
        title:`新增任务`,
        area:'400px',
        content:`<div class="count_cond_pop" style="width:100%;height:100%;padding:10px;box-sizing: border-box;text-align:left;" >${html}</div>`,
        context:{
          h:d,
          converTime(t){return _t.DateByTimestamp(t,'yyyy-MM-dd')},
          source(v){
            return _.compact(_.map(_.compact((v || '').split(',')),val=>{
              return _.findKey(DataSource,d=>d==val)
            })).join(',') 
          }
        }
      });
    },
    //获取任务列表数据
    GetTaskData(){
      //获取数据库任务列表
      ser.AccessStatistics_Get_Task_List({
        query:{stat_target_type:'data_source'}
      }).then(res=>{
        if(!_t.msg(res)) return;
        this.dataSourceTasks=res.biz_body;
        this.curDataSourceDetailId=this.dataSourceTasks.length>0?this.dataSourceTasks[0].taskId:0;
        this.curDataSourceStat_dim=this.dataSourceTasks.length>0?this.dataSourceTasks[0].statDim:'';
      });

      //获取数据类型任务列表
      ser.AccessStatistics_Get_Task_List({
        query:{stat_target_type:'data_extract'}
      }).then(res=>{
        if(!_t.msg(res)) return;
        this.dataTypeTasks=res.biz_body;
        this.curDataTypeDetailId=this.dataTypeTasks.length>0?this.dataTypeTasks[0].taskId:0;
        this.curDataTypeStat_dim=this.dataTypeTasks.length>0?this.dataTypeTasks[0].statDim:'';
      });
    },
    //删除任务
    DelTask(id){
      _t.confirm('是否删除该统计结果?',['是','否'],()=>{
          ser.AccessStatistics_Del_Task({
            task_id:id
          }).then(res=>{
            if(!_t.msg(res,'删除成功!','删除失败!')) return;

            this.GetTaskData();
          }); 
      },function(){});
    },
    //导出任务
    ExportTask(id,type){
      let tmp={'data_source':'exportSource',
               'data_extract':'exportExtract'};
      let tmpVal=tmp[type];
      this[tmpVal]=true;
      return this.$store.dispatch(ExportSep,{
        type:AccessCountTaskExport,
        data:{
          query:{
            task_id:id, 
            stat_target_type:type
          }
        }
      }).then(()=>{
        this[tmpVal]=false;
      })
    },
    refresh(){
      this.GetTaskData();
      this.$refs.Database.refreshPage();
      this.$refs.Identity.refreshPage();
      this.$refs.Firm.refreshPage();
      this.$refs.Source.refreshPage();
    },
    converTime(t){
      return _t.DateByTimestamp(t,'yyyy-MM-dd hh:mm:ss')
    },
    AccessBaseIndexPageChange(i){
      this.AccessBaseIndexShowPage=i;
    },
    IdentityPageChange(i){
      this.IdentityShowPage=i;
    },
    dataTaskClick(h){
      if(h.taskStatus=='created'){
        _t.info('任务还未执行完成,请稍后!');
        return;
      }
      if(h.taskStatus!=='completed'){
        _t.info('任务出现异常!');
        return;
      }

      this.curDataSourceDetailId=h.taskId;
      this.curDataSourceStat_dim=h.statDim;
    },
    idTaskClick(h){
      if(h.taskStatus=='created'){
        _t.info('任务还未执行完成,请稍后!');
        return;
      }
      if(h.taskStatus!=='completed'){
        _t.info('任务出现异常!');
        return;
      }

      this.curDataTypeDetailId=h.taskId;
      this.curDataTypeStat_dim=h.statDim;
    }
  }
}
</script>

<style scoped lang="less">
@bgCol:fade(#0B122E,90);
.AccessBaseIndex{width:100%;height:100%;padding:10px 120px;position:relative;box-sizing: border-box;}

.AccessBaseIndex .sidebar{position:absolute;width: 100px;top: 0px;right: 0px;bottom: 0px;display: table;height: 100%;}
.AccessBaseIndex .sidebar .sidebar_container{vertical-align: middle;display: table-cell;}

@bgCol:fade(#0B122E,70);
.AccessBaseIndex .sidebar .item{border:1px solid;position:relative;font-size:12px;padding:5px 0px;margin-bottom:15px;cursor:pointer;.trans();position:relative;}
.AccessBaseIndex .sidebar .item:hover{background:@bgCol;color:white;}
.AccessBaseIndex .sidebar .item i{position:absolute;right:5px;top:7px;color:green;}

@cornerH:10px;
.AccessBaseIndex .sidebar .item:before{content:'';position:absolute;width:@cornerH;border:3px solid;border-right:0px;height:~'calc(100% + 6px)';left:-3px;top:-3px;box-sizing:border-box;}

.AccessBaseIndex .sidebar .item:after{content:'';position:absolute;width:@cornerH;border:3px solid;border-left:0px;height:~'calc(100% + 6px)';right:-3px;top:-3px;box-sizing:border-box;}

.AccessBaseIndex .sidebar .item .left_mask{position:absolute;left:-4px;height:~'calc(100% - @{cornerH} - @{cornerH})'; width:3px;background-color:white;top:@cornerH;}
.AccessBaseIndex .sidebar .item .right_mask{position:absolute;right:-4px;height:~'calc(100% - @{cornerH} - @{cornerH})'; width:3px;background-color:white;top:@cornerH;z-index:100;}

.AccessBaseIndex .sidebar .item .title{text-align:center;font-weight:600;font-size:18px;margin-top:20px;}
.AccessBaseIndex .sidebar .item .sub_title{text-align:center;}
.AccessBaseIndex .sidebar .item .countData{position:absolute;width:100%;bottom:10px;padding:0px 20px;font-size:12px;}
.AccessBaseIndex .sidebar .item .countData .countData_item{line-height:30px;}
.AccessBaseIndex .sidebar .item .countData .countData_item .name{margin-right:10px;}

.AccessBaseIndex .countTask_item{padding:10px;padding-bottom:0px; font-size:12px;line-height:25px;.border('bottom');cursor:pointer;position:relative;}
.AccessBaseIndex .item_option_bar{width:100%;text-align:right;padding-right:10px;box-sizing:border-box;}

.AccessBaseIndex .item_option_bar i:hover{cursor:pointer;}
.AccessBaseIndex .item_option_bar i {margin-left:10px;}

//左边侧边框
  @bgColor:fade(@mainCol,90%);
  @popW:300px;
  .AccessBaseIndex .countTask{
    position:absolute;left:-@popW - 5px;top:14px;bottom:10px;z-index:100;width:@popW;background-color:@bgColor !important;
    border-top-right-radius:5px;border-bottom-right-radius:5px;color:white;text-align:left;
  }

  .AccessBaseIndex .countTask.active{left:0px;}

  .AccessBaseIndex .countTask .pop_lable{
    width:30px;position:absolute;top:12%;margin-top:-40px;
    background-color:@bgColor;color:white;
    font-size:12px;padding:10px 8px;border-top-right-radius:5px;border-bottom-right-radius:5px;
    right:-30px;
    cursor:pointer;.trans();
    box-sizing:border-box;
    text-align:center;
  }

  //.AccessBaseIndex .countTask .pop_lable:hover{background-color:@Font_Hover_Col;}

  
  @delBtnSize:20px;
  .AccessBaseIndex .countTask .delBtn{
      cursor:pointer;
      margin-right:10px;font-size:10px;width:@delBtnSize;height:@delBtnSize;line-height:@delBtnSize;float:right;border-radius:5px;background-color:#20a1ff;text-align:center;font-size:12px;
    }
.AccessBaseIndex .countTask .delBtn:hover{background-color:#ff7733;}
</style>
