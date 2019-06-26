<!-- 人员详细页面插件 -->
<template>
    <div class="PersonDetail">
        <div  style="margin:0px;height:calc(100% - 44px);" >
            <Tags @change="TagChange">
                <!--人员档案-->
                <div solt="name">人员档案</div>
                <div solt="content"><PersonRecord ref="PersonRecord" :id="id" @validChange="personValidChange" /></div>

                <!--预警设置-->
                <div solt="name">预警设置</div>
                <div solt="content"><WarnSet ref="WarnSet" :id="id" @validChange="warnSetValidChange" /></div>
            </Tags>

        </div>
        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="submit()" :disabled="!blnSubmit" style="margin-right:5px;">确定</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
    </div>
</template>

<script>
import Tags from '@/components/Tags'
import PersonRecord from './PersonRecord'
import WarnSet from './WarnSet'

export default {
  name: 'PersonDetail',
  props:['id'],
  components:{Tags,PersonRecord,WarnSet},
  data(){
    return {
      curPage:'0',
      blnSubmit:true,
    }
  },
  watch:{
    curPage(){
      this.blnSubmit = this.curPage=='0'?this.$refs.PersonRecord.blnSubmit:
                       this.$refs.WarnSet.blnSubmit;
    }
  },
  methods:{
    submit(){
      if(this.curPage=='0'){//人员档案
        this.$refs.PersonRecord.submit(()=>{this.cancel(true);})
      }else{//预警设置
        this.$refs.WarnSet.submit(()=>{this.cancel();});
      }
    },
    cancel(flag){
      this.$emit('cancel',flag);
    },
    layout(){
        this.$refs.PersonRecord && this.$refs.PersonRecord.layout();
        this.$refs.WarnSet && this.$refs.WarnSet.layout();
    },
    TagChange(i){
      this.curPage=i;
    },
    personValidChange(v){this.blnSubmit=v;},
    warnSetValidChange(v){this.blnSubmit=v;}
  }
}
</script>

<style lang="less" scoped>
.PersonDetail{width:100%;height:100%;box-sizing:border-box;text-align:left;padding:10px;}
</style>