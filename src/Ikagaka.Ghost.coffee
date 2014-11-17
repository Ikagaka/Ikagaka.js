class Ikagaka.Ghost
	constructor: (url)->
		@url = url

	load: (callback)->
		setTimeout -> callback()
