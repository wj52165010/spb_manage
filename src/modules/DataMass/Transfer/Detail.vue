<!-- 传输文件详细页面插件 -->
<template>
    <div class="Detail">
        <Scroll :listen="d">
            <div class="row table_item ">
                <div class="col col-md-2">厂商名称</div>
                <div class="col col-md-10 ellipsis">{{d.firmName}}</div>
            </div>
            <div class="row table_item">
                <div class="col col-md-2  text-center">记录时间</div>
                <div class="col col-md-10 text-center divEllipsis">{{d.receiveTime}}</div>
            </div>
            <div class="row table_item">
                <div class="col col-md-2  text-center">数据类型</div>
                <div class="col col-md-10 text-center divEllipsis">{{d.dataType}}</div>
            </div>
            <div class="row table_item">
                <div class="col col-md-2  text-center">文件名</div>
                <div class="col col-md-10 text-center divEllipsis">{{d.zipName}}</div>
            </div>
            <div class="row table_item">
                <div class="col col-md-2  text-center">记录条数</div>
                <div class="col col-md-10 text-center divEllipsis">{{d.reports}}</div>
            </div>
            <div class="row table_item">
                <div class="col col-md-2  text-center">错误条数</div>
                <div class="col col-md-10 text-center divEllipsis">{{d.invalids}}</div>
            </div>
            <div class="row table_item">
                <div class="col col-md-2  text-center">错误描述</div>
                <div class="col col-md-10 " style="padding-right:20px;word-wrap: break-word;text-align:left;">
                    {{d.message}}
                </div>
            </div>
        </Scroll>
    </div>
</template>

<script>
import Scroll from '@/components/Scroll'
export default {
  name: 'Detail',
  props:['d'],
  components:{Scroll},
  data(){
    return {
       
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
@borCol:gainsboro;
.Detail{width:100%;height:100%;box-sizing:border-box;text-align:center;}
.table_item{.border('bottom',@borCol);line-height:30px;}
.table_item .col:nth-child(2){.border('left',@borCol);}
</style>