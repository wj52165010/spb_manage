<!-- 密码输入组件 -->
<template>
    <div class="PasswordInput">
        <form action="#" autocomplete="off">
          <input :type="inputType" name="pwd" :value="currentValue" @input="handleInput" autocomplete="new-password" />
          <i class="fa fa-eye hoverSubBgColtwo" @mouseover="mouseover" @mouseout="mouseout" />
        </form>
    </div>
</template>

<script>
export default {
  name: 'PasswordInput',
  props: ['value'],
  data () {
    return {
      inputType:'password'
    }
  },
  computed:{
    currentValue:function () {
      return this.value
    }
  },
  methods:{
    handleInput(event){
      let value = event.target.value;
      this.$emit('input', value);
    },
    mouseover(){
        this.inputType="text"
    },
    mouseout(){
        this.inputType="password"
    }
  }
  
}
</script>

<style scoped lang="less">
  .PasswordInput {line-height:36px;height:36px;border:1px solid #C0CCDA;border-radius:5px;overflow:hidden;}
  .PasswordInput input{outline:none;border:none;padding:0px 10px;width:~'calc(100% - 60px)';background: transparent;}
  .PasswordInput i{float:right;margin-right:10px;margin-top:10px;}
  .PasswordInput i:hover{cursor:pointer;}
</style>
