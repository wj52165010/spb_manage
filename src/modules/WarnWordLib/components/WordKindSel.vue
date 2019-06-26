<!-- 词类下拉框插件 -->
<template>
    <el-select v-bind:value="value" placeholder="请选择" :clearable="clearable==undefined?true:false" @change="change">
        <el-option
            v-for="kind in wordKinds"
            :key="kind.typeId"
            :label="kind.typeName"
            :value="kind.typeId">
        </el-option>
    </el-select>
</template>

<script>
export default {
  name: 'WordKindSel',
  props:['value','clearable','defIndex'],
  components:{},
  data(){
    return {
      wordKinds:[],
    }
  },
  mounted(){
    this.GetList();
  },
  methods:{
    GetList(){
      ser.GetWarnWordKinds().then(res=>{
        this.wordKinds=res.biz_body;
        this.$emit('input',(this.wordKinds[this.defIndex] || {}).typeId || this.value);
      });
    },
    change(v){
        this.$emit('input',v);
    }
  }
}
</script>

<style lang="less" scoped>

</style>