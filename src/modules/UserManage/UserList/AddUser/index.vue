<!-- 新增用户主页面组件 -->
<template>
    <div class="AddUserIndex">
        <!--步骤显示区域-->
        <div class="stepShow">
          <div class="stepItem">
            <div class="step_container">
              <div class="step_num">1</div>
              <div class="step_line" :class="pageIndex>=0?'subBgColtwo':'noactive'"></div>
              <div class="step_info">填写基础信息</div>
            </div>
          </div>
          <div class="stepItem">
            <div class="step_container">
              <div class="step_num">2</div>
              <div class="step_line" :class="pageIndex>=1?'subBgColtwo':'noactive'"></div>
              <div class="step_info">选择管辖范围</div>
            </div>
          </div>
          <div class="stepItem">
            <div class="step_container">
              <div class="step_num">3</div>
              <div class="step_line" :class="pageIndex==2?'subBgColtwo':'noactive'"></div>
              <div class="step_info">确认功能权限</div>
            </div>
          </div>
        </div>

        <!--内容栏-->
        <div class="content">
          <BaseInfo v-show="pageIndex==0"     :blnUpdate="blnUpdate"  class="fadeIn" ref="BaseInfo"     @valid="Valid()" />
          <ContrlScope v-show="pageIndex==1"  :blnUpdate="blnUpdate"  class="fadeIn" ref="ContrlScope"  @valid="Valid()" />
          <FeatruePower v-show="pageIndex==2" :blnUpdate="blnUpdate"  class="fadeIn" ref="FeatruePower" @valid="Valid()" :roleId="roleId" />
        </div>
        <!--操作栏-->
        <div class="option_bar">
          <RawButton type="cancel"  @inClick="cancel_btn()">取消</RawButton>
          <RawButton type="submit"  v-show="pageIndex>0"  @inClick="goPre()">上一步</RawButton>
          <RawButton type="submit"  v-show="pageIndex<2"  :disabled="blnSubmit" @inClick="gonext()">下一步</RawButton>
          <RawButton type="submit"  v-show="pageIndex==2" :disabled="blnSubmit || blnExecute" @inClick="ok_btn()"><span v-if="!blnExecute">确定</span> <i v-if="blnExecute" class="fa fa-spinner fa-pulse"></i></RawButton>
        </div>
    </div>
</template>

<script>
import BaseInfo from './BaseInfo'
import ContrlScope from './ContrlScope'
import FeatruePower from './FeatruePower'
import {subResize} from '@/wraplib/event'

export default {
  name: 'AddUserIndex',
  props:['blnUpdate','data'],
  components:{BaseInfo,ContrlScope,FeatruePower},
  data () {
    return {
      blnSubmit:false,
      blnExecute:false,
      blnFirm:false,
      pageIndex:-1,
      blnBaseNext:false,//是否允许基础页面进入下一步
      upD:null,
      roleId:0,
    }
  },
  watch:{
    pageIndex(){
      this.Valid();
      if(this.pageIndex==2){
        this.$nextTick(()=>{
          this.roleId=this.$refs.ContrlScope.role;
          //this.$refs.FeatruePower.GetMenus();
          this.$refs.FeatruePower.layout();
        })
      }

      if(this.pageIndex==1){
        setTimeout(()=>{
          subResize.next(null);
        },300)
      }
    }
  },
  mounted(){
    this.pageIndex=0;
    this.upD=this.data || {};

    this.UpdatSetDefval();
  },
  methods:{
    Valid(){
      if(this.pageIndex==0){
        this.$nextTick(()=>{
          this.blnSubmit = !this.$refs.BaseInfo.Valid();
        });
      }

      if(this.pageIndex==1){
        this.$nextTick(()=>{
          if(this.$refs.ContrlScope.blnShowFirm){
            this.blnSubmit=!this.$refs.ContrlScope.firm;
          }else{
            this.blnSubmit = !this.$refs.ContrlScope.Valid();
          }
          this.roleId=this.$refs.ContrlScope.role;
        });
      }
    },
    //修改时设置默认的值
    UpdatSetDefval(){
      if(!this.data) return;
      this.$nextTick(()=>{
        let b=this.$refs.BaseInfo,
            c=this.$refs.ContrlScope,
            d=this.$refs.FeatruePower,
            u=this.data;
        b.account=u.account;
        b.name=u.name;
        b.pwd=u.pwd;
        b.confirmPwd=u.confirmPwd;
        b.tel=u.tel;
        b.email=u.email;
        b.department=u.department;
        b.remark=u.note;

        c.role=u.userGroupId;
        c.blnShowFirm=u.userGroupType=='firm';
        c.selRegion=JSON.parse(u.regionCode || '[]');
        this.blnFirm=c.blnShowFirm;
        c.firm=u.firm+'';

        d.blnApp=u.useApp;
        d.blnAuto=u.autoLoadMenu;
      
        d.selKeyIds=_t.isArray(u.permission)?u.permission:JSON.parse(u.permission || "[]");
      });
    },
    cancel_btn(){this.$emit('cancel_btn')},
    goPre(){this.pageIndex--;},
    gonext(){this.pageIndex++;},
    ok_btn(){
      let b=this.$refs.BaseInfo,
          c=this.$refs.ContrlScope,
          d=this.$refs.FeatruePower;

      let data={
        userId:this.upD.user_id || '',
        account: b.account,
        name: b.name,
        pwd:b.pwd,
        tel: b.tel, 
        email: b.email, 
        department: b.department,
        status: this.upD.status || 'normal',
        regionCode:_.map(c.selPlaces,s=>{return {name:s.name,code:s.code,type:s.type}}),
        note:b.remark,
        useApp: d.blnApp?1:0,
        permission:_.chain(d.data).pluck('menus').flatten().filter(d=>d.checked).map(m=>m.keyid).value(),
        autoLoadMenu: d.blnAuto,
        firm: c.firm, 
        userGroups:c.role
      };
      ser[this.blnUpdate?'User_Update':'User_Add'](data).then(res=>{
        if(!_t.msg(res,`${this.blnUpdate?'修改':'添加'}成功!`)) return;

        if(res.biz_body)data.userId=res.biz_body.user_id;
        this.$emit('submit',data);
      });
    }
  }
}
</script>

<style scoped lang="less">
.AddUserIndex{position:relative;padding:10px;box-sizing:border-box;height:100%;}

@navBarW:50px;
.AddUserIndex .content{height:~'calc(100% - 44px)';margin-left:@navBarW;}
.AddUserIndex .option_bar{text-align:right;padding:0px 10px;}

.AddUserIndex .stepShow{width:@navBarW;left:10px;top:10px;height:~'calc(100% - 54px)';position:absolute;}
.AddUserIndex .stepShow .stepItem{width:100%;height:33.3333%;display:table;}
.AddUserIndex .stepShow .stepItem .step_container{display:table-cell; vertical-align: middle;position:relative;}
.AddUserIndex .stepShow .stepItem .step_container .step_info{float:right;width:20px;font-size:12px;}

.AddUserIndex .stepShow .stepItem .step_container .step_num{position: absolute;font-size: 20px;top: 50%;margin-top: -14px;}
.AddUserIndex .stepShow .stepItem .step_container .step_line{left:18px;top:0px;bottom:0px;width:4px;position:absolute;background:#cccccc;}
.AddUserIndex .stepShow .stepItem .step_container .step_line.noactive{background:gray;}

.AddUserIndex .option_bar .RawButton{margin-left:5px;}
</style>
