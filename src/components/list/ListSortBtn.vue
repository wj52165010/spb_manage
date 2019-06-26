<!-- 列表排序按钮 -->
<template>
    <div class="ListSortBtn" v-on="$listeners">
        <span style="margin-right:5px;">{{name}}</span>
        <i class="fa fa-caret-up hoverSubBgColtwo" 
            :class="{active:!innerOrder}" 
            @click="orderChange(false);">
        </i>

        <i class="fa fa-caret-down hoverSubBgColtwo" 
            :class="{active:innerOrder}" 
            @click="orderChange(true);">
        </i>
    </div>
</template>

<script>
export default {
  name: 'ListSortBtn',
  props:['name','field','order','context'],
  data(){
    return {
        innerOrder:false
    }
  },
  created(){
    this.innerOrder=this.order || false;
  },
  watch:{
    order(){this.innerOrder=this.order}
  },
  methods:{
    orderChange(flag){
        if(this.innerOrder==flag) return;
        this.innerOrder=flag;
        this.$emit('change',this.field,this.innerOrder,this.context)
    }
  }
}
</script>

<style lang="less" scoped>
.ListSortBtn .fa-caret-up{
    position: absolute;
    top: 8px;
    cursor: pointer;
    font-size: 14px;
    color: gray;
}
.ListSortBtn .fa-caret-down{
    position: absolute;
    top: 17px;
    cursor: pointer;
    font-size: 14px;
    color: gray;
}

.ListSortBtn .active{color:white;}

</style>