<!-- 数据有效率页面插件 -->
<template>
    <div class="DataEffect">
        <ListAutoLayout>
            <!--搜索框-->
            <template slot="header">
                <ListHeader>

                    <ListSearchItem label="厂商:">
                        <FrimSel v-model="query.siteIndfirms" />
                    </ListSearchItem>

                    <ListSearchItem>
                        <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                    </ListSearchItem>

                    <ListSearchItem>
                        <SearchBtn @click="search()" :disable="loading" />
                    </ListSearchItem>

                </ListHeader>
            </template>

            <!--图表容器-->
            <div class="chart_container" :id="chartId">
            
            </div>

        </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'
import FrimSel from '../../components/FrimSel'
import SearchBtn from '@/components/btns/SearchBtn'

import Chart from '@/wraplib/Chart/chart'

export default {
  name: 'DataEffect',
  components:{ListAutoLayout,ListHeader,ListSearchItem,FrimSel,SearchBtn},
  data(){
    return {
        simpleTime:{
            disabledDate(time) {
            return time.getTime() > Date.now();
            }
        },
        loading:false,
        chart:null,
        chartId:'chart'+_t.guid(),
        query:{
            siteIndfirms:'',
            time_range:null,
        }
    }
  },
  mounted(){
    this.initChart();
    this.GetList().then(data=>{
        this.chart.dataMassEffect(data);
    });
  },
  methods:{
    refresh(){
        this.query={
            siteIndfirms:'',
            time_range:null,
        };
        this.GetList().then(data=>{
            this.chart.dataMassEffect(data);
        });
    },
    GetList(){
        this.loading=true;
        return ser.GetDataMassRate({
            query:{
                firm_id:this.query.siteIndfirms,
                receive_time_start:this.query.time_range?_t.DateFormat(this.query.time_range[0],'yyyyMMdd'):'',
                receive_time_end:this.query.time_range?_t.DateFormat(this.query.time_range[1],'yyyyMMdd'):'',
            }
        }).then(res=>{
            this.loading=false;
            return res.biz_body;
        })
    },
    search(){
        this.GetList().then(data=>{
            this.chart.dataMassEffect(data);
        });
    },
    initChart(){
        this.chart= new Chart(this.chartId);
        this.chart.dataMassEffect();
    },
    ResizeHandler(){
        setTimeout(()=>{
            this.chart.resize();
        },100);
    }
  }
}
</script>

<style lang="less" scoped>
.DataEffect{width:100%;height:100%;box-sizing:border-box;text-align:left;}
.DataEffect .chart_container{width:100%;height:100%;box-sizing:border-box;}
</style>