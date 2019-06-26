<!-- 未实名人员页面插件 -->
<template>
    <div class="NoRealNamePage">
        <NoRealName />
    </div>
</template>

<script>
import NoRealName from '@/modules/IdentityLib/NoRealName'
export default {
  name: 'NoRealNamePage',
  role:'NoRealNamePage',
  components:{NoRealName},
  data(){
    return {
        
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.NoRealNamePage{width:100%;height:100%;box-sizing:border-box;}
</style>