<!-- 日志类型下拉框插件 -->
<template>
    <el-select v-bind:value="value" placeholder="全部状态" :clearable="true" @change="change" style="width:100px;">
        <el-option
            v-for="kind in data"
            :key="kind.value"
            :label="kind.name"
            :value="kind.value">
        </el-option>
    </el-select>
</template>

<script>

export default {
  name: 'LogKindSel',
  props:['value'],
  components:{},
  data(){
    return {
        data:[{name:'有错误',value:'1'},{name:'全部',value:'0'}]
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