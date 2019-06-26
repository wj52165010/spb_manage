<!-- 预警分析页面插件 -->
<template>
    <div class="EW_analysis">
        <Tags :index="curIndex">
          <!--地图-->
          <div solt="name"><i class="fa fa-area-chart" style="margin-right:5px;" />地图</div>
          <div solt="content">
            <Chart />
          </div>

          <!--列表-->
          <div solt="name"><i class="fa fa-th-list" style="margin-right:5px;" />列表</div>
          <div solt="content"><List :idCode="certCode" /></div>
      </Tags>
    </div>
</template>

<script>
import Tags from '@/components/Tags'
import Chart from './Chart'
import List from './List'

export default {
  props:['certCode'],
  name: 'EW_analysis',
  role:'EW_analysis',
  refresh:true,
  components:{Tags,Chart,List},
  data(){
    return {
      curIndex:'0',
    }
  },
  mounted(){
    if(this.certCode){this.curIndex='1';}
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.EW_analysis{width:100%;height:100%;box-sizing:border-box;}
</style>