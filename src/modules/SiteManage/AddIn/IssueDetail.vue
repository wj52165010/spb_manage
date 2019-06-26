<!-- 问题详细页面插件 -->
<template>
    <div class="IssueDetail">
        <ListAutoLayout>
            <!--搜索框-->
            <template slot="header">
                <ListHeader>

                    <ListSearchItem label="时间范围:">
                        <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                    </ListSearchItem>

                    <template slot="bar">
                        <SelBtn :blnSel="blnSel" @click="blnSel=!blnSel" />
                    </template>
                </ListHeader>
            </template>

            <!--列表-->
            <CheckList ref="listCheck" :data="data" :blnSel="blnSel" id="stat_date" @change="selChange" :blnLoading="blnLoading" @rowClick="rowClick">

                <template slot="header">
                    <v-table-column :width="150" ><ListSortBtn name="发布时间" :order="true" field="stat_date"  @change="orderChange" /></v-table-column>
                    <v-table-column>问题详情</v-table-column>
                </template>

                <template slot="body" slot-scope="{d}">
                    <v-table-column>{{d.publishTime}}</v-table-column>
                    <v-table-column :title="d.abn_note">{{d.abn_note}}</v-table-column>
                </template>


                <template slot="extra" slot-scope="{d}">
                    <v-table-row :child="true">
                        <!--子列表-->
                        <div class="fadeIn" style="padding:30px 50px;" v-if="d.blnshow">
                            <Nodata v-if="d.childData.length<=0" />
                            <v-table :listen="d.childData" :base="true" v-if="d.childData.length>0">
                                <v-table-header :style="{'color':'white'}">
                                    <v-table-column v-for="(h,i) in  d.headers" :key="i">{{h}}</v-table-column>
                                </v-table-header>
                                <v-table-body>
                                    <v-table-row v-for="(c,i) in d.childData" :key="i">
                                        <v-table-column v-for="(g,i) in c" :key="i">{{g}}</v-table-column>
                                    </v-table-row>
                                </v-table-body>
                            </v-table>

                        </div>
                    </v-table-row>
                </template>

            </CheckList>


            <!--分页-->
            <template slot="footer">
                <Paging :pageIndex="page.index" :pageSize="page.size" :pageNum="page.num" :pageCount="page.count" @change="pageChange">
                    <template slot="pre">
                      <ExportBtn v-if="blnSel" :FuncName="exportData" />
                    </template>
                </Paging>
            </template>

        </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import Paging from '@/components/Paging'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'
import ListSortBtn from '@/components/list/ListSortBtn'
import CheckList from '@/components/CheckList'
import ExportBtn from '@/components/btns/ExportBtn'
import SelBtn from '@/components/btns/SelBtn'

import {Export,DualSystemPluginInfoExport} from '@/store/Export/types.js'

export default {
  name: 'IssueDetail',
  props:['d'],
  components:{ListAutoLayout,Paging,ListHeader,ListSearchItem,ListSortBtn,CheckList,ExportBtn,SelBtn},
  data(){
    return {
        simpleTime:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },
        blnSel:false,
        data:[
            // {code:1,blnshow:false,childData:[1,2],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
            // {code:2,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}}
        ],
        blnLoading:false,
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        },
        selIds:[],
        query:{
            time_range:null
        },
        orderObj:{sort:'stat_date',order:'desc'}
    }
  },
  watch:{
    'query.time_range':function(){
        this.$refs.listCheck.clear();
        this.page.index=0;this.GetData();
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    //获取数据
    GetData(){

        this.blnLoading=true;
        ser.GetExperIssueList({
            page:this.page.index,
            limit:this.page.num,
            sidx:this.orderObj.sort,
            order:this.orderObj.order,
            query:{
                netbar_wacode:this.d.netbarWacode,
                stat_date:this.query.time_range?`${_t.DateFormat(this.query.time_range[0],'yyyyMMdd')},${_t.DateFormat(this.query.time_range[1],'yyyyMMdd')}`:'',
                abnormal_object:this.d.abnormalObject,
                abnormal_type:this.d.abnormalType
            }
        }).then(res=>{
            this.blnLoading=false;
            res.biz_body=res.biz_body || {};
            this.data=_.map(res.biz_body.list || [],d=>{

                return {...d,
                        publishTime:d.stat_date.substring(0,4)+"-"+d.stat_date.substring(4,6)+"-"+d.stat_date.substring(6),
                        headers:[],
                        childData:[],
                        blnshow:false,
                        orderObj:{sort:'last_time',order:'desc'}
                        }
                });
                this.page.size=res.biz_body.totalPage;
                this.page.count=res.biz_body.totalCount;
            });
    },
    pageChange(i){
        this.page.index=i;
        this.GetData();
    },
    //数据项单击事件
    rowClick(d){
      ser.GetIssueDigest({
        netbar_wacode:d.netbar_wacode,
        stat_date:d.stat_date,
        abnormal_object:d.abnormal_object,
        abnormal_type:d.abnormal_type
      }).then(res=>{
        d.headers=_.keys(res.biz_body[0] || {});
        d.childData=res.biz_body;
      });
    },
    orderChange(type,val){
        this.orderObj.sort=type;
        this.orderObj.order=val?'desc':'asc';
        this.GetData();
    },
    //子列表排序
    subOrderChange(type,val,d){
      d.orderObj.sort=type;
      d.orderObj.order=val?'desc':'asc';

      d.childData=d.childData.sort((a,b)=>{
        return  d.orderObj.order=='desc'?b.last_time-a.last_time:a.last_time-b.last_time;
      });
    },
    exportData(){
        return this.$store.dispatch(Export,{
            type:DualSystemPluginInfoExport,
            pageCount:this.page.count,
            blnNoLimit:true,
            data:{
                sidx:this.orderObj.sort,
                order:this.orderObj.order,
                query:{
                    ids:this.selIds.join(','),
                    netbar_wacode:this.d.netbarWacode,
                    stat_date:this.query.time_range?`${_t.DateFormat(this.query.time_range[0],'yyyyMMdd')},${_t.DateFormat(this.query.time_range[1],'yyyyMMdd')}`:'',
                    abnormal_object:this.d.abnormalObject,
                    abnormal_type:this.d.abnormalType
                }
            }
        })
    },
    //多选改变事件
    selChange(sels){this.selIds=sels;},
  }
}
</script>

<style lang="less" scoped>
.IssueDetail{width:100%;height:100%;box-sizing:border-box;text-align:left;padding:10px;}
</style>