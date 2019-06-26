<!-- 新增关键词页面插件 -->
<template>
    <div class="AddWordClass">
        <Tags>
            <!--添加-->
            <div solt="name">添加</div>
            <div solt="content"><UpdateWordClass v-on="$listeners" /> </div>

            <!--导入-->
            <div solt="name">导入</div>
            <div solt="content"><ExportWordClass v-on="$listeners" /></div>
        </Tags>
    </div>
</template>

<script>
import ExportWordClass from './ExportWordClass'
import UpdateWordClass from './UpdateWordClass'
import Tags from '@/components/Tags'
export default {
  name: 'AddWordClass',
  components:{Tags,UpdateWordClass,ExportWordClass},
  data(){
    return {
       
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.AddWordClass{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>