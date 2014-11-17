ikagaka = do->
	isFunction =    (fn)-> Object.prototype.toString.apply(fn)  is "[object Function]"
	isArray =      (ary)-> Object.prototype.toString.apply(ary) is "[object Array]"
	isObject =     (obj)-> Object.prototype.toString.apply(obj) is "[object Object]"
	isImage =      (img)-> Object.prototype.toString.apply(img) is "[object HTMLImageElement]"
	isCanvas =     (cnv)-> Object.prototype.toString.apply(cnv) is "[object HTMLCanvasElement]"
	typeIs =   (unknown)-> Object.prototype.toString.apply(unknown)
	isUndefined = (undf)-> typeof undf is "undefined"
	isNumber =     (num)-> isFinite Number num
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
	
	getOffset = do->
		jQuery = {}
		jQuery.support = {}
		rtable = /^t(?:able|d|h)$/i
		body = document.getElementsByTagName("body")[0]
		conMarginTop = 1
		paddingMarginBorder = "padding:0;margin:0;border:"
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;"
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;"
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;"
		html = """
			<div #{style} display:block;'>
				<div style=' #{paddingMarginBorder} 0;display:block;overflow:hidden;'></div>
			</div>
			<table  #{style} ' cellpadding='0' cellspacing='0'>
				<tr><td></td></tr>
			</table>
			"""
		container = document.createElement("div")
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px"
		body.insertBefore( container, body.firstChild )
		div = document.createElement("div")
		container.appendChild( div )
		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility
		div.innerHTML = html
		console.dir div
		outer = div.firstChild
		inner = outer.firstChild
		td = outer.nextSibling.firstChild.firstChild
		jQuery.support.fixedPosition = ( inner.offsetTop is 20 or inner.offsetTop is 15 )
		jQuery.support.doesNotAddBorder = ( inner.offsetTop isnt 5 )
		jQuery.support.doesAddBorderForTableAndCells = ( td.offsetTop is 5 )
		jQuery.support.subtractsBorderForOverflowNotVisible = ( inner.offsetTop is -5 )
		body.removeChild( container )
		div = container = null
		return (elem)->
			doc = elem.ownerDocument
			docElem = elem.ownerDocument.documentElement
			offsetParent = elem.offsetParent
			prevOffsetParent = elem
			body = doc.body
			defaultView = doc.defaultView
			prevComputedStyle = if defaultView then defaultView.getComputedStyle(elem,null) else elem.currentStyle
			top  = elem.offsetTop
			left = elem.offsetLeft
			while (elem = elem.parentNode) and elem isnt body && elem isnt docElem
				if jQuery.support.fixedPosition and prevComputedStyle.position is "fixed"
					break
				computedStyle = if defaultView then defaultView.getComputedStyle(elem,null) else elem.currentStyle
				top  -= elem.scrollTop
				left -= elem.scrollLeft
				if elem is offsetParent
					top  += elem.offsetTop
					left += elem.offsetLeft
					if jQuery.support.doesNotAddBorder and !(jQuery.support.doesAddBorderForTableAndCells and rtable.test(elem.nodeName))
						top  += parseFloat(computedStyle.borderTopWidth ) or 0
						left += parseFloat(computedStyle.borderLeftWidth) or 0
					prevOffsetParent =  offsetParent
					offsetParent = elem.offsetParent
				if jQuery.support.subtractsBorderForOverflowNotVisible and computedStyle.overflow is "visible"
					top  += parseFloat(computedStyle.borderTopWidth ) or 0
					left += parseFloat(computedStyle.borderLeftWidth) or 0
				prevComputedStyle = computedStyle
			if prevComputedStyle.position is "relative" or prevComputedStyle.position is "static"
				top  += body.offsetTop
				left += body.offsetLeft
			if jQuery.support.fixedPosition and prevComputedStyle.position is "fixed"
				top  += Math.max docElem.scrollTop,  body.scrollTop
				left += Math.max docElem.scrollLeft, body.scrollLeft
			return { top: top, left: left }
	
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
			
			
	
	namedAry = []
	
	makeNamed = ( opt )->	# namedObj
		
		makeScope = ( n )->	# scopeObj
			
			makeSurface = ( n )->
				
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
			
			makeBlimp = ( n )->
				
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
			
			scopeID = n
			curSurface = 0
			curBlimp = 0
			curSurfaceObj = makeSurface(curSurface)
			curBlimpObj = makeBlimp(curBlimp)
			
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
		
		namedId = namedAry.length-1
		curScope = 0
		scopeAry = [new makeScope]
		scriptTidAry = []
		eventHandlerHash = {}
		isTalking = false
		namedDiv
		preload
		
		return {
			"scope":		( n )->							# scopeObj
				return scopeAry[n]
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
			return namedAry[namedAry.length] = makeNamed(opt)
		"named": ( n )->	# namedObj
			return namedAry[n]
	}
