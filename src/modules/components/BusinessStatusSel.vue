<!-- 营业状态下拉框插件 -->
<template>
    <el-select v-bind:value="value" placeholder="全部状态" :clearable="true" @change="change" style="width:150px;">
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
  name: 'BusinessStatusSel',
  props:['value'],
  components:{},
  data(){
    return {

    }
  },
  computed:{
    ...mapState({
      data:state=>state.BaseData.business_state
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