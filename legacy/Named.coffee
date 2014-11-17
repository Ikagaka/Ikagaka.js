

class Named
  # new Named(shell:Shell)
  constructor: (@shell)->
    @$named = $("<div />")
      .addClass("named")
    @$style = $("<style scoped />")
      .html("")
    @$named.append(@$style)
    @element = @$named[0]
    @scopes = []
    @currentScope = null
    @listener = ->
  # Named#scope(scopeId:Number|undefined):Scope
  scope: (scopeId)->
    if scopeId isnt undefined
      if !@scopes[scopeId]
        @scopes[scopeId] = new Scope(scopeId, @shell)
        @scopes[scopeId].setEventListener (ev)=> @listener(ev)
      @currentScope = @scopes[scopeId]
      @$named.append(@scopes[scopeId].element)
    @currentScope
  # Named#setEventListener(listener:Function(ev:ShioriEventObject):void):void
  setEventListener: (@listener)-> undefined
