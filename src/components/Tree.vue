<!-- 树形插件组件 -->
<template>
    <div class="Tree">
        <Scroll :listen="treeData">
            <template v-for="(d,i) in treeData">
                <div class="node hoverSubBgColtwoBg" :key="i" :style="{'margin-left':d.nodeDeep*15 +'px'}" v-show="!d.blnHide">
                    <span v-if="!hasPlus?false:!hasPlus(d)" style="display:inline-block;width:11px;">&nbsp;</span>
                    <i class="fa fa-plus" v-if="!hasPlus?true:hasPlus(d)" :class="{'fa fa-plus':!d.export,'fa fa-minus':d.export}" @click="NodeExpanded(d)"></i> 
                    <i class="fa fa-spinner fa-pulse" v-if="d.isLoadingData"></i>
                    <span :class="{uncheckIcon_tree:!d.checked,checkIcon_tree:d.checked}" @click.stop="check(d)"></span>
                    {{d.name}}
                </div>
            </template>
        </Scroll>
    </div>
</template>

<script>
import Vue from 'vue'
import Scroll from '@/components/Scroll'
export default {
  name: 'Tree',
  props:['data','hasPlus','checkNode','disabledCheck'],
  components:{Scroll},
  data () {
    return {
      treeData:[],
      innerData:[],
    }
  },

  watch:{
    data(){this.innerData=this.data;},
    innerData:{
        deep:true,
        handler:function(){
            let temp=[],s=this;
            let checkNodeId=s.checkNode && s.checkNode.length>0?','+_.map(s.checkNode || [],m=>m.code).join(',')+',':'';

            _t.recur(this.data,'child',function(d,i,parent){
                d.parentCode=parent?parent.code || '':'';

                if(d.checked==undefined){
                    Vue.set(d,'checked',checkNodeId.indexOf(','+d.code+',')>=0 || checkNodeId.indexOf(','+d.parentCode+',')>=0);
                }

                if(d.isLoadingData==undefined){
                    Vue.set(d,'isLoadingData',false);
                }

                
                if(d.export==undefined){
                    Vue.set(d,'export',checkNodeId.indexOf(d.code.replace(/[0]+$/g,''))>=0 && checkNodeId.indexOf(','+d.code+',')<0);
                }

                if(d.blnHide==undefined){
                    Vue.set(d,'blnHide',false);
                }
                if(parent){
                    d.blnHide=parent.blnHide || !parent.export;
                }


                temp.push(d);
            },()=>{
                this.treeData=temp;
            });
        }
        
    },
    treeData(){
      let cludsId=[],data=[];

      _t.recurByArr(this.treeData,t=>{
        if(t.checked){
            if(cludsId.indexOf(t.parentCode)<0){
                data.push(t);
            }
            cludsId.push(t.code);
            
        }
      },()=>{
        let groupData = _.groupBy(data,d=>d.type);

        let res={
            regions:groupData[1] || [],
            sites:groupData[3] || [],
            polices:groupData[2] || []
        }

        this.$emit('dataChange',res);
      });
    }
  },
  mounted(){
    this.innerData=this.data;
  },
  methods:{
    //取消选中的节点
    checkOut(id){
        let d=_.find(this.treeData,t=>t.code==id);
        if(!d) return;
        this.check(d);
    },
    //节点展示函数
    NodeExpanded(d){
        d.export=!d.export;
        if(!d.export ||(d.child && d.child.length>0)) return;

        d.isLoadingData=true;
        this.innerData=[...this.innerData]
        this.$emit('NodeExpanded',d);
    },
    //复选框单击事件
    check(d){
        if(this.disabledCheck) return;
        d.checked=!d.checked;
        if(d.checked){//选中
         _t.recur(d.child || [],'child',function(d){
             d.checked=true;
         });

        }else{//不选中
         _t.recur(d.child || [],'child',function(d){
             d.checked=false;
         });
        }

        //判断父级节点是下是否只节点被全部选中
        _t.recurByFunc(this.treeData,d,(arr,d)=>{
           let parent = _.find(arr,a=>a.code==d.parentCode);
           if(parent && parent.child){
               if(_.find(parent.child,c=>c.checked==false)){
                   parent.checked=false;
               }else{
                   parent.checked=true;
               }
           }

           return parent;
        });

        this.innerData=[...this.innerData]
    }
  }
  
}
</script>

<style scoped lang="less">
 .Tree{width:100%;height:100%;}
 .child,
 .node{
    line-height:30px;padding:5px 10px;
 }
 .child:hover,
 .node:hover{cursor:pointer;}
 .uncheckIcon_tree,.checkIcon_tree{
  position: relative;
  padding: 0px 10px;
  margin-left: 5px;
 }
.uncheckIcon_tree:before{
  content:'';
  width: 20px;
  height: 20px;
  background: url("../assets/green.png") no-repeat;
  cursor: pointer;
  position: absolute;
  top:0px;
  left:0px;
}

.checkIcon_tree:before{
  content:'';
  width: 20px;
  height: 20px;
  background: url("../assets/green.png") no-repeat;
  cursor: pointer;
  position: absolute;
  background-position: -40px 0px;
  top:0px;
  left:0px;
}
</style>
