<!-- 数据文件传输记录页面插件 -->
<template>
    <div class="DataTransfer">
        <ListAutoLayout>
            <!--搜索框-->
            <template slot="header">
                <ListHeader>

                    <ListSearchItem label="数据类型:">
                        <el-input placeholder="请输入" v-model="query.kind" ></el-input>
                    </ListSearchItem>

                    <ListSearchItem label="ZIP文件名称:">
                        <el-input placeholder="请输入" v-model="query.zipName" ></el-input>
                    </ListSearchItem>

                    <ListSearchItem label="接收时间:">
                        <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                    </ListSearchItem>

                    <ListSearchItem label="厂商:">
                        <FrimSel v-model="query.siteIndfirms" />
                    </ListSearchItem>

                    <ListSearchItem label="日志类型:">
                        <LogKindSel v-model="query.logKind" />
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
                <v-table-column>文件名</v-table-column>
                <v-table-column :width="150" >数据类型</v-table-column>
                <v-table-column :width="100" >数据条数</v-table-column>
                <v-table-column :width="100" >错误条数</v-table-column>
                <v-table-column>错误原因</v-table-column>
                <v-table-column :width="150" >接收时间</v-table-column>
                <v-table-column :width="100" >操作</v-table-column>
              </v-table-header>

              <v-table-body>
                  <v-table-row v-for="(d,i) in data" :key="i">
                    <v-table-column>{{d.zipName}}</v-table-column>
                    <v-table-column>{{d.dataType}}</v-table-column>
                    <v-table-column>{{d.actuals}}</v-table-column>
                    <v-table-column>{{d.invalids}}</v-table-column>
                    <v-table-column>{{d.message}}</v-table-column>   
                    <v-table-column>{{d.receiveTime}}</v-table-column>
                    <v-table-column><span class="clickItem" @click="Detail(d)">详细</span></v-table-column>  
                  </v-table-row>
              </v-table-body>

            </v-table>
            
            <template slot="footer">
                <Paging :pageIndex="page.index" :pageSize="page.size" :pageNum="page.num" :pageCount="page.count" @change="pageChange" />
            </template>
        </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'
import FrimSel from '../../components/FrimSel'
import LogKindSel from '../../components/LogKindSel'

import ExportBtn from '@/components/btns/ExportBtn'
import SearchBtn from '@/components/btns/SearchBtn'

import Paging from '@/components/Paging'

import Detail from './Detail'

import {ExportSep,DataTransExport} from '@/store/Export/types.js'

export default {
  name: 'DataTransfer',
  props:['firmId','timeRange'],
  components:{ListAutoLayout,ListHeader,ListSearchItem,FrimSel,
              ExportBtn,SearchBtn,LogKindSel,Paging},
  data(){
    return {
        simpleTime:{
            disabledDate(time) {
            return time.getTime() > Date.now();
            }
        },
        loading:false,
        data:[],
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        },
        query:{
            kind:'',
            zipName:'',
            time_range:null,
            siteIndfirms:'',
            logKind:'1'
        },
        cloneQuery:{
            kind:'',
            zipName:'',
            time_range:null,
            siteIndfirms:'',
            logKind:'1'
        }
    }
  },
  mounted(){
    this.query.siteIndfirms=this.firmId || '';
    this.query.time_range=this.timeRange;
    this.search();
  },
  methods:{
    refresh(){
        this.query={
            kind:'',
            zipName:'',
            time_range:null,
            siteIndfirms:'',
            logKind:''
        };

        this.search();
    },
    GetList(){
        this.loading=true;
        ser.GetFileTranserList({
            page:this.page.index,
            limit:this.page.num,
            sidx:'receive_time',
            order:'desc',
            query:{
                firm_id:this.query.siteIndfirms, 
                data_type:this.query.kind, 
                zip_name:this.query.zipName, 
                time:this.query.time_range?_t.Timestamp(this.query.time_range[0])+','+_t.DateTimestampByEndTime(this.query.time_range[1]):'', 
                status:this.query.logKind
            }
        }).then(res=>{
            this.loading=false;
            this.page.size=res.biz_body.totalPage;
            this.page.count=res.biz_body.totalCount;
            this.data=res.biz_body.list;
        })
    },
    search(){
        this.page.index=0;
        this.cloneQuery=_t.Clone(this.query);
        this.GetList();
    },
    pageChange(i){this.page.index=i;this.GetList()},
    //详细弹窗
    Detail(d){
        this.$open({
          title:'详细',
          area:['800px','400px'],
          components:{Detail},
          content:`<Detail :d="d" />`,
          data:{
            d:d
          },
          methods:{
            cancel(){this.close()}
          }
        });
    },
    //导出数据
    exportData(){
      return this.$store.dispatch(ExportSep,{
        type:DataTransExport,
        data:{
          query:{
            firm_id:this.cloneQuery.siteIndfirms, 
            data_type:this.cloneQuery.kind, 
            zip_name:this.cloneQuery.zipName, 
            time:this.cloneQuery.time_range?_t.Timestamp(this.cloneQuery.time_range[0])+','+_t.DateTimestampByEndTime(this.cloneQuery.time_range[1]):'', 
            status:this.cloneQuery.logKind
          }
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
.DataTransfer{width:100%;height:100%;box-sizing:border-box;text-align:left;}
</style>