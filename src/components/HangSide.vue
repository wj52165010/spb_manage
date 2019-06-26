<!-- 挂边页面插件(从侧边出现) -->
<template>
    <div class="HangSide subBgColtwoBorder bgColLine"
         :class="{expan:blnExpan}" 
         :id="id" 
         :style="cDire[curDir]"

        >
        <div class="HangContain" :class="{expan:blnExpan}">
            <slot></slot>

            <!--关闭按钮-->
            <div class="closeBtnContain subBgColtwo hoverSubBgColtwoBg" @click="blnExpan=false;">
                <div class="closeBtn">
                    <i class="fa fa-remove" />
                </div>
            </div>
            <!--展开按钮-->
            <div class="option_bar bgColLine hoverSubBgColtwoBg" @click="blnExpan=true" v-if="!blnExpan">
                <i class="fa fa-arrow-right"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'HangSide',
  components:{},
  data(){
    return {
        id:'HangSide'+_t.guid(),
        dom:null,
        dir:{
            Left:{top:'10px',left:'0px',bottom:'10px','border-top-right-radius':'5px','border-bottom-right-radius':'5px'}
        },
        curDir:'Left',
        blnExpan:false,
        width:0,
    }
  },
  computed:{
      cDire(){
        let dir=_t.Clone(this.dir);

        switch(this.curDir){
            case 'Left':
                dir[this.curDir].left=this.blnExpan?'0px':`-${this.width}px`;
                break;
        }
 
        return dir;
      }
  },
  mounted(){
    this.dom=$('#'+this.id);
    this.layout();
  },
  updated(){
    this.layout();
  },
  methods:{
    layout(){
        this.width=this.dom.width() + 10;
    },
    ResizeHandler(){
        this.layout();
    },
    show(){this.blnExpan=true;},
    hide(){this.blnExpan=false;}
  }
}
</script>

<style lang="less" scoped>
.HangSide{
    position:absolute;border:0px solid;z-index:10000;
    -moz-box-shadow:3px 2px 5px #333333; 
    -webkit-box-shadow:3px 2px 5px #333333; 
    box-shadow:3px 2px 5px #333333;
    text-align:left;
    .trans(.3s);
}

@barBtnW:30px;
@barBtnH:60px;
.HangSide .HangContain{width:100%;height:100%;box-sizing:border-box;position:relative;}
.HangSide.expan:hover .HangContain{padding:0px @barBtnW 0px 0px;}

.HangSide .option_bar{
    color:white;width:@barBtnW;height:@barBtnH;text-align:center;
    position:absolute;top:~'calc(50% - @{barBtnH}/2)';right:-@barBtnW - 8px;
    line-height:@barBtnH;border-top-right-radius:5px;border-bottom-right-radius:5px;
    -moz-box-shadow:3px 2px 5px #333333; 
    -webkit-box-shadow:3px 2px 5px #333333; 
    box-shadow:3px 2px 5px #333333;
    cursor:pointer;
}

.HangSide .closeBtnContain{
    color:white;width:@barBtnW;height:100%;text-align:center;
    position:absolute;border-top-right-radius:5px;border-bottom-right-radius:5px;
    top:0px;right:0px;cursor:pointer;display:none;
}

.HangSide.expan:hover .closeBtnContain{display:block;}
.HangSide .closeBtnContain .closeBtn{
    width:@barBtnW;height:@barBtnH;font-size:18px;
    position:absolute;top:~'calc(50% - @{barBtnH}/2)';right:0px;
}
</style>