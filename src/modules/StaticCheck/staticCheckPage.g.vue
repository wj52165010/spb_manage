<!-- 统计考核页面插件 -->
<template>
    <div class="StaticCheckPage">
        <Tags>
            <!--统计-->
            <div solt="name">统计</div>
            <div solt="content"><Static ref="Static" /></div>

            <!--考核-->
            <div solt="name">考核</div>
            <div solt="content"><Check ref="Check" /></div>

        </Tags>
    </div>
</template>

<script>
import Tags from '@/components/Tags'
import Static from './Static'
import Check from './Check'

export default {
  name: 'StaticCheckPage',
  components:{Tags,Static,Check},
  data(){
    return {
    }
  },
  methods:{
    refresh(){
      this.$refs.Static.refresh &&  this.$refs.Static.refresh();
      this.$refs.Check.refresh &&  this.$refs.Check.refresh();
    }
  }
}
</script>

<style lang="less" scoped>
.StaticCheckPage{width:100%;height:100%;box-sizing:border-box;}
</style>