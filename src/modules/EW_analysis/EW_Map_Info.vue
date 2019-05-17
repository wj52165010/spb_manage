<template>
  <div class="about">
    <div class="item">聚集人数:<span class="sub">30人</span></div>
    <div class="item">聚集时间:<span class="sub">4月15日 13:30</span></div>
    <div class="item">聚集地点:<span class="sub">重庆市九龙坡区谢家湾小学</span></div>
    <i class="iconfont icon-list list iconHover" v-lock:click="(e)=>list(name)" />
  </div>
</template>
<script>

export default {
  name: 'Atest',
  refresh:true,
  data(){
    return {
        name:'1232'
    }
  },
  mounted(){
    
  },
  methods:{
    list(){
        
       this.$open({
          title:'测试天窗',
          area:'400px',
          content:`<div @click="test()">{{a}}</div>`,
          data:{
            a:1
          },
          methods:{
            test(){
              this.a=2;
              this.$caller.name='测试';
              this.close();
            }
          }
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .about{position:relative;padding:10px;}
  .item{line-height:25px;}
  .item .sub{color:#CCCCCC;}
  .list{position:absolute;right:5px;top:5px;cursor:pointer;}
</style>