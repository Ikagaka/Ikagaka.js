/*!mm={version:"",license:"MIT",author:"uupaa.js@gmail.com",date:"2012-10-08T14:20:21",tool:"google",target:"",cutoff:"assert/debug/spec/interface/ie/gecko/opera"}*/
(function(global) {
function _polyfill() {
	if (!Object.keys) {
		 Object.keys = Object_keys;
	}
	if (!Object.defineProperties) {
		 Object.defineProperty =
				Object_defineProperty;
	}
	if (Date.prototype.toJSON && (new Date).toJSON().length < 24) {
		Date.prototype.toJSON = Date_toJSON;
	}
	wiz(Date, {
		now:        Date_now
	});
	wiz(Date.prototype, {
		toJSON:     Date_toJSON
	});
	wiz(Array, {
		of:         Array_of,
		from:       Array_from,
		isArray:    Array_isArray
	});
	wiz(Array.prototype, {
		some:       Array_some,
		every:      Array_every,
		indexOf:    Array_indexOf,
		lastIndexOf:Array_lastIndexOf,
		filter:     Array_filter,
		map:        Array_map,
		forEach:    Array_forEach,
		reduce:     Array_reduce,
		reduceRight:Array_reduceRight
	});
	wiz(String.prototype, {
		trim:       String_trim,
		repeat:     String_repeat,
		reverse:    String_reverse
	});
	wiz(Number, {
		isNaN:      function(mix) { return typeof mix === "number" && global.isNaN(mix); },
		isFinite:   function(mix) { return typeof mix === "number" && global.isFinite(mix); },
		isInteger:  Number_isInteger,
		toInteger:  Number_toInteger
	});
	wiz(Function.prototype, {
		bind:       Function_bind
	});
	global.JSON || (global.JSON = {
		parse:          JSON_parse,
		stringify:      JSON_stringify
	});
	if (!global.encodeURIComponent) {
		 global.encodeURIComponent = global_encodeURIComponent;
	}
	if (!global.decodeURIComponent) {
		 global.decodeURIComponent = global_decodeURIComponent;
	}
}
var _INTEGER_TO_HEXSTRING_MAP;
function Object_keys(obj) {
	var rv = [], key, i = 0;
	{
		for (key in obj) {
			obj.hasOwnProperty(key) && (rv[i++] = key);
		}
	}
	return rv;
}
function Object_defineProperty(obj, prop, descriptor) {
	var type = 0;
	"value" in descriptor && (type |= 0x1);
	"get"   in descriptor && (type |= 0x2);
	"set"   in descriptor && (type |= 0x4);
	if (type & 0x1 && type & 0x6) {
		throw new TypeError("BAD_ARG");
	}
	type & 0x1 && (obj[prop] = descriptor.value);
	type & 0x2 && obj.__defineGetter__(prop, descriptor.get);
	type & 0x4 && obj.__defineSetter__(prop, descriptor.set);
}
function Date_now() {
	return +new Date();
}
function Array_isArray(mix) {
	return Object.prototype.toString.call(mix) === "[object Array]";
}
function Array_map(fn, that) {
	var i = 0, iz = this.length, rv = Array(iz);
	for (; i < iz; ++i) {
		if (i in this) {
			rv[i] = fn.call(that, this[i], i, this);
		}
	}
	return rv;
}
function Array_some(fn, that) {
	var i = 0, iz = this.length;
	for (; i < iz; ++i) {
		if (i in this && fn.call(that, this[i], i, this)) {
			return true;
		}
	}
	return false;
}
function Array_every(fn, that) {
	var i = 0, iz = this.length;
	for (; i < iz; ++i) {
		if (i in this && !fn.call(that, this[i], i, this)) {
			return false;
		}
	}
	return true;
}
function Array_filter(fn, that) {
	var rv = [], value, i = 0, iz = this.length;
	for (; i < iz; ++i) {
		if (i in this) {
			value = this[i];
			if (fn.call(that, value, i, this)) {
				rv.push(value);
			}
		}
	}
	return rv;
}
function Array_reduce(fn, init, __back__) {
	var rv,
		ate  = 0,
		back = !!__back__,
		i    = back ? --iz : 0,
		iz   = this.length;
	if (init !== void 0) {
		rv = init;
		++ate;
	}
	for (; back ? i >= 0 : i < iz; back ? --i : ++i) {
		if (i in this) {
			if (ate) {
				rv = fn(rv, this[i], i, this);
			} else {
				rv = this[i];
				++ate;
			}
		}
	}
	if (!ate) {
		throw new Error("BAD_ARG");
	}
	return rv;
}
function Array_reduceRight(fn, init) {
	return Array_reduce.call(this, fn, init, true);
}
function Array_indexOf(mix, index) {
	var i = index || 0, iz = this.length;
	i = (i < 0) ? i + iz : i;
	for (; i < iz; ++i) {
		if (i in this && this[i] === mix) {
			return i;
		}
	}
	return -1;
}
function Array_lastIndexOf(mix, index) {
	var i = index, iz = this.length;
	i = (i < 0) ? i + iz + 1 : iz;
	while (--i >= 0) {
		if (i in this && this[i] === mix) {
			return i;
		}
	}
	return -1;
}
function Array_forEach(fn, that) {
	var i = 0, iz = this.length;
	for (; i < iz; ++i) {
		i in this && fn.call(that, this[i], i, this);
	}
}
function String_trim() {
	return this.replace(/^\s+/, "").
				replace(/\s+$/, "");
}
function Array_of(ooo) {
	return Array.prototype.slice.call(arguments);
}
function Array_from(fakeArray) {
	var rv = [], i = 0, iz = fakeArray.length;
	for (; i < iz; ++i) {
		rv.push(fakeArray[i]);
	}
	return rv;
}
function Date_toJSON() {
	var dates = { y:  this.getUTCFullYear(),
				 m:  this.getUTCMonth() + 1,
				 d:  this.getUTCDate() },
		times = { h:  this.getUTCHours(),
				 m:  this.getUTCMinutes(),
				 s:  this.getUTCSeconds(),
				 ms: this.getUTCMilliseconds() };
	return dates.y + "-" + (dates.m < 10 ? "0" : "") + dates.m + "-" +
						 (dates.d < 10 ? "0" : "") + dates.d + "T" +
						 (times.h < 10 ? "0" : "") + times.h + ":" +
						 (times.m < 10 ? "0" : "") + times.m + ":" +
						 (times.s < 10 ? "0" : "") + times.s + "." +
						 ("00" + times.ms).slice(-3) + "Z";
}
function Number_isInteger(mix) {
	return typeof mix === "number" && global.isFinite(mix) &&
				 mix > -0x20000000000000 &&
				 mix <  0x20000000000000 &&
				 Math.floor(mix) === mix;
}
function Number_toInteger(mix) {
	var num = +mix;
	if (num !== num) {
		return +0;
	}
	if (num === 0 || !global.isFinite(num)) {
		return num;
	}
	return (num < 0 ? -1 : 1) * Math.floor(Math.abs(num));
}
function String_repeat(count) {
	return (this.length && count > 0) ? Array((count + 1) | 0).join(this)
									 : "";
}
function String_reverse() {
	return this.split("").reverse().join("");
}
function Function_bind(context, ooo) {
	var rv, that = this,
		args = Array.prototype.slice.call(arguments, 1),
		fn = function() {};
	rv = function(ooo) {
		return that.apply(this instanceof fn ? this : context,
					Array.prototype.concat.call(
							args,
							Array.prototype.slice.call(arguments)));
	};
	fn.prototype = that.prototype;
	rv.prototype = new fn();
	return rv;
}
function JSON_parse(str) {
	var unescaped = str.trim().replace(/"(\\.|[^"\\])*"/g, "");
	if (/[^,:{}\[\]0-9\.\-+Eaeflnr-u \n\r\t]/.test(unescaped)) {
		throw new SyntaxError("Unexpected token:" + str);
	}
	return (new Function("return " + str))();
}
function JSON_stringify(obj) {
	return _recursiveJSONStringify(obj, 0);
}
function _recursiveJSONStringify(mix, nest) {
	var rv = [], ary, key, i, iz,
		type = typeof mix,
		brackets = ["{", "}"];
	if (nest >= 100) {
		throw new TypeError("Converting circular structure to JSON");
	}
	if (mix == null) {
		return mix + "";
	}
	if (mix.toJSON) {
		return mix.toJSON();
	}
	if (type === "boolean" || type === "number") {
		return "" + mix;
	}
	if (type === "string") {
		return '"' + _toJSONEscapedString(mix) + '"';
	}
	if (mix.nodeType || (mix.exec && mix.test)) {
		return "{}";
	}
	if (Array.isArray(mix)) {
		brackets = ["[", "]"];
		for (i = 0, iz = mix.length; i < iz; ++i) {
			rv.push(_recursiveJSONStringify(mix[i], nest + 1));
		}
	} else {
		ary = Object.keys(mix);
		for (i = 0, iz = ary.length; i < iz; ++i) {
			key = ary[i];
			rv.push('"' + _toJSONEscapedString(key) + '":' +
						 _recursiveJSONStringify(mix[key], nest + 1));
		}
	}
	return brackets[0] + rv.join(",") + brackets[1];
}
function _toJSONEscapedString(str) {
	var JSON_ESCAPE = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"':  '\\"',
			'\\': '\\\\'
		};
	return str.replace(/(?:[\b\t\n\f\r\"]|\\)/g, function(_) {
				return JSON_ESCAPE[_];
			}).replace(/(?:[\x00-\x1f])/g, function(_) {
				return "\\u00" +
					 ("0" + _.charCodeAt(0).toString(16)).slice(-2);
			});
}
function global_encodeURIComponent(str) {
	var rv = [], i = 0, iz = str.length, c = 0, safe, map;
	map = _INTEGER_TO_HEXSTRING_MAP || _createMap();
	for (; i < iz; ++i) {
		c = str.charCodeAt(i);
		if (c < 0x80) {
			safe = c === 95 ||
				 (c >= 48 && c <=  57) ||
				 (c >= 65 && c <=  90) ||
				 (c >= 97 && c <= 122);
			if (!safe) {
				safe = c === 33  ||
					 c === 45  ||
					 c === 46  ||
					 c === 126 ||
					 (c >= 39 && c <= 42);
			}
			if (safe) {
				rv.push(str.charAt(i));
			} else {
				rv.push("%", map[c]);
			}
		} else if (c < 0x0800) {
			rv.push("%", map[((c >>>  6) & 0x1f) | 0xc0],
					"%", map[ (c         & 0x3f) | 0x80]);
		} else if (c < 0x10000) {
			rv.push("%", map[((c >>> 12) & 0x0f) | 0xe0],
					"%", map[((c >>>  6) & 0x3f) | 0x80],
					"%", map[ (c         & 0x3f) | 0x80]);
		}
	}
	return rv.join("");
	function _createMap() {
		var i = 0x100, iz = 0x200;
		_INTEGER_TO_HEXSTRING_MAP = {};
		for (; i < iz; ++i) {
			_INTEGER_TO_HEXSTRING_MAP[i - 0x100] = i.toString(16).slice(-2);
		}
		return _INTEGER_TO_HEXSTRING_MAP;
	}
}
function global_decodeURIComponent(str) {
	return str.replace(/(%[\da-f][\da-f])+/g, function(match) {
		var rv = [],
			ary = match.split("%").slice(1), i = 0, iz = ary.length,
			a, b, c;
		for (; i < iz; ++i) {
			a = parseInt(ary[i], 16);
			if (a !== a) {
				throw new Error("BAD_ARG");
			}
			if (a < 0x80) {
				rv.push(a);
			} else if (a < 0xE0) {
				b = parseInt(ary[++i], 16);
				rv.push((a & 0x1f) <<  6 | (b & 0x3f));
			} else if (a < 0xF0) {
				b = parseInt(ary[++i], 16);
				c = parseInt(ary[++i], 16);
				rv.push((a & 0x0f) << 12 | (b & 0x3f) << 6
										 | (c & 0x3f));
			}
		}
		return String.fromCharCode.apply(null, rv);
	});
}
function wiz(object, extend) {
	var key, keys = Object.keys(extend), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		if (!(key in object)) {
			Object.defineProperty(object, key, {
				configurable: true,
				enumerable: false,
				writable: true,
				value: extend[key]
			});
		}
	}
}
_polyfill();
})(this.self || global);
var mm;
mm || (function(global) {
function _defineLibraryAPIs(mix) {
	mm = mix(HashFactory, {
		Interface:  Interface,
		Class:      ClassFactory,
		Hash:       Hash,
		Await:      Await,
		arg:        mm_arg,
		mix:        mm_mix,
		wiz:        mm_wiz,
		has:        mm_has,
		like:       mm_like,
		some:       mm_some,
		every:      mm_every,
		match:      mm_match,
		map:        mm_map,
		each:       mm_each,
		uid:        mm_uid,
		copy:       mm_copy,
		cast:   mix(mm_cast, {
			attr:   mm_cast_attr,
			list:   mm_cast_list,
			style:  mm_cast_style
		}),
		pair:       mm_pair,
		wrap:       mm_wrap,
		clean:      mm_clean,
		count:      mm_count,
		pick:       mm_pick,
		keys:       mm_keys,
		values:     mm_values,
		clear:      mm_clear,
		nop:        mm_nop,
		dump:       mm_dump,
		codec:  mix(mm_codec, {
			INTEGER_TO_HEXSTRING:   1,
			HEXSTRING_TO_INTEGER:   2,
			INTEGER_TO_BYTESTRING:  3,
			BYTESTRING_TO_INTEGER:  4
		}),
		strict:     mm_wrap(!this)(),
		say:        mm_say,
		deny:       mm_deny,
		allow:      mm_allow,
		pollution:  mm_pollution,
		type:   mix(mm_type, {
			alias:  mm_type_alias
		}),
		complex:    mm_complex,
		Msg:        Msg,
		imsg: {},
		log:    mix(mm_log, {
			copy:   mm_log_copy,
			dump:   mm_log_dump,
			warn:   mm_log_warn,
			error:  mm_log_error,
			clear:  mm_log_clear,
			limit: 0
		}),
		logg:   mix(mm_logg, {
			nest: 0
		})
	});
	mm.env = _detectEnv({
		lang:       "en",
		node:       global.require &&
					global.process,
		ie:         !!document.uniqueID,
		ie8: false,
		ie9: false,
		ie10: false,
		ios: false,
		ipad: false,
		gecko:      !!global.netscape,
		opera:      !!global.opera,
		chrome: false,
		webkit: false,
		safari: false,
		retina: false,
		secure: false,
		android: false
	});
}
function Hash(obj) {
	this._ = obj;
}
Hash.unpack = Hash_unpack;
function _defineHashPrototype(wiz) {
	wiz(Hash.prototype, {
		__CLASS__: "Hash",
		mix:        function(extend, override) {
									 mm_mix(this._, extend.valueOf(), override);
									 return this; },
		has:        function(find)  { return Object_has(this._, find.valueOf()); },
		like:       function(value) { return Object_like(this._, value.valueOf()); },
		some:       function(fn)    { return Object_some(this._, fn); },
		every:      function(fn)    { return Object_every(this._, fn); },
		match:      function(fn)    { return Object_match(this._, fn); },
		map:        function(fn)    { return Object_map(this._, fn); },
		each:       function(fn)    {        Object_each(this._, fn); },
		copy:       function()      { return new Hash(mm_copy(this._)); },
		cast:       function()      { return this._; },
		pack:       Hash_pack,
		clean:      Hash_clean,
		count:      function()      { return Object_count(this._); },
		pick:       function(names) { return Object_pick(this._, names); },
		keys:       function()      { return Object.keys(this._); },
		values:     function()      { return Object_values(this._); },
		clear:      function()      { this._ = {}; return this; },
		help:       function()      { return Function_help(Hash); },
		dump:       function()      { return mm_dump.callby(null, this._, arguments); },
		toJSON:     function()      { return global.JSON.stringify.callby(null, this._, arguments); },
		valueOf:    function()      { return this._; },
		toString:   function()      { return mm_dump(this._, -1, 100); }
	}, true);
}
function _extendNativeObjects(mix, wiz) {
	wiz(Function.prototype, { __CLASS__: "function",typeFunction: true },
		 Boolean.prototype, { __CLASS__: "boolean", typeBoolean: true },
		 String.prototype, { __CLASS__: "string",  typeString: true },
		 Number.prototype, { __CLASS__: "number",  typeNumber: true },
		 RegExp.prototype, { __CLASS__: "regexp",  typeRegExp: true },
		 Array.prototype, { __CLASS__: "array",   typeArray: true },
			Date.prototype, { __CLASS__: "date",    typeDate: true });
	wiz(Date, {
		from:       Date_from
	});
	wiz(Date.prototype, {
		diff:       Date_diff,
		dates:      Date_dates,
		times:      Date_times,
		format:     Date_format
	});
	wiz(Array, {
		range:      Array_range,
		toArray:    Array_toArray,
		isCodedArray:Array_isCodedArray
	});
	wiz(Array.prototype, {
		has:        Array_has,
		chain:      Array_chain,
		match:      Array_match,
		at:         Array_at,
		sieve:      Array_sieve,
		unique:     Array_unique,
		reject:     Array_reject,
		select:     Array_select,
		flatten:    Array_flatten,
		each:       Array.prototype.forEach,
		copy:       Array_copy,
		clean:      Array_clean,
/*
		toArray:    function() { return this; },
 */
		decode:     Array_decode,
		or:         Array_or,
		and:        Array_and,
		xor:        Array_xor,
		sum:        Array_sum,
		clamp:      Array_clamp,
		nsort:      Array_nsort,
		average:    Array_average,
		count:      Array_count,
		fill:       Array_fill,
		clear:      Array_clear,
		remove:     function(find, all) { return this.replace(find, null, all); },
		shifts:     Array_shifts,
		replace:    Array_replace,
		dump:       Array_dump,
		choice:     Array_choice,
		stream:     Array_stream,
		shuffle:    Array_shuffle,
		test:   mix(Array_test, {
			tick:   null
		})
	});
	wiz(String.prototype, {
		has:        String_has,
		isURL:      String_isURL,
		at:         String_at,
		up:         String_up,
		low:        String_low,
		down:       String_low,
		trims:      String_trims,
		trimTag:    String_trimTag,
		trimQuote:  String_trimQuote,
		format:     String_format,
		overflow:   String_overflow,
		unique:     String_unique,
		code:       String_code,
		unpack:     String_unpack,
		numbers:    String_numbers,
		count:      String_count,
		insert:     String_insert,
		remove:     String_remove,
		stream:     String_stream
	});
	wiz(Number.prototype, {
		pad:        Number_pad,
		to:         Number_to,
		xor:        Number_xor,
		rand:       Number_rand,
		clamp:      Number_clamp,
		toRadians:  Number_toRadians,
		toDegrees:  Number_toDegrees,
		chr:        Number_chr,
		wait:       Number_wait,
		times:      Number_times
	});
	wiz(Function.prototype, {
		help:   mix(Function_help, {
			add:    Function_help_add
		}),
		callby:     Function_callby,
		nickname:   Function_nickname,
		await:      Function_await
	});
	wiz(RegExp, {
		esc:        RegExp_esc,
		FILE:       /^(file:)\/{2,3}(?:loc\w+)?([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?$/i,
		URL:        /^(\w+:)\/\/((?:([\w:]+)@)?([^\/:]+)(?::(\d*))?)([^ :?#]*)(?:(\?[^#]*))?(?:(#.*))?$/,
		PATH:       /^([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?$/
	});
	wiz(RegExp.prototype, {
		flag:       RegExp_flag
	});
}
function Msg() {
	this._deliverable = {};
	this._broadcast   = [];
	Object.defineProperty(this, "__CLASS__",     { value: "Msg" });
	Object.defineProperty(this, "__CLASS_UID__", { value: mm_uid("class") });
}
Msg.prototype = {
	__CLASS__:     "Msg",
	bind:           Msg_bind,
	unbind:         Msg_unbind,
	list:           Msg_list,
	to:             Msg_to,
	post:           Msg_post,
	send:           Msg_send
};
function Await(fn, waits, tick) {
	this._db = {
		missables: 0,
		waits: waits,
		pass: 0,
		miss: 0,
		state: 100,
		args:  [],
		tick:  tick || null,
		fn:    fn
	};
	Object.defineProperty(this, "__CLASS__",     { value: "Await" });
	Object.defineProperty(this, "__CLASS_UID__", { value: mm_uid("class") });
}
Await.prototype = {
	missable:       Await_missable,
	pass:           Await_pass,
	miss:           Await_miss,
	state:          Await_state
};
var _mm_uid_db = {},
	_mm_log_db = [],
	_mm_log_index = 0,
	_mm_codec_db = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, init: false },
	_mm_type_alias_db = {
		"NodeList": "list",
		"Arguments": "list",
		"NamedNodeMap": "attr",
		"HTMLCollection": "list",
		"CSSStyleDeclaration": "style"
	};
function HashFactory(obj) {
	return obj instanceof Hash ? new Hash(mm_copy(obj._))
							 : new Hash(obj);
}
function Interface(name, spec) {
	if (name in mm) {
		throw new TypeError("ALREADY_EXISTS: " + name);
	}
	mm.Interface[name] = spec;
}
function ClassFactory(classNames, properties, statics) {
	properties = properties || {};
	var InheritBaseClass,
		spec = _parseClassSpec(classNames);
	if (mm.Class[spec.klass]) {
		return mm.Class[spec.klass];
	}
	mm.Class[spec.klass] = spec.klass;
	mm[spec.klass] = spec.traits.has("Singleton") ? SingletonClass
												 : GenericClass;
	if (spec.base) {
		InheritBaseClass = function() {};
		InheritBaseClass.prototype = mm[spec.base].prototype;
		mm[spec.klass].prototype = new InheritBaseClass();
		mm_mix(mm[spec.klass].prototype, properties, true);
		mm[spec.klass].prototype.constructor = mm[spec.klass];
		mm[spec.klass].prototype.__BASE__ = mm_mix({}, mm[spec.base].prototype);
	} else {
		mm_mix(mm[spec.klass].prototype, properties);
		mm[spec.klass].prototype.__BASE__ = null;
	}
	mm[spec.klass].prototype.callSuper = _callSuperMethod;
	statics && mm_mix(mm[spec.klass], statics);
	if (spec.traits.has("Singleton") && !spec.traits.has("SelfInit")) {
		mm["i" + spec.klass] = new mm[spec.klass];
	}
	return mm[spec.klass];
	function SingletonClass(ooo) {
		if (!SingletonClass.__INSTANCE__) {
			 SingletonClass.__INSTANCE__ = this;
			_factory(this, arguments);
		}
		return SingletonClass.__INSTANCE__;
	}
	function GenericClass(ooo) {
		_factory(this, arguments);
	}
	function _factory(that, args) {
		Object.defineProperty(that, "__CLASS__",     { value: spec.klass });
		Object.defineProperty(that, "__CLASS_UID__", { value: mm_uid("class") });
		var obj = that, stack = [];
		while (obj = obj.__BASE__) {
			obj.init && stack.push(obj);
		}
		while (obj = stack.pop()) {
			obj.init.apply(that, args);
		}
		properties.init && properties.init.apply(that, args);
		that.gc = function() {
			properties.gc && properties.gc.call(that);
			obj = that;
			while (obj = obj.__BASE__) {
				obj.gc && obj.gc.call(that);
			}
			if (spec.traits.has("Singleton")) {
				delete SingletonClass.__INSTANCE__;
				delete mm["i" + spec.klass];
			}
			mm_clear(that);
			that.gc = function GCSentinel() {
				mm_log("GC_BAD_CALL");
			};
		};
	}
}
function _callSuperMethod(name, ooo) {
	var obj = this,
		args = Array.prototype.slice.call(arguments, 1);
	while (obj = obj.__BASE__) {
		if (typeof obj[name] === "function") {
			return obj[name].apply(this, args);
		}
	}
	args.unshift(name);
	return this.trap.apply(this, args);
}
function _parseClassSpec(ident) {
	var TRAITS = ["Singleton", "SelfInit"],
		ary = ident.split(":"), name,
		rv = { klass: "", traits: [], base: "", ifs: [] };
	rv.klass = ary.shift();
	if (!rv.klass) {
		throw new TypeError("CLASS_NAME_NOT_FOUND");
	}
	while (name = ary.shift()) {
		if (name in mm.Interface) {
			rv.ifs.push(name);
		} else if (TRAITS.has(name)) {
			rv.traits.push(name);
		} else if (mm.Class[name]) {
			if (rv.base) {
				throw new TypeError("CLASS_NAME_MULTIPLE_INHERITANCE: " + name);
			}
			rv.base = name;
		} else {
			throw new TypeError("TRAITS_OR_CLASS_NAME_NOT_FOUND: " + name);
		}
	}
	return rv;
}
function mm_arg(arg, defaults) {
	return arg ? mm_mix(arg, defaults) : defaults;
}
function mm_mix(base, extend, override) {
	override = override || false;
	var key, keys = Object.keys(extend), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		if (override || !(key in base)) {
			base[key] = extend[key];
		}
	}
	return base;
}
function mm_wiz(ooo) {
	var args = arguments, i = 0, iz = args.length, override = false;
	if (args.length & 0x1) {
		iz &= 0xfffe;
		override = !!(args[iz - 1]);
	}
	for (; i < iz; i += 2) {
		_extend(args[i], args[i + 1]);
	}
	function _extend(object, extend) {
		var key, keys = Object.keys(extend), i = 0, iz = keys.length;
		for (; i < iz; ++i) {
			key = keys[i];
			if (override || !(key in object)) {
				Object.defineProperty(object, key, {
					configurable: true,
					enumerable: false,
					writable: true,
					value: extend[key]
				});
			}
		}
	}
}
function mm_has(spec, find) {
	return typeof spec.has === "function" ? spec.has(find)
										 : Object_has(spec, find);
}
function mm_like(lval, rval) {
	return (lval && typeof lval.like === "function") ? lval.like(rval)
													 : Object_like(lval, rval);
}
function mm_map(data, fn) {
	return typeof data.map === "function" ? data.map(fn)
										 : Object_map(data, fn);
}
function mm_each(data, fn) {
	typeof data.each === "function" ? data.each(fn)
									: Object_each(data, fn);
}
function mm_some(data, fn) {
	return typeof data.some === "function" ? data.some(fn)
										 : Object_some(data, fn);
}
function mm_every(data, fn) {
	return typeof data.every === "function" ? data.every(fn)
											: Object_every(data, fn);
}
function mm_match(data, fn) {
	return typeof data.match === "function" ? data.match(fn)
											: Object_match(data, fn);
}
function mm_count(data) {
	return typeof data.count === "function" ? data.count()
											: Object_count(data);
}
function mm_pick(data, names) {
	return typeof data.pick === "function" ? data.pick(names)
										 : Object_pick(data, names);
}
function mm_keys(data) {
	return typeof data.keys === "function" ? data.keys()
										 : Object.keys(data);
}
function mm_values(data) {
	return typeof data.values === "function" ? data.values()
											 : Object_values(data);
}
function mm_nop() {
}
function mm_uid(group) {
	var db = _mm_uid_db;
	db[group] || (db[group] = 0);
	if (++db[group] >= 0x1fffffffffffff) {
		db[group] = 1;
	}
	return db[group];
}
function mm_cast(mix) {
	switch (mm_type(mix)) {
	case "attr":    return mm_cast_attr(mix);
	case "Hash":    return mix.valueOf();
	case "list":    return mm_cast_list(mix);
	case "style":   return mm_cast_style(mix);
	case "string":  return Date.from(mix) || mix;
	}
	return mix;
}
function mm_cast_attr(mix) {
	var rv = {}, i = 0, attr;
	for (; attr = mix[i++]; ) {
		rv[attr.name] = attr.value;
	}
	return rv;
}
function mm_cast_list(mix, from, to) {
	to = (to || 0) | 0;
	var rv = [], i = (from || 0) | 0;
	if (to <= 0) {
		to = mix.length + to;
	}
	for (; i < to; ++i) {
		rv.push(mix[i]);
	}
	return rv;
}
function mm_cast_style(mix) {
	var rv = {}, key, value, i = 0, iz = mix.length;
	if (iz) {
		for (; i < iz; ++i) {
			key = mix.item(i);
			value = mix[key];
			if (value && typeof value === "string") {
				rv[key] = value;
			}
		}
	} else {
	}
	return rv;
}
function mm_copy(mix, depth, hook) {
	return _recursiveCopy(mix, depth || 0, hook || null, 0);
}
function _recursiveCopy(mix, depth, hook, nest) {
	if (depth && nest > depth) {
		return;
	}
	var rv, keys, i = 0, iz;
	switch (mm_type(mix)) {
	case "undefined":
	case "null":    return "" + mix;
	case "boolean":
	case "string":
	case "number":  return mix.valueOf();
	case "regexp":  return RegExp(mix.source,
								 (mix + "").slice(mix.source.length + 2));
	case "Hash":    return mix.copy();
	case "date":    return new Date(+mix);
	case "array":
		for (rv = [], iz = mix.length; i < iz; ++i) {
			rv[i] = _recursiveCopy(mix[i], depth, hook, nest + 1);
		}
		return rv;
	case "object":
		for (rv = {}, keys = Object.keys(mix), iz = keys.length; i < iz; ++i) {
			rv[keys[i]] = _recursiveCopy(mix[keys[i]], depth, hook, nest + 1);
		}
		return rv;
	case "function":
		return mix;
	}
	if (hook) {
		return hook(mix);
	}
	throw new TypeError("UNKNOWN_TYPE: " + mix);
}
function mm_dump(mix, spaces, depth) {
	spaces = spaces === void 0 ? 4 : spaces;
	depth  = depth || 5;
	return _recursiveDump(mix, spaces, depth, 1);
}
function _recursiveDump(mix, spaces, depth, nest) {
	function _dumpArray(mix) {
		if (!mix.length) {
			return "[]";
		}
		var ary = [], i = 0, iz = mix.length;
		for (; i < iz; ++i) {
			ary.push(indent + _recursiveDump(mix[i], spaces, depth, nest + 1));
		}
		return "[" + lf + ary.join("," + lf) +
					 lf + " ".repeat(spaces * (nest - 1)) + "]";
	}
	function _dumpObject(mix) {
		function _getName(mix) {
			return mix.__CLASS__ ? "mm." + mix.__CLASS__ + sp
				 : mix.nickname  ? mix.nickname("") + "()" + sp : "";
		}
		var ary = [], key, minify = spaces === -1,
			keys = Object.keys(mix).sort(), i = 0, iz = keys.length,
			skip = /^__[\w]+__$/;
		if (!iz) {
			return _getName(mix) + "{}";
		}
		for (; i < iz; ++i) {
			key = keys[i];
			if (!skip.test(key)) {
				ary.push(indent + (minify ? (      key +  ':')
										 : ('"' + key + '":')) + sp +
						 _recursiveDump(mix[key], spaces, depth, nest + 1));
			}
		}
		return _getName(mix) + "{" + lf + ary.join("," + lf) +
									 lf + " ".repeat(spaces * (nest - 1)) + "}";
	}
	function _dumpNode(node) {
		var name = node.nodeName ? node.nodeName.toLowerCase() : "",
			roots = /^(?:html|head|body)$/;
		if (typeof node.path === "function") {
			return "<@@@@>".at(name, roots.test(name) ? "" : " " + node.path());
		}
		return name ? '<' + name + '>'
					: node === document ? '<document>'
										: '<node>';
	}
	if (depth && nest > depth) {
		return "...";
	}
	var lf = spaces > 0 ? "\n" : "",
		sp = spaces > 0 ? " "  : "",
		indent = " ".repeat(spaces * nest);
	switch (mm_type(mix)) {
	case "null":
	case "global":
	case "number":
	case "boolean":
	case "undefined":   return "" + mix;
	case "date":        return mix.toJSON();
	case "node":        return _dumpNode(mix);
	case "attr":        return _dumpObject(mm_cast_attr(mix));
	case "list":
	case "array":       return _dumpArray(mix);
	case "style":       return _dumpObject(mm_cast_style(mix));
	case "regexp":      return "/" + mix.source + "/";
	case "Hash":        return _dumpObject(mix.valueOf());
	case "object":
	case "function":    return _dumpObject(mix);
	case "string":      return '"' + _toJSONEscapedString(mix) + '"';
	}
	return "";
}
function _toJSONEscapedString(str) {
	var JSON_ESCAPE = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"':  '\\"',
			'\\': '\\\\'
		};
	return str.replace(/(?:[\b\t\n\f\r\"]|\\)/g, function(_) {
				return JSON_ESCAPE[_];
			}).replace(/(?:[\x00-\x1f])/g, function(_) {
				return "\\u00" +
					 ("0" + _.charCodeAt(0).toString(16)).slice(-2);
			});
}
function mm_pair(key, value) {
	if (typeof key === "number" || typeof key === "string") {
		var rv = {};
		rv[key] = value;
		return rv;
	}
	return key;
}
function mm_wrap(mix) {
	return function() {
		return mix;
	};
}
function mm_clean(data, typeofFilter) {
	return typeof data.clean === "function" ? data.clean(typeofFilter)
											: Object_clean(data, typeofFilter);
}
function mm_clear(obj) {
	var keys = Object.keys(obj), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		delete obj[keys[i]];
	}
	return obj;
}
function mm_codec(type) {
	_mm_codec_db.init || _mm_codec_init();
	return _mm_codec_db[type];
}
function _mm_codec_init() {
	var db = _mm_codec_db, i = 0, hex, bin;
	for (; i < 0x100; ++i) {
		hex = (i + 0x100).toString(16).slice(1);
		bin = String.fromCharCode(i);
		db[1][i]   = hex;
		db[2][hex] = i;
		db[3][i]   = bin;
		db[4][bin] = i;
	}
	for (i = 0x80; i < 0x100; ++i) {
		db[4][String.fromCharCode(0xf700 + i)] = i;
	}
	db.init = true;
}
function mm_say(ooo) {
	alert(mm_dump.apply(null, arguments));
}
function mm_deny(mix, judge) {
	mm_allow(mix, judge, true);
}
function mm_allow(mix, judge, __negate__) {
	__negate__ = __negate__ || false;
	var assert = false, origin = "";
	if (judge == null) {
		return;
	}
	switch (typeof judge) {
	case "function": assert = !(judge(mix) ^ __negate__); break;
	case "boolean":  assert = !(judge      ^ __negate__); break;
	case "string":   assert = !(judge.split("/").some(function(type) {
			if (mix) {
				if (type in mm.Interface) {
					origin = "interface";
					if (typeof _judgeInterface) {
						return _judgeInterface(mix, mm.Interface[type]);
					}
					return true;
				}
				if (type in mm.Class) {
					return true;
				}
			}
			return _judgeType(mix, type);
		}) ^ __negate__);
		break;
	default:
		throw new TypeError("BAD_ARG");
	}
	if (assert) {
		
		try {
			var caller = mm.strict ? null : (arguments.callee || 0).caller,
				nickname = caller ? caller.nickname() : "???",
				asserter = __negate__ ? "mm.deny" : "mm.allow";
			if (origin === "interface") {
				throw new TypeError(
						"\n\n>>> " + nickname + " in " + asserter +
						"(" + mm_dump(mix, 0) + ", " + judge + ")\n" +
						"\ninterface @@ @@\n".at(judge,
												 mm_dump(mm.Interface[judge])) );
			} else {
				throw new TypeError(
						"\n\n>>> " + nickname + " in " + asserter +
						"(" + mm_dump(mix, 0) + ", " + judge + ")\n" +
						"\nhelp: @@\n\n".at(_getHelpURL(caller)) );
			}
		} catch (o_o) {
			mm_log(mm.env.chrome ? o_o.stack.replace(/at eval [\s\S]+$/m, "")
								 : o_o + "");
			throw new TypeError("ASSERTION");
		}
	}
}
function _judgeType(mix, type) {
	type = type.toLowerCase();
	if (mix == null && type === mix + "") {
		return true;
	}
	return type === "class"     ? !!mix.__CLASS__
		 : type === "integer"   ? Number.isInteger(mix)
		 : type === "primitive" ? mix == null || typeof mix !== "object"
		 : type === "codedarray"? Array.isCodedArray(mix)
		 : type === mm_type(mix);
}
function mm_pollution() {
	if (mm_pollution._keys) {
		return mm_pollution._keys.xor( Object.keys(global) );
	}
	mm_pollution._keys = Object.keys(global);
	return [];
}
function mm_type(mix) {
	var rv, type;
	rv = mix === null   ? "null"
	 : mix === void 0 ? "undefined"
	 : mix === global ? "global"
	 : mix.nodeType   ? "node"
	 : mix.__CLASS__  ? mix.__CLASS__
	 : "";
	if (rv) {
		return rv;
	}
	type = typeof mix;
	if (type !== "object") {
		return type;
	}
	type = Object.prototype.toString.call(mix);
	if (type === "[object Object]") {
		rv = mix.constructor.name;
		if (!rv) {
			type = mix.constructor + "";
		}
	}
	if (!rv) {
		rv = ( /^\[object (\w+)\]$/.exec(type)   ||
			 /^\s*function\s+(\w+)/.exec(type) || ["", ""] )[1];
	}
	if (!rv || rv === "Object") {
		if (mix[mm.strict ? "" : "callee"] ||
			typeof mix.item === "function") {
			return "list";
		}
	}
	if (rv in _mm_type_alias_db) {
		return _mm_type_alias_db[rv];
	}
	return rv ? rv.toLowerCase() : "object";
}
function mm_type_alias(obj) {
	Object_each(obj, function(value, key) {
		_mm_type_alias_db["[object " + key + "]"] = value;
	});
}
function mm_complex(arg1, arg2) {
	return arg1 === void 0 ? 1
		 : arg2 !== void 0 ? 3
		 : arg1 && typeof arg1 === "string" ? 2 : 4;
}
function mm_log(ooo) {
	_mm_log_db.push({ type: 0, time: Date.now(),
					 msg:  [].slice.call(arguments).join(" ") });
	_mm_log_db.length > mm_log.limit && mm_log_dump();
}
function mm_log_warn(ooo) {
	_mm_log_db.push({ type: 1, time: Date.now(),
					 msg:  [].slice.call(arguments).join(" ") });
	_mm_log_db.length > mm_log.limit && mm_log_dump();
}
function mm_log_error(ooo) {
	_mm_log_db.push({ type: 2, time: Date.now(),
					 msg:  [].slice.call(arguments).join(" ") });
	_mm_log_db.length > mm_log.limit && mm_log_dump();
}
function mm_log_copy() {
	return { data: _mm_log_db.copy(), index: _mm_log_index };
}
function mm_log_dump(url) {
	function _stamp(db) {
		return new Date(db.time).format(db.type & 4 ? "[D h:m:s ms]:" : "[I]:");
	}
	var db = _mm_log_db, i = _mm_log_index, iz = db.length,
		console = global.console,
		space = mm.env.webkit ? "  " : "";
	if (!url) {
		if (console) {
			for (; i < iz; ++i) {
				switch (db[i].type) {
				case 0: console.log( space + _stamp(db[i]) + db[i].msg); break;
				case 1: console.warn(space + _stamp(db[i]) + db[i].msg); break;
				case 2: console.error(       _stamp(db[i]) + db[i].msg); break;
				case 4: console.log( space + _stamp(db[i]) + db[i].msg);
				case 6: console.error(       _stamp(db[i]) + db[i].msg); break;
				}
			}
		}
	} else if (url.indexOf("http") === 0) {
		if (global.Image) {
			for (; i < iz; ++i) {
				(new Image).src = url.at(db[i].msg);
			}
		}
	}
	_mm_log_index = i;
}
function mm_log_clear() {
	_mm_log_index = 0;
	_mm_log_db = [];
}
function mm_logg(label, mode) {
	label = label.nickname ? label.nickname() : label;
	mode  = mode || 0;
	var now = Date.now(),
		nest = mm_logg.nest++,
		line = mm.env.lang === "ja" ? ["\u2502", "\u250c", "\u2502", "\u2514"]
									: ["|",      "+-",     "| ",     "`-"    ];
	_mm_log_db.push({ type: mode, time: Date.now(), msg: _msg(1, "") });
	_logg.out   = _out;
	_logg.error = _error;
	return _logg;
	function _msg(index, msg) {
		return "@@@@ @@( @@ )".at(line[0].repeat(nest), line[index], label, msg);
	}
	function _error(ooo) {
		_mm_log_db.push({ type: mode + 2, time: Date.now(),
						 msg: _msg(2, [].slice.call(arguments).join(" ")) });
	}
	function _logg(ooo) {
		_mm_log_db.push({ type: mode, time: Date.now(),
						 msg: _msg(2, [].slice.call(arguments).join(" ")) });
	}
	function _out() {
		_mm_log_db.push({ type: mode, time: Date.now(),
						 msg: _msg(3, (new Date).diff(now)) });
		--mm_logg.nest;
		_mm_log_db.length > mm_log.limit && mm_log_dump();
	}
}
function Msg_bind(ooo) {
	Array.prototype.slice.call(arguments).forEach(function(instance) {
		if (instance &&
			instance.__CLASS_UID__ && typeof instance.msgbox === "function") {
			this._deliverable[instance.__CLASS_UID__] = instance;
		} else {
			throw new Error("NOT_DELIVERABLE");
		}
	}, this);
	this._broadcast = mm_values(this._deliverable);
	return this;
}
function Msg_unbind(ooo) {
	var args = arguments.length ? Array.prototype.slice.call(arguments)
								: this._broadcast;
	args.each(function(instance) {
		if (instance.__CLASS_UID__) {
			delete this._deliverable[instance.__CLASS_UID__];
		}
	}, this);
	this._broadcast = mm_values(this._deliverable);
	return this;
}
function Msg_list(classList) {
	return classList ? mm_pick(this._deliverable, "__CLASS__")
					 : mm_copy(this._deliverable);
}
function Msg_to(ooo) {
	var deli = {}, i;
	for (i in this._deliverable) {
		deli[i] = this._deliverable[i];
	}
	return {
		that: this,
		addr: arguments.length ? Array.prototype.slice.call(arguments)
							 : this._broadcast.concat(),
		deli: deli,
		post: Msg_post,
		send: Msg_send
	};
}
function Msg_send(msg, ooo) {
	var rv = [], instance,
		addr = (this.addr || this._broadcast).concat(), i = 0, iz = addr.length,
		args = Array.prototype.slice.call(arguments),
		deli = this.deli || this._deliverable;
	for (; i < iz; ++i) {
		instance = deli[ addr[i].__CLASS_UID__ ];
		if (instance && instance.msgbox) {
			rv[i] = instance.msgbox.apply(instance, args);
		} else {
			rv[i] = "NOT_DELIVERABLE";
			if (instance) {
				mm_log(msg + " is not deliverable. " + instance.__CLASS__);
			}
		}
	}
	return rv;
}
function Msg_post(msg, ooo) {
	var addr = (this.addr || this._broadcast).concat(),
		args = Array.prototype.slice.call(arguments),
		deli = this.deli || this._deliverable;
	0..wait(function() {
		var instance, i = 0, iz = addr.length;
		for (; i < iz; ++i) {
			instance = deli[ addr[i].__CLASS_UID__ ];
			if (instance && instance.msgbox) {
				instance.msgbox.apply(instance, args);
			} else {
				if (instance) {
					mm_log(msg + " is not deliverable. " + instance.__CLASS__);
				}
			}
		}
	});
	return this.that || this;
}
function Date_from(date) {
	if (date.typeDate) {
		return date;
	}
	var DATE_PARSE = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:\.(\d*))?Z$/,
		m = DATE_PARSE.exec(date), d;
	if (m) {
		return new Date(Date.UTC(+m[1], +m[2] - 1,   +m[3],
								 +m[4], +m[5], +m[6], m[7] ? +m[7] : 0));
	}
	d = new Date(date);
	return isNaN(+d) ? null : d;
}
function Date_diff(diffDate) {
	var span = Math.abs(+this - +diffDate),
		diff = new Date(span);
	return {
		days: (span / 86400000) | 0,
		times: diff.times(),
		toString: function(format) {
			return diff.format(format || "m:s.ms");
		}
	};
}
function Date_dates() {
	return { y:  this.getUTCFullYear(),
			 m:  this.getUTCMonth() + 1,
			 d:  this.getUTCDate() };
}
function Date_times() {
	return { h:  this.getUTCHours(),
			 m:  this.getUTCMinutes(),
			 s:  this.getUTCSeconds(),
			 ms: this.getUTCMilliseconds() };
}
function Date_format(format) {
	var rv = [],
		ary = (format || "I").split(""), key, i = 0, iz = ary.length,
		iso = this.toJSON(),
		m   = iso.split(/[^\d]/),
		map = {
			I: iso,  d: (+this / 86400000) | 0,
			Y: m[0], M: m[1], D: m[2], h: m[3], m: m[4], s: m[5], ms: m[6]
		};
	for (; i < iz; ++i) {
		key = ary[i];
		if (key === "m" && ary[i + 1] === "s") {
			key = "ms";
			++i;
		}
		rv.push( map[ key ] || key );
	}
	return rv.join("");
}
function Array_range(begin, end, filterOtStep) {
	return (begin).to(end, filterOtStep);
}
function Array_toArray(mix) {
	return Array.isArray(mix) ? [mix] : mix;
}
function Array_isCodedArray(mix) {
	return Array.isArray(mix) && !!mix.code;
}
function Array_chain(param) {
	var rv, value, fn, i = 0, iz = this.length;
	for (; i < iz; i += 2) {
		if (i in this) {
			value = this[i];
			fn = this[i + 1];
			if (typeof fn === "function") {
				rv = fn(value, i, param);
				if (rv) {
					return rv;
				}
			}
		}
	}
	return;
}
function Array_match(fn, that) {
	var i = 0, iz = this.length;
	for (; i < iz; ++i) {
		if (i in this && fn.call(that, this[i], i, this)) {
			return this[i];
		}
	}
	return;
}
function Array_at(format) {
	var ary = this, i = 0;
	return format.replace(/@@/g, function() {
		return ary[i++];
	});
}
function Array_has(find) {
	if (Array.isArray(find)) {
		var i = 0, iz = find.length;
		for (; i < iz; ++i) {
			if (this.indexOf(find[i]) < 0) {
				return false;
			}
		}
		return true;
	}
	return this.indexOf(find) >= 0;
}
function Array_copy(deep) {
	return deep ? mm_copy(this)
				: this.concat();
}
function Array_unique() {
	return this.sieve().values;
}
function Array_clean(typeofFilter) {
	typeofFilter = typeofFilter || "";
	var rv = [], value, i = 0, iz = this.length;
	for (; i < iz; ++i) {
		value = this[i];
		if (value === value && value != null) {
			if (!typeofFilter || typeof value === typeofFilter) {
				rv.push(value);
			}
		}
	}
	return rv;
}
function Array_decode(startIndex, endIndex) {
	var code = this.code || "byte";
	switch (code.toLowerCase()) {
	case "":      throw new TypeError("BAD_ARG");
	case "byte":
	case "utf16": return _Array_utf16(this, startIndex, endIndex);
	case "utf8":  return _Array_utf8(this, startIndex, endIndex);
	}
	return "";
}
function _Array_utf8(data, startIndex, endIndex) {
	var rv = [], c = 0,
		i  = startIndex || 0,
		iz =   endIndex || data.length;
	if (iz > data.length) {
		iz = data.length;
	}
	for (; i < iz; ++i) {
		c = data[i];
		if (c < 0x80) {
			rv.push(c);
		} else if (c < 0xE0) {
			rv.push( (c & 0x1f) <<  6 | (data[++i] & 0x3f) );
		} else if (c < 0xF0) {
			rv.push( (c & 0x0f) << 12 | (data[++i] & 0x3f) <<  6 |
										(data[++i] & 0x3f) );
		} else if (c < 0xF8) {
			rv.push( (c & 0x07) << 18 | (data[++i] & 0x3f) << 12 |
										(data[++i] & 0x3f) <<  6 |
										(data[++i] & 0x3f) );
		}
	}
	return _Array_utf16(rv);
}
function _Array_utf16(data, startIndex, endIndex) {
	var rv = [], i = 0, iz = data.length, bulkSize = 10240;
	if (startIndex !== void 0 ||
		 endIndex !== void 0) {
		data = data.slice(startIndex || 0, Math.max(endIndex || iz, iz));
		iz = data.length;
	}
	for (; i < iz; i += bulkSize) {
		rv.push( String.fromCharCode.apply(null, data.slice(i, i + bulkSize)) );
	}
	return rv.join("");
}
function Array_count() {
	return Object_count(this);
}
function Array_sieve() {
	var ary = this.clean(), values = [], dups = [], i = 0, iz = ary.length;
	for (; i < iz; ++i) {
		values.indexOf(ary[i]) >= 0 ? dups.push(ary[i])
									: values.push(ary[i]);
	}
	return { values: values, dups: dups };
}
function Array_shifts() {
	var rv = this.concat();
	this.length = 0;
	return rv;
}
function Array_replace(find, value, all) {
	var index = 0, remove = value == null;
	while (index = this.indexOf(find, index) + 1) {
		remove ? this.splice(index - 1, 1)
			 : this.splice(index - 1, 1, value);
		if (!all) {
			break;
		}
		--index;
	}
	return this;
}
function Array_shuffle() {
	var rv = this.clean(), i = rv.length, j, k;
	if (i) {
		while (--i) {
			j = (Math.random() * (i + 1)) | 0;
			if (i !== j) {
				k     = rv[i];
				rv[i] = rv[j];
				rv[j] = k;
			}
		}
	}
	return rv;
}
function Array_sum() {
	var rv = 0, ary = this.clean("number"), i = 0, iz = ary.length;
	for (; i < iz; ++i) {
		rv += ary[i];
	}
	return rv;
}
function Array_dump() {
	var rv, value = this, v, i, iz;
	for (rv = [], i = 0, iz = value.length; i < iz; ++i) {
		v = value[i];
		if (typeof v === "number") {
			rv[i] = v < 0 ? ("-0x" + v.hh(4).slice(1))
						 : ( "0x" + v.hh(4));
		} else {
			rv[i] = "NaN";
		}
	}
	return "[ " + rv.join(", ") + " ]";
}
function Array_clamp(low, high) {
	return this.clean("number").map(function(num) {
		return num.clamp(low, high);
	});
}
function Array_nsort(desc) {
	function ascending(a, b) {
		return a - b;
	}
	function descending(a, b) {
		return b - a;
	}
	return this.clean("number").sort(desc ? descending : ascending);
}
function Array_average(median) {
	var ary = this.clean("number"), iz = ary.length;
	if (!median) {
		return ary.sum() / iz;
	}
	ary.nsort();
	return iz % 2 ? ary[(iz - 1) / 2]
				 : (ary[iz / 2 - 1] + ary[iz / 2]) / 2;
}
function Array_or(merge) {
	return this.concat(merge).unique();
}
function Array_and(compare) {
	var rv = [], i = 0, iz = this.length;
	for (; i < iz; ++i) {
		if (i in this) {
			if (compare.indexOf(this[i]) >= 0) {
				rv.push(this[i]);
			}
		}
	}
	return rv;
}
function Array_xor(compare) {
	var rv = [], index, i = 0, iz = this.length;
	for (; i < iz; ++i) {
		if (i in this) {
			index = compare.indexOf(this[i]);
			index >= 0 ? compare.splice(index, 1)
					 : rv.push(this[i]);
		}
	}
	return rv.concat(compare);
}
function Array_fill(value, from, to) {
	var rv = this.concat(), i = from || 0, iz = to || rv.length;
	switch (mm_type(value)) {
	case "date":   for (; i < iz; ++i) { rv[i] = new Date(value); } break;
	case "array":  for (; i < iz; ++i) { rv[i] = value.concat();  } break;
	case "object": for (; i < iz; ++i) { rv[i] = mm_copy(value);  } break;
	default:       for (; i < iz; ++i) { rv[i] = value; }
	}
	return rv;
}
function Array_clear() {
	this.length = 0;
	return this;
}
function Array_choice() {
	var index = (Math.random() * this.length) | 0;
	return this[index];
}
function Array_reject(fn) {
	var rv = [], ary = this.clean(), i = 0, iz = ary.length;
	for (; i < iz; ++i) {
		fn(ary[i], i) || rv.push(ary[i]);
	}
	return rv;
}
function Array_select(fn) {
	var rv = [], ary = this.clean(), i = 0, iz = ary.length;
	for (; i < iz; ++i) {
		fn(ary[i], i) && rv.push(ary[i]);
	}
	return rv;
}
function Array_flatten() {
	function _recursiveExpand(ary) {
		var i = 0, iz = ary.length, value;
		for (; i < iz; ++i) {
			if (i in ary) {
				value = ary[i];
				Array.isArray(value) ? _recursiveExpand(value)
									 : rv.push(value);
			}
		}
	}
	var rv = [];
	_recursiveExpand(this);
	return rv;
}
function String_trims(chr) {
	var esc = RegExp.esc(chr);
	return this.trim().replace(RegExp("^" + esc + "+"), "").
					 replace(RegExp(esc + "+" + "$"), "");
}
function String_trimTag() {
	return this.trim().replace(/<\/?[^>]+>/g, "");
}
function String_trimQuote() {
	var str = this.trim(), m = /^["']/.exec(str);
	if (m) {
		m = RegExp(m[0] + "$").exec(str);
		if (m) {
			return str.trims(m[0]);
		}
	}
	return str;
}
function String_insert(str, index) {
	index = index || 0;
	var leftSide  = this.slice(0, index),
		rightSide = this.slice(index);
	return leftSide + str + rightSide;
}
function String_remove(str, index) {
	if (str) {
		index = this.indexOf(str, index || 0);
		if (index >= 0) {
			return this.slice(0, index) + this.slice(index + str.length);
		}
	}
	return this + "";
}
function String_unpack(glue, joint) {
	return Hash.unpack(this + "", glue, joint);
}
function String_at(ooo) {
	var i = 0, args = arguments;
	return this.replace(/@@/g, function() {
		return args[i++];
	});
}
function String_up(index) {
	if (index) {
		index = index < 0 ? this.length + index : index;
		if (index in this) {
			return this.slice(0, index) + this[index].toUpperCase() +
				 this.slice(index + 1);
		}
	}
	return this.toUpperCase();
}
function String_low(index) {
	if (index) {
		index = index < 0 ? this.length + index : index;
		if (index in this) {
			return this.slice(0, index) + this[index].toLowerCase() +
				 this.slice(index + 1);
		}
	}
	return this.toLowerCase();
}
function String_has(find, anagram) {
	if (anagram) {
		if (this.length < find.length) {
			return false;
		}
		var chr, a = this.count(), b = find.count();
		for (chr in b) {
			if (!a[chr] || a[chr] < b[chr]) {
				return false;
			}
		}
		return true;
	}
	return this.indexOf(find) >= 0;
}
function String_isURL(isRelative) {
	if (isRelative) {
		return RegExp.URL.test("http://a.a/" + this.replace(/^\/+/, ""));
	}
	return /^(https?|wss?):/.test(this) ? RegExp.URL.test(this)
										: RegExp.FILE.test(this);
}
function String_count(find) {
	var rv = {}, c, ary = this.split(""), i = 0, iz = ary.length;
	for (; i < iz; ++i) {
		c = ary[i];
		rv[c] ? ++rv[c] : (rv[c] = 1);
	}
	return find ? (rv[find] || 0) : rv;
}
function String_numbers(joint) {
	return this.trim().split(joint || ",").map(parseFloat).clean("number");
}
function String_format(ooo) {
	var next = 0, index = 0, args = arguments;
	return this.replace(
				/%(?:(\d+)\$)?(#|0| )?(\d+)?(?:\.(\d+))?(l)?([%iduoxXfcs])/g, _parse);
	function _parse(_,
					argIndex,
					flag,
					width,
					prec,
					size,
					types) {
		if (types === "%") {
			return types;
		}
		index = argIndex ? parseInt(argIndex) : next++;
		var BITS = {
				i: 0x0011,
				d: 0x0011,
				u: 0x0021,
				o: 0x0161,
				x: 0x0261,
				X: 0x1261,
				f: 0x0092,
				c: 0x6800,
				s: 0x0084
			},
			bits = BITS[types], overflow, pad,
			rv = (args[index] === void 0) ? "" : args[index];
		bits & 0x0001 && (rv = parseInt(rv));
		bits & 0x0002 && (rv = parseFloat(rv));
		bits & 0x0003 && (rv = rv === rv ? rv : "");
		bits & 0x0004 && (rv = ((types === "s" ? rv : types) || "").toString());
		bits & 0x0020 && (rv = rv >= 0 ? rv : rv % 0x100000000 + 0x100000000);
		bits & 0x0300 && (rv = rv.toString(bits & 0x100 ? 8 : 16));
		bits & 0x0040 && flag === "#" && (rv = (bits & 0x100 ? "0" : "0x") + rv);
		bits & 0x0080 && prec && (rv = bits & 2 ? rv.toFixed(prec)
												: rv.slice(0, prec));
		bits & 0x6000 && (overflow = (typeof rv !== "number" || rv < 0));
		bits & 0x2000 && (rv = overflow ? "" : String.fromCharCode(rv));
		rv = bits & 0x1000 ? rv.toString().toUpperCase()
						 : rv.toString();
		if (!(bits & 0x0800 || width === void 0 || rv.length >= width)) {
			pad = ((!flag || flag === "#") ? " " : flag).repeat(width - rv.length);
			rv  = ((bits & 0x0010 && flag === "0") && !rv.indexOf("-")) ?
						"-" + pad + rv.slice(1) :
						pad + rv;
		}
		return rv;
	}
}
function String_unique() {
	return this.split("").unique().join("");
}
function String_code(code) {
	var rv = [];
	rv.code = (code || "byte").toLowerCase();
	switch (rv.code) {
	case "byte":  return _String_toByteArray(rv, this, 0xff);
	case "utf8":  return _String_toUTF8Array(rv, this);
	case "utf16": return _String_toByteArray(rv, this, 0x1fffff);
	}
	return rv;
}
function _String_toByteArray(rv, data, filter) {
	var i = 0, iz = data.length;
	for (; i < iz; ++i) {
		rv[i] = data.charCodeAt(i) & filter;
	}
	return rv;
}
function _String_toUTF8Array(rv, data) {
	var i = 0, iz = data.length, c = 0, next, u;
	for (; i < iz; ++i) {
		c = data.charCodeAt(i);
		if (c < 0x80) {
			rv.push(c);
		} else if (c < 0x0800) {
			rv.push(c >>>  6 & 0x1f | 0xc0, c        & 0x3f | 0x80);
		} else if (c >= 0xD800 && c <= 0xE000) {
			next = data.charCodeAt(i + 1);
			if (next >= 0xDC00 && next <= 0xDFFF) {
				u = (c >>> 6 & 0x0f) + 1;
				rv.push( u >>> 2 & 0x07 | 0xf0,
						(u  << 4 & 0x30 | 0x80) |    c >>> 2 & 0xf,
						(c  << 4 & 0x30 | 0x80) | next >>> 6 & 0xf,
							next & 0x3f | 0x80);
			} else {
				throw new URIError("BAD_ARG");
			}
		} else if (c < 0x10000) {
			rv.push(c >>> 12 & 0x0f | 0xe0, c >>>  6 & 0x3f | 0x80,
											c        & 0x3f | 0x80);
		} else if (c < 0x110000) {
			rv.push(c >>> 18 & 0x07 | 0xf0, c >>> 12 & 0x3f | 0x80,
					c >>>  6 & 0x3f | 0x80, c        & 0x3f | 0x80);
		}
	}
	return rv;
}
function String_overflow(maxLength, omit) {
	omit = (omit || "...");
	var omitLength = omit.length;
	if (this.length > maxLength) {
		if (maxLength - omitLength < 1) {
			return omit.slice(0, maxLength);
		}
		return this.slice(0, maxLength - omitLength) + omit;
	}
	return "" + this;
}
function Number_to(end, filterOrStep) {
	var rv = [], begin = this | 0, reverse = begin > end,
		i  = (reverse ? end : begin) | 0,
		iz = (reverse ? begin : end) | 0,
		type = typeof filterOrStep,
		step = 1;
	if (type === "function") {
		for (; i <= iz; ++i) {
			filterOrStep(i) && rv.push(i);
		}
	} else {
		if (type === "number") {
			step = filterOrStep | 0;
		}
		if (step < 1 || end >= 0x7FFFFFFF) {
			throw new Error("BAD_ARG");
		}
		for (; i <= iz; i += step) {
			rv.push(i);
		}
	}
	return reverse ? rv.reverse() : rv;
}
function Number_pad(digits, radix) {
	digits = digits || 2;
	radix  = radix  || 10;
	var num = Math.abs(+this) >>> 0;
	if (digits === 2 && radix === 10 && num < 100) {
		return num < 10 ? "0" + num : "" + num;
	}
	return ("00000000000000000000000000000000" +
			num.toString(radix)).slice(-digits);
}
function Number_xor(value) {
	return (this ^ value) >>> 0;
}
function Number_wait(fn_that, ooo) {
	var that = fn_that[0] || null,
		fn   = fn_that[1] || fn_that,
		args = Array.prototype.slice.call(arguments, 1);
	return setTimeout(function() {
				fn.apply(that, args);
			}, this * 1000);
}
function Number_times(fn_that, ooo) {
	var rv   = [],
		that = fn_that[0] || null,
		fn   = fn_that[1] || fn_that,
		args = Array.prototype.slice.call(arguments, 1),
		i = 0, iz = +this | 0,
		fn_args = args ? args.concat() : [],
		fn_args_last = fn_args.length;
	if (iz > 0) {
		for (; i < iz; ++i) {
			fn_args[fn_args_last] = i;
			rv.push(fn.apply(that, fn_args));
		}
	}
	return rv;
}
function Number_clamp(low, high) {
	var num = +this, swap;
	if (low > high) {
		swap = [high, low];
		low  = swap[0];
		high = swap[1];
	}
	return num < low  ? low  :
		 num > high ? high : num;
}
function Number_toRadians() {
	return this * Math.PI / 180;
}
function Number_toDegrees() {
	return this * 180 / Math.PI;
}
function Number_chr() {
	return String.fromCharCode(this);
}
function Number_rand() {
	var num = +this;
	return num ? (Math.random() * num) | 0
			 :  Math.random();
}
function Function_help(that) {
	that = that || this;
	var url = _getHelpURL(that);
	return url + "\n\n" + that + "\n\n" + url;
}
function Function_help_add(url, word) {
	if (Array.isArray(word)) {
		word = RegExp("^(" + word.join("|") + ")(?:([#\\.])([\\w\\,]+))?$");
	}
	Function_help_add._db.push(word, function(rex, index, param) {
		var m = rex.exec(param),
			dotfn = "@@@@#@@.@@",
			proto = "@@@@#@@.prototype.@@";
		if (!m) { return false; }
		return !m[2] ? "@@@@".at(url, m[1])
			 : m[2] === "." ? dotfn.at(url, m[1], m[1], m[3])
							: proto.at(url, m[1], m[1], m[3]);
	});
}
Function_help_add._db = [];
function _getHelpURL(fn) {
	var rv, help = /@help:\s*([^\n]*)\n/.exec("\n" + fn);
	if (help) {
		rv = Function_help_add._db.chain(help[1].trim());
	}
	return rv || "";
}
function Function_callby(that, ooo) {
	var ary = [], args = arguments, i = 1, iz = args.length;
	for (; i < iz; ++i) {
		if (mm_type(args[i]) === "list") {
			Array.prototype.push.apply(ary, mm_cast_list(args[i]));
		} else {
			ary.push( args[i] );
		}
	}
	return this.apply(that, ary);
}
function Function_nickname(defaultName) {
	var name = this.name || (this + "").split("(")[0].trim().slice(9);
	return name ? name.replace(/^mm_/, "mm.")
				: defaultName;
}
function RegExp_esc(str) {
	return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}
function RegExp_flag(command) {
	var flag = (this + "").slice(this.source.length + 2);
	if (!command) {
		flag = "";
	} else if (command[0] === "-") {
		command.slice(1).split("").each(function(f) {
			flag = flag.remove(f);
		});
	} else {
		flag = (flag + command.trims("+")).unique();
	}
	return RegExp(this.source, flag);
}
function Function_await(waits, tick) {
	return new Await(this, waits, tick);
}
function Await_missable(missables) {
	this._db.missables = missables;
	return this;
}
function Await_pass(value) {
	++this._db.pass;
	this._db.args.push(value);
	_Await_next(this._db);
	return this;
}
function Await_miss(value) {
	++this._db.miss;
	this._db.args.push(value);
	_Await_next(this._db);
	return this;
}
function _Await_next(db) {
	if (db.state === 100) {
		db.state = db.miss > db.missables ? 400
				 : db.pass + db.miss >= db.waits ? 200
				 : db.state;
	}
	db.tick && db.tick({ ok: db.state === 200, args: db.args, state: db.state });
	if (db.state > 100) {
		if (db.fn) {
			db.fn({ ok: db.state === 200, args: db.args, state: db.state });
			db.fn = db.tick = null;
			db.args = [];
		}
	}
}
function Await_state() {
	return this._db.state;
}
function Array_test(label, arg) {
	if (!this.length) { return; }
	var nicknames = _enumNicknames(this.clean()),
		plan, group, param;
	plan = _streamTokenizer( nicknames.array.join(" > ") );
	group = plan.shift();
	param = mm.mix(nicknames.object, { arg: arg, pass: 0, miss: 0,
									 logg: mm_logg(label || "") });
	group && _recursiveTestCase( plan, group, param );
}
function _recursiveTestCase(plan, group, param) {
	var i = 0, iz = group.length;
	group.each(function(action) {
		var lval, rval,
			jrv,
			jfn,
			msg;
		switch (mm.type(param[action])) {
		case "array":
			try {
				lval = param[action][0];
				rval = param[action][1];
				jfn = param[action][2] || mm.like;
				jrv = jfn(lval, rval);
				msg = "= @@( @@ )".at( jfn.nickname(),
									 mm_dump(lval, 0) + ", " +
									 mm_dump(rval, 0) );
			} catch (O_o) {
				msg = O_o + "";
			}
			_callback( jrv, msg);
			break;
		case "boolean":
			_callback( param[action] );
			break;
		case "function":
			jrv = param[action](_callback);
			if (jrv === false ||
				jrv === true) {
				_callback(jrv);
				break;
			} else if (jrv === void 0 && !param[action].length) {
				
				throw new TypeError("ARGUMENT_IS_MISSING: " + action);
			}
			break;
		default:
			
			throw new TypeError("BAD_TYPE: " + action);
		}
		function _callback(result, msg) {
			var miss = result === false, nextAction, arg;
			miss ? param.logg.error(action + ":", result, msg)
				 : param.logg(action + ":", result, msg);
			miss ? ++param.miss
				 : ++param.pass;
			if (typeof Array_test.tick === "function") {
				arg = {
					ok:   !miss,
					msg:  msg    || "",
					name: action || "",
					pass: param.pass,
					miss: param.miss
				};
				if (Array_test.tick(arg) === false) {
					return;
				}
			}
			if (++i >= iz) {
				nextAction = plan.shift();
				nextAction ? _recursiveTestCase( plan, nextAction, param )
						 : param.logg.out();
			}
		}
	});
}
function _enumNicknames(ary) {
	var rv = { object: {}, array: [] }, i = 0, iz = ary.length, key;
	for (; i < iz; ++i) {
		key = typeof ary[i] === "function" ? ary[i].nickname("" + i)
										 : "" + i;
		rv.object[key] = ary[i];
		rv.array.push(key);
	}
	return rv;
}
function _streamTokenizer(command) {
	var plan = [], remain = [];
	command.match(/([\w\-\u00C0-\uFFEE]+|[/+>])/g).each(function(token) {
		token === "+" ? 0 :
		token === ">" ? (remain.length && plan.push(remain.shifts()))
					 : remain.push(token);
	});
	remain.length && plan.push(remain.concat());
	return plan;
}
/*
			command
		_________________
		"fn1 > fn2 + fn3".stream({ ... })
			 v
		_streamTokenizer(command)
			 v
			 plan
	________________________________
	[ [ "fn1" ],  [ "fn2", "fn3" ] ]
		~~~~~     ~~~~~~~~~~~~~~~~
		action         group (parallel execution group)
 */
function Array_stream() {
	return _enumNicknames(this).array.join(" > ").stream(this);
}
function String_stream(methods) {
	function halt() {
		String_stream._halt[uid] = 1;
		methods.halted = true;
		methods.halt && methods.halt("halt");
	}
	var plan = _streamTokenizer(this),
		uid = mm.uid("stream");
	methods = Array.isArray(methods) ? _enumNicknames(methods).object
									 : methods;
	String_stream._halt[uid] = 0;
	plan.length && _stream(plan, methods, uid);
	return { uid: uid, halt: halt };
}
String_stream._halt = {};
function _stream(plan, methods, uid) {
	if (!String_stream._halt[uid]) {
		var group = plan.shift();
		group && _nextStream( plan, group, methods, uid );
	}
}
function _nextStream(plan, group, methods, uid) {
	var i = 0, iz = group.length, halt = 0;
	group.each(function(action) {
		if (isFinite(action)) {
			setTimeout(function() {
				_judge(true);
			}, +action);
		} else {
			var r = methods[action](_judge);
			if (r === false || r === true) {
				_judge(r);
			} else if (r === void 0 && methods[action].length < 1) {
				throw new Error("NEED_RETURN: " + action);
			}
		}
		function _judge(result) {
			if (!halt) {
				if (result === false) {
					methods.halted = !!++halt;
					methods.halt && methods.halt(action);
				} else if (++i >= iz) {
					_stream(plan, methods, uid);
				}
			}
		}
	});
}
function Object_has(spec, find) {
	var key, keys = Object.keys(find), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		if (!(key in spec) || !Object_like( spec[key], find[key] )) {
			return false;
		}
	}
	return true;
}
function Object_like(lval, rval) {
	var ltype = mm_type(lval),
		rtype = mm_type(rval),
		alike = { string: 1, date: 1, list: 2, array: 2, object: 3, Hash: 3 };
	if (ltype !== rtype) {
		if (alike[ltype] &&
			alike[ltype] === alike[rtype]) {
			if (rtype === "string" || rtype === "list" || rtype === "Hash") {
				return Object_like(lval, mm_cast(rval));
			}
			return Object_like(mm_cast(lval), rval);
		}
		return false;
	}
	switch (ltype) {
	case "list":    return mm_cast_list(lval) + "" === mm_cast_list(rval) + "";
	case "array":   return lval + "" === rval + "";
	case "regexp":  return lval.source === rval.source;
	case "object":  return ((Object.keys(lval).length === Object.keys(rval).length) &&
						 Object_has(lval, rval));
	case "number":  return isNaN(lval) && isNaN(rval) ? true : lval === rval;
	}
	return (lval && lval.toJSON) ? lval.toJSON() === rval.toJSON()
								 : lval === rval;
}
function Object_map(obj, fn) {
	var rv = [], key, keys = Object.keys(obj), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		rv.push( fn(obj[key], key) );
	}
	return rv;
}
function Object_each(obj, fn) {
	var key, keys = Object.keys(obj), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		fn(obj[key], key);
	}
}
function Object_some(obj, fn) {
	var key, keys = Object.keys(obj), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		if ( fn(obj[key], key) ) {
			return true;
		}
	}
	return false;
}
function Object_every(obj, fn) {
	var key, keys = Object.keys(obj), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		if ( !fn(obj[key], key) ) {
			return false;
		}
	}
	return true;
}
function Object_match(obj, fn) {
	var key, keys = Object.keys(obj), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		if ( fn(obj[key], key) ) {
			return obj[key];
		}
	}
	return;
}
function Object_clean(data, typeofFilter) {
	typeofFilter = typeofFilter || "";
	var rv = {}, key, value, keys = Object.keys(data), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		value = data[key];
		if (value === value && value != null) {
			if (!typeofFilter || typeof value === typeofFilter) {
				rv[key] = value;
			}
		}
	}
	return rv;
}
function Object_count(obj) {
	var rv = {}, value, keys = Object.keys(obj), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		value = obj[keys[i]] + "";
		rv[value] ? ++rv[value] : (rv[value] = 1);
	}
	return rv;
}
function Object_pick(obj, names) {
	var rv = [], key, keys = Object.keys(obj), i = 0, iz = keys.length,
		child, ary = Array.toArray(names), j, jz = ary.length;
	for (; i < iz; ++i) {
		child = obj[keys[i]];
		for (j = 0; j < jz; ++j) {
			key = ary[j];
			child.hasOwnProperty(key) && rv.push( child[key] );
		}
	}
	return rv;
}
function Object_values(obj) {
	var rv = [], keys = Object.keys(obj), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		rv.push( obj[keys[i]] );
	}
	return rv;
}
function Hash_clean(typeofFilter) {
	return new Hash(Object_clean(this._, typeofFilter));
}
function Hash_pack(glue, joint) {
	glue  = glue  || ":";
	joint = joint || ";";
	var rv = [], key, keys = Object.keys(this._), i = 0, iz = keys.length;
	for (; i < iz; ++i) {
		key = keys[i];
		rv.push(key + glue + this._[key]);
	}
	return rv.join(joint);
}
function Hash_unpack(data, glue, joint) {
	glue  = glue  || ":";
	joint = joint || ";";
	var rv = {}, index, key, value,
		ary = data.trims(joint).split(joint), i = 0, iz = ary.length,
		primitive = {
			"": "",
			"NaN": NaN,
			"null": null,
			"true": true,
			"false": false,
			"undefined": void 0
		};
	for (; i < iz; ++i) {
		index = ary[i].indexOf(glue);
		key = index >= 0 ? ary[i].slice(0, index)
						 : ary[i];
		value = "";
		if (index >= 0) {
			value = ary[i].slice(index + 1).trim();
			value = value in primitive ? primitive[value]
				 : isFinite(value) ? parseFloat(value)
				 : value;
		}
		rv[key.trim()] = value;
	}
	return new Hash(rv);
}
function _detectEnv(rv) {
	if (!global.location || !global.navigator || global.window !== global) {
		return rv;
	}
	var nav = global.navigator, ua = nav.userAgent;
	rv.lang     = (nav.language || nav.browserLanguage || "").split("-", 1)[0];
	rv.retina   = (global.devicePixelRatio || 1) >= 2;
	rv.secure   =  global.location.protocol === "https:";
	rv.ios      = /iPhone|iPad|iPod/.test(ua);
	rv.ipad     = /iPad/.test(ua);
	rv.chrome   = /Chrome/.test(ua);
	rv.webkit   = /WebKit/.test(ua);
	rv.safari   = rv.webkit && !rv.chrome;
	rv.android  = /Android/i.test(ua);
	return rv;
}
if (typeof module !== "undefined") {
	module.exports = { mm: HashFactory };
}
_extendNativeObjects(mm_mix, mm_wiz);
_defineLibraryAPIs(mm_mix);
_defineHashPrototype(mm_wiz);
mm.help.add(
	"http://code.google.com/p/mofmof-js/wiki/",
	"Object,Array,String,Boolean,Number,Date,Function,mm,Class,Hash,Await,Msg".split(","));
})(this.self || global);
(function(global) {
function _defineLibraryAPIs(mix) {
	mm.url = mix(mm_url, {
		resolve:    mm_url_resolve,
		normalize:  mm_url_normalize,
		buildQuery: mm_url_buildQuery,
		parseQuery: mm_url_parseQuery
	});
}
function mm_url(url) {
	return !url ? mm_url_resolve()
		 : typeof url === "string" ? _url_parse(url)
								 : _url_build(url);
}
function mm_url_resolve(url) {
	url = url || "";
	if (!url && global.location) {
		return global.location.href;
	}
	if (url && /^(https?|file|wss?):/.test(url)) {
		return url;
	}
	var a = global.document.createElement("a");
	a.setAttribute("href", url);
	return a.cloneNode(false).href;
}
function _url_build(obj) {
	var slash = obj.protocol ? (obj.protocol === "file:" ? "///"
														 : "//") : "";
	return [obj.protocol, slash,
			obj.host     || "",
			obj.pathname || "/",
			obj.search   || "",
			obj.fragment || ""].join("");
}
function _url_parse(url) {
	function _extends(obj) {
		var ary = obj.pathname.split("/");
		obj.href       = obj.href     || "";
		obj.protocol   = obj.protocol || "";
		obj.scheme     = obj.protocol;
		obj.secure     = obj.secure   || false;
		obj.host       = obj.host     || "";
		obj.auth       = obj.auth     || "";
		obj.hostname   = obj.hostname || "";
		obj.port       = obj.port     || 0;
		obj.pathname   = obj.pathname || "";
		obj.file       = ary.pop();
		obj.dir        = ary.join("/") + "/";
		obj.search     = obj.search   || "";
		obj.query      = mm_url_parseQuery(obj.search);
		obj.fragment   = obj.fragment || "";
		obj.ok         = obj.ok       || true;
		return obj;
	}
	var m, ports = { "http:": 80, "https": 443, "ws:": 81, "wss:": 816 };
	m = RegExp.FILE.exec(url);
	if (m) {
		return _extends({
			href:       url,
			protocol:   m[1],
			pathname:   m[2],
			search:     m[3],
			fragment:   m[4]
		});
	}
	m = RegExp.URL.exec(url);
	if (m) {
		return _extends({
			href:       url,
			protocol:   m[1],
			secure:     m[1] === "https:" || m[1] === "wss:",
			host:       m[2],
			auth:       m[3],
			hostname:   m[4],
			port:       m[5] ? +m[5] : (ports[m[1]] || 0),
			pathname:   m[6],
			search:     m[7],
			fragment:   m[8]
		});
	}
	m = RegExp.PATH.exec(url);
	if (m) {
		return _extends({
			href:       url,
			pathname:   m[1],
			search:     m[2],
			fragment:   m[3]
		});
	}
	return _extends({
		href:       url,
		pathname:   url,
		ok: false
	});
}
function mm_url_normalize(url) {
	var rv = [],
		path,
		dots = /^\.+$/,
		obj  = _url_parse(url),
		dirs = obj.dir.split("/"),
		i = 0, iz = dirs.length;
	for (; i < iz; ++i) {
		path = dirs[i];
		if (path === "..") {
			rv.pop();
		} else if (!dots.test(path)) {
			rv.push(path);
		}
	}
	path = ("/" + rv.join("/") + "/").replace(/\/+/g, "/");
	obj.pathname = path + obj.file;
	return _url_build(obj);
}
function mm_url_buildQuery(obj, joint) {
	joint = joint || "&";
	var rv = [], i, j, jz, key, value;
	for (i in obj) {
		key   = global.encodeURIComponent(i);
		value = obj[i];
		if (Array.isArray(value)) {
			for (j = 0, jz = value.length; j < jz; ++j) {
				rv.push(key + "=" + global.encodeURIComponent(value[j]));
			}
		} else {
			rv.push(key + "=" + global.encodeURIComponent(value));
		}
	}
	return rv.join(joint);
}
function mm_url_parseQuery(query) {
	function _parse(_, key, value) {
		var k = global.encodeURIComponent(key),
			v = global.encodeURIComponent(value);
		if (rv[k]) {
			if (Array.isArray(rv[k])) {
				rv[k].push(v);
			} else {
				rv[k] = [rv[k], v];
			}
		} else {
			rv[k] = v;
		}
		return "";
	}
	var rv = {};
	if (query.indexOf("?") >= 0) {
		query = query.split("?")[1].split("#")[0];
	}
	query.replace(/&amp;|&|;/g, ";").
		 replace(/(?:([^\=]+)\=([^\;]+);?)/g, _parse);
	return rv;
}
_defineLibraryAPIs(mm.mix);
})(this);
(function() {
function _defineLibraryAPIs() {
	Math.easing = {
			linear: "(c*t/d+b)",
			inquad: "(q1=t/d,c*q1*q1+b)",
		 outquad: "(q1=t/d,-c*q1*(q1-2)+b)",
		 inoutquad: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1+b:-c*0.5*((--q1)*(q1-2)-1)+b)",
		 incubic: "(q1=t/d,c*q1*q1*q1+b)",
		 outcubic: "(q1=t/d-1,c*(q1*q1*q1+1)+b)",
		inoutcubic: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1*q1+b:c*0.5*((q1-=2)*q1*q1+2)+b)",
		outincubic: "(q1=t*2,q2=c*0.5,t<d*0.5?(q3=q1/d-1,q2*(q3*q3*q3+1)+b)" +
											":(q3=(q1-d)/d,q2*q3*q3*q3+b+q2))",
		 inquart: "(q1=t/d,c*q1*q1*q1*q1+b)",
		 outquart: "(q1=t/d-1,-c*(q1*q1*q1*q1-1)+b)",
		inoutquart: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1*q1*q1+b" +
									 ":-c*0.5*((q1-=2)*q1*q1*q1-2)+b)",
		outinquart: "(q1=t*2,q2=c*0.5,t<d*0.5?(q3=q1/d-1,-q2*(q3*q3*q3*q3-1)+b)" +
											":(q4=q1-d,q3=q4/d,q2*q3*q3*q3*q3+b+q2))",
			inback: "(q1=t/d,q2=1.70158,c*q1*q1*((q2+1)*q1-q2)+b)",
		 outback: "(q1=t/d-1,q2=1.70158,c*(q1*q1*((q2+1)*q1+q2)+1)+b)",
		 inoutback: "(q1=t/(d*0.5),q2=1.525,q3=1.70158," +
						"q1<1?(c*0.5*(q1*q1*(((q3*=q2)+1)*q1-q3))+b)" +
							":(c*0.5*((q1-=2)*q1*(((q3*=q2)+1)*q1+q3)+2)+b))",
		 outinback: "(q1=t*2,q2=c*0.5," +
						"t<d*0.5?(q3=q1/d-1,q4=1.70158,q2*(q3*q3*((q4+1)*q3+q4)+1)+b)" +
							 ":(q3=(q1-d)/d,q4=1.70158,q2*q3*q3*((q4+1)*q3-q4)+b+q2))",
		 inbounce: "(q1=(d-t)/d,q2=7.5625,q3=2.75,c-(q1<(1/q3)?(c*(q2*q1*q1)+0)" +
					":(q1<(2/q3))?(c*(q2*(q1-=(1.5/q3))*q1+.75)+0):q1<(2.5/q3)" +
					"?(c*(q2*(q1-=(2.25/q3))*q1+.9375)+0)" +
					":(c*(q2*(q1-=(2.625/q3))*q1+.984375)+0))+b)",
		 outbounce: "(q1=t/d,q2=7.5625,q3=2.75,q1<(1/q3)?(c*(q2*q1*q1)+b)" +
					":(q1<(2/q3))?(c*(q2*(q1-=(1.5/q3))*q1+.75)+b):q1<(2.5/q3)" +
					"?(c*(q2*(q1-=(2.25/q3))*q1+.9375)+b)" +
					":(c*(q2*(q1-=(2.625/q3))*q1+.984375)+b))"
	};
	mm.each(Math.easing, function(jsExpressionString, easingName) {
		Math[easingName] = new Function("t,b,c,d, q1,q2,q3,q4",
										"return " + jsExpressionString);
	});
}
_defineLibraryAPIs();
})();
(function(global) {
function _defineLibraryAPIs(mix) {
	mm.fx = mix(mm_fx, {
		spec:       mm_fx_spec,
		defs:       mm_fx_defs,
		kill:       mm_fx_kill,
		tick:       mm_fx_tick
	});
}
var _frame = global.requestAnimationFrame    ||
			 global.oRequestAnimationFrame   ||
			 global.msRequestAnimationFrame  ||
			 global.mozRequestAnimationFrame ||
			 global.webkitRequestAnimationFrame,
	_immediate = global.setImmediate       ||
				 global.oSetImmediate      ||
				 global.msSetImmediate     ||
				 global.mozSetImmediate    ||
				 global.webkitSetImmediate,
	_uid  = [],
	_kuid = [];
function mm_fx_spec(a, b, time, delay, easing, freeze) {
	var rv = mm_fx_defs(time, delay, easing, freeze);
	rv.a = a;
	rv.b = b;
	return rv;
}
function mm_fx_defs(time, delay, easing, freeze) {
	return { time: time || 200,
			 delay: delay || 0,
			 easing: easing || Math.inoutcubic,
			 freeze: freeze || false };
}
function mm_fx(spec, tick, defs) {
	function _kill() {
		var i = 0, iz = fxdb.length,
			index = _kuid.indexOf(fxuid) + 1;
		if (index) {
			_kuid.splice(index - 1, 1);
		}
		for (i = 0; i < iz; ++i) {
			if (fxdb[i].state !== COMPLETED) {
				fxdb[i].state = FREEZE;
			}
		}
	}
	function _tick() {
		var now = Date.now(),
			curt,
			spec,
			result = {},
			updateState = false,
			i = 0, iz = fxdb.length, j, jz, remain = iz;
		if (_kuid.length &&
			_kuid.indexOf(fxuid) >= 0) {
			_kill();
		}
		for (; i < iz; ++i) {
			curt = null;
			spec = fxdb[i];
			switch (spec.state) {
			case COMPLETED:
				--remain;
				break;
			case WAIT:
				spec.past || (spec.past = now);
				if (now >= spec.past + spec.delay) {
					spec.state = RUNNING;
					curt = spec.a.concat();
					updateState = true;
				}
				break;
			case RUNNING:
				updateState = true;
				if (now >= spec.past + spec.delay + spec.time) {
					spec.state = COMPLETED;
					curt = spec.b.concat();
					--remain;
				} else {
					for (curt = [], j = 0, jz = spec.a.length; j < jz; ++j) {
						curt.push(
							spec.easing(now - spec.past - spec.delay,
										spec.a[j],
										spec.b[j] - spec.a[j],
										spec.time));
					}
					spec.c = curt.concat();
				}
				break;
			case FREEZE:
				updateState = true;
				spec.state = COMPLETED;
				curt = (spec.freeze ? spec.c : spec.b).concat();
				--remain;
			}
			if (curt !== null) {
				if (spec.isArray) {
					result[spec.key] = [];
					for (j = 0, jz = spec.a.length; j < jz; ++j) {
						result[spec.key].push(curt[j]);
					}
				} else {
					result[spec.key] = curt[0];
				}
			}
		}
		if (updateState) {
			if (tick(1, spec, result, now - spec.past) === false) {
				_kill();
			}
		}
		if (remain > 0) {
			_frame ? _frame(_tick)
				 : setTimeout(_tick, 4);
		} else {
			_uid.remove(fxuid);
			tick(2, spec, {}, 0);
		}
	}
	function _buildMassEffectDB(spec) {
		var rv = [], key, value,
			df = mm.arg(defs, { time: 200, delay: 0,
								easing: Math.inoutcubic, freeze: false });
		for (key in spec) {
			value = spec[key];
			if (value.a !== void 0 && value.b !== void 0) {
				rv.push({
					key:    key,
					a:      Array.isArray(value.a) ? value.a : [value.a],
					b:      Array.isArray(value.b) ? value.b : [value.b],
					c:      Array.isArray(value.a) ? value.a : [value.a],
					time:   value.time   || df.time,
					delay:  value.delay  || df.delay,
					easing: value.easing || df.easing,
					freeze: value.freeze || df.freeze,
					isArray:Array.isArray(value.a),
					state:  WAIT,
					past: 0
				});
			}
		}
		return rv;
	}
	var WAIT = 0, RUNNING = 1, FREEZE = 2, COMPLETED = 4,
		fxuid = mm.uid("mm_fx"),
		fxdb = _buildMassEffectDB(spec);
	_uid.push(fxuid);
	tick(0, spec, {}, 0);
	return fxuid;
}
function mm_fx_kill(uid) {
	if (_kuid.indexOf(uid) < 0) {
		_kuid.push(uid);
	}
}
function mm_fx_tick(tick) {
	return _frame     ? { type: 1, tid: _frame(tick) } :
		 _immediate ? { type: 2, tid: _immediate(tick) }
					 : { type: 0, tid: setTimeout(tick, 4) }
}
_defineLibraryAPIs(mm.mix);
})(this.self || global);
var uu;
uu || (function(global, document) {
function _defineLibraryAPIs(mix) {
	uu = mix(uu_factory, {
		docs:       "http://code.google.com/p/mofmof-js/wiki/",
		node:       uu_node,
		head:       function(/* ... */) { return uu_node(document.head, arguments); },
		body:       function(/* ... */) { return uu_node(document.body, arguments); },
		text:       function(text)      { return document.createTextNode(text); },
		query:      uu_query,
		attr:   mix(uu_attr, {
			set:    uu_attr_set
		}),
		css:    mix(uu_css, {
			set:    uu_css_set
		}),
		style:  mix(uu_style, {
			create: uu_style_create,
			add:    uu_style_add
		}),
		uid:        uu_uid,
		dump:       uu_dump,
		vendor:     uu_vendor,
		boot:       mm.env.ie8 ? uu_boot_ie678 : uu_boot,
		main:       uu_main,
		page:       uu_page
	});
	HTML_TAGS.split(",").each(function(tag) {
		uu[tag] = function(/* ... */) {
			return uu_node(document.createElement(tag), arguments);
		};
	});
}
function _polyfillAndExtend(wiz, HTMLElement, HTMLDocument) {
	wiz(document, {
		html:       document.documentElement,
		head:       document.getElementsByTagName("head")[0]
	});
	var extras = {
		on:         HTMLElement_on,
		one:        HTMLElement_one,
		off:        HTMLElement_off,
		add:        HTMLElement_add,
		cut:        HTMLElement_cut,
		top:        HTMLElement_top,
		has:        HTMLElement_has,
		find:       HTMLElement_find,
		clear:      HTMLElement_clear,
		path:       HTMLElement_path,
		addClass:   HTMLElement_addClass,
		hasClass:   HTMLElement_hasClass,
		toggleClass: HTMLElement_toggleClass,
		removeClass: HTMLElement_removeClass
	};
	wiz(HTMLElement.prototype,  extras);
	wiz(HTMLDocument.prototype, extras);
	global.NodeList && wiz(NodeList.prototype, {
		toArray:    Array.prototype.slice
	});
}
var HTML_TAGS =
		"a,b,br,button,dd,div,dl,dt,form,h1,h2,h3,h4,h5,h6,hr,i,img," +
		"iframe,input,li,ol,option,p,pre,select,span,table,tbody,tr," +
		"td,th,thead,tfoot,textarea,u,ul," +
		"abbr,article,aside,audio,canvas,datalist," +
		"details,eventsource,figure,footer,header,hgroup," +
		"mark,menu,meter,nav,output,progress,section,time,video",
	FIX_ATTR = {
		w:          "width",
		h:          "height",
		htmlFor:    "for",
		className:  "class"
	},
	FIX_STYLE = {
		x:          "left",
		y:          "top",
		w:          "width",
		h:          "height",
		b:          "border",
		m:          "margin",
		p:          "padding",
		c:          "color",
		bc:         "backgroundColor",
		bpx:        "backgroundPositionX",
		bpy:        "backgroundPositionY",
		o:          "opacity",
		fs:         "fontSize",
		fw:         "fontWeight",
		r:          "rotate",
		sx:         "scaleX",
		sy:         "scaleY",
		tx:         "translateX",
		ty:         "translateY",
		mb_x:       mm.env.mobile ? "translateX" : "left",
		mb_y:       mm.env.mobile ? "translateY" : "top"
	},
	NUMBER_SETTER = function(node, prop, value) { node.style[prop] = value; },
	STYLE_POLYFILL = {
		zIndex:     NUMBER_SETTER,
		opacity:    NUMBER_SETTER,
		lineHeight: NUMBER_SETTER,
		fontWeight: NUMBER_SETTER,
		userSelect: function(node, prop, value) { _userSelect(value !== "none"); }
	},
	VENDOR_PREFIX = mm.env.webkit ? "Webkit" :
					mm.env.gecko  ? "Moz" :
					mm.env.ie     ? "ms" :
					mm.env.opera  ? "O" : "";
function uu_factory(mix
					/*, ... */) {
	var rv, i, iz, args,
		isary = Array.isArray(mix),
		query = isary ? mix[0] : mix,
		ctx =  (isary ? mix[1] : null) || document;
	rv = mix.nodeType ? [mix]
	 : typeof query === "string" ? ctx.find(query)
	 : mix;
	if (arguments.length >= 2) {
		args = Array.prototype.slice.call(arguments, 1);
		for (i = 0, iz = rv.length; i < iz; ++i) {
			uu_node.call({ clone: !!i }, rv[i], args);
		}
	}
	return rv;
}
function uu_query(query) {
	return Array.isArray(query) ? query[1].find(query[0])
								: document.find(query);
}
function uu_node(node, args) {
	if (!args || !args.length) {
		return node;
	}
	args = mm.cast.list(args);
	var token, isstr, match, prop = 0,
		i = 0, iz = args.length,
		at = /@@/g;
	for (; i < iz; ++i) {
		token = args[i];
		if (token.nodeType) {
			this.clone ? node.appendChild(token.cloneNode(true))
					 : node.appendChild(token);
		} else {
			isstr = typeof token === "string";
			if (isstr) {
				if (token.indexOf("@@") >= 0) {
					match = token.match(at).length;
					token = args.slice(i + 1, i + match + 1).at(args[i]);
					i += match;
				}
				if (token.indexOf("::") === 0) {
					node.appendChild(document.createTextNode(token.slice(2)));
					continue;
				}
			}
			switch (++prop) {
			case 1: token && uu_attr_set(node, isstr ? token.unpack()
													 : token);
					break;
			case 2: token && uu_css_set( node, isstr ? token.unpack()
													 : token);
					break;
			default:
				throw new Error(token);
			}
		}
	}
	return node;
}
function uu_uid(node) {
	var mark = "data-uuuid",
		rv = node[mark];
	if (!rv) {
		node[mark] = rv = mm.uid("uu_uid");
	}
	return rv;
}
function uu_dump(node, space, depth) {
	typeof node === "string" && (node = document.querySelector(node));
	node  = (!node || node === document) ? document.documentElement : node;
	space = space === void 0 ? 4 : space;
	depth = depth || 5;
	return '"<' + node.nodeName.toLowerCase() + '>":' +
		 (space ? " "  : "") + _uu_dump(node, space, depth, 1);
}
function _uu_dump(mix, space, depth, nest) {
	function _dumpArray(mix) {
		if (!mix.length) {
			return "[]";
		}
		var ary = [], i = 0, iz = mix.length;
		for (; i < iz; ++i) {
			ary.push(indent + _uu_dump(mix[i], space, depth, nest + 1));
		}
		return "[" + lf + ary.join("," + lf) +
					 lf + " ".repeat(space * (nest - 1)) + "]";
	}
	function _dumpHash(mix) {
		var ary = [], key,
			keys = Object.keys(mix).sort(), i = 0, iz = keys.length,
			name = mix.__CLASS__ ? "mm." + mix.__CLASS__ + sp
				 : mix.nickname  ? mix.nickname("anonymous") + sp : "";
		if (!iz) {
			return name + "{}";
		}
		for (; i < iz; ++i) {
			key = keys[i];
			ary.push(indent + '"' + key + '":' + sp +
					 _uu_dump(mix[key], space, depth, nest + 1));
		}
		return name + "{" + lf + ary.join("," + lf) +
							lf + " ".repeat(space * (nest - 1)) + "}";
	}
	function _dumpNode(node) {
		var ary = [],
			attr = uu_attr(node), key, text;
		if (!/html|head|body|title|meta|script|link|style/i.test(node.nodeName)) {
			ary.push(indent + '"query":' + sp + '"' + uu.path(node) + '"');
		}
		for (key in attr) {
			ary.push(indent + '"' + key + '":' + sp + '"' + attr[key] + '"');
		}
		for (node = node.firstChild; node; node = node.nextSibling) {
			switch (node.nodeType) {
			case 1:
				ary.push(indent + '"<' + node.nodeName.toLowerCase() + '>":' + sp +
						 _uu_dump(node, space, depth, nest + 1));
				break;
			case 3:
				text = (node.textContent || "").crlf(" ").trim().overflow(30);
				text && ary.push(indent + '"text":' + sp + '"' + text + '"');
			}
		}
		return name + "{" + lf + ary.join("," + lf) +
							lf + " ".repeat(space * (nest - 1)) + "}";
	}
	if (depth && nest > depth) {
		return "...";
	}
	var lf = space ? "\n" : "",
		sp = space ? " "  : "",
		indent = " ".repeat(space * nest);
	switch (mm.type(mix)) {
	case "null":      return "null";
	case "undefined": return "undefined";
	case "global":    return "global";
	case "boolean":
	case "number":    return "" + mix;
	case "date":      return mix.toJSON();
	case "regexp":    return "/" + mix.source + "/";
	case "node":      return _dumpNode(mix);
	case "list":
	case "array":     return _dumpArray(mix);
	case "style":     return _dumpHash(mm.cast.style(mix));
	case "attr":      return _dumpHash(mm.cast.attr(mix));
	case "object":
	case "function":  return _dumpHash(mix);
	case "string":    return '"' + mix + '"';
	}
	return "";
}
function uu_vendor(sample) {
	var rv = "", ary = sample.split("-"), i = 1, iz = ary.length;
	for (rv = ary[0]; i < iz; ++i) {
		rv += ary[i].up(0);
	}
	return { base: rv, prefixed: VENDOR_PREFIX + rv.up(0) };
}
function uu_attr(node, key, value) {
	typeof node === "string" && (node = document.querySelector(node));
	switch (mm.complex(key, value)) {
	case 1: return mm.cast.attr(node.attributes || []);
	case 2: return (node.getAttribute( FIX_ATTR[key] || key ) || "") + "";
	case 3: key = mm.pair(key, value);
	}
	return uu_attr_set(node, key);
}
function uu_attr_set(node, hash) {
	typeof node === "string" && (node = document.querySelector(node));
	for (var attr in hash) {
		switch (attr) {
		case "checked":
		case "disabled": node[attr] = !!hash[attr];
			break;
		default:
			node.setAttribute( FIX_ATTR[attr] || attr, hash[attr]);
		}
	}
	return node;
}
function uu_css(node, key, value) {
	typeof node === "string" && (node = document.querySelector(node));
	switch (mm.complex(key, value)) {
	case 1: return mm.cast.style(global.getComputedStyle(node));
	case 2: return global.getComputedStyle(node)[ FIX_STYLE[key] || key ] || "";
	case 3: return uu_css_set(node, mm.pair(key, value));
	}
	return uu_css_set(node, key);
}
function uu_css_set(node, hash) {
	typeof node === "string" && (node = document.querySelector(node));
	var prop, value, vend, polyfill, isnum = /\d$/;
	for (prop in hash) {
		value = hash[prop] + "";
		prop = FIX_STYLE[prop] || prop;
		polyfill = STYLE_POLYFILL[prop];
		if (polyfill) {
			polyfill(node, prop, value);
		} else {
			isnum.test(value) && (value += "px");
			if (node.style[prop] !== void 0) {
				node.style[prop] = value + "";
			} else {
				vend = VENDOR_PREFIX + prop.up(0);
				if (node.style[vend] !== void 0) {
					node.style[vend] = value + "";
				}
			}
		}
	}
	return node;
}
function uu_style() {
}
function uu_style_create(id, rules) {
	var rv;
	if (id) {
		rv = document.querySelector("#" + id);
	}
	if (!rv) {
		if ("textContent" in document.documentElement) {
			rv = document.createElement("style");
			rv.id = id;
			rv.textContent = rules;
			document.head.appendChild(rv);
		}
	}
	return rv;
}
function uu_style_add(id, rules) {
	mm.deny("TODO: NOT IMPL", "string");
}
function _userSelect(on) {
	var body = document.body,
		vend = uu_vendor("user-select");
	if (body.style[vend.base] !== void 0) {
		body.style[vend.base] = on ? "" : "none";
	} else if (body.style[vend.mod] !== void 0) {
			 body.style[vend.mod] = on ? "" : "none";
	}
}
function uu_boot(fn_that) {
	function _callback() {
		var fn   = fn_that[0] || fn_that,
			that = fn_that[1] || null;
		fn.call(that);
	}
	if (document.readyState === "complete") {
		_callback();
	} else {
		document.addEventListener("DOMContentLoaded", _callback, false);
	}
}
function uu_main(fn_that) {
	var fn   = fn_that[0] || fn_that,
		that = fn_that[1] || null;
	if (document.readyState === "complete") {
		fn.call(that);
	} else {
		global.addEventListener("load", function() {
			fn.call(that);
		}, false);
	}
}
function uu_page(path
				 /*, ... */) {
	path = path || location + "";
	var ary = [].slice.call(arguments).slice(1), pattern, callback;
	while ((pattern = ary.shift()) && (callback = ary.shift())) {
		if (path.indexOf(pattern) >= 0 || RegExp(pattern).test(path)) {
			return callback();
		}
	}
	pattern();
};
function HTMLElement_on(type, fn) {
	this.__EVENT__ = _eventWalker(this.__EVENT__ || [], function(t, f) {
		return type === t && fn === f;
	});
	this.__EVENT__.push(type, fn);
	this.addEventListener(type, fn, false);
	return this;
}
function HTMLElement_one(type, fn) {
	var that = this;
	this.__EVENT__ = _eventWalker(this.__EVENT__ || [], function(t, f) {
		return type === t && fn === f;
	});
	this.__EVENT__.push(type, fn);
	this.addEventListener(type, function(ev) {
		fn.handleEvent ? fn.handleEvent(ev)
					 : fn.call(that, ev);
		that.removeEventListener(type, fn, false);
	}, false);
	return this;
}
function HTMLElement_off(type, fn) {
	var that = this;
	this.__EVENT__ = _eventWalker(this.__EVENT__ || [], function(t, f) {
		var match = type && fn ? type === t && fn === f
				 : type       ? type === t
				 : fn         ? fn   === f
				 : true;
		if (match) {
			that.removeEventListener(t, f, false);
		}
		return match;
	});
	return this;
}
function _eventWalker(ary, fn) {
	var rv = [], i = 0, iz = ary.length;
	for (; i < iz; i += 2) {
		if (!fn(ary[i], ary[i + 1])) {
			rv.push(ary[i], ary[i + 1]);
		}
	}
	return rv;
}
function HTMLElement_add(node) {
	node && this.appendChild(node);
	return this;
}
function HTMLElement_cut() {
	if (this.parentNode) {
		this.parentNode.removeChild(this);
	}
	return this;
}
function HTMLElement_top(node) {
	node && this.insertBefore(node, this.firstChild);
	return this;
}
function HTMLElement_has(node) {
	if (node.nodeType) {
		while (node = node.parentNode) {
			if (this === node) {
				return true;
			}
		}
		return false;
	}
	return !!this.querySelector(node);
}
function HTMLElement_find(query, from, to) {
	var rv;
	if (mm.env.ie8) {
		rv = mm.cast.list(this.querySelectorAll(query), from, to);
	} else {
		rv = this.querySelectorAll(query).toArray(from, to);
	}
	rv.cut = NodeArray_cut;
	rv.clear = NodeArray_clear;
	return rv;
}
function NodeArray_cut() {
	return NodeArray_each(this, "cut");
}
function NodeArray_clear() {
	return NodeArray_each(this, "clear");
}
function NodeArray_each(ary, method) {
	var i = ary.length;
	while (i--) {
		ary[i][method]();
	}
	return ary;
}
function HTMLElement_clear() {
	while (this.lastChild) {
		this.removeChild(this.lastChild);
	}
	return this;
}
function HTMLElement_path() {
	var rv = [], curt = this, feat, index,
		roots = /^(?:html|head|body)$/i;
	while (curt && curt.nodeType === 1) {
		feat = "";
		if (roots.test(curt.nodeName)) {
			rv.push(curt.nodeName);
			break;
		}
		if (curt.className) {
			feat = "." + curt.className;
		}
		if (curt.id) {
			feat += "#" + curt.id;
		} else if (curt.parentNode &&
				 curt.parentNode.children.length > 1) {
			index = mm.cast.list(curt.parentNode.children).indexOf(curt);
			feat += ":nth-child(" + (index + 1) + ")";
		}
		rv.push(curt.nodeName + feat);
		curt = curt.parentNode;
	}
	return rv.reverse().join(">").toLowerCase();
}
function HTMLElement_addClass(name) {
	name = name.trim();
	this.hasClass(name) || (this.className += " " + name);
	return this;
}
function HTMLElement_removeClass(name) {
	name = name.trim();
	this.className = (" " + this.className + " ").replace(" " + name + " ", "").trim();
	return this;
}
function HTMLElement_toggleClass(name) {
	name = name.trim();
	var rv = this.hasClass(name);
	rv ? this.removeClass(name) : this.addClass(name);
	return !rv;
}
function HTMLElement_hasClass(name) {
	name = name.trim();
	return (" " + this.className + " ").indexOf(" " + name + " ") >= 0;
}
function _prebuildCamelizedStyleDB() {
	var DECAMELIZE = /([a-z])([A-Z])/g,
		NEXT_TOKEN = /-[a-z]/g,
		key, value, prefixed,
		htmlNode = document.documentElement,
		props = mm.env.webkit ? global.getComputedStyle(htmlNode, 0)
							 : htmlNode.style;
	if (mm.env.webkit) {
		for (key in props) {
			if (typeof props[key] === "string") {
				key = value = props.item(key);
				if (key.indexOf("-") >= 0) {
					value = key.replace(NEXT_TOKEN, function(m) {
						return m[1].toUpperCase();
					});
				}
				FIX_STYLE[key]   = value;
				FIX_STYLE[value] = value;
			}
		}
	} else {
		for (key in props) {
			if (typeof props[key] === "string") {
				prefixed = ((mm.env.gecko && !key.indexOf("Moz")) ? "-moz" + key.slice(3) :
							(mm.env.ie    && !key.indexOf("ms"))  ? "-ms"  + key.slice(2) :
							(mm.env.opera && !key.indexOf("O"))   ? "-o"   + key.slice(1) : key);
				value = prefixed.replace(DECAMELIZE, function(_, chr, Chr) {
							return chr + "-" + Chr.toLowerCase();
						});
				FIX_STYLE[value] = key;
				FIX_STYLE[key]   = key;
			}
		}
	}
}
if (typeof module !== "undefined") {
	module.exports = { uu: uu_factory };
}
_defineLibraryAPIs(mm.mix);
_polyfillAndExtend(mm.wiz, global.HTMLElement  || global.Element,
						 global.HTMLDocument || global.Document);
uu.boot(function() {
	_prebuildCamelizedStyleDB();
	global.boot && global.boot();
	global.main && uu_main(global.main);
});
})(this.self || global, this.document);
(function(global, document, getComputedStyle) {
function _defineLibraryAPIs(mix) {
	uu.BORDER =     0x1;
	uu.MARGIN =     0x2;
	uu.PADDING =    0x4;
	uu.calc = {
		px:         uu_calc_px,
		edge:       uu_calc_edge,
		offset:     uu_calc_offset,
		boxSize:    uu_calc_boxSize,
		boxRect:    uu_calc_boxRect,
		vboxSize:   uu_calc_vboxSize,
		vboxRect:   uu_calc_vboxRect
	};
	uu.css.box = mix(uu_css_box, {
		attach:     uu_css_box_attach,
		detach:     uu_css_box_detach
	});
}
function uu_calc_px(node, value) {
	return isFinite(value)   ? +value
		 : /px$/.test(value) ? parseFloat(value) || 0
		 : /pt$/.test(value) ? (parseFloat(value) * 4 / 3) | 0
		 : /em$/.test(value) ? _calcEmByFontSize(node, value)
		 : _calcPixelByProperty(node, value, "left");
}
function _calcEmByFontSize(node, value) {
	var fontSize = getComputedStyle(node, 0).fontSize,
		bias = /pt$/.test(fontSize) ? 4 / 3
									: 1;
	return (parseFloat(value) * parseFloat(fontSize) * bias) | 0;
}
function _calcPixelByProperty(node, value, by) {
	var ns = node.style,
		mem = [ns.left, 0, 0];
	if (mm.env.webkit) {
		mem[1] = ns.getPropertyValue("position");
		mem[2] = ns.getPropertyValue("display");
		ns.setProperty("position", "absolute", "important");
		ns.setProperty("display",  "block",    "important");
	}
	ns.setProperty(by, value, "important");
	value = parseInt(getComputedStyle(node).left);
	ns.removeProperty(by);
	ns.setProperty(by, mem[0], "");
	if (mm.env.webkit) {
		ns.removeProperty("position");
		ns.removeProperty("display");
		ns.setProperty("position", mem[1], "");
		ns.setProperty("display",  mem[2], "");
	}
	return value || 0;
}
function uu_calc_edge(node, menu) {
	menu = menu || (uu.BORDER | uu.MARGIN | uu.PADDING);
	var db = {
			"0px": 0, "1px": 1, "2px": 2, "3px": 3, thin: 1, medium: 3, thick: 5
		},
		cs = getComputedStyle(node, 0), n, undef, auto = "auto",
		mt = cs.marginTop,
		ml = cs.marginLeft,
		mr = cs.marginRight,
		mb = cs.marginBottom,
		bt = cs.borderTopWidth,
		bl = cs.borderLeftWidth,
		br = cs.borderRightWidth,
		bb = cs.borderBottomWidth,
		pt = cs.paddingTop,
		pl = cs.paddingLeft,
		pr = cs.paddingRight,
		pb = cs.paddingBottom;
	if (menu & uu.MARGIN) {
		mt = ((n = db[mt]) === undef) ? uu_calc_px(node, mt) : n;
		ml = ((n = db[ml]) === undef) ? uu_calc_px(node, ml) : n;
		mr = ((n = db[mr]) === undef) ? uu_calc_px(node, mr) : n;
		mb = ((n = db[mb]) === undef) ? uu_calc_px(node, mb) : n;
	}
	if (menu & uu.BORDER) {
		bt = ((n = db[bt]) === undef) ? bt === auto ? 0 : uu_calc_px(node, bt) : n;
		bl = ((n = db[bl]) === undef) ? bl === auto ? 0 : uu_calc_px(node, bl) : n;
		br = ((n = db[br]) === undef) ? br === auto ? 0 : uu_calc_px(node, br) : n;
		bb = ((n = db[bb]) === undef) ? bb === auto ? 0 : uu_calc_px(node, bb) : n;
	}
	if (menu & uu.PADDING) {
		pt = ((n = db[pt]) === undef) ? pt === auto ? 0 : uu_calc_px(node, pt) : n;
		pl = ((n = db[pl]) === undef) ? pl === auto ? 0 : uu_calc_px(node, pl) : n;
		pr = ((n = db[pr]) === undef) ? pr === auto ? 0 : uu_calc_px(node, pr) : n;
		pb = ((n = db[pb]) === undef) ? pb === auto ? 0 : uu_calc_px(node, pb) : n;
	}
	return {
		m: { top: mt, left: ml, right: mr, bottom: mb },
		b: { top: bt, left: bl, right: br, bottom: bb },
		p: { top: pt, left: pl, right: pr, bottom: pb }
	};
}
function uu_calc_offset(node, from) {
	function _offsetFromAncestor(node, from) {
		var x = 0, y = 0;
		while (node && node !== from) {
			x   += node.offsetLeft || 0;
			y   += node.offsetTop  || 0;
			node = node.offsetParent;
		}
		return { x: x, y: y, from: node ? from : document.html };
	}
	function _offsetFromLayoutParent(node) {
		var x = 0, y = 0, cs, from;
		while (node) {
			x   += node.offsetLeft || 0;
			y   += node.offsetTop  || 0;
			node = node.offsetParent;
			if (node) {
				cs = getComputedStyle(node).position;
				if (cs === "relative" || cs === "absolute") {
					from = node;
					break;
				}
			}
		}
		return { x: x, y: y, from: from || document.body };
	}
	if (!node || !node.parentNode) {
		return { x: 0, y: 0, from: null };
	}
	if (from) {
		return _offsetFromAncestor(node, from);
	}
	var cs = getComputedStyle(node);
	if (cs.position === "relative" || cs.position === "absolute") {
		if (cs.left !== "auto" && cs.left !== "0px" &&
			cs.top  !== "auto" && cs.top  !== "0px") {
			return { x: parseInt(cs.left),
					 y: parseInt(cs.top),
					 from: node.offsetParent };
		}
	}
	return _offsetFromLayoutParent(node);
}
function uu_calc_boxSize(node) {
	var cs = getComputedStyle(node);
	return { w: parseFloat(cs.width), h: parseFloat(cs.height) };
}
function uu_calc_boxRect(node, from) {
	var rv = uu_calc_offset(node, from),
		r  = uu_calc_boxSize(node);
	rv.w = r.w;
	rv.h = r.h;
	return rv;
}
function uu_calc_vboxSize(node) {
	var rect = node.getBoundingClientRect(), w = 0, h = 0;
	w = node.offsetWidth  || (rect.right - rect.left);
	h = node.offsetHeight || (rect.bottom - rect.top);
	return { w: w, h: h };
}
function uu_calc_vboxRect(node, from) {
	var rv = uu_calc_offset(node, from),
		r  = uu_calc_vboxSize(node);
	rv.w = r.w;
	rv.h = r.h;
	return rv;
}
function uu_css_box() {
}
function uu_css_box_attach(node) {
	node.style.position = "static";
	return {};
}
function uu_css_box_detach(node) {
	var offset = uu_calc_offset(node),
		margin = uu_calc_edge(node, uu.MARGIN).m,
		ns = node.style,
		x = offset.x - margin.left,
		y = offset.y - margin.top;
	ns.left = x + "px";
	ns.top  = y + "px";
	ns.position = "absolute";
	return { x: x, y: y, offset: offset, margin: margin };
}
_defineLibraryAPIs(mm.mix);
})(this, this.document, this.getComputedStyle);