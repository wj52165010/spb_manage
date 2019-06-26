<!-- 批量设置标签插件 -->
<template>
    <div class="BatchSetLabel">
        <div  style="margin:0px;height:calc(100% - 44px);" >
            <AddLabel style="margin:auto;" ref="AddLabel" />
        </div>
        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="submit()" style="margin-right:5px;">确定</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
        
    </div>
</template>

<script>

import AddLabel from '../../PersonLabelList/components/AddLabel'
export default {
  name: 'BatchSetLabel',
  props:['ids'],
  components:{AddLabel},
  data(){
    return {
        
    }
  },
  methods:{
    submit(){
      let tagIds=this.$refs.AddLabel.value;
      let resData=_.map(this.ids,i=>{
        return {
          "focusId": i,
          "tagIds": '|'+tagIds.join('|')+'|'
        }
      });

      ser.BatchTags(resData).then(res=>{
        if(!_t.msg(res,'设置成功!')) return;

        this.cancel();
      });
    },
    cancel(){this.$emit('cancel');}
  }
}
</script>

<style lang="less" scoped>
.BatchSetLabel{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>