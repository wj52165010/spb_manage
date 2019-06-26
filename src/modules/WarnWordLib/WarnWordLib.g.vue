<!-- 预警词库页面插件 -->
<template>
    <div class="WarnWordLib">
       <Tags>
            <!--关键词-->
            <div solt="name">关键词</div>
            <div solt="content"><Keyword /></div>

            <!--URL-->
            <div solt="name">URL</div>
            <div solt="content"><URL /></div>

            <!--词类-->
            <div solt="name">词类</div>
            <div solt="content"><WordClass /></div>
        </Tags>
    </div>
</template>

<script>
import Tags from '@/components/Tags'
import Keyword from './Keyword'
import URL from './URL'
import WordClass from './WordClass'

export default {
  name: 'WarnWordLib',
  role:'WarnWordLib',
  refresh:true,
  components:{Tags,Keyword,URL,WordClass},
  data(){
    return {

    }
  },
  methods:{
  
  }
}
</script>

<style lang="less" scoped>
.WarnWordLib{width:100%;height:100%;box-sizing:border-box;}
</style>