/* eslint-disable */
<!-- 列表行插件 -->
<!--<template>
    <div class="table-row">
       <slot></slot>
    </div>
</template>-->
<script>
export default {
  name: 'v-table-row',
  props:['columns','store','headerstyle'],
  data () {
    return {
      wDragStart:0,
      curDragHeaderW:null,//当前拖动列头宽度元素
      curDragHeader:null,//当前改变宽度大小的元素
      curDragHeaderIndex:-1,//当前改变宽度元素数据索引
    }
  },
  mounted(){
 
  },
  render(h){
    let blnTmp=false;//行内子集是否为模板数据 
    let columns=_.filter(this.cols || [],c=>{
      return (c.data.directives && _.find(c.data.directives,d=>d.name=='show') && _.find(c.data.directives,d=>d.name=='show').value) ||
              (c.data.directives && !_.find(c.data.directives,d=>d.name=='show'))  ||
              !c.data.directives  
    });

    
    let colContent=_.filter(this.columns || [],c=>{
      return (c.data.directives && _.find(c.data.directives,d=>d.name=='show') && _.find(c.data.directives,d=>d.name=='show').value) ||
              (c.data.directives && !_.find(c.data.directives,d=>d.name=='show'))  ||
              !c.data.directives  
    });


    //每行的子集合
    blnTmp =!(_.filter(this.$slots.default,d=>d.tag && d.tag.indexOf('v-table-column')>=0).length>0 || this.columns);

    let slots=_.filter(this.$slots.default,d=>d.tag && d.tag.indexOf('v-table-column')>=0);
        slots =_.filter(slots || [],c=>{
          return (c.data.directives && _.find(c.data.directives,d=>d.name=='show') && _.find(c.data.directives,d=>d.name=='show').value) ||
                (c.data.directives && !_.find(c.data.directives,d=>d.name=='show'))  ||
                !c.data.directives  
        });

    let fixWTotal=_.reduce(columns,(memo,d)=>{return memo+ (d.data.attrs || {width:0}).width},0);
    let autoCols=_.filter(columns,d=>!(d.data.attrs || {width:0}).width).length;
     
     return h('div',
        {
          class:{
            'table-row':!blnTmp,
            'table-row-tmp':blnTmp,
            'clearfix':true,
          },
          on:{
            //mousemove:colContent.length?this.mousemove:function(){},
            //mouseup:colContent.length?this.header_mouseup:function(){},
            click:this.rowClick
          },
          style:Object.assign({},this.headerstyle)
        },
        !blnTmp?columns.map((column,index)=>{
                 
           let {width,title} =  columns[index].data.attrs || {};
           let curWidth=0;

           if(autoCols){//包含自适应列

            curWidth=width?width+'px':`calc(${100/autoCols}% - ${fixWTotal/autoCols}px)`; 
  
           }else{//所有列都是固定宽度则设置为百分比

            curWidth=width/fixWTotal*100 + '%';
           
           }
           
           if(colContent[index] || slots[index]){
             (colContent[index] || slots[index]).componentOptions.propsData={column:column}
           }

            
           return h('div',{
              'class':{'table-row-item':true},
              'style':{'width':curWidth,'border-right':this.blnBase?'none':false},
              'attrs':{'title':title,'data-index':index},
              'on':{
                mousemove:colContent.length?this.header_mousemove:function(){},
                mousedown:colContent.length?this.header_mousedown:function(){},
              }
            },
            [
              colContent[index] || slots[index] || ''
            ]);
        }):
        this.$slots.default
    );
  },
  computed:{
    cols(){return this.store.states.columns;},
    blnBase(){return this.store.states.base;}
  },
  methods:{
    //判断鼠标是否进入的可拖动表头宽度的位置
    header_mousemove(e){
      let dom =$(e.target || e.srcElement),dragNum=5;//可拖拽的区间
      if(!dom.attr('class') || (dom.attr('class') && dom.attr('class').indexOf('table-column')<0)) return;
      let w=dom.width(),clientX=e.clientX,left=dom.offset().left;
      if(clientX>w+left || clientX<w+left-dragNum ){ dom[0].style.cursor='pointer'; return} 
      dom[0].style.cursor='e-resize';

    },
    //拖动列头改变列头宽度
    header_mousedown(e){
        e.stopPropagation(); 
        let dom =$(e.target || e.srcElement);
        if(dom[0].style.cursor!='e-resize')return;
        this.blnlazy=false;
        this.blnDragColW=true;
        let parentDom=$(this.$el);
        let appendDom = $('<div></div>');
        appendDom.addClass('dragHeaderW');
        appendDom.css({'position':'absolute',
                      top:'0px',
                      bottom:'0px',
                      left:(e.clientX-parentDom.offset().left)+'px',
                      'background-color':'rgba(47,51,65,0.6)',
                      'width':'3px',
                      'z-index':100
                      });
          appendDom.appendTo(parentDom);
          this.wDragStart=e.clientX;
          this.curDragHeaderW=appendDom;
          this.curDragHeader=dom;

          return false;
    },
    //拖动列宽时响应事件
    mousemove(e){
      let parentDom=$(this.$el);
      //列头宽度拖动处理
      if(this.blnDragColW && this.curDragHeaderW && this.curDragHeader){
          let domSet=this.curDragHeader.offset();
          let move=e.clientX-parentDom.offset().left;
          let limit=domSet.left-parentDom.offset().left+20;

          this.curDragHeaderW.css({
              left:(move>limit?move:limit) +'px'
          });
          return  true;
      }

    },
    //拖动放开
    header_mouseup(){
      this.blnDragColW=false;
      if(!this.curDragHeaderW)return;
      let width=this.curDragHeaderW.offset().left-this.curDragHeader.offset().left;
      let instances= width-this.curDragHeader.width(); //拖动距离
      let colIndex=parseInt(this.curDragHeader.parents('.table-row-item').attr('data-index'));

      let cols=_.filter(this.cols || [],c=>{
                return (c.data.directives && _.find(c.data.directives,d=>d.name=='show') && _.find(c.data.directives,d=>d.name=='show').value) ||
                        (c.data.directives && !_.find(c.data.directives,d=>d.name=='show'))  ||
                        !c.data.directives  
              });  

      if(cols[colIndex+1]){
        let relatievDom = $(this.$el).find(`div[class="table-row-item"][data-index="${colIndex+1}"]`);
        let relativeW=relatievDom.width();
        cols[colIndex+1].data.attrs.width=(relativeW-instances)>20?relativeW-instances:20;

        if(cols[colIndex])cols[colIndex].data.attrs.width=(relativeW-instances)>20?width:this.curDragHeaderW.width()+relativeW-20;

      }else{
        let relatievDom = $(this.$el).find(`div[class="table-row-item"][data-index="${colIndex-1}"]`);
        let relativeW=relatievDom.width();
        cols[colIndex-1].data.attrs.width=(relativeW-instances)>20?relativeW-instances:20;

        if(cols[colIndex])cols[colIndex].data.attrs.width=(relativeW-instances)>20?width:this.curDragHeaderW.width()+relativeW-20;

      }

      this.curDragHeaderW.remove();
      this.curDragHeaderW=null;
      this.curDragHeader=null;

      this.store.states.columns=[...cols];
    },
    //行单击事件
    rowClick(e){
      this.$emit('click',e);
    }
  }
}
</script>
<style scoped lang="less">
  @import './common.less';
  .table-row{height:@tableHeaderH;line-height:@tableHeaderH;}
  .table-row-item{float:left;height:100%;overflow:hidden;box-sizing: border-box;}
  //.table-row-item:first-child{.border('right');}
  .table-row-item:last-child{}
  //.table-row-item:not(:first-child):not(:last-child){.border('right');}
</style>
