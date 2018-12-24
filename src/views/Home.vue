<template>
  <div class="home">
    <Header />
    <div style="height:calc(100% - 100px);width:100%;">
      <PageSwitch ref="PageSwitch" />
    </div>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import themeMixin from '@/mixins/themeMixin'
import PageSwitch from '@/components/PageSwitch'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: 'home',
  mixins: [themeMixin],
  refresh:true,
  components: {PageSwitch,Header,Footer},
  data(){
    return {
    };
  },
  mounted(){
   this.$refs.PageSwitch.show('Atest')
  },
  methods:{
    popMenu(){
      this.$msg('123');
    },
    // refresh(){
    //   console.log('说得');
    // }
  }
}
</script>

<style lang="less" scoped>
  .home{width:100%;height:100%;}
</style>