/* eslint-disable */
//上传文件指令
import 'lib/jquery-file-upload/jquery.ui.widget.js'
import 'lib/jquery-file-upload/jquery.iframe-transport.js'
import 'lib/jquery-file-upload/jquery.fileupload.js'
import 'lib/jquery-file-upload/jquery.particleground.js'

let urls={img:{upload:'/focuspeople/focuspeople/uploadCertPic',download:'/focuspeople/focuspeople/uploadCertPic/'}};

let uploadFile=function(url,files,func,el){
    var formData = new FormData();
    formData.append('file',files[0]);
    return $.ajax({
        headers: {
            token: ser.baseBag.token,
        },
        url: url,
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
    }).then(function(res){
      el.__blnUpload=false;
      el.__file=null;
      return func(res);
    })
}

let initUpload=(id,url,func,el)=>{
    $('#'+id).fileupload({
        dataType:'json',
        autoUpload:false,
        add:function(e,data){
            var file=data.files[0];//上传文件
            el.__file=file;

            if(!file.name.match(/(\.|\/)(jpg|jpeg|png)$/i)){
                _t.tipFailure('文件格式,只允许上传图片格式文件!');
                return;
            }
            //判断文件大小
            if(file.size>5*1024*1024){
                _t.tipFailure('只能上传5M以内的文件数据!');
                return;
            }
            
            uploadFile(ser.baseBag.baseUri+url,data.files,func,el)
            //data.submit();
            return;
        }
    });
}

export default {
    bind(el,binding){
      el.__id=_t.guid();
      el.__file=null;
      let input = `<input id="${el.__id}" 
                          data-url="${urls[binding.arg]}" name="files[]" 
                          type="file" 
                          style="width: 0px;position: absolute;top: 0px;right: 0px;bottom: 0px;margin: 0px;opacity: 0;direction: ltr;cursor: pointer;" />`
      $('body').append(input);
    

      initUpload(el.__id,urls[binding.arg].upload,binding.value.func,el);
      
 
      $(el).bind('click',()=>{
        if(el.__blnUpload && el.__file){_t.tipFailure('正在上传中,请稍后...'); return}
        el.__blnUpload=true;
        $('#'+el.__id).click();
      });
    },
    unbind(el){
        $('body').find(`input[id="${el.__id}"]`).remove();
        $(el).unbind('click');
    }
}