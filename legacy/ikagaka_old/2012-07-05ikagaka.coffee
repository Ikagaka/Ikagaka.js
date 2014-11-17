json =
	"shell":
		"master":
			"surface":
				"0":
					"element":[
						["base","./ku-/shell/master/surface0.png"]]
					"collision":[
						[71,40,168,98,"head"]
						[97,112,164,158,"face"]
						[122,216,150,259,"bust"]]
					"animation":[
						{"timing":"sometimes"
						"pattern":[
							["overlayfast",100,5]
							["overlayfast",101,5]
							["overlayfast",100,15]
							["overlay",0,0]]}
						{"timing":"always"
						"pattern":[
							["overlay",203,0,82,6]
							["overlay",203,15,82,7]
							["overlay",203,15,82,8]
							["overlay",203,30,82,9]
							["overlay",203,15,82,8]
							["overlay",203,15,82,7]
							["overlay",203,15,82,6]
							["overlay",203,15,82,5]
							["overlay",203,30,82,4]
							["overlay",203,15,82,5]
							["overlay",203,15,82,6]]}]
				"10":
					"element":[
						["base","./ku-/shell/master/surface10.png"]]
					"collision":[
						[67,28,164,71,"head"]
						[85,89,141,126,"face"]
						[88,176,126,198,"bust"]]
					"animation":[
						{"timing":"sometimes"
						"pattern":[
							["overlayfast",10,5]
							["overlayfast",11,5]
							["overlayfast",10,15]
							["overlay",-1,10]]}
						{"timing":"always"
						"pattern":[
							["overlay",19,15,0,0]
							["overlay",19,15,0,-1]
							["overlay",19,15,0,-2]
							["overlay",19,30,0,-1]
							["overlay",19,15,0,0]
							["overlay",19,15,0,1]
							["overlay",19,30,0,2]
							["overlay",19,15,0,3]
							["overlay",19,15,0,2]
							["overlay",19,15,0,1]
							["overlay",19,30,0,0]]}]
				"11":
					"element":[
						["base","./ku-/shell/master/surface11.png"]]
				"19":
					"element":[
						["base","./ku-/shell/master/surface19.png"]]
				"100":
					"element":[
						["base","./ku-/shell/master/surface100.png"]]
				"101":
					"element":[
						["base","./ku-/shell/master/surface101.png"]]
				"203":
					"element":[
						["base","./ku-/shell/master/surface203.png"]]
hash2Array = (hash)->
	ary=[]
	(-> ary[k]=v) k,v for k,v of hash
	ary
json.shell.master.surface = hash2Array json.shell.master.surface


ikagaka = do->
	# -----------------------
	#  global private methods
	# -----------------------
	
	# -----------------------
	#  utilitys
	# -----------------------
	
	isFunction =    (fn)-> Object.prototype.toString.apply(fn)  is "[object Function]"
	isArray =      (ary)-> Object.prototype.toString.apply(ary) is "[object Array]"
	isObject =     (obj)-> Object.prototype.toString.apply(obj) is "[object Object]"
	isImage =      (img)-> Object.prototype.toString.apply(img) is "[object HTMLImageElement]"
	isCanvas =     (cnv)-> Object.prototype.toString.apply(cnv) is "[object HTMLCanvasElement]"
	typeIs =   (unknown)-> Object.prototype.toString.apply(unknown)
	isUndefined = (undf)-> typeof undf is "undefined"
	isNumber =     (num)-> isFinite Number num
	
	# -----------------------
	#  image and canvas
	# -----------------------
	
	loadImg = (url,callback=(img)->)-> # void
		if(url is "")
			setTimeout -> callback new Image
		else
			img = new Image
			img.src = url
			img.onload  = -> callback img
			img.onerror = -> callback new Image
		return
	
	copy = (cnv)-> # canvas
		child = document.createElement "canvas"
		child.width  = cnv.width
		child.height = cnv.height
		ctx = child.getContext "2d"
		try ctx.drawImage cnv,0,0
		return child
	
	transImg = (img,callback=(cnv)->)-> # void
		cnv = copy img
		ctx = cnv.getContext "2d"
		try
			imgdata = ctx.getImageData 0,0,img.width,img.height
			if imgdata.data[3] is 0 # alpha channel png or already transparented cache
				ctx.putImageData imgdata,0,0
				setTimeout -> callback cnv
			else
				i = 0
				[r,g,b] = [imgdata.data[0],imgdata.data[1],imgdata.data[2]]
				while i < imgdata.data.length
					if r is imgdata.data[i] and g is imgdata.data[i+1] and b is imgdata.data[i+2]
						imgdata.data[i+3] = 0 # alpha channel taransparent
					i += 4
				ctx.putImageData imgdata,0,0
				setTimeout -> callback cnv
		catch e
			setTimeout -> callback cnv
		return
	
	loadImgsToCnvs = do ->
		canvasCache = {}
		return (urlAry,callback=(cnvAry)->)-> # void
			i = urlAry.length
			urlAry.forEach (url)->
				if canvasCache[url]?
					setTimeout -> next url
				else
					loadImg url,(img)->
						transImg img,(cnv)->
							canvasCache[url] = cnv
							setTimeout -> next url
			next = (url)->
				if --i is 0
					callback urlAry.map (url)-> copy canvasCache[url]
			return
	
	# -----------------------
	#  canvas manufacturers
	# -----------------------
	
	overlay = (target,cnv,x=0,y=0)-> # canvas
		return overlayfast target,cnv,x,y
	
	overlayfast = (target,cnv,x=0,y=0)-> # canvas
		ctx = target.getContext "2d"
		try ctx.drawImage cnv,x,y
		return target
	
	# -----------------------
	#  surface composer
	# -----------------------
	
	canvanizeElements = (elmAry,callback=(cnvedElmAry)->)-> # void
		urlAry = elmAry.map ([type,url,x,y])-> url
		loadImgsToCnvs urlAry,(cnvAry)->
			callback elmAry.map ([type,url,x,y],i)-> [type,cnvAry[i],x,y]
		return
	
	composeCanvanizeElements = (cnvedElmAry)-> # canvas
		target = null
		cnvedElmAry.forEach ([type,cnv,x,y])->
			target ?= copy cnv
			target = switch type
				when "base"        then copy cnv
				when "overlay"     then overlay     target,cnv,x,y
				when "overlayfast" then overlayfast target,cnv,x,y
		return target
	
	composeElements = (elmAry,callback=(cnv)->)-> # void
		canvanizeElements elmAry,(cnvedElmAry)->
			callback composeCanvanizeElements cnvedElmAry
	
	drawSurface = (target,cnv)-> # canvas
		target.width  = cnv.width
		target.height = cnv.height
		target.parentNode.style.width  = cnv.width
		target.parentNode.style.height = cnv.height
		ctx = target.getContext "2d"
		try ctx.drawImage cnv,0,0
		return target
	
	# -----------------------
	#  animation timing function
	# -----------------------
	
	sometimes = (tidAry,callback)-> # void
		random tidAry,callback,2
		return
	
	rarely = (tidAry,callback)-> # void
		random tidAry,callback,4
		return
	
	random = (tidAry,callback,n)-> # void
		ms = 1
		ms++ while Math.round(Math.random() * 1000) > 1000/n
		tidAry.push setTimeout (->
			callback -> random tidAry,callback,n
		),ms*1000
		return
	
	runonce = (tidAry,callback)-> # void
		tidAry.push setTimeout callback
		return
	
	always = (tidAry,callback)-> # void
		tidAry.push setTimeout ->
			callback -> always tidAry,callback
		return
	
	# -----------------------
	#  element struct manufacturers
	# -----------------------
	
	setScopeDiv = (target,n)-> # div
		scopeDiv = document.createElement "div"
		scopeDiv.setAttribute "class","scope"+n
		scopeDiv.style.bottom = "0px"
		scopeDiv.style.right  = n*240+"px"
		surfaceCanvas = document.createElement "canvas"
		surfaceCanvas.setAttribute "class","surface"
		surfaceCanvas.width  = 0
		surfaceCanvas.height = 0
		blimpDiv = document.createElement "div"
		blimpDiv.setAttribute "class","blimp"
		blimpDiv.style.top = "60px"
		blimpDiv.style.left = "-300px"
		blimpCanvas = document.createElement "canvas"
		blimpCanvas.width  = 0
		blimpCanvas.height = 0
		blimpTxt = document.createElement "div"
		blimpTxt.style.margin      = "10px"
		blimpTxt.style.marginRight = "30px"
		blimpTxt.style.overflowY   = "scroll"
		blimpTxt.style.whiteSpace  = "pre"
		blimpTxt.style.whiteSpace  = "pre-wrap"
		blimpTxt.style.whiteSpace  = "pre-line"
		blimpTxt.style.wordWrap    = "break-word"
		scopeDiv.appendChild surfaceCanvas
		scopeDiv.appendChild blimpDiv
		blimpDiv.appendChild blimpCanvas
		blimpDiv.appendChild blimpTxt
		target.appendChild scopeDiv
		return scopeDiv
	
	setNamedDiv =(target,id)-> # div
		namedDiv = document.createElement "div"
		namedDiv.setAttribute "id","named"+id
		namedDiv.setAttribute "class","named"
		namedStyle = document.createElement "style"
		namedStyle.setAttribute "scoped","scoped"
		namedStyle.innerHTML = """
			#named#{id} *{
				position: absolute;
				border:   none;
				margin:   0px;
				padding:  0px;
				-webkit-user-select:         none;
				-webkit-tap-highlight-color: transparent;
			}
			.anchor,
			.select{
				color:  red;
				cursor: pointer;
			}
			.anchor:hover,
			.select:hover{
				background-color: violet;
			}
		"""
		namedDiv.appendChild namedStyle
		target.appendChild namedDiv
		return namedDiv
	
	# -----------------------
	#  script player
	# -----------------------
	
	playingScript = do->
		regExpHash =
			yy: /^\\\\/
			y0: /^\\0/
			y1: /^\\1/
			yp: /^\\p\[(\d+)\]/
			ys: /^\\s\[([^\]]+)\]/
			yb: /^\\b\[([^\]]+)\]/
			yi: /^\\i\[(\d+)\]/
			ywN: /^\\w(\d+)/
			y_w: /^\\_w\[(\d+)\]/
			yq: /^\\q\[([^\]]+)\]/
			y_aS: /^\\_a\[([^\]]+)\]/
			y_aE: /^\\_a/
			yc: /^\\c/
			yn: /^\\n/
			ynhalf: /^\\n\[half\]/
			ye: /^\\e/
		return (script,tidAry,namedObj,callback=->)-> # void
			talkWait = 0
			return
	
	# -----------------------
	#  main structure
	# -----------------------
	
	makeNamed = ( namedId, opt )-> # Named Instance
		
		makeScope = ( scopeId )-> # Scope Instance
			
			makeSurface = ( surfaceId, callback=(surfaceObj)-> )-> # Surface Instance
				
				console.log "makeSurface("+surfaceId+",callback)"
				
				# ------------------------
				#  Surface private members
				# ------------------------
				
				playTimngTidAry = []
				playPatternTidAryAry = []
				patternCanvedElmAry = []
				
				surfaceAry  = json.shell[curShellName].surface
				surfaceJson = json.shell[curShellName].surface[surfaceId]
				
				baseSurfaceCache = null
				
				# draw surface
				getSurfaceCanvas surfaceId,(cnv)->
					baseSurfaceCache = copy drawSurface surfaceCanvas,cnv
					patternCanvedElmAry = [["base",copy(baseSurfaceCache),0,0]]
					#setCollision()
					# set animations
					regExp = /(\w+)(?:,\s*(\d+))?/
					surfaceJson.animation?.forEach (anmN,i)->
						playPatternTidAryAry[i] = []
						[timing,n] = regExp.exec(anmN.timing).slice 1
						switch timing
							when "sometimes" then sometimes playTimngTidAry, (repeat)-> surfaceObj.playAnimation i,repeat
							when "rarely"    then rarely    playTimngTidAry, (repeat)-> surfaceObj.playAnimation i,repeat
							when "random"    then random    playTimngTidAry,((repeat)-> surfaceObj.playAnimation i,repeat),n
							when "runonce"   then runonce   playTimngTidAry, (repeat)-> surfaceObj.playAnimation i,repeat
							when "always"    then always    playTimngTidAry, (repeat)-> surfaceObj.playAnimation i,repeat
					setTimeout -> callback surfaceObj
				
				# ------------------------
				#  Surface public methods
				# ------------------------
				
				surfaceObj =
					"playAnimation": ( animationId, callback=(surfaceObj)-> )-> # Surface Instance
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").playAnimation("+animationId+",callback)"
						console.log playTimngTidAry
						console.log playPatternTidAryAry
						if surfaceJson.animation[animationId]?.pattern?
							patternAry = surfaceJson.animation[animationId].pattern
							i = 0
							playPattern = ->
								[type,id,delay,x,y] = patternAry[i]
								if id is -1
									patternCanvedElmAry[animationId+1] = []
									setTimeout ->
										drawSurface surfaceCanvas,composeCanvanizeElements patternCanvedElmAry
								else if surfaceAry[id]?
									getSurfaceCanvas id,(cnv)->
										patternCanvedElmAry[animationId+1] = [type,cnv,x,y]
										drawSurface surfaceCanvas,composeCanvanizeElements patternCanvedElmAry
								i += 1
								if patternAry[i]?
									playPatternTidAryAry[animationId].push setTimeout playPattern,delay*10
								else
									setTimeout -> callback surfaceObj
							setTimeout playPattern
						else
							setTimeout -> callback surfaceObj
						return surfaceObj
					"stopAnimation": ( animationId )-> # Surface Instance
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").stopAnimation("+animationId+")"
						if animationId?
							clearTimeout playTimngTidAry[animationId]
							playPatternTidAryAry[animationId].forEach (tid)-> clearTimeout tid
							playPatternTidAryAry[animationId] = []
						else
							playTimngTidAry.forEach (tid)-> clearTimeout tid
							playTimngTidAry = []
							playPatternTidAryAry.forEach (tidAry)-> tidAry.forEach (tid)-> clearTimeout tid
							playPatternTidAryAry = []
						return surfaceObj
					"show": -> # Surface Instance
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").show()"
						surfaceCanvas.style.visivilty = "visible"
						return surfaceObj
					"hide": -> # Surface Instance
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").hide()"
						surfaceCanvas.style.visivilty = "hidden"
						return surfaceObj
					"unload": -> # void
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").unload()"
						@stopAnimation()
						surfaceCanvas.width  = 0
						surfaceCanvas.height = 0
						return
				
				return surfaceObj
			
			makeBlimp = ( blimpId, callback=(blimpObj)-> )->
				
				console.log "makeBlimp("+blimpId+",callback)"
				
				# ------------------------
				#  Blimp private members
				# ------------------------
				
				# ------------------------
				#  Surface public methods
				# ------------------------
				
				blimpObj =
					"show": -> # Blimp Instance
						return blimpObj
					"hide": -> # Blimp Instance
						return blimpObj
					"talk": ( chr="" )-> # Blimp Instance
						return blimpObj
					"selection" :( title="", id="" )-> # Blimp Instance
						return blimpObj
					"anchor": ( id="" )-> # Blimp Instance
						return blimpObj
					"br": -> # Blimp Instance
						return blimpObj
					"clear": -> # Blimp Instance
						return blimpObj
					"unload": -> # void
						return
				
				return blimpObj
			
			# ------------------------
			#  makeScope constructor ( scopeId )
			# ------------------------
			
			console.log "makeScope("+scopeId+")"
			
			# ------------------------
			#  Scope private members
			# ------------------------
			
			scopeDiv = setScopeDiv namedDiv,scopeId
			surfaceCanvas = scopeDiv.childNodes[0]
			blimpDiv      = scopeDiv.childNodes[1]
			blimpCanvas   = blimpDiv.childNodes[0]
			blimpTxt      = blimpDiv.childNodes[1]
			
			curSurfaceObj = makeSurface 0,->
				curSurfaceObj.hide()
			curBlimpObj   = makeBlimp   0,->
				curBlimpObj.hide()
			
			# ------------------------
			#  Scope public methods
			# ------------------------
			
			scopeObj =
				"focus": -> # Scope Instance
					namedDiv.appendChild scopeDiv
					return scopeObj
				"surface":	 ( surfaceId, callback=(surfaceObj)-> )-> # Surface Instance
					console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+")"
					if surfaceId is -1
						curSurfaceObj.hide()
						setTimeout -> callback curSurfaceObj
					else if json.shell[curShellName].surface[surfaceId]?
						curSurfaceObj.unload()
						curSurfaceObj = makeSurface surfaceId,(curSurfaceObj)->
							curSurfaceObj.show()
							setTimeout -> callback curSurfaceObj
					return curSurfaceObj
				"blimp": ( blimpId, callback=(scopeObj)-> )-> # Blimp Instance
					console.log "named("+namedId+").scope("+scopeId+").blimp("+blimpId+")"
					return curBlimpObj
				"disappear": -> # void
					console.log "named("+namedId+").scope("+scopeId+").disappear()"
					curSurfaceObj.unload()
					curBlimpObj.unload()
					namedDiv.removeChild scopeDiv
					scopeAry[scopeId] = undefined
					return
			
			return scopeObj
		
		# ------------------------
		#  makeNamed constructor ( namedId, opt )
		# ------------------------
		
		console.log "makeNamed("+namedId+","+opt+")"
		
		# ------------------------
		#  Named private methods
		# ------------------------
		
		surfaceCache = []
		
		getSurfaceCanvas = (surfaceId,callback=(cnv)->)->
			surfaceJson = json.shell[curShellName].surface[surfaceId]
			if surfaceCache[surfaceId]?
				setTimeout -> callback copy surfaceCache[surfaceId]
			else if surfaceJson?.element?
				composeElements surfaceJson.element,(cnv)->
					surfaceCache[surfaceId] = cnv
					callback copy cnv
			else
				setTimeout callback document.createElement "canvas"
		
		# ------------------------
		#  Named private members
		# ------------------------
		
		{
			json: json
			callback: callback
		} = opt
		
		body = document.getElementsByTagName("body")[0]
		namedDiv = setNamedDiv body,namedId
		
		curShellName = "master"
		
		scriptTidAry = []
		onSecondChangeTid = 0
		eventHandlerHash = {}
		isTalking = false
		
		curScopeObj = makeScope 0
		scopeAry = [curScopeObj]
		
		# preloading and caching base surface
		json.shell[curShellName].surface.forEach (surfaceJson,i)->
			composeElements surfaceJson.element,(cnv)->
				surfaceCache[i] = cnv
		
		setTimeout -> callback namedObj
		
		# ------------------------
		#  Named public methods
		# ------------------------
		
		namedObj =
			"scope": ( scopeId )-> # Scope Instance
				console.log "named("+namedId+").scope("+scopeId+")"
				unless isNumber scopeId
					return curScopeObj
				else if scopeAry[scopeId]?
					return curScopeObj = scopeAry[scopeId]
				else
					curScopeObj = makeScope scopeId
					scopeAry[scopeId] = curScopeObj
					return curScopeObj
			"playScript": ( script="", callback=(namedObj)-> )-> # Named Instance
				console.log "named("+namedId+").playScript(\""+script+"\",callback)"
				@breakScript()
				isTalking = true
				playingScript.call namedObj,script,scriptTidAry,=>
					isTalking = false
					callback namedObj
					setTimeout => @breakScript()
				return namedObj
			"breakScript": -> # Named Instance
				console.log "named("+namedId+").breakScript()"
				scriptTidAry.forEach (tid)-> clearTimeout tid
				scriptTidAry = []
				scopeAry.forEach (scopeObj)-> scopeObj.blimp().clear()
				isTalking = false
				return namedObj
			"raiseEvent": ( e )-> # Named Instance
				console.log "named("+namedId+").raiseEvent("+e.ID+")"
				script = "\\1\\s[10]\\0\\s[0]Hello World!\\e"
				if script?
					@breakScript()
					setTimeout => @playScript script
				return namedObj
			"on": ( id="", handler=(e)-> )-> # Named Instance
				console.log "named("+namedId+").on(\""+id+"\")"
				eventHandlerHash[id] = handler
				return namedObj
			"materialize": -> # Named Instance
				console.log "named("+namedId+").materialize()"
				onSecondChangeTid = setInterval (=>
					@raiseEvent
						"ID": "OnSecondChange"
						"Reference0": 0
						"Reference1": 0
						"Reference2": 0
						"Reference3": 0
				),1000
				setTimeout =>
					@raiseEvent
						"ID": "OnBoot"
						"Reference0": curShellName
				return namedObj
			"vanish": -> # void
				console.log "named("+namedId+").vanish()"
				clearTimeout onSecondChangeTid
				@breakScript()
				scopeAry.forEach (scopeObj)-> scopeObj.disappear()
				body.removeChild namedDiv
				namedAry[namedId] = undefined
				return
		
		return namedObj
	
	# -----------------------
	#  Ikagaka constructor
	# -----------------------
	
	# -----------------------
	#  Ikagaka private members
	# -----------------------
	
	namedAry = []
	
	# -----------------------
	#  Ikagaka public methods 
	# -----------------------
	
	return {
		"createNamed": ( json={}, opt..., callback=(namedObj)-> )-> # Named Instance
			opt = opt[0] or {}
			opt.json = json
			opt.callback = callback
			namedAry[namedAry.length] = makeNamed namedAry.length,opt
			return namedAry[namedAry.length-1]
	}

$ ->
	ku_ = ikagaka.createNamed json,->
		ku_.materialize()
		ku_.scope(0).surface 10,->
			ku_.scope(0).surface(10).stopAnimation()