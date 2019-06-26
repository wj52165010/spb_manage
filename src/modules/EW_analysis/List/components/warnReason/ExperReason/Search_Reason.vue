<!-- 搜索关键字插件 -->
<template>
    <div class="Search_Reason">
        <ListAutoLayout>
            <template slot="header">
                预警类型:{{info}}
            </template>

            <v-table :listen="data" ref="list" :blnLoading="blnLoading">
                <v-table-header>
                    <v-table-column :width="150" >时间</v-table-column>
                    <v-table-column :width="150">搜索引擎</v-table-column>
                    <v-table-column>关键词</v-table-column>
                </v-table-header>

                <v-table-body>
                    <v-table-row v-for="(d,i) in data" :key="i">
                        <v-table-column>{{d.capture_time}}</v-table-column>
                        <v-table-column>{{d.search_type_str}}</v-table-column>
                        <v-table-column><div v-html="d.keyword"></div></v-table-column>
                    </v-table-row>
                </v-table-body>
            </v-table>

            <template slot="footer">
                <RawButton type="cancel"  @inClick="cancel()" style="margin-right:5px;float:right;margin-top:10px;">关闭</RawButton>
            </template>
        </ListAutoLayout>

        <Loading v-if="loading" />
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import Loading from '@/components/Loading'
export default {
  name: 'Search_Reason',
  props:['id'],
  components:{ListAutoLayout,Loading},
  data(){
    return {
        loading:false,
        info:'',
        data:[],
        blnLoading:false,
        orderObj:{sort:'capture_time',order:'desc'},//排序字段
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        this.loading=true;
        ser.GetSearchwordWarnDetail({sessionId:this.id}).then(res=>{
            this.loading=false;
            this.info=res.biz_body.word_type;
            this.data=res.biz_body.list;
        });
    },
    orderChange(type,val){
        this.orderObj.sort=type;
        this.orderObj.order=val?'desc':'asc';
        this.GetData();
    },
    cancel(){this.$emit('cancel');}
  }
}
</script>

<style>
    .Search_Reason em2{color:yellow;}
    .Search_Reason em1{color:red;}
</style>

<style lang="less" scoped>
.Search_Reason{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;}
</style>