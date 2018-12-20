<template>
  <div class="home bgCol">
    <img alt="Vue logo" src="../assets/logo.png">
    
    <i class="iconfont icon-volume-up" />
    <button type="button" class="btn btn-primary" @click="popMenu()">弹窗</button>
    <button type="button" class="btn btn-primary" @click="Theme('blue')">blue</button>
    <button type="button" class="btn btn-default" @click="Theme('green')">green</button>
    <button type="button" class="btn btn-default" @click="Theme('yellow')">yellow</button>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import themeMixin from '@/mixins/themeMixin'

export default {
  name: 'home',
  mixins: [themeMixin],
  components: {
  },
  created(){
  },
  methods:{
    popMenu(){
      dialog.msg('123');
    },
  }
}
</script>
