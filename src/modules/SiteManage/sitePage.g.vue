<!-- 场所管理页面插件 -->
<template>
    <div class="SiteManage">
      <Tags @change="tagChange">
          
          <!--列表-->
          <div solt="name">列表</div>
          <div solt="content"><SiteList /></div>

          <!--地图-->
          <div solt="name">地图</div>
          <div solt="content"><StatMap :type="0" ref="StatMap" /></div>

          <!--双系统-->
          <div solt="name">双系统</div>
          <div solt="content"><BothSystem /></div>

          <!--外挂-->
          <div solt="name">外挂</div>
          <div solt="content"><AddIn /></div>

      </Tags>
    </div>
</template>

<script>

import Tags from '@/components/Tags'
import StatMap from '../components/StatMap'
import SiteList from './List'
import BothSystem from './BothSystem'
import AddIn from './AddIn'

export default {
  name:'sitePage',
  role:'sitePage',
  refresh:true,
  components:{Tags,StatMap,SiteList,BothSystem,AddIn},
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
.SiteManage{width:100%;height:100%;box-sizing:border-box;}
</style>