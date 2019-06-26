<!-- 昨日采集趋势页面插件 -->
<template>
    <div class="ColloctTrend">
        <ListAutoLayout>    
            <template slot="header">
                <ListHeader>
                    <ListSearchItem label="昨日采集:">{{last_num}}</ListSearchItem>
                    <ListSearchItem label="累计采集:">{{total_num}}</ListSearchItem>

                    <template slot="bar">
                        <span class="btnItem hoverSubBgColtwo" 
                              :class="{subBgColtwoBorder:period==0,subColtwo:period==0}" @click="period=0">近一周</span>
                        <span class="btnItem hoverSubBgColtwo"
                              :class="{subBgColtwoBorder:period==1,subColtwo:period==1}" @click="period=1">近一月</span>
                    </template>

                </ListHeader>
            </template>

            <div :id="chartId" style="width:100%;height:100%;box-sizing:border-box;"></div>

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
  name: 'ColloctTrend',
  props:['code'],
  components:{ListAutoLayout,ListHeader,ListSearchItem,Loading},
  data(){
    return {
        chartId:'Chart'+_t.guid(),
        loading:false,
        period:0,//0:一周/1:一月
        chartIns:null,
        last_num:0,
        total_num:0,
    }
  },
  watch:{
    period(){
        this.GetData();
    }
  },
  mounted(){
    setTimeout(()=>{
        this.initChart();
        this.GetData();
    },100);
  },
  methods:{
    initChart(){
        this.chartIns=new Chart(this.chartId);
        this.chartIns.trendLine();
    },
    GetData(){
        ser.GetDeviceTendency({
            query:{
                equipment_id:this.code,
                coll_type:this.period?'month':'week'
            }
        }).then(res=>{
            this.last_num=res.biz_body.last_num;
            this.total_num=res.biz_body.total_num;

            let data={dates:[],datas:[]}
            _.each(res.biz_body.chart,c=>{
                data.dates.push(c.stat_date.slice(0,4)+'-'+c.stat_date.slice(4,6)+'-'+c.stat_date.slice(6))
                data.datas.push(c.detect_num);
                this.chartIns.trendLine(data);
            })
        });
    },
    ResizeHandler(){
        setTimeout(()=>{
            this.chartIns.resize();
        },100);
    }
  }
}
</script>

<style lang="less" scoped>
.ColloctTrend{width:100%;height:100%;box-sizing:border-box;text-align:left;position:relative;}
.ColloctTrend .btnItem{margin-left:10px;cursor:pointer;border-bottom:2px solid;}
</style>