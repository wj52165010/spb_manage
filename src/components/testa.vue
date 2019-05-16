<!-- 头部页面插件 -->
<template>
    <div>
        {{name}}
        <button type="button" class="btn btn-default" @click="name='12321'">修改</button>
    </div>
</template>

<script>
export default {
  name: 'testa',
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

</style>