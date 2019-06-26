<!-- 新场所树形插件组件 -->
<template>
    <div class="PlaceTreeNew">
        <Tree ref="Tree" :data="places" :checkNode="defval" :disabledCheck="disabledCheck" @NodeExpanded="NodeExpanded" @dataChange="dataChange" :hasPlus="hasChilds" />
        <!--加载中-->
        <div v-if="blnLoading" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;font-size: 50px;z-index: 100;">
            <div style="display:table;width: 100%;height: 100%;"><div style="display: table-cell;vertical-align: middle;text-align: center;"><i class="fa fa-spinner fa-pulse"></i></div></div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {PlaceByArea} from '@/store/SiteManage/types'
import Tree from '@/components/Tree'
export default {
  name: 'PlaceTreeNew',
  props:['rootNode','defval','disabledCheck','kind'],
  components:{Tree},
  data () {
    return {
      searchKind:'1,2,3',//1:区域,2:派出所,3:场所
      places:[],
      blnLoading:false,
    }
  },
  watch:{
    defval(){
        this.queryTreeData();
    }
  },
  mounted(){
    this.searchKind=this.kind || this.searchKind;
    if(_t.isArray(this.rootNode)){
        this.places=_.map(this.rootNode,r=>{r.child=[];return r;});
    }
    else if(this.rootNode && !this.defval){
        this.places=[{...this.rootNode,type:'1',child:[]}];
    }else{
        this.queryTreeData();
    }
    
  },
  methods:{
    queryTreeData(d) {
        let code = (d && d.code) || '',
            type = (d && d.type) || this.searchKind;

   
        if(!d)this.blnLoading=true;
        this.$store.dispatch(PlaceByArea,{code:code, type:type, defaultVal:this.defval || [],$role:this.$role}).then((code) => {
            if(code.length>0 &&  this.searchKind.indexOf(code[0].type)<0){ 
               if(d)d.isLoadingData=false;
               this.blnLoading=false; return;
            }

           if(!d){
                this.places=[...code];
                this.blnLoading=false;
            }else{
                d.isLoadingData=false;
                if(code.length<=0){return _t.info('没有相关数据!');}
                d.child=code;
                if(d.checked){
                    _t.recur(d.child || [],'child',function(d){
                        if(d.checked==undefined){
                            Vue.set(d,'checked',true);
                        }else{
                            d.checked=true;
                        }
                    });
                }
            }
           
        });
    },
    //取消选中节点
    checkOut(id){
      this.$refs.Tree.checkOut(id);
    },
    //节点展开函数
    NodeExpanded(d){
        this.queryTreeData(d);
    },
    //节点选中结果改变事件
    dataChange(d){
      this.$emit('res',d);
    },
    //判断是否存在子节点数据
    hasChilds(d){
        return d.type!='3';
    }
  }
}
</script>

<style scoped lang="less">
 .PlaceTreeNew{width:100%;height:100%;position:relative;text-align:left;}
</style>
