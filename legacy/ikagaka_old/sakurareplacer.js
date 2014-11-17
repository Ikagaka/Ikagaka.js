//*****************************************************************************
//	さくらスクリプト解析・置換 JavaScirpt written by ukiya.
//	2005.05.13	ver1.0	初版作成
//	2005.05.16	ver1.1	バグ修正とIE外のブラウザに対する調整
//	2005.05.19	ver1.2	不正な\s[]タグでフリーズするバグを修正
//	2005.05.21	ver2.0	\g[ghostname]タグ追加
//	2005.05.21	ver2.1	\URL[url][text]タグ追加
//	2005.05.21	ver2.2	\URL[url]記法に対応
//	2005.05.21	ver2.3	\URL[url][text][option]記法に対応
//	2005.05.23	ver2.4	設定ファイルを外に出した。allowURL系オプション。
//	2005.05.24	ver2.5	\0,\1,\p[],\_w[],\n[],\qに対応
//	2005.05.24	ver2.6	\gにバグがあったのを修正
//	2005.05.24	ver2.7	48x64pix以外の画像に対応可能なように幅高さ指定を外した
//	2005.05.29	ver2.8	\s[-1]及び\s[数字以外]に対応
//	2005.05.29	ver2.9	改行コードを無視するように修正
//	2005.07.19	ver2.10	reverseSyncオプション追加
//						（シンクロ時サーフィスを\u\hの順に表示）
//*****************************************************************************


//**************************************
//	グローバル変数
//**************************************

var scopeA;
var surfaceA;
var textA;
var syncflagA;
var syncsurfaceA;
var ghostA;

//以下の関数呼出で画面内のスクリプトを探して置換する
//SakuraReplace();

//**************************************
//	SakuraReplace
//	ドキュメント内のスクリプトを探して解析・置換関数に渡す
//	【条件】
//	scripttag のクラスを持つタグで、かつその中身がscripttag で始まっていること
//	【形式】
//	sciipttag:ghostname:script
//**************************************
function SakuraReplace(){
	var allelements=getElementsByClass(scripttag);
	for(var i1=0; i1<allelements.length; i1++) {
		var obj=allelements[i1];
		var str;
		if (obj.innerText==null){
			str=obj.innerHTML;
		}else{
			str=obj.innerText;
		}
//		if(obj.className==scripttag){
			if(str!=null && str.substring(0,scripttag.length)==scripttag){
				scopeA=new Array();
				surfaceA=new Array();
				textA=new Array();
				syncA=new Array();
				syncsurfaceA=new Array();
				ghostA=new Array();
				var subtext1=str.substring(scripttag.length+1);
				var ighost=subtext1.indexOf(":",0);
				var script=subtext1.substring(ighost+1);
				var gname=subtext1.substring(0,ighost);
				SakuraParse(script,gname);
				var afterhtml=createHTML();
				try{
					obj.innerHTML=afterhtml;
				}catch(e){
				}
			}
//		}
	}
}

//**************************************
//	SakuraParse
//	与えられたスクリプトを解析してグローバル変数配列を構築する
//	【対応タグ】
//	\_s,\\,\n,\h,\u,\s[]
//	【無視するタグ】
//	\w1～\w9,\t,\e,\c,
//	上記以外のタグはそのまま表示される
//**************************************
function SakuraParse(text,ghost){
	var nowSurface=new Array();
	nowSurface[0]=0;
	nowSurface[1]=10;
	nowSurface[2]=10;
	nowSurface[3]=10;
	nowSurface[4]=10;
	nowSurface[5]=10;
	nowSurface[6]=10;
	nowSurface[7]=10;
	nowSurface[8]=10;
	nowSurface[9]=10;
//	var nowH=0;
//	var nowU=10;
	var nowScope=0;
	var nowText="";
	var nowGhost=ghost;
	var isYenMode=false;
	var isSync=false;

	//解析ループ開始　１文字ずつ拾って解析
	for(var i2=0;i2<text.length;i2++){
		var c=text.charAt(i2);
		if(isYenMode){//-----タグ解析ここから
			switch(c){
			case '_':
				var c2=text.charAt(i2+1);
				i2=i2+1;
				if(c2=='s'){
					if(isSync){
						isSync=false;
						addArray(0,nowSurface[0],nowText,true,nowSurface[1],nowGhost);
						nowText="";
					}else{
						isSync=true;
						addArray(nowScope,nowSurface[nowScope],nowText,false,0,nowGhost);
						nowText="";
					}
				}else if(c2=='q'){
					//なにもしない
				}else if(c2=='w'){
					//\_w読み飛ばし
					var itext=text.indexOf("]",i2+1);
					if(itext==-1){
						break;
					}
					i2=itext;
				}
				isYenMode=false;
				break;
			case 'w':
				i2=i2+1;
				isYenMode=false;
				break;
			case '\\':
				nowText+="\\";
				isYenMode=false;
				break;
			case 't':
				isYenMode=false;
				break;
			case 'n':
				if(nowText!=""){
					nowText+="<BR>";
				}
				//[half]読み飛ばし
				var c2=text.charAt(i2+1);
				if(c2=='['){
					var itext=text.indexOf("]",i2+1);
					if(itext==-1){
						break;
					}
					i2=itext;
				}
				isYenMode=false;
				break;
			case 'e':
				isYenMode=false;
				break;
			case 'c':
				//nowText+="\\c";
				isYenMode=false;
				break;
			case 'h':
			case '0':
				if(nowScope!=0){
					addArray(nowScope,nowSurface[nowScope],nowText,false,0,nowGhost);
					nowScope=0;
					nowText="";
				}
				isYenMode=false;
				break;
			case 'u':
			case '1':
				if(nowScope!=1){
					addArray(nowScope,nowSurface[nowScope],nowText,false,0,nowGhost);
					nowScope=1;
					nowText="";
				}
				isYenMode=false;
				break;
			case 'p':
				var itext=text.indexOf("]",i2+1);
				if(itext==-1){
					break;
				}
				var stext=text.substring(i2+2,itext);
				var scno=parseInt(stext);
				if(scno==Number.NaN){
					break;
				}
				if(nowScope!=scno){
					addArray(nowScope,nowSurface[nowScope],nowText,false,0,nowGhost);
					nowScope=scno;
					nowText="";
				}
				i2=itext;
				isYenMode=false;
				break;
			case 's':
				var itext=text.indexOf("]",i2+1);
				if(itext==-1){
					break;
				}
				var stext=text.substring(i2+2,itext);
				var sno=parseInt(stext);
				if(sno.toString()=="NaN"){
					sno=-1;
					//break;
				}
				if(nowSurface[nowScope]!=sno){
					addArray(nowScope,nowSurface[nowScope],nowText,false,0,nowGhost);
					nowText="";
					nowSurface[nowScope]=sno;
				}
				i2=itext;
				isYenMode=false;
				break;
			case 'g':
				var itext=text.indexOf("]",i2+1);
				if(itext==-1){
					break;
				}
				addArray(nowScope,nowSurface[nowScope],nowText,false,0,nowGhost);
				nowText="";
				var gtext=text.substring(i2+2,itext);
				nowGhost=gtext;
				nowSurface[0]=0;
				nowSurface[1]=10;
				nowSurface[2]=10;
				nowSurface[3]=10;
				nowSurface[4]=10;
				nowSurface[5]=10;
				nowSurface[6]=10;
				nowSurface[7]=10;
				nowSurface[8]=10;
				nowSurface[9]=10;
				nowScope=0;
				i2=itext;
				isYenMode=false;
				break;
			case 'U':
				if(text.charAt(i2+1)=='R' && text.charAt(i2+2)=='L' && allowURL==true){
					i2=i2+2;
					var itext1=text.indexOf("]",i2+1);
					if(itext1==-1){
						break;
					}
					var stext1=text.substring(i2+2,itext1);
					i2=itext1;
					if(text.charAt(i2+1)=='['){
						var itext2=text.indexOf("]",i2+1);
						if(itext2==-1){
							break;
						}
						var stext2=text.substring(i2+2,itext2);
						i2=itext2;
						if(text.charAt(i2+1)=='[' && allowURL3==true){
							var itext3=text.indexOf("]",i2+1);
							if(itext3==-1){
								break;
							}
							var stext3=text.substring(i2+2,itext3);
							i2=itext3;
							nowText+="<A HREF=\""+stext1+"\" "+stext3+">"+stext2+"</A>";
						}else{
							nowText+="<A HREF=\""+stext1+"\">"+stext2+"</A>";
						}
					}else{
						nowText+="<A HREF=\""+stext1+"\">"+stext1+"</A>";
					}
				}
				isYenMode=false;
				break;
			default:
				nowText+='\\'+c;
				isYenMode=false;
			}
		}else{//-----タグ解析ここまで
			if(c=='\\'){
				isYenMode=true;
			}else if(c=='\n' || c=='\r'){
				//しかと
			}else{
				nowText+=c;
			}
		}
	}
	//解析ループ終了
	
	//最後に残ったテキストを吐き出す
	if(isSync==false){
		addArray(nowScope,nowSurface[nowScope],nowText,false,0,nowGhost);
	}else{
		addArray(0,nowSurface[0],nowText,true,nowSurface[1],nowGhost);
	}
}

//**************************************
//	createHTML
//	グローバル変数配列からHTMLを構築する
//**************************************
function createHTML(){
	var html="<TABLE class=\"stable\">";
	for(var i3=0;i3<scopeA.length;i3++){
		var sc=scopeA[i3];
		var su=surfaceA[i3];
		var te=textA[i3];
		var stext=su.toString();
		var sy=syncA[i3];
		var sysu=syncsurfaceA[i3];
		var ghost=ghostA[i3];
		if(su<0){
			stext="none";
		}else{
			if(su<1000){
				stext="0"+stext;
			}
			if(su<100){
				stext="0"+stext;
			}
			if(su<10){
				stext="0"+stext;
			}
		}
		if(sy==true){
			var sstext=sysu.toString();
			if(sysu<0){
				sstext="none";
			}else{
				if(sysu<1000){
					sstext="0"+sstext;
				}
				if(sysu<100){
					sstext="0"+sstext;
				}
				if(sysu<10){
					sstext="0"+sstext;
				}
			}
			html+="<TR><TD class=\"simages\"  align=\"center\">";
			if(reverseSync==true){
				var tmp=sstext;
				sstext=stext;
				stext=tmp;
			}
			html+="<IMG SRC=\""+imagebase+ghost+"/surface"+ stext+".png\" ALT=\""+ stext+"\" align=\"center\">";
			html+="<IMG SRC=\""+imagebase+ghost+"/surface"+sstext+".png\" ALT=\""+sstext+"\" align=\"center\"></TD>";
			html+="<TD class=\"stexts\">";
			html+=te;
			html+="</TD></TR>";
		}else{
			html+="<TR><TD class=\"simage"+sc.toString()+"\"  align=\"center\">";
			html+="<IMG SRC=\""+imagebase+ghost+"/surface"+stext+".png\"  ALT=\""+stext+"\"></TD>";
			html+="<TD class=\"stext"+sc.toString()+"\">";
			html+=te;
			html+="</TD></TR>";
		}
	}
	html+="</TABLE>";
	return html;
}

//**************************************
//	addArray
//	グローバル変数配列を１個追加
//**************************************
function addArray(scope,surface,text,sync,syncsurface,ghost){
	//テキストが空だったら無視→重要！
	if(text==""){
		return;
	}
	scopeA.push(scope);
	surfaceA.push(surface);
	textA.push(text);
	syncA.push(sync);
	syncsurfaceA.push(syncsurface);
	ghostA.push(ghost);
}

//**************************************
//	getElementsByClass
//	ドキュメント内の特定クラスのタグ配列を返す
//**************************************
function getElementsByClass(searchClass) {
    var classElements = new Array();
    var allElements = document.getElementsByTagName("*");
    for (i = 0, j = 0; i < allElements.length; i++) {
	if (allElements[i].className == searchClass) {
	    classElements[j] = allElements[i];
	    j++;
	}
    }
    return classElements;
}

