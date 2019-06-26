//头像显示指令

let bindFunc=(el,val)=>{
    let defImg=`${process.env.BASE_URL}noperson.png`;
    let realVal=val?`http://172.16.0.38:9090/focuspeople/focuspeople/uploadCertPic/${val}?token=${ser.baseBag.token}`:'' 
    $(el).attr({
        'src':realVal,
        'onerror':`src='${defImg}'`
    });


}

export default {
    bind(el,binding){
        bindFunc(el,binding.value);

    },
    componentUpdated(el,binding){
        bindFunc(el,binding.value);
    }
}