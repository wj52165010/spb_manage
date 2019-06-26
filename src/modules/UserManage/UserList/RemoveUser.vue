<!-- 删除用户页面 -->
<template>
    <div class="RemoveUser">
        <div style="text-align:center;">请输入密码,请输入密码，确认删除操作</div>
        <div style="margin:10px 0px;"><PasswordInput v-model="password" /></div>
        <div style="text-align:right;">
            <RawButton type="submit" :disabled="blnSubmit" @inClick="ok_btn()" style="margin-right:5px;">
                <span v-if="!blnSubmit">确定</span> <i v-if="blnSubmit" class="fa fa-spinner fa-pulse"></i>
            </RawButton>
            <RawButton type="cancel"  @inClick="cancel_btn()">取消</RawButton>
        </div>
    </div>
</template>

<script>

import PasswordInput from '@/components/PasswordInput'

export default {
  name: 'RemoveUser',
  props:['d'],
  components:{PasswordInput},
  data(){
    return {
        blnSubmit:false,
        password:'',
    }
  },
  methods:{
    cancel_btn(flag){this.$emit('cancel',flag ||false);},
    ok_btn(){
        this.blnSubmit=true;
        ser.DelUser({
            userId:this.d.userId,
            pwd:this.password,
        }).then(res=>{
            this.blnSubmit=false;
            if(!_t.msg(res,'操作成功!')) return;
            this.cancel_btn(true);
        })
    }
  }
}
</script>

<style lang="less" scoped>
    .RemoveUser{padding:10px;}
</style>