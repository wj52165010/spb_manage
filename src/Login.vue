<!-- 登录页面插件 -->
<template>
    <div class="Login">
       <img src="@/assets/login/leftTopBg.png" />
       <img src="@/assets/login/leftBottomBg.png"  class="leftBottom" />
       <img src="@/assets/login/rightTopBg.png"    class="rightTop" />
       <img src="@/assets/login/rightBottomBg.png" class="rightBottom" />

        <div class="Login_container">
            <div class="input_item first">
                <i class="fa fa-user" /><input type="text" v-model="account" />
            </div>
            <div class="input_item second">
                <i class="fa fa-unlock-alt" /><input type="password" v-model="password" />
            </div>

            <div class="LoginBtn" @click="submit()">{{blnLogin?'登录中...':'登录'}}</div>
        </div>
    </div>
</template>

<script>
import {SetUserCookie} from '@/store/Login/types'
export default {
  name: 'Login',
  components:{},
  data(){
    return {
       account:'',
       password:'',
       blnLogin:false,
    }
  },
  mounted(){
    //监听鼠标按下事件
    $(window).keydown(e=>{
        if(e.which!=13){return;}//回车
        e.preventDefault();
        this.submit();
    })
  },
  methods:{
    submit(){
        if(this.blnLogin) return;
        if(!this.account || !this.password){_t.tipFailure('账号密码不能为空!'); return;}
        this.blnLogin=true;
        ser.Login({
            account:this.account,//spb_admin
            pwd:this.password,
            veriCode:''
        }).then(res=>{
            if(res.code==2006){
                _t.confirm('该用户已经登录是否需要强制登录？',['确定','取消'],()=>{
                    ser.baseBag.token=res.msg;
                    ser.LoginForce(this.account).then(res=>{
                        this.blnLogin=false;
                        if(!_t.msg(res,'登录成功,正在跳转!')) return;
                        this.setSetting(res);
                        window.location=`index.html`
                    });
                            
                },()=>{this.blnLogin=false;});
            }else{
                this.blnLogin=false;
                if(!_t.msg(res,'登录成功,正在跳转!')){this.password=''; return;}
                this.setSetting(res);
                window.location=`index.html`
            }
        })
    },
    setSetting(res){
        this.$store.dispatch(SetUserCookie,res.biz_body);
    }
  }
}
</script>
<style>
html,
body,
.Login{
    width:100%;
    height:100%;
    box-sizing:border-box;
    padding:0px;
    margin:0px;
    background-image: url('./assets/login/loginBg.jpg');
    background-size:100% 100%;
    position:relative;
}

input:-webkit-autofill{
-webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
}
</style>

<style lang="less" scoped>

.leftBottom{position:absolute;left:0px;bottom:0px;}
.rightTop{position:absolute;right:0px;top:0px;}
.rightBottom{position:absolute;right:0px;bottom:0px;}

@LoginH:600px;
@LoginW:1000px;
.Login_container{
    width:@LoginW;height:@LoginH;margin:0px auto;
    position: absolute;
    top: 50%; /*偏移*/
    left:50%;
    margin-top: -@LoginH/2;
    margin-left: -@LoginW/2;
    background-image: url('./assets/login/loginFormBg.png');
    background-size:100% 100%;
}

.input_item{width:300px;border-bottom:1px solid  #08fbff;}
.input_item i{font-size:40px;margin-right:10px;float:left;color:#08fbff;}
.input_item input{line-height:40px;height:40px;width:250px;background:transparent;border:none;outline:none;font-size:20px;color:#08fbff;}

.LoginBtn,
.second,
.first{
    margin-top: 300px;
    margin-left: 350px;
}
.second{margin-top:10px;}
.second i{margin-right:13px;}

.LoginBtn{margin-top:20px;width:300px;text-align:center;
        padding:15px;box-sizing:border-box;background:#00c3e8;color:white;font-size:20px;
        border-radius:5px;cursor:pointer;
        }
.LoginBtn:hover{background:#00b3eb;}
</style>