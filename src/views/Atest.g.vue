<template>
  <div class="about">
    <input type="text" v-model="name" />
    <button type="button" class="btn btn-default" v-lock:click="()=>open(name)" >刷新页面</button>
    <test v-on="$listeners" />
  </div>
</template>
<script>

import test from '@/components/test'
export default {
  name: 'Atest',
  refresh:true,
  components:{test},
  data(){
    return {
      name:'2',
    }
  },
  created(){
    //layer.msg('312321');
  },
  methods:{
    open(){
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
    },
  }
}
</script>

<style lang="less" scoped>
  .about{width:100%;height:100%;.transLine()}
</style>