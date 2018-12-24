<template>
  <div class="about">
    <input type="text" />
    <button type="button" class="btn btn-default" @click="open()">（默认样式）Default</button>
  </div>
</template>
<script>

export default {
  name: 'Atest',
  data(){
    return {
      data:[1,2,3,1,1,1,1,1,1,1,1,1,1,3,1],
    }
  },
  created(){
    //layer.msg('312321');
  },
  methods:{
    open(){
      _t.open(function(){
        let param ={
          title:'测试天窗',
          area:'400px',
          content:`<div>测试</div>`
        };

        return param;
      }());
    }
  }
}
</script>

<style lang="less" scoped>
  .about{width:100%;height:100%;.transLine()}
</style>