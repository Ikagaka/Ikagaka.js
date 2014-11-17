class this.Shell

  srfFileReg = /surface(\d+)\.png/i

  constructor: (nar, name, callback)->
    @nar = nar
    @name = name
    @descript = null
    @surfaces = null
    @filelist = {}
    @surfaceN = {}
    @surfaceDefineCache = {}
    if !nar.shell[name]? or
       !nar.shell["descript.txt"]? or
       !nar.shell["surfaces.txt"]?
      setTimeout -> callback false
    else
      curShellDir = nar.shell[name]
      for filename, val of curShellDir
        @filelist[filename] = val
        if srfFileReg.test(filename)
          n = Number srfFileReg.exec(filename)[1]
          @surfaceN[n] = val
      curShellDir["descript.txt"] (text)=>
        @descript = new Descript(text)
        curShellDir["surfaces.txt"] (text)=>
          @surfaces = new Surfaces(text)
          callback(@)
    null

  createSurfaceDefine: (id, callback)->
    cache = @surfaceDefineCache
    srfn  = @surfaceN
    srfs  = @surfaces
    n = id                          # alias process
    if cache[n]?                    # use cache
      setTimeout => callback cache[n]
    else if !srfs[n]? and !srfN[n]? # undefined and non-exist
      setTimeout -> callback false
    else
      srfN[n] (img)-> 
        if !img
          pngCnv = util.whiteCanvas()
          srfdef = new SurfaceDefine pngCnv, srfs[n]
          callback srfdef
        else
          pngCnv = util.transImg(img)
          recursiveCall = (i)=>
            elm = srfdef.elements[i++]
            if !elm?
              @surfaceCache[n] = srfdef
              callback(srfdef)
            else
              {layer, src, x, y} = elm
              @filelist[src] (img)=>
              if elmingCnv.width  *
                 elmingCnv.height is 0
                layer = "base"
              elmingCnv = switch layer
                when "base" then util.transImg(img)
                else             util.overlayfast elmingCnv, util.transImg(img), x, y
            recursiveCall(i)
        recursiveCall(0)
    null