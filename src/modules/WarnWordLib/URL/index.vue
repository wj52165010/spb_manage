<!-- URL页面插件 -->
<template>
    <div class="URL">
        <ListAutoLayout ref="layout">

            <!--搜索框-->
            <template slot="header">
            
                <ListHeader>  
                    
                    <ListSearchItem label="词类:">
                        <WordKindSel v-model="query.wordKind" />
                    </ListSearchItem>

                    <ListSearchItem label="URL:">
                        <el-input placeholder="请输入内容" v-model="query.URL" style="width:200px;">
                            <template slot="prepend"><i class="fa fa-search" /></template>
                        </el-input>
                    </ListSearchItem>
                    
                    <ListSearchItem label="入库时间:">
                        <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                    </ListSearchItem>

                    <ListSearchItem label="状态:">
                        <el-select v-model="query.status" placeholder="请选择" :clearable="true" style="width:100px;">
                            <el-option
                                v-for="kind in status"
                                :key="kind.val"
                                :label="kind.name"
                                :value="kind.val">
                            </el-option>
                        </el-select>
                    </ListSearchItem>

                    <ListSearchItem>
                        <SearchBtn  @click="search()"/>
                    </ListSearchItem>

                    <template slot="bar">
                        <AddBtn @click="AddKeyURL()" />
                        <SelBtn :blnSel="blnSel" @click="blnSel=!blnSel" />
                    </template>
                </ListHeader>

            </template>

            <!--列表项-->
            <CheckList ref="listCheck" :data="data" :blnSel="blnSel" id="id" @change="selChange" :blnLoading="loading">
                <template slot="header">
                    <v-table-column :width="100">词类</v-table-column>
                    <v-table-column>URL</v-table-column>
                    <v-table-column :width="100">状态</v-table-column>
                    <v-table-column :width="150"><ListSortBtn name="入库时间" field="log_time" :order="true"  @change="orderChange" /></v-table-column>
                    <v-table-column :width="100">添加人</v-table-column>
                    <v-table-column :width="100">操作</v-table-column>
                </template>
                <template slot="body" slot-scope="{d}">
                    <v-table-column >{{d.wordTypeString}}</v-table-column>
                    <v-table-column >{{d.urlPrefix}}</v-table-column>
                    <v-table-column >{{d.status}}</v-table-column>
                    <v-table-column >{{d.logTime}}</v-table-column>
                    <v-table-column >{{d.userId}}</v-table-column>
                    <v-table-column>
                        <div class="option_bar">
                            <el-tooltip :content="d.status=='禁用'?'启用':'禁用'" placement="top">
                                 <i class="fa fa-cog fa-fw hoverSubBgColtwo" :class="{
                                    'fa-cog fa-fw':d.status=='启用',
                                    'fa fa-ban':d.status=='禁用',
                                }" style="cursor:pointer;" @click="openStatus(d,d.id,d.status=='禁用')" />
                            </el-tooltip> 
                            <el-tooltip content="编辑" placement="top">
                                <i class="fa fa-pencil hoverSubBgColtwo" @click="editor(d)" style="cursor:pointer;" />
                            </el-tooltip>
                        </div>
                    </v-table-column>
                </template>
            </CheckList>
            
            <!--分页-->
            <template slot="footer">
                <Paging :pageIndex="page.index" :pageSize="page.size" :pageNum="page.num" :pageCount="page.count" @change="pageChange">
                <template slot="pre">
                    <ExportBtn v-if="blnSel" class="batchItem" :FuncName="exportData" />

                    <span v-if="blnSel" class="batchItem hoverSubBgColtwo" @click="batchHandle(1)">
                        <i class="fa fa-check-square" style="margin-right:5px;" />启用
                    </span>

                    <span v-if="blnSel" class="batchItem hoverSubBgColtwo" @click="batchHandle(2)">
                        <i class="fa fa-window-close" style="margin-right:5px;" />禁用
                    </span>

                    <span v-if="blnSel" class="batchItem hoverSubBgColtwo" @click="batchHandle(3)">
                        <i class="fa fa-remove" style="margin-right:5px;" />删除
                    </span>
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
import SearchBtn from '@/components/btns/SearchBtn'
import SelBtn from '@/components/btns/SelBtn'
import AddBtn from '@/components/btns/AddBtn'

import AddURL from './components/AddURL'
import UpdateURL from './components/UpdateURL'
import WordKindSel from '../components/WordKindSel'

import {Export,UrlListExport} from '@/store/Export/types.js'

export default {
  name: 'URL',
  components:{ListAutoLayout,Paging,ListSortBtn,CheckList,
              ListHeader,ListSearchItem,ExportBtn,
              SelBtn,SearchBtn,AddBtn,WordKindSel},
  data(){
    return {
        simpleTime:{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        loading:false,
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
        wordKinds:[],   //词类集合
        status:[{name:'启用',val:1},{name:'停用',val:0}], //状态
        blnSel:false,
        orderObj:{sort:'log_time',order:'desc'},//排序字段
        selIds:[],
        query:{
            wordKind:'',
            URL:'',
            status:'',
            time_range:null,
        },
        cloneQuery:{
            wordKind:'',
            URL:'',
            status:'',
            time_range:null,
        },
    }
  },
  mounted(){
    this.search();
  },
  methods:{
    refresh(){
        this.page.index=0;
        this.query={
            wordKind:'',
            URL:'',
            status:'',
            time_range:null,
        }

        this.search();
    },
    GetList(){
        this.loading=true;
        ser.GetWarnWordUrlList({
            page:this.page.index,
            limit:this.page.num,
            sidx:this.orderObj.sort,
            order:this.orderObj.order,
            query:{
                word_type:this.query.wordKind, 
                url_prefix:this.query.URL,
                start_time:this.query.time_range?_t.Timestamp(this.query.time_range[0]):'',
                end_time:this.query.time_range?_t.DateTimestampByEndTime(this.query.time_range[1]):'',
                status:this.query.status
            }
        }).then(res=>{
            this.loading=false;
            this.data=res.biz_body.list;
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
    pageChange(i){this.page.index=i;this.GetList();},
    orderChange(type,val){
        this.orderObj.sort=type;
        this.orderObj.order=val?'desc':'asc';
        this.GetList();
    },
    //多选改变事件
    selChange(sels){this.selIds=sels;},
    exportData(){
        return this.$store.dispatch(Export,{
            type:UrlListExport,
            pageCount:this.page.count,
            data:{
                sidx:this.orderObj.sort,
                order:this.orderObj.order,
                query:{
                    ids:this.selIds.join(','),
                    word_type:this.cloneQuery.wordKind, 
                    url_prefix:this.cloneQuery.URL,
                    start_time:this.cloneQuery.time_range?_t.Timestamp(this.cloneQuery.time_range[0]):'',
                    end_time:this.cloneQuery.time_range?_t.DateTimestampByEndTime(this.cloneQuery.time_range[1]):'',
                    status:this.cloneQuery.status
                }
            }
        })
    },
    //批量操作处理函数
    batchHandle(type){
        if(this.selIds.length<=0){_t.tipFailure('请选择需要操作的项!'); return;}

        switch(type){
            case 1: //'启用'
                ser.BarhWarnWordUrlStatus(_.map(this.selIds,(id)=>{
                    return {
                        id:id,
                        status:1,
                    };
                })).then(res=>{
                    if(!_t.msg(res,'操作成功!')) return;
                    _.each(this.data,d=>{
                        if(this.selIds.indexOf(d.id)>=0){d.status='启用';}
                    })
                })
                break;
            case 2://'停用'
                ser.BarhWarnWordUrlStatus(_.map(this.selIds,(id)=>{
                    return {
                        id:id,
                        status:0,
                    };
                })).then(res=>{
                    if(!_t.msg(res,'操作成功!')) return;
                    _.each(this.data,d=>{
                        if(this.selIds.indexOf(d.id)>=0){d.status='禁用';}
                    })
                })
                break;
            case 3://'删除'
                 _t.confirm('您确认要删除所选的URL吗？',['确定','取消'],()=>{
                     ser.BatchWarnWordUrlRemove(this.selIds).then(res=>{
                        if(!_t.msg(res,'操作成功!')) return;
                        this.selIds=[];
                        this.page.index=0;
                        this.GetList();
                    });
                   
                },function(){});
                break;
        }
    },
    AddKeyURL(){
        this.$open({
          title:'添加URL',
          area:['500px','500px'],
          components:{AddURL},
          content:'<AddURL @cancel="close" @renew="renew()" @complete="uploadComplete" />',
          data:{
           
          },
          methods:{
            renew(){
                this.$caller.page.index=0;
                this.$caller.GetList();
                this.close();
            },
            close(){this.close()},
            uploadComplete(){
                this.$caller.page.index=0;
                this.$caller.GetList();
            }
          }
        })
    },
    editor(d){
        this.$open({
          title:'编辑URL',
          area:['500px','340px'],
          components:{UpdateURL},
          content:` <div style="box-sizing:border-box;padding:10px;">
                        <UpdateURL :data="d" @cancel="close" @update="update" />
                    </div>`,
          data:{
           d:d
          },
          methods:{
            update(res){
                Object.assign(d,res);
                this.close();
            },
            close(){this.close()}
          }
        })
    },
    //切换关键词状态
    openStatus(d,id,blnOpen){
        ser.BarhWarnWordUrlStatus([
            {
                id:id,
                status:blnOpen?1:0,
            }
        ]).then(res=>{
            if(!_t.msg(res,'操作成功!')) return;
            d.status=blnOpen?'启用':'禁用';
        })
    }
  }
}
</script>

<style lang="less" scoped>
.URL{width:100%;height:100%;box-sizing:border-box;text-align:left;}
.URL .option_bar i{margin-right:10px;}

.URL .batchItem{margin-right:5px;cursor:pointer;}
</style>