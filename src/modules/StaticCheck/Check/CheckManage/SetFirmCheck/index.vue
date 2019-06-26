<!-- 厂商数据设置页面插件 -->
<template>
    <div class="SetFirmCheck">
      <ListAutoLayout>
          <template slot="header">   
            <div class="tip_info">*未选中则视为厂商不支持该种数据采集，不会被纳入考核</div>
          </template>

          <!--中间类别项-->
          <div class="header subBgColtwoBorder">
            <div class="subContainer">
              <div class="subItem subBgColtwoBorder" style="width:140px;border-right:1px solid;border-bottom:1px solid;">实名采集</div>
              <div class="subItem subBgColtwoBorder" style="width:210px;border-right:1px solid;border-bottom:1px solid;">虚拟身份</div>
              <div class="subItem subBgColtwoBorder" style="width:210px;border-bottom:1px solid;">硬件特征</div>
              <div class="subItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">身份证</div>
              <div class="subItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">手机号</div>
              <div class="subItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">QQ</div>
              <div class="subItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">微信</div>
              <div class="subItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">淘宝</div>
              <div class="subItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">MAC</div>
              <div class="subItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">IMSI</div>
              <div class="subItem subBgColtwoBorder" style="width:70px;">IMEI</div>
            </div>
            <div class="mainContainer">
              <div class="mainTile subBgColtwoBorder">厂商名称</div>
              <div class="mainTile subBgColtwoBorder">数据来源</div>
            </div>
          </div>

          <div class="footer subBgColtwoBorder">
            <Scroll :listen="data">
              <div class="item" v-for="(d,i) in data" :key="i">
                  <div class="subContainer subBgColtwoBorder" style="border-bottom:1px solid;">
                    <div class="contentItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">
                      <el-switch on-text="" off-text="" v-model="d.options.identity"></el-switch>
                    </div>
                    <div class="contentItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">
                      <el-switch on-text="" off-text="" v-model="d.options.mobile"></el-switch>
                    </div>
                    <div class="contentItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">
                      <el-switch on-text="" off-text="" v-model="d.options.qq"></el-switch>
                    </div>
                    <div class="contentItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">
                      <el-switch on-text="" off-text="" v-model="d.options.wechat"></el-switch>
                    </div>
                    <div class="contentItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">
                      <el-switch on-text="" off-text="" v-model="d.options.taobao"></el-switch>
                    </div>
                    <div class="contentItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">
                      <el-switch on-text="" off-text="" v-model="d.options.terminal_mac"></el-switch>
                    </div>
                    <div class="contentItem subBgColtwoBorder" style="width:70px;border-right:1px solid;">
                      <el-switch on-text="" off-text="" v-model="d.options.imsi"></el-switch>
                    </div>
                    <div class="contentItem subBgColtwoBorder" style="width:70px;">
                      <el-switch on-text="" off-text="" v-model="d.options.imei"></el-switch>
                    </div>
                  </div>
                  <div class="mainContainer">
                    <div class="mainTile subBgColtwoBorder" style="border-bottom:1px solid;font-weight:500;">{{d.securitySoftwareOrgname}}</div>
                    <div class="mainTile subBgColtwoBorder" style="border-bottom:1px solid;font-weight:500;">
                      <DataSourceSel v-model="d.microprobeType" :extra="d" @change="dataSoureChange" />
                    </div>
                  </div>
              </div>
            </Scroll>
          </div>

          <template slot="footer">
            <div style="float:right;padding-top:10px;">
              <RawButton type="submit"  @inClick="submit()" style="margin-right:5px;">确定</RawButton>
              <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
            </div>
          </template>
      </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import Scroll from '@/components/Scroll'
import DataSourceSel from '@/modules/components/DataSourceSel'

export default {
  name: 'SetFirmCheck',
  components:{ListAutoLayout,Scroll,DataSourceSel},
  data(){
    return {
      data:[{options:{}}],
      dict_tables:{}
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
      ser.GetExamineFirmSet().then(res=>{
        this.data=_.map(res.biz_body || [],b=>{
          return {...b,
            microprobeType:b.microprobeType || '',
            options:JSON.parse(b.options || '{"identity":false,"mobile":false,"qq":false,"wechat":false,"taobao":false,"terminal_mac":false,"imsi":false,"imei":false}')
          };
        });

      });
    },
    submit(){
      ser.SaveExamineFirmSet(_.map(this.data,d=>{
        return {
          microprobeType:d.microprobeType,
          securitySoftwareOrgcode:d.securitySoftwareOrgcode,
          options:JSON.stringify(d.options)
        };
      })).then(res=>{
        if(!_t.msg(res,'操作成功!')) return;

        this.cancel();
      });
    },
    cancel(){this.$emit('cancel');},
    dataSoureChange(d){
      d.options={
          hardware:true,
          real:true,
          virtual:true,
          identity:true,
          mobile:true,
          qq:true,
          wechat:true,
          taobao:true,
          terminal_mac:true,
          imsi:true,
          imei:true,                                                
      }
      switch( d.microprobeType){
          case "145":
              d.options.identity=false;
              break;
          case "120":
              d.options.mobile=false;
              d.options.terminal_mac=false;
              d.options.imsi=false;
              d.options.imei=false;
              break;                                                                              
      }
    }
  }
}
</script>

<style lang="less" scoped>
.SetFirmCheck{width:100%;height:100%;box-sizing:border-box;text-align:left;padding:10px;}
.SetFirmCheck .tip_info{color:#888;}

@headerH:60px;
@subItemW:70px;
@subContainerW:@subItemW * 8;
.SetFirmCheck .header{width:100%;height:@headerH;border:1px solid;box-sizing: border-box;overflow: hidden;}
.SetFirmCheck .mainContainer{margin-right:@subContainerW;}
.SetFirmCheck .mainTile{box-sizing:border-box;text-align:center;float:left;width:50%;line-height:@headerH;height:@headerH;font-weight:600;border-right:1px solid;}
.SetFirmCheck .subContainer{float:right;width:@subContainerW;height:100%;box-sizing:border-box;}
.SetFirmCheck .subContainer .subItem{height:@headerH/2;float:left;line-height:@headerH/2;text-align:center;font-weight:600;box-sizing:border-box;}

.SetFirmCheck .footer{width:100%;height:~'calc(100% -  @{headerH})';border:1px solid;border-top:none;}
.SetFirmCheck .footer .item{height:@headerH;line-height:@headerH;}
.SetFirmCheck .footer .contentItem{height:@headerH;line-height:@headerH;float:left;box-sizing:border-box;text-align:center;}
</style>