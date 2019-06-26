<!-- 列表自适应布局 -->
<template>
    <div class="ListAutoLayout">
        <!--查询条件容器-->
        <div class="conditionContainer" :id="id">
            <slot name="header"></slot>
            <div class="clearfix"></div>
        </div>
        <!--列表显示内容容器-->
        <div class="listContainer" :style="{height:`calc(100% - ${searchHeight}px - ${footerHeight}px)`}">
            <slot></slot>
        </div>
        <!--分页条件件容器-->
        <div :id="footerId" class="footer">
            <slot name="footer"></slot>
            <div class="clearfix"></div>
        </div>

    </div>
</template>

<script>
export default {
  name: 'ListAutoLayout',
  components:{},
  data(){
    return {
       id:'Layout'+_t.guid(),
       footerId:'footer'+_t.guid(),
       searchDom:null,
       searchHeight:0,
       footerDom:null,
       footerHeight:0,
    }
  },
  mounted(){
    this.searchDom=$(`#${this.id}`);
    this.footerDom=$(`#${this.footerId}`);
    setTimeout(()=>{
      this.searchHeight=this.getSearchH();
      this.footerHeight=this.getfooterH();
    },300)
    
  },
  updated(){
    this.searchHeight=this.getSearchH();
    this.footerHeight=this.getfooterH();
  },
  methods:{
    getSearchH(){return this.searchDom.height()+10},
    getfooterH(){return this.footerDom.height()},
    layout(){
      this.ResizeHandler();
    },
    ResizeHandler(){
        this.searchHeight=this.getSearchH();
        this.footerHeight=this.getfooterH();
        this.$nextTick(()=>{
            _.each(this.$children,c=>c.reloadScroll && c.reloadScroll())
        });
    }
  }
}
</script>

<style lang="less" scoped>
.ListAutoLayout{width:100%;height:100%;}
.conditionContainer{padding:5px 15px;box-sizing:border-box;}
.footer{box-sizing:border-box;}
</style>