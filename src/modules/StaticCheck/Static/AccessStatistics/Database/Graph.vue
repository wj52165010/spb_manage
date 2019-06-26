<!-- 数据库图表页面组件 -->
<template>
    <div class="Graph">
        <!--顶部统计信息-->
      <div class="top_info">
        <span class="title"><i class="fa fa-Graph" />昨日</span>
        <span class="number" v-for="(t,i) in total.split('')" :key="i">{{t}}</span>
        <span class="title">条</span>
      </div>

      <!--操作栏-->
      <div class="option_bar">

        <div class="item">
            <div style="display:inline-block;">
              <el-input placeholder="请输入数据库名" icon="search" v-model="databaseName"></el-input>
            </div>
        </div>

        <div class="item">
            <span>数据来源:</span><div style="display:inline-block;width:250px;">
               <DataSourceSel v-model="dataOri"  />
            </div>
        </div>

        <!--右边显示区域-->
        <div class="right_container">
          <el-tooltip  content="图表" placement="top">
            <i class="fa fa-th-large" :class="{active:show==0}" @click="show=0" />
          </el-tooltip>

          <el-tooltip  content="列表" placement="top">
            <i class="fa fa-list"   :class="{active:show==1}" @click="$emit('pageChange',1)" />
          </el-tooltip>
        </div>


      </div>

      <!--内容展示区域-->
      <div class="show_content" style="height:calc(100% - 101px);">
        <Scroll :listen="showData" ref="chartScroll">
          <div class="item_container">
            <div class="item" v-for="(d,i) in showData" :key="i">
              <div style="float:left; width:100%;">
                <div class="title">{{d.db_name || '-----'}}</div>
                <div class="sub_title">{{d.db_en_name}}</div>

                <div class="countData">
                  <div class="countData_item divEllipsis"><span class="name">日均接入</span>{{d.day_num}}</div>
                  <div class="countData_item divEllipsis"><span class="name">月接入量</span>{{d.month_num}}</div>
                  <div class="countData_item divEllipsis"><span class="name">接入总量</span>{{d.sum_num}}</div>
                </div>

                <div class="left_mask"></div>
                <div class="right_mask"></div>
              </div>
            </div>
          </div>
        </Scroll>
      </div>

      <!--分页控件-->
      <!--<NumberPage :pageNum="3" :btnNum="5" />-->
      <Loading v-if="blnLoading" />
    </div>
</template>

<script>
/* eslint-disable */
import Scroll from '@/components/Scroll'
import NumberPage from '@/components/NumberPage'
import DataSourceSel from '@/modules/components/DataSourceSel'
import Loading from '@/components/Loading'

export default {
  name: 'Graph',
  components:{Scroll,NumberPage,DataSourceSel,Loading},
  data () {
    return {
      total:'13243241',
      databaseName:'',
      dataOri:'',
      show:-1,//0:图表,1:列表
      data:[],
      blnLoading:false,
    }
  },
  computed:{
    showData(){
      if(this.databaseName==''){return this.data;}
      return _.filter(this.data,d=>d.db_name.indexOf(this.databaseName)>=0 || d.db_en_name.indexOf(this.databaseName)>=0);
    }
  },
  watch:{
    dataOri(){
      this.GetData();
    }
  },
  mounted(){
    this.show=0;
    this.refreshPage();
  },
  methods:{
    layout(){
      this.$refs.chartScroll.reloadyScroll();
    },
    GetData(){
      //获取今日统计数据
      ser.TopDataCount().then(res=>{
        this.total=res.biz_body.total+'';
      });

      //图表数据
      this.blnLoading=true;
      ser.AccessStatistics_Database_List({query:{microprobe_type:this.dataOri}}).then(res=>{
        this.blnLoading=false;
        this.data=res.biz_body;
      })
    },
    refreshPage(){
      this.GetData();
    }
  }
}
</script>

<style scoped lang="less">
.Graph{width:100%;height:100%;position:relative;}
.Graph .top_info{margin:0px auto;display: inline-block;padding:5px 15px;border:1px solid;border-radius:5px;}
.Graph .top_info .title i{margin-right:10px;}
.Graph .top_info .title{font-size:18px;font-weight:600;}

.Graph .top_info .number{border:1px solid;padding:2px 5px;position:relative;margin-right:5px;}

.Graph .top_info .number:before{
  content:'';
  position:absolute;
  width:2px;
  height:8px;
  right:-2px;
  bottom:-2px;
  background:@mainCol;
}
.Graph .top_info .number:after{
  content:'';
  position:absolute;
  width:8px;
  height:2px;
  right:-2px;
  bottom:-2px;
  background:@mainCol;
}

.Graph .option_bar{text-align:left;padding:5px 15px;line-height:40px;}
.Graph .option_bar .item{display:inline-block;margin:2px 5px;}
.Graph .option_bar .right_container{float:right;}
.Graph .option_bar .right_container i{font-size:18px;margin-left:5px;cursor:pointer;}

@ItemH:200px;
@ItemW:180px;
.Graph .show_content{text-align:left;padding:5px 0px;}
.Graph .show_content .item_container{padding:10px 10px;}
.Graph .show_content .item{width:@ItemW;height:@ItemH;border:1px solid;display:inline-block;}

@cornerH:20px;
.Graph .show_content .item_container .item{position:relative;margin:15px;box-sizing:border-box;}
.Graph .show_content .item_container .item:before{content:'';position:absolute;width:@cornerH;border:3px solid;border-right:0px;height:~'calc(100% + 6px)';left:-3px;top:-3px;box-sizing:border-box;}

.Graph .show_content .item_container .item:after{content:'';position:absolute;width:@cornerH;border:3px solid;border-left:0px;height:~'calc(100% + 6px)';right:-3px;top:-3px;box-sizing:border-box;}


.Graph .show_content .item_container .item .title{text-align:center;font-weight:600;font-size:18px;margin-top:20px;}
.Graph .show_content .item_container .item .sub_title{text-align:center;}
.Graph .show_content .item_container .item .countData{position:absolute;width:100%;bottom:10px;padding:0px 20px;font-size:12px;}
.Graph .show_content .item_container .item .countData .countData_item{line-height:30px;}
.Graph .show_content .item_container .item .countData .countData_item .name{margin-right:10px;}
</style>
