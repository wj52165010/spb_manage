<!-- 角色管理页面组件 -->
<template>
    <div class="RoleList">
       <!--左边角色列表-->
       <div class="left_role subBgColTwoBorderFadeout">
          <!--标题栏-->
          <div class="title_bar subBgColtwo">
              <span style="font-size:20px;font-weight:600;">角色列表</span>
              <el-tooltip placement="top"  content="新建角色" style="position:absolute;right:15px;"> 
                <i class="fa fa-plus-circle" @click="clearData()" />
              </el-tooltip>
          </div>

          <!--列表栏-->
          <div class="list_bar">
            <Scroll :listen="roles" ref="roleScroll">
                <div class="role_item hoverSubBgColtwoBg" v-for="(r,i) in roles" :key="i" @click.stop="updateRole(r)">
                  {{r.name}}
                  <el-tooltip placement="top"  content="删除" v-if="r.userGroupId!='1'"> 
                    <i class="fa fa-remove" @click.stop="removeRole(r,i)" />
                  </el-tooltip>
                  <!--<el-tooltip placement="top"  content="修改" v-if="r.user_group_id!='1'"> 
                    <i class="fa fa-pencil" @click.stop="updateRole(r)" />
                  </el-tooltip>
                  <el-tooltip placement="top"  content="查看"> 
                    <i class="fa fa-eye" @click.stop="lookInfo(r)" />
                  </el-tooltip>-->
                </div>
            </Scroll>
          </div>
       </div>
       <!--右边显示区域-->
       <div class="right_container subBgColTwoBorderFadeout">
          <!--内容展示区域-->
          <div class="content_show subBgColTwoBorderFadeout">
            <!--基础信息-->
            <div class="baseInfo subBgColTwoBorderFadeout">
              <div class="title_bar subBgColtwo">基础信息</div>
              <div class="content_bar">
                <div class="item">
                  <span style="color:red;">*</span>角色名称
                  <el-input type="text" v-model="roleName" style="display:inline-block;" />
                </div>

                <div class="item">
                  <span style="color:red;">*</span>角色对象

                  <div style="display:inline-block;width:192px;">
                    <el-select v-model="roleObject"  placeholder="请选择" :clearable="true">
                        <el-option
                            v-for="kind in rolesObject"
                            :key="kind.key"
                            :label="kind.name"
                            :value="kind.key">
                        </el-option>
                    </el-select>
                  </div>
                </div>

                <div class="item" v-if="blnInner">
                  <span style="color:red;">*</span>接收消息
                  <div class="check_item" @click="blnPatrols=!blnPatrols"><i :class="{'fa fa-square-o':!blnPatrols,'fa fa-check-square':blnPatrols}" /><span>巡查任务</span></div>
                </div>


                <!--提示信息-->
                <div class="tip_info" v-if="blnInner">
                  <div class="title">消息接收说明</div>
                  <div>
                    1.巡查工作<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;常用于网安或派出所，是对网吧等上网场所的安<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;全问题进行排查，或对在上网人员进行核查
                  </div>
                </div>
              </div>
            </div>

            <!--功能权限-->
            <div class="featruePower">
              <div class="title_bar subBgColtwo">功能权限</div>
              <div class="content_bar">
                <Scroll :listen="powers" ref="powerScroll" v-if="roleObject">
                  <div class="kind" v-for="(p,i) in ShowPowers" :key="i">
                    <div class="title">{{p.name}}</div>
                    <div class="child_item subBgColTwoBorderFadeout hoverSubBgColtwo" :class="{subBgColtwo:blnSelMenu(m)}" v-for="(m,i) in p.menus" :key="i" @click="selMenu(m)">
                        <i :class="m.icon" />
                        <div class="info">{{m.name}}</div>
                    </div>
                  </div>
                </Scroll>
              </div>
            </div>
          </div>

          <!--操作栏-->
          <div class="option_bar">
            <button type="button" class="btn btn-primary" @click="AddRole()"   :disabled="isLook" style="margin-right:5px;">保存</button>
            <button type="button" class="btn btn-default" @click="clearData()" :disabled="isLook">取消</button>
          </div>
       </div>
    </div>
</template>

<script>
import Scroll from '@/components/Scroll'

export default {
  name: 'RoleList',
  components:{Scroll},
  data () {
    return {
      roles:[],
      roleId:'',
      roleName:'',
      roleObject:'',
      selMenuIds:[],
      powers:[],
      blnPatrols:false,
      blnInner:ser.netVersion,
      rolesObject:[], //角色对象
      isLook:false,
      isNoDropChangeRole:false,//是否不是下拉框选择改变角色对象
    }
  },
  watch:{
    roleObject(){
      if(!this.roleObject || !this.isNoDropChangeRole){this.selMenuIds=[];}
      if(this.isNoDropChangeRole){this.isNoDropChangeRole=false}

      this.$nextTick(()=>{
       this.roleObject && this.$refs.powerScroll.reloadyScroll();
      })
    }
  },
  computed:{
    ShowPowers(){
      let powers=_.filter(_t.Clone(this.powers),m=>m.menus.length>0);
      
      if(this.roleObject=='sys_admin') return powers;
      
      _.each(powers,m=>{
        m.menus=_.filter(m.menus,d=>{
          return d.filter_group_type && (','+d.filter_group_type.join(',')+',').indexOf(','+this.roleObject+',')>=0 
        })

      });
      
      powers=_.filter(powers,m=>m.menus.length>0)
      return _.chain(powers).pluck('menus').flatten().value().length>0?powers:_.filter(_t.Clone(this.powers),m=>m.menus.length>0);
    }
  },
  mounted(){
    this.GetRoles();
    this.GetRolesObject();
    this.GetMenus();
  },
  methods:{
    refresh(){
      this.GetRoles();
      this.GetRolesObject();
    },
    layout(){
      this.$refs.roleScroll.reloadyScroll();
      this.roleObject && this.$refs.powerScroll.reloadyScroll();
    },
    //获取角色列表
    GetRoles(){
      ser.GetRolesObject().then(res=>{
          if(!_t.msg(res,'','获取角色列表失败!')) return;
          this.roles=res.biz_body;
      });
    },
    //获取角色对象
    GetRolesObject(){
      ser.GetRoles().then(res=>{
          if(!_t.msg(res,'','获取角色对象列表失败!')) return;
          this.rolesObject=res.biz_body;
      });
    },
    //获取菜单数据
    GetMenus(){
      ser.User_GetPermissionsMenu().then(res=>{
        if(!_t.msg(res,'','获取权限菜单失败!')) return;
        this.powers=res.biz_body;
      });
    },
    //新增/修改角色
    AddRole(){
      if(!this.roleName){_t.info('角色名必填！');return;}
      if(this.roleName.length>10){_t.info('角色名不能超过10个字符！');return;}
      if(!this.roleObject){_t.info('角色对象必选');return;}

      let param={
        name:this.roleName,
        permission:this.selMenuIds,
        userGroupType:this.roleObject,
        sitepatrol: this.blnPatrols,
      };
      if(this.roleId){param.userGroupId=this.roleId}
      
      
      ser[this.roleId?'User_Update_Role':'User_Add_Role'](param).then(res=>{
        if(!_t.msg(res,`${this.roleId?'修改':'新增'}成功!`)) return;

        if(this.roleId){
          let role = _.find(this.roles,r=>r.userGroupId==this.roleId);
          if(role){Object.assign(role,param)}
                    console.log(role);
        }else{//新增
          param.userGroupId=res.biz_body.user_group_id;
          this.roles.unshift(param);
        }
        this.clearData();
      })
    },
    //删除角色
    removeRole(d,i){
      _t.confirm('您确定要删除该角色吗？',['确定','取消'],()=>{
          
          ser.User_Remove_Role(d.userGroupId).then(res=>{
            if(!_t.msg(res,'删除成功!')) return;

            this.roles.splice(i,1);
            this.clearData();
          });

      },function(){});
    },
    //修改角色
    updateRole(d){
      if(d.name=='系统管理员'){_t.info('系统管理员角色不能被修改!'); return;}
      this.isNoDropChangeRole=true;
      this.selMenuIds=_t.isArray(d.permission)?d.permission:JSON.parse(d.permission);

      this.roleObject=d.userGroupType;
      this.blnPatrols=d.sitepatrol;
      this.roleName=d.name;
      this.roleId=d.userGroupId;
      this.isLook=false;
      
    },
    //查看角色信息
    lookInfo(d){
      this.updateRole(d);
      this.isLook=true;
    },
    //选择或取消菜单
    selMenu(d){
      let index=_.findIndex(this.selMenuIds,s=>s==d.keyid);
      if(index>-1){
        this.selMenuIds.splice(index,1);
        return;
      }
      this.selMenuIds.push(d.keyid);
    },
    //清空新增角色设置的数据
    clearData(){
      this.roleName='';
      this.roleObject='';
      this.selMenuIds=[];
      this.blnPatrols=false;
      this.roleId='';
      this.isLook=false;
    },
    //是否包含选中的菜单
    blnSelMenu(d){
      return _.findIndex(this.selMenuIds,s=>{
        return s=='*' || s==d.keyid
      })>=0;
    },
  }
}
</script>

<style scoped lang="less">
.RoleList{width:100%;height:100%;padding:15px;box-sizing: border-box;}

@LeftRoleW:300px;
.RoleList .left_role{width:@LeftRoleW;height:100%;.border('');float:left;}
.RoleList .right_container{margin-left:@LeftRoleW+15px;height:100%;.border('');}

@TitleBarH:50px;
.RoleList .left_role .title_bar{height:@TitleBarH;line-height:@TitleBarH;width:100%;text-align:center;padding:0px 10px;font-weight:600;position:relative;box-sizing: border-box;}

.RoleList .left_role .title_bar i{float:right;cursor:pointer;margin-top:18px;font-size:14px;}

.RoleList .left_role .list_bar{height:~'calc(100% - @{TitleBarH})';width:100%;}

.RoleList .left_role .list_bar .role_item{line-height:30px;padding:0px 15px;text-align:left;cursor:pointer;}
.RoleList .left_role .list_bar .role_item .el-tooltip{float:right;cursor:pointer;margin-left:10px;margin-top:10px;}

.RoleList .left_role .list_bar .role_item:hover{color:white;}

@OptionBarH:50px;

.RoleList .right_container .content_show{height:~'calc(100% - @{OptionBarH})';width:100%;.border('bottom');}
.RoleList .right_container .option_bar{text-align:right;padding:0px 10px;line-height:@OptionBarH;}

@BaseInfoW:400px;
.RoleList .right_container .baseInfo{width:@BaseInfoW;height:100%;.border('right');float:left;position:relative;}
.RoleList .right_container .featruePower{margin-left:@BaseInfoW;height:100%;}

.RoleList .right_container .featruePower .title_bar,
.RoleList .right_container .baseInfo .title_bar{height:@TitleBarH;line-height:@TitleBarH;width:100%;text-align:center;padding:0px 10px;font-weight:600;font-size:20px;box-sizing: border-box;}

.RoleList .right_container .featruePower .content_bar,
.RoleList .right_container .baseInfo  .content_bar{height:~'calc(100% - @{TitleBarH})';width:100%;box-sizing: border-box;}

.RoleList .right_container .baseInfo  .content_bar .item{    margin: 10px auto;width: 260px;text-align: left;}

.RoleList .right_container .baseInfo  .content_bar .item .check_item{cursor:pointer;display:inline-block;border:1px solid;padding:5px 10px;border-radius:5px;font-size:12px;}

.RoleList .right_container .baseInfo  .content_bar .item .check_item i{margin-right:10px;font-size:20px;}
.RoleList .right_container .baseInfo  .content_bar .item .check_item span{float:right;margin-top:2px;}

.RoleList .right_container .baseInfo  .content_bar  .tip_info{text-align:left;color:#b0b0b0;padding:20px;position:absolute;top:50%;}
.RoleList .right_container .baseInfo  .content_bar  .tip_info .title{text-align:center;margin-bottom:10px;}

.RoleList .right_container .featruePower .content_bar{text-align:left;padding:15px;}

@KindSize:100px;
.RoleList .right_container .featruePower .content_bar .kind{margin-bottom:15px;}
.RoleList .right_container .featruePower .content_bar .kind .title{font-size: 14px;font-style: italic;font-weight: 600;}

.RoleList .right_container .featruePower .content_bar .kind .child_item{margin-right:10px;cursor:pointer;margin-top:5px;width:@KindSize;height:@KindSize;.border('');text-align:center;display:inline-block;position:relative;}

.RoleList .right_container .featruePower .content_bar .kind .child_item i {display:block;font-size:40px;padding:10px 0px;}

.RoleList .right_container .featruePower .content_bar .kind .child_item  .info{position:absolute;bottom:10px;width:100%;}

.RoleList .right_container .featruePower .content_bar .kind .child_item.active:hover{color:white !important;}
.RoleList .right_container .featruePower .content_bar .kind .child_item.active{color:white;}
</style>


