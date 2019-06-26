<!-- 分页组件 -->
<template>
    <div class="Paging">
        <div name="page_container" class="page_container">
            <div style="float:left;margin-top: 14px;"><slot name="pre"></slot></div>
            <span style="float:left;margin-top:16px;margin-left:15px;font-size:12px;">
                当前页号&nbsp;&nbsp;&nbsp;:<span style="margin-left:8px;">{{pageIndex+1}}
                </span><span v-if="!blnNoPageSize">/{{pageSize}},每页{{pageNum}}条,共{{pageCount}}条</span>
            </span>
            <slot name="after"></slot>
            <div class="firstPage subBgColtwoBorder  hoverSubBgColtwoBg pageItem"  v-if="pageIndex!=0 || blnNoPageSize" @click="pageChange(0)"><div>首页</div></div>
            <div class="prePage subBgColtwoBorder  hoverSubBgColtwoBg pageItem"    v-if="pageIndex>0 || blnNoPageSize" @click="pageChange(pageIndex-1)"><div>上一页</div></div>
            <div class="nextPage subBgColtwoBorder  hoverSubBgColtwoBg pageItem"   v-if="pageIndex<pageSize-1 || blnNoPageSize" @click="pageChange(pageIndex+1)"><div>下一页</div></div>
            <div class="nextPage subBgColtwoBorder  hoverSubBgColtwoBg pageItem"   v-if="pageIndex!=pageSize-1 && !blnNoPageSize && pageSize!=0" @click="pageChange(pageSize-1)"><div>最后页</div></div>              
        </div>
    </div>
</template>

<script>
export default {
  name: 'Paging',
  props:['blnExport','pageIndex','pageSize','pageNum','pageCount','blnExporting','param','blnNoPageSize'],
  data () {
    return {
      
    }
  },
  methods:{
    //导出数据
    exportData(){
        this.$emit('export');
    },
    pageChange(index){
        index=index<0?0:index;
        this.$emit('change',index,this.param)
    }
  }
}
</script>

<style scoped lang="less">
//分页控件样式 
.page_container{height:40px;width:100%;text-align:right;background:transparent;padding-right:15px;box-sizing: border-box;}
.page_container .el-pagination{margin-top:3px;margin-right:55px;}
// 分页上一页按钮/下一页按钮样式
.firstPage,
.prePage,
.nextPage{
    display: inline-block;
    border: 1px solid;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 0px;
    margin-right:0px;
    margin-top:5px;
    cursor:pointer;
    .trans(.2s);
    color:white;
    transform: skewX(-45deg);
    border-right:0px;
}
.firstPage > div,
.prePage > div,
.nextPage > div{
    transform: skewX(45deg);
}
.nextPage:last-child{border-right:1px solid;}
.pageItem:last-child{border-right:1px solid;}
</style>
