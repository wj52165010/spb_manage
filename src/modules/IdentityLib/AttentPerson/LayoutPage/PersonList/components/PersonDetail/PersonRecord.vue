<!-- 人员档案页面插件 -->
<template>
    <div class="PersonRecord">
        <!--证件信息-->
        <div class="cardInfo">
            <div class="title"><span class="sub">证件信息</span></div>
            <div class="content">
                <div class="photo_bar">
                    <img v-headimg="info.photoName" />
                    <i class="fa fa-refresh refreshBtn hoverSubBgColtwo" v-update:img="{func:UpdatePhoto}" />
                </div>
                <div class="content_bar">
                    <div class="row">
                        <div class="col-md-2 text-right text-middle">标题 : </div>
                        <div class="col-md-4"><el-input v-model="info.focusTitle" placeholder="请输入内容"></el-input></div>
                        <div class="col-md-2 text-right text-middle">姓名 : </div>
                        <div class="col-md-4 text-middle">{{info.customerName}}</div>                       
                    </div>

                    <div class="row">
                        <div class="col-md-2 text-right text-middle">证件类型 : </div>
                        <div class="col-md-4">
                            <el-select v-model="info.certificateType" placeholder="请选择" :clearable="true">
                                <el-option
                                    v-for="(val,key) in certKinds"
                                    :key="val"
                                    :label="key"
                                    :value="val">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="col-md-2 text-right text-middle">民族 : </div>
                        <div class="col-md-4 text-middle">{{info.nation}}</div>                       
                    </div>

                    <div class="row">
                        <div class="col-md-2 text-right text-middle">证件号码 : </div>
                        <div class="col-md-4"><el-input v-model="info.certificateCode" placeholder="请输入内容"></el-input></div>
                        <div class="col-md-2 text-right text-middle">性别 : </div>
                        <div class="col-md-1 text-middle" style="padding-right:0px;">{{info.sex?info.sex:''}}</div>        
                    </div>

                    <div class="row">
                        <div class="col-md-2 text-right text-middle">户籍地址 : </div>
                        <div class="col-md-10 text-middle ellipsis" :title="info.domicileAddress">{{info.domicileAddress}}</div>     
                    </div>
                </div>
            </div>
        </div>

        <!--关联信息-->
        <div class="relativeInfo">
            <div class="title">
                <span class="sub">关联信息</span>
                <span style="float:right;"><AddBtn @click="AddRelative()" /></span>
            </div>
            <div class="content">
                <v-table :listen="showRelatives" ref="list" :blnLoading="blnLoading">
                <v-table-header>
                    <v-table-column :width="100" >账号类型</v-table-column>
                    <v-table-column :width="100" >虚拟身份类型</v-table-column>
                    <v-table-column>账号</v-table-column>
                    <v-table-column :width="100">数据来源</v-table-column>
                    <v-table-column :width="60">预警</v-table-column>
                    <v-table-column :width="60">删除</v-table-column>
                </v-table-header>

                <v-table-body>
                    <v-table-row v-for="(d,i) in showRelatives" :key="i">
                        <v-table-column>{{d.AccountKind}}</v-table-column>
                        <v-table-column :title="d.vn">{{d.vn}}</v-table-column>
                        <v-table-column>{{d.k}}</v-table-column>
                        <v-table-column>{{d.src=='add'?'新增':'关联'}}</v-table-column>
                        <v-table-column><i class="fa fa-bell"   style="cursor:pointer;" :style="{color:d.am?'red':''}" @click="d.am=!d.am" /></v-table-column>
                        <v-table-column><i class="fa fa-remove" style="cursor:pointer;" @click="removeRelative(i)" v-if="d.src=='add'" /></v-table-column>
                    </v-table-row>
                </v-table-body>
                </v-table>
            </div>
        </div>

        <!--人员标签-->
        <div class="personLabel">
            <div class="title"><span class="sub">人员标签</span></div>
            <div class="content">
                <AddLabel :defval="info.focusTags" ref="AddLabel" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import AddBtn from '@/components/btns/AddBtn'
import AddLabel from '../../../PersonLabelList/components/AddLabel'
import AccountTypes from '@/enum/Feature'
import AddRelative from './AddRelative'
import {valid} from '@/enum/Certificate'

export default {
  name: 'PersonRecord',
  props:['id'],
  components:{AddBtn,AddLabel},
  data(){
    return {
        cards:[],
        cardKind:'',
        blnLoading:false,
        relativeData:[],
        addRelativeData:[],
        info:{focusProperty:[]},
        debounceIdCode:null,
    }
  },
  watch:{
    'info.certificateCode'(){
        this.debounceIdCode();
    },
    blnSubmit(){
        this.$emit('validChange',this.blnSubmit);
    }
  },
  computed:{
    showRelatives(){
        return _.uniq(_.map([...this.addRelativeData,...this.relativeData],c=>{
                c.AccountKind=(_.find(AccountTypes,a=>a.val==c.t) || {name}).name;

                return c;
            }),val=>{
                return val.t + val.k;
            });
    },
    ...mapState({
      certKinds:state=>state.BaseData.certificate_type
    }),
    blnSubmit(){
        return !!(this.info.certificateType && this.info.certificateCode && valid(this.info.certificateType,this.info.certificateCode)) ||
               this.showRelatives.length>0;
    }
  },
  mounted(){
    this.GetDetail();
    this.debounceIdCode=_.debounce(this.Relatedidentity,300);
  },
  methods:{
    submit(callback){
        let focusPropertys=_.map(this.showRelatives,s=>{
            return {
                t:s.t,
                src:s.src,
                k:s.k,
                am:s.am,
                n:s.n
            }
        });

        ser.ResetFocusPeopleDetail({
            "certificateCode":this.info.certificateType?this.info.certificateCode:'',
            "certificateType":this.info.certificateCode?this.info.certificateType:'',
            "customerName": this.info.customerName,
            "domicileAddress":this.info.domicileAddress,
            "focusId": this.info.focusId,
            "focusProperty":JSON.stringify(focusPropertys),
            "focusTags":this.$refs.AddLabel.value.length>0?'|'+this.$refs.AddLabel.value.join('|')+'|':'',
            "focusTitle":this.info.focusTitle,
            "nation": this.info.nation,
            "photoName": this.info.photoName,
            "sex": this.info.sex
        }).then(res=>{
            if(!_t.msg(res,'修改成功!')) return;
            callback();
        });
    },
    GetDetail(){
      this.blnLoading=true;
      ser.GetFocusPeopleById(this.id).then(res=>{
        this.blnLoading=false;
        this.info={...res.biz_body,
                   focusTags:_.compact((res.biz_body.focusTags || "").split('|')),
                   focusProperty:JSON.parse(res.biz_body.focusProperty || "[]"),
                };
         this.addRelativeData = this.addRelativeData.concat(this.info.focusProperty);
      })
    },
    //根据身份证信息获取相关信息
    Relatedidentity(){
        if(!valid(this.info.certificateType,this.info.certificateCode)) return;

        //this.blnLoading=true;
        ser.Relatedidentity({
            certType:this.info.certificateType,
            certId:this.info.certificateCode
        }).then(res=>{
            //this.blnLoading=false;
            this.relativeData=eval('(' + res.biz_body + ')') || []; 
        })
    },
    //增加关联信息
    AddRelative(){
        this.$open({
          title:'添加关联信息',
          area:['500px','400px'],
          components:{AddRelative},
          content:`<AddRelative @cancel="cancel" @addItem="addItem" /> `,
          data:{},
          methods:{
            addItem(data){
                this.$caller.addRelativeData=this.$caller.addRelativeData.concat(data);
                this.cancel();
            },
            cancel(){this.close()}
          }
        });
    },
    //删除关联项
    removeRelative(i){
        if(i<this.addRelativeData.length){
            this.addRelativeData.splice(i,1);
        }else{
            this.relativeData.splice(i-this.addRelativeData.length,1)
        }
    
    },
    //上传头像完成
    UpdatePhoto(res){
        if(!_t.msg(res,'上传成功!')) return;
        this.info.photoName=res.data.fileName;
    }
  }
}
</script>

<style lang="less" scoped>
.PersonRecord{width:100%;height:100%;box-sizing:border-box;}

.PersonRecord  .title {margin-bottom:10px;}
.PersonRecord  .title .sub{font-weight:600;}

@photoW:80px;
@photoH:100px;
.PersonRecord .content_bar{font-size:12px;}
.PersonRecord .cardInfo .content .photo_bar{width:@photoW;height:@photoH;float:left;padding-top: 20px;position:relative;}
.refreshBtn {position:absolute;right:-20px;top:@photoH;cursor:pointer;}

.PersonRecord .cardInfo .content .photo_bar img{width:100%;height:100%;}
.PersonRecord .cardInfo .content .content_bar{margin-left:@photoW+10px;}

.PersonRecord .relativeInfo .content{width:100%;height:200px;padding:0px 15px;box-sizing: border-box;}

.PersonRecord .text-middle{line-height:32px;}
.PersonRecord .row{margin-bottom:5px;}
.PersonRecord .content{border-bottom:1px solid #cccccc;}
.personLabel .content{border-bottom:none;}
</style>