<!-- 聚集预警原因详情插件 -->
<template>
    <div class="GatherReason">
        <ListAutoLayout>
            <template slot="header">
                <div>预警次数 : {{info.alarmCount}}</div>
                <div>聚集时间 : {{info.gatherTime}}</div>
                <div>聚集地点 : {{info.netbarName}}</div>
            </template>

            <v-table :listen="data" :blnLoading="loading">
                <v-table-header>
                    <v-table-column :width="150">姓名</v-table-column>
                    <v-table-column :width="120">账号类型</v-table-column>
                    <v-table-column>证件号码</v-table-column>
                    <v-table-column :width="150">
                        <ListSortBtn name="来到时间" field="first_time" :order="true" @change="orderChange" />
                    </v-table-column>
                    <v-table-column :width="150">
                        <ListSortBtn name="离开时间" field="last_time" @change="orderChange" />
                    </v-table-column>
                    <v-table-column :width="150">
                        <ListSortBtn name="停留时长" field="stay_time" @change="orderChange" />
                    </v-table-column>
                </v-table-header>
                <v-table-body>
                    <v-table-row v-for="(d,i) in data" :key="i">
                        <v-table-column >{{d.alarmName}}</v-table-column>
                        <v-table-column >{{d.authType}}</v-table-column>
                        <v-table-column >{{d.authAccount}}</v-table-column>
                        <v-table-column >{{d.firstTime | time}}</v-table-column>
                        <v-table-column >{{d.lastTime | time}}</v-table-column>
                        <v-table-column >{{d.stayTimeStr}}</v-table-column>
                    </v-table-row>
                </v-table-body>
            </v-table>

            <!--分页-->
            <template slot="footer">
                <Paging :pageIndex="page.index" :pageSize="page.size" :pageNum="page.num" :pageCount="page.count" @change="pageChange" />
            </template>
        </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import Paging from '@/components/Paging'
import ListSortBtn from '@/components/list/ListSortBtn'

export default {
  name: 'GatherReason',
  props:['id'],
  components:{ListAutoLayout,Paging,ListSortBtn},
  data(){
    return {
        loading:false,
        info:{},
        data:[],
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        },
        orderObj:{sort:'first_time',order:'desc'},//排序字段
    }
  },
  mounted(){
    this.GetList();
  },
  methods:{
    GetList(){
        this.loading=true;
        ser.GetGatherPreWarnDetail({
            page:this.page.index,
            limit:this.page.num,
            sidx:this.orderObj.sort,
            order:this.orderObj.order,
            query:{
                sessionId:this.id
            }
        }).then(res=>{
            this.loading=false;
            this.info=res.biz_body;
            this.data=res.biz_body.list.list;

            this.page.size=res.biz_body.list.totalPage;
            this.page.count=res.biz_body.list.totalCount;
        });
    },
    pageChange(i){this.page.index=i;this.GetList()},
    orderChange(type,val){
      this.orderObj.sort=type;
      this.orderObj.order=val?'desc':'asc';
      this.GetList();
    },
  }
}
</script>

<style lang="less" scoped>
.GatherReason{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;}
</style>