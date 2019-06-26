<!-- 列表头部搜索项插件 -->
<template>
    <div class="ListSearchItem">
      <span class="labelName">{{label}}</span>
      <div class="ctrl" :style="{width:`${width?`${width}'px'`:'auto'}`}"><slot></slot></div>
    </div>
</template>

<script>
export default {
  name: 'ListSearchItem',
  props:['label','width'],
  data(){
    return {
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.ListSearchItem{display:inline-block;margin: 2px 5px;}
.ListSearchItem .labelName{margin-right:5px;}
.ListSearchItem .ctrl{display:inline-block;}
</style>