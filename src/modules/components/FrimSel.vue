<!-- 厂商名称下拉框插件 -->
<template>
    <el-select v-model="oriVal" placeholder="全部厂商" :clearable="true" @change="change"
          :multiple="!simple"
          :collapse-tags="!simple" 
          style="width:240px;">
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
  name: 'FrimSel',
  props:['value','simple'],
  components:{},
  data(){
    return {
      oriVal:''
    }
  },
  watch:{
    value(){
      if(this.simple){
        this.oriVal=this.value || '';
      }else{
        this.oriVal=_.compact((this.value || '').split(','));
      }
    }
  },
  mounted(){
    if(this.simple){
      this.oriVal=this.value || '';
    }else{
      this.oriVal=_.compact((this.value || '').split(','));
    }
  },
  computed:{
    ...mapState({
      data:state=>state.BaseData.Firms
    })
  },
  methods:{
    change(v){
      this.$emit('input',v==null?'':this.simple?v:v.join(','));
    }
  }
}
</script>

<style lang="less" scoped>

</style>