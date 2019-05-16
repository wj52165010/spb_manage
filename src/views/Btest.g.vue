<template>
  <div class="about" style="height:100%;width:100%;">
        <input type="text" />
        <testa />
  </div>
</template>
<script>
import testa from '@/components/testa'
export default {
  name: 'Btest',
  refresh:true,
  components:{testa},
  data(){
    return {
      data:[1,2,3,1,1,1,1,1,1,1,1,1,1,3,1],
    }
  },
  created(){
    //layer.msg('312321');
  },
  methods:{
    
  }
}
</script>