<!-- 异常预警原因详情插件 -->
<template>
    <div class="ExperReason">
        <URL_Reason v-on="$listeners" :id="id" v-if="type=='net_log'" />

        <Email_Reason v-on="$listeners" :id="id" v-if="type=='email_log'" />

        <Search_Reason v-on="$listeners" :id="id" v-if="type=='search_log'" />

        <Speech_Reason v-on="$listeners" :id="id" v-if="type=='bbs_log'" />

        <Message_Reason v-on="$listeners" :id="id" v-if="type=='im_log'" />
    </div>
</template>

<script>

import URL_Reason from './URL_Reason'
import Email_Reason from './Email_Reason'
import Search_Reason from './Search_Reason'
import Speech_Reason from './Speech_Reason'
import Message_Reason from './Message_Reason'

export default {
  name: 'ExperReason',
  props:['d'],
  components:{URL_Reason,Email_Reason,Search_Reason,Speech_Reason,Message_Reason},
  data(){
    return {
        type:'',
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        },
        id:''
    }
  },
  mounted(){
    this.type=this.d.datasource;
    this.id=this.d.contentSessionId;
  },
  methods:{
    pageChange(){},
  }
}
</script>

<style lang="less" scoped>
.ExperReason{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>