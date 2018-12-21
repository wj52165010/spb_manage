//接口主文件
import axios from 'axios'
let baseUrl='';//基地址

const insSer = axios.create({
    baseURL: baseUrl,
    timeout: 3000
});

class server {
    hello(){return insSer;}
}
export default  new server();