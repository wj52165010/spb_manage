<!-- 列表选择按钮插件 -->
<template>
    <div class="SelBtn">
       <IconBtn icon="fa fa-check-square" :class="{subColtwo:blnSel}" @click="selClick()">选择</IconBtn>
    </div>
</template>

<script>
import IconBtn from './IconBtn'
export default {
  name: 'SelBtn',
  props:['blnSel'],
  components:{IconBtn},
  data(){
    return {
    }
  },
  methods:{
    selClick(){
      this.$emit('click');   
    }
  }
}
</script>

<style lang="less" scoped>
.SelBtn{display: inline-block;}
</style>