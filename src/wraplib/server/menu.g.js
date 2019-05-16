export default{
    /**
     * 获取菜单类别
     * params:{
        title: ‘’, 
        id:  0, 
        isDel: 0,  //0为不能删
        isDefault: 1  //1为默认菜单类型，0为不是默认

      }
    */
    GetMenuKind(data){
        this.baseBag.target='menu_type';
        this.baseBag.method='get';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    //获取自定义模块数据(keyid不传代表获取全部数据)
    getOperate(data){
        this.baseBag.target='custom_module';
        this.baseBag.method='get';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    }
}