<!-- 头部页面插件 -->
<template>
    <div class="ExportWordClass">
        <div  style="margin:0px;height:calc(100% - 44px);">

            <div style="height:calc(100% - 32px)">
                <BatchImport type="wordKind" v-on="$listeners" />
            </div>
        </div>
        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="submit()" style="margin-right:5px;">确定</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
    </div>
</template>

<script>
import BatchImport from '@/components/BatchImport'
export default {
  name: 'ExportWordClass',
  components:{BatchImport},
  data(){
    return {
       wordKind:''
    }
  },
  methods:{
    cancel(){this.$emit('cancel')}
  }
}
</script>

<style lang="less" scoped>
.ExportWordClass{width:100%;height:100%;box-sizing:border-box;}
</style>