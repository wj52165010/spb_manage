<!-- 昨日采集弹窗页面插件 -->
<template>
    <div class="DataColloct">
        <Tags>
            <!--采集趋势-->
            <div solt="name">采集趋势</div>
            <div solt="content"><ColloctTrend :code="code" /></div>

            <!--采集详情-->
            <div solt="name">采集详情</div>
            <div solt="content"><ColloctDetail :code="code" /></div>

        </Tags>
    </div>
</template>

<script>
import Tags from '@/components/Tags'
import ColloctTrend from './ColloctTrend'
import ColloctDetail from './ColloctDetail'

export default {
  name: 'DataColloct',
  props:['code'],
  components:{Tags,ColloctTrend,ColloctDetail},
  data(){
    return {
        
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.DataColloct{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>