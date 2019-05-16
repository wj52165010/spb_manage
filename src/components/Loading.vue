<!-- 导航组件 -->
<template>
    <div  v-show="show" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
        <div style="display:table;width: 100%;height: 100%;">
            <div style="display: table-cell;vertical-align: middle;text-align: center;">
                <div class="content zoomIn">
                   正在加载中...
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      show:true,
    }
  },
  methods:{
    blnShow(b){
      this.show=b;
    }
  }
}
</script>
<style scoped lang="less">
  .content{
    width:200px;height:50px;
    margin:auto;border-radius:5px;
    position:relative;overflow:hidden;
    font-size:12px;color:white;
    line-height:50px;
  }
  .content:before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:linear-gradient(45deg,transparent 5%,red 0%,rgba(33,39,63,0.8)),
               linear-gradient(135deg,rgba(33,39,63,0.8) 5%,transparent) ; //rgba(33,39,63,0.8);
    z-index: -1;
  }
</style>
