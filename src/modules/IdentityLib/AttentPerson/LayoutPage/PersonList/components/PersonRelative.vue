<!-- 关联信息显示(添加)页面插件 -->
<template>
    <div class="PersonRelative">
        <div class="inputCtainer">
            <div class="first_container">
                <el-select
                    v-model="kind"
                    placeholder="类型">
                    <el-option
                    v-for="item in kinds"
                    :key="item.val"
                    :label="item.name"
                    :value="item.val">
                    </el-option>
                </el-select>
            </div>
            <div class="second">
                <el-input placeholder="请输入内容" v-model="value" class="input-with-select">
                    <el-select v-model="vid" slot="prepend" placeholder="请选择" filterable style="width:150px;" v-if="kind=='vid'">
                        <el-option v-for="(v,key) in vidTypes " :key="v" :label="key" :value="v"></el-option>
                    </el-select>
                    <el-button slot="append" icon="fa fa-plus" style="width:100px;" @click="addItem()"></el-button>
                </el-input>
            </div>
        </div>
        <!--已添加项-->
        <div class="addedItems">
            <Scroll :listen="addedItems">
                <div class="addedItem hoverSubBgColtwoBg" v-for="(d,i) in  addedItems" :key="i">
                    {{i+1}}.{{d.name}}(<span style="font-size:12px;">{{d.k}}</span>)<span style="float:right;"><i class="fa fa-remove hoverSubBgColtwo" @click="remove(i)" /></span>
                </div>
            </Scroll>
        </div>

    </div>
</template>

<script>
import { mapState} from 'vuex'
import Scroll from '@/components/Scroll'
import Feature,{valid as FeatValid} from '@/enum/Feature'

export default {
  name: 'PersonRelative',
  props:['shield'],
  components:{Scroll},
  data(){
    return {
        addedItems:[],
        kinds:Feature,
        visible:false,
        kind:'', //账号类型
        vid:'',  //虚拟类型
        value:'',
    }
  },
  watch:{
    addedItems(){this.$emit('change')}
  },
  computed:{
    ...mapState({
      vidTypes:state=>state.BaseData.account_type
    })
  },
  mounted(){
    this.kinds=_.filter(this.kinds,k=>{return (this.shield || '').indexOf(k.val)<0});
  },
  methods:{
    addItem(){

        if(_.find(this.addedItems,a=>a.t=='cert') && this.kind=='cert'){_t.tipFailure('身份证信息只能设置一个!'); return;}

        if(!this.value && !this.kind.val){_t.tipFailure('类型不能为空!');return}
        if(!FeatValid(this.kind,this.value)){return;}
        let types=_.pairs(this.vidTypes);
        this.addedItems.push({
            t:this.kind,
            n:this.vid,
            k:this.value,
            vn:this.vid?_.find(types,t=>t[1]==this.vid)[0] || '':'',
            am:true,
            src:'add'
        })
    },
    remove(i){this.addedItems.splice(i,1);}
  }
}
</script>

<style lang="less">
   .PersonRelative .first_container .el-input__inner{
       border-top-right-radius:0px;
       border-bottom-right-radius:0px;
       border-bottom-left-radius:0px;
       background:@subColor;
   }
   .PersonRelative .second .el-input-group__prepend{
       border-top-left-radius:0px;
       border-bottom-left-radius:0px;
   }
   .PersonRelative .second .el-input-group__append{
       border-bottom-right-radius:0px;
   }
   .PersonRelative .second .el-input__inner{
       border-top-left-radius:0px;
       border-bottom-left-radius:0px;
   }
</style>

<style lang="less" scoped>
.PersonRelative{width:100%;height:100%;box-sizing:border-box;text-align:left;}

@firstSelW:100px;
.PersonRelative .first_container{width:@firstSelW;float:left;}
.PersonRelative .second{margin-left:@firstSelW;}

.PersonRelative .addedItems{
    height:~'calc(100% - 32px)';border:1px solid #cccccc;border-top:0px;
    border-bottom-left-radius:5px;border-bottom-right-radius:5px;
}

.PersonRelative .addedItems .addedItem{padding:5px 15px;cursor:pointer;}
</style>