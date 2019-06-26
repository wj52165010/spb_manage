<!-- URL原因插件 -->
<template>
    <div class="URL_Reason">
        <ListAutoLayout>
            <template slot="header">
                预警类型:{{info}}
            </template>

            <v-table :listen="data" ref="list" :blnLoading="blnLoading">
                <v-table-header>
                    <v-table-column :width="150" ><ListSortBtn name="时间" field="time" :order="true" @change="orderChange" /></v-table-column>
                    <v-table-column>URL</v-table-column>
                    <v-table-column :width="150" >访问次数</v-table-column>
                </v-table-header>

                <v-table-body>
                    <v-table-row v-for="(d,i) in data" :key="i">
                        <v-table-column>{{d.time}}</v-table-column>
                        <v-table-column>{{d.url}}</v-table-column>
                        <v-table-column>{{d.cnt}}</v-table-column>
                    </v-table-row>
                </v-table-body>
            </v-table>

            <template slot="footer">
                <RawButton type="cancel"  @inClick="cancel()" style="margin-right:5px;float:right;">关闭</RawButton>
            </template>
        </ListAutoLayout>
        <Loading v-if="loading" />
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListSortBtn from '@/components/list/ListSortBtn'
import Loading from '@/components/Loading'
export default {
  name: 'URL_Reason',
  props:['id'],
  components:{ListAutoLayout,ListSortBtn,Loading},
  data(){
    return {
        Loading:false,
        info:'',
        data:[],
        blnLoading:false,
        orderObj:{sort:'time',order:'desc'},//排序字段
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        this.Loading=true;
        ser.GetUrlWarnDetail({sessionId:this.id}).then(res=>{
            this.Loading=false;
            this.info=res.biz_body.word_type;
            this.data=res.biz_body.list;

            this.data=this.data.sort((a,b)=>{
                return  this.orderObj.order=='desc'?_t.Timestamp(b.time)-_t.Timestamp(a.time):_t.Timestamp(a.time)-_t.Timestamp(b.time);
            });
        });
    },
    orderChange(type,val){
        this.orderObj.sort=type;
        this.orderObj.order=val?'desc':'asc';

        this.data=this.data.sort((a,b)=>{
            return  this.orderObj.order=='desc'?_t.Timestamp(b.time)-_t.Timestamp(a.time):_t.Timestamp(a.time)-_t.Timestamp(b.time);
        });
    },
    cancel(){this.$emit('cancel');}
  }
}
</script>

<style lang="less" scoped>
.URL_Reason{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;position:relative;}
</style>