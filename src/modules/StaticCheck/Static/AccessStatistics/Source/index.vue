<!-- 数据源数据接入页面组件 -->
<template>
    <div class="SourceDataIndex">
        <Scroll :listn="data" ref="scroll">
            <div class="item_container">
                <div class="item" v-for="(d,i) in data" :key="i">
                    <div style="float:left; width:100%;">
                        <div class="title">{{d.name || '-----'}}</div>
                        <div class="sub_title"><i :class="d.icon" style="font-size: 40px;" /></div>

                        <div class="countData">
                            <div class="countData_item divEllipsis"><span class="name">{{d.title_one}}</span>{{d.num_one}}</div>
                            <div class="countData_item divEllipsis"><span class="name">{{d.title_two}}</span>{{d.num_two}}</div>
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
  name: 'SourceDataIndex',
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
        ser.GetCollMicroprobe().then(res=>{
            if(!_t.msg(res,'','搜索失败!'))return;
            this.data=[];
            for(let key in res.biz_body){
                let arr=res.biz_body[key];
                switch(arr.microprobe_type){
                    case "网吧":
                        this.data.push({
                            name:arr.microprobe_type,
                            title_one:"接入场所：",
                            num_one:arr.netbar_num,
                            title_two:"采集总量：",
                            num_two:arr.netbar_detect_num,     
                            icon:"fa fa-desktop"                       
                        })
                        break;
                    case "公共场所无线上网安全管理系统":
                        this.data.push({
                            name:arr.microprobe_type,
                            title_one:"接入设备：",
                            num_one:arr.equip_num,
                            title_two:"接入总量：",
                            num_two:arr.equip_detect_num,     
                            icon:"fa fa-wifi"                       
                        })
                        break;
                    case "终端特征采集管控系统":
                        this.data.push({
                            name:arr.microprobe_type,
                            title_one:"接入设备:",
                            num_one:arr.equip_num,
                            title_two:"接入总量:",
                            num_two:arr.equip_detect_num,     
                            icon:"fa fa-podcast"                       
                        })
                        break;
                    case "宾馆酒店":
                        this.data.push({
                            name:arr.microprobe_type,
                            title_one:"接入设备:",
                            num_one:arr.equip_num,
                            title_two:"接入总量:",
                            num_two:arr.equip_detect_num,     
                            icon:"fa fa-leaf"                       
                        })
                        break;                                                    
                }
            }
        });
    }
  }
}
</script>
<style scoped lang="less">
.SourceDataIndex{width:100%;height:100%;}

@ItemH:200px;
@ItemW:180px;
.SourceDataIndex {text-align:left;padding:5px 0px;}
.SourceDataIndex .item_container{padding:10px 10px;}
.SourceDataIndex .item{width:@ItemW;height:@ItemH;border:1px solid;display:inline-block;}

@cornerH:20px;
.SourceDataIndex .item_container .item{position:relative;margin:15px;box-sizing:border-box;}
.SourceDataIndex .item_container .item:before{content:'';position:absolute;width:@cornerH;border:3px solid;border-right:0px;height:~'calc(100% + 6px)';left:-3px;top:-3px;box-sizing:border-box;}

.SourceDataIndex .item_container .item:after{content:'';position:absolute;width:@cornerH;border:3px solid;border-left:0px;height:~'calc(100% + 6px)';right:-3px;top:-3px;box-sizing:border-box;}

.SourceDataIndex .item_container .item .title{text-align:center;font-weight:600;font-size:18px;margin-top:20px;}
.SourceDataIndex .item_container .item .sub_title{text-align:center;}
.SourceDataIndex .item_container .item .countData{position:absolute;width:100%;bottom:10px;padding:0px 20px;font-size:12px;}
.SourceDataIndex .item_container .item .countData .countData_item{line-height:30px;}
.SourceDataIndex .item_container .item .countData .countData_item .name{margin-right:10px;}
</style>
