getOffset = `function( elem, doc, docElem ) {
	var computedStyle,
		offsetParent = elem.offsetParent,
		prevOffsetParent = elem,
		body = doc.body,
		defaultView = doc.defaultView,
		prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
		top = elem.offsetTop,
		left = elem.offsetLeft;

	while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			break;
		}

		computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
		top  -= elem.scrollTop;
		left -= elem.scrollLeft;

		if ( elem === offsetParent ) {
			top  += elem.offsetTop;
			left += elem.offsetLeft;

			if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevOffsetParent = offsetParent;
			offsetParent = elem.offsetParent;
		}

		if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
			top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
			left += parseFloat( computedStyle.borderLeftWidth ) || 0;
		}

		prevComputedStyle = computedStyle;
	}

	if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
		top  += body.offsetTop;
		left += body.offsetLeft;
	}

	if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
		top  += Math.max( docElem.scrollTop, body.scrollTop );
		left += Math.max( docElem.scrollLeft, body.scrollLeft );
	}

	return { top: top, left: left };
};`
localStorage?.clear()

ikagaka = do->
	typeIs = (unknown)->
		Object.prototype.toString.apply(unknown)
	isUndefined = (undf)->
		typeof undf is "undefined"
	isFunction = (fn)-> # bool
		Object.prototype.toString.apply(fn) is "[object Function]"
	isArray = (ary)-> # bool
		Object.prototype.toString.apply(ary) is "[object Array]"
	isObject = (obj)-> # bool
		Object.prototype.toString.apply(obj) is "[object Object]"
	isImage = (img)-> # bool
		Object.prototype.toString.apply(img) is "[object HTMLImageElement]"
	isCanvas = (cnv)-> # bool
		Object.prototype.toString.apply(cnv) is "[object HTMLCanvasElement]"
	isNumber = (num)-> # bool
		isFinite Number num
	test "isNumber",->
		ok isNumber(0)
		ok isNumber("-5")
		ok isNumber("0x0012")
	
	loadImg = (url,callback=(img)->)-> # void
		if(url is "")
			callback new Image
		else
			img = new Image
			img.src = url
			img.onload  = -> callback img
			img.onerror = -> callback new Image
		return
	asyncTest "loadImg",->
		ok isUndefined loadImg "./ku-/shell/master/surface0.png",(img)->
			start()
			ok isImage img
			ok img.width > 0
			loadImg "",(img)->
				start()
				ok isImage img
				ok img.width is 0
	
	copyCnv = (cnv)-> # cnv
		copy = document.createElement("canvas")
		copy.width  = cnv.width
		copy.height = cnv.height
		ctx = copy.getContext '2d'
		try ctx.drawImage cnv,0,0
		return copy
	asyncTest "copyCnv",->
		loadImg "./ku-/shell/master/surface0.png",(img)->
			start()
			ok isCanvas copyCnv img
	
	overlayCnv = (target,cnv,x=0,y=0)-> # cnv
		return overlayfastCnv target,cnv,x,y
	overlayfastCnv = (target,cnv,x=0,y=0)-> # cnv
		ctx = target.getContext '2d'
		try ctx.drawImage cnv,x,y
		return target
	asyncTest "overlayCnv",->
			loadImgsToCnvs [
				"./ku-/shell/master/surface0.png"
				"./ku-/shell/master/surface8.png"
				"./hoge"
			],(cnvAry)->
				start()
				ok isCanvas overlayCnv cnvAry[0],cnvAry[1],100,100
	
	drawCnv = (target,cnv)-> # cnv
		target.width  = cnv.width
		target.height = cnv.height
		if target.parentNode?
			target.parentNode.style.width  = cnv.width
			target.parentNode.style.height = cnv.height
		ctx = target.getContext '2d'
		try ctx.drawImage cnv,0,0
		return target
	asyncTest "drawCnv",->
		loadImg "./ku-/shell/master/surface0.png",(img)->
			start()
			div = document.createElement("div")
			cnv = document.createElement("canvas")
			div.appendChild cnv
			ok isCanvas drawCnv cnv,copyCnv img
			ok div.style.width? && parseInt(div.style.width,10) > 0
	
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
	asyncTest "transImg",->
		loadImg "./ku-/shell/master/surface0.png",(img)->
			start()
			ok isUndefined transImg img,(cnv)->
				start()
				ok isCanvas cnv
			stop()
	
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
					if localStorage?[url]?
						dataScheme = localStorage[url]
					loadImg dataScheme or url,(img)->
						transImg img,(cnv)->
							cnvCache[url] = cnv
							localStorage?[url] = cnv.toDataURL("image/png")
							setTimeout -> ifend url
			return
	asyncTest "loadImgsToCnvs",11,->
		ok isUndefined loadImgsToCnvs [
			"./ku-/shell/master/surface0.png"
			"./ku-/shell/master/surface5.png"
			""
			"./undefined"
		],(cnvAry)->
			start()
			ok cnvAry.length is 4
			ok isCanvas(cnvAry[0]) && cnvAry[0].width > 0
			ok isCanvas(cnvAry[1]) && cnvAry[1].width > 0
			ok isCanvas(cnvAry[2]) && cnvAry[2].width is 0
			ok isCanvas(cnvAry[3]) && cnvAry[3].width is 0
			loadImgsToCnvs [
				"./ku-/shell/master/surface0.png"
				"./ku-/shell/master/surface5.png"
				""
				"./undefined"
			],(cnvAry)->
				start()
				ok cnvAry.length is 4
				ok isCanvas(cnvAry[0]) && cnvAry[0].width > 0
				ok isCanvas(cnvAry[1]) && cnvAry[1].width > 0
				ok isCanvas(cnvAry[2]) && cnvAry[2].width is 0
				ok isCanvas(cnvAry[3]) && cnvAry[3].width is 0
	
	canvedElements = (elmAry,callback=(cnvedElmAry)->)-> # void
		urlAry = elmAry.map ([type,url,x,y]=ary)-> url
		loadImgsToCnvs urlAry,(cnvAry)->
			cnvedElmAry = elmAry.map ([type,url,x,y]=ary,i)-> [type,cnvAry[i],x,y]
			callback cnvedElmAry
		return
	asyncTest "canvedElements",->
		elmAry = [
			["base","./ku-/shell/master/surface0.png"]
			["overlay","./ku-/shell/master/surface1.png",-100,100]
		]
		ok isUndefined canvedElements elmAry,(cnvedElmAry)->
			start()
			cnvedElmAry.forEach ([type,cnv,x,y]=ary,i)->
				ok type is elmAry[i][0]
				ok isCanvas cnv
	
	composeElements = (elmAry,callback=(cnv)->)-> # void
		canvedElements elmAry,(cnvedElmAry)->
			target = copyCnv cnvedElmAry[0][1] # if elmAry dont have base
			cnvedElmAry.forEach ([type,cnv,x,y]=ary)->
				switch type
					when "base"        then target = copyCnv cnv
					when "overlay"     then target = overlayCnv  target,cnv,x,y
					when "overlayfast" then target = overlayfast target,cnv,x,y
			callback target
	asyncTest "composeElements",->
		elmAry = [
			["base"   ,"./ku-/shell/master/surface0.png"]
			["overlay","./ku-/shell/master/surface1.png",100,100]
			["overlay","./ku-/shell/master/surface2.png",-100,100]
			["overlay","./ku-/shell/master/surface3.png",100,-100]
			["overlay","./ku-/shell/master/surface4.png",-100,-100]
		]
		composeElements elmAry,(cnv)->
			start()
			ok isCanvas cnv
	
	isHit = (target,x=0,y=0)->
		ctx = target.getContext "2d"
		try
			imgdata = ctx.getImageData 0,0,x,y
			return imgdata.data[imgdata.data.length-1] isnt 0
		return true
	asyncTest "isHit",->
		elmAry = [["base","./ku-/shell/master/surface0.png"]]
		composeElements elmAry,(cnv)->
			start()
			ok !isHit cnv,1,1
	
	setCollisions = (target,colAry,handler=(e)->)-> # cnv
		mouseEvent = (id,e,colAry,handler)->
			scopeId = /[0-9]+/.exec @.parentNode.getAttribute("id")[0]
			unless isNumber scopeId
				scopeId = ""
			{left,top} = getOffset @,@.ownerDocument,@.ownerDocument.documentElement
			offsetX = e.offsetX or e.pageY-top
			offsetY = e.offsetY or e.pageX-left
			if isHit target,offsetX,offsetY
				e.preventDefault()
				event =
					"ID": id
					"Reference0": offsetX
					"Reference1": offsetY
					"Reference2": 0
					"Reference3": scopeId
					"Reference4": ""
					"Reference5": 0
				if id is "OnMouseMove"
					delete event.Reference5
				isOnMouse = false
				colAry?.forEach ([x,y,_x,_y,name]=ary)->
					if (x < offsetX < _x and y < offsetY < _y) or (_x < offsetX < x and _y < offsetY < y)
						isOnMouse = true
						event.Reference4 = name
				if isOnMouse
					target.style.cursor = "pointer"
				else
					target.style.cursor = "default"
				handler event
		[
			["click"      ,(e)-> mouseEvent.call @,"OnMouseClick"      ,e,colAry,handler]
			["dblclick"   ,(e)-> mouseEvent.call @,"OnDoubleMouseClick",e,colAry,handler]
			["mousedown"  ,(e)-> mouseEvent.call @,"OnMouseDown"       ,e,colAry,handler]
			["mousemove"  ,(e)-> mouseEvent.call @,"OnMouseMove"       ,e,colAry,handler]
			["mouseup"    ,(e)-> mouseEvent.call @,"OnMouseUp"         ,e,colAry,handler]
			["touchstart" ,do->
				touchOnce=false
				(e)->
					unless touchOnce
						touchOnce = true
					else
						touchOnce = false
						mouseEvent.call @,"OnDoubleMouseClick",e,colAry,handler
					setTimeout (->touchOnce=false),500
			]
			["touchmove"  ,(e)-> mouseEvent.call @,"OnMouseMove"       ,e,colAry,handler]
			["touchend"   ,(e)-> mouseEvent.call @,"OnMouseUp"         ,e,colAry,handler]
			["touchcancel",(e)-> ]
		].forEach ([type,handler]=ary)->
			target.removeEventListener type,handler.bind target
			target.addEventListener    type,handler.bind target
		return target
	asyncTest "setCollisions",->
		elmAry = [["base"   ,"./ku-/shell/master/surface0.png"]]
		colAry = [
			[71,40,168,98,"head"]
			[97,112,164,158,"face"]
			[122,216,150,259,"bust"]
		]
		composeElements elmAry,(cnv)->
			start()
			ok true
			scope = document.createElement("div")
			scope.setAttribute("id","scope0")
			target = document.createElement("canvas")
			scope.appendChild target
			setCollisions drawCnv(target,cnv),colAry,(e)->
				console.log key,val for key,val of e
			$("body").append "hpge"
			$("body").append scope
			
			
	###
	
	_namedAry = []
	
	_makeNamed = ( opt )->	# namedObj
		
		_makeScope = ( n )->	# scopeObj
			
			_makeSurface = ( n )->
				
				return {
					"playAnimation":( n, callback=(surfaceObj)-> )->	# surfaceObj
						return @
					"stopAnimation":( n )->					# surfaceObj
						return @
					"show":			->						# surfaceObj
						return @
					"hide":			->						# surfaceObj
						return @
					"disappear":	->						# void
						return undefined
				}
			
			_makeBlimp = ( n )->
				
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
					"disappear":->						# void
						return undefined
				}
			
			_scopeID = n
			_curSurface = 0
			_curBlimp = 0
			_curSurfaceObj = _makeSurface(_curSurface)
			_curBlimpObj = _makeBlimp(_curBlimp)
			
			return {
				"focus":	 ->							# scopeObj
					return @
				"surface":	 ( n, callback=(scopeObj)-> )->	# scopeObj
					return @
				"blimp":	 ( n, callback=(scopeObj)-> )->	# scopeObj
					return @
				"disappear": ->							# void
					return undefined
			}
		
		{
			json: _json
			callback: _callback
		} = opt
		
		_namedId = namedAry.length-1
		_curScope = 0
		_scopeAry = [new _makeScope]
		_scriptTidAry = []
		_eventHandlerHash = {}
		_isTalking = false
		_namedDiv
		preload
		
		return {
			"scope":		( n )->							# scopeObj
				return _scopeAry[n]
			"playScript":	( script="", callback=(namedObj)-> )->	# namedObj
				return @
			"breakScript":	->								# namedObj
				return @
			"raiseEvent":	( e )->							# namedObj
				return @
			"on":			( id="", handler=(e)-> )->		# namedObj
				return @
			"materialize":	->								# namedObj
				return @
			"vanish":		->								# void
				return undefined
		}
	
	return {
		"createNamed": ( json={}, opt={}, callback=(namedObj)-> )->	# namedObj
			opt.json = json
			opt.callback = callback
			return _namedAry[_namedAry.length] = _makeNamed(opt)
		"named": ( n )->	# namedObj
			return _namedAry[n]
	}
###