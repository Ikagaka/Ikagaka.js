var iKagaka = iKagaka || {};

(function(global){
  "use strict"

  var allow          = global.iKagaka.allow,
      logg           = global.iKagaka.logg,
      mix            = global.iKagaka.mix,
      type           = global.iKagaka.type,
      Descript       = global.iKagaka.Descript;

  global.iKagaka.Named = Named;

  mix(Named.prototype, {
    load:        Named_load,
    materialize: Named_materialize,
    raiseEvent:  null,
    playScript:  null,
    stopScript:  null,
    command:     null
  });


  // Class
  function Named(){
    if( !(this instanceof Named) ){
      return new Named();
    }

    var io = logg("iKagaka.Named");

    this.nar     = null;
    this.install = null;

    io.out();
  }


  // Method
  function Named_load(nar, callback){
    allow(nar, "Nar");
    allow(callback, "Function");

    var io   = logg("iKagaka.Named#load"),
        that = this,
        nar  = this.nar = nar;

    nar["install.txt"].getFile(function(text){
      var install = that.install = Descript(text);

      io(install["type"], install["directory"], install["name"]);

      if(install["type"] !== "ghost"){
        error("type isnt ghost");
        return;
      }

      success();
    });

    function success(){
      io.out();
      callback(that);
    }

    function error(ev){
      io("error:", ev);
      io.out();
      callback(that);
    }
  };


  function Named_materialize(){

    var io = logg("iKagaka.Named#materialize");

    io.out();
  };


}(this));