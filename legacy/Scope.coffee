

class Scope
  # new Scope(scopeId:Number, shell:Shell):Scope
  constructor: (@scopeId, @shell)->
    @$scope = $("<div />")
      .addClass("scope")
      .css({"bottom": "0px", "right": (@scopeId*240)+"px"})
    @$style = $("<style scoped />")
      .html("""
        .scope {
          position: absolute;
          border: none;
          margin: 0px;
          padding: 0px;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
      """)
    @$surface = $("<div />")
      .addClass("surface")
      .hide()
    @$balloon = $("<div />")
      .addClass("balloon")
      .hide()
    @$scope
      .append(@$surface)
      .append(@$balloon)
      .append(@$style)
    @element = @$scope[0]
    @listener = ->
    @currentSurface = null
    @currentBalloon = new Balloon(shell)
  # Scope#surface(surfaceId:Number|Undefined):Surface|null
  surface: (surfaceId)->
    if surfaceId is -1
    then @$surface.hide()
    else @$surface.show()
    if surfaceId isnt undefined
      @currentSurface.destructor() if !!@currentSurface
      $(@currentSurface.element).remove() if !!@currentSurface
      @currentSurface = @shell.getSurface(@scopeId, surfaceId)
      @currentSurface.setEventListener (ev)=> @listener(ev)
      @$surface.append(@currentSurface.element) if !!@currentSurface
    @currentSurface
  # Scope#baloon(balloonId:Number|Undefined):Balloon|null
  balloon: (balloonId)->
    if balloonId is -1
    then @$balloon.hide()
    else @$balloon.show()
    @$balloon.append(@currentBalloon.element) if !!@currentBalloon
    @currentBalloon
  # Scope#setEventListener(listener:Function(ev:ShioriEventObject):void):void
  setEventListener: (@listener)-> undefined
