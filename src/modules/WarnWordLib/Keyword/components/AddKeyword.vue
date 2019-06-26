<!-- 新增关键词页面插件 -->
<template>
    <div class="AddKeyword">
        <Tags>
            <!--添加-->
            <div solt="name">添加</div>
            <div solt="content"><UpdateKeyword v-on="$listeners" /> </div>

            <!--导入-->
            <div solt="name">导入</div>
            <div solt="content"><ExportKeyword v-on="$listeners" /></div>
        </Tags>
    </div>
</template>

<script>
import UpdateKeyword from './UpdateKeyword'
import ExportKeyword from './ExportKeyword'
import Tags from '@/components/Tags'
export default {
  name: 'AddKeyword',
  components:{Tags,UpdateKeyword,ExportKeyword},
  data(){
    return {
       
    }
  },
  methods:{

  }
}
</script>

<style lang="less" scoped>
.AddKeyword{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>