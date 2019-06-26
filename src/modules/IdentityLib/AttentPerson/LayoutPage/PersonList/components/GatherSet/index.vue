<!-- 聚集配置页面插件 -->
<template>
    <div class="GatherSet">
       <ListAutoLayout>
            <template slot="header">
                <ListHeader>
                    <template slot="bar">
                        <AddBtn name="创建配置" @click="CreateSet()" />
                    </template>
                </ListHeader>
            </template>

            <v-table :listen="data" ref="list" :blnLoading="blnLoading">
                <v-table-header>
                    <v-table-column>配置名称</v-table-column>
                    <v-table-column :width="100" >聚集场所</v-table-column>
                    <v-table-column :width="200" >创建时间</v-table-column>
                    <v-table-column :width="100" >状态</v-table-column>
                    <v-table-column :width="100" >操作</v-table-column>
                </v-table-header>

                <v-table-body>
                    <v-table-row v-for="(d,i) in data" :key="i">
                        <v-table-column :title="d.taskName"> {{d.taskName}}</v-table-column>
                        <v-table-column>{{d.gatherSiteCount}}</v-table-column>
                        <v-table-column>{{d.createTime}}</v-table-column>
                        <v-table-column >{{d.taskStatus}}</v-table-column>
                        <v-table-column >
                          <div class="option">
                            <el-tooltip placement="right">
                              <div slot="content" style="line-height:20px;text-align:left;width:400px;">
                                  <div class="row">
                                    <div class="col-md-3">监控范围</div><div class="col-md-9">{{d.locusIds}}</div>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-3">监控周期</div><div class="col-md-9">{{`${d.startTime} - ${d.endTime}`}}</div>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-3">监控阀值</div><div class="col-md-9">{{d.gatherValue}}</div>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-3">统计间隔</div><div class="col-md-9">{{d.interval}}/分钟</div>
                                  </div>
                              </div>
                              <i class="fa fa-eye" @click="look(d)" />
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                              <i class="fa fa-remove" @click="remove(d,i)" />
                            </el-tooltip>
                          </div>
                        </v-table-column>
                    </v-table-row>
                </v-table-body>
            </v-table>
       </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import ListHeader from '@/components/list/ListHeader'
import AddBtn from '@/components/btns/AddBtn'
import AddGatherSet from './AddGatherSet'

export default {
  name: 'GatherSet',
  components:{ListAutoLayout,ListHeader,AddBtn},
  data(){
    return {
      blnLoading:false,
      data:[],
    }
  },
  mounted(){
    this.GetGathers();
  },
  methods:{
    //获取配置集合
    GetGathers(){
      ser.GetGatherList({
        limit:3000,
        page:0,
        sidx:'task_id',
        order:'desc'
      }).then(res=>{
        this.data=res.biz_body.list;
      })
    },
    //创建配置
    CreateSet(){
      this.$open({
          title:'创建配置',
          area:['600px','400px'],
          components:{AddGatherSet},
          content:'<AddGatherSet @cancel="close" @add="add" />',
          data:{
           
          },
          methods:{
            close(){this.close()},
            add(){
              this.$caller.GetGathers();
              this.close();
            }
          }
      })
    },
    //删除配置
    remove(d,i){
       _t.confirm('您确定要删除该标签吗？',['确定','取消'],()=>{
          ser.DelGatherSetting(d.taskId).then(res=>{
            if(!_t.msg(res,'删除成功!')) return;

            this.data.splice(i,1);
          });
                
      },function(){});
    }
  }
}
</script>

<style lang="less" scoped>
.GatherSet{width:100%;height:100%;box-sizing:border-box;padding:10px;}
.GatherSet .option i{margin-left:10px;cursor:pointer;}
</style>