<!-- 及时通讯原因插件 -->
<template>
    <div class="Message_Reason">
        <ListAutoLayout>
            <template slot="header">
                <div class="info_item">预警类型 : {{type}}</div>
            </template>

            <div class="content_container">
                <div class="title" v-html="title"></div>
                <div class="message_container">
                    <Scroll :listen="data">
                        <div v-for="(d,i) in data" :key="i">
                            <div class="title_bar subColtwo" >{{`${d.num} (${d.nick}) `}}<span style="font-size:12px;">{{d.time}}</span><i class="fa fa-user subColtwo" v-if="d.direction>0" style="margin-left:10px;" title="本人" /></div>
                            <div v-html="d.content" style="font-size:12px;padding:0px 15px;"></div>
                        </div>
                    </Scroll>
                </div>
            </div>

            <template slot="footer">
                <RawButton type="cancel"  @inClick="cancel()" style="margin-right:5px;float:right;">关闭</RawButton>
            </template>
        </ListAutoLayout>
        <Loading v-if="loading" />
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'

export default {
  name: 'Message_Reason',
  props:['id'],
  components:{ListAutoLayout,Scroll,Loading},
  data(){
    return {
        type:'',
        title:'',
        loading:false,
        data:[],
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        this.loading=true;
        ser.GetImlogWarnDetail({sessionId:this.id}).then(res=>{
            this.loading=false;
            this.type=res.biz_body.word_type;
            this.title=res.biz_body.title;
            this.data =res.biz_body.list;
        });
    },
    cancel(){this.$emit('cancel');}
  }
}
</script>

<style>
    .Message_Reason em2{color:yellow;}
    .Message_Reason em1{color:red;}
</style>

<style lang="less" scoped>
.Message_Reason{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;position:relative;}
.Message_Reason .content_container{
    padding:10px;line-height:25px;border:1px solid;border-radius:5px;box-sizing: border-box;
    height:~'calc(100% - 10px)';
}

.Message_Reason .info_item{line-height:30px;}

.Message_Reason .content_container .title{text-align:center;line-height:40px;}
.Message_Reason .content_container .message_container{width:100%;height:~'calc(100% - 40px)';box-sizing:border-box;}
.Message_Reason .title_bar{line-height:30px;}
.Message_Reason .person{display:inline-block;}
</style>