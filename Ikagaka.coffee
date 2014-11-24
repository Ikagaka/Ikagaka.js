
class Ikagaka
  constructor: ->
    hoge = 0

if module?.exports?
  module.exports = Ikagaka


window["Ikagaka"] = Ikagaka

require("ikagaka.nar.js")
require("ikagaka.shell.js")
require("ikagaka.balloon.js")
require("ikagaka.named.js")
require("ikagaka.sakurascriptplayer.js")
require("ikagaka.ghost.js")
