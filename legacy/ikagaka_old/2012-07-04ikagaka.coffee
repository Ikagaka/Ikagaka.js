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
	#  image to canvas
	# -----------------------
	
	loadImg = (url,callback=(img)->)-> # void
		if(url is "")
			callback new Image
		else
			img = new Image
			img.src = url
			img.onload  = -> callback img
			img.onerror = -> callback new Image
		return
	
	copyCnv = (cnv)-> # cnv
		copy = document.createElement("canvas")
		copy.width  = cnv.width
		copy.height = cnv.height
		ctx = copy.getContext '2d'
		try ctx.drawImage cnv,0,0
		return copy
	
	transImg = (img,callback=(cnv)->)-> # void
		cnv = copyCnv img
		ctx = cnv.getContext '2d'
		try
			imgdata = ctx.getImageData 0,0,img.width,img.height
			if imgdata.data[3] is 0 # alpha channel png or already transparented cache
				setTimeout ->
					ctx.putImageData imgdata,0,0
					callback cnv
			else
				i = 0
				[r,g,b] = [imgdata.data[0],imgdata.data[1],imgdata.data[2]]
				while i < imgdata.data.length
					if r is imgdata.data[i] and g is imgdata.data[i+1] and b is imgdata.data[i+2]
						imgdata.data[i+3] = 0 # alpha channel taransparent
					i += 4
				setTimeout ->
					ctx.putImageData imgdata,0,0
					callback cnv
		catch e
			setTimeout -> callback cnv
		return
	
	loadImgsToCnvs = do ->
		cnvCache = {}
		return (urlAry,callback=(cnvAry)->)-> # void
			i = urlAry.length
			ifend = (url)->
				if --i is 0
					cnvAry = urlAry.map (url)->
						copyCnv cnvCache[url] # cnvCache is precious original
					callback cnvAry
			urlAry.forEach (url)->
				if cnvCache[url]?
					setTimeout -> ifend url
				else
					#if localStorage?[url]?
					#	dataScheme = localStorage[url]
					#loadImg dataScheme or url,(img)->
					loadImg url,(img)->
						transImg img,(cnv)->
							cnvCache[url] = cnv
							#localStorage?[url] = cnv.toDataURL("image/png")
							setTimeout -> ifend url
			return
	
	# -----------------------
	#   canvas manufacturers
	# -----------------------
	
	overlayCnv = (target,cnv,x=0,y=0)-> # cnv
		return overlayfastCnv target,cnv,x,y
	
	overlayfastCnv = (target,cnv,x=0,y=0)-> # cnv
		ctx = target.getContext '2d'
		try ctx.drawImage cnv,x,y
		return target
	
	# -----------------------
	#  surface compose manufacturers
	# -----------------------
	
	canvanizeElements = (elmAry,callback=(cnvedElmAry)->)-> # void
		urlAry = elmAry.map ([type,url,x,y]=ary)-> url
		loadImgsToCnvs urlAry,(cnvAry)->
			cnvedElmAry = elmAry.map ([type,url,x,y]=ary,i)-> [type,cnvAry[i],x,y]
			callback cnvedElmAry
		return
	
	composeCanvanizeElements = (cnvedElmAry)->
		target = null
		cnvedElmAry.forEach ([type,cnv,x,y]=ary)->
			target ?= cnv
			switch type
				when "base"        then target = copyCnv cnv
				when "overlay"     then target = overlayCnv     target,cnv,x,y
				when "overlayfast" then target = overlayfastCnv target,cnv,x,y
		return target
	
	composeElements = (elmAry,callback=(cnv)->)-> # void
		canvanizeElements elmAry,(cnvedElmAry)->
			callback composeCanvanizeElements cnvedElmAry
	
	drawSurface = (target,cnv)-> # cnv
		target.width  = cnv.width
		target.height = cnv.height
		target.parentNode.style.width  = cnv.width
		target.parentNode.style.height = cnv.height
		ctx = target.getContext '2d'
		try ctx.drawImage cnv,0,0
		return target
	
	# -----------------------
	#  animation timing function
	# -----------------------
	
	sometimes = (tidAry,fn)-> random(tidAry,fn,2)
	
	rarely = (tidAry,fn)-> random(tidAry,fn,4)
	
	random = (tidAry,fn,n)->
		ms = 1
		ms++ while Math.round(Math.random() * 1000) > 1000/n
		return tidAry.push setTimeout(->
			fn()
			random(tidAry,fn,n)
		,ms*1000)
	
	runonce = (tidAry,fn)-> tidAry.push setTimeout(fn,0)
	
	always = (tidAry,fn)->
		tidAry.push setTimeout ->
			fn -> always tidAry,fn
	
	# -----------------------
	#  element struct manufacturers
	# -----------------------
	
	setScopeDiv = (target,n)-> # divElement
		scopeDiv = document.createElement "div"
		scopeDiv.setAttribute "class","scope"+n
		scopeDiv.style.bottom = "0px"
		scopeDiv.style.right  = n*240+"px"
		surfaceCnv = document.createElement "canvas"
		surfaceCnv.setAttribute "class","surface"
		surfaceCnv.width  = 0
		surfaceCnv.height = 0
		blimpDiv = document.createElement "div"
		blimpDiv.setAttribute "class","blimp"
		blimpDiv.style.top = "60px"
		blimpDiv.style.left = "-300px"
		blimpCnv = document.createElement "canvas"
		blimpCnv.width  = 0
		blimpCnv.height = 0
		blimpTxt = document.createElement "div"
		blimpTxt.style.margin      = "10px"
		blimpTxt.style.marginRight = "30px"
		blimpTxt.style.overflowY   = "scroll"
		blimpTxt.style.whiteSpace  = "pre"
		blimpTxt.style.whiteSpace  = "pre-wrap"
		blimpTxt.style.whiteSpace  = "pre-line"
		blimpTxt.style.wordWrap    = "break-word"
		scopeDiv.appendChild surfaceCnv
		scopeDiv.appendChild blimpDiv
		blimpDiv.appendChild blimpCnv
		blimpDiv.appendChild blimpTxt
		target.appendChild scopeDiv
		return scopeDiv
	
	setNamedDiv =(target,id)-> # divElement
		namedDiv = document.createElement "div"
		namedDiv.setAttribute "id","named"+id
		namedDiv.setAttribute "class","named"
		namedStyle = document.createElement "style"
		namedStyle.setAttribute "scoped","scoped"
		namedStyle.innerHTML = "#named"+id+" *{position:absolute;border:none;margin:0px;padding:0px;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;} .anchor,.select{color:red;cursor:pointer;} .anchor:hover,.select:hover{background-color:violet;}"
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
		return (script,tidAry,callback=->)-> # void
			talkWait = 0
			console.log script
			setTimeout callback
	
	# -----------------------
	#  main structure
	# -----------------------
	
	makeNamed = ( n, opt )->	# namedObj
		
		makeScope = ( n )->	# scopeObj
			
			makeSurface = ( n, callback=(surfaceObj)-> )->
				
				# ------------------------
				#  makeSurface constructor ( n ,callback )
				# ------------------------
				
				console.log "makeSurface("+n+","+callback+")"
				
				# ------------------------
				#  Surface private members
				# ------------------------
				
				surfaceId = n
				animationTimingTidAry = []
				animationNPatternNTidAryAry = []
				animationNPatternElementAryAry = []
				
				surfaceAry  = json.shell[curShellName].surface
				surfaceJson = json.shell[curShellName].surface[surfaceId]
				
				baseSurfaceCnv = null
				
				# draw surface
				getSurfaceCnv surfaceId,(cnv)->
					baseSurfaceCnv = copyCnv drawSurface surfaceCnv,cnv
					animationNPatternElementAryAry = [["base",copyCnv baseSurfaceCnv,0,0]]
					#setCollision()
					# set animations
					regExp = /(\w+)(?:,\s*(\d+))?/
					surfaceJson.animation?.forEach (anmN,i)->
						animationNPatternNTidAryAry[i] = []
						[timing,n] = regExp.exec(anmN.timing).slice(1)
						switch timing
							when "sometimes" then sometimes animationTimingTidAry, (callback)-> surfaceObj.playAnimation i,callback
							when "rarely"    then rarely    animationTimingTidAry, (callback)-> surfaceObj.playAnimation i,callback
							when "random"    then random    animationTimingTidAry,((callback)-> surfaceObj.playAnimation i,callback),n
							when "runonce"   then runonce   animationTimingTidAry, (callback)-> surfaceObj.playAnimation i,callback
							#when "always"    then always    animationTimingTidAry, (callback)-> surfaceObj.playAnimation i,callback
					setTimeout callback.bind null,surfaceObj
				
				# ------------------------
				#  Surface public methods
				# ------------------------
				
				surfaceObj =
					"playAnimation": ( n, callback=(surfaceObj)-> )-> # Surface Instance
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").playAnimation("+n+","+callback+")"
						if isNumber(n) and surfaceJson.animation[n].pattern?
							patternAry = surfaceJson.animation[n].pattern
							i = 0
							target = surfaceCnv
							playPattern = ->
								[type,id,delay,x,y] = patternAry[i]
								x ?= 0
								y ?= 0
								if id is -1
									animationNPatternElementAryAry[n+1] = []
									setTimeout ->
										drawSurface target,composeCanvanizeElements animationNPatternElementAryAry
								else if surfaceAry[id]?
									getSurfaceCnv id,(cnv)->
										animationNPatternElementAryAry[n+1] = [type,cnv,x,y]
										console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").playAnimation("+n+",neo)"
										console.log animationNPatternElementAryAry
										drawSurface target,composeCanvanizeElements animationNPatternElementAryAry
								i += 1
								if patternAry[i]?
									animationNPatternNTidAryAry[n].push setTimeout playPattern,delay*10
								else
									setTimeout callback.bind null,surfaceObj
							setTimeout playPattern
						else
							setTimeout callback.bind null,surfaceObj
						return @
					"stopAnimation": ( n )-> # Surface Instance
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").stopAnimation("+n+")"
						if n?
							clearTimeout animationTimingTidAry[n]
							animationNPatternNTidAryAry[n].forEach (tid)->
								clearTimeout ary
						else
							clearTimeout animationTimingTidAry[n]
							animationNPatternNTidAryAry.forEach (ary)->
								ary.forEach (tid)->
									clearTimeout ary
						return @
					"show": -> # Surface Instance
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").show()"
						surfaceCnv.style.visivilty = "visible"
						return @
					"hide": -> # Surface Instance
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").hide()"
						surfaceCnv.style.visivilty = "hidden"
						return @
					"unload": -> # void
						console.log "named("+namedId+").scope("+scopeId+").surface("+surfaceId+").disappear()" if @_._._apiLogging
						@stopAnimation()
						surfaceCnv.width  = 0
						surfaceCnv.height = 0
						return
				
				return surfaceObj
			
			makeBlimp = ( n, callback=(blimpObj)-> )->
				
				console.log "makeBlimp("+n+","+callback+")"
				
				return {
					"show":		->						# blimpObj
						return @
					"hide":		->						# blimpObj
						return @
					"talk":		( chr="" )->			# blimpObj
						return @
					"selection":( title="", id="" )->	# blimpObj
						return @
					"anchor":	( id="" )->				# blimpObj
						return @
					"br":		->						# blimpObj
						return @
					"clear":	->						# blimpObj
						return @
					"unload":->						# void
						return undefined
				}
			
			# ------------------------
			#  makeScope constructor ( n )
			# ------------------------
			
			console.log "makeScope("+n+")"
			
			# ------------------------
			#  Scope private members
			# ------------------------
			
			scopeId = n
			
			scopeDiv = setScopeDiv namedDiv,scopeId
			surfaceCnv = scopeDiv.childNodes[0]
			console.dir  surfaceCnv
			blimpDiv = scopeDiv.childNodes[1]
			blimpCnv = blimpDiv.childNodes[0]
			blimpTxt = blimpDiv.childNodes[1]
			
			curSurfaceObj = makeSurface 0
			curBlimpObj = makeBlimp 0
			
			# ------------------------
			#  Scope public methods
			# ------------------------
			
			return {
				"focus": -> # Scope Instance
					namedDiv.appendChild scopeDiv
					return @
				"surface":	 ( n, callback=(surfaceObj)-> )-> # Scope Instance
					console.log "named("+namedId+").scope("+scopeId+").surface("+n+")"
					unless isNumber n
						setTimeout callback.bind null,curSurfaceObj
					else if n is -1
						curSurfaceObj.hide()
						setTimeout callback.bind null,curSurfaceObj
					else if json.shell[curShellName].surface[n]?
						curSurfaceObj = makeSurface n,(surfaceObj)->
							surfaceObj.show()
							setTimeout callback.bind null,surfaceObj
					return curSurfaceObj
				"blimp": ( n, callback=(scopeObj)-> )-> # Blimp Instance
					console.log "named("+namedId+").scope("+scopeId+").blimp("+n+")"
					return curBlimpObj
				"disappear": -> # void
					console.log "named("+namedId+").scope("+scopeId+").disappear()"
					curSurfaceObj.unload()
					curBlimpObj.unload()
					namedDiv.removeChild scopeDiv
					scopeAry[scopeId] = undefined
					return
			}
		
		# ------------------------
		#  makeNamed constructor ( n, opt )
		# ------------------------
		
		console.log "makeNamed("+n+","+opt+")"
		
		# ------------------------
		#  Named private methods
		# ------------------------
		
		surfaceCache = []
		
		getSurfaceCnv = (n,callback=(cnv)->)->
			surfaceJson = json.shell[curShellName].surface[n]
			if surfaceCache[n]?
				setTimeout ->
					callback copyCnv surfaceCache[n]
			else if surfaceJson?
				composeElements surfaceJson.element,(cnv)->
					surfaceCache[n] = cnv
					callback copyCnv cnv
			else
				setTimeout callback
		
		# ------------------------
		#  Named private members
		# ------------------------
		
		namedId = n
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
		curScopeObj.focus()
		
		json.shell[curShellName].surface.forEach (surfaceJson,i)->
				composeElements surfaceJson.element,(cnv)->
					surfaceCache[i] = cnv # preloading and caching base surface
		
		setTimeout -> callback namedObj
		
		# ------------------------
		#  Named public methods
		# ------------------------
		
		namedObj =
			"scope": ( n )-> # Scope Instance
				console.log "named("+namedId+").scope("+n+")"
				unless isNumber n
					return curScopeObj
				else if scopeAry[n]?
					return curScopeObj = scopeAry[n]
				else
					curScopeObj = makeScope n
					scopeAry[n] = curScopeObj
					curScopeObj.focus()
					return curScopeObj
			"playScript": ( script="", callback=(namedObj)-> )-> # Named Instance
				console.log "named("+namedId+").playScript(\""+script+"\")"
				@breakScript()
				isTalking = true
				playingScript script,scriptTidAry,=>
					scriptTidAry.forEach (tid)-> clearTimeout tid
					isTalking = false
					callback @
					setTimeout => @breakScript()
				return @
			"breakScript": -> # Named Instance
				console.log "named("+namedId+").breakScript()"
				scriptTidAry.forEach (tid)-> clearTimeout tid
				scopeAry.forEach (scopeObj)-> scopeObj.blimp().clear()
				isTalking = false
				return @
			"raiseEvent": ( e )-> # Named Instance
				console.log "named("+namedId+").raiseEvent("+e.ID+")"
				script = "\\0\\s[0]Hello World!"
				if script?
					@breakScript()
					setTimeout => @playScript script
				return @
			"on": ( id="", handler=(e)-> )-> # Named Instance
				console.log "named("+namedId+").on(\""+id+"\")"
				eventHandlerHash[id] = handler
				return @
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
				return @
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
	ku_ = ikagaka.createNamed json,(ku_)->
		ku_.materialize()
		ku_.scope(1).surface(10)
		ku_.scope(2).surface(10)
	ku_.on "OnBoot",(e)->
		"\\0\\s[0]\\1\\s[10]\\e"