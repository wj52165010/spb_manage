<!-- 用户管辖范围详情页面组件 -->
<template>
    <div class="AreaDetail">
        <div class="row" style="margin:0px;height:calc(100% - 44px);" >
          <div style="border:1px solid #e7eaec;border-radius:5px;padding:0px;height:100%;width: 45%;">
                <PlaceTree ref="placeTree" :rootNode="rootNode" :defval="selRegion"  @res="PlaceResult"></PlaceTree>
          </div>
          <div style="border:1px solid #e7eaec;border-radius:5px;padding-top:10px;padding-bottom:10px;padding-right:0px;height: 404px;width: 45%;margin-left: 9%;padding-left: 10px; box-sizing: border-box;
" >
              <Scroll :listen="selPlaces">
                  <div v-for="(p,i) in selPlaces" :key="i" style="margin-bottom:5px;padding-right:40px;position:relative;padding-left:20px;">
                      <span style="font-size:12px;position:absolute;left:0px;top:3px;">{{i+1}}.</span>{{p.name}} 
                  </div>
              </Scroll>
          </div>
        </div>

        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="update()" style="margin-right:5px;">修改</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
    </div>
</template>

<script>
import PlaceTree from '@/components/PlaceTree'
import Scroll from  '@/components/Scroll'

export default {
  name: 'AreaDetail',
  props:['region','data'],
  components:{PlaceTree,Scroll},
  data () {
    return {
        rootNode:JSON.parse(_t.cookie.get('region_code_obj')),//根节点数据
        selRegion:[],
        selPlaces:[],
    }
  },
  mounted(){
    this.selRegion=this.region;
  },
  methods:{
    //场所区域选择改变事件
    PlaceResult(d){
        let res =  _.chain(d).values().flatten().value();
        this.selPlaces=res;
    },
    update(){
  
      this.data.region_code=_.map(this.selPlaces,s=>{
        return {
                name: s.name, 
                code: s.code, 
                type: s.type
              };
      });

      let data=_t.Clone(this.data);
      data.regionCode=this.data.region_code;
      data.permission=JSON.parse(data.permission || '[]');

      ser.User_Update(data).then(res=>{
        if(!_t.msg(res,`修改成功!`,`修改失败!`)) return;
        this.data.region_str_c=_.map(this.selPlaces,s=>s.name).join(',');
        this.cancel();
      });
    },
    cancel(){
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped lang="less">
.AreaDetail{width:100%;height:100%;padding:5px;box-sizing: border-box;text-align:left;}

</style>
