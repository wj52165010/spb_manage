<!-- 预警类型下拉框插件 -->
<template>
    <el-cascader
    v-bind:value="value"
    :options="kinds"
    change-on-select
    :clearable="true"
    @change="change"
    ></el-cascader>
</template>

<script>

export default {
  name: 'PreWarnTypeSel',
  props:['value'],
  components:{},
  data(){
    return {
        kinds:[],
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        ser.GetPreWarnType().then(res=>{
            this.kinds=_.map(res.biz_body || [],b=>{
                return {
                    label:b.name,
                    value:b.code,
                    children:b.children?_.map(b.children || [],c=>{
                        return {label:c.name,value:c.code}
                    }):b.children
                };
            });
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