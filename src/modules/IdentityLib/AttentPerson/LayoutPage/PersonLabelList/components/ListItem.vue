<!-- 列表项插件 -->
<template>
    <div class="ListItem hoverSubBgColtwoBg" :class="{subBgColtwoBg:active}" @click="itemClick()">
        <div class="dootl subBgColtwo"></div>
        <div class="option_bar" v-if="!noOption">
            <el-tooltip content="修改" placement="top">
                <i class="fa fa-pencil" @click.stop="update()" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
                <i class="fa fa-trash-o" @click.stop="remove()" />
            </el-tooltip>
        </div>
        <div class="content">{{data.tagTitle}}</div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
import AddPersonLabel from './AddPersonLabel'
export default {
  name: 'ListItem',
  props:['data','active','noOption'],
  data(){
    return {

    }
  },
  methods:{
    itemClick(){
      this.$emit('click',this.data);
    },
    update(){
      this.$open({
        title:'修改标签',
        area:['400px','200px'],
        components:{AddPersonLabel},
        content:'<AddPersonLabel @cancel="close" :data="d" />',
        data:{
          d:this.data
        },
        methods:{
          close(){this.close()}
        }
      })

    },
    remove(){
      _t.confirm('您确定要删除该标签吗？',['确定','取消'],()=>{
          ser.DelFocusPeopleTags(this.data.tagId).then(res=>{
            if(!_t.msg(res,'删除成功!')) return;

            this.$emit('del',this.data);
          });
                
      },function(){});
    }
  }
}
</script>

<style lang="less" scoped>
@ListItemH:30px;
@optionW:40px;

.ListItem{height:@ListItemH;line-height:@ListItemH;padding:0px 10px;text-align:left;cursor:pointer;}

.ListItem .dootl{float:left;height:10px;width:10px;border-radius:50%;margin-top:10px;}

.ListItem .content{margin-left:15px;margin-right:@optionW + 10px;}

.ListItem .option_bar{float:right;width:@optionW;line-height:@ListItemH;}
.ListItem .option_bar i{margin-left:5px;cursor:pointer;display:none;}
.ListItem:hover .option_bar i{display:inline-block;}
</style>