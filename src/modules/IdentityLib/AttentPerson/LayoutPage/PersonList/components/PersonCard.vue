<!--人员信息卡片插件 -->
<template>
    <div class="PersonCard subBgColtwoBorder" :class="{active:blnSel}" @click="click(d)">
        <div class="content">

            <div class="iden_container">
                <i class="fa fa-check iden"></i>
            </div>

            <div class="photo_bar">
                <img  v-headimg="d.photoName" style="width:100%;height:100%;">
            </div>

            <div class="info_bar">
                <div class="info_item">
                    <span class="subColtwo title">姓名:</span>
                    <span>{{d.focusTitle}}</span>
                </div>

                <div class="info_item">
                    <span class="subColtwo title">{{((d.focusProperty || [{}])[0] || {}).t || '   ' }}
                        <span v-if="((d.focusProperty || [{}])[0] || {}).t">:</span>
                    </span>
                    <span>{{((d.focusProperty || [{}])[0] || {}).k || '   ' }}</span>
                </div>

                <div class="info_item">
                    <div  class="ellipsis" style="width:190px;">
                        <div class="labelTip subBgColtwo" v-for="(f,i) in d.focusTags" :key="i" >{{f.note}}</div>
                    </div>
                </div>

            </div>

            <!--<div class="status_bar subBgColtwoBorder">
                <i class="fa fa-bell" />
                <span class="item">出现</span>
                <span class="item">离开</span>
                <span class="item">聚集</span>
                <span class="item">异常</span>
            </div>-->
            <i class="fa fa-bell hoverSubBgColtwo" @click.stop="PreWarnPop(d)" style="position:absolute;right:10px;top:10px;cursor:pointer;" />
        </div>
        <div class="bottom_bar subBgColtwo">
            <span>报警:{{d.alarms}}</span>
            <span style="float:right;">最近报警：{{d.alarmLastTime}}</span>
        </div>
    </div>
</template>

<script>
import PersonDetail from './PersonDetail'
import EWAnalysis from '@/modules/EW_analysis/EW_analysis.g'

export default {
  name: 'PersonCard',
  props:['blnSel','disabeldClick','d'],
  data(){
    return {
       
    }
  },
  methods:{
    //查看预警信息
    PreWarnPop(d){
        let h = $(window).height() -53;
        this.$open({
          title:'详细',
          initMaxMin:true,
          components:{EWAnalysis},
          content:`<div style="height:${h}px;padding:10px;"><EWAnalysis :certCode="code" /></div>`,
          data:{
            code:d.certificateCode
          },
          methods:{
            cancel(){this.close()}
          }
        });
    },
    click(d){
        if(this.disabeldClick){this.$emit('click'); return;}
        this.$open({
          title:'关注人员详情',
          area:['700px','680px'],
          components:{PersonDetail},
          content:'<PersonDetail @cancel="close" :id="id" />',
          data:{
           id:d.focusId,
          },
          methods:{
            close(flag){if(flag){this.$caller.$emit('refshPage')}this.close()}
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>

@CardW:300px;
@CardH:150px;
.PersonCard{float:left;
    width:@CardW;height:@CardH;
    border:1px solid ;
    margin:0px 10px 10px 0px; 
    border-radius:5px;
    overflow:hidden;
    cursor:pointer;
    position:relative;
}

.PersonCard:hover{
    .trans(.3s);
    -moz-box-shadow:2px 2px 10px @mainCol; 
    -webkit-box-shadow:2px 2px 10px @mainCol; 
    box-shadow:2px 2px 10px @mainCol;
}

@bttomBarH:30px;
.PersonCard .content{height:~'calc(100% - @{bttomBarH})';padding:10px 10px 0px 10px;box-sizing:border-box;font-size:12px;}
.PersonCard .bottom_bar{height:@bttomBarH;line-height:@bttomBarH;font-size:12px;padding:0px 10px;}


@imgW:80px;
@imgH:80px;
.photo_bar{
    width: @imgW;
    height: @imgH;
    float: left;
}

.info_bar{
    margin-left: @imgW;
    height: @imgH;
    text-align: left;
    padding-left: 10px;
}
.info_item > .title{margin-right:10px;line-height:30px;}

.status_bar{width:100%;height:~'calc(100% - @{imgH} - 5px)';line-height:25px;
            border-top:1px dashed;margin-top:5px;box-sizing:border-box;font-size:12px;}
.status_bar .item{margin-left:10px;}

.labelTip{
    font-size: 11px !important;
    background-color: @mainCol;
    color: #fff;
    font-size: 10px;
    padding: 1px 5px;
    border-radius: 3px;
    position: relative;
    margin-left: 15px;
    display: inline-block;
    font-family: 微软雅黑;
}
.labelTip:before{
    content: '';
    width: 0;
    height: 0;
    border-width: 11px 9px 9px 0;
    border-style: solid;
    border-color: transparent @mainCol transparent transparent;
    position: absolute;
    left: -7px;
    top: -1px;
}
.labelTip:after{
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: #fff;
    border-radius: 50%;
    left: -3px;
    top: 50%;
    margin-top: -2.5px;
}

.PersonCard .iden_container{
    position: absolute;
    top: 0px;
    right: 0px;
    width: 30px;
    height: 30px;
    background-image: linear-gradient(45deg, transparent 50%, @mainCol 50%), linear-gradient(45deg, transparent 49%, @mainCol 10%);
    display: none;
}
.PersonCard .iden_container .iden{
    position: absolute;
    right: 3px;
    top: 2px;
    color: white;
}

.PersonCard.active .iden_container{display:inline-block;}
</style>