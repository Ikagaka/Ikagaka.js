class this.Ikagaka
	constructor: ->
		@nameds = {}

	addNamed: (id, named)->
		@nameds[id] = named

	named: (id)->
		@nameds[id]