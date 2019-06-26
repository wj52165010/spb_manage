<!-- 问题类型下拉框插件 -->
<template>
    <el-cascader
    v-bind:value="value"
    :options="kinds"
    change-on-select
    ></el-cascader>
</template>

<script>

export default {
  name: 'IssueKindSel',
  props:['value'],
  components:{},
  data(){
    return {
        data:[],
        kinds:[
            {
                value: '1',
                label: '新来预警',
            },
            {
                value: '2',
                label: '离去预警',
            },
            {
                value: '3',
                label: '聚集预警',
            },
            {
                value: '4',
                label: '异常预警',
                children: [{
                    value: 'shejiyuanze',
                    label: '设计原则',
                }],
            },
        ],//预警类型
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