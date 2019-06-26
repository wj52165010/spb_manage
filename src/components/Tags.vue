<!-- 标签插件 -->
<!--<template>
    <div class="Tags">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :name="`label${i}`" :key="i" v-for="(c,i) in $slots.default">
                <span slot="label">唯一身份库</span>
                {{c.children}}
            </el-tab-pane>
        </el-tabs>
    </div>
</template>-->

<script>
import {subResize} from '@/wraplib/event'
export default {
  name: 'Tags',
  props:['index'],
  data(){
    return {
        activeName:`0`,
    }
  },
  watch:{
    index(){this.activeName=`${this.index}`;this.trggerResize();}
  },
  render: function (createElement) {
    let group = _.groupBy(this.$slots.default,s=>s.data.attrs.solt);

    return createElement(
      'el-tabs',
      {
        props: {
            'value':this.activeName
        },
        on:{
            'tab-click':this.handleClick,
            'input':(v)=>{this.activeName=v}
        }
      },
      _.map(group['name'],(s,i)=>{
        return createElement('el-tab-pane',{
            props: {
                name: `${i}`
            },
        },[
            createElement('span',{
                slot:'label'
            },[s]),
            group['content'][i].children || ''
        ])
      })
    )
  },
  mounted(){
    this.activeName=`${this.index || 0}`;
  },
  methods:{
    handleClick(tab) {
      this.$nextTick(()=>{
        tab.$children && _.each(tab.$children,c=>c.layout && c.layout());
        this.trggerResize();
        this.$emit('change',this.activeName);
      })
    },
    trggerResize(){
      this.$nextTick(()=>{
          subResize.next(null);
      });
    }
  }
}
</script>

<style lang="less" scoped>
.Tags{width:100%;height:100%;box-sizing:border-box;}
</style>