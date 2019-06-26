<!-- 用户管辖范围页面组件 -->
<template>
    <div class="UserContrlScope">
        <!--角色列表下拉框-->
        <div class="dropDown" v-if="!blnUpdate">
          <span><span style="color:red;">*</span>角色列表</span>
          <div class="dropDownItem">
            <el-select v-model="role" placeholder="请选择" :clearable="true">
                <el-option
                    v-for="kind in Roles"
                    :key="kind.userGroupId"
                    :label="kind.name"
                    :value="kind.userGroupId">
                </el-option>
            </el-select>
          </div>
        </div>

        <!--厂商名称-->
        <div class="dropDown" v-if="blnShowFirm">
          <span><span style="color:red;">*</span>厂商名称</span>
          <div class="dropDownItem">
            <FrimSel v-model="firm" :simple="true" />
          </div>
        </div>

        <!--管辖范围选择-->
        <div class="row" style="margin:0px;margin-bottom:10px;" v-if="!blnShowFirm">
          <div style="border:1px solid #e7eaec;border-radius:5px;padding:0px;float:left;width: 50%;" :style="{height:blnShowFirm?'300px':!blnUpdate?'336px':'386px'}">
              <dropdwonBtn style="border:none;border-bottom:1px solid white;border-radius:0px;"  placeholder="请输入场所编码/名称/拼音" ref="placeDwon" :store="$store" :data="siteSearch" :btn="placeBtn" @change="placeChange" @selPlaceAction="selPlaceAction">
                  <div v-for="(s,i) in siteSearch" :key="i" @mousedown="placeSearch_click(s)">{{s.name}}</div>
              </dropdwonBtn> 
              <div :style="{height:blnShowFirm?'260':!blnUpdate?'296px':'346px'}">
                  <PlaceTree ref="placeTree" :rootNode="rootNode" :defval="selRegion" @res="PlaceResult"></PlaceTree>
              </div>
          </div>
          <div style="border:1px solid #e7eaec;border-radius:5px;float: right;width: 38%;margin-left: 5%;padding-top: 10px;padding-bottom: 10px;padding-left: 10px;" :style="{height:blnShowFirm?'280px':!blnUpdate?'316px':'366px'}">
              <Scroll :listen="selPlaces">
                  <div v-for="(p,i) in selPlaces" :key="i" style="margin-bottom:5px;padding-right:40px;position:relative;padding-left:20px;">
                      <span style="font-size:12px;position:absolute;left:0px;top:3px;">{{i+1}}.</span>
                      <span>{{p.name}}</span>
                      <i @click="delPlace(p)" class="fa fa-remove delPlaceItem" style="position:absolute;right:20px;top:3px;"></i>
                  </div>
              </Scroll>
          </div>
        </div>
    </div>
</template>

<script>
import PlaceTree from '@/components/PlaceTree'
import Scroll from  '@/components/Scroll'
import dropdwonBtn from '@/components/DropdwonBtn'
import FrimSel from '@/modules/components/FrimSel'

import {GetSitesByInfo} from '@/store/SiteManage/types'
export default {
  name: 'UserContrlScope',
  props:['blnUpdate'],
  components:{PlaceTree,Scroll,dropdwonBtn,FrimSel},
  data () {
    return {
      rootNode:JSON.parse(_t.cookie.get('region_code_obj')),//根节点数据
      role:'',
      firm:'',
      selPlaces:[],
      siteSearch:[],
      placeBtn:{name:'选择',action:'selPlaceAction'},
      selRegion:[],
      n_selRegion:[],
      selPlace:null,
      blnShowFirm:false,
      Roles:[],
      Firms:[],
    }
  },
  watch:{
    role(){
        this.blnShowFirm=_.find(this.Roles,r=>r.userGroupId==this.role && r.userGroupType=='firm');
        this.triggerChnage();
    },
    Roles(){
        this.blnShowFirm=_.find(this.Roles,r=>r.userGroupId==this.role && r.userGroupType=='firm');
        this.triggerChnage();
    },
    blnShowFirm(){
        if(!this.blnShowFirm && this.Roles.length>0)this.firm='';
        this.selPlaces=[];
    },
    firm(){this.triggerChnage();}
  },
  mounted(){
    this.GetRoles();
  },
  methods:{
    Valid(){
      let res=(this.blnUpdate?true:!!this.role);
      return res;
    },
    triggerChnage(){
      this.$emit('valid');
    },
    //获取角色对象列表集合
    GetRoles(){
        ser.GetRolesObject().then(res=>{
            if(!_t.msg(res,'','获取角色列表失败!')) return;
            this.Roles=res.biz_body;
        });
    },
    //场所区域选择改变事件
    PlaceResult(d){
        let res =  _.chain(d).values().flatten().value();
        this.selPlaces=res;
    },
    //删除选中的场所节点
    delPlace(d){
        this.$refs.placeTree.checkOut(d.code);

        let index = _.findIndex(this.n_selRegion,s=>s.code==d.code);
        if(index<0) return;
        this.n_selRegion.splice(index,1);

    },
    placeSearch_click(val){
        this.$refs.placeDwon.setVal(val.name);

        this.selPlace={code:val.code,type:3};
    },
    placeChange(val){
        var store=this.$store || this.store;

        if(!val) return;

        store.dispatch(GetSitesByInfo,{condition:val, types:'1',$role:this.$role}).then((code)=>{
            //默认只取前十条数据
            let sites=code.sites || [];
            this.siteSearch=sites.slice(0,10);

        });
    },
    selPlaceAction(){
        if(!this.selPlace){_t.info('请选择场所!');return;}
        let s=this;
        if(_.find(this.n_selRegion,c=>c.code==s.selPlace.code)) return;
        _.each(this.selPlaces,c=>{
            if(!_.find(this.n_selRegion,d=>d.code==c.code)){
                this.n_selRegion.push({code:c.code,type:c.type});
            }
        })
        

        this.n_selRegion.push(s.selPlace);

        this.selRegion=[...this.n_selRegion]
    }
  }
}
</script>

<style scoped lang="less">
.UserContrlScope{width:100%;height:100%;padding:0px 20px;box-sizing: border-box;text-align:left;font-size:14px;}
.UserContrlScope .dropDown{text-align:left;margin-bottom:10px;}
.UserContrlScope .dropDown .dropDownItem{display:inline-block;width:300px;}
</style>
