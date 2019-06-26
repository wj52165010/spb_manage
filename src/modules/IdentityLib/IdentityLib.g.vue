<!--身份库页面插件 -->
<template>
    <div class="IndentityLib">
      <Tags>
          <!--唯一身份库-->
          <div solt="name">唯一身份库</div>
          <div solt="content"><UniqueIdentity ref='UniqueIdentity' /></div>

          <!--关注人员-->
          <div solt="name">关注人员</div>
          <div solt="content"><AttentPerson ref="AttentPerson" /></div>

          <!--未实名人员-->
          <div solt="name">未实名人员</div>
          <div solt="content"><NoRealName ref='NoRealName' /></div>
      </Tags>
    </div>
</template>

<script>
import Tags from '@/components/Tags'
import UniqueIdentity from './UniqueIdentity'
import AttentPerson from './AttentPerson'
import NoRealName from './NoRealName'

export default {
  name: 'IdentityLib',
  role:'IdentityLib',
  refresh:true,
  components:{Tags,UniqueIdentity,NoRealName,AttentPerson},
  data(){
    return {
      
    }
  },
  methods: {
    // refresh(){
    //   this.$refs.UniqueIdentity && this.$refs.UniqueIdentity.refresh();
    //   //this.$refs.AttentPerson && this.$refs.AttentPerson.refresh();
    //   this.$refs.NoRealName && this.$refs.NoRealName.refresh();
    // }
  }
}
</script>

<style lang="less" scoped>
.IndentityLib{width:100%;height:100%;box-sizing: border-box;}
</style>