<!-- 身份数据主页页面组件 -->
<template>
    <div class="Access_Identity">
      <!--图表页面-->
      <Graph ref="Graph" @pageChange="pageChange" v-show="showPage==0" />

      <!--列表页面-->
      <List ref="List" :detailId="detailId" :type="type" @pageChange="pageChange" v-show="showPage==1" @TaskAdd="TaskAdd" />
    </div>
</template>

<script>
/* eslint-disable */
import Graph from './Graph'
import List from  './List'
export default {
  name: 'Identity',
  props:['detailId','type'],
  components:{Graph,List},
  data () {
    return {
      showPage:0,//0:图表页面,1:列表页面
    }
  },
  watch:{
    showPage(){this.$nextTick(()=>{this.layout();this.$emit('PageChange',this.showPage);})}
  },
  methods:{
    layout(){
      this.$refs.Graph.layout();
      this.$refs.List.layout();
    },
    refreshPage(){

    },
    pageChange(i){
      this.showPage=i;
    },
    TaskAdd(){this.$emit('TaskAdd');}
  }
}
</script>

<style scoped lang="less">
.Access_Identity{width:100%;height:100%;position:relative;}
</style>
