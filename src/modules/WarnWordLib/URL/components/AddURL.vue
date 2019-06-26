<!-- 新增关键词页面插件 -->
<template>
    <div class="AddURL">
        <Tags>
            <!--添加-->
            <div solt="name">添加</div>
            <div solt="content"><UpdateURL v-on="$listeners" /> </div>

            <!--导入-->
            <div solt="name">导入</div>
            <div solt="content"><ExportURL v-on="$listeners" /></div>
        </Tags>
    </div>
</template>

<script>
import UpdateURL from './UpdateURL'
import ExportURL from './ExportURL'
import Tags from '@/components/Tags'
export default {
  name: 'AddURL',
  components:{Tags,UpdateURL,ExportURL},
  data(){
    return {
       
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.AddURL{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>