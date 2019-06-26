<!-- 新增考核页面插件 -->
<template>
    <div class="AddCheck">
        <div class="row lineHeight">
            <label class="col-md-2 control-label">考核名称:</label>
            <div class="col-md-4">
                <el-input v-model="sum.task_title" placeholder="请输入名称"></el-input>   
            </div>
        </div>      
        <div class="row lineHeight">
            <label class="col-md-2 control-label">考核周期:</label>
            <div class="col-md-6">
                <el-date-picker
                v-model="sum.times"
                type="daterange"
                :picker-options="pickerOptions0"
                placeholder="选择日期范围">
                </el-date-picker>
            </div>
        </div>     
        <div class="row lineHeight">
            <label class="col-md-2 control-label">考核规则:</label>
            <div class="col-md-4">
                <el-select v-model="sum.firm_use_standard" :clearable="true" placeholder="厂商规则" >
                    <el-option v-for="(kind,i) in firms" :key="i" :label="kind.standardTitle" :value="kind.standardId"></el-option>
                </el-select>
            </div>
            <div class="col-md-4">
                <el-select v-model="sum.region_use_standard" :clearable="true" placeholder="区域规则" >
                    <el-option v-for="(kind,i) in regions" :key="i" :label="kind.standardTitle" :value="kind.standardId"></el-option>
                </el-select>
            </div>
        </div>

        <div style="text-align:right;margin-top:10px;">
          <RawButton type="submit"  @inClick="submit()" style="margin-right:5px;">确定</RawButton>
          <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
        </div>               
    </div>
</template>

<script>

export default {
  name: 'AddCheck',
  components:{},
  data(){
    return {
        pickerOptions0: {                      //时间范围
            disabledDate(time) {
                return time.getTime() >Date.now() - 8.64e7; //默认只能选择今天及今天以前的日期
            }
       },
       firms:[],
       regions:[],
       sum:{},
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        //获取考核规则信息
        ser.GetExamineTaskRule({query:{check_target:'firm'}}).then(res=>{
            this.firms=res.biz_body;
        });

        ser.GetExamineTaskRule({query:{check_target:'region'}}).then(res=>{
            this.regions=res.biz_body;
        });
    },
    submit(){
        if(!this.sum.task_title || !this.sum.times){
            _t.info('考核名称，考核周期必填!');
            return;
        }
        if(!this.sum.firm_use_standard && !this.sum.region_use_standard){
            _t.info('厂商规则和区域规则必须选择一个!');
            return;
        }


        let temp={
            "beginTime": this.sum.times?_t.Timestamp(this.sum.times[0]):0,
            "endTime": this.sum.times?_t.DateTimestampByEndTime(this.sum.times[1]):0,
            "firmUseStandard": this.sum.firm_use_standard,
            "regionUseStandard": this.sum.region_use_standard,
            "taskTitle": this.sum.task_title
        };
        ser.AddExamineTask(temp).then(res=>{
            if(!_t.msg(res,'操作成功!')) return;
            this.cancel(true);
        });
    },
    cancel(blnFlag){this.$emit('cancel',blnFlag)}
  }
}
</script>

<style lang="less" scoped>
.AddCheck{width:100%;height:100%;box-sizing:border-box;text-align:left;padding:10px}
.lineHeight{line-height:32px;margin-bottom:5px;}
</style>