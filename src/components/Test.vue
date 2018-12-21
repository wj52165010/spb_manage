<template>
  <div class="hello">
    {{name}}<button type="button" class="btn btn-default" @click="name='123214214'">yellow</button>
    <Test2 />
  </div>
</template>

<script>
import refreshMixin from '@/mixins/refreshFlagMixin'
import Test2 from './Test2'

export default {
  name: 'TestComp',
  mixins: [refreshMixin],
  components:{Test2},
  props: {
    msg: String
  },
  data(){
    return {
      name:'测试组件',
    }
  },
  methods:{
    
  }
}
</script>
