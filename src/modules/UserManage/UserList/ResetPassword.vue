<!-- 重置密码页面插件 -->
<template>
    <div class="ResetPassword">
        <div  style="margin:10px 0px;line-height:30px;">
            <div style="float:left;width:70px;margin-top:13px;">您的密码</div>
            <div style="float:right;width:110px;font-size:12px;margin-top:19px;color:red;">{{passwordTip}}</div>
            <div style="margin-left:70px;margin-right:110px;padding-top: 8px;color:#ccc;"><PasswordInput v-model="oldPassword" /></div>
        </div>

        <div  style="margin:10px 0px;line-height:30px;">
            <div style="float:left;width:70px;margin-top:13px;">新的密码</div>
            <div style="float:right;width:110px;font-size:12px;margin-top:19px;color:red;">{{newPasswordTip}}</div>
            <div style="margin-left:70px;margin-right:110px;padding-top: 8px;color:#ccc;"><PasswordInput v-model="newPassword" /></div>
        </div>

        <div  style="margin:10px 0px;line-height:30px;">
            <div style="float:left;width:70px;margin-top:13px;">确认密码</div>
            <div style="float:right;width:110px;font-size:12px;margin-top:19px;color:red;">{{secondPasswordTip}}</div>
            <div style="margin-left:70px;margin-right:110px;padding-top: 8px;color:#ccc;"><PasswordInput v-model="secondPassword" /></div>
        </div>

        <div style="text-align:right;">
            <RawButton type="submit" :disabled="blnSubmit" @inClick="ok_btn()" style="margin-right:5px;">
                <span v-if="!blnSubmit">确定</span> <i v-if="blnSubmit" class="fa fa-spinner fa-pulse"></i>
            </RawButton>
            <RawButton type="cancel" @inClick="cancel_btn()">取消</RawButton>
        </div>
    </div>
</template>

<script>
import PasswordInput from '@/components/PasswordInput'

export default {
  name: 'ResetPassword',
  props:['userId'],
  components:{PasswordInput},
  data(){
    return {
        oldPassword:'',
        newPassword:'',
        secondPassword:'',
        newPasswordTip:'',
        secondPasswordTip:'',
        passwordTip:'',
        blnSubmit:false,
    }
  },
  watch:{
    oldPassword(){
        if(this.oldPassword){this.passwordTip=''}
    },
    newPassword(){
        if(this.newPassword){this.newPasswordTip=''}
        if(this.newPassword!=this.secondPassword && this.newPassword && this.secondPassword){
            this.newPasswordTip='输入的密码不一致';
        }else{
            this.newPasswordTip='';
            this.secondPasswordTip='';
        }
    },
    secondPassword(){
        if(this.secondPassword){this.secondPasswordTip=''}
        if(this.newPassword!=this.secondPassword && this.newPassword && this.secondPassword){
            this.secondPasswordTip='输入的密码不一致';
        }else{
            this.newPasswordTip='';
            this.secondPasswordTip='';
        }
    }
},
methods:{
    ok_btn(){
        if(!this.oldPassword){this.passwordTip='请输入原密码'; return;}
        if(!this.newPassword){this.newPasswordTip='请输入新密码';return;}
        if(!this.secondPassword){this.secondPasswordTip='请输入确认密码';return;}
        if(this.newPassword!=this.secondPassword && this.newPassword && this.secondPassword){
            this.newPasswordTip='输入的密码不一致';
            this.secondPasswordTip='输入的密码不一致';
            return;
        }

        ser.User_Update_Pwd({
            userId: this.userId,
            newPwd: this.newPassword,
            pwd:this.oldPassword
        }).then(res=>{
            if(!_t.msg(res,'操作成功!')) return;
            this.cancel_btn(this.newPassword);
        });
    },
    cancel_btn(d){this.$emit('cancel_btn',d)},
}
}
</script>

<style lang="less" scoped>
.ResetPassword{padding:10px;}
</style>