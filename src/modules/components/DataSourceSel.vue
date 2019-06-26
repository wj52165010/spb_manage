<!-- 数据来源下拉框插件 -->
<template>
    <el-select v-model="oriVal" placeholder="请选择" :clearable="true" @change="change"
        :multiple="!simple"
        :collapse-tags="!simple" 
        >
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
  name: 'DataSourceSel',
  props:['value','extra','simple'],
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
      data:state=>state.BaseData.microprobe_type
    })
  },
  methods:{
    change(v){
      this.$emit('input',v==null?'':this.simple?v:v.join(','));
      this.$emit('change',this.extra);
    }
  }
}
</script>

<style lang="less" scoped>

</style>