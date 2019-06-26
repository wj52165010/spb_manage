<!-- 未实名人员页面插件 -->
<template>
    <div class="NoRealName">
        <ListAutoLayout ref="layout">

            <!--搜索框-->
            <template slot="header">
                <ListHeader>

                  <ListSearchItem label="场所范围:">
                    <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectSite" ref="PlaceSearch" />
                  </ListSearchItem>

                  <ListSearchItem label="身份信息:">
                    <el-input placeholder="请输入" v-model="query.identity" ></el-input>
                  </ListSearchItem>

                  <ListSearchItem label="时间范围:">
                    <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                  </ListSearchItem>

                  <ListSearchItem>
                    <SearchBtn  @click="Search()" :disable="loading" />
                  </ListSearchItem>

                  <template slot="bar">
                    <SelBtn :blnSel="blnSel" @click="blnSel=!blnSel" />
                  </template>

                </ListHeader>
            </template>

            <!--列表项-->
            <CheckList ref="listCheck" :data="data" :blnSel="blnSel" id="dataId" @change="selChange" :blnLoading="loading" @rowClick="rowClick">
                <template slot="header">
                    <v-table-column :width="60">状态</v-table-column>
                    <v-table-column :width="200">虚拟身份类型</v-table-column>
                    <v-table-column :width="100">虚拟身份账号</v-table-column>
                    <v-table-column :width="200">最近上机证件号</v-table-column>
                    <v-table-column :width="80">证件类型</v-table-column>
                    <v-table-column :width="50">姓名</v-table-column>
                    <v-table-column :width="80">照片</v-table-column>
                    <v-table-column :width="60">性别</v-table-column>
                    <v-table-column :width="60">民族</v-table-column>
                    <v-table-column :width="100">关联证件</v-table-column>
                    <v-table-column :width="150"><ListSortBtn name="最近上机时间" field="last_time" :order="true" @change="mainOrderChange" /></v-table-column>
                    <v-table-column :width="100">场所编码</v-table-column>
                    <v-table-column >场所名称</v-table-column>
                    <v-table-column :width="100">座位号(IP)</v-table-column>
                    <v-table-column :width="90">关注</v-table-column>
                </template>
                <template slot="body" slot-scope="{d}">
                    <v-table-column >{{d.online_status}}</v-table-column>
                    <v-table-column :title="d.account_type_name">{{d.account_type_name}}</v-table-column>
                    <v-table-column :title="d.account">{{d.account}}</v-table-column>
                    <v-table-column >{{(d.cert || {}).certificate_code}}</v-table-column>
                    <v-table-column >{{(d.cert || {}).certificate_type_name}}</v-table-column>
                    <v-table-column >{{(d.cert || {}).customer_name}}</v-table-column>
                    <v-table-column >
                        <el-tooltip placement="top">
                            <div slot="content">
                                <img v-headimg="(d.cert || {}).photo_name" style="width:100px;height:100px;" />
                            </div>
                            <img v-headimg="(d.cert || {}).photo_name" style="width:30px;height:30px;margin-top:3px;" />
                        </el-tooltip>
                    </v-table-column>
                    <v-table-column >{{(d.cert || {}).sex}}</v-table-column>
                    <v-table-column >{{(d.cert || {}).nation}}</v-table-column>
                    <v-table-column >{{d.relation_count}}</v-table-column>
                    <v-table-column >{{(d.cert || {}).last_time_str}}</v-table-column>
                    <v-table-column >{{((d.cert || {}).netbar || {}).netbarWacode}}</v-table-column>
                    <v-table-column >{{((d.cert || {}).netbar || {}).netbarName}}</v-table-column>
                    <v-table-column >{{d.terminal_ip}}</v-table-column>
                    <v-table-column >
                      <el-tooltip class="item" :content="d._focus?'关闭关注':'开启关注'" placement="top">
                        <i class="fa fa-bell" :style="{color:d._focus?'red':''}" v-lock:click="()=>toggleAttent(d)" />
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
                                    <v-table-column :width="200">证件类型</v-table-column>
                                    <v-table-column :width="80">照片</v-table-column>
                                    <v-table-column :width="100">姓名</v-table-column>
                                    <v-table-column :width="200">证件号码</v-table-column>
                                    <v-table-column :width="60">民族</v-table-column>
                                    <v-table-column :width="60">性别</v-table-column>
                                    <v-table-column :width="150"><ListSortBtn name="最近采集时间" field="last_time" :order="true" :context="d" @change="subOrderChange" /></v-table-column>
                                    <v-table-column :width="150">采集场所</v-table-column>
                                    <v-table-column >场所地址</v-table-column>
                                    <v-table-column :width="150">本人持有概率<span style="font-size:12px">(参考)</span></v-table-column>
                                </v-table-header>
                                <v-table-body>
                                    <v-table-row v-for="(c,i) in d.childData" :key="i">
                                        <v-table-column><span v-if="c.is_circulat">(循环卡)</span>{{c.certificate_type_name}}</v-table-column>
                                        <v-table-column >
                                            <el-tooltip placement="top">
                                                <div slot="content">
                                                    <img v-headimg="c.photo_name" style="width:100px;height:100px;" />
                                                </div>
                                                <img v-headimg="c.photo_name" style="width:30px;height:30px;margin-top:3px;" />
                                            </el-tooltip>
                                        </v-table-column>
                                        <v-table-column>{{c.customer_name}}</v-table-column>
                                        <v-table-column>{{c.certificate_code}}</v-table-column>
                                        <v-table-column>{{c.nation}}</v-table-column>
                                        <v-table-column>{{c.sex}}</v-table-column>
                                        <v-table-column>{{c.last_time_str}}</v-table-column>
                                        <v-table-column><span class="clickItem" @click.stop="SiteDetail(c.last_netbar_wacode,d.microprobe_type)">{{(c.netbar || {}).netbarWacode}}</span></v-table-column>
                                        <v-table-column >{{(c.netbar || {}).netbarAddress}}</v-table-column>
                                        <v-table-column><span class="clickItem" @click.stop="UsageDetail(d,c)">{{c.support*100}}%</span></v-table-column>
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
import SearchBtn from '@/components/btns/SearchBtn'

import SiteDetail from '@/modules/SiteManage/List/SiteDetail'
import UsageDetail from './UsageDetail'
import PlaceSearch from '@/modules/SiteManage/components/PlaceSearch'
import Loading from '@/components/Loading'

import {Export,NoRealNameListExport} from '@/store/Export/types.js'

export default {
  name: 'NoRealName',
  components:{ListAutoLayout,Paging,ListSortBtn,
              CheckList,ExportBtn,SelBtn,
              PlaceSearch,ListHeader,ListSearchItem,
              SearchBtn,Loading},
  data(){
    return {
      simpleTime:{
        disabledDate(time) {
        return time.getTime() > Date.now();
        }
      },
      loading:false,
      data:[
        //{code:1,blnshow:false,childData:[1,2],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}},
        //{code:2,blnshow:false,childData:[],timeOrder:false,orderObj:{sort:'create_time',order:'asc'}}
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
      query:{
        netsite_range:[],
        time_range:[],
        identity:''
      },
      cloneQuery:{
        netsite_range:[],
        time_range:[],
        identity:''
      }
    }
  },
  mounted(){
    this.Search();
  },
  methods:{
    refresh(){
      this.$refs.PlaceSearch.clear();

      this.page.index=0;
      this.query={
        netsite_range:[],
        time_range:[],
        identity:''
      };

      this.GetListData();
    },
    layout(){
      this.$refs.layout.ResizeHandler();
    },
    //获取列表数据
    GetListData(){
      this.loading=true;
      ser.GetNoRealNameList({
        page:this.page.index,
        limit:this.page.num,
        sidx:this.orderObj.sort,
        order:this.orderObj.order,
        query:{
          locus_ids:_.map(this.query.netsite_range,n=>n.code).join(','),
          begin:this.query.time_range?_t.Timestamp(this.query.time_range[0]):0,
          end:this.query.time_range?_t.DateTimestampByEndTime(this.query.time_range[1]):0,
          key:this.query.identity
        }
      }).then(res=>{
        this.loading=false;
        this.data=_.map(res.biz_body.list || [],d=>{

          return {...d,
                  childData:[],
                  blnLoading:false,
                  blnshow:false,
                  orderObj:{sort:'last_time',order:'desc'},
                }
        });
        this.page.size=res.biz_body.totalPage;
        this.page.count=res.biz_body.totalCount;

      });
    },
    //查询
    Search(){
      this.page.index=0;
      this.cloneQuery=_t.Clone(this.query);
      this.$refs.listCheck.clear();
      this.GetListData();
    },
    //数据项单击事件
    rowClick(d){
      d.blnLoading=true;
      ser.GetNoRealNameRelationById(`${d.account_type}_${d.account}`).then(res=>{
        d.blnLoading=false;
        d.childData=res.biz_body.sort((a,b)=>{
          return  d.orderObj.order=='desc'?b.last_time-a.last_time:a.last_time-b.last_time;
        });
      });
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
        area:['700px','500px'],
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
    //主列表排序
    mainOrderChange(type,val){
      this.orderObj.sort=type;
      this.orderObj.order=val?'desc':'asc';
      this.GetListData();
    },
    //子列表排序
    subOrderChange(type,val,d){
      d.orderObj.sort=type;
      d.orderObj.order=val?'desc':'asc';

      d.childData=d.childData.sort((a,b)=>{
        return  d.orderObj.order=='desc'?b.last_time-a.last_time:a.last_time-b.last_time;
      });
    },
    //切换关注
    toggleAttent(d){
      ser[!d._focus?'AddNorelNameFocus':'DelNoRealNameFocus'](`${d.cert.certificate_type}_${d.cert.certificate_code}`).then(res=>{
        if(!_t.msg(res,'操作成功!')) return;

        d._focus=!d._focus;
        _.each(_.filter(this.data,c=>{
          return c.cert.certificate_type == d.cert.certificate_type &&
                 c.cert.certificate_code == d.cert.certificate_code
        }),c=>{
          c._focus=d._focus;
        })

      });
      
    },
    pageChange(i){
      this.page.index=i;
      this.GetListData();
    },
    //场所范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,和区域范围选择类似
    selectSite(val,data){
        if(data){           
            this.query.netsite_range=data.sites;
        }else{
            this.query.netsite_range="";
        }
    },
    //多选改变事件
    selChange(sels){this.selIds=sels;},
    exportData(){
        return this.$store.dispatch(Export,{
            type:NoRealNameListExport,
            pageCount:this.page.count,
            data:{
                sidx:this.orderObj.sort,
                order:this.orderObj.order,
                query:{
                    ids:this.selIds.join(','),
                    locus_ids:_.map(this.cloneQuery.netsite_range,n=>n.code).join(','),
                    begin:this.cloneQuery.time_range?_t.Timestamp(this.cloneQuery.time_range[0]):0,
                    end:this.cloneQuery.time_range?_t.DateTimestampByEndTime(this.cloneQuery.time_range[1]):0,
                    key:this.cloneQuery.identity
                }
            }
        })
    },
  }
}
</script>

<style lang="less" scoped>
.NoRealName{width:100%;height:100%;box-sizing:border-box;text-align:left;}

</style>