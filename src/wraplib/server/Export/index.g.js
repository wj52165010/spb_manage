export default{
    //下载指定文件
    DownloadFile(fileName){
        window.location=`/download/export/${fileName}?token=${this.baseBag.token}`
    }
}