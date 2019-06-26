<!-- 日期选择插件 -->
<template>
    <div class="DatePicker">
        
        <div class="input_conatiner">
          <i class="fa fa-calendar" />
          <input type="text" @click.stop="noFunc" @focus.stop="focus" v-model="preVal" @blur="preBlur"  />
          <span>-</span>
          <input type="text"  @click.stop="noFunc" @focus.stop="focus" v-model="preNext" @blur="nextBlur" />
          <i class="fa fa-times-circle removeBtn" style="cursor:pointer;" @click="clear" />
        </div>

        <!--Js日期选择插件容器-->
        <div :id="id">
          <input type="text" class="_input" style="display:none;" />
        </div>
    </div>
</template>

<script>
//引用日期控件
import 'lib/datepicker/datepicker.css'
import 'lib/datepicker/datepicker.js'

export default {
  name: 'DatePicker',
  props:['pickerOptions','value'],
  components:{},
  data(){
    return {
      dateReg:/^(\d{4})(-)(\d{2})(-)(\d{2})$/,
      id:'DatePicker'+_t.guid(),
      ins:null,
      preVal:'',
      preNext:'',
      oriPreVal:'',
      oriNext:'',
    }
  },
  watch:{
    value(){
      this.initVal();
    },
  },
  mounted(){
    let s=this;
    this.ins= $('#'+this.id).datepicker({
      range:true,
      kind:'day',
      dateLimit:(this.pickerOptions || {}).disabledDate,
      change(pre,next){
        s.preVal=pre;
        s.preNext=next;

        s.oriPreVal=pre;
        s.oriNext=next;

        s.$emit('input',[new Date(s.oriPreVal),new Date(s.oriNext)]);
      }
    });

    
    s.initVal();
  },
  destroyed(){
    this.ins.destroy();
  },
  methods:{
    initVal(){
      //设置默认值  
      if(this.value && this.value.length>0){
        let pre=_t.DateFormat(this.value[0],'yyyy-MM-dd'),
            next=_t.DateFormat(this.value[1],'yyyy-MM-dd');
          this.preVal=pre;
          this.preNext=next;

          this.oriPreVal=pre;
          this.oriNext=next;
          this.ins.val(this.oriPreVal,this.oriNext); 
      }
    },
    focus(){
     this.ins.openDatePicker();
    },
    preBlur(){
      if(this.preVal.match(this.dateReg)){
        this.oriPreVal=this.preVal;
        this.ins.val(this.oriPreVal,this.oriNext); 

        this.$emit('input',[new Date(this.oriPreVal),new Date(this.oriNext)]);
        return;
      }
      this.preVal=this.oriPreVal;
    },
    nextBlur(){
      if(this.preNext.match(this.dateReg)){
        this.oriNext=this.preNext; 
        this.ins.val(this.oriPreVal,this.oriNext);

        this.$emit('input',[new Date(this.oriPreVal),new Date(this.oriNext)]);
        return;
      }
      this.preNext=this.oriNext;
    },
    clear(){
      this.preVal='';
      this.preNext='';
      this.oriNext='';
      this.oriPreVal='';
      this.ins.clear();
      this.$emit('input',null);
    },
    noFunc(){}
  }
}
</script>

<style lang="less" scoped>
.DatePicker{box-sizing:border-box;width:250px;}
.DatePicker ._input{
    background: transparent;
    border: none;
    position: absolute;
}

@InputHeight:32px;
.DatePicker .input_conatiner{height:@InputHeight;line-height:@InputHeight;background-color:#8a95a7;border-radius:5px;padding:0px 30px 0px 10px;position:relative;}
.DatePicker .input_conatiner input{
  background-color:transparent;border:none;outline:none;color:white;margin:0px 5px;text-align:center;
  width:~'calc(50% - 25px)';
}
.DatePicker .input_conatiner i{color:#C0C4CC;}

.DatePicker .removeBtn{position:absolute;top:10px;right:10px;display:none;}
.DatePicker .input_conatiner:hover .removeBtn{display:block;}

</style>