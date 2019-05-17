/* eslint-disable */
<!-- 列表列插件 -->
<template>
  <div class="table-column" :id="id" :class="{'table-column-block':blnEmpty}" @click="click()">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'v-table-column',
  props:['column'],
  data () {
    return {
      id:'col'+_t.guid(),
      blnEmpty:!(this.$slots && this.$slots.default),
    }
  },
  computed:{
  
  },
  methods:{
    click(){
      //this.column.data.attrs.width=200;//改变列宽度

      //console.log(this.column);
      this.$emit('click');
    }
  },
  mounted(){
    //console.log(this.$slots.default);
  }
}
</script>
<style scoped lang="less">
  .table-column{
    height:100%;width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;position:relative;text-align:center;
  }
  .table-column-block{display: inline-table;}
</style>
