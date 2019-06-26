<!-- 头部页面插件 -->
<template>
    <div class="EW_Analysis_List">
        <ListAutoLayout ref="ListAutoLayout">

            <!--搜索框-->
            <template slot="header">
                <ListHeader>

                  <ListSearchItem label="预警时间:">
                    <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                  </ListSearchItem>

                  <ListSearchItem label="预警类型:">
                    <PreWarnTypeSel v-model="query.kind" />
                  </ListSearchItem>

                  <ListSearchItem label="身份信息:">
                    <el-input placeholder="请输入" v-model="query.identity" ></el-input>
                  </ListSearchItem>

                  <ListSearchItem label="场所范围:">
                   <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectSite" />
                  </ListSearchItem>

                  <ListSearchItem>
                    <SearchBtn  @click="search()" />
                  </ListSearchItem>

                  <template slot="bar">
                    <SelBtn :blnSel="blnSel" @click="blnSel=!blnSel" />
                  </template>

                </ListHeader>
            </template>

            <!--列表项-->
            <CheckList ref="listCheck" :data="data" :blnSel="blnSel" id="dataId" @change="selChange" :blnLoading="loading">
                <template slot="header">
                    <v-table-column :width="150">
                        <ListSortBtn name="预警时间" field="alarm_time" :order="true" @change="orderChange" />
                    </v-table-column>
                    <v-table-column :width="120">预警类型 </v-table-column>
                    <v-table-column :width="120">认证类型</v-table-column>
                    <v-table-column :width="120">认证姓名</v-table-column>
                    <v-table-column :width="150">认证号码</v-table-column>
                    <v-table-column>预警原因</v-table-column>
                    <v-table-column :width="150">场所编码</v-table-column>
                    <v-table-column :width="200">场所名称</v-table-column>
                    <v-table-column :width="80">操作</v-table-column>
                </template>
                <template slot="body" slot-scope="{d}">
                    <v-table-column >{{d.alarmTime}}</v-table-column>
                    <v-table-column >{{d.alarm_type_str}}</v-table-column>
                    <v-table-column >{{d.authType}}</v-table-column>
                    <v-table-column >{{d.focusName}}</v-table-column>
                    <v-table-column >{{d.authAccount}}</v-table-column>
                    <v-table-column ><span class="clickItem" @click.stop="WarnReason(d);d.readStatus=1;">{{d.alarmReson}}</span><span v-if="d.readStatus==0" class="newLabel">NEW</span></v-table-column>
                    <v-table-column ><span class="clickItem" @click.stop="SiteDetail(d.netbarWacode,d.microprobe_type);">{{d.netbarWacode}}</span></v-table-column>
                    <v-table-column >{{d.netbarName}}</v-table-column>
                    <v-table-column >
                        <el-tooltip content="查看此人报警" placement="top">
                            <span class="clickItem" @click.stop="query.identity=d.authAccount;GetList();">
                                <i class="fa fa-eye hoverSubBgColtwo" style="font-size:14px;margin-right:10px;" />
                            </span>
                        </el-tooltip>
                        <el-tooltip content="轨迹" placement="top" v-if="d.alarmType=='alarm_entrance' || d.alarmType=='alarm_leave'">
                            <span class="clickItem" @click.stop="TrackDetail(d.contentSessionId,d.alarmTime)">
                                <i class="fa fa-map-marker hoverSubBgColtwo" style="font-size:14px;" />
                            </span>
                        </el-tooltip>
                    </v-table-column>
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
import PlaceSearch from '@/modules/SiteManage/components/PlaceSearch'

import ExperReason from '@/modules/EW_analysis/List/components/warnReason/ExperReason/ExperReason'
import GatherReason from '@/modules/EW_analysis/List/components/warnReason/GatherReason'

import SiteDetail from '@/modules/SiteManage/List/SiteDetail'
import TrackMap from './components/TrackMap'
import PreWarnTypeSel from '@/modules/components/PreWarnTypeSel'

import {Export,EWAnalysisListExport} from '@/store/Export/types.js'

export default {
  name: 'EW_Analysis_List',
  props:['idCode'],
  components:{ListAutoLayout,Paging,ListSortBtn,
              ListHeader,ListSearchItem,CheckList,
              ExportBtn,SelBtn,SearchBtn,PlaceSearch,
              PreWarnTypeSel
             },
  data(){
    return {
        simpleTime:{
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
        },
        loading:false,
        blnSel:false,
        data:[],
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        },
        timeOrder:true,
        kindOrder:false,
        orderObj:{sort:'alarm_time',order:'desc'},//排序字段
        query:{
          time_range:null,
          identity:'',
          kind:[],
          netsite_range:[]
        },
        cloneQuery:{
          time_range:null,
          identity:'',
          kind:[],
          netsite_range:[]
        }
    }
  },
  mounted(){
    this.query.identity=this.idCode || '';
    this.search();
  },
  methods:{
    refresh(){
        this.query={
            time_range:null,
            identity:'',
            kind:[],
            netsite_range:[]
        };

        this.search();
    },
    GetList(){
        this.loading=true;
        ser.GetPreWarnList({
            page:this.page.index,
            limit:this.page.num,
            sidx:this.orderObj.sort,
            order:this.orderObj.order,
            query:{
                start_time:this.query.time_range?_t.Timestamp(this.query.time_range[0]):'',
                end_time:this.query.time_range?_t.DateTimestampByEndTime(this.query.time_range[1]):'',
                alarm_type:this.query.kind[0] || '',
                word_type:this.query.kind[1] || '',
                netbar_wacode:_.map(this.query.netsite_range,n=>n.code).join(','),
                key:this.query.identity
            }
        }).then(res=>{
            this.loading=false;
            this.data=res.biz_body.list;
            this.page.size=res.biz_body.totalPage;
            this.page.count=res.biz_body.totalCount;
        })
    },
    search(){
      this.page.index=0;
      this.cloneQuery=_t.Clone(this.query);
      this.$refs.listCheck.clear();
      this.GetList();
    },
    pageChange(i){this.page.index=i;this.GetList()},
    orderChange(type,val){
      this.orderObj.sort=type;
      this.orderObj.order=val?'desc':'asc';
      this.GetList();
    },
    //场所范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,和区域范围选择类似
    selectSite(val,data){
        if(data){           
            this.query.netsite_range=data.sites;
        }else{
            this.query.netsite_range="";
        }
    },
    //预警原因
    WarnReason(d){
        let arr=['新来轨迹详细','离开轨迹详细','聚集详细','异常详细'];
        let type={
            'alarm_entrance':0,
            'alarm_leave':1,
            'alarm_gather':2,
            'alarm_abn':3,
        };
        let comp=['TrackMap','TrackMap','GatherReason','ExperReason']; 

        this.$open({
          title:arr[type[d.alarmType]],
          area:['1000px','640px'],
          components:{TrackMap,GatherReason,ExperReason},
          content:`<${comp[type[d.alarmType]]} :blnhiddenList="true" :key_identity_id="id" :id="id" :d="d" @cancel="cancel" />`,
          data:{
            id:d.contentSessionId,
            d:d,
          },
          methods:{
            cancel(){this.close()}
          }
        })
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
    //轨迹详情
    TrackDetail(id,date){
        this.$open({
            title:'轨迹详情',
            area:['1000px','640px'],
            components:{TrackMap},
            content:'<TrackMap :key_identity_id="id" :startDate="date" :blnhiddenList="true" />',
            data:{
              id:id || 0,
              date:date
            },
            methods:{
                
            }
        });
    },
    //多选改变事件
    selChange(sels){this.selIds=sels;},
    exportData(){
        return this.$store.dispatch(Export,{
            type:EWAnalysisListExport,
            pageCount:this.page.count,
            data:{
                sidx:this.orderObj.sort,
                order:this.orderObj.order,
                query:{
                  ids:this.selIds.join(','),
                  start_time:this.cloneQuery.time_range?_t.Timestamp(this.cloneQuery.time_range[0]):'',
                  end_time:this.cloneQuery.time_range?_t.DateTimestampByEndTime(this.cloneQuery.time_range[1]):'',
                  alarm_type:this.cloneQuery.kind[0] || '',
                  word_type:this.cloneQuery.kind[1] || '',
                  netbar_wacode:_.map(this.cloneQuery.netsite_range,n=>n.code).join(','),
                  key:this.cloneQuery.identity
                }
            }
        })
    },
  }
}
</script>

<style lang="less" scoped>
.EW_Analysis_List{width:100%;height:100%;box-sizing:border-box;text-align:left;}

.EW_Analysis_List .newLabel{
  background: red;
  padding: 2px 10px;
  border-radius: 5px;
  color: white;
  text-decoration:none;
  margin-left:10px;
}
</style>