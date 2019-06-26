<!-- 头部页面插件 -->
<template>
    <div class="ExportKeyword">
        <div  style="margin:0px;height:calc(100% - 44px);">

            <div>
                <span>词类 : </span><WordKindSel v-model="wordKind" :clearable="false" :defIndex="0" />
            </div>
            <div style="height:calc(100% - 32px)">
                <BatchImport  type="keyword" v-on="$listeners" :extra="{'keywordType':wordKind}" :blnDisabelUpload="!!!wordKind" :path="true" />
            </div>
        </div>
        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="submit()" style="margin-right:5px;">确定</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
    </div>
</template>

<script>
import WordKindSel from '../../components/WordKindSel'
import BatchImport from '@/components/BatchImport'
export default {
  name: 'ExportKeyword',
  components:{WordKindSel,BatchImport},
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
.ExportKeyword{width:100%;height:100%;box-sizing:border-box;}
</style>