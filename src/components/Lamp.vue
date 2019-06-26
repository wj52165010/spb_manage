<!-- 走马灯插件 -->
<template>
    <div class="Lamp" :id="cId" @mouseover="mouseover" @mouseout="mouseout">
        <div :id="id" class="Lamp_container" :style="{left:`${left}px`}">
            <slot></slot>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
export default {
  name: 'Lamp',
  props:['blnEnter'],
  components:{},
  data(){
    return {
        cId:'CLamp'+ _t.guid(),
        id:'Lamp'+_t.guid(),
        rootDom:null,
        containDom:null,
        timeHandler:null,
        left:0,
        rootWidth:0,
        width:0,
        blnStop:false,
    }
  },
  mounted(){
    this.rootDom=$(`#${this.cId}`);
    this.containDom=$(`#${this.id}`);
    this.blnStop=this.blnEnter;
    this.reCalculate();
    this.$nextTick(()=>{
        this.init();
    });
  },
  updated(){
    this.reCalculate();
  },
  methods:{
    reCalculate(){
        this.rootWidth=this.rootDom.width();
        this.width = this.containDom.width();

        this.$nextTick(this.stautsChange);
    },
    stautsChange(){
        if(this.rootWidth>=this.width && (this.rootWidth!=0 && this.width!=0)){
            this.left=0;
            this.destroy();
        }else{
            this.init();
        }
    },
    ResizeHandler(){
        this.reCalculate();
    },
    destroy(){
        if(!this.timeHandler) return;
        clearInterval(this.timeHandler);
    },
    init(){
        if(this.rootWidth>=this.width || this.timeHandler) return;
        this.timeHandler=setInterval(()=>{
            if(!this.blnStop){
                this.left--;
                if((this.width+this.left)<=0){
                    this.left=this.rootWidth;
                }
            }

        }, 1000/60);
    },
    mouseover(){
       this.blnStop=!this.blnEnter;
    },
    mouseout(){
        this.blnStop=this.blnEnter;
        if(this.blnEnter){this.left=0;}
    }
  }
}
</script>

<style lang="less" scoped>
@lineH:25px;
.Lamp{width:100%;box-sizing:border-box;overflow:hidden;text-align:left;position: relative;height:@lineH;line-height:@lineH;cursor:pointer;}
.Lamp .Lamp_container{white-space:nowrap;padding:0px;position:absolute;}
</style>