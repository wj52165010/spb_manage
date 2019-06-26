<!-- 增加规则页面插件 -->
<template>
    <div class="AddRule">
        <div name="container" class="container">
            <div class="row lineHeight">
                <label class="col-md-2 control-label">规则名称:</label>
                <div class="col-md-4">
                    <el-input v-model="sum.standardTitle" placeholder="请输入名称" :disabled="!!detail"></el-input>   
                </div>
            </div>      
            <div class="row lineHeight">
                <label class="col-md-2 control-label">考核对象:</label>
                <div class="col-md-4">
                    <el-select v-model="sum.checkTarget" placeholder="请选择" :disabled="!!detail">
                        <el-option v-for="(kind,i) in checkObject" :label="kind.name" :value="kind.value" :key="i"></el-option>
                    </el-select>
                </div>
            </div>          
            <div class="row lineHeight">
                <label class="col-md-2 control-label">考核规则:</label>
                <div class="col-md-9 col-md-offset-2">
                    <div class="new-cont"> 
                        <div class="new-title subBgColtwo">在离线考核</div>
                        <div class="new-select">
                            <el-checkbox v-model="sum.isCheckNetbarOff" :disabled="!!detail">场所离线率</el-checkbox>
                            <el-checkbox v-model="sum.isCheckNetbarExcept" :disabled="!!detail">场所异常率</el-checkbox>
                            <el-checkbox v-model="sum.isCheckNetbarDetects" :disabled="!!detail">场所贡献率</el-checkbox>
                        </div>
                        <div class="new-hidd" @click="changeTypeFun('1')">
                            <i class="fa fa-caret-up" v-show="changeType=='1'"></i>
                            <i class="fa fa-caret-down" v-show="changeType!='1'"></i>
                        </div>
                        <div class="new-text" v-show="changeType=='1'">                                           
                            <div class="row">
                                <label class="col-md-5 control-label">场所离线率最大阈值:</label>
                                <div class="col-md-5 new_input">
                                    <el-slider v-model="sum.minNetbarOff" :disabled="!sum.isCheckNetbarOff||!!detail"></el-slider>
                                </div>{{sum.minNetbarOff}}%
                            </div> 
                            <div class="row">
                                <label class="col-md-5 control-label">场所异常率最大阈值:</label>
                                <div class="col-md-5 new_input">
                                    <el-slider v-model="sum.minNetbarExcept" :disabled="!sum.isCheckNetbarExcept||!!detail"></el-slider>
                                </div>{{sum.minNetbarExcept}}%
                            </div> 
                            <div class="row">
                                <label class="col-md-5 control-label">场所贡献率最小阈值:</label>
                                <div class="col-md-5 new_input">
                                    <el-slider v-model="sum.minNetbarDetects" :disabled="!sum.isCheckNetbarDetects||!!detail"></el-slider>
                                </div>{{sum.minNetbarDetects}}%
                            </div> 
                        </div>                                         
                    </div>
                    <div class="new-cont"> 
                        <div class="new-title subBgColtwo">数据采集考核</div>
                        <div class="new-select">
                            
                            <el-checkbox v-model="sum.isCheckRealname" :disabled="!!detail" @change="defalutFun('realname')">实名采集</el-checkbox>
                            <el-checkbox v-model="sum.isCheckVirtual" :disabled="!!detail" @change="defalutFun('virtual')">虚拟身份</el-checkbox>
                            <el-checkbox v-model="sum.isCheckHardware" :disabled="!!detail" @change="defalutFun('hardware')">硬件特征</el-checkbox>
                        </div>
                        <div class="new-hidd" @click="changeTypeFun('2')">
                                <i class="fa fa-caret-up" v-show="changeType=='2'"></i>
                                <i class="fa fa-caret-down" v-show="changeType!='2'"></i>                                       
                        </div>
                        <div class="new-text" v-show="changeType=='2'">                                           
                            <div class="row">
                                <label class="col-md-2 control-label" style="padding:0;position: relative;top: -7px;">实名采集:</label>
                                <div class="col-md-10 new_input new-flex">
                                    <el-checkbox v-model="sum.isCheckRealidentity" :disabled="!sum.isCheckRealname||!!detail">真实身份</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckMobile" :disabled="!sum.isCheckRealname||!!detail">手机号</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckRealname" disabled>总量</el-checkbox>
                                </div>
                            </div> 
                            <div class="row">
                                <label class="col-md-2 control-label" style="padding:0;position: relative;top: -7px;">虚拟身份:</label>
                                <div class="col-md-10 new_input new-flex">
                                    <el-checkbox v-model="sum.isCheckQq" :disabled="!sum.isCheckVirtual||!!detail">QQ</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckWechat" :disabled="!sum.isCheckVirtual||!!detail">微信</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckTaobao" :disabled="!sum.isCheckVirtual||!!detail">淘宝</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckVirtual" disabled>虚拟身份种类</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckVirtual" disabled>总量</el-checkbox>
                                </div>
                            </div> 
                            <div class="row">
                                <label class="col-md-2 control-label" style="padding:0;position: relative;top: -7px;">硬件特征:</label>
                                <div class="col-md-10 new_input new-flex">
                                    <el-checkbox v-model="sum.isCheckMac" :disabled="!sum.isCheckHardware||!!detail">MAC</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckImsi" :disabled="!sum.isCheckHardware||!!detail">IMSI</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckImei" :disabled="!sum.isCheckHardware||!!detail">IMEI</el-checkbox>
                                    <el-checkbox v-model="sum.isCheckHardware" disabled>总量</el-checkbox>
                                </div>
                            </div> 
                        </div>                                        
                    </div>
                    <div class="new-cont" v-show="sum.checkTarget=='firm'"> 
                        <div class="new-title subBgColtwo">数据传输质量考核</div>
                        <div class="new-select">
                            <el-checkbox v-model="sum.isCheckDatareport" :disabled="!!detail">上报率</el-checkbox>
                            <el-checkbox v-model="sum.isCheckDatavalid" :disabled="!!detail">有效率</el-checkbox>
                        </div>
                        <div class="new-hidd" @click="changeTypeFun('3')">
                            <i class="fa fa-caret-up" v-show="changeType=='3'"></i>
                            <i class="fa fa-caret-down" v-show="changeType!='3'"></i>   
                        </div>
                        <div class="new-text" v-show="changeType=='3'">                                           
                            <div class="row">
                                <label class="col-md-5 control-label">厂商上报率最小阈值:</label>
                                <div class="col-md-5 new_input">
                                    <el-slider v-model="sum.minDataReport" :disabled="!sum.isCheckDatareport||!!detail"></el-slider>
                                </div>{{sum.minDataReport}}%
                            </div> 
                            <div class="row">
                                <label class="col-md-5 control-label">厂商有效率最小阈值:</label>
                                <div class="col-md-5 new_input">
                                    <el-slider v-model="sum.minDataValid" :disabled="!sum.isCheckDatavalid||!!detail"></el-slider>
                                </div>{{sum.minDataValid}}%
                            </div> 
                        </div>                                         
                    </div>                                    
                    </div>
                </div>                                                    
            </div>                                                  
            <div style="position: absolute;bottom: 15px;right: 71px;">
                <RawButton type="submit"  @click="submit" v-show="!detail" style="margin-right:10px;">确定</RawButton> 
                <RawButton type="cancel"  @click="cancel">返回</RawButton>
            </div>                   
        </div>
</template>

<script>

export default {
  name: 'AddRule',
  components:{},
  props:['detail'],
  data(){
    return {
        changeType:"1",
        sum:{
            standardTitle: '',
            checkTarget:'firm',// 规则适用对象，firm、region定义：examine_target  默认选择厂商
            isCheckNetbarOff: '',// 0未勾选，1勾选   是否考核场所离线率
            minNetbarOff: null,// 最低离线率，0-100的数字
            isCheckNetbarExcept: '',// 0未勾选，1勾选   是否考核场所异常率
            minNetbarExcept: null,// 最低异常率，0-100的数字
            isCheckNetbarDetects: '',// 0未勾选，1勾选   是否考核场所贡献量
            minNetbarDetects: null,// 最低贡献率，0-100的数字
            isCheckRealname: '',// 0未勾选，1勾选   是否考核实名采集
            isCheckRealidentity: '',// 0未勾选，1勾选   是否考核真实身份采集
            isCheckMobile: '',// 0未勾选，1勾选   是否考核手机号采集
            isCheckVirtual: '',// 0未勾选，1勾选   是否考核虚拟身份采集
            isCheckQq: '',// 0未勾选，1勾选   是否考核qq号采集
            isCheckWechat: '',// 0未勾选，1勾选   是否考核微信采集
            isCheckTaobao: '',// 0未勾选，1勾选   是否考核淘宝采集
            isCheckHardware: '',// 0未勾选，1勾选   是否考核硬件特征
            isCheckMac: '',// 0未勾选，1勾选   是否考核mac采集
            isCheckImsi: '',// 0未勾选，1勾选   是否考核imsi采集
            isCheckImei: '',// 0未勾选，1勾选   是否考核imei采集
            isCheckDatareport: '',// 0未勾选，1勾选   是否考核数据上报率
            minDataReport: null,// 最低上报率，0-100的数字
            isCheckDatavalid:"",   // 0未勾选，1勾选   是否考核数据有效率
            minDataValid: null,// 最低有效率，0-100的数字
        },
        checkObject:[{name:'厂商',value:"firm"},{name:'区域',value:"region"}],
    }
  },
  mounted(){
    this.detail?this.loadDetail():null;
  },
  methods:{
    changeTypeFun(val){        
        if(this.changeType==val){
            this.changeType='0';
        }else{
            this.changeType=val;
        }                                               
    },
    // 默认勾选问题
    defalutFun(val){
        switch(val){
            case "realname":
                if(this.sum.isCheckRealname){
                    this.sum.isCheckRealidentity=true;
                    this.sum.isCheckMobile=true;
                }
                break;
            case "virtual":
                if(this.sum.isCheckVirtual){
                    this.sum.isCheckQq=true;
                    this.sum.isCheckWechat=true;
                }
                break;
            case "hardware":
                if(this.sum.isCheckHardware){
                    this.sum.isCheckMac=true;
                    this.sum.isCheckImsi=true;
                }
                break;                                                                                
        }
    },
    submit(){
        if(!this.sum.standardTitle || !this.sum.checkTarget){
            _t.info('规则名称，考核对象必填!');
            return;
        }
        // 将数据类型转换(后台接受的是0和1的形式，这边传递的是true和false)
        for(let key in this.sum){
            if(key=="minNetbarOff"||key=="minNetbarExcept"||key=="minNetbarDetects"||key=="minDataReport"||key=="minDataValid"||key=="standardTitle"||key=="checkTarget"){
                continue;
            }
            if(this.sum[key]){
                this.sum[key]="1";
            }else{
                this.sum[key]="0";
            }
        }

        let temp={...this.sum};

        temp.isCheckDatareport=temp.isCheckDatareport=='1'?true:false;
        temp.isCheckDatavalid=temp.isCheckDatavalid=='1'?true:false;
        temp.isCheckHardware=temp.isCheckHardware=='1'?true:false;
        temp.isCheckImei=temp.isCheckImei=='1'?true:false;
        temp.isCheckImsi=temp.isCheckImsi=='1'?true:false;
        temp.isCheckMac=temp.isCheckMac=='1'?true:false;
        temp.isCheckMobile=temp.isCheckMobile=='1'?true:false;
        temp.isCheckNetbarDetects=temp.isCheckNetbarDetects=='1'?true:false;
        temp.isCheckNetbarExcept=temp.isCheckNetbarExcept=='1'?true:false;
        temp.isCheckNetbarOff=temp.isCheckNetbarOff=="1"?1:0,
        temp.isCheckQq=temp.isCheckQq=='1'?true:false;
        temp.isCheckRealidentity=temp.isCheckRealidentity=='1'?true:false;
        temp.isCheckRealname=temp.isCheckRealname=='1'?true:false;
        temp.isCheckTaobao=temp.isCheckTaobao=='1'?true:false;
        temp.isCheckVirtual=temp.isCheckVirtual=='1'?true:false;
        temp.isCheckWechat=temp.isCheckWechat=='1'?true:false;

        ser.ExamineRuleAdd(temp).then(res=>{
            if(!_t.msg(res,'添加成功!'))return;
            this.cancel(true);
        })  
    },
    cancel(blnFlag){                                
        this.$emit('cancel',blnFlag);
    },
    // 加载详情
    loadDetail(){
        let detail=this.detail;
        this.sum={
            standardTitle: detail.standardTitle,
            checkTarget:detail.checkTarget,
            isCheckNetbarOff: detail.isCheckNetbarOff==1?true:false,
            minNetbarOff: parseInt(detail.minNetbarOff),
            isCheckNetbarExcept: detail.isCheckNetbarExcept,
            minNetbarExcept: parseInt(detail.minNetbarExcept),
            isCheckNetbarDetects: detail.isCheckNetbarDetects,
            minNetbarDetects: parseInt(detail.minNetbarDetects),
            isCheckRealname: detail.isCheckRealname,
            isCheckRealidentity: detail.isCheckRealidentity,
            isCheckMobile: detail.isCheckMobile,
            isCheckVirtual: detail.isCheckVirtual,
            isCheckQq: detail.isCheckQq,
            isCheckWechat: detail.isCheckWechat,
            isCheckTaobao: detail.isCheckTaobao,
            isCheckHardware: detail.isCheckHardware,
            isCheckMac: detail.isCheckMac,
            isCheckImsi: detail.isCheckImsi,
            isCheckImei: detail.isCheckImei,
            isCheckDatareport: detail.isCheckDatareport,
            minDataReport: parseInt(detail.minDataReport),
            isCheckDatavalid:detail.isCheckDatavalid,
            minDataValid: parseInt(detail.minDataValid),
        };                               
    }
  }
}
</script>

<style lang="less" scoped>
    .AddRule .el-checkbox{margin-right:0px;}
</style>

<style lang="less" scoped>
.AddRule{width:100%;height:100%;box-sizing:border-box;text-align:left;}
.lineHeight{line-height:40px;}
.new-text{font-size:12px;}
// 新增考核规则
.AddRule .container{
    width:100%;height:100%;box-sizing: border-box;
}
.AddRule .container .set-check-row{
    height:50px;
}   
.AddRule .container .set-check-row .control-label{
    line-height:36px;text-align:right
} 
.AddRule .new-cont{
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    color:white;
}
.AddRule .new-title{
    text-align: center;
    line-height: 26px;
    color:#fff;
    font-size:14px;
    font-weight:bold;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
} 
.AddRule .new-select{
    display:flex;
    line-height: 31px;
    border-bottom: 1px solid #ccc;
}
.AddRule .new-select .el-checkbox{
    flex:1;
    text-align:center;
}
.AddRule .new-hidd{
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    color:#666;
}
.AddRule .new-cont .new-text{
    //  display:none;
}
.AddRule .new-cont .new-text .control-label{
    text-align: right;  
    font-weight: normal;
    font-size: 12px;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently*/
}
.AddRule .new-cont .new-text .new_input{
    position: relative;
    top: -4px;
}
.AddRule .new-cont .new-text input[type=text]{
    height: 28px;
}

.AddRule .new-cont .new-text .new-flex{
    display: flex;
    justify-content:space-around;
    padding-right:40px;
}
.AddRule .new-cont .new-text .new-flex .el-checkbox{
    flex:1;
}
.AddRule .new-cont .new-text .new-flex .el-checkbox:last-child{
    text-align:right;
}
</style>