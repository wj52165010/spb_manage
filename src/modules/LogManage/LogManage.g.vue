<!-- 日志管理页面插件 -->
<template>
    <div class="LogManage">
      <OperateLog />
    </div>
</template>

<script>
import OperateLog from './OperateLog'

export default {
  name: 'LogManage',
  role:'LogManage',
  refresh:true,
  components:{OperateLog},
  data(){
    return {
        
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.LogManage{width:100%;height:100%;box-sizing:border-box;}
</style>