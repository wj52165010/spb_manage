<!-- 列表头部搜索框容器插件 -->
<template>
    <div class="ListHeaderContainer">
      <div class="SearchConatienr">
        <slot></slot>
      </div>

      <div class="option_bar">
        <slot name="bar"></slot>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ListHeader',
  data(){
    return {
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.ListHeaderContainer{}
.ListHeaderContainer .SearchConatienr{display:inline-block;}
.ListHeaderContainer .option_bar{float:right;line-height:38px;}
.ListHeaderContainer .option_bar > div{margin-left:10px;}
</style>