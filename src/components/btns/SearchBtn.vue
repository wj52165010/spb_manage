<!-- 查询按钮插件 -->
<template>
    <div class="SearchBtn" @click.stop="$emit('click')">
        <el-button type="primary" 
                   class="subBgColtwo" 
                   :style="{background:disable?'gray !important':'',
                   border:disable?'none':'',
                   cursor:disable?'not-allowed':'pointer'
                   }"><span>查询</span></el-button>
    </div>
</template>

<script>
export default {
  name: 'SearchBtn',
  props:['disable'],
  data(){
    return {
        
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.SearchBtn{display:inline-block;}
</style>