<!-- 头部页面插件 -->
<template>
    <div class="AddPersonLabel">
        <div  style="margin:0px;height:calc(100% - 44px);" >

            <div class="row">
                <div class="col-md-4 text-right text-middle"><span style="color:red;">*</span>标签名称 : </div>
                <div class="col-md-8">
                    <el-input placeholder="请输入" v-model="label" ></el-input> 
                </div>
            </div>

            <div class="row">
                <div class="col-md-4 text-right text-middle">聚集预警 : </div>
                <div class="col-md-8">
                    <el-select
                        v-model="gather"
                        multiple
                        collapse-tags
                        placeholder="请选择">
                        <el-option
                        v-for="item in gathers"
                        :key="item.taskId+''"
                        :label="item.taskName"
                        :value="item.taskId+''"
                        :disabled="item.disabled"
                        >
                          <span style="float: left">{{ item.taskName }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px;margin-left:20px;" v-if="item.disabled"><i class="fa fa-ban" /></span>
                        </el-option>
                    </el-select>
                </div>
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
  name: 'AddPersonLabel',
  props:['data'],
  data(){
    return {
      gathers:[],
      label:'',
      gather:'',
    }
  },
  watch:{
    data(){
      if(!this.data) return;
      this.label=this.data.tagTitle;
      this.gather=this.data.gatherIds;
    }
  },
  mounted(){
    this.GetGather();

    if(this.data){
      this.label=this.data.tagTitle;
      this.gather=this.data.gatherIds;
    }
  },
  methods:{
    //获取聚集预警配置集合
    GetGather(){
      ser.GetGatherList({limit:1000,page:0}).then(res=>{
        this.gathers=_.map((res.biz_body || {}).list || [],r=>{
          
          return {...r,
                  disabled:_t.Timestamp(r.endTime)<=_t.Timestamp(new Date())
                }
        });
      });
    },
    submit(){
      let updata={
        tagId:this.data?this.data.tagId:'',
        tagTitle:this.label,
        gatherIds:this.gather || [],
      };

      if(this.data){//修改
        ser.UpdateFocusPeopleTags(updata).then((res)=>{
          if(!_t.msg(res,'修改成功!')) return;
          Object.assign(this.data,updata);
          this.cancel();
        });
      }else{//新增
        ser.AddFocusPeopleTags(updata).then(res=>{
          if(!_t.msg(res,'新增标签成功!')) return;
          updata.tagId=res.biz_body.id;
          this.cancel(updata);

        });
      }
    },
    cancel(d){this.$emit('cancel',d);}
  }
}
</script>

<style lang="less" scoped>
.AddPersonLabel{width:100%;height:100%;box-sizing:border-box;padding:10px;}
.AddPersonLabel .row{margin-bottom:10px;}
.AddPersonLabel .text-middle{line-height:32px;}
</style>