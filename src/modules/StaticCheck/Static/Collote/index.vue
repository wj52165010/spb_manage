<!-- 采集详情页面插件 -->
<template>
    <div class="CollotePage">
        <ListAutoLayout>
        <!--搜索框-->
          <template slot="header">
              <ListHeader>
                <!--采集详情-->
                <ListSearchItem label="区域:" v-if="showChart">
                    <PlaceSearch  :blnRadio="true" c_searchKind="0" @place_res="selectArea" ref="RegionSel" />
                </ListSearchItem>

                <ListSearchItem label="厂商:" v-if="showChart">
                    <FrimSel v-model="query.firm" />
                </ListSearchItem>

                <ListSearchItem label="日期范围:" v-if="showChart">
                    <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                </ListSearchItem>

                <ListSearchItem label="数据来源:" v-if="showChart">
                    <DataSourceSel v-model="query.dataSource" />
                </ListSearchItem>

                <!--接入统计-->
                <ListSearchItem label="厂商:" v-if="!showChart">
                    <FrimSel v-model="query.joinFirm" />
                </ListSearchItem>
                <ListSearchItem label="日期范围:" v-if="!showChart">
                    <el-date-picker v-model="query.join_time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                </ListSearchItem>


                <template slot="bar">
                    <el-tooltip class="item" content="图表" >
                        <i class="fa fa-area-chart hoverSubBgColtwo btnItem" :class="{subColtwo:showChart}" @click="showChart=true" />
                    </el-tooltip>
                    <el-tooltip class="item" content="列表" >
                        <i class="fa fa-bars hoverSubBgColtwo btnItem" :class="{subColtwo:!showChart}" @click="showChart=false" />
                    </el-tooltip>
                    <ExportBtn v-if="!showChart" :FuncName="exportFirmData" />
                </template>

              </ListHeader>
          </template>

          <!--内容项-->
            <div class="content_container">
                <template v-if="showChart">
                    <div class="count_item" v-for="(i,index) in detais" :key="index">
                        <LineCount ref="lineCount" 
                            :name="i.name" 
                            :keyWord="i.key" 
                            :time="i.time"
                            :region="query.region"
                            :firm="query.firm" 
                            :microprobe="query.dataSource"
                        />
                    </div>
                </template>

                <ColloteList v-if="!showChart" :Listfirm="query.joinFirm" :countTime="query.join_time_range" />

            </div>
        </ListAutoLayout>
    </div>
</template>

<script>

import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'

import PlaceSearch from '@/modules/SiteManage/components/PlaceSearch'
import FrimSel from '../../../components/FrimSel'
import DataSourceSel from '../../../components/DataSourceSel'

import ExportBtn from '@/components/btns/ExportBtn'

import LineCount from './components/LineCount'

import ColloteList from './List'

import {ExportSep,AllFirmsCollectInfoExport} from '@/store/Export/types.js'

export default {
  name: 'CollotePage',
  components:{
      ListAutoLayout,ListHeader,ListSearchItem,
      FrimSel,PlaceSearch,DataSourceSel,ExportBtn,
      LineCount,ColloteList
    },
  data(){
    return {
        simpleTime:{
            disabledDate(time) {
                let date=new  Date();
                date.setDate(date.getDate()-1)
                return time.getTime() > date;
            }
        },
        loading:false,
        showChart:true,
        query:{
            region:'',
            firm:'',
            time_range:null,
            dataSource:'',
            joinFirm:'',
            join_time_range:null,
        },
        countType:{
            '采集总量':'all',
            '真实身份':'customer_archives',
            '虚拟身份':'virtual_archives',
            '手机号':'mobile_archives',
            'MAC':'mac_archives',
            '上网日志':'netlogs'
        },
        detais:[]
    }
  },
  watch:{
    'query.time_range'(){
        this.initData();
    }
  },
  mounted(){
    this.initData();
  },
  methods:{
    refresh(){
        this.query={
            region:'',
            firm:'',
            time_range:null,
            dataSource:'',
            joinFirm:'',
            join_time_range:null,
        };
        this.showChart=true;
        this.$refs.RegionSel.clear();
        this.initData();
    },
    initData(){
        //构造当前详细默认时间
        this.detais=_.map(this.countType,(val,key)=>{
            let date=new Date(),startTime=new Date();
            startTime.setDate(startTime.getDate()-30);
            date.setDate(date.getDate()-1);
            if(this.query.time_range){
                startTime=this.query.time_range[0];
                date=this.query.time_range[1];
            } 

            return {
                name:key,
                key:val,
                startTime:_t.DateFormat(startTime,'yyyy-MM-dd'),
                endTime:_t.DateFormat(date,'yyyy-MM-dd'),
                time:[_t.DateFormat(startTime,'yyyy-MM-dd'),_t.DateFormat(date,'yyyy-MM-dd')]
            };
        });
    },
    selectArea(val,data){
        if(data){
            this.query.region=_.map(data.regions,c=>c.code).join(',');
        }else{
            this.query.region="";
        }
    },
    exportFirmData(){
        return this.$store.dispatch(ExportSep,{
            type:AllFirmsCollectInfoExport,
            data:{
                query:{
                    firm_id:this.query.joinFirm,
                    receive_time_start:this.query.join_time_range && this.query.join_time_range[0]?_t.Timestamp(this.query.join_time_range[0]):'',
                    receive_time_end:this.query.join_time_range && this.query.join_time_range[1]?_t.Timestamp(this.query.join_time_range[1]):''
                }
            }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.CollotePage{width:100%;height:100%;box-sizing:border-box;text-align:left;}
.CollotePage .btnItem{margin-left:10px;cursor:pointer;}
.CollotePage .content_container{width:100%;height:100%;}
.CollotePage .count_item{display:inline-block;width:32.5%;margin-right:.5%;height:46.75%;margin-bottom:.5%;}
.CollotePage .count_item:nth-child(6),
.CollotePage .count_item:nth-child(5),
.CollotePage .count_item:nth-child(4){margin-bottom:0px;}

.CollotePage .count_item:nth-child(6), 
.CollotePage .count_item:nth-child(3){margin-right:0px;}
</style>