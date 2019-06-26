/** 地图覆盖物(自定义) **/

import {FlickerIcon,BranchInfo,InfoDir} from './map'

//报警信息覆盖物
export class AlarmMarker{
    constructor(mapIns,point,w,h,data=[],blnNoClick){
        this.mapIns=mapIns;
        this.point=point;
        this.size={w:w,h:h};
        this.marker=null;
        this.branchInfos=[];
        this.data=data;
        this.blnNoClick=blnNoClick;
    }
    //添加控件
    add(){
        this.addMarker();
        this.addBranchInfo();
    }

    //删除控件
    remove(){
        this.mapIns.removeMarker(this);
        this.marker.remove();
        _.each(this.branchInfos,b=>b.remove());
        this.destroy();
    }

    //重新添加分支提示控件
    setBranchInfo(data,blnShow,size){
        //删除之前的分析提示信息
        _.each(this.branchInfos,b=>b.remove());
        this.branchInfos=[];
        this.size=size || this.size;
        this.data=data;
        this.addBranchInfo(blnShow);
    }

    //切换提示窗显示状态
    toggleInfo(){
        _.each(this.branchInfos,b=>{
            b.toggle &&  b.toggle();
        })
    }

    addMarker(){
        this.marker=new FlickerIcon(this.mapIns,this.point);
        this.marker.parent=this;
        this.marker.add();

        if(this.blnNoClick)return;
        this.marker.addClickCallback(()=>{
            _.each(this.branchInfos,b=>{
               b.toggle &&  b.toggle();
            })
        })
    }
    
    addBranchInfo(blnShow){
        for(let key in InfoDir){
            if(this.data.length<(InfoDir[key]+1)) continue;
            let item=new BranchInfo(this.mapIns,this.point,this.size.w,this.size.h,InfoDir[key],this.data[InfoDir[key]]);
            item.blnShow=!!blnShow;
            this.branchInfos.push(item);
            item.blnShow && item.addCtrl();
        }
    }

    refresh(){
        _.each(this.branchInfos,b=>b.refresh())
    }

    destroy(){
        _.each(this.branchInfos,b=>b.destroy && b.destroy());
        this.marker.destroy && this.marker.destroy();

        this.mapIns=null;
        this.point=null;
        this.size=null;
        this.marker=null;
        this.branchInfos=null;
        this.data=null;
    }
}