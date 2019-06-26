<!-- 人员标签列表页面插件 -->
<template>
    <div class="PersonLabelList">
      <!--标题栏-->
      <div class="title subBgColtwo">
        人员标签
        <el-tooltip placement="top"  content="新建标签" style="position:absolute;top:10px;right:15px;cursor:pointer;"> 
          <i class="fa fa-plus-circle" @click="addLabel()" />
        </el-tooltip>
      </div>

      <!--列表项-->
      <div class="list">
        <Scroll :listen="data">
          <ListItem :data="{tagTitle:'全部人员',tagId:''}" @click="itemClick" :active="curSelTagIndex==-1" :noOption="true" /> 
          <ListItem :data="{tagTitle:'未定义标签',tagId:'',nodefine:true}" @click="itemClick" :active="curSelTagIndex==-2" :noOption="true" /> 
          <ListItem v-for="(d,i) in data" :key="i" :data="d" @del="delItem" @click="itemClick" :active="curSelTagIndex==i" />
        </Scroll>
        <Loading v-if="loading" :simple="true" />
      </div>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import Scroll from '@/components/Scroll'
import ListItem from './components/ListItem'
import AddPersonLabel from './components/AddPersonLabel'
import Loading from '@/components/Loading'

import {GetTags} from '@/store/IdentityLib/AttentPerson/types'

export default {
  name: 'PersonLabelList',
  components:{Scroll,ListItem,Loading},
  data(){
    return {
      loading:false,
      curSelTagIndex:-1,
      curSelTagVal:'',
    }
  },
  computed:{
    ...mapState({
      data:state=>state.AttentPerson.tags
    })
  },
  mounted(){
    this.refresh();
  },
  methods:{
    refresh(){
      this.curSelTagIndex=-1,
      this.curSelTagVal='';
      this.getTags();
    },
    //获取标签数据
    getTags(){
      this.loading=true;
      this.$store.dispatch(GetTags,()=>{this.loading=false;})
    
    },
    //新增标签
    addLabel(){

      this.$open({
        title:'添加标签',
        area:['400px','200px'],
        components:{AddPersonLabel},
        content:'<AddPersonLabel @cancel="close" />',
        data:{
          
        },
        methods:{
          close(d){
            if(d){this.$caller.data.push(d);}
            this.close()
          }
        }
      })
    },
    //标签项单击事件
    itemClick(d){
      if(d.nodefine){this.curSelTagIndex=-2;this.curSelTagVal=d.tagId;this.$emit('tagChange',this.curSelTagVal,d.nodefine); return;}
      this.curSelTagIndex=_.findIndex(this.data,data=>data.tagId==d.tagId);
      this.curSelTagVal=d.tagId;
      this.$emit('tagChange',this.curSelTagVal,d.nodefine);
    },
    //删除标签响应函数
    delItem(d){
      let index = _.findIndex(this.data,data=>data.tagId==d.tagId);
      if(index<0) return;
      this.data.splice(index,1);
      this.curSelTagIndex=-1;
      this.curSelTagVal='';
      this.$emit('tagChange',this.curSelTagVal);
    }

  }
}
</script>

<style lang="less" scoped>
.PersonLabelList{width:100%;height:100%;}

@titleH:36px;
.PersonLabelList .title{height:@titleH;line-height:@titleH;position:relative;}
.PersonLabelList .list{height:calc(100% - @titleH);width:100%;position:relative;}
</style>