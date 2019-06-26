<!-- 带复选框的列表插件 -->
<template>
    <div class="CheckList">
        <v-table :listen="data" :blnLoading="blnLoading" ref="listTable">
          <v-table-header>
            <v-table-column v-show="blnSel" :width="50">
                <span class="overflow" @click="selAll()">
                  <i :class="{'fa fa-check-square-o':blnAllSel,'fa fa-square-o':!blnAllSel}"></i>
                </span>
            </v-table-column>
            <slot name="header"></slot>
          </v-table-header>
          <v-table-body>
              <template v-for="(d,i) in data">
                <v-table-row @click="childRowClick(d)" :key="i" v-if="$scopedSlots.extra">
                    <v-table-column v-show="blnSel">
                      <span style="width:50px;" @click.stop="selItem(d)">
                        <i :class="{'fa fa-check-square-o':blnSelItem(d),'fa fa-square-o':!blnSelItem(d)}"></i>
                      </span>
                    </v-table-column>

                    <slot name="body" :d="d"></slot>
                </v-table-row>

                <v-table-row  :key="i" v-if="!$scopedSlots.extra">
                    <v-table-column v-show="blnSel">
                      <span style="width:50px;" @click.stop="selItem(d)">
                        <i :class="{'fa fa-check-square-o':blnSelItem(d),'fa fa-square-o':!blnSelItem(d)}"></i>
                      </span>
                    </v-table-column>

                    <slot name="body" :d="d"></slot>
                </v-table-row>
                
                <!--额外的列表数据-->
                <slot name="extra" :d="d"></slot>
              </template>
          </v-table-body>
        </v-table>
    </div>
</template>

<script>
export default {
  name: 'CheckList',
  props:['data','blnSel','id','blnLoading'],
  data(){
    return {
      selIds:[],//选中项的IDS
    }
  },
  watch:{
    blnSel(){this.selIds=[];},
    selIds(){
      this.$emit('change',this.selIds);
    }
  },
  mounted(){
    
  },
  computed:{
    blnAllSel(){
        let s=this,res=true;
        if(this.selIds.length<=0){return false;}
        for(let i=0;i<s.data.length;i++){
            if(_.findIndex(this.selIds,id=>id==s.data[i][s.id])<0){
                res=false;break;
            }
        }
        return res;
    }
  },
  methods:{
    //全选/取消全选
    selAll(){
        let s=this;
        if(s.blnAllSel){
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i][s.id]);
                if(index<0) continue;
                s.selIds.splice(index,1);
            }
        }else{
            for(let i=0;i<s.data.length;i++){
                let index=_.findIndex(s.selIds,id=>id==s.data[i][s.id]);
                if(index>=0) continue;
                s.selIds.push(s.data[i][s.id]);
            }
        }
    },
    //单选
    selItem(d){
      let index=_.findIndex(this.selIds,id=>id==d[this.id]);
      if(index>=0){
          this.selIds.splice(index,1);
      }else{
          this.selIds.push(d[this.id]);
      }
    },
    blnSelItem(d){
      return _.findIndex(this.selIds,id=>id==d[this.id])>=0;
    },
    childRowClick(d){
      this.$emit('rowClick',d);
      if(!_t.isObject(d)) return;
      d.blnshow=!d.blnshow;
    },
    reloadScroll(){
      this.$refs.listTable.reloadScroll();
    },
    clear(){
      this.selIds=[];
    }
  }
}
</script>

<style lang="less" scoped>
.CheckList{width:100%;height:100%;box-sizing:border-box;}
</style>