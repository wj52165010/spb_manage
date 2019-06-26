<!-- 聚集按钮插件 -->
<template>
    <div class="GatherBtn">
       <IconBtn icon="fa fa-users" @click="click()">聚集</IconBtn>
    </div>
</template>

<script>
import IconBtn from './IconBtn'
export default {
  name: 'GatherBtn',
  components:{IconBtn},
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
.GatherBtn{display: inline-block;}
</style>