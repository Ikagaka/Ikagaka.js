/*!
 *     「DREAM with GHOST ～夢の翼へ～ 」
 *
 *      AREKA Web Ghost Flamework v0.1.0
 *       http://code.google.com/p/ranka/
 *
 *       Copyright (c) 2009 Dot Station
 * Dual licensed under the MIT and GPL licenses.
 */
 (function(){
//===================================================
// querySelecterAllを$にリダイレクト
//===================================================
Element.prototype.$ = Element.prototype.querySelectorAll;


//=============================================================
// Areka オブジェクト
//=============================================================
Areka = {};

//===================================================
// 時間待機しつつ繰り返し実行
// funcの戻り値が０以上の数値である間繰り返す
// ０以上の場合、x ms待って再度実行
// 最初の１回は必ずTimeoutを入れる
//===================================================
Areka.waitEach = function(startTime, func){
  var nextTime = startTime
  var timeID;
  var loop = function(){
    try{
      if(! isNaN(timeID)) clearTimeout(timeID);
      while(nextTime <= Date.now()){
        var rc = func();
        if( !isFinite(rc) ) return;
        if( rc < 0 ) return;
        nextTime += rc;
      }
      var interval = nextTime - Date.now();
      timeID = setTimeout(loop, interval);
    }
    catch(e){}
  }
  // 描画イベントを発生させるため、最初の１回は必ず
  // Timeoutを発生させる
  timeID = setTimeout(loop, 1);
}


//=============================================================
})();
