<template>
  <div class="EW_Map_Info">
    <!--新来/离开信息-->
    <template v-if="data.alarmType=='alarm_entrance' || data.alarmType=='alarm_leave'" >
      <div class="item ellipsis">
        来到时间:<span class="sub">{{data.shortAlarmType}}</span>
      </div>
      <div class="item ellipsis">
        人员姓名:<span class="sub subColtwo" style="cursor:pointer" @click="attentDetail()">{{data.focusName}}</span>
        <div class="labelTip subBgColtwo" v-if="data.lableName">{{data.lableName}}</div>
      </div>
      <div class="item ellipsis">预警地点:<span class="sub">{{data.netbarName}}</span></div>
    </template>

    <!--聚集信息-->
    <template v-if="data.alarmType=='alarm_gather'">
      <div class="item ellipsis">
        聚集人数:<span class="sub">{{data.lastGatherCount || 0}}人</span>
        <div class="labelTip subBgColtwo" v-if="data.lableName">{{data.lableName}}</div>
      </div>
      <div class="item ellipsis">聚集时间:<span class="sub">{{data.shortAlarmType}}</span></div>
      <div class="item ellipsis">聚集地点:<span class="sub">{{data.netbarName}}</span></div>
    </template>


    <!--异常信息-->
    <template v-if="data.alarmType=='alarm_abn'" >
      <div class="item ellipsis">异常行为:<span class="sub">{{data.word_type_str}}</span></div>
      <div class="item ellipsis">涉及人员:<span class="sub">{{data.focusName}}</span></div>
      <div class="item ellipsis">预警时间:<span class="sub">{{data.shortAlarmType}}</span></div>
      <div class="item ellipsis">预警地点:<span class="sub">{{data.netbarName}}</span></div>
    </template>


    <i class="iconfont icon-list list iconHover" v-lock:click="(e)=>pop()" />
  </div>
</template>
<script>
import PersonDetail from '@/modules/IdentityLib/AttentPerson/LayoutPage/PersonList/components/PersonDetail'
import TrackMap from '@/modules/EW_analysis/List/components/TrackMap'
import GatherReason from '@/modules/EW_analysis/List/components/warnReason/GatherReason'
import ExperReason from '@/modules/EW_analysis/List/components/warnReason/ExperReason/ExperReason'

export default {
  name: 'EW_Map_Info',
  refresh:true,
  props:['data'],
  data(){
    return {
      
    }
  },
  mounted(){

  },
  methods:{
    pop(){
       let arr=['新来轨迹详细','离开轨迹详细','聚集详细','异常详细'];
       let type={
        'alarm_entrance':0,
        'alarm_leave':1,
        'alarm_gather':2,
        'alarm_abn':3,
       };
       let comp=['TrackMap','TrackMap','GatherReason','ExperReason']; 
        
       this.$open({
          title:arr[type[this.data.alarmType]],
          area:['1000px','640px'],
          components:{TrackMap,GatherReason,ExperReason},
          content:`<${comp[type[this.data.alarmType]]} :blnhiddenList="true" :key_identity_id="id" :id="id" :d="d" @cancel="cancel" />`,
          data:{
            id:this.data.contentSessionId,
            d:this.data,
          },
          methods:{
            cancel(){this.close()}
          }
      });
    },
    //关注人员详细
    attentDetail(){
      let s=this;
      this.$open({
          title:'关注人员详情',
          area:['700px','680px'],
          components:{PersonDetail},
          content:'<PersonDetail @cancel="close" :id="id" />',
          data:{
           id:s.data.focusId
          },
          methods:{
            close(){this.close()}
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .EW_Map_Info{position:relative;padding:10px;}
  .item{line-height:25px;}
  .item .sub{color:#CCCCCC;}
  .list{position:absolute;right:5px;top:5px;cursor:pointer;}

  .labelTip{
      font-size: 11px !important;
      background-color: @mainCol;
      color: #fff;
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 3px;
      position: relative;
      margin-left: 15px;
      display: inline-block;
      font-family: 微软雅黑;
      line-height: 17px;
  }
  .labelTip:before{
      content: '';
      width: 0;
      height: 0;
      border-width: 11px 9px 9px 0;
      border-style: solid;
      border-color: transparent @mainCol transparent transparent;
      position: absolute;
      left: -7px;
      top: -1px;
  }
  .labelTip:after{
      content: '';
      position: absolute;
      width: 5px;
      height: 5px;
      background-color: #fff;
      border-radius: 50%;
      left: -3px;
      top: 50%;
      margin-top: -2.5px;
  }
</style>