function getStyle(obj,prop){
	if(obj.currentStyle){
		return obj.currentStyle[prop]
	}else{
		return getComputedStyle(obj,false)[prop]
	}
}

function getByClass(element,className){
	var aChild = element.getElementsByTagName("*");
	var result = [];
	for(var i=0 ; i<aChild.length ; i++){
		if(aChild[i].className==className){
			result.push(aChild[i])
		}
	}
	return result;
}
function move(obj,json,fn){

	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var bStop = true;

		for(var attr in json){

			var cur = 0;
			if (attr=="opacity") {
				cur = parseFloat(getStyle(obj,attr))*100
			}else{
				cur = parseInt(getStyle(obj,attr))
			};
			
			var speed = 0;
			speed = (json[attr]-cur)/6;
			speed = speed>0?Math.ceil(speed):Math.floor(speed);

			if (cur!=json[attr]) {
				bStop = false;
			};
			if (cur==json[attr]&&fn) {
				bStop = true;
			};
			cur= cur + speed;

			if (attr=="opacity") {
				obj.style[attr] = cur/100;
			}else{
				obj.style[attr] = cur + "px";
			};

		}
		if (bStop) {
			clearInterval(obj.timer);
			if (fn) {fn()};
		};
	},30)
}
window.onload = function(){
/********************************** 轮播图**********************************************/	
	var oPic = getByClass(document,"pic")[0];
	var oBanner1 = getByClass(document,"banner1")[0];
	var aPic = oPic.getElementsByTagName('li');
	var oCircle = getByClass(document,"circle")[0];
	var aCircle = oCircle.getElementsByTagName("li");
	var oPrev = getByClass(document,"prev")[0];
	var oNext = getByClass(document,"next")[0];
	var nClientWidth = document.documentElement.clientWidth;
	//left<0 							则一张也不加	i=0
	//如果右面的距离大于零小于一张图片宽度    加一张图片	i=1
	//如果大于一个图片的长度小于两张		加两张			i = 2
	//如果大于两张图片的长度小于三张		加三张			i = 3	
	//位置函数
	function pos(arr){
		var nWidth = oPic.offsetWidth;
		var left = parseInt((nWidth-arr[0].offsetWidth)/2);
		var iWidth = parseInt(getStyle(arr[0],"width"));
		var a = arr.length;
		var b = parseInt(left/iWidth);
		if (left<0) {
			for (var i = 0; i < arr.length; i++) {
				if (i<=(b+1)) {
					arr[i].style.left = (i*iWidth) + left + "px"
				}else{
					arr[i].style.left = -(a-i)*iWidth + left + "px"
				};
			};
		};
		if (left>0) {
			for (var i = 0; i < arr.length; i++) {
				if (i<=(b+2)) {
					arr[i].style.left = (i*iWidth) + left + "px"
				}else{
					arr[i].style.left = -(a-i)*iWidth + left + "px"
				};	
			};
		};																											
	}
	pos(aPic);
	window.onresize = function(){
		pos(aPic)
	}
	//鼠标移入小圆圈
	var now = 0; //第零个li
	var flag = true;
	for (var i = 0; i < aCircle.length; i++) {
		aCircle[i].index = i
		aCircle[i].onmouseover = function(){
			if (this.index<now) {
				flag = false
			}else{
				flag = true 
			};
			now = this.index;
			tab();
		}
	};
	//切换函数
	function tab(){
		if (flag) {
			oPic.style.left = "0px"
		}else{
			oPic.style.left = "-2880px"
		};
		var arr = Array.prototype.slice.call(aPic,0);
		var arr1 = arr.slice(now-1);
		var arr2 = arr.slice(0, now-1);
		arr = arr1.concat(arr2)
		pos(arr);
		for (var i = 0; i < arr.length; i++) {
			arr[i].style.opacity = 0.5
		};
		move(arr[1],{"opacity":100})
		move(oPic,{"left":-1440})
		for (var i = 0; i < aCircle.length; i++) {
			aCircle[i].style.background = ""
		};
		aCircle[now].style.background = "red"
	}

	//下一张，上一张
	oPrev.onmouseover = oNext.onmouseover = function(){
		move(this,{"opacity":100})
	}
	oPrev.onmouseout = oNext.onmouseout = function(){
		move(this,{"opacity":20})
	}	
	oNext.onclick = function(){
		now++;
		if (now==aPic.length) {
			now=0
		};
		flag = true;
		tab();
	}
	oPrev.onclick = function(){
		now--;
		if (now==-1) {
			now=aPic.length-1
		};
		flag = false;
		tab();	
	}

	//自动播放
	var timer = setInterval(oNext.onclick, 5000);
	oBanner1.onmouseover = function(){
		clearInterval(timer)
	}
	oBanner1.onmouseout = function(){
		if (flag) {
			timer = setInterval(oNext.onclick, 5000);
		}else{
			timer = setInterval(oPrev.onclick, 5000)
		};
		
	}
/******************************我的第五大道*****************************/
	var oMine = getByClass(document,"mine")[0];
	var oUl = oMine.getElementsByTagName("ul")[0];
	var oPhone = getByClass(document,"phone")[0];
	var oDiv = oPhone.getElementsByTagName("div")[0];
	oMine.onmouseover = function(){
		oUl.style.display = "block"
	}
	oMine.onmouseout = function(){
		oUl.style.display = "none"
	}
	oPhone.onmouseover = function(){
		oDiv.style.display = "block"
	}
	oPhone.onmouseout = function(){
		oDiv.style.display = "none"
	}
/******************************brandship*****************************/

	var brandship = getByClass(document,"brandship")[0];
	var brandshipUl = brandship.getElementsByTagName("ul")[0];
	var brandshipLi = brandshipUl.getElementsByTagName("li");
	var brandshipDiv = brandshipUl.getElementsByTagName("div");
	for (var i = 0; i < brandshipLi.length; i++) {
		brandshipLi[i].index = i;
		brandshipLi[i].onmouseover = function(){
			move(brandshipDiv[this.index],{"height":174})
		}
		brandshipLi[i].onmouseout = function(){
			move(brandshipDiv[this.index],{"height":54})
		}
	};
/******************************hotstore*****************************/
	var hotstore = getByClass(document,"hotstore")[0];
	var hotstoreUl = hotstore.getElementsByTagName("ul")[0];
	var hotstoreLi = hotstoreUl.getElementsByTagName("li");
	var hotstoreDiv = hotstoreUl.getElementsByTagName("div");
	var hotstoreImg = hotstoreUl.getElementsByTagName("img");
	var aLeftLine = hotstoreUl.getElementsByClassName("leftline");
	var aTopLine = hotstoreUl.getElementsByClassName("topline");
	var aRightLine = hotstoreUl.getElementsByClassName("rightline");
	var aBottomLine = hotstoreUl.getElementsByClassName("bottomline");
	for (var i = 0; i < hotstoreLi.length; i++) {
		hotstoreLi[i].index = i;
		hotstoreLi[i].onmouseover = function(){
			hotstoreImg[this.index].style.display = "none";
			hotstoreDiv[this.index].style.display = "block";
			move(aLeftLine[this.index],{"height":85});
			move(aTopLine[this.index],{"width":167});
			move(aRightLine[this.index],{"height":85});
			move(aBottomLine[this.index],{"width":167});
		}
		hotstoreLi[i].onmouseout = function(){
			hotstoreImg[this.index].style.display = "block";
			hotstoreDiv[this.index].style.display = "none";
			move(aLeftLine[this.index],{"height":0});
			move(aTopLine[this.index],{"width":0});
			move(aRightLine[this.index],{"height":0});
			move(aBottomLine[this.index],{"width":0});
		}
	};
/******************************storesametitle*****************************/
	var storesametitle = getByClass(document,"storesametitle")[0];
	var storesametitleNav = getByClass(document,"storesametitle_nav")[0];
	var storesametitleNavLi = storesametitleNav.getElementsByTagName("li");
	var storesametitleBank = storesametitle.getElementsByClassName("bank")[0];
	var storesametitlebank = storesametitle.getElementsByClassName("storesametitle_Bank")[0];
	for (var i = 0; i < storesametitleNavLi.length; i++) {
		storesametitleNavLi[i].index = i;
		storesametitleNavLi[i].onmouseover = function(){
			for (var i = 0; i < storesametitleNavLi.length; i++) {
				storesametitleNavLi[i].style.background = "#999999";
				move(storesametitlebank,{"left":-1210*(this.index)})
			};
			this.style.background = "black";
			
		}
	};

	var aInfo = storesametitle.getElementsByClassName("info");
	var aInfoDiv = storesametitle.getElementsByClassName("infodiv");
	var aInfoImg = storesametitle.getElementsByClassName("infoimg");
	for (var i = 0; i < aInfo.length; i++) {
		aInfo[i].index = i
		if (i==1||i==7) {
			aInfo[i].onmouseover = function(){
				move(aInfoDiv[this.index],{"left":30});
				move(aInfoImg[this.index],{"left":185});
			}
			aInfo[i].onmouseout = function(){
				move(aInfoDiv[this.index],{"left":70});
				move(aInfoImg[this.index],{"left":160});
			}
		}else{
			aInfo[i].onmouseover = function(){
				move(aInfoDiv[this.index],{"left":30});
				move(aInfoImg[this.index],{"left":60});
			}
			aInfo[i].onmouseout = function(){
				move(aInfoDiv[this.index],{"left":70});
				move(aInfoImg[this.index],{"left":35});
			}
		};
	};
/******************************shopcenter*****************************/
	var shopcenter = getByClass(document,"shopcenter_nav")[0];
	var shopcenterLi = shopcenter.getElementsByTagName("li");
	var shopcenterDiv = shopcenter.getElementsByTagName("div");
	for (var i = 0; i < shopcenterLi.length; i++) {
		shopcenterLi[i].index = i;
		shopcenterLi[i].onmouseover = function(){
			move(shopcenterDiv[this.index],{"top":-50})
		}
		shopcenterLi[i].onmouseout = function(){
			move(shopcenterDiv[this.index],{"top":0})
		}
	};
/******************************motai*****************************/
	var motaiBg = getByClass(document,"motai_bg")[0];
	var motai = getByClass(document,"motai")[0];
	var motaiSpan = motai.getElementsByTagName("span")[0];
	function moTai(){
		var clientWidth = document.documentElement.clientWidth;
		var clientHeight = document.documentElement.clientHeight;
		var scrollTop = document.body.scrollTop||document.documentElement.scrollTop;
		motai.style.left = (clientWidth-535)/2 + "px";
		motai.style.top = (clientHeight - 665)/2 + scrollTop + "px";
		motaiBg.style.width = clientWidth + "px";
		motaiBg.style.height = clientHeight + "px";
		motaiBg.style.position = "fixed";
		setTimeout(function(){
			motai.style.display = "block";
			motaiBg.style.display = "block";
		}, 500)
	}
	window.onreload  = window.onresize = function(){
		moTai()
	}
	moTai();
	window.onscroll = function(){
		if (!close) {
			moTai()
		}
	};
	var close = false;
	motaiSpan.onclick = function(){
		motai.style.display = "none";
		motaiBg.style.display = "none";
		close = true;
	}
	setTimeout(function(){
			motai.style.display = "none";
			motaiBg.style.display = "none";
			close = true;
		}, 15000)
/************************************* 树形图*******************************************/
	var oThirdMenu = document.getElementsByClassName("thirdmenu");
	var oSecondMenu = document.getElementsByClassName("secondmenu");
	var arr = [0,-32,-64,-96,-32,-32,-23,-226,-9,-28,-73,-105,-124,-156,-222];
	console.log(arr.length)
	for (var i = oSecondMenu.length - 1; i >= 0; i--) {
		oSecondMenu[i].index = i ;
		oSecondMenu[i].onmouseover = function(){
			oThirdMenu[this.index].style.top = arr[this.index] + "px"
		}
	};
}

	

				