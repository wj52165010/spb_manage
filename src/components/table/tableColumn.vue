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
      blnEmpty:!(this.$slots && this.$slots.default && (this.$slots.default[0].tag || this.$slots.default[0].text)),
    }
  },
  computed:{
  
  },
  beforeUpdate(){
    this.blnEmpty=!(this.$slots && this.$slots.default && (this.$slots.default[0].tag || this.$slots.default[0].text));
  },
  methods:{
    click(){
      //this.column.data.attrs.width=200;//改变列宽度

      //console.log(this.column);
      this.$emit('click');
    }
  },
}
</script>
<style scoped lang="less">
  .table-column{
    height:100%;width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;position:relative;text-align:center;
  }
  .table-column-block{display: inline-table;}

  .table-column .clickItem{color: @linkColor;}
  .table-column .clickItem:hover{ cursor: pointer;text-decoration: underline;}
</style>
