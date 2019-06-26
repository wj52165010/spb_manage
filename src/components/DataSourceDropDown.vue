<!--数据来源下拉框组件-->
<template>
    <div class="DataSourceDropDown">
        <el-select v-if="blnSimple" v-model="curValue" placeholder="请选择数据来源" :collapse-tags="true" :clearable="true">
            <el-option v-for="(val,key) in data" :key="key" :label="key" :value="val"></el-option>
        </el-select>

        <MulDropDwon v-if="!blnSimple" :data="value" keyProp="name" id="value" placeholder="请选择数据来源">
            <div v-for="(val,key) in data" :key="key" @mousedown="ItemClick(val)" class="item">
                {{key}} 
                <i v-if="IsHasSelItem(val)" class="fa fa-check" style="float:right;margin-top: 10px;"></i>
            </div>
        </MulDropDwon>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import MulDropDwon from '@/components/MulDropDown'
export default {
  props:['value','blnSimple'],
  components:{MulDropDwon},
  name: 'DataSourceDropDown',
  data () {
    return {
      curValue:'',
    }
  },
  computed:{
    ...mapState({
      data:state=>state.BaseData.microprobe_type
    })
  },
  watch:{
    curValue(){
        this.$emit('input',this.curValue);
    }
  },
  methods:{
    ItemClick(t){
        let index =_.findIndex(this.value,d=>d==t),cloneVal=_t.Clone(this.value);
        if(index>=0){cloneVal.splice(index,1);this.$emit('input',cloneVal);return;}
        cloneVal.push(t);
        this.$emit('input',cloneVal);
    },
    IsHasSelItem(code){
        if(this.blnSimple){return this.value==code;}
        return _.find(this.value,d=>d==code);
    },
  }
}
</script>
<style scoped lang="less">
  .DataSourceDropDown{width:100%;height:34px;line-height:34px;}
  .DataSourceDropDown .item{text-align:left;}
</style>
