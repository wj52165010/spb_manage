<!-- 关注人员主页面插件 -->
<template>
    <div class="AttentPerson">
        <!--关注信息(右边)-->
        <div class="AttentInfo subBgColtwoBorder"><PersonList refs="PersonList" :tagId="tagVal" :blnNotDefine="blnNotDefine" /></div>

        <!--人员标签(左边)-->
        <div class="PersonLabel subBgColtwoBorder">
            <PersonLabelList refs="PersonLabelList" @tagChange="tagChange" />
        </div>
    </div>
</template>

<script>
import PersonLabelList from './LayoutPage/PersonLabelList'
import PersonList from './LayoutPage/PersonList'



export default {
  name: 'AttentPerson',
  components:{PersonLabelList,PersonList},
  data(){
    return {
      tagVal:'',
      blnNotDefine:''
    }
  },
  methods:{
    refresh(){
      this.tagVal='';
    },
    layout(){
        this.$refs.PersonLabelList && this.$refs.PersonLabelList.layout();
        this.$refs.PersonList && this.$refs.PersonList.layout();
    },
    // refresh(){
    //   //this.$refs.PersonLabelList && this.$refs.PersonLabelList.refresh();
    //   //this.$refs.PersonList && this.$refs.PersonList.refresh();
    // },
    tagChange(v,blnNotDefine){this.tagVal=v;this.blnNotDefine=blnNotDefine;}
  }
}
</script>

<style lang="less" scoped>
.AttentPerson{width:100%;height:100%;box-sizing:border-box;}

@PersonLabelW:200px;
.AttentPerson .PersonLabel{height:100%;width:@PersonLabelW;border:1px solid;box-sizing: border-box;}
.AttentPerson .AttentInfo{
    height:100%;border:1px solid;box-sizing: border-box;float:right;
    width:~'calc(100% - @{PersonLabelW} - 15px)';
}
</style>