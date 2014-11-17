var iKagaka = iKagaka || {};

(function(global){
  "use strict"


  // import
  var allow          = global.iKagaka.allow,
      logg           = global.iKagaka.logg,
      mix            = global.iKagaka.mix,
      type           = global.iKagaka.type,
      Descript       = global.iKagaka.Descript,
      Surfaces       = global.iKagaka.Surfaces;


  // export
  global.iKagaka.Shell = Shell;


  // Interface
  mix(Shell.prototype, {
    load:        Shell_load,
    getSurface:  Shell_getSurface
  });


  // Class
  function Shell(){
    if( !(this instanceof Shell) ){
      return new Shell();
    }

    var io        = logg("iKagaka.Shell");

    this.nar      = null;
    this.descript = null;
    this.surfaces = null;
    this.cache    = [];
    this.currentShellName = "master";
    this.namedDiv = namedDiv;

    io.out();
  }


  // Method
  function Shell_load(nar, callback){
    allow(nar, "Nar");
    allow(callback, "Function");

    var io       = logg("iKagaka.Shell#load"),
        that     = this,
        nar      = this.nar = nar,
        dir      = this.nar.shell[this.currentShellName];

    dir["descript.txt"].getFile(function(text){
      var descript = that.descript = new Descript(text);
      io(descript["type"], descript["name"]);
      if(descript["type"] !== "shell"){
        error("type isnt shell");
        return;
      }
      dir["surfaces.txt"].getFile(function(text){
        var surfaces = that.surfaces = new Surfaces(text);
        success();
      });
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
  }


  function Shell_getSurface(n, callback){
    allow(n, "Number");
    allow(callback, "Function");

    var io       = logg("iKagaka.Shell#load"),
        that     = this,
        dir      = this.nar.shell[this.currentShellName],
        def      = this.surfaces[n],
        cnv      = document.createElement("canvas"),
        reg      = /^surface(\d+)\.png$/;
    Object.keys(dir).filter(function(val){
      return reg.test(val) ? Number(reg.exec(val)[1]) === n : false;
    })[0];
    callback(
      def !== void 0 ?
        composeElements(
          isCanvas(base) ?
            overlayfast(cnv, base) :
            cnv,
          def.element) :
        false
    );
  }


  // where
  function isImage(img){
    return Object.prototype.toString.apply(img) === "[object HTMLImageElement]";
  }


  function isCanvas(cnv){
    return Object.prototype.toString.apply(cnv) === "[object HTMLCanvasElement]";
  }


  function transImg(img){
    allow(img, isImage);

    var cnv = copy(img),
        ctx = cnv.getContext("2d"),
        data = ctx.getImageData(0, 0, img.width, img.height).data,
        i = 0, r = data[0], g = data[1], b = data[2];

    if(data[3] !== 0){
      while(i < data.length){
        if(r === data[i] && g === data[i+1] && b === data[i+2]){
          data[i+3] = 0;
        }
        i += 4;
      }
      ctx.putImageData(imgdata, 0, 0);
    }

    return cnv;
  }


  function copy(parent){
    allow(parent, function(x){return isCanvas(x) || isImage(x)});

    var child = document.createElement("canvas"),
        ctx   = child.getContext("2d");

    child.width  = parent.width;
    child.height = parent.height;
    ctx.drawImage(parent, 0, 0);

    return child;
  }


  function overlayfast(target, canvas, x, y){
    allow(target, isCanvas);
    allow(canvas, isCanvas);
    allow(x, "Number/Undefined");
    allow(y, "Number/Undefined");

    var ctx = target.getContext("2d");

    ctx.drawImage(canvas, x||0, y||0);

    return target;
  }


  function composeElements(target, ary){
    allow(target, isCanvas);
    allow(ary,    "Array");

    var cnv, type, x, y, _cnv;

    if(ary.length === 0){
      return target;
    }else{
      cnv  = ary[0].cnv;
      type = ary[0].type;
      x    = ary[0].x;
      y    = ary[0].y;
      _cnv = type === "base"        ? copy(ary[0].cnv) :
             type === "overlay"     ? overlayfast(target, cnv, x, y) :
             type === "overlayfast" ? overlayfast(target, cnv, x, y) :
                                      target;
      return composeElements(_cnv, ary.slice(1));
    }
  }


  function draw(target, canvas){
    var ctx;
    target.parentNode.width  = target.width  = canvas.width;
    target.parentNode.height = target.height = canvas.height;
    ctx = target.getContext("2d");
    ctx.drawImage(canvas, 0, 0);
    return target;
  }


}(this));