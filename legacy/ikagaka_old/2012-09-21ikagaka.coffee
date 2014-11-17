############################

class Ikagaka
  constructor: ()->
  load: (callback)->
  unload: ->

############################

class Ikagaka.Named
  constructor: ()->
  load: (callback)->
  unload: ->
  raiseEvent: (e)->
  on: (id,handler)->
  playScript: (script,callback)->
  stopScript: ->
  command: (tag,callback)->
      if Y0.test tag then
      if Y1.test tag then
      if Yp.test tag then
      else                console.error tag + " is illegal tag."

############################

class Ikagaka.Scope
  constructor: ()->
  load: (callback)->
  unload: ->
  command: (tag,callback)->

############################

class Ikagaka.Shell
  constructor: ()->
  load: (callback)->
  unload: ->
  tags: []
  command: (tag,callback)->

############################

class Ikagaka.Balloon
  constructor: ()->
  load: (callback)->
  unload: ->
  command: (tag,callback)->

############################

class Ikagaka.Ghost
  constructor: ()->
  load: (callback)->
  unload: ->
  command: (tag,callback)->
  getResponce: (request,callback)->

############################