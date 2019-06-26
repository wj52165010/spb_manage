//登录相关接口

export default{
    /**
     * 获取新的token
     */
    GetNewToken(token){
        this.baseBag.target='user';
        this.baseBag.method='refreshToken';
        this.baseBag.data= {token:token || ''};
        return this.post(this.baseBag);
    },
    /**
     * 注销账户(首页)
     * 
     * 
     */
    LoginOut(account){
        //this.baseBag.target='user';
        this.baseBag.type="POST"
        this.baseBag.method='logout';
        this.baseBag.data= {account:account || ''};
        return this.post(this.baseBag);
    },
    /**
     * 账户强制登录(首页)
     * 
     * 
     */
    LoginForce(account){
        //this.baseBag.target='user';
        this.baseBag.type='POST'
        this.baseBag.method='loginForce';
        this.baseBag.data= {account:account || ''};
        return this.post(this.baseBag);
    },
    /**
     * 用户登录(/user/login)
     * data:{
     *    account: ‘’,
        pwd: ‘’ 
     * }
     */
    Login(data){
        //this.baseBag.target='user';
        this.baseBag.type="POST"
        this.baseBag.method='login';
        this.baseBag.data=data || {};
        return this.post(this.baseBag);
    },
    /**
     * 获取用户信息(/user/get)
     */
    GetUser(id){
        this.baseBag.target='user';
        this.baseBag.method='get';
        this.baseBag.data={user_id:id || ''};
        return this.post(this.baseBag);
    }
}