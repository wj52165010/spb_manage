
<!-- 头部页面插件 -->
<template>
    <div class="WarnSet">
        <ListAutoLayout>
            <template slot="header">
                <ListHeader>
                    <ListSearchItem><span style="color:red;">*</span>监控区域</ListSearchItem>
                </ListHeader>
            </template>

            <div style="border:1px solid #e7eaec;border-radius:5px;padding:0px;height:100%;width: 45%;float:left;">
                <PlaceTree ref="placeTree" :rootNode="rootNode" :defval="selRegion"  @res="PlaceResult" kind="1"></PlaceTree>
            </div>
            <div style="height:100%;border:1px solid #e7eaec;border-radius:5px;padding-right:0px;width: 48%;margin-left: 50%; box-sizing: border-box;
    " >
                <Scroll :listen="selPlaces">
                    <div v-for="(p,i) in selPlaces" :key="i" style="line-height:30px;margin-bottom:5px;padding-right:40px;position:relative;padding-left:20px;">
                        <span style="font-size:12px;">{{i+1}}.</span>{{p.name}} <i class="fa fa-remove" @click="remove(p)" style="cursor:pointer;" />
                    </div>
                </Scroll>
            </div>

            <template slot="footer">
                <div class="option_bar subBgColtwoBorder">
                    <span style="color:red;">*</span>监控时间
                    <el-date-picker v-model="time_range" style="width:250px;" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                </div>
                <div style="text-align:right;padding:10px;">
                    <RawButton type="submit"  @inClick="submit()" :disabled="!blnCanAdd" style="margin-right:5px;">确定</RawButton>
                    <RawButton type="cancel"  @inClick="cancel()">关闭</RawButton>
                </div>
            </template>
        </ListAutoLayout>
        
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'
import PlaceTree from '@/components/PlaceTree'
import Scroll from '@/components/Scroll'

export default {
  name: 'WarnSet',
  props:['ids','leave'],
  components:{ListAutoLayout,PlaceTree,ListHeader,ListSearchItem,Scroll},
  data(){
    return {
        simpleTime:{
          disabledDate(time) {
            let now=new Date();
            now.setDate(now.getDate()-1)
            return time.getTime() <= now;
          }
        },
        rootNode:JSON.parse(_t.cookie.get('region_code_obj')),//根节点数据
        selRegion:[],
        selPlaces:[],
        time_range:null,
    }
  },
  computed:{
    blnCanAdd(){
        return this.selPlaces.length>0 && 
               this.time_range
    }
  },
  methods:{
    //场所区域选择改变事件
    PlaceResult(d){
        this.selPlaces =  _.chain(d).values().flatten().value();
    },
    //删除选中项
    remove(d){
        this.$refs.placeTree.checkOut(d.code);
    },
    submit(){
        let resData=_.map(this.ids,i=>{
            return {
                "entranceBeginTime": this.time_range?_t.Timestamp(this.time_range[0]):0,
                "entranceEndTime": this.time_range?_t.DateTimestampByEndTime(this.time_range[1]):0,
                "focusId": i,
                "focusLocusIds": '|'+_.map(this.selPlaces,s=>s.code).join('|')+'|'
            };
        });

        ser[!this.leave?'BatchInWarn':'BathLeaveWarn'](resData).then(res=>{
            if(!_t.msg(res,'设置成功!')) return;
            this.cancel();
        });

    },
    cancel(){this.$emit('cancel')}
  }
}
</script>

<style lang="less" scoped>
.WarnSet{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;overflow:hidden;}
.WarnSet .option_bar{
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    .border('top');
}
</style>