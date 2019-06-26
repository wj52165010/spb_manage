<!-- 列表面插件 -->
<template>
    <div class="CheckList">
        <ul class="header subBgColtwo">
            <li class="item" style="height:120px">
                <div ref="tel_name"><span class="overflow" style="width:120px;">{{listResultSu.type=="厂商"?"厂商名称":"区域名称"}}</span></div>
                <div ref="tel_onOff" v-show="dataColumn.isCheckNetbarOff==1 ||dataColumn.isCheckNetbarExcept || dataColumn.isCheckNetbarDetects">
                    <div style="height:39px;border-bottom:1px solid #fff" >在离线考核</div>
                    <div style="height:80px;display: flex; flex-flow: row;">
                        <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.isCheckNetbarOff"><span class="inline_overflow">离线率</span></div>
                        <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.isCheckNetbarExcept"><span class="inline_overflow">异常率</span></div>
                        <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.isCheckNetbarDetects"><span class="inline_overflow">贡献率</span></div>
                        <div class="inline-fatg last" style="line-height:80px" v-show="dataColumn.isCheckNetbarOff==1 || dataColumn.isCheckNetbarExcept ||dataColumn.isCheckNetbarDetects"><span class="inline_overflow">参考结果</span></div>
                    </div>                                
                </div>
                <div style="width:100px" ref="tel_data" v-show="dataColumn.isCheckRealname||dataColumn.isCheckVirtual || dataColumn.isCheckHardware">
                    <div style="height:39px;border-bottom:1px solid #fff" >数据采集考核</div>
                    <div style="height:80px;display: flex; flex-flow: row;">
                        <!--<div style="border-right:1px solid #fff">
                            <div style="height:82px;border-bottom:1px solid #fff;width:95px;line-height:80px">虚拟身份种类</div>
                        </div>-->
                        <div style="border-right:1px solid #fff" v-show="dataColumn.isCheckRealname">
                            <div style="height:39px;border-bottom:1px solid #fff" >实名采集</div>
                            <div style="height:40px;display: flex; flex-flow: row;width:180px">
                                <div class="inline-fatg" v-show="dataColumn.isCheckRealidentity"><span class="inline_overflow">身份证</span></div>
                                <div class="inline-fatg" v-show="dataColumn.isCheckMobile"><span class="inline_overflow">手机号</span></div> 
                                <div class="inline-fatg last"><span class="inline_overflow">总量</span></div>                                          
                            </div>
                        </div>
                        <div style="border-right:1px solid #fff" v-show="dataColumn.isCheckVirtual">
                            <div style="height:39px;border-bottom:1px solid #fff;">虚拟身份</div>
                            <div style="height:40px;display: flex; flex-flow: row;width:370px">
                                <div class="inline-fatg" v-show="dataColumn.isCheckQq"><span class="inline_overflow">虚拟身份种类</span></div>
                                <div class="inline-fatg" v-show="dataColumn.isCheckQq"><span class="inline_overflow">QQ</span></div>
                                <div class="inline-fatg" v-show="dataColumn.isCheckWechat"><span class="inline_overflow">微信</span></div> 
                                <div class="inline-fatg" v-show="dataColumn.isCheckTaobao"><span class="inline_overflow">淘宝</span></div>                                                                               
                                <div class="inline-fatg last"><span class="inline_overflow">总量</span></div>                                          
                            </div>
                        </div>                                
                        <div style="border-right:1px solid #fff" v-show="dataColumn.isCheckHardware">
                            <div style="height:39px;border-bottom:1px solid #fff" >硬件特征</div>
                            <div style="height:40px;display: flex; flex-flow: row;width:240px">
                                <div class="inline-fatg"  v-show="dataColumn.isCheckMac"><span class="inline_overflow">MAC</span></div>
                                <div class="inline-fatg"  v-show="dataColumn.isCheckImsi"><span class="inline_overflow">IMSI</span></div> 
                                <div class="inline-fatg"  v-show="dataColumn.isCheckImei"><span class="inline_overflow">IMEI</span></div> 
                                <div class="inline-fatg last"><span class="inline_overflow">总量</span></div>                                                                                 
                            </div>
                        </div> 
                        <div>
                            <div style="width:65px;line-height:80px" v-show="dataColumn.isCheckRealname || dataColumn.isCheckVirtual || dataColumn.isCheckHardware">参考结果</div>
                        </div>                         
                    </div>                                
                </div>
                <div v-show="dataColumn.isCheckDatareport || dataColumn.isCheckDatavalid" ref="tel_trans">
                    <div style="height:39px;border-bottom:1px solid #fff" >数据传输质量</div>
                    <div style="height:80px;display: flex; flex-flow: row;">
                        <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.isCheckDatareport"><span class="inline_overflow">上报率</span></div>
                        <div class="inline-fatg" style="line-height:80px" v-show="dataColumn.isCheckDatavalid"><span class="inline_overflow">有效率</span></div>
                        <div class="inline-fatg last" style="line-height:80px"><span class="inline_overflow">参考结果</span></div>
                    </div>                                
                </div>
                <div ref="tel_result"><span class="overflow" style="width:65px;">参考结果</span></div>
            </li>            
        </ul>
        <div class="content" style="height: calc(100% - 121px);">
            <Scroll :listen="oriData" ref="indList">
                <ul class="body">
                    <li class="item" v-for="(d,i) in showData" :key="i">
                        <!--<li class="item" style="text-align:center;display: table-caption;" v-if="showData.length<=0&&!blnLoading">暂无数据</li>-->
                        <div :style="listWidth.name"><span class="overflow" style="width:120px;">{{d.targetNote}}</span></div>
                        <div :style="listWidth.onOff" v-show="dataColumn.isCheckNetbarOff==1||dataColumn.isCheckNetbarExcept||dataColumn.isCheckNetbarDetects">
                            <div style="display: flex; flex-flow: row;">
                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckNetbarOff==1"><span class="overflow">{{d.offs}}</span></div>
                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckNetbarExcept"><span class="overflow">{{d.excepts}}</span></div>
                                <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckNetbarDetects"><span class="overflow">{{d.detects}}</span></div>
                                <div style="flex:1" v-show="dataColumn.isCheckNetbarOff==1||dataColumn.isCheckNetbarExcept||dataColumn.isCheckNetbarDetects"><span class="overflow">{{d.statResult}}</span></div>
                            </div>                                
                        </div>
                        <div :style="listWidth.data" v-show="dataColumn.isCheckRealname||dataColumn.isCheckVirtual||dataColumn.isCheckHardware">
                            <div style="display: flex; flex-flow: row;">
                                <!--<div style="border-right:1px solid #e7eaec;width:95px">{{d.virtualTypes}}
                                </div>-->
                                <div style="border-right:1px solid #fff" v-show="dataColumn.isCheckRealname">
                                    <div style="display: flex; flex-flow: row;width:180px">
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckRealidentity"><span class="overflow">{{d.identityNum}}</span></div>
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckMobile"><span class="overflow">{{d.mobileNum}}</span></div> 
                                        <div style="flex:1;border-right: 1px solid #e7eaec;"><span class="overflow">{{d.realNum}}</span></div>                                          
                                    </div>
                                </div>
                                <div style="border-right:1px solid #fff" v-show="dataColumn.isCheckVirtual">
                                    <div style="display: flex; flex-flow: row;width:370px">
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" ><span class="overflow">{{d.virtualTypes}}</span></div>
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckQq"><span class="overflow">{{d.qqNum}}</span></div>
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckWechat"><span class="overflow">{{d.wechatNum}}</span></div> 
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckTaobao"><span class="overflow">{{d.taobaoNum}}</span></div>                                                                        
                                        <div style="flex:1;border-right: 1px solid #e7eaec;"><span class="overflow">{{d.virtualNum}}</span></div>                                          
                                    </div>
                                </div>                                
                                <div style="border-right:1px solid #fff" v-show="dataColumn.isCheckHardware">
                                    <div style="display: flex; flex-flow: row;width:240px">
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckMac"><span class="overflow">{{d.macNum}}</span></div>
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckImsi"><span class="overflow">{{d.imsiNum}}</span></div> 
                                        <div style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckImei"><span class="overflow">{{d.imeiNum}}</span></div> 
                                        <div style="flex:1;border-right: 1px solid #e7eaec;"><span class="overflow">{{d.hardwareNum}}</span></div>                                                                                 
                                    </div>
                                </div> 
                                <div>
                                    <div style="border-bottom:1px solid #fff;width:65px;" v-show="dataColumn.isCheckRealname||dataColumn.isCheckVirtual||dataColumn.isCheckHardware">{{d.detectResult}}</div>
                                </div>                         
                            </div>                                
                        </div>
                        <div :style="listWidth.trans" v-show="dataColumn.isCheckDatareport||dataColumn.isCheckDatavalid">
                            <div style="display: flex; flex-flow: row;">
                                <div  style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckDatareport"><span class="overflow">{{d.reports}}</span></div>
                                <div  style="flex:1;border-right: 1px solid #e7eaec;" v-show="dataColumn.isCheckDatavalid"><span class="overflow">{{d.valids}}</span></div>
                                <div  style="flex:1" v-show="dataColumn.isCheckDatareport||dataColumn.isCheckDatavalid"><span class="overflow">{{d.dataResult}}</span></div>
                            </div>                                
                        </div>
                        <div :style="listWidth.result"><span class="overflow" style="width:65px;">{{d.result}}</span></div>

                    </li>
                </ul>
            </Scroll>
        </div>
    </div>
</template>

<script>
import Scroll from '@/components/Scroll'
export default {
  name: 'CheckList',
  props:['data'],
  components:{Scroll},
  data(){
    return {
        listResultSu:{//结果列表中需要填充的内容
          name:"", 
          type:"",
          use_standard:"",
          last_schedule:"",
          begin_day:"",
          end_day:"",
        },
        dataColumn:[],
            listWidth:{             //表格宽度处理（单独设置解决,因宽度始终无法对齐因此进行单独的特殊处理）
            name:"",
            onOff:"",
            data:"",
            trans:"",
            result:"",
        },
        query:{
            use_standard:'',// // 考核规则id
            last_schedule:'',//调度id
        },
        oriData:[],
    }
  },
  watch:{
    data(){
        if(!this.data) return;
        this.getTaskResList();
    }
  },
  computed:{
      showData(){
          return _.map(this.oriData,r=>{
                return {
                    targetNote:r.targetNote,
                    offs:(parseFloat(r.offs)*100).toFixed(2)+"%",
                    excepts:(parseFloat(r.excepts)*100).toFixed(2)+"%",
                    detects:(parseFloat(r.detects)*100).toFixed(2)+"%",
                    statResult:r.statResult,
                    realNum:r.realNum!="-1"? r.realNum:"—",
                    identityNum:r.identityNum!="-1"? r.identityNum:"—",
                    mobileNum:r.mobileNum!="-1"? r.mobileNum:"—",
                    virtualTypes:r.virtualTypes!="-1"? r.virtualTypes:"—",
                    virtualNum:r.virtualNum!="-1"? r.virtualNum:"—",
                    qqNum:r.qqNum!="-1"? r.qqNum:"—",
                    wechatNum:r.wechatNum!="-1"? r.wechatNum:"—",
                    taobaoNum:r.taobaoNum!="-1"? r.taobaoNum:"—",
                    hardwareNum:r.hardwareNum!="-1"? r.hardwareNum:"—",
                    macNum:r.macNum!="-1"? r.macNum:"—",
                    imsiNum:r.imsiNum!="-1"? r.imsiNum:"—",
                    imeiNum:r.imeiNum!="-1"? r.imeiNum:"—",
                    detectResult:r.detectResult,
                    reports:(parseFloat(r.reports)*100).toFixed(2)+"%" ,
                    valids:(parseFloat(r.valids)*100).toFixed(2)+"%",
                    dataResult:r.dataResult,
                    result:r.result
                }
            });
      }
  },
  mounted(){
    this.dealListWidth();
  },
  methods:{
    ResizeHandler(){
        this.dealListWidth();
        this.$nextTick(()=>{
            this.$refs.indList.ResizeHandler()
        })
    },
    //列表宽度处理，解决列表表头与数据不对齐的问题，因时间较紧，临时解决一下，后续需要处理
    dealListWidth(){     
        this.listWidth={           
            name:"width:"+(this.$refs.tel_name.offsetWidth+2)+"px",
            onOff:"width:"+this.$refs.tel_onOff.offsetWidth+"px",
            data:"width:"+this.$refs.tel_data.offsetWidth+"px",
            trans:"width:"+this.$refs.tel_trans.offsetWidth+"px",
            result:"width:"+this.$refs.tel_result.offsetWidth+"px",
        };
    },
    //获取考核结果列表 
    getTaskResList(){
        let title=this.data.taskTitle;
        let type=this.data.checkTargetNote;
        let use_standard=this.data.useStandard;
        let last_schedule=this.data.lastSchedule;
        let disabled=this.data.disabled;
        let begin_day=(this.data.scheduleDay || {}).beginDay ||'';
        let end_day=(this.data.scheduleDay || {}).endDay ||'';
      
        if(!last_schedule||last_schedule=="0"){
            
            if(disabled!='0'){
                _t.info('任务失效且没有历史数据!');
            }else{
                _t.info('该任务正在执行中，请稍后...');
            }
            return;
        }

        // 相关数据填充
        this.query.use_standard=use_standard;
        this.query.last_schedule=last_schedule;   
        this.listResultSu={
            name:title, 
            type:type,
            use_standard:use_standard,
            last_schedule:last_schedule,
            begin_day:begin_day.substring(0,4)+"-"+begin_day.substring(4,6)+"-"+begin_day.substring(6),
            end_day:end_day.substring(0,4)+"-"+end_day.substring(4,6)+"-"+end_day.substring(6),
        }      

        ser.ExamineResultList({query:this.query}).then(res=>{
            this.oriData=res.biz_body.data;     //所有数据
            this.dataColumn=res.biz_body.column;       
            this.$nextTick(()=>{
                this.ResizeHandler();    //列表宽度处理
            });
        });

        this.$emit('dataChange',this.listResultSu);
    },
  }
}
</script>

<style lang="less" scoped>
.CheckList{width:100%;height:100%;box-sizing:border-box;}
@rowH:40px;
@HeaderBgCol:@mainCol;
@FontCol:white;
.CheckList .header{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;margin:0px;}
.CheckList .header .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}

.CheckList .body{width: 100% !important;list-style: none;padding-left: 0px;padding: 0px;margin-bottom:0px;display:table;margin:0px;box-sizing:border-box;}
.CheckList .body .item{line-height: @rowH;height: @rowH;text-align: left;margin: 0px;display: table-row;width: 100%;color: white;}
.CheckList .body .item{background-color:white;color:@HeaderBgCol;}
.CheckList .body .item > div{display: table-cell;.border('bottom');.border('right');padding: 0px 0px 0px 0px;vertical-align: middle;text-align:center;}
.CheckList.body .item .option .overflow > span{border:none;font-size:12px;display: initial;margin-right:5px;}
.CheckList .body .item .option .overflow > span:hover{cursor:pointer;}
.CheckList .body .item .sep{border-right:2px solid @FontCol;}
.CheckList .body .item .count_item{width:80px;}

.CheckList .item .overflow{margin:0 auto;}
.CheckList.body .item .align .overflow{text-align:left}
.CheckList .body .item .overflow.sit-click,.CheckList .item .overflow .sit-click{
    color:#03ab67;
    font-weight:bolder;
}
.CheckList .item .overflow.sit-click:hover,.CheckList .item .overflow .sit-click:hover{
    cursor:pointer;
    text-decoration:underline;
}


.CheckList .item > div,.CheckList .header .item > div{
display: table-cell;
border-bottom: 1px solid #e7eaec;
border-right: 1px solid #e7eaec;
padding: 0px 0px 0px 0px;
vertical-align: middle;
text-align: center;
}
.CheckList .header .item .overflow{
    margin:0 auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
}
.CheckList .header .item .inline-fatg{
    display:inline-block;
    float:left;
    height:100%;
    flex: 1;   
    border-right: 1px solid #fff;
}
.CheckList .header .item .inline_overflow{
    margin:0 auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
} 

.CheckList .header .item .inline-fatg.last{
    border-right: 1px solid transparent;
} 
</style>