<!-- 设备管理页面插件 -->
<template>
    <div class="devicePage">
      <Tags @change="tagChange">
          <!--列表-->
          <div solt="name">列表</div>
          <div solt="content"><List /></div>

          <!--地图-->
          <div solt="name">地图</div>
          <div solt="content"><StatMap :type="1" ref="StatMap" /></div>

      </Tags>
    </div>
</template>

<script>

import Tags from '@/components/Tags'
import StatMap from '../components/StatMap'
import List from './List'

export default {
  name:'devicePage',
  role:'devicePage',
  refresh:true,
  components:{Tags,StatMap,List},
  data(){
    return {
      blnResetMap:false,
    }
  },
  methods:{
    tagChange(i){
      if(i=='1'){
        setTimeout(()=>{
          if(this.blnResetMap) return;
          this.blnResetMap=true;
          this.$refs.StatMap.refresh();
        },300)
        
      }
    }
  }
}
</script>

<style lang="less" scoped>
.devicePage{width:100%;height:100%;box-sizing:border-box;}
</style>