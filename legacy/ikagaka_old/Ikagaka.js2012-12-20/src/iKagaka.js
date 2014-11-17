var iKagaka = iKagaka || {};

(function(global){
  "use strict"

console.log mm.mix
  // import
  var allow      = global.mm.allow,
      logg       = global.mm.logg,
      mix        = global.mm.mix,
      type       = global.mm.type,
      urlResolve = global.mm.url.resolve,
      zip        = global.zip,
      mimeTypeOf = global.zip.getMimeType,
      Encoding   = global.Encoding;


  zip.workerScriptsPath = "lib/";
  zip.useWebWorkers = true;


  // Interface
  mix(iKagaka, {
    allow:          allow,
    logg:           logg,
    mix:            mix,
    type:           type,
    urlResolve:     urlResolve,
    zip:            zip,
    mimeTypeOf:     mimeTypeOf,
    Encoding:       Encoding,
    trim:           iKagaka_trim,
    crlf:           iKagaka_crlf,
    commentout:     iKagaka_commentout,
    clearNullLines: iKagaka_clearNullLines
  });


  // Method


  function iKagaka_trim(str){
    allow(str, "String");

    return str.replace(/^\s+/, "")
              .replace(/\s+$/, "");
  }


  function iKagaka_crlf(text){
    allow(text, "String");

    return text.replace(/(?:\r\n|\r|\n)/g, "\n");
  }


  function iKagaka_commentout(text){
    allow(text, "String");

    return text.replace(/\/\/[^\n]*\n/gm, "\n");
  }


  function iKagaka_clearNullLines(lines){
    allow(lines, "Array");

    return lines.filter(function(val){
      return val.length !== 0;
    });
  }


}(this));