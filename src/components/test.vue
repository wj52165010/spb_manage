<!-- 头部页面插件 -->
<template>
    <div>
        {{name}}
        <button type="button" class="btn btn-default" @click="$emit('ShowPage')">修改</button>
        <testa />
    </div>
</template>

<script>
import testa from '@/components/testa'
export default {
  name: 'test',
  components:{testa},
  data(){
    return {
        name:'测试刷新'
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.text{width:100%;height:100%;box-sizing:border-box;}
</style>