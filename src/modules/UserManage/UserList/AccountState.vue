<!-- 账号状态改变页面 -->
<template>
    <div class="AccountState">
        <div style="text-align:center;">请输入密码,确认{{d.status=='disabled'?'启用':this.d.status=='lock'?'解锁':'停用'}}该账号</div>
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
  name: 'AccountState',
  props:['d'],
  components:{PasswordInput},
  data(){
    return {
        blnSubmit:false,
        password:'',
    }
  },
  methods:{
    cancel_btn(){this.$emit('cancel');},
    ok_btn(){
        this.blnSubmit=true;
        ser.UpdateUserStauts({
            userId:this.d.userId,
            status: this.d.status=='disabled'?'normal':this.d.status=='lock'?'normal':'disabled',
            pwd:this.password,
        }).then(res=>{
            this.blnSubmit=false;
            if(!_t.msg(res,'操作成功!')) return;
            this.d.status=this.d.status=='disabled' || this.d.status=='lock'?'normal':'disabled';
            this.cancel_btn();
        })
    }
  }
}
</script>

<style lang="less" scoped>
    .AccountState{padding:10px;}
</style>