<!-- 人员添加页面插件 -->
<template>
    <div class="PersonAdd">
        <div  style="margin:0px;height:calc(100% - 44px);" >
            <Tags @change="tagChange">
                <!--添加-->
                <div solt="name">添加</div>
                <div solt="content"><AddPerson ref="AddPerson" v-on="$listeners" @blnAdd="blnAdd" /></div>

                <!--批量导入-->
                <div solt="name">批量导入</div>
                <div solt="content"><BatchImport ref="BatchImport" type="focuspeople" v-on="$listeners" /></div>
            </Tags>

        </div>
        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit" v-if="curPage=='0'"  @inClick="submit()" :disabled="blnDisabled" style="margin-right:5px;">{{curPage=='0'?'确定':'添加'}}</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
    </div>
</template>

<script>
import Tags from '@/components/Tags'
import AddPerson from './AddPerson'
import BatchImport from '@/components/BatchImport'

export default {
  name: 'PersonAdd',
  components:{Tags,AddPerson,BatchImport},
  data(){
    return {
      curPage:'0',
      blnDisabled:true,
    }
  },
  methods:{
    submit(){
      if(this.curPage=='0'){//添加
        this.$refs.AddPerson.AddPerson();
      }else{//导入

      }
      
    },
    cancel(){this.$emit('cancel');},
    tagChange(i){
      this.curPage=i;
    },
    layout(){
        this.$refs.AddPerson && this.$refs.AddPerson.layout();
        this.$refs.BatchImport && this.$refs.BatchImport.layout();
    },
    blnAdd(v){
      this.blnDisabled=v;
    }
  }
}
</script>

<style lang="less" scoped>
.PersonAdd{width:100%;height:100%;box-sizing:border-box;text-align:left;padding:10px;}
</style>