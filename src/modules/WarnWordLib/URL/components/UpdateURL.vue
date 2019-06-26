<!-- 修改关键词页面插件 -->
<template>
    <div class="UpdateURL">
        <div  style="margin:0px;height:calc(100% - 44px);">

            <div class="title_container">
                <span>URL:<span v-if="url.indexOf('，')>=0" style="color:red;font-size:12px;">(包含全角逗号字符)</span></span><span style="float:right;"><span style="color:red;">*</span>多个词用“,”分隔</span>
            </div>

            <div class="input_container">
                <textarea v-model="url" />
            </div>
            
            <span>词类 : </span><WordKindSel ref="WordKindSel" v-model="wordKind" />

        </div>
        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="submit()" :disabled="disabled" style="margin-right:5px;">确定</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
    </div>
</template>

<script>
import WordKindSel from '../../components/WordKindSel'
export default {
  name: 'UpdateURL',
  props:['data'],
  components:{WordKindSel},
  data(){
    return {
      url:'',
      wordKind:'',
    }
  },
  computed:{
    disabled(){
      return !this.url || 
             !this.wordKind ||
             (this.url && this.url.indexOf('，')>=0);
    },
  },
  mounted(){
    if(this.data){
      this.url=this.data.urlPrefix || '';
      this.wordKind=this.data.wordType;
    }
  },
  methods:{
    submit(){

      if(this.data){//修改

        ser.UpdateWarnWordUrl(this.data.id,{
          "urlPrefix":this.url,
          "wordType": this.wordKind
        }).then(res=>{
          if(!_t.msg(res,'修改成功!')) return;
          this.$emit('update',{
            "urlPrefix":this.url,
            "wordType": this.wordKind,
            "wordTypeString":(_.find(this.$refs.WordKindSel.wordKinds,w=>w.typeId==this.wordKind) || {typeName:''}).typeName
          });
        });

      }else{//新增
        ser.AddWarnWordUrl({
          "urlPrefix":this.url,
          "wordType": this.wordKind
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
.UpdateURL{width:100%;height:100%;box-sizing:border-box;text-align:left;box-sizing:border-box;}
.UpdateURL .input_container textarea {width:100%;height:150px;outline: none;box-sizing:border-box;padding:10px;margin:10px 0px;resize: none;}
</style>