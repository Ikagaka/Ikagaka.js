class this.Ikagaka.Named
	constructor: (homeurl)->
		@homeurl = homeurl
		@shell = null
		@ghost = null

	load: (callback)->
		setTimeout callback

	materialize: ->
		console.log "materialized."

	raiseEvent: (event)->

	playScript: (script)->

	stopScript: ->

	command: (command)->