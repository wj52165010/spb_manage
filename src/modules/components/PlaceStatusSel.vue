<!-- 场所状态下拉框插件 -->
<template>
    <el-select v-bind:value="value" placeholder="全部状态" :clearable="true" @change="change" style="width:100px;">
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
  name: 'PlaceStatusSel',
  props:['value'],
  components:{},
  data(){
    return {

    }
  },
  computed:{
    ...mapState({
      data:state=>state.BaseData.online_state
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