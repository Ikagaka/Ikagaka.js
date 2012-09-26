class this.Ikagaka.MMDShell
	constructor: ()->
		@model = new MMD.Model 'model','Normal.pmd'
		@motion = 
			kishimen: new MMD.Motion 'motion/kishimen3.vmd'
			arm: new MMD.Motion 'motion/arm.vmd'
			smile: new MMD.Motion 'motion/smile.vmd'
			geddan: new MMD.Motion 'motion/geddan.vmd'
			#blink: new MMD.Motion 'motion/blink9.vmd'
		
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
				callback()
		@model.load next
		for _,v of @motion
			v.load next
			i++

	command: do ->
		reg =
			yi: /^\\i\[([^\]]+)\]/
		(com, callback)->
			if reg.yi.test com
				id = reg.yi.exec(com)[1]
				switch id
					when "kishimen"
						@mmd.addModelMotion @model,@motion["geddan"],true,0
						#@playMMD(callback)

	playMMD: (callback)->
		@mmd.play()
		i = 0
		do =>
			if not @mmd.playing
				@mmd.motionManager = new MMD.MotionManager
				console.log "played."
				callback?()
			else setTimeout arguments.callee, 10