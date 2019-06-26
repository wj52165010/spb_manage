<!-- 厂商数据接入页面组件 -->
<template>
    <div class="FirmDataIndex">
        <Scroll :listn="data" ref="scroll">
            <div class="item_container">
                <div class="item" v-for="(d,i) in data" :key="i">
                  <div style="float:left; width:100%;">
                    <div class="title">{{d.security_software_orgname || '-----'}}</div>
                    <div class="sub_title"><i class="fa fa fa-globe" style="font-size: 40px;" /></div>

                    <div class="countData">
                        <div class="countData_item divEllipsis"><span class="name">昨日量</span>{{d.last_detect_num}}</div>
                        <div class="countData_item divEllipsis"><span class="name">接入总量</span>{{d.total_detect_num}}</div>
                    </div>

                    <div class="left_mask"></div>
                    <div class="right_mask"></div>
                  </div>
                </div>
            </div>
        </Scroll>
    </div>
</template>

<script>
/* eslint-disable */
import Scroll from '@/components/Scroll'

export default {
  name: 'FirmDataIndex',
  components:{Scroll},
  data () {
    return {
      data:[]
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    layout(){this.$refs.scroll.reloadyScroll();},
    refreshPage(){
        this.GetData();
    },
    //获取数据
    GetData(){
        ser.GetFirmCollFirm().then(res=>{
            if(!_t.msg(res,'','搜索失败!'))return;
            this.data=res.biz_body;
        });
    }
  }
}
</script>
<style scoped lang="less">
.FirmDataIndex{width:100%;height:100%;text-align:left;padding:5px 0px;}

@ItemH:200px;
@ItemW:180px;
.FirmDataIndex {text-align:left;padding:5px 0px;}
.FirmDataIndex .item_container{padding:10px 10px;}
.FirmDataIndex .item{width:@ItemW;height:@ItemH;border:1px solid;display:inline-block;}


@cornerH:20px;
.FirmDataIndex .item_container .item{position:relative;margin:15px;    box-sizing: border-box;}
.FirmDataIndex .item_container .item:before{content:'';position:absolute;width:@cornerH;border:3px solid;border-right:0px;height:~'calc(100% + 6px)';left:-3px;top:-3px;    box-sizing: border-box;}

.FirmDataIndex .item_container .item:after{content:'';position:absolute;width:@cornerH;border:3px solid;border-left:0px;height:~'calc(100% + 6px)';right:-3px;top:-3px;    box-sizing: border-box;}

.FirmDataIndex .item_container .item .title{text-align:center;font-weight:600;font-size:18px;margin-top:20px;}
.FirmDataIndex .item_container .item .sub_title{text-align:center;}
.FirmDataIndex .item_container .item .countData{position:absolute;width:100%;bottom:10px;padding:0px 20px;font-size:12px;}
.FirmDataIndex .item_container .item .countData .countData_item{line-height:30px;}
.FirmDataIndex .item_container .item .countData .countData_item .name{margin-right:10px;}
</style>
