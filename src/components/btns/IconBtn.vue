<!-- 带图标的操作按钮插件 -->
<template>
    <div class="IconBtn hoverSubBgColtwo" @click.stop="$emit('click')">
        <i :class="icon" />
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'IconBtn',
  props:['icon'],
  data(){
    return {
        
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
.IconBtn{display:inline-block;font-size:12px;cursor:pointer;}
.IconBtn i{margin-right:5px;}
</style>