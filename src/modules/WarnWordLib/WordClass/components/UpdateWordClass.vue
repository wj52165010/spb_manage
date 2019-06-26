<!-- 修改关键词页面插件 -->
<template>
    <div class="UpdateWordClass">
        <div  style="margin:0px;height:calc(100% - 44px);">

            <div class="title_container">
                <span>词类:</span><span style="float:right;"><span style="color:red;">*</span>多个词用“,”分隔</span>
            </div>

            <div class="input_container">
                <textarea v-model="wordKind" />
            </div>

        </div>
        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="submit()" :disabled="disabled" style="margin-right:5px;">确定</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
    </div>
</template>

<script>
export default {
  name: 'UpdateWordClass',
  props:['data'],
  components:{},
  data(){
    return {
       wordKind:'',
    }
  },
  computed:{
    disabled(){
      return !this.wordKind;
    },
  },
  mounted(){
    if(this.data){
      this.wordKind=this.data.typeName;
    }
  },
  methods:{
    submit(){

      if(this.data){//修改
        ser.UpdateWarnWordKind(this.data.typeId,{
          "typeName": this.wordKind
        }).then(res=>{
          if(!_t.msg(res,'修改成功!')) return;
          this.$emit('update',{
            "typeName": this.wordKind
          });
        });

      }else{//新增
        ser.AddWarnWordKind({
          "typeName": this.wordKind
        }).then(res=>{
          if(!_t.msg(res,'新增成功!')) return;

          this.$emit('renew');
        });

      }
    },
    cancel(){this.$emit('cancel');}
  }
}
</script>

<style lang="less" scoped>
.UpdateWordClass{width:100%;height:100%;box-sizing:border-box;text-align:left;box-sizing:border-box;}
.UpdateWordClass .input_container textarea {width:100%;height:150px;outline: none;box-sizing:border-box;padding:10px;margin:10px 0px;resize: none;}
</style>