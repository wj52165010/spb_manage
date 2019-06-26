<!-- 昨日采集详情页面插件 -->
<template>
    <div class="ColloctDetail">
        <ListAutoLayout>    
            <template slot="header">
                <ListHeader>
                    <ListSearchItem>
                        <i class="fa fa-area-chart " style="cursor:pointer;"
                           :class="{subBgColtwoBorder:blnBar,subColtwo:blnBar}" @click="blnBar=true" />
                    </ListSearchItem>
                    <ListSearchItem>
                        <i class="fa fa-line-chart" style="cursor:pointer;"
                           :class="{subBgColtwoBorder:!blnBar,subColtwo:!blnBar}" @click="blnBar=false" />
                    </ListSearchItem>

                    <template slot="bar">
                        <span class="btnItem hoverSubBgColtwo"  v-if="!blnBar"
                              :class="{subBgColtwoBorder:period==0,subColtwo:period==0}" @click="period=0">近一周</span>
                        <span class="btnItem hoverSubBgColtwo" v-if="!blnBar"
                              :class="{subBgColtwoBorder:period==1,subColtwo:period==1}" @click="period=1">近一月</span>
                    </template>

                </ListHeader>
            </template>


            <div :id="chartLastId" style="width:100%;height:100%;box-sizing:border-box;" v-show="blnBar"></div>
            <div :id="chartHisId" style="width:100%;height:100%;box-sizing:border-box;" v-show="!blnBar"></div>

        </ListAutoLayout>

        <Loading v-if="loading" />
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'
import Chart from '@/wraplib/Chart/chart'
import Loading from '@/components/Loading'

export default {
  name: 'ColloctDetail',
  props:['code'],
  components:{ListAutoLayout,ListHeader,ListSearchItem,Loading},
  data(){
    return {
        chartLastId:'chartLast'+_t.guid(),
        chartHisId:'ChartHistrory'+_t.guid(),
        loading:false,
        period:0,//0:一周/1:一月
        blnBar:true,
        chartHistory:null,
        chartLast:null,
    }
  },
  watch:{
    blnBar(){
        this.$nextTick(()=>{
            this.blnBar?this.chartLast.resize():this.chartHistory.resize();
        });
    },
    period(){this.GetHistory()}
  },
  mounted(){
    setTimeout(()=>{
        this.initChart();
        this.GetYesteday();
        this.GetHistory();
    },100);
  },
  methods:{
    initChart(){
        this.chartLast=new Chart(this.chartLastId);
        this.chartLast.lastColloct();
        this.chartHistory=new Chart(this.chartHisId);
        this.chartHistory.historyColloct();
    },
    //获取昨日采集详细信息
    GetYesteday(){
        ser.GetDeviceYesterday(this.code).then(res=>{
            let data={x:[],y:[]};

            _.each(res.biz_body,b=>{
                data.x.push(b.count);
                data.y.push(b.title);
            });

            this.chartLast.lastColloct(data);
        });
    },
    //获取历史记录信息
    GetHistory(){
        ser.GetDeviceHistory({
            query:{
                equipment_id:this.code,
                coll_type:this.period?'week':'month'
            }
        }).then(res=>{
            let data={y:[],x:{}};

            _.each(res.biz_body,b=>{
                data.y.push(b.date.slice(0,4)+'-'+b.date.slice(5,6)+'-'+b.date.slice(7));

                _.each(b.coll,c=>{
                    data.x[c.title]=data.x[c.title] || [];
                    data.x[c.title].push(c.count);
                });
            });

            this.chartHistory.historyColloct(data);
        });
    },
    ResizeHandler(){
        this.blnBar?this.chartLast.resize():this.chartHistory.resize();
    }
  }
}
</script>

<style lang="less" scoped>
.ColloctDetail{width:100%;height:100%;box-sizing:border-box;text-align:left;position:relative;}
.ColloctDetail .btnItem{margin-left:10px;cursor:pointer;border-bottom:2px solid;}
</style>