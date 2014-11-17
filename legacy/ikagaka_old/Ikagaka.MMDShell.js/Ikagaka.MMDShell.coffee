class this.Ikagaka.MMDShell
	constructor: ()->
		@model = new MMD.Model 'model','Normal.pmd'
		@motion = 
			kishimen: new MMD.Motion 'motion/kishimen3.vmd'
			arm: new MMD.Motion 'motion/arm.vmd'
			smile: new MMD.Motion 'motion/smile.vmd'
			geddan: new MMD.Motion 'motion/geddan.vmd'
			blink: new MMD.Motion 'motion/blink10.vmd'
			stand: new MMD.Motion 'motion/stand.vmd'
			akubi: new MMD.Motion 'motion/akubi.vmd'
		
		@canvas = document.createElement 'canvas'
		@canvas.width = 512
		@canvas.height = 1024
		@canvas.style.border = 'solid black 1px'
		
		document.body.appendChild @canvas
		
		@mmd = new MMD @canvas,@canvas.width,@canvas.height
		@mmd.initShaders()
		@mmd.initParameters()
		@mmd.registerKeyListener document
		@mmd.registerMouseListener document

	load: (callback)->
		i = 1
		next = =>
			if --i is 0
				@mmd.addModel @model
				@mmd.initBuffers()
				@mmd.start()
				@start()
				callback()
		@model.load next
		for _,v of @motion
			v.load next
			i++

	start: ->
			@model

		command: do ->
		reg =
			ys: /^\\s\[([^\]]+)\]/
			yi: /^\\i\[([^\]]+)\]/
		(com, callback)->
			if reg.ys.test com
				id = reg.ys.exec(com)[1]
				switch id
					when "ashi_mijirogi" then
					when "te_tewohuru" then
					when "te_peace" then
			else if reg.yi.test com
				id = reg.yi.exec(com)[1]
				switch id
					when "kao_smile" then @mmd.addModelMotion @model,@motion["akubi"],true,0
					when "kao_wink" then
					when "kao_migi" then
					when "kao_hidari" then
			@playMMD(callback)

	playMMD: (callback)->
		@mmd.play()
		i = 0
		do =>
			if not @mmd.playing
				@mmd.motionManager = new MMD.MotionManager
				console.log "played."
				callback?()
			else setTimeout arguments.callee, 10