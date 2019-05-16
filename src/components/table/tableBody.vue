<!-- 列表体插件 -->
<!--<template>
    <div class="tableBbody">
       <slot></slot>
    </div>
</template>-->

<script>
import Vue from 'vue'
import cRow from './tableRow'
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'

export default {
  name: 'v-table-body',
  props:['listen','store','blnLoading','headerstyle','tip'],
  data () {
    return {
      info:'暂无数据'
    }
  },
  watch:{
    listen(){
      this.showInfo();
    },
    blnLoading(){
      this.$refs.loading.blnShow(this.blnLoading);
      if(this.blnLoading){$(this.$refs.info).hide();}
    },
    tip(){
      this.info=this.tip;
    }
  },
  mounted(){
    this.info=this.tip || this.info;
    this.$refs.loading.blnShow(this.blnLoading || false);
    this.showInfo();
  },
  updated(){
    this.showInfo();
  },
  render: function (createElement) {
    let rows=_.filter(this.$slots.default,d=>d.tag);
    return createElement(
      'div', 
      {
        class:{
          tableBbody:true,
        },
        style:Object.assign({},this.headerstyle)
      },
      [
        createElement(Scroll,
          {
            props:{ listen:this.listen || []},
            ref:'scroll'
          },
          _.map(rows,(r,i)=>createElement(cRow,{
              props:{
                store:this.store,
                headerstyle:r.data.style || ''
              },
              on:{
                click:(e)=>{this.rowClick(e,r,i)}
              },
              class:Object.assign({
                rowClick:r.componentOptions && r.componentOptions.listeners && r.componentOptions.listeners.click,
                [r.data.staticClass]:!!r.data.staticClass
              },r.data.class || {})
            },
            rows[i].componentOptions.children)
          )
        ),
        createElement(Loading,{ref:'loading'}),
        createElement('div',{
          ref:'info',
          style:{
            'width':'100%',
            'height':'100%',
            'text-align':'center',
            'display':'table',
            'position':'absolute',
            'top':'0px'
          }
        },[
          createElement('div',{
            style:{
              'display':'table-cell',
              'vertical-align': 'middle'
            }
          },this.info)
        ])
      ]
      
    )
  },
  methods:{
    showInfo(){
      if(this.listen && this.listen.length>0){
        $(this.$refs.info).hide();
      }else{
        $(this.$refs.info).show();
      }
    },
    //行单击事件
    rowClick(e,r,index){
      let listeners =r.componentOptions.listeners;
      listeners && listeners.click && listeners.click(index,(r.data.attrs || {param:''}).param);
    }
  }
  
}
</script>
<style lang="less">
  @import "../../css/variables.less";
  @import './common.less';
  .tableBbody{width:100%;height:100%;position:relative;}

  .tableBbody .rowClick{cursor:pointer;}

  .tableBbody .rowClick:hover{color:white;background-color:#777777 !important;}

</style>

