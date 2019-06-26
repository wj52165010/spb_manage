<!-- 列表新增按钮插件 -->
<template>
    <div class="AddBtn">
       <IconBtn icon="fa fa-plus" @click="click()">{{name || '添加'}}</IconBtn>
    </div>
</template>

<script>
import IconBtn from './IconBtn'
export default {
  name: 'AddBtn',
  components:{IconBtn},
  props:['name'],
  data(){
    return {
    }
  },
  methods:{
    click(){
      this.$emit('click');   
    }
  }
}
</script>

<style lang="less" scoped>
.AddBtn{display: inline-block;}
</style>