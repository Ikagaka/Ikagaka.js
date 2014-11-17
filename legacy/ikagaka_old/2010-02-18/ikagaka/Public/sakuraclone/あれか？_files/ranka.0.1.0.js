//===================================================
// Ranka 歌って踊れるどこいつスクリプター
//===================================================
(function() {

// StringクラスにTrimメソッドの追加
String.prototype.trim = function() {
    return this.replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, '');
}
String.prototype.ltrim = function() {
    return this.replace(/^[\t\r\n ]+/g, '');
}
String.prototype.rtrim = function() {
    return this.replace(/[\t\r\n ]+$/g, '');
}

String.prototype.containsClass = function(name){
  var re = new RegExp( "(^| )" + name +"( |$)")
  return this.match(re)
}

Ranka = {}

//===================================================
// 辞書キャッシュ
//===================================================
var dicCache = {}
var getDicItems = function(query){
  var rc = dicCache[query]
  if( rc===undefined ){
    rc = {
      items: Ranka.DicSpace.querySelectorAll(query),
    }
    console.log("querySelector::("+query+"): length=" +rc.items.length)
    dicCache[query] = rc
  }
  return rc
}

var randomDic = function(query){
  var dic = getDicItems(query)
  if( !dic ) return null
  if( dic.randomDic ) return items.randomDic()
  var pos = Math.floor( Math.random() * dic.items.length );
  return dic.items[pos]
}

Ranka.getDicItems = getDicItems
Ranka.randomDic   = randomDic


//===================================================
// 会話辞書ウォーカー
// ウォークルール：
//   A:
//     前回nullを返しているならば、el候補をセットする
//   B:
//     1.前回のエレメントの次を候補とする => el
//     2.elが<p>タグならそれを返す
//     3.elが<hr>タグなら条件に合うdivを探して再確認
//     4.次候補が無ければ終了とし、nullを返す
//===================================================
var t = {
  QueryBase : "div.会話.",
  Query     : "＠",
  LastEntry : null,
}

//---------------------------------------------------
// 現在の条件でクエリ
var randomDic = function(){
  return Ranka.randomDic(t.QueryBase + t.Query)
}

//---------------------------------------------------
// 今の条件で次の候補をセットする
var queryNext = function(query){
  var impl = function(){
    // ランダム選択
    var randomSelect = function(q){
      var next = Ranka.randomDic(q)
      return next.firstElementChild
    }
    // 次候補があるなら選択
    var walkSelect = function(){
      var p = t.LastEntry
      if(!p) return null
      var now = p.parentElement
      if(!now) return null
      var next = p.nextElementSibling
      if(!next) return null
      // もし、次の要素に'＠ ＃'が含まれていたら、
      // ウォーク失敗とする
      if(next.className.containsClass('＠')) return null
      if(next.className.containsClass('＃')) return null
      return next.firstElementChild
    }
    if(query !== undefined) return randomSelect(t.QueryBase + query)
    var rc = walkSelect()
    if(rc) return rc
    return randomSelect(t.QueryBase + t.Query)
  }
  t.LastEntry = impl()
}

var resetNext = function(){
  t.LastEntry = null
}

//---------------------------------------------------
// ウォーク！
var enTalk = function(){
  var impl = function(){
    while(true){
      var now = t.LastEntry
      if(!now) return null
      if(now.nodeName=='P'){
        t.LastEntry = now.nextElementSibling
        return now
      }
      // ジャンプ
      if(now.nodeName!='HR') return null
      var jump = now.attributes['jump']
      if( jump === undefined ){
        t.LastEntry = null
        return null
      }
      queryNext(jump.value)
    }
  }
  var rc = impl()
  if(!rc) queryNext()
  return rc
}

//===================================================
Ranka.Talk=t
Ranka.Talk.EnTalk    = enTalk
Ranka.Talk.QueryNext = queryNext
Ranka.Talk.ResetNext = resetNext




//===================================================
// 辞書エレメントの単語分解
//===================================================
var w = {
  QueryBase : "div.単語 p.",
}
var randomWord = function(query){
  return Ranka.randomDic(w.QueryBase + query)
}




var remainWord = {}

var resetWord = function(){
  remainWord = {
    "人名１"    : { key: "人名" },
    "人名２"    : { key: "人名" },
    "地名１"    : { key: "地名" },
    "地名２"    : { key: "地名" },
    "一般名詞１": { key: "一般名詞" },
  }
}

var getWord = function(q){
  var key = q.textContent.trim()
  console.log("getWord(" + key +")")
  var remain = remainWord[key]
  if(remain){
    if(remain.value) return remain.value
    var orgkey = key
    key = remain.key
    console.log("getWord("+ orgkey +" >> "+ key +")")
  }
  var el    = randomWord(key)
  console.log("getWord("+ key +") >> [" + el.outerHTML + "]")
  console.log(el)
  var value = getTalkContents(el)
  if(remain) remain.value = value
  return value
}

var getTalkContents = function(list){
  var buf = ""
  if(!list){
    console.log("getTalkContents: list=null")
    return ""
  }
  var el = list.firstChild
  if(!el) return list.textContent.trim()


  var loop = function(){
    if(!el)return null
    var now = el
    el = el.nextSibling
    if(now.nodeName=="#text"){
      return now.textContent.rtrim()
    }
    if(now.nodeName=="Q"){
      return getWord(now)
    }
    return null
  }

  while(true){
    var text=loop()
    if(!text) return buf
    buf += text
  }
}


//===================================================
Ranka.Word=w
Ranka.Word.getTalkContents = getTalkContents
Ranka.Word.resetWord       = resetWord


})()
