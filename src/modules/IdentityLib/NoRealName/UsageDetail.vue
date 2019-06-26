<!-- 本人使用率详细页面插件 -->
<template>
    <div class="UsageDetail">
       <ListAutoLayout>
            <template slot="header">
                {{info}}
                <div style="float:right;font-size:12px;">更新时间：{{time}}</div>
            </template>

            <v-table :listen="data" ref="list" :blnLoading="blnLoading">
                <v-table-header>
                    <v-table-column :width="100" >证件类型</v-table-column>
                    <v-table-column :width="200" >证件号码</v-table-column>
                    <v-table-column :width="100" >姓名</v-table-column>
                    <v-table-column :width="60" >民族</v-table-column>
                    <v-table-column :width="100" >关联次数</v-table-column>
                    <v-table-column :width="200" >最近采集时间</v-table-column>
                </v-table-header>

                <v-table-body>
                    <v-table-row v-for="(d,i) in data" :key="i">
                        <v-table-column>{{d.certificate_type_name}}</v-table-column>
                        <v-table-column>{{d.certificate_code}}</v-table-column>
                        <v-table-column>{{d.customer_name}}</v-table-column>
                        <v-table-column>{{d.nation}}</v-table-column>
                        <v-table-column>{{d.use_count}}</v-table-column>
                        <v-table-column>{{d.last_time_str}}</v-table-column>
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
export default {
  name: 'UsageDetail',
  props:['d','c'],
  components:{ListAutoLayout,Paging},
  data(){
    return {
        info:'_______',
        time:'',
        data:[],
        blnLoading:false,
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        }
    }
  },
mounted(){
    this.GetDetail();
  },
  methods:{
    //获取详细信息
    GetDetail(){
        this.blnLoading=true;
        ser.GetNoRealNameRelation({
            query:{
                type:this.d.account_type,
                key:this.d.account,
                cert_type:this.c.certificate_type,
                cert_no:this.c.certificate_code,
                log_time:this.d.log_time,
            },
            page:this.page.index,
            limit:this.page.num
        }).then(res=>{
            this.blnLoading=false;
            this.info=res.biz_body.title;
            this.time=res.biz_body.time;
            this.page.size=res.biz_body.totalPage;
            this.page.count=res.biz_body.totalCount;

            this.data=res.biz_body.list;
        });
    },
    pageChange(i){
        this.page.index=i;
        this.GetDetail();
    }
  }
}
</script>

<style lang="less" scoped>
.UsageDetail{width:100%;height:100%;box-sizing:border-box;text-align:left;padding:10px;}
</style>