
/* eslint-disable */
$.fn.extend({
		//---元素拖动插件
    dragging:function(data={}){   
		var $this = $(this);
		var xPage;
		var yPage;
		var X;//
		var Y;//
		var father = $this.parent();
		var defaults = {
			move : 'both',
			randomPosition : true ,
			defPos:'leftBottom',//默认位置
			moveInstans:5,//判定移动距离
			curMousePosX:0,//鼠标按下的位置
			curMousePosY:0,
			hander:1,
			xbound:function(){},
			ybound:function(){},
			dragStart:function(){},
			dragMove:function(){}
		}
		var opt = $.extend({},defaults,data);
		var movePosition = opt.move;
		var random = opt.randomPosition;
		
		var hander = opt.hander;
		
		if(hander == 1){
			hander = $this; 
		}else{
			hander = $this.find(opt.hander);
		}
		
			
		//---初始化
		father.css({"position":"relative","overflow":"hidden"});
		$this.css({"position":"absolute"});
		hander.css({"cursor":"pointer"});

		var faWidth = father.width();
		var faHeight = father.height();
		var thisWidth = $this.width()+parseInt($this.css('padding-left'))+parseInt($this.css('padding-right'));
		var thisHeight = $this.height()+parseInt($this.css('padding-top'))+parseInt($this.css('padding-bottom'));
		
		var mDown = false;//
		var positionX;
		var positionY;
		var moveX ;
		var moveY ;
		
		if(random){
			$thisRandom();
		}
		function $thisRandom(){ //随机函数
			$this.each(function(index){
				var randY = parseInt(Math.random()*(faHeight-thisHeight));///
				var randX = parseInt(Math.random()*(faWidth-thisWidth));///
				if(movePosition.toLowerCase() == 'x'){
					$(this).css({
						left:randX
					});
				}else if(movePosition.toLowerCase() == 'y'){
					$(this).css({
						top:randY
					});
				}else if(movePosition.toLowerCase() == 'both'){
					$(this).css({
						top:randY,
						left:randX
					});
				}
				
			});	
		}

		if(opt.defPos=='leftBottom'){
			moveX=10;
			moveY=10;
			$(this).css({
				bottom:moveY,
				left:moveX
			});
		}

		if(opt.defPos=='rightBottom'){
			moveX=faWidth-thisWidth;
			moveY=faHeight-thisHeight;
			$(this).css({
				top:moveY,
				left:moveX
			});
			opt.ybound(1,faHeight-thisHeight,moveX,moveY);
			opt.xbound(1,faWidth-thisWidth,moveX,moveY);
		}
		if(opt.defPos=='rightCenter'){
			moveX=faWidth-thisWidth;
			moveY=(faHeight-thisHeight)/2;
			$(this).css({
				top:moveY,
				left:moveX
			});
			opt.ybound(-1,faHeight-thisHeight,moveX,moveY);
			opt.xbound(1,faWidth-thisWidth,moveX,moveY);
		}
		
		hander.mousedown(function(e){
			opt.curMousePosX=e.clientX;
			opt.curMousePosY=e.clientY;
			
			father.children().css({"zIndex":"0"});
			$this.css({"zIndex":"1"});
			mDown = true;
			X = e.pageX;
			Y = e.pageY;
			positionX = $this.position().left;
			positionY = $this.position().top;

			opt.dragStart(faWidth-thisWidth,faHeight-thisHeight,positionX,positionY);
			return true;
		});
			
		$(document).mouseup(function(e){
			let {clientX:x,clientY:y}=e;
			if(Math.abs(opt.curMousePosX-x)<=opt.moveInstans &&
			   Math.abs(opt.curMousePosY-y)<=opt.moveInstans){
				opt.clickHandler(e);
			}
		

			mDown = false;
			let blnBound=false;
			if(moveX<0){opt.xbound(0,faWidth-thisWidth,moveX,moveY);blnBound=true;}
			else if(moveX>=(faWidth-thisWidth)){opt.xbound(1,faWidth-thisWidth,moveX,moveY);blnBound=true;}
			else if(!blnBound){ opt.xbound(-1,faWidth-thisWidth,moveX,moveY,e);}

			if(moveY<0){opt.ybound(0,faHeight-thisHeight,moveX,moveY);blnBound=true;}
			else if(moveY>faHeight-thisHeight){opt.ybound(1,faHeight-thisHeight,moveX,moveY);blnBound=true;}
			else if(!blnBound){opt.ybound(-1,faHeight-thisHeight,moveX,moveY,e);}
		});
			
		$(document).mousemove(function(e){
			if(mDown){
				xPage = e.pageX;//--
				moveX = positionX+xPage-X;
				
				yPage = e.pageY;//--
				moveY = positionY+yPage-Y;
				opt.dragMove();
			}

			function thisXMove(){ //x轴移动
				if(mDown == true){
					$this.css({"left":moveX});
				}else{
					return;
				}
				if(moveX < 0){
					$this.css({"left":"0"});
				}
				if(moveX > (faWidth-thisWidth)){
					$this.css({"left":faWidth-thisWidth});
				}
				return moveX;
			}
			
			function thisYMove(){ //y轴移动
				if(mDown == true){
					$this.css({"top":moveY});
				}else{
					return;
				}
				if(moveY < 0){
					$this.css({"top":"0"});
				}
				if(moveY > (faHeight-thisHeight)){
					$this.css({"top":faHeight-thisHeight});
				}
				return moveY;
			}

			function thisAllMove(){ //全部移动
				if(mDown == true){
					$this.css({"left":moveX,"top":moveY});
				}else{
					return;
				}
				if(moveX < 0){
					$this.css({"left":"0"});
				}
				if(moveX > (faWidth-thisWidth)){
					
					$this.css({"left":faWidth-thisWidth});
				}

				if(moveY < 0){
					$this.css({"top":"0"});
				}
				if(moveY > (faHeight-thisHeight)){
					$this.css({"top":faHeight-thisHeight});
				}
			}
			if(movePosition.toLowerCase() == "x"){
				thisXMove();
			}else if(movePosition.toLowerCase() == "y"){
				thisYMove();
			}else if(movePosition.toLowerCase() == 'both'){
				thisAllMove();
			}
		});
    }
}); 