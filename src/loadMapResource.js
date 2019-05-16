/** 加载地图资源 **/

import loadMap from '@/enum/mapLoad'
export default (callback)=> _t.loadMulFile(loadMap[PublicNet?'在线':'离线'],()=>{callback && callback()},true)