<!-- 数字按钮分页组件 -->
<template>
    <div class="NumberPage">
        <!--向前按钮-->
        <div class="num_btn" v-if="curPageIndex>0" @click="curPageIndex--"><i class="fa fa-caret-left" /></div>

        <div class="num_btn" :class="{active:c==curPageNum}" v-for="(c,i) in curShowNums" :key="i" @click="pageChange(c)">{{c}}</div>

        <!--向后按钮-->
        <div class="num_btn" v-if="curPageIndex<pageSize-1" @click="curPageIndex++"><i class="fa fa-caret-right" /></div>
    </div>
</template>

<script>
export default {
  name:'NumberPage',
  props:['pageNum','btnNum'],
  data () {
    return {
      curShowNums:[],
      curPageIndex:-1,
      curPageNum:1,//当前选中的页号
      pageSize:0,//分页总数
    }
  },
  watch:{
    curPageIndex(){
        let start=this.btnNum*this.curPageIndex,s=this;
        let num=(this.btnNum*this.curPageIndex+this.btnNum)<this.pageNum?(this.btnNum*this.curPageIndex+this.btnNum):this.pageNum;
        this.curShowNums=[];
        for(let i=start;i<num;i++){
            s.curShowNums.push(i+1);
        }
    }
  },
  mounted(){
    this.pageSize=Math.ceil(this.pageNum/this.btnNum);
    this.curPageIndex=0;
  },
  methods:{
    pageChange(num){
        this.curPageNum=num;
        this.$emit('pageChange',num-1);
    }
  }
}
</script>

<style scoped lang="less">
.NumberPage{height:40px;margin:0px auto;}
.NumberPage .num_btn{display:inline-block;border:1px solid;height:30px;width:30px;line-height:30px;text-align:center;margin-top:5px;margin-right:10px;cursor:pointer;overflow:hidden;}
.NumberPage .num_btn.active,
.NumberPage .num_btn:hover{color:white;}
.NumberPage .num_btn:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px;}
.NumberPage .num_btn:last-child{border-top-right-radius:5px;border-bottom-right-radius:5px;}
.NumberPage .num_btn i{font-size:16px;}

</style>
