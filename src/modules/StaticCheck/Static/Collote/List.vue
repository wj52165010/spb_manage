<template>
    <!--列表显示-->
    <div class="ColloteList fadeIn" style="width:100%;height:100%;" >
        <!--列表头-->
        <div class="base_table_header">
            <div class="column_1">
                厂商
            </div>
            <div class="column_2">
                <div class="row_1">
                    <div class="item">数据上传详情</div><div class="item">数据上传质量</div>
                </div>
                <div class="row_2">
                    <div class="item">
                        <div class="sep">网吧</div>
                        <div class="sep">无线WIFI采集</div>
                        <div class="sep">特征采集设备</div>
                        <div class="sep">合计</div>
                    </div><div class="item">
                        <div class="sep">实际条数</div>
                        <div class="sep">有效条数</div>
                        <div class="sep">无效条数</div>
                        <div class="sep">有效率</div>
                    </div>
                </div>
            </div>
        </div>

        <!--统计项-->
        <div class="base_count_item">
            <div class="column_1">全部厂商</div>
            <div class="column_2">
                <div class="item">
                    <div class="sep">{{list_count_count_data.网吧}}</div>
                    <div class="sep">{{list_count_count_data.无线WIFI}}</div>
                    <div class="sep">{{list_count_count_data.特征采集}}</div>
                    <div class="sep">{{list_count_count_data.合计}}</div>
                </div><div class="item">
                    <div class="sep">{{list_count_count_data.实际条数}}</div>
                    <div class="sep">{{list_count_count_data.有效条数}}</div>
                    <div class="sep">{{list_count_count_data.无效条数}}</div>
                    <div class="sep">{{list_count_count_data.有效率}}</div>
                </div>
            </div>
        </div>
        <!--列内容-->
        <div class="base_table_content">
            <Scroll :listen="list_count_data">
                <template v-for="(d,i) in list_count_data">
                        <div class="base_count_item" :key="i">
                            <div class="column_1" :title="d.厂商名称">{{d.厂商名称}}</div>
                            <div class="column_2">
                                <div class="item">
                                    <div class="sep">{{d.网吧}}</div>
                                    <div class="sep">{{d.无线WIFI}}</div>
                                    <div class="sep">{{d.特征采集}}</div>
                                    <div class="sep">{{d.合计}}</div>
                                </div><div class="item">
                                    <div class="sep">{{d.实际条数}}</div>
                                    <div class="sep">{{d.有效条数}}</div>
                                    <div class="sep">{{d.无效条数}}</div>
                                    <div class="sep">{{d.有效率}}</div>
                                </div>
                            </div>
                        </div>
                    </template>
            </Scroll>
        </div>
        <Loading v-if="Loading" />
    </div>
</template>

<script>
import Loading from '@/components/Loading'
import Scroll from '@/components/Scroll'
export default {
  name: 'ColloteList',
  props:['Listfirm','countTime'],
  components:{Scroll,Loading},
  data(){
    return {
        Loading:false,
        list_count_count_data:{},
        list_count_data:[],
    }
  },
  watch:{
    Listfirm(){this.GetData();},
    countTime(){this.GetData();}
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        this.Loading=true;
        ser.GetAllFirmsCountData({
            query:{
                firm_id:this.Listfirm,
                receive_time_start:this.countTime && this.countTime[0]?_t.Timestamp(this.countTime[0]):'',
                receive_time_end:this.countTime && this.countTime[1]?_t.Timestamp(this.countTime[1]):''
            }
        }).then(res=>{
            this.Loading=false;
            this.list_count_data=res.biz_body;
      
            let data =_.reduce(this.list_count_data,(r,d)=>{

                return {
                    '网吧':(r.网吧 || 0)+d.网吧,
                    '无线WIFI':(r.无线WIFI || 0)+d.无线WIFI,
                    '特征采集':(r.特征采集 || 0)+d.特征采集,
                    '合计':(r.合计 || 0)+d.合计,
                    '实际条数':(r.实际条数 || 0)+d.实际条数,
                    '有效条数':(r.有效条数 || 0)+d.有效条数,
                    '无效条数':(r.无效条数 || 0)+d.无效条数,
                    '有效率':'0%'
                };

            },{});

            data.有效率=((data.有效条数 || 0)/(data.实际条数 || 1) * 100).toFixed(2)  +'%';
            this.list_count_count_data=data;
        })
    }
  }
}
</script>

<style lang="less" scoped>
.ColloteList{width:100%;height:100%;box-sizing:border-box;color:white;position:relative;}
@tableHeaderH:80px;
@column_1_W:150px;
.ColloteList .base_table_header{width:100%;height:@tableHeaderH;.border("");box-sizing: border-box;}
.ColloteList .base_table_header .column_1{float:left;width:@column_1_W;height:@tableHeaderH - 1;.border('right');text-align:center;line-height:@tableHeaderH;box-sizing: border-box;}
.ColloteList .base_table_header .column_2{margin-left:@column_1_W;margin-right:0px;height:@tableHeaderH;box-sizing: border-box;}
.ColloteList .base_table_header .column_2 .row_1{height:@tableHeaderH/2;width:100%;.border('bottom');box-sizing: border-box;}

.ColloteList .base_table_header .column_2 .row_2 .item,
.ColloteList .base_table_header .column_2 .row_1 .item{display:inline-block;height:@tableHeaderH/2;width:50%;text-align:center;line-height:@tableHeaderH/2;box-sizing: border-box;}
.ColloteList .base_table_header .column_2 .row_2 .item:first-child,
.ColloteList .base_table_header .column_2 .row_1 .item:first-child{.border('right');box-sizing: border-box;}

.ColloteList .base_table_header .column_2 .row_2{height:@tableHeaderH/2;width:100%;box-sizing: border-box;}

.ColloteList .base_table_header .column_2 .row_2 .item .sep{float:left;width:25%;box-sizing: border-box;}
.ColloteList .base_table_header .column_2 .row_2 .item .sep{.border('right');box-sizing: border-box;}
.ColloteList .base_table_header .column_2 .row_2 .item .sep:last-child{border-right:none;box-sizing: border-box;}

.ColloteList .base_count_item{width:100%;height:@tableHeaderH/2;.border('bottom');.border('left');.border('right');box-sizing: border-box;}
.ColloteList .base_count_item .column_1{float:left;width:@column_1_W;height:@tableHeaderH/2;.border('right');text-align:center;line-height:@tableHeaderH/2;overflow:hidden;box-sizing: border-box;}
.ColloteList .base_count_item .column_2{margin-left:@column_1_W;margin-right:0px;height:@tableHeaderH/2;box-sizing: border-box;}
.ColloteList .base_count_item .column_2 .item{display:inline-block;height:@tableHeaderH/2;width:50%;text-align:center;line-height:@tableHeaderH/2;box-sizing: border-box;}
.ColloteList .base_count_item .column_2 .item:first-child{.border('right');box-sizing: border-box;}
.ColloteList .base_count_item .column_2 .item .sep{float:left;width:25%;height:100%;box-sizing: border-box;}
.ColloteList .base_count_item .column_2 .item .sep{.border('right');box-sizing: border-box;}
.ColloteList .base_count_item .column_2 .item .sep:last-child{border-right:none;box-sizing: border-box;}  

.ColloteList .base_table_content{width:100%;height:~'calc(100% - @{tableHeaderH} - @{tableHeaderH}/2)';box-sizing: border-box;}
</style>