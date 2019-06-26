<!-- 预警设置页面插件 -->
<template>
    <div class="WarnSet">
        <!--出现预警-->
        <div class="relativeInfo">
            <div class="title">
                <span class="sub">出现预警</span>
                <span class="subInfo">
                    {{query.BlnApper?'已启用':'未启用'}}
                    <span v-if="query.BlnApper && (!query.apper_time_range || !query.apper_netsite_range)" style="margin-left:10px;color:red;">
                        (监控范围和监控周期必填)
                    </span>
                </span>
                <span style="float:right;">
                    <RawButton :type="query.BlnApper?'cancel':'submit'"  @inClick="apperChange()" style="margin-right:5px;">{{query.BlnApper?'关闭':'启用'}}</RawButton>
                </span>
                <div class="clearfix"></div>
            </div>
            <div class="content">
                <div class="row">
                    <div class="col-md-2 text-right text-middle"><span style="color:red;">*</span>监控范围 : </div>
                    <div class="col-md-10">
                         <PlaceSearch :defautVal="query.apperNetsiteRange" :blnClear="true" c_searchKind="0" @place_res="selectRegion" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 text-right text-middle"><span style="color:red;">*</span>监控周期 : </div>
                    <div class="col-md-10">
                        <el-date-picker v-model="query.apper_time_range" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                    </div>
                </div>
            </div>
        </div>

        <!--离开预警-->
        <div class="leaveInfo">
            <div class="title">
                <span class="sub">离开预警</span>
                <span class="subInfo">
                    {{query.BlnLeave?'已启用':'未启用'}}
                    <span v-if="query.BlnLeave && (!query.leave_time_range || !query.leave_netsite_range)" style="margin-left:10px;color:red;">
                        (监控范围和监控周期必填)
                    </span>
                </span>
                <span style="float:right;">
                    <RawButton :type="query.BlnLeave?'cancel':'submit'"  @inClick="leaveChange()" style="margin-right:5px;">{{query.BlnLeave?'关闭':'启用'}}</RawButton>
                </span>
                <div class="clearfix"></div>
            </div>
            <div class="content">
                <div class="row">
                    <div class="col-md-2 text-right text-middle"><span style="color:red;">*</span>监控范围 : </div>
                    <div class="col-md-10">
                         <PlaceSearch :defautVal="query.leaveNetsiteRange" :blnClear="true" c_searchKind="0" @place_res="selectLeaveRegion" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2 text-right text-middle"><span style="color:red;">*</span>监控周期 : </div>
                    <div class="col-md-10">
                        <el-date-picker v-model="query.leave_time_range" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import PlaceSearch from '@/modules/SiteManage/components/PlaceSearch'
export default {
  name: 'WarnSet',
  props:['id'],
  components:{PlaceSearch},
  data(){
    return {
        simpleTime:{
            disabledDate(time) {
                let now=new Date();
                now.setDate(now.getDate()-1)
                return time.getTime() <= now;
            }
        },
        query:{
            BlnApper:false,
            apper_time_range:null,
            apper_netsite_range:[],
            apperNetsiteRange:'',
            BlnLeave:false,
            leave_time_range:null,
            leave_netsite_range:[],
            leaveNetsiteRange:''
        },
    }
  },
  watch:{
    blnSubmit(){
        this.$emit('validChange',this.blnSubmit);
    },
  },
  computed:{
    blnSubmit(){
        return (this.query.BlnApper && 
               this.query.apper_time_range &&
               this.query.apper_netsite_range.length>0 || !this.query.BlnApper) &&
               
               (this.query.BlnLeave &&
               this.query.leave_time_range &&
               this.query.leave_netsite_range.length>0 || !this.query.BlnLeave);
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    //获取数据
    GetData(){
        ser.GetInWarn(this.id).then(res=>{
            let data=res.biz_body || {};
            data.focusLocusIds=data.focusLocusIds || '';
            data.focusLeaveLocusIds=data.focusLeaveLocusIds || '';
            
            this.query.BlnApper=!!data.entranceIsAlarm;
            this.query.apper_time_range=data.entranceBeginTime?[new Date(data.entranceBeginTime),new Date(data.entranceEndTime)]:'';
            this.query.apper_netsite_range=_.map(_.compact(data.focusLocusIds.trim('|').split('|')),c=>{ return {code:c}});
            this.query.apperNetsiteRange=JSON.stringify(_.map(_.compact(data.focusLocusIds.trim('|').split('|')),c=>{ return {code:c}}));
            this.query.BlnLeave=!!data.leaveIsAlarm;
            this.query.leave_time_range=data.leaveBeginTime?[new Date(data.leaveBeginTime),new Date(data.leaveEndTime)]:'';
            this.query.leave_netsite_range=_.map(_.compact(data.focusLeaveLocusIds.trim('|').split('|')),c=>{ return {code:c}});
            this.query.leaveNetsiteRange=JSON.stringify(_.map(_.compact(data.focusLeaveLocusIds.trim('|').split('|')),c=>{ return {code:c}}));
        });
    },
    //场所范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,和区域范围选择类似
    selectRegion(val,data){
        if(data){           
            this.query.apper_netsite_range=data.regions;
        }else{
            this.query.apper_netsite_range="";
        }
    },
    selectLeaveRegion(val,data){
        if(data){           
            this.query.leave_netsite_range=data.regions;
        }else{
            this.query.leave_netsite_range="";
        }
    },
    apperChange(){
        if(!this.query.BlnApper && (!this.query.apper_time_range || this.query.apper_netsite_range.length<0)){
            _t.tipFailure('请设置监控范围和监控周期!'); return;
        }
        this.query.BlnApper=!this.query.BlnApper
    },
    leaveChange(){
        if(!this.query.BlnLeave && (!this.query.leave_time_range || this.query.leave_netsite_range.length<0)){
            _t.tipFailure('请设置监控范围和监控周期!'); return;
        }
        this.query.BlnLeave=!this.query.BlnLeave
    },
    submit(callback){
        let inLocusIds=_.map(this.query.apper_netsite_range,r=>r.code).join('|'),
            leaveLocusIds=_.map(this.query.leave_netsite_range,r=>r.code).join('|');

        ser.UpdateInWarn({
            "entranceBeginTime": this.query.apper_time_range?_t.Timestamp(this.query.apper_time_range[0]):'',
            "entranceEndTime": this.query.apper_time_range?_t.DateTimestampByEndTime(this.query.apper_time_range[1]):'',
            "entranceIsAlarm": this.query.BlnApper?1:0,
            "focusId": this.id,
            "focusLeaveLocusIds":leaveLocusIds?`|${leaveLocusIds}|`:'' ,
            "focusLocusIds": inLocusIds?`|${inLocusIds}|`:'',
            "leaveBeginTime": this.query.leave_time_range?_t.Timestamp(this.query.leave_time_range[0]):'',
            "leaveEndTime": this.query.leave_time_range?_t.DateTimestampByEndTime(this.query.leave_time_range[1]):'',
            "leaveIsAlarm": this.query.BlnLeave?1:0,
        }).then(res=>{
            if(!_t.msg(res,'设置成功!')) return;

            callback && callback();
        });
   
    }
  }
}
</script>

<style lang="less" scoped>
.WarnSet{width:100%;height:100%;box-sizing:border-box;}

.WarnSet  .title {margin-bottom:10px;}
.WarnSet  .title .sub{font-weight:600;margin-right:15px;}
.WarnSet  .title .subInfo{font-size:12px;}

.WarnSet .content{font-size:12px;}
.WarnSet .text-middle{line-height:32px;}
.WarnSet .row{margin-bottom:10px;}

.WarnSet .content{border-bottom:1px solid #cccccc;}
</style>