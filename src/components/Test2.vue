<template>
  <div class="hello">
    {{name}}<button type="button" class="btn btn-default" @click="name='123214214'">fdsfs</button>
  </div>
</template>

<script>
import refreshMixin from '@/mixins/refreshFlagMixin'

export default {
  name: 'Test2Comp',
  mixins: [refreshMixin],
  props: {
    msg: String
  },
  data(){
    return {
      name:'sadsa',
    }
  },
  methods:{
    
  }
}
</script>
