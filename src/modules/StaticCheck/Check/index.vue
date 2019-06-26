<!-- 考核页面插件 -->
<template>
    <div class="CheckPage">
      <ListAutoLayout> 
        <template slot="header">
            <ListHeader>
              <ListSearchItem label="考核名称">{{infoData.name}}</ListSearchItem>
              <ListSearchItem label="考核对象">{{infoData.type}}</ListSearchItem>
              <ListSearchItem label="时间范围">{{infoData.begin_day}} 至 {{infoData.end_day}}</ListSearchItem>

              <template slot="bar">
                <ListSearchItem>*考核结果仅做参考</ListSearchItem>
                <ListSearchItem><ExportBtn :FuncName="exportData" /></ListSearchItem>
              </template>
            </ListHeader>
        </template>

        <!--列表-->
        <CheckList :data="selData" @dataChange="dataChange" />

      </ListAutoLayout>

      <!--左边历史记录-->
      <HangSide ref="HangSide">
        <div class="title_bar">
          <div class="row">
            <div class="col-md-6" @click="CheckRule()"><i class="fa fa-gear" />考核规则</div>
            <div class="col-md-6" @click="CheckManage()"><i class="fa fa-plus-circle" />考核管理</div>
          </div>

        </div>
        <div class="content_bar">
          <Scroll :listen="data">
            <div v-for="(h,i) in data" :key="i" class="item hoverSubBgColtwoBg" :class="{subBgColtwo:selData===h}" @click="selData=h;$refs.HangSide.hide();">
                <div style="line-height:20px;text-align:center">
                    <span>{{h.taskTitle}}</span>
                </div>
                <div class="item_span" style="line-height:25px">
                    <span >{{h.checkTargetNote=="厂商"?"执行日期":"考核日期"}}：<span v-show="h.lastRunTime&&h.lastRunTime!='0'">{{h.lastRunTime | time}}</span></span>
                    <span style="float:right;margin-right:20px">{{h.disabled=="0"?h.taskStatusNote:"任务失效"}}</span>
                </div>
                <div style="line-height:25px">
                    <span style="margin-right:20px;">考核类型：{{h.taskTypeNote}}</span>
                    <span style="float:right;margin-right:20px">考核对象：{{h.checkTargetNote}}</span>
                </div>
                <div style="line-height:15px;text-align:right;margin-right:10px">
                    <span title="删除" class="his_icon" v-show="h.taskType!='timing'" @click.stop="deleteTaskFun(h.taskId,i)"><i class="fa fa-remove"></i></span>                            
                    <span title="导出" class="his_icon"  @click.stop="exportTastTesListFun(h,h.useStandard,h.lastSchedule)"><i class="fa" :class="{'fa-download':!h.blnDownding,'fa-spinner fa-pulse':h.blnDownding}"></i></span>
                </div>
            </div>
          </Scroll>
        </div>
      </HangSide>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'
import ExportBtn from '@/components/btns/ExportBtn'
import Scroll from '@/components/Scroll'
import CheckList from './List'
import HangSide from '@/components/HangSide'

import CheckRule from './CheckRule'
import CheckManage from './CheckManage'

import {ExportSep,CheckTaskResultExport} from '@/store/Export/types.js'


export default {
  name: 'CheckPage',
  components:{ListAutoLayout,ListHeader,ListSearchItem,ExportBtn,
              CheckList,HangSide,Scroll},
  data(){
    return {
      data:[],
      selData:null,
      infoData:{},
    }
  },
  mounted(){
    this.LoadData();
  },
  methods:{
    refresh(){
      this.LoadData();
    },
    LoadData(blnFlag){
      ser.ExamineTaskList().then(res=>{
        if(!_t.msg(res,'','获取任务列表失败!')) return;

        this.data= _.map(res.biz_body,r=>{ r.blnDownding=false; return r;});
        if(!blnFlag)this.selData=this.data[0];
      });
    },
    //考核规则
    CheckRule(){
      this.$open({
          title:'考核规则',
          area:['800px','500px'],
          components:{CheckRule},
          content:`<CheckRule />`,
          data:{
            
          },
          methods:{
            cancel(){this.close()}
          }
        })
    },
    //考核管理
    CheckManage(){
      this.$open({
          title:'考核管理',
          area:['600px','350px'],
          components:{CheckManage},
          content:`<CheckManage @cancel="cancel" />`,
          data:{
            
          },
          methods:{
            cancel(blnFlag){
              if(blnFlag)this.$caller.LoadData(true);
              this.close();
            }
          }
        })
    },
    deleteTaskFun(id,i){
      _t.confirm('您确定要删除该任务吗？',['确定','取消'],()=>{
          ser.DelCheckTask(id).then(res=>{
            if(!_t.msg(res,'删除成功!')) return;

            this.data.splice(i,1);
            if(this.selData.taskId==id){
              this.selData=this.data[0] || null;
            }
          });
                
      },function(){});
    },
    //导出任务结果
    exportData(){
      return this.$store.dispatch(ExportSep,{
        type:CheckTaskResultExport,
        data:{
          query:{
            last_schedule:this.selData.lastSchedule,
            use_standard:this.selData.useStandard+'',
          }
        }
      })
    },
    exportTastTesListFun(d,useStandard,lastSchedule){
      d.blnDownding=true;
      return this.$store.dispatch(ExportSep,{
        type:CheckTaskResultExport,
        data:{
          query:{
            last_schedule:lastSchedule,
            use_standard:useStandard+'',
          }
        }
      }).then(()=>{
        d.blnDownding=false;
      })
    },
    dataChange(d){
      this.infoData=d;
    }
  }
}
</script>

<style lang="less" scoped>
.CheckPage{width:100%;height:100%;box-sizing:border-box;text-align:left;}

@titleH:50px;
.CheckPage .title_bar{height:@titleH;width:300px;line-height:@titleH;text-align:center;.border('bottom');cursor:pointer;}
.CheckPage .content_bar{height:~'calc(100% - @{titleH})';}
.CheckPage .content_bar .item{
  font-size: 12px;
  box-sizing: border-box;
  padding: 10px;
  .border('bottom');
  .trans(.3s);
  cursor:pointer;
}
.CheckPage .content_bar .item .his_icon{margin-right:10px;cursor:pointer;}
</style>