class window.Surfaces

  constructor: do ->

    range = do ->
      regHead = ///
        (\!)?         #notFlag
        (\d+)         #start
        (?:\-(\d+))?  #end
        \,?
      ///g
      (head)->
        rjcts = []
        aplys = []
        util.regexec regHead, head, ([__, rjct, a, b])->
          a = Number a
          b = Number b
          nums = if isFinite b then [a..b] else [a]
          if rjct? then rjcts = rjcts.concat nums
          else          aplys = aplys.concat nums
        _.difference (_.unique aplys), (_.unique rjcts)

    regDef = ///
      ([^\{\}]+) #head
      \{
      ([^\{\}]+) #body
      \}
    ///g

    regOldIntvl = ///
      (\d+)         #animationGroup
      interval\s?\,
      \s?(.+)       #interval
    ///g

    regOldPtn = ///
      (\d+)                  #animationGroup
      pattern(\d+)\s?\,      #pattrnId
      \s?([\-|\+]?\d+)\s?\,  #surfaceId
      \s?(\d+)\s?\,          #interval
      \s?([\w\d]+)(?:\s?\,   #method
      \s?([\-|\+]?\d+)\s?\,  #offsetX
      \s?([\-|\+]?\d+))?     #offsetY
    ///g

    regComment = /\/\/.*/g

    regApnd = /surface\.append/

    (text)->
      @_defAry = []
      @_apdAry = []
      util.regexec regComment, text, ([match])-> #commentout
        text = text.replace(match, "")
      util.regexec regOldIntvl, text, ([match,
                                   animId,
                                   timing])-> #seriko 1.0 -> 2.0
        text = text.replace match,
          "animation#{animId}" +
          ".interval," +
          "#{timing}"
      util.regexec regOldPtn, text,([match,
                                anmId,
                                ptnId,
                                srfId,
                                wait,
                                layer,
                                x,
                                y])-> #seriko 1.0 -> 2.0
        text = text.replace match,
          "animation#{anmId}" +
          ".pattern#{ptnId}," +
          "#{layer}," +
          "#{srfId}," +
          "#{wait}," +
          "#{x or 0}," +
          "#{y or 0}"
      util.regexec regDef, text, ([__, head, body])=>
        unless /surface/.test head then return
        isApnd = regApnd.test head
        srf = new Surface body
        head = head.replace(/surface/g, "")
        nums = range head
        if isApnd then @append n, srf for n in nums
        else           @define n, srf for n in nums
      @resolve()

  define: (n, srf)-> @_defAry[n] = srf

  append: (n, srf)->
    @_apdAry[n] = @_apdAry[n] or new Surface
    _.extend @_apdAry[n].collisions, srf.collisions
    _.extend @_apdAry[n].elements,   srf.elements
    _.extend @_apdAry[n].animations, srf.animations
    @

  resolve: ->
    _.extend @, @_defAry
    for n, srf of @_apdAry
      @[n] = @[n] or new Surface
      _.extend @[n].collisions, srf.collisions
      _.extend @[n].elements,   srf.elements
      _.extend @[n].animations, srf.animations
    delete @_defAry
    delete @_apdAry

  class Collision
    constructor: (@x, @y, @width, @height, @id)->

  class Collisions
    reg = ///
      collision(\d+)\s?\,   #collisionId
      \s?([\-|\+]?\d+)\s?\, #startX
      \s?([\-|\+]?\d+)\s?\, #startY
      \s?([\-|\+]?\d+)\s?\, #endX
      \s?([\-|\+]?\d+)\s?\, #endY
      \s?([\w\d]+)          #id
    ///g
    constructor: (body)->
      return @ unless body?
      util.regexec reg, body, ([__, n, sx, sy, ex, ey, id])=>
        @[(Number n)] = new Collision (Number sx),
                                      (Number sy),
                                      (Number ex) - (Number sx),
                                      (Number ey) - (Number sy),
                                      id

  class Element
    constructor: (@layer, @src, @x, @y)->

  class Elements
    reg = ///
      element(\d+)\s?\,      #elementId
      \s?([\w\d\.]+)\s?\,    #pattern
      \s?([\w\d\.]+)(?:\s?\, #filename
      \s?([\-|\+]?\d+)\s?\,  #x
      \s?([\-|\+]?\d+))?     #y
    ///g
    constructor: (body)->
      return @ unless body?
      util.regexec reg, body, ([__, n, layer, src, x, y])=>
        @[(Number n)] = new Element layer,
                                    src,
                                    (Number x or 0),
                                    (Number y or 0)

  class Pattern
    constructor: (@composeType, @surfaceNumber, @wait, @maxWait, @x, @y)->
      unless isFinite @maxWait then delete @maxWait

  class Patterns
    ptnReg = ///
      pattern(\d+)\s?\,             #patternId
      \s?([\w\d]+)\s?\,             #layer
      \s?([\-|\+]?\d+)\s?\,         #surfaceId
      \s?(\d+)(?:\-(\d+))?(?:\s?\,  #minWait-maxWait
      \s?([\-|\+]?\d+)\s?\,         #x
      \s?([\-|\+]?\d+))?            #y
    ///g
    constructor: (body)->
      util.regexec ptnReg, body, ([__, n, layer, num, minWait, maxWait, x, y])=>
        @[(Number n)] = new Pattern layer,
                                    (Number num),
                                    (Number minWait),
                                    (Number maxWait),
                                    (Number x or 0),
                                    (Number y or 0)

  class Animation
    intReg = ///
      interval\s?\,
      \s?(.+)
    ///
    constructor: (body)->
      if intReg.test body
        @interval = (intReg.exec body)[1]
        @patterns = new Patterns body

  class Animations
    reg = ///
      animation(\d+)\.
      ([^\r\n]+)
    ///g
    constructor: (body)->
      return @ unless body?
      anmN = {}
      util.regexec reg, body, ([__, n, str])->
        n = Number n
        anmN[n] = (anmN[n] or "") + "\r\n" + str
      for n, body of anmN
        @[n] = new Animation body

  class Surface
    constructor: (body)->
      @collisions = new Collisions body
      @elements   = new Elements   body
      @animations = new Animations body