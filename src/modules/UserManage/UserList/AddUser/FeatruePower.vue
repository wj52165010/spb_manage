
<!-- 用户功能权限页面组件 -->
<template>
    <div class="UserFeatruePower">
        <div class="item clearfix" v-if="blnNet">
          <div class="title">登录APP</div>
          <div class="info">
            <el-switch
              v-model="blnApp" style="margin-top: 2px;">
            </el-switch>
          </div>
        </div>

        <!--<div class="item clearfix">
          <div class="title">自动获取</div>
          <div class="info">
            <el-switch
              v-model="blnAuto" style="margin-top: 2px;">
            </el-switch>

            <span style="float:right;font-size:12px;margin-top: 10px;color:#ccc;"><span style="color:red;">*</span>开启后当有新功能更新时，允许使用新增的功能</span>
          </div>
        </div>-->

        <div class="item clearfix" style="height:calc(100% - 90px)" >
          <div class="title">功能权限</div>
          <div class="info power" style="height:100%;">
            <Scroll :listen="showData" ref="menuSrcoll">
              <div class="powerItem" v-for="(d,i) in showData" :key="i">
                <div class="sub">{{d.name}} :</div>
                <div class="childs">
                    <div class="child_item" v-for="(c,i) in d.menus" :key="i"><el-checkbox v-model="c.checked">{{c.name}}</el-checkbox></div>
                </div>
              </div>
            </Scroll>
          </div>
        </div>
    </div>
</template>

<script>
import Scroll from '@/components/Scroll'

export default {
  name: 'UserFeatruePower',
  props:['roleId'],
  components:{Scroll},
  data () {
    return {
      blnApp:true,
      blnAuto:false,
      data:[],
      selKeyIds:[],
      blnNet:ser.netVersion,
    }
  },
  watch:{
    roleId(){
      this.GetMenus();
    }
  },
  computed:{
    showData(){
      return _.filter(this.data,d=>d.menus.length>0);
    }
  },
  mounted(){
    this.GetMenus();
  },
  methods:{
    //获取权限菜单
    GetMenus(){
      if(!this.roleId) return;
      ser.User_GetPermissionsMenuByGID({query:{gid:this.roleId}}).then(res=>{
        if(!_t.msg(res,'','获取权限菜单失败!')) return;
        this.data=_.map(res.biz_body,r=>{
            r.menus=_.map(r.menus,m=>{
              return Object.assign(m,{checked:this.selKeyIds.join(',').indexOf(m.keyid)>=0});
            });
           
           return r;
        });
      });
    },
    layout(){
     this.$refs.menuSrcoll &&  this.$refs.menuSrcoll.reloadyScroll();
    }
  }
}
</script>

<style scoped lang="less">
.UserFeatruePower{width:100%;height:100%;padding:0px 20px;box-sizing: border-box;text-align:left;}
.UserFeatruePower .item{margin-bottom:10px;}

@titleW:80px;
.UserFeatruePower .item .title{width:@titleW;line-height:30px;float:left;}
.UserFeatruePower .item .info{margin-left:@titleW;}
.UserFeatruePower .item .info.power{.border('');border-radius:5px;}
.UserFeatruePower .item .info.power .powerItem{padding:10px;}
.UserFeatruePower .item .info.power .powerItem .childs{padding:10px 20px;}
.UserFeatruePower .item .info.power .powerItem .childs .child_item{display:inline-block;margin-left:10px;margin-top:10px;}
</style>