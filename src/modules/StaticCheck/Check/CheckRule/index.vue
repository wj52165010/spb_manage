<!-- 考核规则页面插件 -->
<template>
    <div class="ChekRule">
      <ListAutoLayout>
        <template slot="header">
          <ListHeader>
              <template slot="bar">
                  <AddBtn name="添加规则" @click="AddRule()" />
              </template>
          </ListHeader>
        </template>


        <v-table :listen="data" ref="listTable" :blnLoading="loading">
            <v-table-header>
              <v-table-column>规则名称</v-table-column>
              <v-table-column :width="100" >规则对象</v-table-column>
              <v-table-column :width="150" >创建时间</v-table-column>
              <v-table-column :width="120" >操作</v-table-column>
            </v-table-header>

            <v-table-body>
                <v-table-row v-for="(d,i) in data" :key="i">
                  <v-table-column>{{d.standardTitle}}</v-table-column>
                  <v-table-column>{{d.checkTargetNote}}</v-table-column>
                  <v-table-column>{{d.createTime | time}}</v-table-column>
                  <v-table-column>
                    <el-tooltip class="item" content="查看" >
                      <i class="fa fa-eye optionBtn" style="cursor:pointer;" @click="LookRule(d)" />
                    </el-tooltip>
                    <el-tooltip class="item" content="删除" >
                      <i class="fa fa-remove optionBtn" style="cursor:pointer;" @click="RemoveRule(d,i)" />
                    </el-tooltip>
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
import AddRule from './Add'

export default {
  name: 'ChekRule',
  components:{ListAutoLayout,ListHeader,AddBtn},
  data(){
    return {
      loading:false,
      data:[],
    }
  },
  mounted(){
    this.GetData();
  },
  methods:{
    GetData(){
      this.loading=true;
      ser.GetExamineTaskRule().then(res=>{
        this.loading=false;
        this.data=res.biz_body;
      });
    },
    AddRule(){
      this.$open({
        title:'添加规则',
        area:['800px','640px'],
        components:{AddRule},
        content:`<AddRule @cancel="cancel" />`,
        data:{
          
        },
        methods:{
          cancel(){
            this.$caller.GetData();
            this.close();
          }
        }
      })
    },
    LookRule(d){
      this.$open({
        title:'查看规则',
        area:['800px','640px'],
        components:{AddRule},
        content:`<AddRule @cancel="cancel" :detail="d" />`,
        data:{
          d:d
        },
        methods:{
          cancel(){this.close()}
        }
      })
    },
    RemoveRule(d,i){
      _t.confirm('您确定要删除该规则吗？',['确定','取消'],()=>{
          
          ser.DelExamineTaskRule(d.standardId).then(res=>{
              if(!_t.msg(res,'删除成功!')) return;
              this.data.splice(i,1);
          });

      },function(){});
    }
  }
}
</script>

<style lang="less" scoped>
.ChekRule{width:100%;height:100%;box-sizing:border-box;padding:10px;text-align:left;}
.ChekRule .optionBtn{margin-left:10px;}
</style>