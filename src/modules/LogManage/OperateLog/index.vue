<!-- 操作日志页面插件 -->
<template>
    <div class="OperateLog">
       <ListAutoLayout ref="layout">

            <!--搜索框-->
            <template slot="header">
            
                <ListHeader>  

                    <ListSearchItem label="用户账户:">
                        <el-input placeholder="请输入内容" v-model="query.account" style="width:200px;" />
                    </ListSearchItem>

                    <ListSearchItem label="结果类型:">
                        <el-select v-model="query.kind" placeholder="请选择" :clearable="true" style="width:100px;">
                            <el-option
                                v-for="kind in ['成功','失败']"
                                :key="kind"
                                :label="kind"
                                :value="kind">
                            </el-option>
                        </el-select>
                    </ListSearchItem>

                    <ListSearchItem>
                        <SearchBtn  @click="search(true)" :disable="blnLoading" />
                    </ListSearchItem>
                </ListHeader>

            </template>

            <!--列表项-->
            <v-table :listen="data" :blnLoading="blnLoading">
                <v-table-header>
                    <v-table-column :width="100">用户ID</v-table-column>
                    <v-table-column :width="150">用户账户</v-table-column>
                    <v-table-column :width="150">操作时间</v-table-column>
                    <v-table-column :width="100">操作结果</v-table-column>
                    <v-table-column :width="150">操作模块</v-table-column>
                    <v-table-column :width="150">自定义模块</v-table-column>
                    <v-table-column >说明</v-table-column>
                </v-table-header>
                <v-table-body>
                    <v-table-row v-for="(d,i) in data"  :key="i">
                        <v-table-column >{{d.userId}}</v-table-column>
                        <v-table-column >{{d.account}}</v-table-column>
                        <v-table-column >{{d.createTime | time}}</v-table-column>
                        <v-table-column >{{d.resultType}}</v-table-column>
                        <v-table-column >{{d.operationModule}}</v-table-column>
                        <v-table-column >{{d.customModuleName}}</v-table-column>
                        <v-table-column :title="d.note">{{d.note}}</v-table-column>
                    </v-table-row>
                </v-table-body>
            </v-table>
               
            <!--分页-->
            <template slot="footer">
                <Paging :pageIndex="page.index" :pageSize="page.size" :pageNum="page.num" :pageCount="page.count" @change="pageChange"></Paging>
            </template>
        </ListAutoLayout>
    </div>
</template>

<script>
import ListAutoLayout from '@/components/list/ListAutoLayout'
import Paging from '@/components/Paging'
import ListHeader from '@/components/list/ListHeader'
import ListSearchItem from '@/components/list/ListSearchItem'

import SearchBtn from '@/components/btns/SearchBtn'

export default {
  name: 'OperateLog',
  components:{
      ListAutoLayout,Paging,ListHeader,
      ListSearchItem,SearchBtn
    },
  data(){
    return {
        blnLoading:false,
        data:[],
        page:{
            index:0,    //当前页号
            size:0,     //页数
            num:15,     //每页显示条数
            count:0,    //列表总数    
        },
        query:{
            account:'',
            kind:''
        }
    }
  },
  mounted(){
    this.search();
  },
  methods:{
    refresh(){
        this.page.index=0;
        this.query={query:'',kind:''};
        this.search(true);
    },
    search(blnInit){
        if(this.blnLoading) return;
        if(blnInit){this.page.index=0;}
        this.blnLoading=true;
        ser.OperLogs({
            page:this.page.index,
            limit:this.page.num,
            query:{
                account:this.query.account,
                result_type:this.query.kind || ''
            }
        }).then(res=>{
            this.blnLoading=false;
            if(!_t.msg(res,'','获取操作日志数据失败!')) return;
 
            this.data=res.biz_body.list;
            this.page.size=res.biz_body.totalPage;
            this.page.count=res.biz_body.totalCount;
        })
    },
    pageChange(i){
        this.page.index=i;
        this.search();
    }
  }
}
</script>

<style lang="less" scoped>
.OperateLog{width:100%;height:100%;box-sizing:border-box;text-align:left;}
</style>