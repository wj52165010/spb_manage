
/* eslint-disable */
/** 地图封装类 **/
import {ListenClick} from 'event'
import compileVue from '@/wraplib/compileVue'

class Map{
    //实例化地图
    ins=null;
    markers=[];//地图包含的覆盖物
    constructor(container/**  String | HTMLElement **/,
                center /** 中心点 **/,
                level /** 地图层级 **/)
    {
        let blnCenter=_t.isNumber(arguments[2]);
        let blnPoints=_t.isArray(center);

        if(!blnPoints)this.ins = new BMap.Map(container,arguments[arguments.length-1] || {});//单个点初始化

        
        if(blnPoints){//多个点初始化
            this.ins=new BMap.Map(container,arguments[arguments.length-1] || {});

            let zoomAndCenter=this.getZoomAndCenter(center);

            this.centerAndZoom(Map.Point(zoomAndCenter.center.lng,zoomAndCenter.center.lat),zoomAndCenter.zoom);
        }

        if(blnCenter){
            center?this.centerAndZoom(center,level):null;
        }

        this.enableScrollWheelZoom();

        this.listenZoom();
    }

    //监听地图层级改变事件
    listenZoom(){
        this.ins.addEventListener('zoomend',this.markerRefresh.bind(this));
    }

    destroy(){
        this.ins.removeEventListener('zoomend',this.markerRefresh);
        _.each(this.markers,m=>m.destroy && m.destroy())
        this.ins=null;
        this.markers=null;
    }

    markerRefresh(){
        _.each(this.markers,m=>m.refresh && m.refresh())
    }

    //添加覆盖物到容器中
    addMarker(marker){
        this.markers.push(marker);
    }

    //从容器中删除覆盖物
    removeMarker(marker){
        let index = _.findIndex(this.markers,m=>m===marker);
        if(index<0) return;
        this.markers.splice(index,1);
    }

    setMapStyle(style){
        this.ins.setMapStyle(style);
    }

    static Point(Lng,Lat){
        return new BMap.Point(Lng,Lat);
    }

    static Pixel(x,y){
        return new BMap.Pixel(x,y);
    }

    getZoomAndCenter(points){  
        var maxLng = points[0].lng;  
        var minLng = points[0].lng;  
        var maxLat = points[0].lat;  
        var minLat = points[0].lat;  
        var res;  
        for (var i = points.length - 1; i >= 0; i--) {  
            res = points[i];  
            if(res.lng > maxLng) maxLng =res.lng;  
            if(res.lng < minLng) minLng =res.lng;  
            if(res.lat > maxLat) maxLat =res.lat;  
            if(res.lat < minLat) minLat =res.lat;  
        };  
        var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;  
        var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;  
        var zoom = this.getInnerZoom(maxLng, minLng, maxLat, minLat);  
  
        return {
          center:{
            lng:cenLng,
            lat:cenLat,
          },
          zoom:zoom>19?13:zoom
        }
   
    }

    getInnerZoom(maxLng, minLng, maxLat, minLat) {  
        var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。  
        var pointA = Map.Point(maxLng,maxLat);  // 创建点坐标A  
        var pointB = Map.Point(minLng,minLat);  // 创建点坐标B  
        var distance = this.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位  

        for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {  
            if(zoom[i] - distance > 0){  
                return 18-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
            }  
        };  
    }

    getDistance(pointA,pointB){
       return this.ins.getDistance(pointA,pointB);
    }

    centerAndZoom(Point,Level){
        this.ins.centerAndZoom(Point,Level)
    }
    enableScrollWheelZoom(){
        this.ins.enableScrollWheelZoom();
    }

    addOverlay(marker){
        this.ins.addOverlay(marker);
    }
    
    static Marker(){
        let blnPoint = _t.isObject(arguments[0]);
        if(arguments.length>1 && _t.isObject(arguments[arguments.length-1])){
            return new BMap.Marker(blnPoint?arguments[0]:Map.Point(arguments[0],arguments[1]),arguments[arguments.length-1]);
        }

        return new BMap.Marker(blnPoint?arguments[0]:Map.Point(...arguments));
    }

    static Label(content='',style={},offset={x:0,y:0}){
        let label= new BMap.Label(content,{offset:new BMap.Size(offset.x,offset.y)});
        label.setStyle(style);
        return label;
    }

    static Icon(url='',size={},opts={}){
        return new BMap.Icon(url,size,opts)
    }

    static Size(w,h){
        return new BMap.Size(w,h);
    }

    pointToPixel(){
        let blnPoint = arguments.length==1;

        return this.ins.pointToPixel(blnPoint?arguments[0]:Map.Point(...arguments));
    }

    pixelToPoint(){
        let blnPixel = arguments.length==1;

        return this.ins.pixelToPoint(blnPixel?arguments[0]:Map.Pixel(...arguments));
    }
    
    addEventListener(event,callback){
        this.ins.addEventListener(event,callback)
    }

    removeOverlay(overlay){
       let overlays = _t.isArray(overlay)?overlay:[overlay];
       _.each(overlays,o=>{
        this.ins.removeOverlay(o);
       })
       
    }
    clearOverlays(){
        _.each(this.markers,m=>m.remove());
        this.markers=[];
    }
    setZoom(zoom){this.ins.setZoom(zoom);}
    getZoom(){return this.ins.getZoom()}
    getCenter(){return this.ins.getCenter()}
    getBounds(){return this.ins.getBounds()}
    reset(){this.ins.reset()}
    panTo(point){this.ins.panTo(point)}


};

export default Map;


/** 地图自定义图标(扩展) **/

let iconColor='red';

//闪烁图标(类似雷达)
export class FlickerIcon{
    constructor(mapIns,point,info){
        this.mapIns=mapIns;
        this.Point=point;
        this.marker = Map.Marker(point,{icon:Map.Icon('/down.png')});
        this.id=`marker${_t.guid()}`;
        this.parent=null;
        this.clickUnBind=null;
        this.clickCallback=[];

        let color=iconColor;
        let label = Map.Label(` 
                                <div style="position:relative;cursor:pointer;" id=${this.id}>
                                    <div class="flicker" style="border-radius:50%;border-color:red;height:41px;width:41px;display:inline-block;border: 1px solid ${color};">
                                        <div class="flicker" style="border-radius:50%;border-color:red;height:33px;width:33px;display:inline-block;border: 1px solid ${color};margin:2.5px">
                                            
                                        </div>
                                    </div>
                                    <div style="width:25px;height:25px;background:${color};border-radius:50%;position: absolute;top:9px;left:9px;"></div>
                                    ${info?`
                                        <div class="subBgColtwo" style="border-radius:5px;color:white;padding:5px 10px;position: absolute;left:100%;top: 10px;">
                                            ${info}
                                        </div>
                                    `:''}
                                </div>
                                `,{
            border:'none',
            background:'transparent'
        },{x:-23,y:-23});

        this.marker.setLabel(label);
    }

    add(){
        this.mapIns.addOverlay(this.marker);
        this.mapIns.addMarker(this.parent || this);
        setTimeout(()=>{
            this.registerClick();
        },0)
        
    }

    remove(){
        this.mapIns.removeOverlay(this.marker);
        this.destroy();
    }

    registerClick(){
       let dom=document.getElementById(this.id);
       if(!dom) return;

       this.clickUnBind = ListenClick(dom,this.markerClick.bind(this))
    }

    markerClick(e){
        _.each(this.clickCallback,c=>c(e));
    }

    addClickCallback(callback){
        this.clickCallback.push(callback);
    }
    destroy(){
        this.mapIns=null;
        this.Point=null;
        this.marker=null;
        this.id=null;
        this.clickUnBind && this.clickUnBind.unsubscribe();
        this.clickUnBind=null;
        this.clickCallback=null;
    }
}

/** 地图提示信息框(扩展) **/

//分叉信息提示框呈现方向
export let InfoDir={topRight:0,topLeft:1,bottomRight:2,bottomLeft:3};

//分叉信息提示框
export class BranchInfo{
    constructor(mapIns,point,width,height,dir=InfoDir.topRight,html){
        this.mapIns=mapIns;
        this.Point=point;
        this.width=width;
        this.height=height;
        this.dir=dir;
        this.overlays=[];
        this.blnShow=false;
        this.html=html;
    }

    //刷新控件
    refresh(){
        this.mapIns.removeOverlay(this.overlays);
        this.overlays=[];
        if(this.blnShow)this.addCtrl();
    }

    //添加控件
    addCtrl(){
        let point = this.addPolyline();
        this.addInfoArea(point,this.width,this.height,this.html);
    }

    remove(){
        this.mapIns.removeOverlay(this.overlays);
        _.each(this.overlays,o=>o.remove && o.remove());
        this.destroy();
    }

    //设置折线
    addPolyline(){
        let insPoint=this.mapIns.pointToPixel(this.Point);
        let onePassage={x:50,y:100},twoPassage={x:40,y:100};
        let oneX=0,oneY=0,twoX=0,twoY=0;
        switch(this.dir){
            case InfoDir.topRight:
                oneX=insPoint.x+onePassage.x;
                oneY=insPoint.y-onePassage.y;
                twoX=insPoint.x+onePassage.x+twoPassage.x;
                twoY=insPoint.y-twoPassage.y;
                break;
            case InfoDir.topLeft:
                oneX=insPoint.x-onePassage.x;
                oneY=insPoint.y-onePassage.y;
                twoX=insPoint.x-onePassage.x-twoPassage.x;
                twoY=insPoint.y-twoPassage.y;
                break;
            case InfoDir.bottomRight:
                oneX=insPoint.x+onePassage.x;
                oneY=insPoint.y+onePassage.y;
                twoX=insPoint.x+onePassage.x+twoPassage.x;
                twoY=insPoint.y+twoPassage.y;
                break;
            case InfoDir.bottomLeft:
                oneX=insPoint.x-onePassage.x;
                oneY=insPoint.y+onePassage.y;
                twoX=insPoint.x-onePassage.x-twoPassage.x;
                twoY=insPoint.y+twoPassage.y;
                break;
        }

        let linePoint=this.mapIns.pixelToPoint(oneX,oneY);
        let horPoint=this.mapIns.pixelToPoint(twoX,twoY);
        
        let polyline = new BMap.Polyline([
           this.Point,
           linePoint,
           horPoint,
        ], {strokeColor:"#212841", strokeWeight:2});
        this.overlays.push(polyline);

        this.mapIns.addOverlay(polyline);

        return horPoint;
    }

    //设置信息展示区域
    addInfoArea(point,width,height,vueOpts=''){
        let dir=this.dir;
        //设置折线展示区域
        function ComplexCustomOverlay(point,width,height,style){
            this._point = point;
            this._width = width;
            this._height = height;
            this._style =style; 
            
        }
        ComplexCustomOverlay.prototype = new BMap.Overlay();
        ComplexCustomOverlay.prototype.initialize = function(map){
            this._map=map
            var div = this._div = document.createElement("div");
            div.style.position = "absolute";
            div.style.zIndex =BMap.Overlay.getZIndex(this._point.lat);
            div.style.height = `${this._height}px`;
            div.style.width = `${this._width}px`;
            div.style.whiteSpace = "nowrap";
            div.style.MozUserSelect = "none";
            div.style.fontSize = "12px";
            div.className="bgCol"
            _.each(this._style,(v,k)=>{
                div.style[k]=v;
            })
            
            this._map.getPanes().labelPane.appendChild(div);

            if(vueOpts){
                let mountDom = document.createElement("div");
                div.appendChild(mountDom);
                vueOpts.el=mountDom;
                this.compileDestroy = compileVue(vueOpts)
            }
            return div;
        }

        ComplexCustomOverlay.prototype.draw = function(){
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            var left=0,top=0;
            switch(dir){
                case InfoDir.topRight:
                    left=pixel.x;
                    top= (pixel.y-this._height/2);
                    break;
                case InfoDir.topLeft:
                    left=pixel.x-this._width;
                    top= (pixel.y-this._height/2);
                    break;
                case InfoDir.bottomRight:
                    left=pixel.x;
                    top= (pixel.y-this._height/2);
                    break;
                case InfoDir.bottomLeft:
                    left=pixel.x-this._width;
                    top= (pixel.y-this._height/2);
                    break;
            }


            this._div.style.left = left + "px";
            this._div.style.top  = top + "px";
        }

        let remove = ComplexCustomOverlay.prototype.remove;
        ComplexCustomOverlay.prototype.remove=function(){
            this.compileDestroy && this.compileDestroy();
            remove.apply(this,arguments);
        }

        var myCompOverlay = new ComplexCustomOverlay(point,width,height,{
            borderRadius:'5px',
            color:'white',
        });

        this.overlays.push(myCompOverlay);
        this.mapIns.addOverlay(myCompOverlay);
    }

    //切换覆盖物显示或隐藏
    toggle(){
        this.blnShow=!this.blnShow;
        if(this.blnShow && this.overlays.length<=0){
            this.addCtrl();
        }else{
         _.each(this.overlays,o=>this.blnShow?o.show():o.hide());
        }
    }

    destroy(){
        this.mapIns=null;
        this.Point=null;
        this.width=null;
        this.height=null;
        this.dir=null;
        this.overlays=null;
        this.blnShow=null;
        this.html=null;
    }
}
