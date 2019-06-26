<template>
  <div class="UserManage">
    <Tags>
      <!--角色管理-->
      <div solt="name"><i class="fa fa-users" style="margin-right:5px;"></i>用户管理</div>
      <div solt="content"><UserManageIndex /></div>

      <!--用户管理-->
      <div solt="name"><i class="fa fa-cog fa-fw" style="margin-right:5px;"></i>角色管理</div>
      <div solt="content"><RoleList /></div>
    </Tags>
  </div>
</template>
<script>
import Tags from '@/components/Tags'
import UserManageIndex from './UserList/UserManage'
import RoleList from './RoleList'

export default {
  name: 'UserManagePage',
  role:'UserManagePage',
  refresh:true,
  components:{Tags,UserManageIndex,RoleList},
  data() {
    return {
     
    };
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
  .UserManage{width:100%;height:100%;}
</style>