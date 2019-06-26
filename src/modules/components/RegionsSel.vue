<!-- 区域下拉框插件 -->
<template>
    <el-select v-bind:value="value" placeholder="请选择" :clearable="true" @change="change">
        <el-option
            v-for="kind in data"
            :key="kind.key"
            :label="kind.name"
            :value="kind.key">
        </el-option>
    </el-select>
</template>

<script>

export default {
  name: 'RegionsSel',
  props:['value'],
  components:{},
  data(){
    return {
        data:[]
    }
  },
  methods:{
    change(v){
      this.$emit('input',v);
    }
  }
}
</script>

<style lang="less" scoped>

</style>