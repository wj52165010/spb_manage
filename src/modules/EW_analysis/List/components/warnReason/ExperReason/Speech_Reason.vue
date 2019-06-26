<!-- 网上言论插件 -->
<template>
    <div class="Speech_Reason">
        <div class="info_item" style="padding:0px 35px;">预警类型 : {{info}}</div>
        <div  style="margin:0px;height:calc(100% - 74px);" >
            <Scroll :listen="data">
                <div class="session_item" v-for="(d,i) in data" :key="i">
                    <ListAutoLayout>
                        <template slot="header">
                            <div class="info_item">时间 : 
                                <span style="width:150px;display: inline-block;">{{d.capture_time}}</span> 
                                <span style="margin-left:10px">论坛名称 : <span style="width:150px;display: inline-block;">{{d.bbs_type_str}}</span></span>
                                <span style="margin-left:10px">昵称 : {{d.user_name}}</span>
                            </div>
                            <div class="info_item">标题 : <span v-html="d.title"></span></div>
                        </template>

                        <div class="content_container" v-html="d.content"></div>
                    </ListAutoLayout>
                </div>
            </Scroll>
        </div>

        <div style="text-align:right;margin-top:10px;">
            <RawButton type="cancel"  @inClick="cancel()" style="margin-right:5px;float:right;">关闭</RawButton>
        </div>

        <Loading v-if="loading" />
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'

export default {
  name: 'Speech_Reason',
  props:['id'],
  components:{ListAutoLayout,Scroll,Loading},
  data(){
    return {
        loading:false,
        info:'',
        data:[],
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        this.loading=true;
        ser.GetBBSWarnDetail({sessionId:this.id}).then(res=>{
            this.loading=false;
            this.info=res.biz_body.word_type;
            this.data=res.biz_body.list;
        });
    },
    cancel(){this.$emit('cancel');}
  }
}
</script>
<style>
.Speech_Reason em2{color:yellow;}
.Speech_Reason em1{color:red;}
</style>

<style lang="less" scoped>
.Speech_Reason{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;position:relative;}
.Speech_Reason .content_container{
    padding:10px;line-height:25px;border:1px solid;border-radius:5px;box-sizing: border-box;
    height:~'calc(100% - 10px)';
}

.Speech_Reason .info_item{line-height:30px;}

.session_item{width:100%;height:300px;box-sizing:border-box;padding:0px 20px;}

</style>