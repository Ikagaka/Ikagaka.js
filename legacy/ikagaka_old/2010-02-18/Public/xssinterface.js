/*
 * 
 * 
 * The xssinterface javascript library enables communication of 
 * multiple pages (or pages and iframes) via javascript functions 
 * across domain boundaries. This may be useful for websites that 
 * want to expose a limited javascript interface to embedded widgets.
 * 
 * This library requires that you also load the standard JSON library:
 * http://www.json.org/json2.js
 * 
 * 
 * Copyright (c) 2008, Malte Ubl
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *    * Neither the name of Malte Ubl nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * 
 * TODO
 * - Factor out cookie/postMessage messaging backends into individual classes^
 * - Turns documentation into nice JSDoc
 * 
 */

// Set this to false to diable Google Gears support.
// This must be done equally on all callers and listeners.
var XSSInterfaceEnableGoogleGearsSupport  = true;

// Only disable this for debugging
var XSSInterfaceEnablePostMessageSupport  = true;

// Number of milli seconds between polls for new callbacks
var XSSInterfacePollIntervalMilliSeconds  = 200;
// Name of cookie that is used for messages. Should not be changed
var XSSInterfaceCookieName                = "XSSData";
// Name of cookie that is used for the security token
var XSSInterfaceSecurityTokenCookieName   = "XSSSecurityToken";
// Enables debug mode. You might want to add <div id=log></div> to your pages
var XSSInterfaceDebug                     = false;

var XSSMaximumQueryStringLength           = document.all ? 2000 : 6000;

XSSInterface = {
	canPostMessage:	function () {
		if(!XSSInterfaceEnablePostMessageSupport) {
			return false
		}
		if(window.postMessage || document.postMessage) {
			return true
		}
		return false
	},
	
	canGearsMessage: function () {
		if(!XSSInterfaceEnableGoogleGearsSupport) {
			return false
		}
		XSSInterfaceInitializeGears(); // Initialize gears. Now that we know that we need it
		if(window.google && window.google.gears && window.google.gears.factory) {
			return true
		}
		return false
	}
	
}

/* A listener for cross domain callbacks
 * 
 * @param securityToken should be a cryptographically secure random string. It should be equal for all listener of
 *  a users and a given domain. sha1(session_id) should work. This id is exchanged with sites that are allowed to
 *  call this listener.
 * @param channelId is an identifier that groups listeners and callers. If you have multiple iframes, create one channel for each of them.
*/
XSSInterface.Listener   = function (securityToken,channelId) {
	this.callbacks         = {};
	this.callbackNames     = [];
	
	if(securityToken  == "" || securityToken == null) throw("Missing Parameter securityToken")
	this.securityToken     = securityToken;
	
	this.channelId         = channelId;
	if(this.channelId == null) {
		this.channelId     = ""
	}
	
	this.allowedDomains    = [];
	
	
	this.gearsWorkerPools  = []; // Used to hook workerPools when in Gears mode
	this.gearsListenerPath = {}; // Used to store the path to the gears_listener.js file on each allowed domain
	
	this.cookie            = new XSSInterface.Cookie()
	
	this.timer             = null;
	
	// Error Callbacks
	// When defined called with (methodName,callerDomain) when an unknown message is found
	this.methodNotFoundCallback = null;
	// When defined called with (methodName,callerDomain,securityToken) when an unauthorized message is called
	this.blockedMessageCallback = null;
}

XSSInterface.Listener.prototype = {
	
	/*
	 * call this to enable hostname to send messages to this listener
	 * @param hostname that may send messages
	 * @param pathToCookieSetterHTMLFile must be a path residing on hostname to the cookie_setter.html file that is provided by this library
	 *  "http://" + hostname + pathToCookieSetterHTMLFile
	 * 
	 */
	allowDomain: function(hostname, pathToCookieSetterHTMLFile, pathToGearsListenerFile) {
		var me = this;
		
		this.allowedDomains.push(hostname);
		
		if(this.canPostMessage())  return;
		if(this.canGearsMessage()) {
			this.gearsListenerPath[hostname] = pathToGearsListenerFile
		};
		
		// the timeout makes Firefox happy
		window.setTimeout(function () {
			var url = "http://"+hostname+pathToCookieSetterHTMLFile
			me.cookie.setCrossDomain(url, "token", me.securityToken, me.channelId)
		}, 300);
	},

	/*
	 * register a callback with a given name
	 * func must be a function reference
	 */
	registerCallback: function (name, func) {
		this.callbacks[name] = func;
		this.callbackNames.push(name)
	},
	
	/*
	 * As soon as this method is called the listener will respond to calls.
	 * This should be called from the window.onload event
	 */
	startEventLoop: function () {
		
		var me = this;
	
		if(this.canPostMessage()) {
			document.addEventListener("message", this.makePostMessageHandler(), false)
		} 
		else if(this.canGearsMessage()) {
			var workerPool       = google.gears.factory.create('beta.workerpool');
			workerPool.onmessage = this.makeGearsMessageHandler();
			
			// install a gears message listener on each allowed domain
			for(var i = 0; i < this.allowedDomains.length; i++) {
				var domain   = this.allowedDomains[i];
				var url      = "http://"+domain+this.gearsListenerPath[domain]; // XXX make path variable
				var workerId = workerPool.createWorkerFromUrl(url);
				
				// send message to the worker. The worker will now now about us (message.origin) and the channelId (message.text)
				workerPool.sendMessage(""+me.channelId, workerId);
				
				// hook me so i dont get out of scope
				this.gearsWorkerPools[i] = workerPool
			}
		}
		else {
			this.timer = window.setInterval( function () { me.handleCookieMessage() }, XSSInterfacePollIntervalMilliSeconds )
		}
	},	
	
	
	canPostMessage:	 XSSInterface.canPostMessage,
	canGearsMessage: XSSInterface.canGearsMessage,
	
	// private
	/*
	 * Reads a message cookie. If successful, clears the cookie and parses its contents as JSON
	 */
	parse: function (data) {

		var json;
		
		if(data) {
			json = data
		} else {
			json = this.read();	
		}
	
		if(json != null && json != "") {

			this.clear();

		 	json = new String(json)
			return JSON.parse(json);
		}
		return null

	},
	
	// private
	/*
	 * Build the message cookie name. It includes the channelId so that we can have multiple message channels.
	 */
	dataCookieName:	function () {
		return XSSInterfaceCookieName+this.channelId
	},
	
	// private
	/*
	 * Retrieves a message cookie
	 */
	read: function() {
		return this.cookie.get(this.dataCookieName());
	},

	// private
	/*
	 * Clears the message cookie
	 */
	clear: function() {
		this.cookie.set(this.dataCookieName(),"");
	},
	
	handleCookieMessage: 	function () {
		
		var data = this.parse();
		
		if(data) {
			var calls = data.calls;
			var token = data.token;
		
			for(var i = 0; i < calls.length; i++) {
				var call = calls[i];
				call.token = token;
				this.execute(call, false)
			}
		}

	},
	
	makePostMessageHandler: function () {
		var me = this;
		
		return function (event) {
			me.handlePostMessage(event)
		}
		
	},
	
	makeGearsMessageHandler: function () {
		var me = this;
		
		return function (deprecated1, deprecated2, message) {
			me.handleGearsMessage(deprecated1, deprecated2, message)
		}
		
	},
	
	extractDomainFromURI: function(uri) {
		
		// Origin is a string of the form scheme://domain:port;
		// XXX Ugly! Use a real URI-Parser. 
		
		var uri_string = new String(uri);
		var parts      = uri_string.split("/");
		var domain     = parts[2];
		parts          = domain.split(":"); // remove port
		domain         = parts[0];
		return domain
	},
	
	/*
	 * Handle a message send via google.gears.sendMessage()
	 */
	handleGearsMessage: function(deprecated1, deprecated2, message) {
		// create a fake postMessage event and then use postMessage
		
		var domain = this.extractDomainFromURI(message.origin);
		
		if(!domain) return
		
		var event = {
			data:   message.text,
			domain: domain
		};
		
		this.handlePostMessage(event)
	},
	
	/*
	 * Handle a message send via window.postMessage() 
	 */
	handlePostMessage: function (event) {
		
		var data   = this.parse(event.data);
		
		var domain;
		if(event.origin) {
			domain = this.extractDomainFromURI(event.origin);
		}
		else if(event.domain) {
			domain = event.domain
		}
		
		if(!domain) return
		
		data.from = domain
		
		this.execute(data, true)
		
	},

	// private
	/*
	 * Executes a method.
	 * Throws an error if the security token provided by the message is wrong or if
	 * the callback name is unknown.
	 * Throws an error if the method name is unknown.
	 */
	execute: function (data, viaPostMessage) {
		if(data == null) {
			return
		}
		
		if(!this.authorizeCall(data, viaPostMessage)) {
			// do nothing
			return
		}
		
		var name  = data.name;
		var paras = data.paras;
		var from  = data.from;
		
		// check whether $name is really a registered function and not something that leaked into this.callbacks through prototype extension
		var found = false;
		for(var i = 0; i < this.callbackNames.length; i++) {
			if(this.callbackNames[i] == name) {
				found = true;
				break;
			} 
		}
		if(!found) {
			if(this.methodNotFoundCallback) {
				this.methodNotFoundCallback(name, from)
				return
			}
			throw("XSSInterface Error: unknown remote method ["+name+"] called by "+from)
		}
		
		// Get the actual function
		var func  = this.callbacks[name];
		

		var call_info = {
			name:   name,
			paras:  paras,
			from:   from
		};

		if(func != null) {
			// call the method. The methods receives the trasmitted paras as regular parameters
			// the method's this variable contains the call_info object
			func.apply(call_info, paras)
		}

	},
	// private
	/*
	 * checks whether this call is authorized
	 * Throws an error if the security token provided by the message is wrong or if
	 * the callback name is unknown.
	 */
	authorizeCall: function (data, viaPostMessage) {
		if(viaPostMessage) {
			for(var i = 0; i < this.allowedDomains.length; i++) {
				if(this.allowedDomains[i] == data.from) {
					return true
				}
			}
			if(this.blockedMessageCallback) {
				// Optional callback (Mostly for testing of errors)
				this.blockedMessageCallback(data.name, data.from)
			}
			XSSdebug("Bocked message from "+data.from)
			return false
		} else {
			
 			if(data.token != this.securityToken) {
 				if(this.blockedMessageCallback) {
 					// Optional callback (Mostly for testing of errors)
					this.blockedMessageCallback(data.name, "unknown",data.token)
				}
				XSSdebug("Bocked message with wrong token "+data.token)
				return false
			}
			return true
		}
		
	}
};



/*
 * Class for performing cross domain javascript function calls.
 * 
 * @param targetDomain is the hostname to which call should be send.
 * @param pathToCookieSetterHTMLFile must be a path residing on targetDomain to the cookie_setter.html file that is provided by this library
 *  "http://" + targetDomain + pathToCookieSetterHTMLFile
 * @param channelId is an identifier that groups listeners and callers. If you have multiple iframes, create one channel for each of them.
 * @param win is the window or iframe to which calls are performed
 */
XSSInterface.Caller = function (targetDomain, pathToCookieSetterHTMLFile, channelId, win) {
	this.domain                     = targetDomain;
	this.pathToCookieSetterHTMLFile = pathToCookieSetterHTMLFile
	
	this.cookie                     = new XSSInterface.Cookie(XSSInterfaceCookieName)
	
	this.win                        = win;
	
	this.scheduledCalls             = [];
	this.lastCallTime               = 0;
	
	if(this.win == null) {
		this.win = window.frames[channelId]
	}
	
	this.channelId  = channelId;
	if(this.channelId == null) {
		this.channelId = ""
	}
	
	if(!this.canPostMessage() && !this.canGearsMessage()) {
		var me = this;
		setInterval(function () { me.callByCookie() }, XSSInterfacePollIntervalMilliSeconds * 20)
	}
}

XSSInterface.Caller.prototype = {
	
	/*
	 * Call a method called name on the target domain.
	 * @param name Name of the method
	 * All extra parameters to will be forwarded to the remote method.
	 */
	call: function (name) {
		
		var args = [];
		for(var i = 1; i < arguments.length; i++) { // copy arguments, leave out first, because it is the function name
			XSSdebug("Arg: "+arguments[i])
			args.push(arguments[i]);
		}
		
		var data = {
			name:  name,
			paras: args,
			from:  document.location.hostname
		};
		
		
		this.save(data)
	},

	// private
	/*
	 * Save a message cookie under the dall target domain
	 */
    save: function(data) {
    
    	
    
    	if(this.canPostMessage()) {
    		var message = this.serialize(data);
    		this.postMessage(this.win, message)
    	} 
    	else if(this.canGearsMessage()) {
    		var message = this.serialize(data);
    		this.sendGearsMessage(message)
    	}
    	else {
    		this.scheduledCalls.push(data);
    		//this.callByCookie();
    	}
	},
	
	callByCookie: function () {
		
		if(this.scheduledCalls.length == 0) return
		
		var minCallInterval = XSSInterfacePollIntervalMilliSeconds;
		
		var now             = new Date().getTime();
		
		if(now - this.lastCallTime > minCallInterval) {
			this.lastCallTime   = now;
			var calls           = this.scheduledCalls;
			this.scheduledCalls = [];
			
			var token = this.securityTokenToTargetDomain()
			
			var data  = {
				token: token,
				calls: []
			};
			
			var message;
			
			for(var i = 0; i < calls.length; i++) {
				var c = calls.shift();
				data.calls.push(c)
				var m = this.serialize(data);
				if(escape(m).length > XSSMaximumQueryStringLength) {
					if(i == 0) {
						throw("Unable to call message. Exceeded length limit. Consider reducing parameters.")
					}
					// just use the last message
					calls.unshift(c)
					break;	
				}
				message = m
			}
			
			this.scheduledCalls = calls
			
			var url     = 'http://'+this.domain+this.pathToCookieSetterHTMLFile
			this.cookie.setCrossDomain(url, "data", message, this.channelId)
		}
	},
	
	// private
	/* 
	 * Cross Browser postMessage()
	 */
	postMessage: function (win, message) {
		
		var targetOrigin = "http://"+this.domain // XXX extend api to specify scheme and port
		
		if(window.postMessage) { // HTML 5 Standard
			return win.postMessage(message, targetOrigin)
		}
		if(window.document && window.document.postMessage) { // Opera 9
			return win.document.postMessage(message, targetOrigin)
		}
	},
	/*
	 * Queue a message in the callers Gears message queue
	 */
	sendGearsMessage: function(message) {
		var db = google.gears.factory.create('beta.database');
		db.open('database-xssinterface');
		db.execute('create table if not exists XSSMessageQueue' +
           ' (id INTEGER PRIMARY KEY AUTOINCREMENT, recipient_domain TEXT, channel_id TEXT, message TEXT, insert_time INTEGER)');
           
        db.execute('insert into XSSMessageQueue (recipient_domain,channel_id,message,insert_time)  values (?,?,?,?)', [this.domain, this.channelId, message, new Date().getTime()]);
	},

	// private
	/*
	 * Turn the message data into JSON
	 */
	serialize: function (data) {
    	var str = JSON.stringify(data);
    	return str
    },
	
	// private
	/*
	 * Retrieves the security token that grants access to the call target domain
	 */
	securityTokenToTargetDomain: function () {
	
		if(this.canPostMessage()) {
			return "postMessage"
		}
	
		var name = XSSInterfaceSecurityTokenCookieName+this.domain
		return this.cookie.get(name)
	},
	
	canPostMessage:	 XSSInterface.canPostMessage,
	canGearsMessage: XSSInterface.canGearsMessage

};


/*
 * Cookie handling routines
 */
XSSInterface.Cookie = function () {
	this.doc  = document;
};


XSSInterface.Cookie.prototype = {

	/*
	 * Retrieve a cookie called $name
	 */
	// Extremely ugly code that seems to work follows. a more robust replacement is more that welcome
	get:	function (name) {
		
		XSSdebug("Trying read "+name)
		
        var dc   = this.doc.cookie;

        var prefix = name + "=";
        var begin  = dc.indexOf("; " + prefix);
        if (begin == -1) {
                begin = dc.indexOf(prefix);
                if (begin != 0) return ""; // Wenn der Name (Prefix) ohne vorgestelltes ; nicht am Zeilenanfang steht, dann ist er Teil eines anderen Cookies und somit nicht was wir suchen.
        } else {
                begin += 2 // Plus 2 damit der Index nicht mehr auf dem ; steht
        }
        var end = this.doc.cookie.indexOf(";", begin);
        if (end == -1) { // Wenn kein ; vorhanden ist, dann handelt es sich um den letzten Wert im Cookie-String. Somit ist das Ende des Cookie-Strings auch gleich das ende des gesuchten Wertes.
                end = dc.length;
        }
        var value = unescape(dc.substring(begin + prefix.length, end)); // Der Wert des gesuchten Cooki wird als Teilstring aus dem gesamten Cookie-Strings extrahiert.

        if(value == ";") { // bug with IE
                return ""
        }
        
        XSSdebug("Reading cookie "+ value)

        return value;
	},
	
	/*
	 * Set a cookie with name and value
	 * expires must be a Date-Object
	 */
	set:	function(name, value, expires, secure) {

		XSSdebug("Setting cookie "+name+"="+value)

		var cookie = name + "=" + escape(value) +
        	( ( expires ) ? "; expires=" + expires.toGMTString() : "" ) + 
        	//((path) ? "; path=" + path : "") +
        	"; path=/" + 
        	((secure) ? "; secure" : "");

    	this.doc.cookie = cookie; 
        
        var newval = this.get(name)
        if(newval != value) {
        	XSSdebug("Failed Setting cookie " +name+" "+value+"->"+newval)
        }
        
	},
	
	/*
	 * Set a cookie in a different domain
	 * The cookie will be readable by domain of url
	 * url must point to a cookie_setter.html file that is provided by this library.
	 * The parameters that are appended to the url will be picked up by XSSInterface.Cookie.setFromLocation()
	 */
	setCrossDomain: function (url, key, value,channelId) { // key may have the values data or token
	
		var from = this.doc.location.hostname;
		
		var src = "" + url + '?from='+escape(from)+'&'+key+'='+escape(value)+'&channelId='+escape(channelId)
		
		var html = '<iframe src="'+src+'" width=1 height=1 frameborder="0" border="0"></iframe>'
		
		//if(!this.iframeContainer) {
			var span   = this.doc.createElement("span");
			this.doc.body.appendChild(span);
			this.iframeContainer = span
		//}
		
		this.iframeContainer.innerHTML = html
	}

}

XSSInterface.Query = function () {
	this.queryString = window.location.search;
	this.query       = this.parse();
}

XSSInterface.Query.prototype = {
	
	asHash: function () {
		return this.query;
	},
	
	param: function (name) {
		return this.query[name]
	},
	
	parse: function () {
		var search = this.queryString;
		var parts  = search.split("?");
		var search = parts[1];

		if(search == null) {
			search = "";
		}
	
		parts      = search.split("&");
	
		var query  = {};
	
		for(var i = 0; i < parts.length; i++) {
			var pair = parts[i].split("=");
			query[unescape(pair[0])] = unescape(pair[1])
		}
		
		return query;
	}
}


/*
 * Used in cookie_setter.html to set a cookie based on parameters given to the file via the query_string
 * For security reasons the caller cannot determine the cookie name
 */
XSSInterface.Cookie.setFromLocation = function () {

	var query  = new XSSInterface.Query().asHash();
	
	var cookie = new XSSInterface.Cookie()
    
    if(query.data) {
    	var expiration = new Date();
		expiration.setTime(expiration.getTime() + 4000);
		
		var name = XSSInterfaceCookieName + query.channelId
		
    	cookie.set(name, query.data, expiration)
    }
    
    if(query.token && query.from) {
    	var name = XSSInterfaceSecurityTokenCookieName + query.from
    	cookie.set(name, query.token)
    }

	
}
/*
 * Print debug information if in debug mode.
 * if document.getElementById("log") returns something, the output will be send there.
 */
XSSdebug = function (txt) {
	
	if(!XSSInterfaceDebug) return;
	
	var message = window.location.hostname + ": "+txt;
	
	var log     = document.getElementById("log");
	
	if(log) {
		var html = message+"<br>"+log.innerHTML;
		
		log.innerHTML= html.substring(0,1000)
	} else {
		alert(message)
	}
}



// Copyright 2007, Google Inc.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//  3. Neither the name of Google Inc. nor the names of its contributors may be
//     used to endorse or promote products derived from this software without
//     specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Sets up google.gears.*, which is *the only* supported way to access Gears.
//
// Circumvent this file at your own risk!
//
// In the future, Gears may automatically define google.gears.* without this
// file. Gears may use these objects to transparently fix bugs and compatibility
// issues. Applications that use the code below will continue to work seamlessly
// when that happens.

// Sorry Google for modifying this :) 
function XSSInterfaceInitializeGears() {
  // We are already defined. Hooray!
  if (window.google && google.gears) {
    return;
  }

  var factory = null;

  // Firefox
  if (typeof GearsFactory != 'undefined') {
    factory = new GearsFactory();
  } else {
    // IE
    try {
      factory = new ActiveXObject('Gears.Factory');
      // privateSetGlobalObject is only required and supported on WinCE.
      if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
        factory.privateSetGlobalObject(this);
      }
    } catch (e) {
      // Safari
      if (navigator.mimeTypes["application/x-googlegears"]) {
        factory = document.createElement("object");
        factory.style.display = "none";
        factory.width = 0;
        factory.height = 0;
        factory.type = "application/x-googlegears";
        document.documentElement.appendChild(factory);
      }
    }
  }

  // *Do not* define any objects if Gears is not installed. This mimics the
  // behavior of Gears defining the objects in the future.
  if (!factory) {
    return;
  }

  // Now set up the objects, being careful not to overwrite anything.
  //
  // Note: In Internet Explorer for Windows Mobile, you can't add properties to
  // the window object. However, global objects are automatically added as
  // properties of the window object in all browsers.
  if (!window.google) {
    google = {};
  }

  if (!google.gears) {
    google.gears = {factory: factory};
  }
}

