<!--报警记录列表插件 -->
<template>
    <div class="AlarmRecord">
        <div class="tags">
            <ul class="tag_contain">
                <li class="item" v-for="(t,i) in tags" :key="i">
                    <div class="item_c" :class="{subBgColtwo:blnSel(t)}" @click="selItem(t)">{{t.name}}</div>
                </li>
            </ul>
        </div>

        <div class="tag_content">
            <Scroll :listen="data">
                <Lamp  v-for="(d,i) in data" :key="i" :blnEnter="true" style="height:40px;line-height:40px;">
                    <div class="data_item" @click="Detail(d)">{{d.info}}</div>
                </Lamp>
            </Scroll>

            <Loading :simple="true" v-if="blnLoading" />
        </div>
    </div>
</template>

<script>
import Scroll from '@/components/Scroll'
import Lamp from '@/components/Lamp'
import Loading from '@/components/Loading'
export default {
  name: 'AlarmRecord',
  components:{Scroll,Lamp,Loading},
  data(){
    return {
        blnLoading:false,
        tags:[
            {name:'新来',val:'alarm_entrance'},
            {name:'离去',val:'alarm_leave'},
            {name:'聚集',val:'alarm_gather'},
            {name:'异常',val:'alarm_abn'}
        ],
        selTags:[
            {name:'新来',val:'alarm_entrance'},
            {name:'离去',val:'alarm_leave'},
            {name:'聚集',val:'alarm_gather'},
            {name:'异常',val:'alarm_abn'}
        ],
        data:[],
    }
  },
  watch:{
    selTags(){
        this.GetAlarmRecords();
    }
  },
  mounted(){
    this.GetAlarmRecords();
  },
  methods:{
    //获取报警记录
    GetAlarmRecords(){
      this.blnLoading=true;
      ser.GetAlarmRecord({
        alarmTime:7,
        alarmType:_.map(this.selTags,s=>s.val).join(',')
      }).then(res=>{
        this.blnLoading=false;
        this.data=_.map(res.biz_body,d=>{
        
            return {
                ...d,
                info:`${d.alarmTime}  ${d.alarmReason}`,
            }
        });
        this.$emit('init',this.data);
      });
    },
    //查看详细
    Detail(d){
        if(!d.netbar.latitude){_t.tipFailure('经纬度不存在,无法定位!'); return;}
    
        ser.GetAlarmRecordDetail({sessionId:d.contentSessionId}).then(res=>{
            if(!_t.msg(res,'','获取详细信息失败!')) return;
            this.$emit('itemClick',d,res.biz_body);
        });
    },
    selItem(d){
       if(this.blnLoading){return;}
       let index= _.findIndex(this.selTags,t=>t.val==d.val);
       if(index<0){
           this.selTags.push(d)
        }else{
           this.selTags.splice(index,1);
        }
    },
    blnSel(d){
        return _.find(this.selTags,t=>t.val==d.val)
    }
  }
}
</script>

<style lang="less" scoped>
.AlarmRecord{width:100%;height:100%;box-sizing:border-box;color:white;padding:10px;}

@tagH:40px;
.AlarmRecord .tags{height:@tagH;width:100%;position:relative;}
.AlarmRecord .tag_content{height:~'calc(100% - @{tagH})';width:100%;position:relative;}
.AlarmRecord .tag_contain {list-style:none;margin: 0px;padding: 0px;}
.AlarmRecord .tag_contain .item{display:inline-block;width:25%;text-align:center;font-size:12px;}
.AlarmRecord .tag_contain .item .item_c{ width: 40px;height: 20px;line-height:20px;margin: auto;cursor:pointer;border-radius:5px;}

.AlarmRecord .data_item{font-size:12px;}
</style>