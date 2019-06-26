<!-- 外挂页面插件 -->
<template>
    <div class="AddIn">
        <ListAutoLayout>
            <!--搜索框-->
            <template slot="header">
                <ListHeader>

                    <ListSearchItem label="场所范围:">
                        <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectSite" ref="PlaceSel" />
                    </ListSearchItem>

                    <ListSearchItem label="所属区域:">
                        <PlaceSearch  :blnClear="true" c_searchKind="0" @place_res="selectArea" ref="RegionSel" />
                    </ListSearchItem>

                    <ListSearchItem label="所属厂商:">
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
            <CheckList ref="listCheck" :data="data" :blnSel="blnSel" id="id" @change="selChange">
                <template slot="header">
                    <v-table-column>最新问题摘要</v-table-column>
                    <v-table-column :width="150"><ListSortBtn name="场所编码" field="netbar_wacode" :order="true"  @change="orderChange" /></v-table-column>
                    <v-table-column ><ListSortBtn name="场所名称" field="netbar_name"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="150"><ListSortBtn name="所属厂商" field="security_software_orgcode"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="100"><ListSortBtn name="所属区域" field="region_code"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="150"><ListSortBtn name="数据来源" field="microprobe_type"  @change="orderChange" /></v-table-column>
                </template>
                <template slot="body" slot-scope="{d}">
                    <v-table-column ><span class="clickItem" @click="IssueDetail(d)">{{d.abnormalDtNote}}</span></v-table-column>
                    <v-table-column ><span class="clickItem" @click="SiteDetail(d.netbarWacode)">{{d.netbarWacode}}</span></v-table-column>
                    <v-table-column >{{d.netbarName}}</v-table-column>
                    <v-table-column >{{d.securitySoftwareOrgcodeNote}}</v-table-column>
                    <v-table-column >{{d.regionCodeNode}}</v-table-column>
                    <v-table-column >{{d.microprobeTypeNode}}</v-table-column>
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
import FrimSel from '../../components/FrimSel'
import DataSourceSel from '../../components/DataSourceSel'

import ExportBtn from '@/components/btns/ExportBtn'
import SearchBtn from '@/components/btns/SearchBtn'
import SelBtn from '@/components/btns/SelBtn'

import SiteDetail from '../List/SiteDetail'
import IssueDetail from './IssueDetail'

import {Export,PluginExport} from '@/store/Export/types.js'

export default {
  name: 'AddIn',
  components:{ListAutoLayout,Paging,ListHeader,ListSearchItem,PlaceSearch,
              FrimSel,DataSourceSel,
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
      },
      cloneQuery:{
        netsite_range:[],
        region_range:[],
        microprobe_type:'',
        siteIndfirms:'',
      },
      orderObj:{sort:'netbar_wacode',order:'desc'},//排序字段
    }
  },
  mounted(){
    this.search();
  },
  methods:{
    refresh(){
        this.query={
            netsite_range:[],
            region_range:[],
            microprobe_type:'',
            siteIndfirms:'',
        };
        this.selIds=[];
        this.page={
            index:0,    
            size:0,     
            num:15,     
            count:0,    
        };
        this.blnSel=false;
        this.orderObj={sort:'create_time',order:'asc'};

        this.$refs.PlaceSel.clear();
        this.$refs.RegionSel.clear();

        this.search();
    },
    //获取列表数据
    GetList(){
        this.loading=true;
        ser.GetPlugList({
            page:this.page.index,
            limit:this.page.num,
            query:{
                microprobe_type:this.query.microprobe_type, 
                region_range:this.query.region_range || [], 
                netsite_range:this.query.netsite_range || [], 
                security_software_orgcodes:this.query.siteIndfirms
            },
        }).then(res=>{
            this.loading=false;
            this.data=res.biz_body.list || [];
            this.page.size=res.biz_body.totalPage;
            this.page.count=res.biz_body.totalCount;
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
    pageChange(){},
    exportData(){
        return this.$store.dispatch(Export,{
            type:PluginExport,
            pageCount:this.page.count,
            data:{
                sidx:this.orderObj.sort,
                order:this.orderObj.order,
                query:{
                    ids:this.selIds.join(','),
                    microprobe_type:this.cloneQuery.microprobe_type, 
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
    //昨日问题摘要
    IssueDetail(d){
        this.$open({
            title:`问题总览详情(${d.netbarName})`,
            area:['1000px','640px'],
            components:{IssueDetail},
            content:'<IssueDetail :d="d" />',
            data:{
                d:d
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
.AddIn{width:100%;height:100%;box-sizing:border-box;text-align:left;}
</style>