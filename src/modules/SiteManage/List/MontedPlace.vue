<!-- 挂载场所详细(挂载终端)插件 -->
<template>
    <div class="MontedPlace">
        <v-table :listen="data" ref="list" :blnLoading="blnLoading">
            <v-table-header>
                <v-table-column :width="100" >证件类型</v-table-column>
                <v-table-column :width="150" >证件号码</v-table-column>
                <v-table-column :width="100" >姓名</v-table-column>
                <v-table-column :width="150" >终端IP</v-table-column>
                <v-table-column :width="150" >终端MAC</v-table-column>
                <v-table-column :width="80" >民族</v-table-column>
                <v-table-column >地址</v-table-column>
                <v-table-column :width="150" >采集时间</v-table-column>
                <v-table-column :width="100" >终端状态</v-table-column>
            </v-table-header>

            <v-table-body>
                <v-table-row v-for="(d,i) in data" :key="i">
                    <v-table-column>{{d.certificateType}}</v-table-column>
                    <v-table-column>{{d.certificateCode}}</v-table-column>
                    <v-table-column>{{d.customerName}}</v-table-column>
                    <v-table-column>{{d.terminalIpStr}}</v-table-column>
                    <v-table-column>{{d.terminalMac}}</v-table-column>
                    <v-table-column>{{d.nation}}</v-table-column>
                    <v-table-column>{{d.address}}</v-table-column>
                    <v-table-column>{{d.captureTime | time}}</v-table-column>
                    <v-table-column>{{d.onlineState}}</v-table-column>
                </v-table-row>
            </v-table-body>
        </v-table>
    </div>
</template>

<script>

export default {
  name: 'MontedPlace',
  props:['code'],
  components:{},
  data(){
    return {
        data:[],
        blnLoading:false,
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        this.blnLoading=true;
        ser.GetNetbarTerminal(this.code).then(res=>{
            this.blnLoading=false;
            this.data=res.biz_body;
        });
    }
  }
}
</script>

<style lang="less" scoped>
.MontedPlace{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>