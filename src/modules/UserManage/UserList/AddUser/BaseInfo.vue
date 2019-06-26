<!-- 用户基本信息页面组件 -->
<template>
    <div class="UserBaseInfo">
        <InputDir ref="name"       label="用户名称" @change="name_change"       :val="name"         :require="true" tip="必填" />
        <InputDir ref="account"    label="登录账号" @change="account_change"    :val="account"      :require="true" tip="必填" v-if="!blnUpdate"/>
        <InputDir ref="pwd"        label="登录密码" @change="pwd_change"        :val="pwd"          :require="blnUpdatePwd?false:true" tip="必填"  v-if="!blnUpdate" type="pwd"/>
        <InputDir ref="confirmPwd" label="确认密码" @change="confirmPwd_change" :val="confirmPwd"   :require="blnUpdatePwd?false:true" tip="必填" v-if="!blnUpdate" type="pwd"/>
        <InputDir ref="depart"     label="所属部门" @change="department_change" :val="department"   :require="false" tip="必填"/>
        <InputDir ref="tel"        label="联系电话" @change="tel_change"        :val="tel"          :require="true" reg="^1(3|4|5|7|8)\d{9}$|^(0[0-9]{2,3}-?)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$" regTip="电话格式错误" tip="必填"/>
        <InputDir label="联系邮箱" @change="email_change"      :val="email"/>
        <InputDir label="备注信息" @change="remark_change"     :val="remark"/>
    </div>
</template>

<script>
import InputDir from '@/components/Input'
export default {
  name: 'UserBaseInfo',
  props:['blnUpdate'],
  components:{InputDir},
  data () {
    return {
      blnAdd:true,
      blnUpdatePwd:false,
      name:'',
      account:'',
      pwd:'',
      confirmPwd:'',
      department:'',
      tel:'',
      email:'',
      remark:'',
    }
  },
  computed:{
    
  },
  methods:{
    Valid(){
      let r=this.$refs,
          res=r.name.Valid(true) &&
              (this.blnUpdate?true:r.account.Valid(true)) &&
              (this.blnUpdate?true:r.pwd.Valid(true)) &&
              (this.blnUpdate?true:r.confirmPwd.Valid(true)) && 
              r.depart.Valid(true) &&
              r.tel.Valid(true) &&
              (this.blnUpdate?true:this.pwd == this.confirmPwd);
      return res;
    },
    triggerChnage(){
      this.$emit('valid');
    },
    name_change(val){this.name=val;this.triggerChnage();},
    account_change(val){this.account=val;this.triggerChnage();},
    pwd_change(val){this.pwd=val;this.triggerChnage();},
    confirmPwd_change(val){
      if(this.blnUpdate)return;
      this.confirmPwd=val;
      if(this.confirmPwd!=this.pwd){
          this.$refs.confirmPwd.setVaildInfo('两次输入的密码不一致')
      }else{
          this.$refs.confirmPwd.setVaildInfo('');
      }
      this.triggerChnage();
    },
    department_change(val){this.department=val;this.triggerChnage();},
    tel_change(val){this.tel=val;this.triggerChnage();},
    email_change(val){this.email=val;this.triggerChnage();},
    remark_change(val){this.remark=val;this.triggerChnage();}
  }
}
</script>

<style scoped lang="less">
.UserBaseInfo{width:100%;height:100%;padding:0px 20px;box-sizing: border-box;}

</style>
