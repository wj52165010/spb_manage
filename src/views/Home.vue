<template>
  <div class="home bgCol" style="height:calc(100% - 78px)">
    <img alt="Vue logo" src="../assets/logo.png">
    
    <i class="iconfont icon-volume-up" />
    <Test />
    <button type="button" class="btn btn-primary" @click="popMenu()">弹窗</button>
    <button type="button" class="btn btn-primary" @click="Theme('blue')">blue</button>
    <button type="button" class="btn btn-default" @click="Theme('green')">green</button>
    <button type="button" class="btn btn-default" @click="Theme('yellow')">yellow</button>
    {{test}}
     <button type="button" class="btn btn-default" @click="test=2">dasda</button>
    <div style="height:calc(100% - 300px);">
      <Scroll>
        <div :key="i" v-for="(d,i) in data" style="line-height:30px;" @click="refresh()">{{d}}</div>
      </Scroll>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import themeMixin from '@/mixins/themeMixin'
import refreshMixin from '@/mixins/refreshFlagMixin'
import Scroll from '@/components/Scroll'
import Test from '@/components/Test'

export default {
  name: 'home',
  mixins: [themeMixin,refreshMixin],
  components: {
    Scroll,Test
  },
  data(){
    return {
      test:1,
      data:[1,2,3,4,5,6,7,8],
    };
  },
  created(){
   //console.log(ser.hello());
  },
  methods:{
    popMenu(){
      dialog.msg('123');
    },
    // refresh(){
    //   console.log('说得');
    // }
  }
}
</script>
