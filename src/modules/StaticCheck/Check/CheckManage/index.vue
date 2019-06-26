<!-- 考核管理页面插件 -->
<template>
    <div class="CheckManage">
        <ListAutoLayout>
            <template slot="header">
                <ListHeader>
                    <template slot="bar">
                        <IconBtn icon="fa fa-gear" @click="firmSet()">厂商配置</IconBtn>
                    </template>
                </ListHeader>
            </template>
            
            <div class="check-detail-row" @click="selectFun('1')">
                <div class="item_label_left hoverSubBgColtwo">
                    <div class="img-t"><i class="fa fa-clock-o"></i></div>
                    <div class="detail-title">配置定时考核</div>
                    <div class="iden_container active" v-show="select=='1'"><i class="fa fa-check subColtwo"></i></div>
                </div>                          
            </div>    
            <div class="check-detail-row" @click="selectFun('2')">  
                <div class="item_label_left hoverSubBgColtwo">
                    <div class="img-t"><i class="fa fa-calendar"></i></div>
                    <div class="detail-title">新增考核任务</div>
                    <div class="iden_container active" v-show="select=='2'"><i class="fa fa-check iden subColtwo"></i></div>
                </div>   
            </div>


            <template slot="footer">
                <div style="text-align:right;">
                    <RawButton type="submit"  @click="submit" style="margin-right:10px;">下一步</RawButton> 
                    <RawButton type="cancel"  @click="cancel">取消</RawButton>
                </div>
            </template>
        </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import IconBtn from '@/components/btns/IconBtn'
import TimeCheck from './TimeCheck'
import AddCheck from './AddCheck'
import SetFirmCheck from './SetFirmCheck'

export default {
  name: 'CheckManage',
  components:{ListAutoLayout,ListHeader,IconBtn},
  data(){
    return {
        select:1,
    }
  },
  methods:{
    selectFun(val){this.select=val;},
    submit(){

        this.$open({
          title:`${this.select==1?'定时考核设置':'新增考核'}`,
          area:['600px','220px'],
          components:{TimeCheck,AddCheck},
          content:`<${this.select==1?'TimeCheck':'AddCheck'} @cancel="cancel" />`,
          data:{
            
          },
          methods:{
            cancel(blnFlag){
                this.close();
                this.$caller.$emit('cancel',blnFlag);
            }
          }
        });
    },
    //厂商配置
    firmSet(){
        this.$open({
          title:`厂商数据项设置`,
          area:['1030px','530px'],
          components:{SetFirmCheck},
          content:`<SetFirmCheck @cancel="cancel" />`,
          data:{
            
          },
          methods:{
            cancel(){this.close()}
          }
        })
    },
    cancel(){this.$emit('cancel');}
  }
}
</script>

<style lang="less" scoped>
.CheckManage{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;}
.CheckManage .check-detail-row{
    display:inline-block;
    width: 49%;
}
.CheckManage .check-detail-row .item_label_left{
    position: relative;
    cursor:pointer;
    margin: 20px 30px;
    height: 100%;
    border: 1px solid #999;
    text-align:center;
    padding:10px;
    box-sizing:border-box;
}
.CheckManage .check-detail-row .item_label_left .iden_container{
    //background-image: linear-gradient(45deg, transparent 50%, #007acc 50%),linear-gradient(45deg, transparent 49%, #007acc 10%);
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50px;
    height: 50px;
}
.CheckManage .check-detail-row .item_label_left .iden_container i{
    position: absolute;
    font-size:22px;
    right: 5px;
    top: 4px;
    color: white;
}
.CheckManage .check-detail-row .img-t{
    font-size:100px;
}
.CheckManage .check-detail-row .detail-title{
    font-size:16px;       
}  
.CheckManage .check-detail-row .item_label_left:hover{
    color:#fff;
}
.CheckManage .check-button{
    position: absolute;
    bottom: 21px;
    right: 48px;
}
</style>