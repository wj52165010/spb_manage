<template>
  <div class="UserManageIndex">
    <ListAutoLayout ref="layout">
        <template slot="header">
            <ListHeader>
              <ListSearchItem label="角色对象:">
                  <el-select v-model="query.role" placeholder="请选择" :clearable="true">
                      <el-option
                          v-for="kind in Roles"
                          :key="kind.key"
                          :label="kind.name"
                          :value="kind.key">
                      </el-option>
                  </el-select>
              </ListSearchItem>

              <ListSearchItem label="账号/名称:">
                <el-input placeholder="请输入" v-model="query.account" ></el-input> 
              </ListSearchItem>

              <ListSearchItem label="创建时间:">
                <el-date-picker v-model="query.time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
              </ListSearchItem>

              <ListSearchItem>
                <SearchBtn  @click="search()"/>
              </ListSearchItem>
              
              <template slot="bar">
                <AddBtn @click="AddUser()" />
              </template>
            </ListHeader>
        </template>
        <!--列表项-->
        <v-table :listen="data" ref="list" :blnLoading="blnLoading">
            <v-table-header>
                <v-table-column :width="150" >
                    <ListSortBtn name="账号" field="accountOrder" :order="accountOrder" @change="orderChange" />
                </v-table-column>
                <v-table-column :width="150" >
                    <ListSortBtn name="名称" field="nameOrder" :order="nameOrder" @change="orderChange" />
                </v-table-column>
                <v-table-column :width="150" >角色对象</v-table-column>
                <v-table-column :width="150" >角色列表</v-table-column>
                <v-table-column :width="120" >电话</v-table-column>
                <v-table-column :width="150" >邮箱</v-table-column>
                <v-table-column :width="100" >部门</v-table-column>
                <v-table-column>管辖范围</v-table-column>
                <v-table-column :width="150">备注</v-table-column>
                <v-table-column :width="150">
                    <ListSortBtn name="创建时间" field="timeOrder" :order="timeOrder" @change="orderChange" />
                </v-table-column>
                <v-table-column :width="120">操作</v-table-column>
            </v-table-header>
            <v-table-body>
                <v-table-row v-for="(d,i) in data" :key="i">
                    <v-table-column>{{d.account}}</v-table-column>
                    <v-table-column>{{d.name}}</v-table-column>
                    <v-table-column :title="d.userGroupTypeNote">{{d.userGroupTypeNote}}</v-table-column>
                    <v-table-column :title="d.ugName">{{d.ugName}}</v-table-column>
                    <v-table-column>{{d.tel}}</v-table-column>
                    <v-table-column>{{d.email}}</v-table-column>
                    <v-table-column>{{d.department}}</v-table-column>
                    <v-table-column :title="d.region_str_c"><span :class="{clickItem:d.region_str_c}" @click="d.region_str_c && AreaDetail(d.regionCode,d)">{{d.region_str_c || '&nbsp;'}}</span></v-table-column>
                    <v-table-column :title="d.note">{{d.note}}</v-table-column>
                    <v-table-column>{{d.createTimeStr}}</v-table-column>
                    <v-table-column>
                        <el-tooltip class="btn_item" content="修改" placement="top">
                            <i class="fa fa-pencil hoverSubBgColtwo" @click="UpdateUser(d)" />
                        </el-tooltip>
                        
                        <el-tooltip class="btn_item" :content="d.status=='disabled'?'启用':d.status=='lock'?'解锁':'停用'" placement="top" :style="{color:d.status=='disabled'?'red':d.status=='lock'?'gray':''}">
                            <i class="hoverSubBgColtwo" :class="d.status=='disabled'?'fa fa-stop-circle-o':d.status=='lock'?'fa fa-lock':'fa fa-play-circle'" @click="AccountState(d)" />
                        </el-tooltip>

                        <el-tooltip class="btn_item" content="重置密码" placement="top">
                            <i class="fa fa-undo hoverSubBgColtwo" @click="ResetPassword(d)" />
                        </el-tooltip>

                        <el-tooltip class="btn_item" content="删除" v-if="d.user_id!=curUserId || d.user_group_type=='sys_admin'" placement="top">
                            <i class="fa fa-remove hoverSubBgColtwo" @click="RemoveUser(d,i)" />
                        </el-tooltip>
                    </v-table-column>
                </v-table-row>
            </v-table-body>
        </v-table>
        <template slot="footer">
            <Paging :pageIndex="page.index" :pageSize="page.size" :pageNum="page.num" :pageCount="page.count" @change="pageChange"  />
        </template>
    </ListAutoLayout>
  </div>
</template>
<script>

import ListAutoLayout from '@/components/list/ListAutoLayout'
import Paging from '@/components/Paging'
import ListSortBtn from '@/components/list/ListSortBtn'
import AddBtn from '@/components/btns/AddBtn'
import SearchBtn from '@/components/btns/SearchBtn'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'

import AccountState  from './AccountState'
import RemoveUser from './RemoveUser'
import ResetPassword from './ResetPassword'
import AreaDetail from './AreaDetail'
import AddUser from './AddUser' 

import {GetRoles} from '@/store/UserManage/types'
import { mapState} from 'vuex'

export default {
  name: 'UserManageIndex',
  refresh:true,
  components:{ListAutoLayout,ListSortBtn,Paging,
              AddBtn,ListHeader,ListSearchItem,
              SearchBtn},
  data(){
    return {
        simpleTime:{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        blnLoading:false,
        data:[],//列表数据
        accountOrder:false,
        nameOrder:true,
        timeOrder:true,
        orderObj:{sort:'create_time',order:'desc'},//排序字段
        query:{
            time_range:[],
            account:'',
            role:'',
        },
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        },
        curUserId:ser.baseBag.userid
    }
  },
  computed:{
    ...mapState({
      Roles:state=>state.UserManage.Roles
    })
  },
  mounted(){
    this.GetRoles();
    this.GetData();
  },
  methods:{
    refresh(){
      this.accountOrder=false;
      this.orderObj={sort:'create_time',order:'desc'};
      this.query={
        time_range:[],
        account:'',
        role:'',
      };
      this.page.index=0;
      this.GetRoles();
      this.GetData();
    },
    //获取角色对象集合
    GetRoles(){
        this.$store.dispatch(GetRoles);
    },
    //获取用户列表信息
    GetData(){
        let params={
            user_group_type:this.query.role,
            user_key: this.query.account,
            start_time:_t.Timestamp((this.query.time_range || [])[0]),
            end_time:_t.DateTimestampByEndTime((this.query.time_range || [] )[1]),
            limit: this.page.num,
            page: this.page.index,
            sidx:this.orderObj.sort,
            order:this.orderObj.order
        };
        this.blnLoading=true;
        ser.GetUsers(params).then(res=>{
            this.blnLoading=false;
            if(!_t.msg(res,'','获取用户列表失败!')) return;
            this.page.count=res.biz_body.totalCount;
            this.page.size=res.biz_body.totalPage;
            this.data=_.map(res.biz_body.list,r=>{
                r.region_str_c=_.map(eval('('+(r.regionCode)+')') || [],c=>c.name).join(',');

                return r;
            });
        });
    },
    search(){
        this.pageChange(0);
    },
    pageChange(i){
        this.page.index=i;
        this.GetData();
    },
    //排序改变事件
    orderChange(type,val){
     let orderCache=this[type];

     if(orderCache==val) return;

     this.accountOrder=true;
     this.nameOrder=true;
     this.timeOrder=true;

     this[type]=val;

     let fieldMap={
        accountOrder:'account',
        nameOrder:'name',
        timeOrder:'create_time',
     };

     this.orderObj.sort=fieldMap[type];
     this.orderObj.order=val?'desc':'asc';

     this.GetData();
    },
    //新增用户
    AddUser(){
        this.$open({
          title:'添加用户',
          area:['700px','500px'],
          components:{AddUser},
          content:'<AddUser @submit="submit" @cancel_btn="close" />',
          data:{
          },
          methods:{
            submit(){
                let s=this.$caller;
                s.page.index = Math.ceil((s.page.count+1)/s.page.num)-1;
                s.GetData();
                this.close();

            },
            close(){this.close()}
          }
        });
    },
    //管辖范围详细
    AreaDetail(region,d){
        this.$open({
          title:'管辖范围详情',
          area:['600px','500px'],
          components:{AreaDetail},
          content:'<AreaDetail :region="region" :data="data" @cancel="close" />',
          data:{
            data:d,
            region:eval('('+region+')'),
          },
          methods:{
           
            close(){this.close()}
          }
        });
    },
    UpdateUser(d){
        this.$open({
          title:'修改用户',
          area:['700px','500px'],
          components:{AddUser},
          content:'<AddUser blnUpdate="true" :data="data" @submit="submit" @cancel_btn="close" />',
          data:{
            data:d
          },
          methods:{
            submit(data){
                data.region_str_c=_.map(data.regionCode || [],c=>c.name).join(',');
                Object.assign(d,data);
                this.close();

            },
            close(){this.close()}
          }
        });
    },
    AccountState(d){
        this.$open({
          title:`${d.status=='disabled'?'启用账号':d.status=='lock'?'解锁账号':'停用账号'}`,
          area:'300px',
          components:{AccountState},
          content:`<AccountState :d="d" @cancel="close()" />`,
          data:{
            d:d
          },
          methods:{
            close(){this.close()}
          }
        })
    },
    ResetPassword(d){
        this.$open({
          title:'重置密码',
          area:'360px',
          components:{ResetPassword},
          content:'<ResetPassword :userId="userId" @cancel_btn="close" />',
          data:{
            userId:d.userId
          },
          methods:{
            close(pwd){
                if(pwd){d.pwd=pwd;}
                this.close();
            }
          }
        });
    },
    RemoveUser(d,i){
        this.$open({
          title:'删除用户',
          area:'300px',
          components:{RemoveUser},
          content:`<RemoveUser :d="d" @cancel="close" />`,
          data:{
            d:d,
            i:i,
          },
          methods:{
            close(blnSuccess){
                if(blnSuccess){this.$caller.GetData()}
                this.close()
            }
          }
        })
    },
    layout(){
      this.$refs.layout.ResizeHandler();
      this.$refs.list.reloadScroll();
    }
  }
}
</script>

<style lang="less" scoped>
.UserManageIndex{width:100%;height:100%;text-align:left;}

.UserManageIndex .btn_item{margin-left:5px;}
.UserManageIndex .btn_item:hover{cursor:pointer;}
</style>