// 工具包
/* eslint-disable */

export default {
    toString:Object.prototype.toString,
    valueFn:function(value) {return function() {return value;};},
    isUndefined:function(value){return typeof value === 'undefined';},
    isDefined:function(value){return typeof value !== 'undefined';},
    isObject:function(value){return value != null && typeof value === 'object';},
    isString:function(value){return typeof value === 'string';},
    isNumber:function(value){return typeof value === 'number';},
    isDate:function(value){return Object.prototype.toString.call(value) === '[object Date]';},
    isArray:function(value){return Object.prototype.toString.call(value) === '[object Array]';},
    isFunction:function(value){return typeof value === 'function';},
    isRegExp:function(value) {return Object.prototype.toString.call(value) === '[object RegExp]';},
    isFile:function(obj) {return Object.prototype.toString.call(obj) === '[object File]';},
    isBoolean:function(value) {return typeof value === 'boolean';},
    isWindow:function(obj) {return obj && obj.document && obj.location && obj.alert && obj.setInterval;},
    guid() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    msg(res,successMsg,faildMsg){
         let blnSuccessed=res.msg.code=='successed';
         faildMsg=res.msg.isShowSysTip? res.msg.note:faildMsg || res.msg.note;
         if(blnSuccessed){
             if(!successMsg){return blnSuccessed;}
             dialog.msg(successMsg);
         }else{
             if(faildMsg){
                 dialog.msg(faildMsg);
             }
         }

         return blnSuccessed;
    },
    iconMsg(msg,icon){
        icon=icon || 'fa-li fa fa-spinner fa-spin';
        return dialog.msg(`<div style="height: 24px;color: white;position: relative;">
                    <i class="${icon}" style="font-size: 20px;position: absolute;left: -30px;"></i>
                    <span style="margin-left:10px;">${msg}</span>
                    </div>`,{shade:0.3,time:0});
    },
    closeMsg(index){
        dialog.close(index);
    },
    //询问框
    confirm(title,option,...args){
      let okfuncCallback=function(){};
      if(args && args.length>=1){
        okfuncCallback=args.shift();
      }
      dialog.confirm(title,{btn:option},(index)=>{okfuncCallback();dialog.close(index);},...args);
    },
    //NoBtnComfirm
    NoBtnComfirm(title,option,...args){
        let okfuncCallback=function(){};
        if(args && args.length>=1){
            okfuncCallback=args.shift();
        }
        dialog.confirm(title,{btn:option,closeBtn:false},(index)=>{okfuncCallback();dialog.close(index);},...args);
    },
    info(msg){
        dialog.msg(msg);
    },
    tipSuccess(msg){
        dialog.msg(`<i class="fa fa-check-circle" style="font-size:30px;margin-right:10px;" /><span style="float: right;margin-top: 5px;">${msg}</span>`);
    },
    tipFailure(msg){
        dialog.msg(`<i class="fa fa-warning" style="font-size:30px;margin-right:10px;" /><span style="float: right;margin-top: 5px;">${msg}</span>`);
    },
    show(option){
        dialog.open({
            type: 1,
            skin: 'layui-dialog-rim', //加上边框
            title:option.title || '',
            area: option.area,
            content: option.content
        });
    },
    //用来判断递归执行完成后再执行
    counter:function(func,count){
        return {
            count:count || 1,
            add:function(){this.count++;},
            exec:function(){
                if(--this.count>0){return;}
                if(!arguments || arguments.length<=1){func(arguments);}
                else{
                    func.apply(this,arguments || []);
                }
            }
        };
    },
    /* 
    * 延迟触发函数
    * func:'触发函数'
    * context:触发上下文(该参数必须是持久对象)
    * delaytime:延迟触发时间(默认延迟500毫秒)
    */
    dr: function (func, context, delaytime) {
        delaytime = delaytime || 500;
        if (context.Fx_DelayTimerId) {
            clearTimeout(context.Fx_DelayTimerId);
            context.Fx_DelayTimerId = setTimeout(function () {
                delete context.Fx_DelayTimerId;
                func.apply(context, arguments || []);
            }, delaytime);
            return;
        }
        context.Fx_DelayTimerId = setTimeout(function () {
            delete context.Fx_DelayTimerId;
            func.apply(context, arguments || []);
        }, delaytime);
    },
    hasPro(obj){
        let count=0;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
            count++;
            }
        }

        return count>0;
    },
    /* 
     * 字符串日期转化时间戳
     * timeStr:日期字符串(yyyy-MM-dd hh:mm:ss)
     */
    Timestamp:function(timeStr){
        let result;
        if(timeStr instanceof Date){
            result=this.DateFormat(timeStr,'yyyy-MM-dd hh:mm:ss');
        }else if(typeof(timeStr) ==  'string'){
            result=timeStr;
        }
        return Date.parse(result.replace(/-/g, "/"))/1000;
    },
    /* 
     * 将时间戳转化为指定日期格式
     * timestampStr:时间戳字符串
     * format:日期格式字符串(yyyy-MM-dd h:m:s)
     */
    DateByTimestamp:function(timestampStr,format){
        if(!timestampStr) return '';
        var dateFormat=function(dateobj){
            var date = {
                    "M+": dateobj.getMonth() + 1,
                    "d+": dateobj.getDate(),
                    "h+": dateobj.getHours(),
                    "m+": dateobj.getMinutes(),
                    "s+": dateobj.getSeconds(),
                    "q+": Math.floor((dateobj.getMonth() + 3) / 3),
                    "S+": dateobj.getMilliseconds()
            };
        if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (dateobj.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
        }
        return format;				 
        };
        
        var newDate = new Date();
        newDate.setTime(timestampStr * 1000);
        
        return dateFormat(newDate);
    },
    DateFormat(dateobj,format){
        if(!dateobj) return '';
        var date = {
                    "M+": dateobj.getMonth() + 1,
                    "d+": dateobj.getDate(),
                    "h+": dateobj.getHours(),
                    "m+": dateobj.getMinutes(),
                    "s+": dateobj.getSeconds(),
                    "q+": Math.floor((dateobj.getMonth() + 3) / 3),
                    "S+": dateobj.getMilliseconds()
            };
        if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (dateobj.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
        }
        return format;		
    },
    Clone: function (myObj,targetObj,exclude) {
        if (typeof (myObj) != 'object') return myObj;
        if (myObj instanceof Date)  return myObj;
        if (myObj == null) return myObj;
        if (myObj instanceof Array) {
            myNewObj = targetObj || new Array();
        } else {
            var myNewObj = targetObj || new Object();
        }
        for (var i in myObj)
        {
            if(exclude && exclude.indexOf(i)>=0)continue;

            if(myObj.hasOwnProperty(i)){
                myNewObj[i] = this.Clone(myObj[i]);
            }
        }
 
        return myNewObj;
    },
    format: function (format) {
        var formatRe = /\{(\d+)\}/g;

        var args = new Array();
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }

        return format.replace(formatRe, function (m, i) {
            return args[i];
        });
    },
    formatPop:function(format,obj){
         var formatRe = /\{([^{}]*?)\}/g;
         return format.replace(formatRe, function (m, i) {
            return obj[i] || '';
        });
    },
    formatFunc:function(format,func){
         var formatRe = /\{([^{}]*?)\}/g;
         return format.replace(formatRe, function (m, i) {
            return func(i);
        });
    },
    CheckDateTime:function(str){  
        var reg = /^(\d+)\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;  
        var r = str.match(reg);  
        if(r==null)return false;  
        r[2]=r[2]-1;  
        var d= new Date(r[1], r[2],r[3], r[4],r[5], r[6]);  
        if(d.getFullYear()!=r[1])return false;  
        if(d.getMonth()!=r[2])return false;  
        if(d.getDate()!=r[3])return false;  
        if(d.getHours()!=r[4])return false;  
        if(d.getMinutes()!=r[5])return false;  
        if(d.getSeconds()!=r[6])return false;  
        return true;
    },
    //判断元素是否为Jquery对象
    //dom:元素
    IsJqObj: function (dom) {
        var BlnJQuery = false; //判断对象是否Jquery对象
        if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
        //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
        if (dom.selector != undefined) { BlnJQuery = true; }
        
        return BlnJQuery;
    },
    //动画执行完回调函数
    //dom:'执行动画元素'
    //callback:动画执行完回调函数
    animationend:function(dom,callback){
        var t;
        var curanimation=null;
        dom = this.IsJqObj(dom) ? dom[0]:dom;
        
        var animations = {
            'animation':'animationend',
            'Oanimation':'oanimationend ',
            'Mozanimation':'mozAnimationEnd ',
            'Webkitanimation':'webkitAnimationEnd  ',
            'Msanimation':'MSAnimationEnd '
        };

        for(t in animations){
            if(dom.style[t] !== undefined ){
                curanimation=animations[t];
            }
        }
        
        if(!curanimation){return;}
        dom.addEventListener(curanimation, function(){ //动画结束时事件 
            callback(dom);
        }); 		
    }, 
    //递归数组执行
    //arr:递归数组
    //childKey:用于判断数组是否含有子项的属性名
    //func:每项执行的方法
    //completeFunc:递归完成后执行的方法
    recur:function(arr,childKey,func,completeFunc){
        if(!arr){return}

        var counter=this.counter(completeFunc || function(){});
        var exec=function(arr,childKey,func,counter,parentArr,deep,parent){
            var delIndexs=[];
            for(var i=0;i<arr.length;i++){
                var blnDelNode=false;
                arr[i].nodeDeep=deep;
                if(func){blnDelNode=func(arr[i],i,parent);}
                if(blnDelNode){delIndexs.push(i);}
    
                if(arr[i][childKey] && arr[i][childKey].length>0 && !blnDelNode){
                    counter.add();
                
                    arguments.callee.apply(this,[arr[i][childKey],childKey,func,counter,parentArr,deep+1,arr[i]]);
                }
            }
            for(var j=0;j<delIndexs.length;j++){
                arr.splice(delIndexs[j]-j,1);
            }

            counter.exec(parentArr);
        };

        exec(arr,childKey,func,counter,arr,0);
    },
    recurByFunc:function(arr,baseD,filterFunc,func,completeFunc){
        if(!arr){return}

        var counter=this.counter(completeFunc || function(){});
        var exec=function(arr,baseD,filterFunc,func,counter){
            let d=filterFunc(arr,baseD);

            if(d){
                counter.add();
                arguments.callee.apply(this,[arr,d,filterFunc,func,counter]);
            }

            counter.exec(d);
        };

        exec(arr,baseD,filterFunc,func,counter);
    },
    recurByArr:function(arr,filterFunc,completeFunc){
        if(!arr){return}

        var counter=this.counter(completeFunc || function(){});
        var exec=function(arr,filterFunc,counter){
            for(let i=0;i<arr.length;i++){
                filterFunc(arr[i],arr);
            }

            counter.exec(arr);
        };

        exec(arr,filterFunc,counter);
    },
    isArrayLike:function(obj) {
        if (obj == null || this.isWindow(obj)) {
        return false;
        }

        var length = obj.length;

        if (obj.nodeType === 1 && length) {
        return true;
        }
        return this.isString(obj) || this.isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
    },
    each:function(obj,iterator,context){
        var key;
        if (obj) {
            if (this.isFunction(obj)){
                for (key in obj) {
                    if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                        iterator.call(context, obj[key], key);
                    }
                }
            } else if (obj.forEach && obj.forEach !== _.each) {
                obj.forEach(iterator, context);
            } else if (this.isArrayLike(obj)) {
                for (key = 0; key < obj.length; key++)
                if(iterator.call(context, obj[key], key)==false)break;
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if(iterator.call(context, obj[key], key)==false)break;
                    }
                }
            }
        }
        return obj;
    },
    //单例绑定事件
    //eventStr:事件字符串
    //dom:绑定事件源元素
    //func:事件处理函数
    SingleBind: function (eventStr, dom, func) {
        var queue = 'Fx_' + eventStr;//加入前缀避免与其他JS库命名冲突
        var BlnJQuery = false; //判断对象是否Jquery对象
        if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
        //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
        if (dom.selector != undefined) { BlnJQuery = true; }
        //如果是Jquery对象需要转化为JS对象
        if (BlnJQuery) { dom = dom[0]; }
        //生成事件唯一标识
        var id = queue + tool.guid(); //唯一标示符
        //判断是否已经注册了该事件
        if (!dom) { return; }
        if (dom[queue]) {
            //已经注册
            dom[queue][id] = func;//添加事件处理函数到队列中
        } else {
            //未注册
            dom[queue] = new Object();//初始事件队列对象
            dom[queue][id] = func;//添加事件处理函数到队列中
            //绑定事件
            $(dom).bind(eventStr, function (e) {
                var handler = this[queue];//事件处理集
                for (var key in handler) {
                    handler[key].call(dom, e);
                }
            });
        }
        //返回唯一标识(用于删除事件处理函数)
        return id;
    },
    //清除绑定事件
    //eventStr:事件字符串
    //dom:绑定事件元素
    //id:绑定事件唯一标识事件
    ClearBind: function (eventStr, dom, id) {
        if (!dom) { return;}
        var queue = 'Fx_' + eventStr;//加入前缀避免与其他JS库命名冲突
        var BlnJQuery = false; //判断对象是否Jquery对象
        if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
        //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
        if (dom.selector != undefined) { BlnJQuery = true; }
        //如果是Jquery对象需要转化为JS对象
        if (BlnJQuery) { dom = dom[0]; }

        if (dom[queue][id]) {
            delete dom[queue][id];
        }
    }, 
   /* 
    * 延迟触发函数
    * func:'触发函数'
    * context:触发上下文(该参数必须是持久对象)
    * delaytime:延迟触发时间(默认延迟500毫秒)
    */
    DelayTrigger: function (func, context, delaytime) {
        delaytime = delaytime || 500;
        if (context.Fx_DelayTimerId) {
            clearTimeout(context.Fx_DelayTimerId);
            context.Fx_DelayTimerId = setTimeout(function () {
                delete context.Fx_DelayTimerId;
                func.apply(context, arguments || []);
            }, delaytime);
            return context;
        }
        context.Fx_DelayTimerId = setTimeout(function () {
            delete context.Fx_DelayTimerId;
            func.apply(context, arguments || []);
        }, delaytime);

        return context;
    },
    browser:function(){  
        var browser = {appname: 'unknown', version: 0},  
            userAgent = window.navigator.userAgent.toLowerCase();  // 使用navigator.userAgent来判断浏览器类型
        //msie,firefox,opera,chrome,netscape  
        if ( /(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test( userAgent ) ){  
            browser.appname = RegExp.$1;  
            browser.version = RegExp.$2;  
        } else if ( /version\D+(\d[\d.]*).*safari/.test( userAgent ) ){ // safari  
            browser.appname = 'safari';  
            browser.version = RegExp.$2;  
        }  
        return browser;  
    },
    cookie:{
        set:function(name,value,time)
		{
			time=time || 's300'; //300秒
			var strsec = this.getsec(time);
			var exp = new Date();
			exp.setTime(exp.getTime() + strsec*1);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		}, 
		get:function(name)
		{
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		 
			if(arr=document.cookie.match(reg))
		 
				return unescape(arr[2]);
			else
				return null;
		}, 
		del:function(name)
		{
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval=this.get(name);
			if(cval!=null)
				document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		},
		getsec:function(str)
		{
		   var str1=str.substring(1,str.length)*1;
		   var str2=str.substring(0,1);
		   if (str2=="s")
		   {
				return str1*1000;
		   }
		   else if (str2=="h")
		   {
			   return str1*60*60*1000;
		   }
		   else if (str2=="d")
		   {
			   return str1*24*60*60*1000;
		   }
		}
    },
    getHeight: function (el, outer, round) {
        'use strict';
        if (outer) return el.offsetHeight;

        var height = window.getComputedStyle(el, null).getPropertyValue('height');
        var returnHeight = parseFloat(height);
        //IE Fixes
        if (isNaN(returnHeight) || height.indexOf('%') > 0 || returnHeight < 0) {
            returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
        }
        if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
        if (round) return Math.ceil(returnHeight);
        else return returnHeight;
    },
    getWidth: function (el, outer, round) {
        'use strict';
        var width = window.getComputedStyle(el, null).getPropertyValue('width');
        var returnWidth = parseFloat(width);
        //IE Fixes
        if (isNaN(returnWidth) || width.indexOf('%') > 0 || returnWidth < 0) {
            returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
        }
        if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
        if (round) return Math.ceil(returnWidth);
        else return returnWidth;
    },
    /* 
    * 加载文件
    * url:包含路径的文件名称
    * callback:文件加载完成后的回调函数
    * isJs:判断是否是加载JS文件,否则加载Css文件
    */
    loadJsCss: function (url, callback, isJs) {// 非阻塞的加载 后面的js会先执行
        var isJs = (isJs === undefined ? true : isJs),s=this;
        function onloaded(script, callback) {//绑定加载完的回调函数
            if (script.readyState) { //ie
                script.attachEvent('onreadystatechange', function () {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        //if(script.className=='loaded'){return;}
                        script.className = 'loaded';
                        callback && callback.constructor === Function && callback(true);
                    }
                });
            } else {
                var invoke=false;
                script.addEventListener('load', function () {
                    if(invoke){return;}
                    invoke=true;
                    script.className = "loaded";
                    callback && callback.constructor === Function && callback(false);
                    callback=null;
                }, false);
                if(s.VisitOri!='pc' && !isJs)s.DelayTrigger(function(){if(!invoke){invoke=true;if(callback){callback(false);callback=null;}}},new Object(),200);
            }
        }
        if (!isJs) { //加载css
            var links = document.getElementsByTagName('link');
            for (var i = 0; i < links.length; i++) {//是否已加载
                if (links[i].href.indexOf(url) > -1 && callback && (callback.constructor === Function)) {
                    //已创建script
                    if (links[i].className === 'loaded') {//已加载
                        callback();
                    } else {//加载中
                        onloaded(links[i], callback);
                    }
                    return;
                }
            }
            var link = document.createElement('link');
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(link);
            onloaded(link, callback);
        } else { //加载js
            var scripts = document.getElementsByTagName('script');

            for (var i = 0; i < scripts.length; i++) {//是否已加载
                if (scripts[i].src.indexOf(url) > -1 && callback && (callback.constructor === Function)) {
                    //已创建script
                    if (scripts[i].className === 'loaded') {//已加载	
                        callback(true);
                    } else {//加载中
                        onloaded(scripts[i], callback);
                    }
                    return;
                }
            }
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
            onloaded(script, callback);

        }
    },
    /* 
        * 加载多个文件(js,css)
        * arr:文件地址数组
        * callback:回调函数
        * blnSrc:是否为地址路径加载
        */
    loadMulFile:function(loadarr,callback,blnSrc){
        var arr=this.Clone(loadarr);
        var s=this;
        
        if(arr.length<=0){return;}
        var loadFunc=function(arr){
            if(arr.length==0){return;}
            var url= arr.shift();
            var fileSuffix=s.Match(url,s.Regular.FileSuffix);

            if(fileSuffix=='js' || fileSuffix=='css' || blnSrc){
                var blnJs=fileSuffix=='js' || (blnSrc && fileSuffix!='css');//是否是Js文件	
                s.loadJsCss(url,function(flag){
                    if(arr.length==0){
                        if(!callback){return;}
                        callback(flag);
                        callback=null;
                    }else{
                        loadFunc(arr);
                    }
                },blnJs);
                return;
            }
            loadFunc(arr);		
        };
        
        loadFunc(arr);
    },
    //规则
    Regular: {
        //手机号码
        'Phone': /^1(3\d|5[0-35-9]|7[07]|8[012345678-9])\d{8}$/,
            //文件后缀名
        'FileSuffix': /[^\.]+$/,
        //Script标签
        'Script':/<script\b[^<>]*?\bsrc=.*?>.*?<\/script>/ig,
        //样式标签
        'Link':/<link\b[^<>]*?\bhref=.*?(?:>|\/>)/gi,
        //Href路径
        'Href':/href=['"]?([^'"]*)['"]?/i,
        //Src路径
        'Src':/src=['"]?([^'"]*)['"]?/i,
        //nLoad(不加载)
        'nLoad':/nLoad=['"]?([^'"]*)['"]?/i,
        //图片格式
        'ImageFormat': (/\.jpg$|\.jpeg$|\.png$|\.ico$|\.gif$/i),
        //图片标签
        'ImageUrl': /<img.*?(?:>|\/>)/gi,
        //图片地址(Src)
        'ImgSrc': /src=['"]?([^'"]*)['"]?/i,
        //身份证
        'Identity': /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    },
    //匹配表达式内容
    Match: function (str, regular) {
        if (str == null || str == "") return "";
        return str.match(regular) || "";
    },
};
