<!-- 导航组件 -->
<template>
    <div class="inputDir_container">
      <form action="#" autocomplete="off">
        <!--[if IE 9]><style>.inputDir_container .form-control{border-bottom:1px solid #d2d2d2;}.inputDir_container .form-control:focus{border-bottom-color:@mainCol;}</style><![endif]-->
        <input class="form-control date" style="color:white;" @blur="validComp();" v-model="value" :class="{empty:!value}" :disabled='blnDisabled' type="text" v-if="!type" autocomplete="off"/>

        <input class="form-control date" style="color:white;" name="psw" @blur="validComp()" v-if="type=='pwd'"  onfocus="this.type='password'"  v-model="value" :class="{empty:!value}" :disabled='blnDisabled' type="text" autocomplete="new-password" />
        <div class="floating-label"><span style="color:red;" v-if="blnRequire">*</span>{{label}}</div>
        <div style="text-align:center;" v-show="blnLoad"><img src="@/assets/loading-validator.gif" /></div>
        <div class="validInfo fadeIn" v-if="validInfo">{{validInfo}}</div>
      </form>
    </div>
</template>

<script>
export default {
  name: 'inputDir',
  props:['label','blnLoad','extra','val','valid','type','require','tip','reg','regTip','blnDisabled'],
  components:{},
  data () {
    return {
      value:'',
      validInfo:'',
      blnRequire:false,
      blnFocus:false
    }
  },
  computed:{
    markVal(){
      let str='';
      // eslint-disable-next-line
      for(i=0;i<this.value.length;i++){
        str+='●';
      }
      return str;
    }
  },
  mounted(){
    this.blnRequire=!!this.require;
    this.value=this.val || '';
  },
  watch:{
    val(){
      this.value=this.val || '';
    },
    value(){
      let blnVaild=this.validFormat();

      this.$emit('validRes',blnVaild);
      if(!blnVaild && !this.require)return;
      this.$emit('change',this.value.replace('，',','),this.extra);
    }
  },
  methods:{
    //设置提示信息
    setVaildInfo(v){
      this.validInfo=v;
    },
    //获取验证结果
    //flag:true(只验证,显示提示信息)
    Valid(flag){
      return this.validFormat(flag);
    },
    validComp(){
      let blnVaild=this.validFormat();

      this.$emit('validRes',blnVaild);
      if(!blnVaild && !this.require)return;
      this.$emit('change',this.value.replace('，',','),this.extra);
    },
    //验证输入类容是否正确
    validFormat(flag){
      let blnValid=true;

      if(this.require){blnValid = !(this.value=='');}
      if(!flag){
        if(!blnValid){this.validInfo='必填';return blnValid;}else{this.validInfo='';}
      }

      if(this.reg){
        //this.reg='\\d{15}';

        let exp =eval('/'+this.reg+'/i');
        blnValid=!!this.value.match(exp);
      }
      if(!flag){
        if(!blnValid){this.validInfo=this.regTip || this.tip || '';return blnValid;}else{this.validInfo='';}
      }

      if(!this.valid || (this.valid && this.valid.length<=0))return blnValid;
      
      for(let item of this.valid){
        if(item.exp){
          try{
            if(!eval(item.exp.replace(eval('/%d/g'),this.value))){if(!flag){this.validInfo=item.note;}blnValid=false;break;}
          }catch(e){
            this.validInfo='';
          }
        }
      }

      
      if(blnValid){this.validInfo='';}

      return blnValid;
    }
  }
}
</script>
<style scoped lang="less">
.inputDir_container{
    position:relative;
    margin-top:10px;
    color:white;
}
.inputDir_container > input{padding-left:5px !important;color:white;}
input{color:white;}

@bordrCol:white;

.inputDir_container .form-control{
    border: 0;
    background-image: linear-gradient(@mainCol,@mainCol),linear-gradient(@bordrCol,@bordrCol);
    background-size: 0 2px,100% 1px;
    background-repeat: no-repeat;
    background-position: center bottom,center calc(100% - 1px);
    background-color: transparent;
    transition: background 0s ease-out;
    padding:0px;
    border-radius: 0px;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", "FontAwesome", sans-serif;
    font-weight: 300;
    box-shadow: none;
}

.inputDir_container .form-control:focus{
    outline: none;
    background-image: linear-gradient(@mainCol,@mainCol),linear-gradient(@bordrCol,@bordrCol);
    background-size: 100% 2px,100% 1px;
    box-shadow: none;
    border-radius: 0px;
    transition-duration: .3s;
}

.inputDir_container .form-control + .floating-label{
    font-size:14px;
    color: #bdbdbd;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 5px;
    transition: .3s ease all;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", "FontAwesome", sans-serif;
    font-weight: 300;
}

.inputDir_container .form-control:focus + .floating-label{
     font-size:9.8px;
     top:-10px;
     color:@mainCol;
}

.inputDir_container .form-control:not(.empty) + .floating-label{
    font-size:9.8px;
    top:-10px;
}

.inputDir_container .validInfo{
  position: absolute;
  top: -10px;
  right: 0px;
  font-size: 12px;
  color: red;
}
</style>
