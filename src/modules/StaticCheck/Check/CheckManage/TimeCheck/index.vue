<!-- 定时考核页面插件 -->
<template>
    <div class="TimeCheck">
        <div class="row lineHeight">
            <label class="col-md-2 control-label">考核名称:</label>
            <div class="col-md-4">
                <el-input v-model="sum.task_title" placeholder="请输入名称"></el-input>   
            </div>
        </div>      
        <div class="row lineHeight">
            <label class="col-md-2 control-label">间隔天数:</label>
            <div class="col-md-4">
                <el-input v-model="sum.interval" placeholder="间隔时间"></el-input>                                           
            </div>
        </div>        
        <div class="row lineHeight">
            <label class="col-md-2 control-label">考核规则:</label>
            <div class="col-md-4">
                <el-select v-model="sum.firm_use_standard" placeholder="厂商规则" :clearable="true">
                    <el-option v-for="(kind,i) in firms" :key="i" :label="kind.standardTitle" :value="kind.standardId"></el-option>
                </el-select>
            </div>
            <div class="col-md-4">
                <el-select v-model="sum.region_use_standard" placeholder="区域规则" :clearable="true">
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
  name: 'TimeCheck',
  components:{},
  data(){
    return {
       firms:[],
       regions:[],
       sum:{}

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

        //获取定时考核任务数据
        ser.GetTimeRule().then(res=>{
            this.sum=res.biz_body || {};
        });
    },
    submit(){
        let reg=/^\+?[1-9][0-9]*$/;
        if(!this.sum.task_title || !this.sum.interval){
            _t.tipFailure('考核名称，间隔天数必填!');
            return;
        }
        if(!reg.test(this.sum.interval)){
            _t.tipFailure('间隔天数必须为正数!');
            return;
        }
        
        if(!this.sum.firm_use_standard && !this.sum.region_use_standard){
            _t.tipFailure('厂商规则和区域规则必须选择一个!');
            return;
        } 

        let temp={
            "firmTaskId": this.sum.firm_task_id || '',
            "firmUseStandard": this.sum.firm_use_standard,
            "interval": +(this.sum.interval || 0),
            "regionTaskId": this.sum.region_task_id || '',
            "regionUseStandard": this.sum.region_use_standard,
            "taskTitle": this.sum.task_title
        };

        ser.UpdateTimeRule(temp).then(res=>{
            if(!_t.msg(res,'添加成功!')) return;
            this.cancel(true);
        });
    },
    cancel(blnFlag){this.$emit('cancel',blnFlag);}
  }
}
</script>

<style lang="less" scoped>
.TimeCheck{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;}
.lineHeight{line-height:32px;}
</style>