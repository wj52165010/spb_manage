<!-- 导出按钮插件 -->
<template>
    <div class="ExportBtn">
       <IconBtn v-if="!blnExport" icon="fa fa-upload" @click="epxort()">导出</IconBtn>
       <IconBtn v-if="blnExport" icon="fa fa-spinner fa-pulse">导出</IconBtn>
    </div>
</template>

<script>
import IconBtn from './IconBtn'
export default {
  name: 'ExportBtn',
  props:['FuncName'],
  components:{IconBtn},
  data(){
    return {
        blnExport:false,
    }
  },
  methods:{
    epxort(){
        this.$emit('click');
        if(!this.FuncName) return;
        this.blnExport=true;
        this.FuncName().then(()=>{
          this.blnExport=false;
        })
    }
  }
}
</script>

<style lang="less" scoped>
.ExportBtn{display: inline-block;}
</style>