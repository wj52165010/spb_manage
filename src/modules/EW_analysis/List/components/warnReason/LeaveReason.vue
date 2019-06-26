<!-- 离开预警原因详情插件 -->
<template>
    <div class="LeaveReason">
        <ListAutoLayout>
            <v-table :listen="data">
                <v-table-header>
                    <v-table-column :width="150">
                        <ListSortBtn name="时间" field="timeOrder" :order="true" @change="orderChange" />
                    </v-table-column>
                    <v-table-column :width="150">场所编码</v-table-column>
                    <v-table-column :width="150">场所名称</v-table-column>
                    <v-table-column>场所地址</v-table-column>
                    <v-table-column :width="100">
                        <ListSortBtn name="账号类型" field="kindOrder" @change="orderChange" />
                    </v-table-column>
                    <v-table-column :width="100">
                        <ListSortBtn name="虚拟身份类型" field="vidOrder" @change="orderChange" />
                    </v-table-column>
                    <v-table-column :width="80">账号</v-table-column>
                </v-table-header>
                <v-table-body>
                    <v-table-row v-for="(d,i) in data" :key="i">
                        <v-table-column >库尔班-热合曼</v-table-column>
                        <v-table-column >142621198210125623</v-table-column>
                        <v-table-column >维吾尔族</v-table-column>
                        <v-table-column >男</v-table-column>
                        <v-table-column >1982-10-12</v-table-column>
                        <v-table-column >2019-03-22 15:07:49</v-table-column>
                        <v-table-column >重庆爱思</v-table-column>
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
  name: 'LeaveReason',
  components:{ListAutoLayout,Paging,ListSortBtn},
  data(){
    return {
        data:[],
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        },
        orderObj:{sort:'create_time',order:'desc'},//排序字段
    }
  },
  methods:{
    pageChange(){},
    orderChange(type,val){
      let fieldMap={
          timeOrder:'create_time',
          kindOrder:'create_time',
          vidOrder:'create_time',
      };

      this.orderObj.sort=fieldMap[type];
      this.orderObj.order=val?'desc':'asc';
    },
  }
}
</script>

<style lang="less" scoped>
.LeaveReason{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>