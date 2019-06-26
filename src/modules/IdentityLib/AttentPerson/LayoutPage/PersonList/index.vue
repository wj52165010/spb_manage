<!-- 关注人员列表页面插件 -->
<template>
    <div class="PersonList">
        <ListAutoLayout>
            <template slot="header">
                <ListHeader :style="{'padding-bottom':'10px','border-bottom':'1px solid'}" class="subBgColtwoBorder">
                    <ListSearchItem>
                        <el-input placeholder="请输入人员信息" v-model="query.userInfo" style="width:200px;">
                            <template slot="prepend"><i class="fa fa-search" /></template>
                        </el-input>
                    </ListSearchItem>
                    <ListSearchItem>
                        <el-dropdown  @command="orderChange" size="medium" style="margin-top:2px;" split-button type="default">
                            {{orders[query.curOrder]}}
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="i+''" v-for="(o,i) in orders" :key="i">{{o}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </ListSearchItem>

                    <template slot="bar">
                        <GatherBtn @click="GatherSet()" />
                        <AddBtn @click="AddPerson()" />
                        <SelBtn @click="blnBatch=!blnBatch" :class="{subColtwo:blnBatch}" />
                    </template>

                </ListHeader>
            </template>

            <Scroll :listen="data">
                <div style="padding:10px;">
                    <PersonCard v-for="(d,i) in data" :key="i" @click="cardClick(d)" :d="d" :disabeldClick="blnBatch" :blnSel="blnSelItem(d)" @refshPage="GetFocusPeople"  />
                    <div class="clearfix"></div>
                </div>
            </Scroll>

            <template slot="footer">
                <Paging 
                :pageIndex="page.index" 
                :pageSize="page.size" 
                :pageNum="page.num" 
                :pageCount="page.count" 
                @change="pageChange" 
                :style="{'border-top':'1px solid'}" 
                class="subBgColtwoBorder">
                    <template slot="pre">
                        <span class="option_bar" v-if="blnBatch">
                            <span class="optionBtn hoverSubBgColtwo" @click="batchHandle(0)"><i class="fa fa-share" />新来预警</span>
                            <span class="optionBtn hoverSubBgColtwo" @click="batchHandle(1)"><i class="fa fa-reply" />离去预警</span>
                            <span class="optionBtn hoverSubBgColtwo" @click="batchHandle(2)"><i class="fa fa-share-alt" />设置标签</span>
                            <span class="optionBtn hoverSubBgColtwo" @click="batchHandle(3)"><i class="fa fa-remove" />删除</span>
                        </span>
                    </template>
                </Paging>
            </template>
        </ListAutoLayout>

        <!--隐藏选择出现/离开区域报警选择-->
        <!--<div style="display:none;">
            <PlaceSearch ref="AlarmPlaceSel" :defautVal="curRegionDefault"  :blnNoSaveDelVal="true" c_searchKind='0'  @place_res="alarm_region_change"></PlaceSearch>
        </div>-->

        <Loading v-if="loading" />
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import Paging from '@/components/Paging'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'
import Scroll from '@/components/Scroll'

import SelBtn from '@/components/btns/SelBtn'
import AddBtn from '@/components/btns/AddBtn'
import GatherBtn from '@/components/btns/GatherBtn'

import PersonCard from './components/PersonCard'
import PersonAdd from './components/PersonAdd'
import GatherSet from './components/GatherSet'
import WarnSet from './components/WarnSet'

import BatchSetLabel from './components/BatchSetLabel'
import Loading from '@/components/Loading'

export default {
  name: 'PersonList',
  props:['tagId','blnNotDefine'],
  components:{ListAutoLayout,ListSearchItem,ListHeader,
              Paging,SelBtn,AddBtn,GatherBtn,Scroll,PersonCard,Loading},
  data(){
    return {
       loading:false,
       query:{
           userInfo:'',
           curOrder:2,
       },
       orders:['默认排序','按报警数降序','按报警时间降序'],
       ordersVal:['focus_title','alarms','alarm_last_time'],
       page:{
          index:0,    //当前页号
          size:0,     //页数
          num:20,     //每页显示条数
          count:0,    //列表总数    
       },
       alarmType:0,
       data:[],
       blnBatch:false, //是否为批量操作
       selItems:[],
       curTagId:'',
       throttleInput:null,
    }
  },
  watch:{
    blnBatch(){
        this.selItems=[];
    },
    tagId(){
        this.page.index=0;
        this.GetFocusPeople();
    },
    blnNotDefine(){
        this.page.index=0;
        this.GetFocusPeople();
    },
    query:{
        deep:true,
        handler:function(){
            this.$nextTick(()=>{
                this.page.index=0;
                this.throttleInput();
            });
        }
    }
  },
  computed:{
    curRegionDefault(){
        if(!this.curUpdateData || this.blnbatch) return '';
        let focus_region_ids=this.alarmType == 1 ? this.curUpdateData.focus_locus_ids : this.curUpdateData.focus_leave_locus_ids;

         _.each(focus_region_ids,f=>{f.type='1'});
        return JSON.stringify(focus_region_ids);
    }
  },
  mounted(){
    this.GetFocusPeople();
    this.throttleInput=_.debounce(this.GetFocusPeople, 300);
  },
  methods:{
    refresh(){
       this.query={
           userInfo:'',
           curOrder:2,
       };
    },
    //获取关注人员列表
    GetFocusPeople(){
        this.loading=true;
        ser.GetFocusPeople({
            page:this.page.index,
            limit:this.page.num,
            sidx:this.ordersVal[this.query.curOrder],
            order:'desc',
            query:{
                tag_id:this.tagId,
                key:this.query.userInfo,
                not_define:this.blnNotDefine
            }
        }).then(res=>{
            this.loading=false;
            this.page.count=res.biz_body.totalCount;
            this.page.size=res.biz_body.totalPage;
            this.data=_.map(res.biz_body.list,l=>{
                l.focusTags=_.filter(JSON.parse(l.focusTags || '[]'),f=>f.note);
                l.focusProperty=l.focusProperty && JSON.parse(l.focusProperty);
                l.realPhotoName='';
                return l;
            });
        })
    },
    //排序改变事件
    orderChange(val){
        this.query.curOrder=val;
    },
    pageChange(i){
        this.page.index=i;
        this.GetFocusPeople();
    },
    //添加关注人员
    AddPerson(){
        this.$open({
          title:'添加关注人员',
          area:['600px','550px'],
          components:{PersonAdd},
          content:'<PersonAdd @cancel="close" @add="add" @complete="uploadComplete" />',
          data:{
           
          },
          methods:{
            close(){this.close()},
            add(){
                this.$caller.GetFocusPeople();
                this.close();
            },
            uploadComplete(){
                this.$caller.page.index=0;
                this.$caller.GetFocusPeople();
            }
          }
        })
    },
    //聚集设置
    GatherSet(){
        this.$open({
          title:'聚集设置',
          area:['800px','450px'],
          components:{GatherSet},
          content:'<GatherSet @cancel="close" />',
          data:{
           
          },
          methods:{
            close(){this.close()}
          }
        })
    },
    //卡片单击事件
    cardClick(d){
        let index=this.selItems.indexOf(d);
        if(index>=0){
            this.selItems.splice(index,1);
        }else{
            this.selItems.push(d);
        }
    },
    blnSelItem(d){
        return this.selItems.indexOf(d)>=0;
    },
    alarm_region_change(obj,val){
        console.log(obj,val);
    },
    //批量操作处理方法(0:新来预警,1:离去预警,2:设置标签,3:删除)
    batchHandle(type){
        if(this.selItems.length<=0){_t.tipFailure('请选择需要操作的关注人员'); return;}
        this.alarmType=type;
        switch(type){
            case 0: //新来预警
                this.$open({
                    title:'新来预警设置',
                    area:['800px','450px'],
                    components:{WarnSet},
                    content:'<WarnSet @cancel="close" :ids="ids" />',
                    data:{
                        ids:_.map(this.selItems,s=>s.focusId)
                    },
                    methods:{
                        close(){this.close()}
                    }
                })
                break;
            case 1: //离去预警
                this.$open({
                    title:'离去预警设置',
                    area:['800px','450px'],
                    components:{WarnSet},
                    content:'<WarnSet @cancel="close" :ids="ids" :leave="true" />',
                    data:{
                        ids:_.map(this.selItems,s=>s.focusId)
                    },
                    methods:{
                        close(){this.close()}
                    }
                })
                break;
            case 2: //设置标签
                this.$open({
                        title:'批量设置标签',
                        area:['400px','300px'],
                        components:{BatchSetLabel},
                        content:'<BatchSetLabel @cancel="close" :ids="ids" />',
                        data:{
                            ids:_.map(this.selItems,s=>s.focusId)
                        },
                        methods:{
                            close(){
                                this.$caller.GetFocusPeople();
                                this.close();
                            }
                        }
                    })
                break;
            case 3: //删除
                _t.confirm('您确定要删除选中的关注人员吗？',['确定','取消'],()=>{
          
                    ser.BatchDelFocusPeople(_.map(this.selItems,s=>s.focusId)).then(res=>{
                        if(!_t.msg(res,'删除成功!')) return;
                        this.GetFocusPeople();
                    });

                },function(){});
                break;

        }
    },
  }
}
</script>

<style lang="less" scoped>
.PersonList{width:100%;height:100%;box-sizing:border-box;text-align:left; overflow: hidden;}
.PersonList .optionBtn{margin-right:10px;cursor:pointer;}
.PersonList .optionBtn i{ margin-right:5px;}
.PersonList .option_bar{padding-left:10px;}
</style>