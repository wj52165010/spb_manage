<!-- 营业状态下拉框插件 -->
<template>
    <el-select v-bind:value="value" placeholder="全部类型" :clearable="true" @change="change" style="width:180px;">
        <el-option
            v-for="(val,key) in data"
            :key="val"
            :label="key"
            :value="val">
        </el-option>
    </el-select>
</template>

<script>
import { mapState} from 'vuex'
export default {
  name: 'EquipmentKindSel',
  props:['value'],
  components:{},
  data(){
    return {

    }
  },
  computed:{
    ...mapState({
      data:state=>state.BaseData.equipment_type
    })
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