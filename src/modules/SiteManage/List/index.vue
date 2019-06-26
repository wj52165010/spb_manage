<!-- 场所列表页面插件 -->
<template>
    <div class="SiteList">
        <ListAutoLayout>
            <!--搜索框-->
            <template slot="header">
                <ListHeader>
                    <ListSearchItem label="场所范围:">
                        <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectSite" ref="PlaceSel" />
                    </ListSearchItem>

                    <ListSearchItem label="区域范围:">
                        <PlaceSearch  :blnClear="false" c_searchKind="0" @place_res="selectArea" ref="RegionSel" />
                    </ListSearchItem>

                    <ListSearchItem label="场所状态:">
                        <PlaceStatusSel v-model="query.netsite_state"  />
                    </ListSearchItem>

                    <ListSearchItem label="营业状态:">
                        <BusinessStatusSel v-model="query.bussi_state" />
                    </ListSearchItem>

                    <ListSearchItem label="厂商名称:">
                        <FrimSel v-model="query.siteIndfirms" />
                    </ListSearchItem>

                    <ListSearchItem label="数据来源:">
                        <DataSourceSel v-model="query.microprobe_type" />
                    </ListSearchItem>

                    <ListSearchItem>
                        <SearchBtn @click="search()" :disable="loading" />
                    </ListSearchItem>
                    
                    <template slot="bar">
                        <SelBtn :blnSel="blnSel" @click="blnSel=!blnSel" />
                    </template>

                </ListHeader>
            </template>

            <!--列表-->
            <CheckList ref="listCheck" :data="showData" :blnSel="blnSel" id="netbarWacode" @change="selChange" :blnLoading="loading">
                <template slot="header">
                    <v-table-column :width="150"><ListSortBtn name="场所编码" field="netbar_wacode" :order="true"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="100"><ListSortBtn name="场所名称" field="netbar_name"  @change="orderChange" /></v-table-column>
                    <v-table-column>场所地址</v-table-column>
                    <v-table-column :width="100">场所状态</v-table-column>
                    <v-table-column :width="100">
                        场所概括
                        <el-tooltip>
                            <div slot="content" style="line-height:20px;text-align:left;">
                                网吧终端概况：<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;申报终端/检测终端/在线终端<br/>挂载设备概况：<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;在线/异常/离线
                            </div>
                            <i class="fa fa-question-circle" style="cursor:pointer"></i>
                        </el-tooltip> 
                    </v-table-column>
                    <v-table-column :width="150"><ListSortBtn name="最近联系时间" field="capture_time"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="100">昨日采集</v-table-column>
                    <v-table-column :width="100">营业状态</v-table-column>
                    <v-table-column :width="100">场所类型</v-table-column>
                    <v-table-column :width="100"><ListSortBtn name="所属区域" field="region_name"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="100">数据来源</v-table-column>
                    <v-table-column :width="100"><ListSortBtn name="所属厂商" field="security_software_orgname"  @change="orderChange" /></v-table-column>
                </template>
                <template slot="body" slot-scope="{d}">
                    <v-table-column ><span class="clickItem" @click="SiteDetail(d.netbarWacode,d.microprobeType)">{{d.netbarWacode}}</span></v-table-column>
                    <v-table-column :title="d.netbarName">{{d.netbarName}}</v-table-column>
                    <v-table-column >{{d.netbarAddress}}</v-table-column>
                    <v-table-column :title="d.onlineStateTip">{{d.onlineState}}</v-table-column>
                    <v-table-column :title="d.summTip"><span class="clickItem" @click="Summarize(d)">{{d.summ}}</span></v-table-column>
                    <v-table-column >{{d.captureTimeNote}}</v-table-column>
                    <v-table-column ><span class="clickItem" @click="DataColloct(d)">{{d.yesterdayUploadNum || 0}}</span></v-table-column>
                    <v-table-column >{{d.businessState}}</v-table-column>
                    <v-table-column :title="d.netsiteType">{{d.netsiteType}}</v-table-column>
                    <v-table-column >{{d.regionName}}</v-table-column>
                    <v-table-column :title="d.microprobeType">{{d.microprobeType}}</v-table-column>
                    <v-table-column :title="d.securitySoftwareOrgname">{{d.securitySoftwareOrgname}}</v-table-column>
                </template>
            </CheckList>

            <!--分页-->
            <template slot="footer">
                <Paging :pageIndex="page.index" :pageSize="page.size" :pageNum="page.num" :pageCount="page.count" @change="pageChange">
                    <template slot="pre">
                        <ExportBtn v-if="blnSel" class="batchItem" :FuncName="exportData" />
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

import PlaceSearch from '@/modules/SiteManage/components/PlaceSearch'
import PlaceStatusSel from '../../components/PlaceStatusSel'
import BusinessStatusSel from '../../components/BusinessStatusSel'
import FrimSel from '../../components/FrimSel'
import DataSourceSel from '../../components/DataSourceSel'

import ExportBtn from '@/components/btns/ExportBtn'
import SearchBtn from '@/components/btns/SearchBtn'
import SelBtn from '@/components/btns/SelBtn'

import SiteDetail from './SiteDetail'
import MontedPlace from './MontedPlace'
import MontedDevice from './MontedDevice'
import DataColloct from './DataColloct/index'

import {Export,SiteListExport} from '@/store/Export/types.js'

export default {
  name: 'SiteList',
  components:{ListAutoLayout,Paging,ListHeader,ListSearchItem,PlaceSearch,
              PlaceStatusSel,BusinessStatusSel,FrimSel,DataSourceSel,
              ExportBtn,SearchBtn,SelBtn,ListSortBtn,CheckList},
  data(){
    return {
      blnSel:false,
      loading:false,
      page:{
        index:0,    //当前页号
        size:0,     //页数
        num:15,     //每页显示条数
        count:0,    //列表总数    
      },
      selIds:[],
      data:[],
      query:{
        netsite_range:[],
        region_range:[],
        microprobe_type:'',
        siteIndfirms:'',
        netsite_state:'',
        bussi_state:'',
      },
      cloneQuery:{
        netsite_range:[],
        region_range:[],
        microprobe_type:'',
        siteIndfirms:'',
        netsite_state:'',
        bussi_state:'',
      },
      orderObj:{sort:'netbar_wacode',order:'desc'},//排序字段
    }
  },
  computed:{
    showData(){

        return _.map(this.data,d=>{
            if(d.microprobeType=='网吧'){
                d.summ=`${d.terminalCount.netTerminalNum || 0}/${d.terminalCount.termiTotal || 0}/${d.terminalCount.internetUsers || 0}`
                d.summTip=`申报终端：${d.terminalCount.netTerminalNum || 0}台/检测终端：${d.terminalCount.termiTotal || 0}台/在线终端：${d.terminalCount.internetUsers || 0}台`
            }else{
                d.summ=`${d.equipments[0].num || 0}/${d.equipments[2].num || 0}/${d.equipments[1].num}`
                d.summTip=`在线：${d.equipments[0].num || 0}/异常：${d.equipments[2].num || 0}/离线：${d.equipments[1].num}`
            }
            return d;
        });
    }
  },
  mounted(){
    this.GetList();
  },
  methods:{
    refresh(){
        this.query={
            netsite_range:[],
            region_range:[],
            microprobe_type:'',
            siteIndfirms:'',
            netsite_state:'',
            bussi_state:'',
        };
        this.selIds=[];
        this.page.index=0;
        this.blnSel=false;
        this.orderObj={sort:'netbar_wacode',order:'desc'};

        this.$refs.PlaceSel.clear();
        this.$refs.RegionSel.clear();

        this.search();
    },
    //获取场所列表数据
    GetList(){
        this.loading=true;
        ser.GetSiteList({
            page:this.page.index,
            limit:this.page.num,
            sidx:this.orderObj.sort,
            order:this.orderObj.order,
            query:{
                business_state:this.query.bussi_state, 
                microprobe_type:this.query.microprobe_type, 
                netsite_state:this.query.netsite_state,
                region_range:this.query.region_range || [], 
                netsite_range:this.query.netsite_range || [], 
                security_software_orgcodes:this.query.siteIndfirms
            },
        }).then(res=>{
            this.loading=false;
            this.page.size=res.biz_body.totalPage
            this.page.count=res.biz_body.totalCount;
            this.data=res.biz_body.list;
        });
    },
    search(){
        this.page.index=0;
        this.cloneQuery=_t.Clone(this.query);
        this.$refs.listCheck.clear();
        this.GetList();
    },
    orderChange(type,val){
        this.orderObj.sort=type;
        this.orderObj.order=val?'desc':'asc';
        this.GetList();
    },
    selectSite(val,data){
        if(data){           
            this.query.netsite_range=data.sites;
        }else{
            this.query.netsite_range="";
        }
    },
    selectArea(val,data){
        if(data){
            this.query.region_range=data.regions;
        }else{
            this.query.region_range="";
        }
    },
    pageChange(i){
        this.page.index=i;
        this.GetList();
    },
    exportData(){
        return this.$store.dispatch(Export,{
            type:SiteListExport,
            pageCount:this.page.count,
            data:{
                sidx:this.orderObj.sort,
                order:this.orderObj.order,
                query:{
                    ids:this.selIds.join(','),
                    business_state:this.cloneQuery.bussi_state, 
                    microprobe_type:this.cloneQuery.microprobe_type, 
                    netsite_state:this.cloneQuery.netsite_state,
                    region_range:this.cloneQuery.region_range || [], 
                    netsite_range:this.cloneQuery.netsite_range || [], 
                    security_software_orgcodes:this.cloneQuery.siteIndfirms
                }
            }
        })
    },
    //多选改变事件
    selChange(sels){this.selIds=sels;},
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
    //场所概括弹窗
    Summarize(d){
        this.$open({
            title:`${d.microprobeType=='网吧'?'终端列表':'挂载设备详情'}(${d.netbarName})`,
            area:['1200px','640px'],
            components:{MontedPlace,MontedDevice},
            content:`<${d.microprobeType=='网吧'?'MontedPlace':'MontedDevice'} :code="code" />`,
            data:{
                code:d.netbarWacode
            },
            methods:{
            
            close(){this.close()}
            }
        });
    },
    //昨日采集弹窗
    DataColloct(d){
        this.$open({
            title:`数据采集情况(${d.netbarName})`,
            area:['800px','440px'],
            components:{DataColloct},
            content:`<DataColloct :code="code" />`,
            data:{
                code:d.netbarWacode
            },
            methods:{
                close(){this.close()}
            }
        });
    }
  }
}
</script>

<style lang="less" scoped>
.SiteList{width:100%;height:100%;box-sizing:border-box;text-align:left;}
</style>