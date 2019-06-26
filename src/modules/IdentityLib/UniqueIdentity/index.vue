<!-- 头部页面插件 -->
<template>
    <div class="UniqueIdentity">
      <ListAutoLayout ref="layout">

        <!--搜索框-->
        <template slot="header">
        
          <ListHeader>  

            <ListSearchItem>
              <el-input placeholder="请输入内容" v-model="userName" style="width:200px;">
                <template slot="prepend"><i class="fa fa-search" /></template>
              </el-input>
            </ListSearchItem>

            <template slot="bar">
              <SelBtn :blnSel="blnSel" @click="blnSel=!blnSel" />
            </template>
          </ListHeader>

        </template>

        <!--列表项-->
        <CheckList ref="listCheck" :data="data" :blnSel="blnSel" id="dataId" @change="selChange" :blnLoading="loading" @rowClick="rowClick">
          <template slot="header">
              <v-table-column :width="100">证件类型</v-table-column>
              <v-table-column :width="80">照片</v-table-column>
              <v-table-column :width="150">姓名</v-table-column>
              <v-table-column :width="200">证件号码</v-table-column>
              <v-table-column :width="100">名族</v-table-column>
              <v-table-column :width="50">姓名</v-table-column>
              <v-table-column :width="150">出生日期</v-table-column>
              <v-table-column >出生地</v-table-column>
              <v-table-column :width="200"><ListSortBtn name="最近采集时间" field="last_time" :order="true" @change="mainOrderChange" /></v-table-column>
              <v-table-column :width="200">采集场所</v-table-column>
              <v-table-column >场所名称</v-table-column>
              <v-table-column :width="100">关联身份</v-table-column>
              <v-table-column :width="80">关注</v-table-column>
          </template>
          <template slot="body" slot-scope="{d}">
              <v-table-column :width="100">{{d.certificate_type_name}}</v-table-column>
              <v-table-column :width="80">
                <el-tooltip placement="top">
                  <div slot="content">
                    <img v-headimg="d.photo_name" style="width:100px;height:100px;" />
                  </div>
                  <img v-headimg="d.photo_name" style="width:30px;height:30px;margin-top:3px;" />
                </el-tooltip>
              </v-table-column>
              <v-table-column :width="150">{{d.customer_name}}</v-table-column>
              <v-table-column :width="200">{{d.certificate_code}}</v-table-column>
              <v-table-column :width="100">{{d.nation}}</v-table-column>
              <v-table-column :width="50">{{d.sex}}</v-table-column>
              <v-table-column :width="150">{{d.birth}}</v-table-column>
              <v-table-column :title="d.address">{{d.address}}</v-table-column>
              <v-table-column :width="200">{{d.last_time_str}}</v-table-column>
              <v-table-column :width="200"><span class="clickItem" @click.stop="SiteDetail(d.last_netbar_wacode,d.microprobe_type)">{{d.last_netbar_wacode}}</span></v-table-column>
              <v-table-column :title="(d.netbar || {}).netbarName">{{(d.netbar || {}).netbarName}}</v-table-column>
              <v-table-column :width="100">{{d.relation_count}}</v-table-column>
              <v-table-column :width="80">
                <el-tooltip class="item" :content="d.focused?'关闭关注':'开启关注'" placement="top">
                  <i class="fa fa-bell" :style="{color:d.focused?'red':''}" v-lock:click="()=>toggleAttent(d)" />
                </el-tooltip>
              </v-table-column>
          </template>

          <template slot="extra" slot-scope="{d}">
              <v-table-row :child="true">
                <!--子列表-->
                <div class="fadeIn" style="padding:30px 50px;position:relative;" v-if="d.blnshow">

                  <Loading v-if="d.blnLoading" :simple="true" />
                  <Nodata  v-if="d.childData.length<=0 && !d.blnLoading" />
                  <v-table :listen="d.childData" :base="true" v-if="d.childData.length>0">
                        <v-table-header :style="{'background-color':'transparent !important','color':'white'}">
                            <v-table-column :width="250">账号类型</v-table-column>
                            <v-table-column :width="150">虚拟身份类型</v-table-column>
                            <v-table-column :width="150">账号</v-table-column>
                            <v-table-column :width="150"><ListSortBtn name="最近采集时间" field="last_time" :order="true" :context="d" @change="subOrderChange" /></v-table-column>
                            <v-table-column :width="150">采集场所</v-table-column>
                            <v-table-column >场所地址</v-table-column>
                            <v-table-column :width="150">本人持有概率<span style="font-size:12px">(参考)</span></v-table-column>
                        </v-table-header>
                        <v-table-body>
                            <v-table-row v-for="(c,i) in d.childData" :key="i">
                                <v-table-column :width="150" :title="c.data_type_name">{{c.data_type_name}}</v-table-column>
                                <v-table-column :width="150">{{c.account_type_name}}</v-table-column>
                                <v-table-column :width="150">{{c.account}}</v-table-column>
                                <v-table-column :width="150">{{c.last_time_str}}</v-table-column>
                                <v-table-column :width="150"><span class="clickItem" @click.stop="SiteDetail(c.last_netbar_wacode,d.microprobe_type)">{{c.last_netbar_wacode}}</span></v-table-column>
                                <v-table-column :title="(c.netbar || {}).netbarAddres">{{(c.netbar || {}).netbarAddress}}</v-table-column>
                                <v-table-column :width="150"><span class="clickItem" @click.stop="UsageDetail(d,c)">{{Math.floor(c.support*100)}}%</span></v-table-column>
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
import ListSortBtn from '@/components/list/ListSortBtn'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'

import CheckList from '@/components/CheckList'
import ExportBtn from '@/components/btns/ExportBtn'
import SelBtn from '@/components/btns/SelBtn'

import SiteDetail from '@/modules/SiteManage/List/SiteDetail'
import UsageDetail from './UsageDetail'
import Loading from '@/components/Loading'

import {Export,UniqueIdentityListExport} from '@/store/Export/types.js'

export default {
  name: 'UniqueIdentity',
  role:'UniqueIdentity',
  components:{ListAutoLayout,Paging,ListSortBtn,
              CheckList,ExportBtn,SelBtn,
              ListHeader,ListSearchItem,Loading},
  data(){
    return {
      loading:false,
      userName:'',
      data:[
        // {code:1,blnshow:false,childData:[1,2],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:2,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:3,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:4,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:5,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:6,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:7,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:8,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:9,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:10,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:11,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        // {code:12,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
      ],
      page:{
          index:0,    //当前页号
          size:0,     //页数
          num:15,     //每页显示条数
          count:0,    //列表总数    
      },
      orderObj:{sort:'last_time',order:'desc'},//排序字段
      selIds:[],//选中项的IDS
      blnSel:false,
      debounceInput:null,
    }
  },
  computed:{
  },
  watch:{
    userName(){
      this.debounceInput();
    }
  },
  mounted(){
    this.Search();
    this.debounceInput =_.debounce(this.Search,300);
  },
  methods:{
    refresh(){
      this.userName='';
      // this.page.index=0;
      // this.GetList();
    },
    layout(){
      this.$refs.layout.ResizeHandler();
    },
    //获取列表信息
    GetList(){
      this.loading=true;
      ser.GetIdInfoList({
        page:this.page.index,
        limit:this.page.num,
        sidx:this.orderObj.sort,
        order:this.orderObj.order,
        query:{key:this.userName}
      }).then(res=>{
        this.loading=false;
        this.data=_.map(res.biz_body.list || [],d=>{

          return {...d,
                  childData:[],
                  blnshow:false,
                  blnLoading:false,
                  birth:`${d.birth.slice(0,4)}-${d.birth.slice(4,6)}-${d.birth.slice(6)}`,
                  orderObj:{sort:'last_time',order:'desc'},
                }
        });
        this.page.size=res.biz_body.totalPage;
        this.page.count=res.biz_body.totalCount;
      });
    },
    Search(){
      this.page.index=0;
      this.$refs.listCheck.clear();
      this.GetList();
    },
    //数据项单击事件
    rowClick(d){
      d.blnLoading=true;
      ser.GetIdInfoRlationById(`${d.certificate_type}_${d.certificate_code}`).then(res=>{
        d.blnLoading=false;
        d.childData=res.biz_body.sort((a,b)=>{
          return  d.orderObj.order=='desc'?b.last_time-a.last_time:a.last_time-b.last_time;
        });

      });
    },
    //主列表排序
    mainOrderChange(type,val){
      this.orderObj.sort=type;
      this.orderObj.order=val?'desc':'asc';
      this.GetList();
    },
    //字列表排序
    subOrderChange(type,val,d){
      d.orderObj.sort=type;
      d.orderObj.order=val?'desc':'asc';

      d.childData=d.childData.sort((a,b)=>{
        return  d.orderObj.order=='desc'?b.last_time-a.last_time:a.last_time-b.last_time;
      });
      
    },
    //切换关注
    toggleAttent(d){
      ser[!d.focused?'AddIdInfoFocus':'DelIdInfoFocus'](`${d.certificate_type}_${d.certificate_code}`).then(res=>{
        if(!_t.msg(res,'操作成功!')) return;

        d.focused=!d.focused;

      });
      
    },
    pageChange(i){
      this.page.index=i;
      this.GetList();
    },
    //场所详细
    SiteDetail(id,type){
      this.$open({
        title:'场所详情',
        area:['1000px','640px'],
        components:{SiteDetail},
        content:'<SiteDetail :id="id" :type="type" />',
        data:{
          id:id || 0,
          type:type || '网吧',
        },
        methods:{
          
          close(){this.close()}
        }
      });
    },
    //本人持有概率详细(弹窗)
    UsageDetail(d,c){
      this.$open({
        title:'概率详情',
        area:['800px','500px'],
        components:{UsageDetail},
        content:'<UsageDetail :d="d" :c="c" />',
        data:{
          d:d,
          c:c
        },
        methods:{
          close(){this.close()}
        }
      });
    },
    //多选改变事件
    selChange(sels){this.selIds=sels;},
    exportData(){
        return this.$store.dispatch(Export,{
            type:UniqueIdentityListExport,
            pageCount:this.page.count,
            data:{
                sidx:this.orderObj.sort,
                order:this.orderObj.order,
                query:{
                    ids:this.selIds.join(','),
                    key:this.userName
                }
            }
        })
    },
  }
}
</script>

<style lang="less" scoped>
.UniqueIdentity{width:100%;height:100%;box-sizing:border-box;text-align:left;}
</style>