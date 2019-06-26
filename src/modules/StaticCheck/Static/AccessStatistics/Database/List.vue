<!-- 数据库列表组件 -->
<template>
    <div class="DataBase_List">
      <!--操作栏-->
      <div class="option_bar">

        <div class="item">
            <span>时间范围:</span><div style="display:inline-block;">
                <el-date-picker v-model="timerange" type="daterange" placeholder="选择日期范围" :format="'yyyy-MM-dd'" :picker-options="beforeToday" style="width: 250px"></el-date-picker>
            </div>
        </div>

        <div class="item">
            <span>数据来源:</span><div style="display:inline-block;width:250px;">
                <DataSourceSel v-model="dataOri"  />
            </div>
        </div>

        <el-radio-group v-model="filter">
            <el-radio label="region">按区域</el-radio>
            <el-radio label="org">按厂商</el-radio>
            <el-radio label="region_and_org">区域+厂商</el-radio>
        </el-radio-group>

        <div class="item">
            <el-button type="primary" @click="count()"><span>统计</span></el-button>
        </div>

        <div class="item">
            <!--<span class="exportBtn" @click="ExportCount()" style="font-size:12px;cursor:pointer;"><i class="fa fa-upload" /> 导出<i v-if="exportDataing" class="fa fa-spinner fa-pulse" /></span>-->
        </div>

        <!--右边显示区域-->
        <div class="right_container">
          <el-tooltip  content="图表" placement="top">
            <i class="fa fa-th-large" :class="{active:show==0}" @click="$emit('pageChange',0);" />
          </el-tooltip>

          <el-tooltip  content="列表" placement="top">
            <i class="fa fa-list"   :class="{active:show==1}" @click="show=1" />
          </el-tooltip>
        </div>


      </div>
      
      <!--列表显示区域-->
      <div style="height:calc(100% - 65px);width:100%;">
        <v-table :listen="data" :blnLoading="blnLoading" ref="listTable">
            <v-table-header>
                <v-table-column  :width="200">区域/厂商</v-table-column>
                <v-table-column >终端上下线</v-table-column>
                <v-table-column >上网日志</v-table-column>
                <v-table-column >终端特征采集日志</v-table-column>
                <v-table-column >热点特征采集日志</v-table-column>
                <v-table-column >虚拟轨迹</v-table-column>
                <v-table-column >搜索关键词日志</v-table-column>
                <v-table-column >论坛日志</v-table-column>
                <v-table-column >邮件采集日志</v-table-column>
                <v-table-column >IMSI/IMEI采集日志</v-table-column>
                <v-table-column >即时通讯日志</v-table-column>
            </v-table-header>

            <v-table-body>
                <template v-for="(d,i) in data">
                    <v-table-row @click="rowClicks" :class="{showChilds:d.showTmp  && d.childs.length>0}" :key="i" :param="d">
                        <v-table-column :title="d.regionCodeNote">{{d.regionCodeNote}}</v-table-column>
                        <v-table-column >{{d.activelog}}</v-table-column>
                        <v-table-column >{{d.netlog}}</v-table-column>
                        <v-table-column >{{d.terminallog}}</v-table-column>
                        <v-table-column >{{d.hotspotlog}}</v-table-column>
                        <v-table-column >{{d.vidlog}}</v-table-column>
                        <v-table-column >{{d.searchlog}}</v-table-column>
                        <v-table-column >{{d.bbslog}}</v-table-column>
                        <v-table-column >{{d.emaillog}}</v-table-column>
                        <v-table-column >{{d.imsilog}}</v-table-column>
                        <v-table-column >{{d.imlog}}</v-table-column>
                    </v-table-row>
                    <!--厂商相关数据-->
                    <template v-if="d.showTmp && d.childs.length>0">
                        <v-table-row  v-for="(c,i) in d.childs" class="childRow" :key="i" :class="{lastChildRow:i==d.childs.length-1}">
                            <v-table-column >{{c.securitySoftwareOrgcodeNote}}</v-table-column>
                            <v-table-column >{{c.activelog}}</v-table-column>
                            <v-table-column >{{c.netlog}}</v-table-column>
                            <v-table-column >{{c.terminallog}}</v-table-column>
                            <v-table-column >{{c.hotspotlog}}</v-table-column>
                            <v-table-column >{{c.vidlog}}</v-table-column>
                            <v-table-column >{{c.searchlog}}</v-table-column>
                            <v-table-column >{{c.bbslog}}</v-table-column>
                            <v-table-column >{{c.emaillog}}</v-table-column>
                            <v-table-column >{{c.imsilog}}</v-table-column>
                            <v-table-column >{{c.imlog}}</v-table-column>
                        </v-table-row>
                    </template>

                </template>
            </v-table-body>
        </v-table>
      </div>

      <!--分页控件-->
      <!--<NumberPage :pageNum="3" :btnNum="5" />-->
    </div>
</template>

<script>
/* eslint-disable */
import NumberPage from '@/components/NumberPage'
import DataSourceSel from '@/modules/components/DataSourceSel'

export default {
  name: 'DataBase_List',
  props:['detailId','type'],
  components:{NumberPage,DataSourceSel},
  data () {
    return {
      beforeToday:{//限制只能选择昨天之前的日期
        disabledDate(time) {
            var dateTime=new Date();
            dateTime=dateTime.setDate(dateTime.getDate()-1);
            dateTime=new Date(dateTime)
            return time.getTime() > dateTime;
        }
      },
      exportDataing:false,
      blnLoading:false,
      show:1,
      timerange:[],
      dataOri:'',
      filter:'region',
      data:[]
    }
  },
  watch:{
    data:{
        deep:true,
        handler:function(){
            this.$nextTick(()=>{
                this.$refs.listTable.reloadScroll();
            })
        }
    },
    filter(){
        //if(this.filter==3){return;}
        _.each(this.data,d=>d.showTmp=false)
    },
    detailId(){
        this.GetTaskDetailList();
    },
  },
  methods:{
    layout(){
        this.$refs.listTable.reloadScroll();
    },
    refreshPage(){
        this.GetTaskDetailList();
    },
    //列表行单击事件
    rowClicks(i,d){
      //if(this.filter!=3) return;
      d.showTmp=!d.showTmp;
    },
    //统计
    count(){
        if(!this.timerange || !this.timerange[0]) { _t.info('时间范围必填!'); return;}
        ser.AccessStatistics_Add_Task({
            startTime: _t.Timestamp(this.timerange[0]), //开始时间 时间戳 必填
            endTime:_t.DateTimestampByEndTime(this.timerange[1]), //结束时间 时间戳 必填
            microprobeTypes: this.dataOri, //数据采集类型
            statDim: this.filter, //按厂商区域统计
            statTargetType: 'data_source',

        }).then(res=>{
            if(!_t.msg(res,'添加成功!')) return;
            this.$emit('TaskAdd');
        });
    },
    //获取任务详细
    GetTaskDetailList(){
        if(!this.detailId) return;
        this.blnLoading=true;
        ser.AccessStatistics_Get_Task_Detail_List({
            task_id:this.detailId,
            stat_target_type:'data_source'
        }).then(res=>{
            this.blnLoading=false;
            if(!_t.msg(res)) return ;
            let data = _.groupBy(res.biz_body,r=>r.regionCode);
            if(this.type=='org'){
                _.each(res.biz_body,r=>r.regionCodeNote = r.securitySoftwareOrgcodeNote);
                this.data = res.biz_body;

                return;
            }
            

            this.data=_.map(data,(v,key)=>{
                let r={
                    activelog:0,
                    bbslog:0,
                    checkoutlog:0,
                    emaillog:0,
                    hotspotlog:0,
                    imlog:0,
                    imsilog:0,
                    netlog:0,
                    searchlog:0,
                    terminallog:0, 
                    vidlog:0, 
                };
                r.showTmp=false;
                r.childs=_.filter(v,c=>{return c.securitySoftwareOrgcode && this.type=='region_and_org';});


                _.each(v,c=>{
                    r.activelog+=+c.activelog;
                    r.bbslog+=+c.bbslog;
                    r.checkoutlog+=+c.checkoutlog;
                    r.emaillog+=+c.emaillog;
                    r.hotspotlog+=+c.hotspotlog;
                    r.imlog+=+c.imlog;
                    r.imsilog+=+c.imsilog;
                    r.netlog+=+c.netlog;
                    r.searchlog+=+c.searchlog;
                    r.terminallog+=+c.terminallog;
                    r.vidlog+=+c.vidlog;
                    r.region_code=c.regionCode;
                    r.regionCodeNote=c.regionCodeNote;
                });
                return r;
            });

        });
    },
    //导出
    ExportCount(){

    }
  }
}
</script>
<style lang="less">
  .DataBase_List  .el-radio__label{font-weight:normal;}

  .DataBase_List  .showChilds{border:2px solid;margin-top:10px;}

  .DataBase_List .childRow{border-left:2px solid; border-right:2px solid;border-bottom: 0px;}
  .DataBase_List .lastChildRow{border-bottom:2px solid;margin-bottom:10px;}

</style>

<style scoped lang="less">
.DataBase_List{width:100%;height:100%;position:relative;}

.DataBase_List .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.DataBase_List .option_bar .item{display:inline-block;margin:2px 5px;}
.DataBase_List .option_bar .right_container{float:right;}
.DataBase_List .option_bar .right_container i{font-size:18px;margin-left:5px;cursor:pointer;}

.DataBase_List .option_bar .right_container{float:right;}
.DataBase_List .option_bar .right_container i{font-size:18px;margin-left:5px;cursor:pointer;}

@bgCol:fade(#0B122E,70);
.DataBase_List .childList{background:@bgCol;color:white;}
.DataBase_List .childList.lastChild{border-bottom:1px solid;}


//导出
.DataBase_List  .exportSel{cursor:pointer;}
.DataBase_List .cursor{cursor:pointer;}
</style>
