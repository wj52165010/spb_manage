export default{
    /**
     * 获取角色对象列表
     * 
     */
    GetRoles(){
        //this.baseBag.target='user_group';
        this.baseBag.type="GET";
        this.baseBag.method='userGroups/type';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    /**
     * 获取角色集合
     * 
     */
    GetRolesObject(){
        //this.baseBag.target='user_group';

        this.baseBag.type="GET";
        this.baseBag.method='userGroups';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    /**
     * 修改角色
     * params{
     *  name: '', //角色名
        permission: [], //选择的菜单keyid 数组
        user_group_type: '', //sys_admin、net_safe、firm
        is_sitepatrol: 0, //0不接收，1接收
     * } 
     */
    User_Update_Role(data){
        this.baseBag.type="PATCH";
        //this.baseBag.target='user_group';
        this.baseBag.method='userGroups';
        this.baseBag.data=data ||{};
        return this.post(this.baseBag);
    },
    /**
     * 添加角色
     * params{
     *  name: '', //角色名
        permission: [], //选择的菜单keyid 数组
        user_group_type: '', //sys_admin、net_safe、firm
        is_sitepatrol: 0, //0不接收，1接收

     * } 
     */
    User_Add_Role(data){

        this.baseBag.type="POST";
        //this.baseBag.target='user_group';
        this.baseBag.method='userGroups';
        this.baseBag.data=data ||{};
        return this.post(this.baseBag);
    },
    /**
     * 删除角色
     * params{
     *  name: '', //角色名
        user_group_id: '', //角色编码
     * } 
     */
    User_Remove_Role(user_group_id){
        this.baseBag.type="DELETE";
        this.baseBag.path=true;
        //this.baseBag.target='user_group';
        this.baseBag.method='userGroups';
        this.baseBag.data={id:user_group_id || ''};
        return this.post(this.baseBag);
    },
    /**
     * 获取用户集合对象
     * 
     */
    GetUsers({user_key,
              user_group_type,
              start_time,
              end_time,
              ...rest
            }){
        //this.baseBag.target='user';
        this.baseBag.type="GET";
        this.baseBag.method='userInfo';

        rest.query=JSON.stringify({user_key,user_group_type,start_time,end_time});
        this.baseBag.data=rest;
        return this.post(this.baseBag);
    },
    /**
     * 获取当前用户可以设置的权限菜单
     * params{
     *  
     * } 
     */
    User_GetPermissionsMenu(){
        this.baseBag.type='GET';
        this.baseBag.method='userGroups/permissionMenu';
        this.baseBag.data={};
        return this.post(this.baseBag);
    },
    /**
     * 修改用户状态
     * 
     */
    UpdateUserStauts(data){
        this.baseBag.type="PATCH";
        //this.baseBag.target='user';
        this.baseBag.method='userInfo/status';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    /**
     * 删除用户 
     * 
     */
    DelUser(data){
        this.baseBag.type="DELETE";
        //this.baseBag.target='user';
        this.baseBag.method='userInfo';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    /**
     * 根据角色获取可设置的菜单项
     * params{
     *  gid:''
     * } 
     */
    User_GetPermissionsMenuByGID(data){
        this.baseBag.type='GET';
        this.baseBag.method='userGroups/permissionMenu/gid';
        data.query=JSON.stringify(data.query);
        this.baseBag.data=data;
        return this.post(this.baseBag);
    },
    /**
     * 修改用户 
     * 
     */
    User_Update(data){

        this.baseBag.type="PATCH";
        //this.baseBag.target='user';
        this.baseBag.method='userInfo';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    /**
     * 添加用户
     * params{
     *  account: '账号',
        name: '姓名',
        tel: '', //电话
        email: '', //邮件
        department: '', //部门
        status: '', //状态
        region_code: '' //逗号分隔
        note:''
        is_use_app: 0
        permission: []
        is_auto_load_menu: 0
        firm: '' //如果厂商用户
        groups: [] //角色编号
     * } 
     */
    User_Add(data){
        this.baseBag.type="POST";
        //this.baseBag.target='user';
        this.baseBag.method='userInfo';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    /**
     * 修改用户密码
     * params{
     *  user_id: 0 //被修改用户的id
        new_pwd: '' //被修改用户的密码
        pwd:'' //操作者的密码
     * } 
     */
    User_Update_Pwd(data){
        this.baseBag.type="PATCH";
        //this.baseBag.target='user';
        this.baseBag.method='userInfo/pwd';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    }
}