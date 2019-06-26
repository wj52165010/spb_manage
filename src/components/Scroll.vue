<!-- 滚动条插件组件 -->
<template>
    <div class="Scroll" :id="id">
        <div class="scroll_container">
            <div class="slidee">
                <slot></slot>
            </div>
        </div>
        <div :id="scrollBarId" name="scrollBar" class="scrollbar" :style="scrollStyle || {}" v-show="blnShowScroll">
            <div :id="handleId" class="handle subBgColtwo"></div>
        </div> 
    </div>
</template>

<script>
import Scroll from 'scroll'

export default {
  name: 'Scroll',
  props:['listen','store','scrollStyle'],
  watch:{
    listen:function(){
       this.$nextTick(()=>{
           if(!this.scrollIns){
             this.scrollDom=$('#'+this.id).find(`div[id="${this.scrollBarId}"]`);
             this.initScroll();
           }
           this.reloadyScroll();
       });
    }
  },
  mounted(){
    this.id="scroll"+_t.guid();
    this.scrollBarId='scrollBar'+_t.guid();
    this.handleId='handle'+_t.guid();
    this.$nextTick(()=>{
        this.scrollDom=$('#'+this.id).find(`div[id="${this.scrollBarId}"]`);
        this.initScroll();
    });
    this.istore =this.$store || this.store;

  },
  data () {
    return {
      id:0,
      scrollBarId:0,
      handleId:0,
      scrollIns:null,
      blnShowScroll:false,
      scrollDom:null,
      istore:null,
      bodyResizeSub:null,
    }
  },
  methods:{
    ResizeHandler(){
      this.reloadyScroll();
    },
    //初始化滚动条
    initScroll(){
     let self=this;
     let id=this.id;
     let scrollBarId=this.scrollBarId;
     
     this.scrollIns = new Scroll($(self.$el).find('.scroll_container'),{
        speed:200,
        scrollBy:50,
        scrollBar:`#${id} #${scrollBarId}`,
        dynamicHandle: 0,
        dragHandle: 1,
        mouseDragging: 0});
      
      setTimeout(()=>{
            this.scrollIns.init();
            this.reloadyScroll();
      },0); 
    },
    //重新计算滚动条高度
    reloadyScroll(){
      if(!this.scrollIns) return;
      this.scrollIns.reload();
      this.blnShowScroll=this.scrollIns.rel.slideeSize-10>this.scrollIns.rel.frameSize;
      this.setScrollH();
      this.scrollIns.reload();
    },
    reloadScroll(){
      this.reloadyScroll();
    },
    //设置滚动条高度
    setScrollH(){
      let scrollContainerH=this.scrollDom.height();
      let gap=(this.scrollIns.rel.slideeSize-this.scrollIns.rel.frameSize)*(this.scrollIns.rel.frameSize/this.scrollIns.rel.slideeSize);

      this.scrollDom.find(`div[id="${this.handleId}"]`).css('height',(scrollContainerH-gap)<20?20:(scrollContainerH-gap)+'px');
    }
  }
}
</script>

<style scoped lang="less">
    .Scroll{width:100%;height:100%;position:relative;}
    .Scroll .scroll_container{width:100%;height:100%;position: relative;}
    .Scroll .scrollbar:hover {cursor:pointer;}
    .Scroll .scrollbar { z-index:100;border-radius:5px;width:1px; height: ~"calc(100% - 20px)"; position: absolute;right: 5px;top:10px;background:white;}
    .Scroll .scrollbar .handle {width: 10px;margin-left:-4px;height: 100px;}

</style>
