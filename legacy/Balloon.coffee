

class Balloon
  # new Balloon(shell:Shell):Balloon
  constructor: (@shell)->
    @$balloon = $("<div />")
      .addClass("box")
    @$style = $("<style scoped />")
      .html("""
        .box {
          position: absolute;
          top: -150px;
          left: 0px;
          height: 150px;
          width: 280px;
          background: #ccc;
          overflow-y: scroll;
          white-space: pre;
          white-space: pre-wrap;
          white-space: pre-line;
          word-wrap: break-word;
        }
        .text {
          padding: 1em;
        }
        .anchor,
        .select {
          color:red;
          cursor:pointer;
        }
        .anchor:hover,
        .select:hover {
          background-color:violet;
        }
      """)
    @$text = $("<div />")
      .addClass("text")
    @$balloon
      .append(@$style)
      .append(@$text)
    @element = @$balloon[0]
  talk: (text)->
    @$text.html(@$text.html() + text)
    undefined
  clear: ->
    @$text.html("")
    undefined
  br: ->
    @talk("<br />")
    undefined
