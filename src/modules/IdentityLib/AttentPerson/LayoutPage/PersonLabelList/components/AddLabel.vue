<!-- 增加人员标签或者选择人员标签组件插件 -->
<template>
    <div class="AddLabel" style="display: table;">

        <div class="SelLabel">
            <div class="plusBtn subBgColtwo" v-lock:click="(e)=>showAddBtn(e)">
                <i class="fa fa-plus" :class="blnShowAdd?'fa-minus':'fa-plus'" />
            </div>
            <div class="select_container">
                <el-select
                    v-model="value"
                    multiple
                    collapse-tags
                    placeholder="请选择人员标签">
                    <el-option
                    v-for="item in options"
                    :key="item.tagId+''"
                    :label="item.tagTitle"
                    :value="item.tagId+''">
                    </el-option>
                </el-select>
            </div>
        </div>

        <div style="text-align:left;">
          <el-input placeholder="请输入标签名称" v-model="labelName" style="width:250px;" v-if="blnShowAdd">
              <template slot="append"><div style="width:100%;height:100%;padding:4px;cursor:pointer;" v-lock:click="(e)=>click(e)">确认</div></template>
          </el-input>
        </div>

    </div>
</template>

<script>
import { mapState} from 'vuex'
export default {
  name: 'AddLabel',
  props:['defval'],
  data(){
    return {
        blnShowAdd:false,
        value:[],
        labelName:'',
        blnAdding:false,
    }
  },
  watch:{
    value(){this.$emit('change')},
    defval(){
      this.value=this.defval || [];
    }
  },
  computed:{
    ...mapState({
      options:state=>state.AttentPerson.tags
    })
  },
  mounted(){
    this.value=this.defval || [];
  },
  methods:{
    showAddBtn(){
      this.blnShowAdd=!this.blnShowAdd;
    },
    //添加标签
    click(){
      if(this.blnAdding) return;
      let addData={
        tagTitle:this.labelName,
        gatherIds:[],
      };

      this.blnAdding=true;
      ser.AddFocusPeopleTags(addData).then(res=>{
        this.blnAdding=false;
        addData.tagId=res.biz_body.id;
        this.options.push(addData);
        this.value.push(addData.tagId+'');
        this.labelName='';
      });
    }
  }
}
</script>
<style>
.SelLabel .el-input__inner{
    border-top-right-radius:0px;
    border-bottom-right-radius:0px;
}
</style>
<style lang="less" scoped>
.SelLabel{width:250px;margin-bottom:10px;}
.plusBtn{
    float:right;color:white;height:32px;width:32px;
    border-top-right-radius:5px;
    border-bottom-right-radius:5px;
    text-align:center;
    line-height:32px;
    cursor:pointer;
}

</style>