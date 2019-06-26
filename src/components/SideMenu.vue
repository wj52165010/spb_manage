<!-- 侧边导航菜单组件 -->
<template>
    <div class="sideMenu">
        <div class="pos_container">
            <div class="kind_container bgCol">
                <div class="sideMenu_conatiner">
                    <div class="slidee">
                        <div class="kind_item" v-for="(menu,index) in menus" :key="index" :class="{active:curIndex==index}"  @mouseenter="menu_mouseenter(menu,index)" @mouseleave="menu_mouseleave()">
                            <!--<el-tooltip class="item" :content="menu.name" placement="top">-->
                                <div style="display:table-cell;vertical-align:middle;">
                                    <i :class="menu.icon"></i>
                                    <div style="font-size:12px;">{{menu.title}}</div>
                                </div>
                            <!--<el-tooltip>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--具体类型下的菜单集合-->
        <div class="kind_menu_container" :class="{active:curIndex!=-1}" @mouseenter="menu_item_mouseenter()" @mouseleave="menu_item_mouseleave($event)">
            <div class="title subBgColtwoLine">{{(menus[curIndex] || {title:''}).title }}</div>
            <div class="content">
                <div class="gridly1" name="sideMenu_container" style="height:200px;overflow: hidden;">
                    <div class="menu_item complete" 
                        :key="menu.keyid" 
                        :id="menu.keyid+'_'+((menu.menu_type || {id:0}).id || 0)+'_'+menu.name"   
                        @click="item_click(menu)" v-for="menu in showMenus">
                        <div class="_container hoverBgCol">
                            <div class="icon_container subBgColtwoLine">
                                <i :class="menu.icon"></i>
                            </div>
                            <div style="font-size:12px;" class="info_container ellipsis" :title="menu.name">
                                {{menu.name}}
                                <div class="triangle_border_down"></div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import 'lib/dragSort.js'
import {AddHistoryMenu} from '@/store/Menu/types'

let blnClose=true;
let closeTime=null;
let blnWillClose=false;
export default {
  name: 'SideMenu',
  data () {
    return {
      bodyResizeSub:null,
      sly:null,
      curIndex:-1,
      gridly:null,
      blnDrag:false,
      leaveStart:0,//离开时起始位置,
      filterMenuName:[],//['App管理','网站备案','巡查管理','厂商配置','权限配置','远程接口管理'],
    }
  },
  watch:{
      menus(){
        this.$nextTick(()=>{
            this.sly.reload();
        });
      },
      curIndex(){
        //权限判断
        let self=this;
        this.$nextTick(()=>{
            if(!this.gridly){
                this.gridly = $('div[name="sideMenu_container"]').dragsort({
                    remove:()=>{
                        this.blnDrag=true;
                    },
                    mouseup:(els)=>{
                        if(this.blnDrag){setTimeout(()=>{ self.blnDrag=false;},0)}else{self.blnDrag=false;}
                        self.saveSort(els);
                    }
                });
            }else{
                this.gridly.reload();
            }
        });
      },
  },
  computed:mapState({
    menus:state=>state.Menu.menus,
    showMenus(){
        // let permissions = _t.cookie.get('permissions');
      
        // if((','+permissions+',').indexOf(',*,')>=0){
        //     let menus = _.map(_.filter((this.menus[this.curIndex] || {menus:[]}).menus,m=>{return !m.kind;}),d=>{
        //         d.orderby=parseInt(d.orderby || '0');
        //         return d;
        //     })

        //     return _.filter(_.sortBy(menus,'orderby'),menu=>menu.blnShow && !menu.disabled && this.filterMenuName.indexOf(menu.name)<0);
        // }else{
        //     let menus = _.map(_.filter((this.menus[this.curIndex] || {menus:[]}).menus,m=>{return !m.kind && (','+permissions+',').indexOf(','+m.keyid+',')>=0;}),d=>{
        //         d.orderby=parseInt(d.orderby || '0');
        //         return d;
        //     })

        //     return _.filter(_.sortBy(menus,'orderby'),menu=>menu.blnShow && !menu.disabled && this.filterMenuName.indexOf(menu.name)<0);
        // }

        let menus = _.map(_.filter((this.menus[this.curIndex] || {menus:[]}).menus,m=>{return !m.kind;}),d=>{
            d.orderby=parseInt(d.orderby || '0');
            return d;
        })

        return _.filter(_.sortBy(menus,'orderby'),menu=>menu.blnShow && !menu.disabled && this.filterMenuName.indexOf(menu.name)<0);
    }
  }),
  mounted(){
    this.$nextTick(()=>{
        this.sly=new Sly($('.sideMenu > .pos_container >.kind_container > .sideMenu_conatiner'),{
            itemNav: "basic",
            speed:200,
            scrollBy:1,
            dragHandle:true,
            dynamicHandle:true,
            smart:1
        });
        this.sly.init();
    });
  },
  methods:{
      //保存排序
      saveSort(els){
        let self=this;
        let kindId,ids= _.chain(els).map(i=>{return $(i).attr('id')}).compact().map((val,i)=>{
            kindId=val.split('_')[1];
            return {keyid:val.split('_')[0],order_index:i,name:val.split('_')[2]};
        }).value();
        
        ser.MenuSort(ids).then(res=>{
            this.blnMovePos=true;
            if(res.msg.code!='successed'){return;}
            //调整菜单显示顺序
            _.each(self.menus,m=>{
                if(m.id==kindId){
                    _.each(ids,(id,index)=>{
                        let tempMenu=_.find(m.menus,i=>{return i.keyid==id.keyid});
                        tempMenu.orderby=index;
                    });
                    
                    m.menus=_.sortBy(m.menus,'orderby');
                }

            });
        });
      },
      menu_mouseenter(menu,index){
         blnWillClose=false;
         if(closeTime){
             clearTimeout(closeTime);
             blnClose=true;
         }
         //blnClose=false;
         this.curIndex=index;
      },
      menu_mouseleave(){
         closeTime = setTimeout(()=>{
              if(!blnClose){blnClose=true;return;}
              this.curIndex=-1;
          },300);
      },
      menu_item_mouseenter(){
        blnWillClose=false;
        blnClose=false;
        this.$emit('Blnshow',true);
      },
      menu_item_mouseleave(e){
        let {clientX:x}=e;
        this.leaveStart=x;
        blnWillClose=true;
      },
      //菜单项单击事件
      item_click(menu){
          if(this.blnDrag){return;}
          
          //链接外部页面
          if(menu.src && !menu.inner){
            this.$emit('LinekPage',menu);
            return;
          }

          menu.type=menu.type || 'templatePage';
          menu.id=menu.keyid;
          this.$store.commit(AddHistoryMenu,menu);
          this.curIndex=-1;
          this.$emit('Blnshow',false);
      },
      ResizeHandler(){
        this.sly.reload();
      },
      MouseMoveHandler(e){
        let {clientX:x}=e;
        if(blnWillClose && Math.abs(this.leaveStart - x)>50){//判断鼠标离开容器50px距离后才隐藏菜单
            blnWillClose=false;
            this.curIndex=-1;
            this.$emit('Blnshow',false);
        }
      }
  }
}
</script>

<style scoped lang="less">
  @backgrounImg:rgba(226,226,226,.9);

  .sideMenu .kind_container,
  .sideMenu .kind_container .sideMenu_conatiner,
  .sideMenu{height:100%;width:100%;color:#2c3e50;}
  .sideMenu .sideMenu_conatiner .kind_item{height:60px;font-size:25px;cursor: pointer;color:white;display:table;width:100%;}
  .sideMenu .sideMenu_conatiner .kind_item .item{height:100%;width:100%;}
  .sideMenu .sideMenu_conatiner .kind_item .item i{margin-left:10px;}
  .sideMenu .sideMenu_conatiner .kind_item .item:hover{background-color:white;}
  .sideMenu .pos_container{height:100%;width:100%;position:absolute;z-index:100;}

  .sideMenu .sideMenu_conatiner .kind_item.active{background-color:#262b2d;}


  .sideMenu .kind_menu_container{
    position:absolute;height:100%;width:330px;top:0px;left:340px;.transLine(.3s);z-index:0;
    -moz-box-shadow:-4px 0px 2px #BFBFBF; -webkit-box-shadow:-1px 0px 2px #BFBFBF; box-shadow:-1px 0px 2px #BFBFBF;
  }
  .sideMenu .kind_menu_container.active{left:-330px;}
  @menuTitleH:20px;
  .sideMenu .kind_menu_container .title{@height:@menuTitleH;padding:10px 0px;color:white;}
  .sideMenu .kind_menu_container .content{
    height:~"calc(100% - @{menuTitleH} - 20px)";width:100%;overflow-y:auto;position:relative;color:white;
    background-image: url('../assets/page_bg.jpg');
    background-repeat: no-repeat;
    background-size: auto 100%;
   }
  .sideMenu .kind_menu_container .content .menu_item{
      //float:left;width:33.3%;height:100px;margin-top:0px;border-radius:0px;position:relative;.border('bottom');.border('right');
      width:30%;margin-left:2.5%;margin-top:10px; border-radius:5px;overflow:hidden;
   }
   .sideMenu .kind_menu_container .content .menu_item:hover{z-index:100 !important;}
  .sideMenu .kind_menu_container .content .menu_item i{font-size:30px;margin-bottom:10px;}
  
  .sideMenu .kind_menu_container .content .menu_item.complete:hover i{color:white;}
  .sideMenu .kind_menu_container .content .menu_item.complete:hover{cursor: pointer;}
  .sideMenu .kind_menu_container .content .menu_item ._container {height:96px;.transLine();}

  .sideMenu .kind_menu_container .content .menu_item ._container .icon_container{
    height:60px;line-height:60px;
  }
  .sideMenu .kind_menu_container .content .menu_item ._container .info_container{height:36px;line-height:36px;background-color:white;color:black;position:relative;padding: 0px 10px;}

  .sideMenu .kind_menu_container .content .menu_item ._container .info_container .triangle_border_down{
    width:0;
    height:0;
    border-width:6px 8px 0;
    border-style:solid;
    border-color:@mainCol transparent transparent;/*灰 透明 透明 */
    position: absolute;
    top: 0px;
    left: 50%;
    margin-left: -8px;
  }

  .sideMenu .kind_menu_container .content .menu_item.complete:hover ._container{
      //transform:translate(-5px,-5px);
      color:white;
    //   z-index:100;
    //   box-shadow:
    //     1px 1px 0 #CCC,
    //     2px 2px 0 #CCC, /* end of 2 level deep grey shadow */
    //     3px 3px 0 #bcc0c9,
    //     4px 4px 0 #bcc0c9,
    //     5px 5px 0 #bcc0c9,
    //     6px 6px 0 #bcc0c9, /* end of 4 level deep dark shadow */
    //     7px 7px 0 #bcc0c9,
    //     8px 8px 0 #bcc0c9,
    //     9px 9px 0 #bcc0c9; /* end of 4 level deep dark shadow */
    // -moz-box-shadow:2px 2px 2px #BFBFBF; -webkit-box-shadow:2px 2px 2px #BFBFBF; box-shadow:2px 2px 2px #BFBFBF;
  }

  .sideMenu .kind_menu_container .content .menu_item .info_mask{position:absolute;width:100%;height:100%;top:0px;left:0px;background:rgba(0,0,0,.6);color:white;}
  .sideMenu .kind_menu_container .content .menu_item .info_mask .info_mask_container{display:table;width:100%;height:100%;}
  .sideMenu .kind_menu_container .content .menu_item .info_mask .info_mask_container div{display:table-cell;vertical-align: middle;}


//菜单排序标示菜单可被替换
.menuReplace{
  border: 1px dashed !important; 
  border-radius: 5px !important;
  z-index:10 !important;
}
</style>
