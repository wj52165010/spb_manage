<!-- 创建聚集配置项插件 -->
<template>
    <div class="AddGatherSet">
        <div  style="margin:0px;height:calc(100% - 44px);" >

          <InputDir ref="taskName" 
                    label="任务名称(默认时间命名)" 
                    @change="taskName_change"       
                    :val="taskName"         
                    />

          <div class="row">
              <div class="col-md-3 text-right text-middle"><span style="color:red;">*</span>监控范围 : </div>
              <div class="col-md-9">
                    <PlaceSearch :blnLike="true" :blnClear="true" c_searchKind="1" @place_res="selectPlace" />
              </div>
          </div>
          <div class="row">
              <div class="col-md-3 text-right text-middle"><span style="color:red;">*</span>监控周期 : </div>
              <div class="col-md-9">
                  <el-date-picker v-model="watch_time_range" type="daterange" placeholder="选择日期" :picker-options="simpleTime"> </el-date-picker>
              </div>
          </div>

          <InputDir 
            label="监控阀值(大于0的整数)" 
            :require="true"
            @change="threshold_change"       
            :val="threshold"
            reg="^[1-9]*$" 
            regTip="必须大于0"         
            />

           <div class="row">
              <div class="col-md-3 text-right" style="line-height:43px;"><span style="color:red;">*</span>统计间隔 : </div>
              <div class="col-md-9">
                  <InputDir 
                  label="大于等于5的整数(/m)" 
                  @change="interval_time_change"       
                  :val="interval_time"
                  reg="[5-9]|[1-9][0-9]" 
                  regTip="必须大于等于5"         
                  />
              </div>
          </div>
        </div>
        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="submit()" :disabled="!blnCanAdd" style="margin-right:5px;">确定</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>
    </div>
</template>

<script>
import InputDir from '@/components/Input'
import PlaceSearch from '@/modules/SiteManage/components/PlaceSearch'

export default {
  name: 'AddGatherSet',
  components:{InputDir,PlaceSearch},
  data(){
    return {
      simpleTime:{
          disabledDate(time) {
            let now=new Date();
            now.setDate(now.getDate()-1)
            return time.getTime() <= now;
          }
      },
      taskName:'',
      sites:[],
      watch_time_range:[],//监控周期
      interval_time:0, //间隔时间
      stay_time:0,//停留时间
      threshold:0,
    }
  },
  computed:{
    blnCanAdd(){
      return this.sites.length>0 &&
             this.watch_time_range && this.watch_time_range.length>0 &&
             this.interval_time>=5 && 
             this.threshold>0
    }
  },
  methods:{
    submit(){
      let addData={
        "endTime": this.watch_time_range?_t.DateTimestampByEndTime(this.watch_time_range[1]):0,
        "gatherValue": this.threshold,
        "interval": this.interval_time,
        "locusIds": _.map(this.sites,s=>s.code).join(','),
        "startTime": this.watch_time_range?_t.Timestamp(this.watch_time_range[0]):0,
        "taskName":this.taskName || _t.DateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')
      };
      ser.AddGatherSetting(addData).then(res=>{
        if(!_t.msg(res,'添加成功!')) return;
        this.$emit('add');

      });

    },
    cancel(){this.$emit('cancel')},
    taskName_change(val){this.taskName=val;},
    threshold_change(val){this.threshold=val;},
    interval_time_change(val){this.interval_time=val;},
    stay_time_change(val){this.stay_time=val;},
    //场所范围的事件回传，第一个参数为上下文环境，第二个参数为具体值,和区域范围选择类似
    selectPlace(val,data){
      if(data){           
          this.sites=data.sites;
      }else{
          this.sites="";
      }
    }
  }
}
</script>

<style lang="less" scoped>
.AddGatherSet{width:100%;height:100%;box-sizing:border-box;padding:15px;text-align:left;}
.AddGatherSet .text-middle{line-height:32px;}
.AddGatherSet .row{margin-top:10px;}
</style>