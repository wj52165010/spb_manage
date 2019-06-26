<!-- 批量导入页面插件 -->
<template>
    <div class="BatchImport" :id="'c'+fileId">
        <div style="text-align:center;line-height:30px;padding:15px;">
            *请参考<span style="color:red;cursor:pointer;" @click="downLoadFile()">示例文件</span>格式上传
        </div>
        <div v-if="uploadStauts==0">
            <i class="fa fa-cloud-upload" style="font-size:120px;" />
            <div style="text-align:center;width:100%;">
                将文件拖拽至此，或<span @click="addFiles()" style="color:red;cursor:pointer;">点击此处</span>上传</div>
        </div>

        <div v-if="uploadStauts==1">
            <img src="@/assets/cry.png" style="width:120px;" />
            <div class="tipInfo">文件上传失败!</div>
            <div style="margin-top:10px;">
                <button type="button" @click="againUpload()" class="btn btn-default btn-sm" style="padding:5px 20px">重新上传</button>
            </div>
        </div>
        <!--文件上传成功-->
        <div v-if="uploadStauts==2">
            <img src="@/assets/smile.png" style="width:120px;" />
            <div class="tipInfo">文件上传成功,请点击下一步继续!</div>
            <div>
                <button type="button" @click="againUpload()" class="btn btn-default btn-sm" style="padding:5px 20px">重新上传</button>
            </div>
        </div>
        <!--文件正在上传中-->
        <div v-if="uploadStauts==4">
            <i class="fa fa-cloud-upload" style="font-size: 120px;color: gray;/*! text-align: center; */margin-top: 40px;"></i>
            <div style="text-align:center;width:100%;">文件正在上传中请耐心等待.....</div>
        </div>

        <input :id="fileId" name="files[]" type="file" style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />
    </div>
</template>

<script>

import 'lib/jquery-file-upload/jquery.ui.widget.js'
import 'lib/jquery-file-upload/jquery.iframe-transport.js'
import 'lib/jquery-file-upload/jquery.fileupload.js'
import 'lib/jquery-file-upload/jquery.particleground.js'

export default {
  name: 'BatchImport',
  props:['type','extra','blnDisabelUpload','path'],
  data(){
    return {
        fileId:'file'+_t.guid(),
        uploadStauts:0,//上传状态(0:上传,1:上传失败,2:上传成功)
        allowType:/(\.|\/)(txt|xls|xlsx)$/i,
        urls:{
            wordKind:'/keywordlibrary/keywordtypes',
            url:'/keywordlibrary/alarmurls',
            keyword:'/keywordlibrary/filealarmkeywords',
            focuspeople:'/focuspeople/focuspeople/focuspeoples'
        },
        files:{
            wordKind:`${process.env.BASE_URL}export/词类模板.rar`,
            url:`${process.env.BASE_URL}export/URL模板.rar`,
            keyword:`${process.env.BASE_URL}export/关键词模板.rar`,
            focuspeople:`${process.env.BASE_URL}export/关注人员.rar`,
        }
    }
  },
  watch:{
    uploadStauts(){
        if(this.uploadStauts==0){
            $('#'+this.fileId).fileupload('enable');
        }
        if(this.uploadStauts==1){
            $('#'+this.fileId).fileupload('disable');
        }
        if(this.uploadStauts==2){
            $('#'+this.fileId).fileupload('disable');
        }
        if(this.uploadStauts==4){
            $('#'+this.fileId).fileupload('disable');
        }
    },
    blnDisabelUpload(){
       this.blnDisabelUpload?$('#'+this.fileId).fileupload('disable'):$('#'+this.fileId).fileupload('enable');
    }
  },
  mounted(){
    this.initUpload();
    this.blnDisabelUpload?$('#'+this.fileId).fileupload('disable'):$('#'+this.fileId).fileupload('enable');
  },
  methods:{
    //上传文件
    addFiles(){
        if(this.blnDisabelUpload) return;
        let uploadEl=$('#'+this.fileId);
        uploadEl.click();
    },
    //重新上传
    againUpload(){
        if(this.blnDisabelUpload) return;
        $('#'+this.fileId).fileupload('enable');
        this.uploadStauts=0;
    },
    initUpload(){
        let s=this,dropbox=$('#c'+s.fileId);
        //阻止文件拖入浏览器后打开新页面
        dropbox.bind("dragenter", function(e){ 
            e.stopPropagation(); 
            e.preventDefault(); 
        }, false);  
        dropbox.bind("dragover", function(e){ 
            e.stopPropagation(); 
            e.preventDefault(); 
        }, false); 
        dropbox.bind("drop", function(e){ 
            e.stopPropagation(); 
            e.preventDefault(); 
            
        }, false); 

        $('#'+s.fileId).fileupload({
            dataType:'json',
            dropZone:$('#c'+s.fileId),
            maxNumberOfFiles:1,
            autoUpload:false,
            add:function(e,data){
                var file=data.files[0];//上传文件
                if(!file.name.match(s.allowType)){
                    _t.info('文件格式,只允许上传(txt|xls|xlsx)格式文件!');
                    return;
                }

                //判断文件大小
                if(file.size>5*1024*1024){
                    _t.info('只能上传5M以内的文件数据!');
                    return;
                }

                s.uploadFileName=data.files[0].name;
                s.uploadCurData=data;
                
                //data.submit();
                s.uploadStauts=0;
                s.uploadFile(ser.baseBag.baseUri+s.urls[s.type],data.files,s.uploadFileFinish,s.extra)
                return;
            },
        });
    },
    uploadFile(url,files,func,extra){
        var formData = new FormData();
        var s=this;
        formData.append('file',files[0]);

        if(!this.path){
            _.each(extra={},(v,k)=>{
                formData.append(k,v);
            });
        }

        return $.ajax({
            headers: {
                token: ser.baseBag.token,
            },
            url: `${url}${s.path && extra?'?'+_.map(extra,(v,k)=>{return `${k}=${v}`}).join('&'):''}`,
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).then(function(res){
            return func(res);
        })
    },
    //下载实例文件
    uploadFileFinish(res){
        if(!_t.msg(res,'上传成功')){this.uploadStauts=1; return;}
        this.uploadStauts=2;
        this.$emit('complete');
    },
    //下载示例文件
    downLoadFile(){
        window.open(`${this.files[this.type]}`);
    }
  }
}
</script>

<style lang="less" scoped>
.BatchImport{width:100%;height:100%;box-sizing:border-box;position:relative;text-align:center;color:gray;}

.BatchImport .tipInfo{color:gray;padding:10px;}
.BatchImport .tipInfo .dot{width:5px;height:5px;background-color:gray;border-radius:50%;display:inline-block;float:left;margin-top:8px; margin-right:5px;}
</style>