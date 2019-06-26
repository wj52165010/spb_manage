<!-- 统计页面插件 -->
<template>
    <div class="StaticPage">
        <Tags>
            <!--采集详情-->
            <div solt="name">采集详情</div>
            <div solt="content"><Collote ref="Collote" /></div>

            <!--接入统计-->
            <div solt="name">接入统计</div>
            <div solt="content"><AccessStatistics ref="AccessStatistics" /></div>

        </Tags>
    </div>
</template>

<script>
import Tags from '@/components/Tags'
import Collote from './Collote'
import AccessStatistics from './AccessStatistics'

export default {
  name: 'StaticPage',
  components:{Tags,Collote,AccessStatistics},
  data(){
    return {
    }
  },
  methods:{
    refresh(){
      this.$refs.Collote.refresh &&  this.$refs.Collote.refresh();
      this.$refs.AccessStatistics.refresh &&  this.$refs.AccessStatistics.refresh();
    }
  }
}
</script>

<style lang="less" scoped>
.StaticPage{width:100%;height:100%;box-sizing:border-box;padding:0px 10px;}
</style>