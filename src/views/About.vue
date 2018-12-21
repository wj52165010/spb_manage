<template>
  <div class="about" style="height:calc(100% - 78px);width:100%;">
    <Scroll>
      <div :key="i" v-for="(d,i) in data" style="line-height:30px;">{{d}}</div>
    </Scroll>
  </div>
</template>
<script>

import Scroll from '@/components/Scroll'
export default {
  name: 'About',
  components:{Scroll},
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