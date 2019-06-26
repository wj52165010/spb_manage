<!-- URL原因插件 -->
<template>
    <div class="Email_Reason">
        <ListAutoLayout>
            <template slot="header">
                <div class="info_item">预警类型 : {{type}}</div>
            </template>

            <div class="content_container">
                <Scroll :listen="data">
                    <div v-for="(d,i) in data" :key="i">
                        <div class="info_item">发件人 : <span style="width:150px;display: inline-block;">{{d.sender}}</span> <span style="margin-left:10px">发送时间 : {{d.capture_time}}</span></div>
                        <div class="info_item">收件人 : {{d.receiver}}</div>
                        <div class="info_item">抄送人 : {{d.cc_username}}</div>
                        <div class="info_item">密送人 : {{d.bcc_username}}</div>
                        <div class="info_item">标题 : <span v-html="d.title"></span></div>
                        <div class="content_bar" v-html="d.content" style="padding:0px 15px;"></div>
                    </div>
                </Scroll>
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
  name: 'Email_Reason',
  props:['id'],
  components:{ListAutoLayout,Scroll,Loading},
  data(){
    return {
        loading:false,
        type:'',
        data:{},
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        this.loading=true;
        ser.GetEmailWarnDetail({sessionId:this.id}).then(res=>{
            this.loading=false;
            this.type=res.biz_body.word_type;
            this.data =res.biz_body.list;
        });
    },
    cancel(){this.$emit('cancel');}
  }
}
</script>
<style>
    .Email_Reason em2{color:yellow;}
    .Email_Reason em1{color:red;}
</style>

<style lang="less" scoped>
.Email_Reason{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;position:relative;}
.Email_Reason .content_container{
    padding:10px;line-height:25px;border-radius:5px;box-sizing: border-box;
    height:~'calc(100% - 10px)';
}
.Email_Reason .content_container .content_bar{border:1px solid;border-radius:5px;}

.Email_Reason .info_item{line-height:30px;}
</style>