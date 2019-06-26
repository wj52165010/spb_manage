<!-- 场所列表页面插件 -->
<template>
    <div class="DeviceList">
        <ListAutoLayout>
            <!--搜索框-->
            <template slot="header">
                <ListHeader>
                    <ListSearchItem label="设备名称:">
                       <el-input placeholder="请输入" v-model="query.name" ></el-input>
                    </ListSearchItem>

                    <ListSearchItem label="设备编码:">
                       <el-input placeholder="请输入" v-model="query.code" ></el-input>
                    </ListSearchItem>

                    <ListSearchItem label="场所范围:">
                        <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectSite" ref="PlaceSel" />
                    </ListSearchItem>

                    <ListSearchItem label="区域范围:">
                        <PlaceSearch  :blnClear="false" c_searchKind="0" @place_res="selectArea" ref="RegionSel" />
                    </ListSearchItem>

                    <ListSearchItem label="设备类型:">
                        <EquipmentKindSel v-model="query.deviece_type"  />
                    </ListSearchItem>

                    <ListSearchItem label="设备状态:">
                        <PlaceStatusSel v-model="query.netsite_state"  />
                    </ListSearchItem>

                    <ListSearchItem label="厂商范围:">
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
            <CheckList ref="listCheck" :data="data" :blnSel="blnSel" id="equipmentId" @change="selChange" :blnLoading="loading">
                <template slot="header">
                    <v-table-column :width="250"><ListSortBtn name="设备编码" field="equipment_id"  @change="orderChange" :order="true" /></v-table-column>
                    <v-table-column :width="200"><ListSortBtn name="设备名称" field="equipment_name"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="150">设备MAC</v-table-column>
                    <v-table-column :width="100">设备状态</v-table-column>
                    <v-table-column :width="150"><ListSortBtn name="最近联系时间" field="capture_time"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="100">昨日采集</v-table-column>
                    <v-table-column :width="100">设备类型</v-table-column>
                    <v-table-column><ListSortBtn name="所属场所" field="netbar_wacode"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="100"><ListSortBtn name="所属区域" field="region_name"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="100">数据来源</v-table-column>
                    <v-table-column :width="100">所属厂商</v-table-column>
                </template>
                <template slot="body" slot-scope="{d}">
                    <v-table-column :title="d.equipmentId"><span class="clickItem" @click="DeviceDetail(d)">{{d.equipmentId}}</span></v-table-column>
                    <v-table-column :title="d.equipmentName">{{d.equipmentName}}</v-table-column>
                    <v-table-column >{{d.mac}}</v-table-column>
                    <v-table-column :title="d.onlineStateTip">{{d.onlineStateNote}}</v-table-column>
                    <v-table-column >{{d.captureTimeNote}}</v-table-column>
                    <v-table-column ><span class="clickItem" @click="DataColloct(d)">{{d.yesterdayUploadNum || 0}}</span></v-table-column>
                    <v-table-column >{{d.equipmentTypeNote}}</v-table-column>
                    <v-table-column ><span class="clickItem" @click="SiteDetail(d.netbarWacode,d.microprobeTypeNode)">{{d.netbarName}}</span></v-table-column>
                    <v-table-column >{{d.regionName}}</v-table-column>
                    <v-table-column >{{d.microprobeTypeNode}}</v-table-column>
                    <v-table-column >{{d.securitySoftwareOrgname}}</v-table-column>
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
import FrimSel from '../../components/FrimSel'
import DataSourceSel from '../../components/DataSourceSel'
import EquipmentKindSel from '../../components/EquipmentKindSel'

import ExportBtn from '@/components/btns/ExportBtn'
import SearchBtn from '@/components/btns/SearchBtn'
import SelBtn from '@/components/btns/SelBtn'

import SiteDetail from '@/modules/SiteManage/List/SiteDetail'
import DeviceDetail from './DeviceDetail'
import DataColloct from './DataColloct/index'

import {Export,DeviceListExport} from '@/store/Export/types.js'

export default {
  name: 'DeviceList',
  components:{ListAutoLayout,Paging,ListHeader,ListSearchItem,PlaceSearch,
              PlaceStatusSel,FrimSel,DataSourceSel,
              ExportBtn,SearchBtn,SelBtn,ListSortBtn,CheckList,EquipmentKindSel},
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
        name:'',
        code:'',
        netsite_range:[],
        region_range:[],
        microprobe_type:'',
        siteIndfirms:'',
        netsite_state:'',
        deviece_type:'',
      },
      cloneQuery:{
        name:'',
        code:'',
        netsite_range:[],
        region_range:[],
        microprobe_type:'',
        siteIndfirms:'',
        netsite_state:'',
        deviece_type:'',
      },
      orderObj:{sort:'equipment_id',order:'desc'},//排序字段
    }
  },
  mounted(){
    this.search();
  },
  methods:{
    refresh(){
        this.query={
            name:'',
            code:'',
            netsite_range:[],
            region_range:[],
            microprobe_type:'',
            siteIndfirms:'',
            netsite_state:'',
            deviece_type:'',
        };
        this.selIds=[];
        this.page={
            index:0,    
            size:0,     
            num:15,     
            count:0,    
        };
        this.blnSel=false;
        this.orderObj={sort:'equipment_id',order:'desc'};

        this.$refs.PlaceSel.clear();
        this.$refs.RegionSel.clear();

        this.search();
    },
    //获取数据列表
    GetList(){
        this.loading=true;
        ser.GetDeviceList({
            page:this.page.index,
            limit:this.page.num,
            sidx:this.orderObj.sort,
            order:this.orderObj.order,
            query:{
                equipment_name:this.query.name,
                equipment_id:this.query.code,
                microprobe_type:this.query.microprobe_type, 
                region_range:this.query.region_range || [], 
                netsite_range:this.query.netsite_range || [], 
                security_software_orgcodes:this.query.siteIndfirms,
                device_state:this.query.netsite_state,
                device_type:this.query.deviece_type
            }
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
            type:DeviceListExport,
            pageCount:this.page.count,
            data:{
                sidx:this.orderObj.sort,
                order:this.orderObj.order,
                query:{
                    ids:this.selIds.join(','),
                    equipment_name:this.cloneQuery.name,
                    equipment_id:this.cloneQuery.code,
                    microprobe_type:this.cloneQuery.microprobe_type, 
                    region_range:this.cloneQuery.region_range || [], 
                    netsite_range:this.cloneQuery.netsite_range || [], 
                    security_software_orgcodes:this.cloneQuery.siteIndfirms,
                    device_state:this.cloneQuery.netsite_state,
                    device_type:this.cloneQuery.deviece_type
                }
            }
        })
    },
    //多选改变事件
    selChange(sels){this.selIds=sels;},
    //设备详细
    DeviceDetail(d){
        this.$open({
            title:'设备详情',
            area:['1000px','540px'],
            components:{DeviceDetail},
            content:'<DeviceDetail :netbar_wacode="netbar_wacode" :equipment_id="equipment_id"  />',
            data:{
              netbar_wacode:d.netbarWacode,
              equipment_id:d.equipmentId  
            },
            methods:{
            
            close(){this.close()}
            }
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
            type:type || '非网吧',
            },
            methods:{
            
                close(){this.close()}
            }
        });
    },
    //昨日采集弹窗
    DataColloct(d){
        this.$open({
            title:`数据采集情况(${d.equipmentName})`,
            area:['800px','440px'],
            components:{DataColloct},
            content:`<DataColloct :code="code" />`,
            data:{
                code:d.equipmentId
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
.DeviceList{width:100%;height:100%;box-sizing:border-box;text-align:left;}
</style>