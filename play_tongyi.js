var cheight=function() {
    if ( $(window).width()<768 ) {
        $("#playbox").css("height","230px");
    }else{
    	$("#playbox").css("height","450px");
    } 
}

if( VideoInfoList.substring(0,3) == '$$$' ) {
    VideoInfoList = VideoInfoList.substring(3, VideoInfoList.length);
}

cheight();
$(window).resize(function() {
  cheight(); 
});
var isWap = !__isPc;
function getplayer(player){
    if ( player.indexOf("qcloud")>-1 ) {
        return "/ng.php?v=2&id=";
    } 
    return "https://jx.okokjx.com/okokjiexi/jiexi.php?url=";
    // return "https://api.2myw.com/?url=";
}
function compileStr(code){ //对字符串进行加密       
  var c=String.fromCharCode(code.charCodeAt(0)+code.length);
 for(var i=1;i<code.length;i++)
  {      
   c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
 }   
 return escape(c);   }
function uncompileStr(code){      
 code=unescape(code);      
 var c=String.fromCharCode(code.charCodeAt(0)-code.length);      
 for(var i=1;i<code.length;i++)
 {      
  c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));      
 }      
 return c;   }
var __t = Math.round(new Date() / 1000);
function set_iframe_src(src){
    
	$("#playbox").html(
        '<iframe class="zanpiancms-play-iframe" id="buffer" src="/loading.html" width="100%" height="450" frameborder="0" scrolling="no" style="position:absolute;z-index:9;"></iframe>'+
        '<iframe allowtransparency="true" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" width="100%" height="230" id="vod" src="' + src + '" frameborder=0 border=0 marginwidth=0 marginheight=0 scrolling="0" frameborder="0"></iframe>'
    );
    if ( $(window).width()<768 ) {
        $("#buffer").css("height","230px");
    }
    $("#vod").load(function(){
        var __t1 = Math.round(new Date() / 1000);
        
        //console.log(__t1 - __t);
        if( __t1 - __t >3 ){
            $("#buffer").hide();  
            //console.log("iframe loaded 1");
        }else{
           // console.log("iframe loaded 2");
            var _to = 4000 - (__t1 - __t)*1000;
            setTimeout(function(){
                $("#buffer").hide();
                //console.log("iframe loaded 3");
            },_to);
        }
         
    });
    setTimeout(function(){
        $("#buffer").hide();
    },14000);
}
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}
function handle_jx(vid,player){
    if( !vid ){
        return false;
    }
    
    if (  vid.indexOf("http://") >-1 ) {
        vid = vid.replace("http://","https://");
    }
    if (  vid.indexOf("m3u8/speed") >-1 ) {
        if ( !isWap ) {
            $("#playbox")
            .css("text-align","center")
            .css("font-size",24)
            .css("color","#fff")
            .html("<br>由于版权原因，请用手机浏览器访问【<span style='color:red;'>www.965ys.net</span>】，搜索片名进行观看。");
            return false;
        }
        var ngid = vid.split("/")[5].split(".")[0];
        set_iframe_src( "/ng.php?v=2&id=" + ngid);
        return false;
    }
    //console.log(vid);
    if (
        player == 'mp4'
    ){
        set_iframe_src( "/direct_m3u8.html?v=2&vid="+vid );
    }else if( player == 'ckplayer' || player.indexOf("m3u8")>-1 || vid.indexOf(".m3u8")>-1   ){
        set_iframe_src( "/direct_m3u8.html?v=3&vid="+ vid );
    }else if(  player == 'link' || player.indexOf("yun")>-1 || player.indexOf("33uu")>-1 || player.indexOf("zy")>-1 ){
        set_iframe_src(vid);
    }else{
        if (  player == 'youku' && vid.indexOf("http")==-1 ) {
            vid = "https://v.youku.com/v_show/id_"+vid+".html";
        }
      	var ret = getplayer(player);
      	if( !ret ){
   			 $("#playbox")
       	 	.css("text-align","center")
        	.css("font-size",24)
        	.css("color","#fff")
        	.html("<br>该线路已失效，请切换其他线路");
        }else{
        	var url = compileStr( ret + vid );
        	set_iframe_src("/f.html?u="+url);
        }
    }
}
function play() {
    if( !VideoInfoList || VideoInfoList =='' ) {
        return false;
    }
    var d =  VideoInfoList.split("$$$");
	if( d.length<1 ){
	    d = [d];
	}
	var index_arr = location.href.split(".html")[0].split("/")[4].split("-");
	var num1 = index_arr[1];
	var num2 = index_arr[2];
	if( num1 >= d.length ){
	    num1 = d.length-1;
	}
	var tmp = d[num1];
	var tmpp = tmp.split("$$");
	var tmp2 = tmpp[1].split("#");
	if( num2 >= tmp2.length ){
	    num2 = tmp2.length-1;
	}
	
	var cur = tmp2[num2];
	var tmp3 = cur.split("$");
	var vid = tmp3[1];
	//console.log(tmp);
	//console.log(tmp2);
	//console.log(tmp3);
	//console.log(vid);
	var player = typeof tmp3[2] == 'undefined' ? "" : tmp3[2];
	if( !player ){
	    if( vid.indexOf("m3u8")>-1 ){
	        player = 'm3u8';
	    }else{
	        player = 'link';
	    }
	}
	//console.log("vid",vid);
	//console.log("player",player);
	handle_jx(vid,player);
	
};
$(document).ready(function(){
    play();
});