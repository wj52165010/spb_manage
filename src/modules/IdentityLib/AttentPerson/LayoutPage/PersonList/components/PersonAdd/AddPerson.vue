<!-- 头部页面插件 -->
<template>
    <div class="AddPerson">

        <div class="row">
            <div class="col-md-8">
                <el-input v-model="userName" placeholder="请输入姓名" style="position: absolute;bottom: 20px; width: 80%;"></el-input>
            </div>
            <div class="col-md-4">
                <span class="uploadBtn hoverSubBgColtwo">
                    <div v-if="!photo" v-update:img="{func:UpdatePhoto}">
                        <i class="fa fa-cloud-upload" style="font-size:80px;" />
                        <span style="font-size:12px;">上传图片</span>
                    </div>

                    <div v-if="photo">
                        <img v-headimg="photo" style="width:80px;height:76px;" />
                        <i class="fa fa-refresh" style="margin-left:10px;" v-update:img="{func:UpdatePhoto}" />
                    </div>
                </span>
            </div>
        </div>
        <div style="padding:0px 15px;height:200px;margin-bottom:10px;">
            <PersonRelative ref="PersonRelative" @change="valid" />
        </div>

        <!--人员标签-->
        <div style="padding:0px 15px;">
            <AddLabel ref="AddLabel" @change="valid" />
        </div>
    </div>
</template>

<script>
import PersonRelative from '../PersonRelative'
import AddLabel from '../../../PersonLabelList/components/AddLabel'

export default {
  name: 'AddPerson',
  components:{PersonRelative,AddLabel},
  data(){
    return {
        userName:'',
        photo:'',
    }
  },
  watch:{
    userName(){
        this.$emit('blnAdd',!this.blnCanAdd());
    }
  },
  methods:{
    layout(){},
    blnCanAdd(){
        return this.userName && 
               this.$refs.AddLabel.value.length>0 && 
               this.$refs.PersonRelative.addedItems.length>0;
    },
    AddPerson(){
        let tags=this.$refs.AddLabel.value;
        let items=_.map(this.$refs.PersonRelative.addedItems,r=>{
            return {
                t:r.t,
                n:r.n,
                k:r.k,
                am:r.am,
                src:r.src
            };
        });
        let certInfo=_.find(items,i=>i.t=='cert') || {};
        ser.AddFocusPeople({
            "certificateCode":certInfo.k || '',
            "certificateType":certInfo.t=='cert'?'111':'',
            "focusProperty":JSON.stringify(items),
            "focusTags":'|'+tags.join('|')+'|',
            "focusTitle":this.userName,
            "photoName":this.photo
        }).then(res=>{
            if(!_t.msg(res,'新增成功!')) return;
            this.$emit('add');
        });
    },
    valid(){
        this.$emit('blnAdd',!this.blnCanAdd());
    },
    UpdatePhoto(res){
        if(!_t.msg(res,'上传成功!')) return;
        this.photo=res.data.fileName;
    }

  }
}
</script>

<style lang="less" scoped>
.AddPerson{width:100%;height:100%;box-sizing:border-box;}
.AddPerson .uploadBtn{cursor:pointer;position:relative;}
</style>