<!-- 普通按钮 -->
<template>
    <div class="RawButton" :class="{'mousedown':blnMouseDown}"
        v-on="$listeners" 
        :style="{'background-color':disabled?
                                    'gray':blnEnter?
                                           color[type].hoverCol:color[type].bgCol,
                  'cursor':disabled?'not-allowed':'pointer'}"
        v-lock:click="(e)=>click(e)"
        @mouseenter="blnEnter=true" 
        @mouseleave="blnEnter=false;blnMouseDown=false;"
        @mousedown="disabled?'':blnMouseDown=true"
        @mouseup="blnMouseDown=false"
      >
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'RawButton',
  props:['type','disabled'],
  data(){
    return {
      blnEnter:false,
      blnMouseDown:false,
      color:{
      'cancel':{bgCol:'#223a64',hoverCol:'#3a4f6f'},
      'submit':{bgCol:'#1777db',hoverCol:'rgba(23, 119, 219, 0.8)'}
      }
    }
  },
  methods:{
    click(e){
      if (e.stopPropagation){
        e.stopPropagation(); 
      }else{
        e.cancelBubble=true;
      }
      if(this.disabled) return;
      this.$emit('inClick',e);
    }
  }
}
</script>

<style lang="less" scoped>
  .RawButton{
    padding:7px 12px;font-size:12px;
    color:white;display:inline-block;
    border-radius:5px;
    cursor:pointer;
    .trans(.2s);
  }

  .RawButton.mousedown{
    -webkit-transform:scale(0.9) ; 
    -moz-transform:scale(0.9); 
    -o-transform:scale(0.9);
    .trans(.1s);
  }
</style>