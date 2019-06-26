<!-- 挂载设备详细插件 -->
<template>
    <div class="MontedDevice">
        <v-table :listen="data" ref="list" :blnLoading="blnLoading">
            <v-table-header>
                <v-table-column>设备编码</v-table-column>
                <v-table-column :width="150" >设备名称</v-table-column>
                <v-table-column :width="100" >设备状态</v-table-column>
                <v-table-column :width="150" >最近联系时间</v-table-column>
                <v-table-column :width="150" >数据来源</v-table-column>
                <v-table-column :width="80" >安全厂商</v-table-column>
            </v-table-header>

            <v-table-body>
                <v-table-row v-for="(d,i) in data" :key="i">
                    <v-table-column>{{d.equipmentId}}</v-table-column>
                    <v-table-column>{{d.equipmentName}}</v-table-column>
                    <v-table-column>{{d.onlineStateNote}}</v-table-column>
                    <v-table-column>{{d.captureTimeNote}}</v-table-column>
                    <v-table-column :title="d.microprobeTypeNode">{{d.microprobeTypeNode}}</v-table-column>
                    <v-table-column :title="d.securitySoftwareOrgname">{{d.securitySoftwareOrgname}}</v-table-column>
                </v-table-row>
            </v-table-body>
        </v-table>
    </div>
</template>

<script>

export default {
  name: 'MontedDevice',
  props:['code'],
  components:{},
  data(){
    return {
        blnLoading:false,
        data:[],
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
        this.blnLoading=true;
        ser.GetDeviceList({
            page:0,
            limit:1000,
            query:{
                netbar_wacode:this.code
            }
        }).then(res=>{
            this.blnLoading=false;
            this.data=res.biz_body.list;
        });
    }
  }
}
</script>

<style lang="less" scoped>
.MontedDevice{width:100%;height:100%;box-sizing:border-box;padding:10px;}
</style>