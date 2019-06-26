<!-- 数据接收详情页面插件 -->
<template>
    <div class="DataReceive">
      <ListAutoLayout>
          <!--搜索框-->
          <template slot="header">
              <ListHeader>

                  <ListSearchItem label="接收时间:">
                      <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                  </ListSearchItem>

                  <ListSearchItem label="厂商:">
                      <FrimSel v-model="query.siteIndfirms" />
                  </ListSearchItem>

                  <ListSearchItem>
                      <SearchBtn @click="search()" :disable="loading" />
                  </ListSearchItem>

                  <template slot="bar">
                      <ExportBtn :FuncName="exportData" />
                  </template>

              </ListHeader>
          </template>

          <v-table :listen="data" ref="listTable" :blnLoading="loading">
            
            <v-table-header>
              <v-table-column>厂商</v-table-column>
              <v-table-column :width="120" >厂商编码</v-table-column>
              <v-table-column :width="120" >上报条数</v-table-column>
              <v-table-column :width="120" >实际条数</v-table-column>
              <v-table-column :width="120" >有效条数</v-table-column>
              <v-table-column :width="120" >无效条数</v-table-column>
              <v-table-column :width="120" >有效率</v-table-column>
              <v-table-column :width="100" >操作</v-table-column>
            </v-table-header>

            <v-table-body>
                <v-table-row v-for="(d,i) in data" :key="i">
                  <v-table-column>{{d.厂商名称}}</v-table-column>
                  <v-table-column>{{d.厂商编码}}</v-table-column>
                  <v-table-column>{{d.data.上报条数}}</v-table-column>
                  <v-table-column>{{d.data.实际条数}}</v-table-column>
                  <v-table-column>{{d.data.有效条数}}</v-table-column>   
                  <v-table-column>{{d.data.无效条数}}</v-table-column>
                  <v-table-column>{{d.data.有效率}}</v-table-column>
                  <v-table-column><span class="clickItem" @click="Detail(d)">详细</span></v-table-column>  
                </v-table-row>
            </v-table-body>

          </v-table>

      </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'
import FrimSel from '../../components/FrimSel'

import ExportBtn from '@/components/btns/ExportBtn'
import SearchBtn from '@/components/btns/SearchBtn'
import Transfer from '../Transfer'

import {ExportSep,DataReciverExport} from '@/store/Export/types.js'

export default {
  name: 'DataReceive',
  components:{ListAutoLayout,ListHeader,ListSearchItem,FrimSel,
              ExportBtn,SearchBtn},
  data(){
    return {
        simpleTime:{
            disabledDate(time) {
            return time.getTime() > Date.now();
            }
        },
        loading:false,
        data:[],
        query:{
            time_range:null,
            siteIndfirms:'',
        },
        cloneQuery:{
          time_range:null,
          siteIndfirms:'',
        }
    }
  },
  mounted(){
    this.GetList();
  },
  methods:{
    refresh(){
        this.query={
            time_range:null,
            siteIndfirms:'',
        };

        this.GetList();
    },
    GetList(){
      this.loading=true;
      ser.GetDataMassFirmDetail({
        query:{
          firm_id:this.query.siteIndfirms,
          receive_time_start:this.query.time_range?_t.Timestamp(this.query.time_range[0]):'',
          receive_time_end:this.query.time_range?_t.DateTimestampByEndTime(this.query.time_range[1]):'',
        }
      }).then(res=>{
        this.loading=false;
        this.data=res.biz_body;
      })
    },
    search(){
      this.cloneQuery=_t.Clone(this.query);
      this.GetList();
    },
    //详细页面弹窗
    Detail(d){
        this.$open({
          title:'详细',
          initMaxMin:true,
          components:{Transfer},
          content:`<Transfer :firmId='firmId' :timeRange="timeRange" />`,
          data:{
            firmId:d.厂商编码,
            timeRange:this.cloneQuery.time_range
          },
          methods:{
            cancel(){this.close()}
          }
        });
    },
    //导出数据
    exportData(){
      return this.$store.dispatch(ExportSep,{
        type:DataReciverExport,
        data:{
          query:{
            firm_id:this.cloneQuery.siteIndfirms,
            receive_time_start:this.cloneQuery.time_range?_t.Timestamp(this.cloneQuery.time_range[0]):'',
            receive_time_end:this.cloneQuery.time_range?_t.DateTimestampByEndTime(this.cloneQuery.time_range[1]):'',
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.DataReceive{width:100%;height:100%;box-sizing:border-box;text-align:left;}
</style>