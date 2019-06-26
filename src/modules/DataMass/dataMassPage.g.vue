<template>
  <div class="DataMassPage">
    <Tags>
      <!--数据接收详情-->
      <div solt="name">数据接收详情</div>
      <div solt="content"><Receive /></div>

      <!--数据有效率-->
      <div solt="name">数据有效率</div>
      <div solt="content"><Effect /></div>
      
      <!--数据文件传输记录-->
      <div solt="name">数据文件传输记录</div>
      <div solt="content"><Transfer /></div>
    </Tags>
  </div>
</template>
<script>
import Tags from '@/components/Tags'
import Receive from './Receive'
import Effect from './Effect'
import Transfer from './Transfer'

export default {
  name: 'dataMassPage',
  role:'dataMassPage',
  refresh:true,
  components:{Tags,Receive,Effect,Transfer},
  data() {
    return {
     
    };
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.DataMassPage{width:100%;height:100%;}
</style>