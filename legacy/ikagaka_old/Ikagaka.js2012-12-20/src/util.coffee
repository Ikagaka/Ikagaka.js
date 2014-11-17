window.util = do ->

  init = ->
    regexec:     regexec
    whiteCanvas: whiteCanvas
    copy:        copy
    transImg:    transImg
    base:        copy
    overlay:     overlayfast
    overlayfast: overlayfast
    replace:     overlayfast
    deepcopy:    deepcopy

  deepcopy = (original)->
    copy = {}
    for key, val of original
      switch mm.type(val)
        when "boolean" then copy[key] = val
        when "number"  then copy[key] = val
        when "string"  then copy[key] = val
        else                copy[key] = deepcopy val
    copy


  regexec = (reg, str, fn)->
    ary = []
    while true
      matches = reg.exec str
      if not matches? then break
      ary.push fn matches
    ary

  whiteCanvas = ->
    cnv = document.createElement("canvas")
    cnv.width  = 0
    cnv.height = 0
    cnv

  transImg = (img)->
    cnv = copy img
    ctx = cnv.getContext("2d")
    imgdata = ctx.getImageData(0, 0, img.width, img.height)
    data = imgdata.data
    i = 0
    r = data[0]
    g = data[1]
    b = data[2]
    if data[3] isnt 0
      while i < data.length
        if r is data[i] and g is data[i+1] and b is data[i+2]
          data[i+3] = 0
        i += 4
      ctx.putImageData(imgdata, 0, 0)
    cnv

  copy = (parent)->
    child = document.createElement("canvas")
    ctx   = child.getContext("2d")
    child.width  = parent.width
    child.height = parent.height
    ctx.drawImage(parent, 0, 0)
    child

  overlayfast = (target, canvas, x, y)->
    ctx = target.getContext("2d")
    ctx.drawImage(canvas, x, y)
    target

  init()