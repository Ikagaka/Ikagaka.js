/*!mm={version:"",license:"MIT",author:"uupaa.js@gmail.com",date:"2012-10-17T15:22:19",tool:"google",target:"",cutoff:"assert/debug/spec/interface/ie/gecko/opera"}*/
//{@es
(function(global) { // @arg Global: window or global

function _polyfill() {
    if (!Object.keys) {
         Object.keys = Object_keys;     // Object.keys(obj:Mix):Array
    }

//{@ie8
    if (!Object.defineProperties) {
         Object.defineProperty =
                Object_defineProperty;  // Object.defineProperty
    }
//}@ie8

    // --- Override ---
    // [IE8] "2012-09-16T21:53:39Z" -> "2012-09-16T21:53:39.000Z" (supply Milliseconds)
    // [IE8][force overwrite]
//{@ie8
    if (Date.prototype.toJSON && (new Date).toJSON().length < 24) {
        Date.prototype.toJSON = Date_toJSON;
    }
//}@ie8

    // --- ES5, ES6 Methods ---
    wiz(Date, {
        now:        Date_now            // Date.now():Integer
    });
    wiz(Date.prototype, {
        toJSON:     Date_toJSON         // Date#toJSON():JSONObject
    });
    wiz(Array, {
        of:         Array_of,           // Array.of(...:Mix):Array
        from:       Array_from,         // Array.from(list:FakeArray):Array
        isArray:    Array_isArray       // Array.isArray(mix:Mix):Boolean
    });
    wiz(Array.prototype, {
        map:        Array_map,          // [].map(fn:Function, that:this):Array
        forEach:    Array_forEach,      // [].forEach(fn:Function, that:this)
        some:       Array_some,         // [].some(fn:Function, that:this):Boolean
        every:      Array_every,        // [].every(fn:Function, that:this):Boolean
        indexOf:    Array_indexOf,      // [].indexOf(mix:Mix, index:Integer = 0):Integer
        lastIndexOf:Array_lastIndexOf,  // [].lastIndexOf(mix:Mix, index:Integer = 0):Integer
        filter:     Array_filter,       // [].filter(fn:Function, that:this):Array
        reduce:     Array_reduce,       // [].reduce(fn:Function, init:Mix):Mix
        reduceRight:Array_reduceRight   // [].reduceRight(fn:Function, init:Mix):Mix
    });
    wiz(String.prototype, {
        trim:       String_trim,        // ""." trim both sp ".trim():String
        repeat:     String_repeat,      // "".repeat(count:Integer):String
        reverse:    String_reverse      // "".reverse():String
    });
    wiz(Number, {
        isNaN:      function(mix) { return typeof mix === "number" && global.isNaN(mix); },
        isFinite:   function(mix) { return typeof mix === "number" && global.isFinite(mix); },
        isInteger:  Number_isInteger,   // Number.isInteger(mix:Mix):Boolean
        toInteger:  Number_toInteger    // Number.toInteger(mix:Mix):Integer
    });
    wiz(Function.prototype, {
        bind:       Function_bind       // Function#bind():Function
    });
//{@JSON
    global.JSON || (global.JSON = {
        parse:          JSON_parse,     // JSON.parse(str:String)
        stringify:      JSON_stringify  // JSON.stringify():Object
    });
//}@JSON
//{@URI
    if (!global.encodeURIComponent) {
         global.encodeURIComponent = global_encodeURIComponent;
    }
    if (!global.decodeURIComponent) {
         global.decodeURIComponent = global_decodeURIComponent;
    }
//}@URI
}

// --- library scope vars ----------------------------------
var _INTEGER_TO_HEXSTRING_MAP;

// --- implement -------------------------------------------
function Object_keys(obj) { // @arg Object/Function/Array:
                            // @ret KeyStringArray: [key, ... ]
                            // @help: Object.keys
    var rv = [], key, i = 0;

//{@ie
    if (!obj.hasOwnProperty) {
        // [IE6][IE7][IE8] host-objects has not hasOwnProperty
        for (key in obj) {
            rv[i++] = key;
        }
    } else
//}@ie
    {
        for (key in obj) {
            obj.hasOwnProperty(key) && (rv[i++] = key);
        }
    }
    return rv;
}

//{@ie8
function Object_defineProperty(obj,          // @arg Object:
                               prop,         // @arg String: property name
                               descriptor) { // @arg Hash: { value, writable, get, set, configurable, enumerable }
                                             // @help: Object.defineProperty
// default property
//  Object.defineProperty(,, { configurable: false, enumerable: false, writable: false });

    var type = 0;

    "value" in descriptor && (type |= 0x1); // data descriptor
    "get"   in descriptor && (type |= 0x2); // accessor descriptor
    "set"   in descriptor && (type |= 0x4); // accessor descriptor

    if (type & 0x1 && type & 0x6) {
        throw new TypeError("BAD_ARG");
    }
    type & 0x1 && (obj[prop] = descriptor.value);
    type & 0x2 && obj.__defineGetter__(prop, descriptor.get); // [IE8]
    type & 0x4 && obj.__defineSetter__(prop, descriptor.set); // [IE8]
}
//}@ie8

// --- ES5, ES6 --------------------------------------------
function Date_now() { // @ret Integer: milli seconds
                      // @desc: get current time
                      // @help: Date.now
    return +new Date();
}

function Array_isArray(mix) { // @arg Mix:
                              // @ret Boolean:
                              // @help: Array.isArray
    return Object.prototype.toString.call(mix) === "[object Array]";
}

function Array_map(fn,     // @arg Function:
                   that) { // @arg this(= undefined): fn this
                           // @ret Array: [element, ... ]
                           // @help: Array#map
    var i = 0, iz = this.length, rv = Array(iz);

    for (; i < iz; ++i) {
        if (i in this) {
            rv[i] = fn.call(that, this[i], i, this);
        }
    }
    return rv;
}

function Array_forEach(fn,     // @arg Function:
                       that) { // @arg this(= undefined): fn this
                               // @help: Array#forEach
    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        i in this && fn.call(that, this[i], i, this);
    }
}

function Array_some(fn,     // @arg Function:
                    that) { // @arg this(= undefined): fn this
                            // @ret Boolean:
                            // @help: Array#some
    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this && fn.call(that, this[i], i, this)) {
            return true;
        }
    }
    return false;
}

function Array_every(fn,     // @arg Function:
                     that) { // @arg this(= undefined): fn this
                             // @ret Boolean:
                             // @help: Array#every
    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this && !fn.call(that, this[i], i, this)) {
            return false;
        }
    }
    return true;
}

function Array_filter(fn,     // @arg Function:
                      that) { // @arg this(= undefined): fn this
                              // @ret Array: [element, ... ]
                              // @help: Array#filter
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

function Array_reduce(fn,         // @arg Function:
                      init,       // @arg Mix(= undefined): initial value
                      __back__) { // @hidden Boolean(= false): true is reduce right
                                  // @ret Mix:
                                  // @throw: Error("BAD_ARG")
                                  // @help: Array#reduce
    var rv,
        ate  = 0,          // ate init
        back = !!__back__, // back track
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

function Array_reduceRight(fn,     // @arg Function:
                           init) { // @arg Mix(= undefined): initial value
                                   // @ret Mix:
                                   // @help: Array#reduceRight
    return Array_reduce.call(this, fn, init, true);
}

function Array_indexOf(mix,     // @arg Mix: search element
                       index) { // @arg Integer(= 0): from index
                                // @ret Integer: found index or -1
                                // @help: Array#indexOf
    var i = index || 0, iz = this.length;

    i = (i < 0) ? i + iz : i;
    for (; i < iz; ++i) {
        if (i in this && this[i] === mix) {
            return i;
        }
    }
    return -1;
}

function Array_lastIndexOf(mix,     // @arg Mix: search element
                           index) { // @arg Integer(= this.length): from index
                                    // @ret Integer: found index or -1
                                    // @help: Array#lastIndexOf
    var i = index, iz = this.length;

    i = (i < 0) ? i + iz + 1 : iz;
    while (--i >= 0) {
        if (i in this && this[i] === mix) {
            return i;
        }
    }
    return -1;
}

function String_trim() { // @ret String:
                         // @desc: trim both spaces
                         // @help: String#trim
    return this.replace(/^\s+/, "").
                replace(/\s+$/, "");
}

function Array_of(ooo) { // @var_args Mix: values
                         // @ret Array:
                         // @desc: Array.of(1, 2, 3) -> [1, 2, 3]
                         // @help: Array.of
    return Array.prototype.slice.call(arguments);
}

function Array_from(fakeArray) { // @arg FakeArray: Arguments or NodeList
                                 // @ret Array/NodeArray:
                                 // @help: Array.from
    var rv = [], i = 0, iz = fakeArray.length;

    for (; i < iz; ++i) {
        rv.push(fakeArray[i]);
    }
    return rv;
}

function Date_toJSON() { // @ret String: "2000-01-01T00:00:00.000Z"
                         // @help: Date#toJSON
    var dates = { y:  this.getUTCFullYear(),         // 1970 -
                  m:  this.getUTCMonth() + 1,        //    1 - 12
                  d:  this.getUTCDate() },           //    1 - 31
        times = { h:  this.getUTCHours(),            //    0 - 23
                  m:  this.getUTCMinutes(),          //    0 - 59
                  s:  this.getUTCSeconds(),          //    0 - 59
                  ms: this.getUTCMilliseconds() };   //    0 - 999

    return dates.y + "-" + (dates.m < 10 ? "0" : "") + dates.m + "-" +
                           (dates.d < 10 ? "0" : "") + dates.d + "T" +
                           (times.h < 10 ? "0" : "") + times.h + ":" +
                           (times.m < 10 ? "0" : "") + times.m + ":" +
                           (times.s < 10 ? "0" : "") + times.s + "." +
                           ("00" + times.ms).slice(-3) + "Z";
}


function Number_isInteger(mix) { // @arg Mix:
                                 // @ret Boolean:
                                 // @desc: is integer
                                 // @help: Number.isInteger
    return typeof mix === "number" && global.isFinite(mix) &&
                  mix > -0x20000000000000 &&
                  mix <  0x20000000000000 &&
                  Math.floor(mix) === mix;
}

function Number_toInteger(mix) { // @arg Mix:
                                 // @ret Integer:
                                 // @desc: to integer
                                 // @help: Number.toInteger
    var num = +mix;

    if (num !== num) { // isNaN(num)
        return +0;
    }
    if (num === 0 || !global.isFinite(num)) {
        return num;
    }
    return (num < 0 ? -1 : 1) * Math.floor(Math.abs(num));
}

function String_repeat(count) { // @arg Integer: repeat count. if (0 < count) then 0
                                // @ret String: repeated string
                                // @desc: repeat strings
                                // @help: String#repeat
    return (this.length && count > 0) ? Array((count + 1) | 0).join(this)
                                      : "";
}

function String_reverse() { // @ret String:
                            // @desc: reverse characters
                            // @help: String#reverse
    return this.split("").reverse().join("");
}

function Function_bind(context, // @arg that: context
                       ooo) {   // @var_args Mix: arguments
                                // @ret Function:
                                // @help: Function#bind
    var rv, that = this,
        args = Array.prototype.slice.call(arguments, 1),
        fn = function() {};

    rv = function(ooo) { // @var_args Mix: bound arguments
        return that.apply(this instanceof fn ? this : context,
                    Array.prototype.concat.call(
                            args,
                            Array.prototype.slice.call(arguments)));
    };
    fn.prototype = that.prototype;
    rv.prototype = new fn();
    return rv;
}

//{@JSON
function JSON_parse(str) { // @arg String: JSON String
                           // @ret Mix:
                           // @throw: SyntaxError("Unexpected token: ...")
                           // @desc: decode from JSONString
                           // @help: JSON.parse
    var unescaped = str.trim().replace(/"(\\.|[^"\\])*"/g, "");

    if (/[^,:{}\[\]0-9\.\-+Eaeflnr-u \n\r\t]/.test(unescaped)) {
        throw new SyntaxError("Unexpected token:" + str);
    }
    return (new Function("return " + str))(); // raise error
}

function JSON_stringify(obj) { // @arg Mix:
                               // @ret JSONString:
                               // @see: http://developer.mozilla.org/En/Using_native_JSON
                               // @throw: TypeError("Converting circular structure to JSON")
                               // @help: JSON.stringify
                               // @desc: encode to JSONString
    return _recursiveJSONStringify(obj, 0);
}

function _recursiveJSONStringify(mix,    // @arg Mix: value
                                 nest) { // @arg Number: current nest level
                                         // @ret String:
                                         // @inner: json inspect
    var rv = [], ary, key, i, iz,
        type = typeof mix,
        brackets = ["{", "}"];

    if (nest >= 100) {
        throw new TypeError("Converting circular structure to JSON");
    }

    if (mix == null) {   //  null  or  undefined
        return mix + ""; // "null" or "undefined"
    }
    if (mix.toJSON) {    // Date#toJSON
        return mix.toJSON();
    }
    if (type === "boolean" || type === "number") {
        return "" + mix;
    }
    if (type === "string") {
        return '"' + _toJSONEscapedString(mix) + '"';
    }
    if (mix.nodeType || (mix.exec && mix.test)) { // Node or RegExp
        // http://twitter.com/uupaa/statuses/81336979580661760
        return "{}";
    }
    if (Array.isArray(mix)) {
        brackets = ["[", "]"];
        for (i = 0, iz = mix.length; i < iz; ++i) {
            rv.push(_recursiveJSONStringify(mix[i], nest + 1));
        }
    } else { // isHash or other type
        ary = Object.keys(mix);
        for (i = 0, iz = ary.length; i < iz; ++i) { // uupaa-looper
            key = ary[i];
            rv.push('"' + _toJSONEscapedString(key) + '":' +
                          _recursiveJSONStringify(mix[key], nest + 1));
        }
    }
    return brackets[0] + rv.join(",") + brackets[1]; // "{...}" or "[...]"
}

function _toJSONEscapedString(str) { // @arg String:
                                     // @ret String:
                                     // @inner: to JSON escaped string
    var JSON_ESCAPE = {
            '\b': '\\b',    // backspace       U+0008
            '\t': '\\t',    // tab             U+0009
            '\n': '\\n',    // line feed       U+000A
            '\f': '\\f',    // form feed       U+000C
            '\r': '\\r',    // carriage return U+000D
            '"':  '\\"',    // quotation mark  U+0022
            '\\': '\\\\'    // reverse solidus U+005C
        };

    return str.replace(/(?:[\b\t\n\f\r\"]|\\)/g, function(_) {
                return JSON_ESCAPE[_];
            }).replace(/(?:[\x00-\x1f])/g, function(_) {
                return "\\u00" +
                       ("0" + _.charCodeAt(0).toString(16)).slice(-2);
            });
}
//}@JSON

//{@URI
function global_encodeURIComponent(str) { // @arg String:
                                          // @ret String: percent encoded string
                                          // @desc: encode symbol in string.
//{@debug
    mm.allow(str, "String");
//}@debug

    var rv = [], i = 0, iz = str.length, c = 0, safe, map;

    map = _INTEGER_TO_HEXSTRING_MAP || _createMap();

    for (; i < iz; ++i) {
        c = str.charCodeAt(i);

        if (c < 0x80) { // encode ASCII(0x00 ~ 0x7f)
            safe = c === 95 ||              // _
                   (c >= 48 && c <=  57) || // 0~9
                   (c >= 65 && c <=  90) || // A~Z
                   (c >= 97 && c <= 122);   // a~z

            if (!safe) {
                safe = c === 33  || // !
                       c === 45  || // -
                       c === 46  || // .
                       c === 126 || // ~
                       (c >= 39 && c <= 42); // '()*
            }
            if (safe) {
                rv.push(str.charAt(i));
            } else {
                rv.push("%", map[c]);
            }
        } else if (c < 0x0800) { // encode UTF-8
            rv.push("%", map[((c >>>  6) & 0x1f) | 0xc0],
                    "%", map[ (c         & 0x3f) | 0x80]);
        } else if (c < 0x10000) { // encode UTF-8
            rv.push("%", map[((c >>> 12) & 0x0f) | 0xe0],
                    "%", map[((c >>>  6) & 0x3f) | 0x80],
                    "%", map[ (c         & 0x3f) | 0x80]);
        }
    }
    return rv.join("");

    function _createMap() { // { 0: "00", ... 255: "ff" }
        var i = 0x100, iz = 0x200;

        _INTEGER_TO_HEXSTRING_MAP = {};
        for (; i < iz; ++i) {
            _INTEGER_TO_HEXSTRING_MAP[i - 0x100] = i.toString(16).slice(-2);
        }
        return _INTEGER_TO_HEXSTRING_MAP;
    }
}

function global_decodeURIComponent(str) { // @arg String: percent encoded string
                                          // @ret String:
                                          // @throws: Error("BAD_ARG")
                                          // @desc: decode string. like decodeURIComponent
                                          //        `` %xx 形式の文字列をデコードします
                                          //           decodeURIComponent 互換です
//{@debug
    mm.allow(str, "String");
//}@debug

    return str.replace(/(%[\da-f][\da-f])+/g, function(match) {
        var rv = [],
            ary = match.split("%").slice(1), i = 0, iz = ary.length,
            a, b, c;

        for (; i < iz; ++i) {
            a = parseInt(ary[i], 16);

            if (a !== a) { // isNaN(a)
                throw new Error("BAD_ARG");
            }

            // decode UTF-8
            if (a < 0x80) { // ASCII(0x00 ~ 0x7f)
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
//}@URI

function wiz(object,   // @arg Object: base object
             extend) { // @arg Object: properties
                       // @inner:
    var key, keys = Object.keys(extend), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        if (!(key in object)) {
            Object.defineProperty(object, key, {
                configurable: true, // false is immutable
                enumerable: false,  // false is invisible
                writable: true,     // false is read-only
                value: extend[key]
            });
        }
    }
}

// --- export ---
_polyfill();

})(this.self || global);
//}@es
var mm; // global.mm - mofmof.js library namespace

mm || (function(global) { // @arg Global: window or global

// --- mofmof ----------------------------------------------
function _defineLibraryAPIs(mix) {

    // --- Typical types ---
    //  Mix: Any type
    //  Hash: Key / Value store
    //  Array: Dense or Sparse Array
    //  Global: window or global object
    //  Integer: Number without a fractional
    //  ModArray: Modified Array. Array + { key: fn/value, ... }
    //  Function: Executable Object
    //  Primitive: undefined, null, Boolean, Number and String
    //
    mm = mix(HashFactory, {             // mm(obj:Object/Hash):Hash
        // --- Interface and Class ---
        Interface:  Interface,          // mm.Interface(name:String, spec:Object)
        Class:      ClassFactory,       // mm.Class(specs:String, properties:Object = undefined,
                                        //                        statics:Object = undefined):Function
        // --- key / value store ---
        Hash:       Hash,               // mm.Hash(obj:Object):Hash
        // --- await some processes ---
        Await:      Await,              // mm.Await(fn:Function, waits:Integer, tick:Function = undefined):Await
        // --- messageing ---
        Msg:        Msg,                // mm.Msg()
        imsg:       {},                 // mm.imsg - Msg instance pool
        // --- mixin ---
        arg:        mm_arg,             // mm.arg(arg:Object/Function/undefined, defaults:Object):Object
        mix:        mm_mix,             // mm.mix(base:Object/Function, extend:Object, override:Boolean = false):Object/Function
        wiz:        mm_wiz,             // mm.wiz(base:Object/Function, extend:Object, override:Boolean = false)
        // --- match ---
        has:        mm_has,             // mm.has(data:Mix, find:Mix):Boolean
        like:       mm_like,            // mm.like(lval:Mix, rval:Mix):Boolean
        some:       mm_some,            // mm.some(data:Object/Function/Array/Hash, fn:Function):Boolean
        every:      mm_every,           // mm.every(data:Object/Function/Array/Hash, fn:Function):Boolean
        match:      mm_match,           // mm.match(data:Object/Function/Array/Hash, fn:Function):Mix
        // --- format ---
        // --- filter ---
        // --- iterate ---
        map:        mm_map,             // mm.map(data:Object/Function/Array/Hash, fn:Function):Array
        each:       mm_each,            // mm.each(data:Object/Function/Array/Hash, fn:Function)
        // --- generate ---
        uid:        mm_uid,             // mm.uid(group:String = ""):Integer
        copy:       mm_copy,            // mm.copy(mix:Primitive/Object/Date/RegExp/Array/Hash, depth:Integer = 0):Mix
        cast:       mm_cast,            // mm.cast(mix:Attr/Hash/List/FakeArray/Style/DateString/Mix):Object/Array/Date/Mix
        pair:       mm_pair,            // mm.pair(key:Object/Integer/String, value:Mix):Object
        wrap:       mm_wrap,            // mm.wrap(mix:Mix):Function
        clean:      mm_clean,           // mm.clean(data:Object/Function/Array/Hash, typeofFilter:String = ""):DenseObject
        // --- calculate ---
        // --- enumerate ---
        count:      mm_count,           // mm.count(data:Object/Function/Array/Hash):Object
        pick:       mm_pick,            // mm.pick(data:Object/Function/Array/Hash, names:String/StringArray):Array
        keys:       mm_keys,            // mm.keys(data:Object/Function/Array/Hash/Style/Node/Global):Array
        values:     mm_values,          // mm.values(data:Object/Function/Array/Hash/Style/Node/Global):Array
        // --- manipulate ---
        clear:      mm_clear,           // mm.clear(obj:Object/Function/Class):Object/Function/Class
        // --- utility ---
        nop:        mm_nop,             // mm.nop()
        conv:       mm_conv,            // mm.conv(from:CaseInsensitiveString, to:CaseInsensitiveString):Object
                                        // mm.conv("Integer",    "HexString")  {     0 : "00" ..   255 : "ff"}
                                        // mm.conv("HexString",  "Integer")    {   "00":   0  ..   "ff": 255 }
                                        // mm.conv("Integer",    "ByteString") {     0 :"\00" ..   255 :"\ff"}
                                        // mm.conv("ByteString", "Integer")    {  "\00":   0  ..  "\ff": 255 }
                                        //                                     {"\f780": 128  .."\f7ff": 255 }
        dump:       mm_dump,            // mm.dump(mix:Mix, spaces:Integer = 4, depth:Integer = 5):String
        strict:     mm_wrap(!this)(),   // mm.strict:Boolean - true is strict mode
        // --- assert / debug ---
        say:        mm_say,             // mm.say(...:Mix):String
        deny:       mm_deny,            // mm.deny(mix:Mix, types:Function/Boolean/TypeNameString)
        allow:      mm_allow,           // mm.allow(mix:Mix, types:Function/Boolean/TypeNameString)
        perf:       mm_perf,            // mm.perf() - calc performance data
        pollution:  mm_pollution,       // mm.pollution():StringArray - detect global object pollution
        // --- type detection ---
        type:   mix(mm_type, {          // mm.type(mix:Mix):String
            alias:  mm_type_alias       // mm.type.alias(obj:Object)
        }),
        complex:    mm_complex,         // mm.complex(arg1:String/Object, arg2:String/Number):Integer
        // --- log / log group ---
        log:    mix(mm_log, {           // mm.log(...:Mix)
            copy:   mm_log_copy,        // mm.log.copy():Object
            dump:   mm_log_dump,        // mm.log.dump(url:String = "")
            warn:   mm_log_warn,        // mm.log.warn(...:Mix)
            error:  mm_log_error,       // mm.log.error(...:Mix)
            clear:  mm_log_clear,       // mm.log.clear()
            limit:  0                   // mm.log.limit - Integer: stock length
        }),
        logg:   mix(mm_logg, {          // mm.logg(label:String/Function, mode:Integer = 0x0):Object
            nest:   0                   // mm.logg.nest - Number: nest level
        })
    });
    // --- url ---
//{@url
    mm.url = mix(mm_url, {              // mm.url(url:URLObject/URLString = ""):URLString/URLObject
        resolve:    mm_url_resolve,     // mm.url.resolve(url:URLString):URLString
        normalize:  mm_url_normalize,   // mm.url.normalize(url:URLString):URLString
        buildQuery: mm_url_buildQuery,  // mm.url.buildQuery(obj:URLObject, joint:String = "&"):URLQueryString
        parseQuery: mm_url_parseQuery   // mm.url.parseQuery(query:URLString/URLQueryString):URLQueryObject
    });
//}@url
    // --- environment ---
    mm.env = _detectEnv({
        ua:         "",                 // mm.env.ua     - String: user agent
        lang:       "en",               // mm.env.lang   - String: language. "en", "ja", ...
        secure:     false,              // mm.env.secure - Boolean: is SSL page
        // --- browser ---
        ie:         !!document.uniqueID,// mm.env.ie     - Boolean: is IE
        ie8:        false,              // mm.env.ie8    - Boolean: is IE 8
        ie9:        false,              // mm.env.ie9    - Boolean: is IE 9
        ie10:       false,              // mm.env.ie10   - Boolean: is IE 10
        ipad:       false,              // mm.env.ipad   - Boolean: is iPad
        gecko:      !!global.netscape,  // mm.env.gecko  - Boolean: is Gecko
        opera:      !!global.opera,     // mm.env.opera  - Boolean: is Opera
        chrome:     false,              // mm.env.chrome - Boolean: is Chrome, Chrome for Android, Chrome for iOS
        webkit:     false,              // mm.env.webkit - Boolean: is WebKit
        safari:     false,              // mm.env.safari - Boolean: is Safari, MobileSafari
        mobile:     false,              // mm.env.mobile - Boolean: is Mobile device
        // --- run at ... ---
        node:       !!(global.require &&
                       global.process), // mm.env.node   - Boolean: is node.js (run at Server)
        ngcore:     !!global.Core,      // mm.env.ngcore - Boolean: is ngCore (run at ngCore)
        browser:    !!(global.navigator &&
                       global.document),// mm.env.browser - Boolean: is Browser (run at Browser)
        titanium:   !!global.Ti,        // mm.env.titanium - Boolean: is Titanium (run at Titanium)
        // --- os ---
        ios:        false,              // mm.env.ios    - Boolean: is iOS
        mac:        false,              // mm.env.mac    - Boolean: is Mac OS X
        android:    false,              // mm.env.android - Boolean: is Android
        windows:    false,              // mm.env.windows - Boolean: is Windows
        // --- device ---
        touch:      false,              // mm.env.touch  - Boolean: is Touch device
        retina:     false               // mm.env.retina - Boolean: is Retina display. devicePixelRatio >= 2.0
    });
    // --- version ---
    mm.ver = {
        ie:         !mm.env.ie      ? 0 : _ver("MSIE "),        // 10, 9
        ios:        !mm.env.ios     ? 0 : _ver("OS "),          // 6, 5.1
        mac:        !mm.env.mac     ? 0 : _ver("Mac OS X"),     // 10.6
        gecko:      !mm.env.gecko   ? 0 : _ver("rv:"),          // 16, 15
        opera:      !mm.env.opera   ? 0 : parseFloat(global.opera.version()),
        chrome:     !mm.env.chrome  ? 0 : _ver("Chrome/"),      // 22
        webkit:     !mm.env.webkit  ? 0 : _ver("AppleWebKit/"), // 537,4, 534
        safari:     !mm.env.safari  ? 0 : _ver("Version/"),     // 6.0, 5.1
        android:    !mm.env.android ? 0 : _ver("Android"),      // 4.1, 4.0, 2.3
        windows:    !mm.env.windows ? 0 : _ver("Windows NT ")   // win8: 6.2, win7: 6.1, vista: 6, xp: 5.1
    };
    function _ver(rex) {
        return parseFloat(mm.env.ua.split(rex)[1].replace("_", ".")) || 1;
    }
    // --- vender prefix ---
    // mm.vender.fn - String: vender function prefix
    // mm.vender.css - String: vender css prefix
    // mm.vender.style - String: vender style property prefix
    mm.vender = mm.env.webkit ? { fn: "webkit",css: "-webkit-",style: "webkit" }
              : mm.env.gecko  ? { fn: "moz",   css: "-moz-",   style: "Moz"    }
              : mm.env.opera  ? { fn: "o",     css: "-o-",     style: "O"      }
              : mm.env.ie     ? { fn: "ms",    css: "-ms-",    style: "ms"     }
                              : { fn: "",      css: "",        style: ""       };
}

// --- Boolean, Date, Array, String, Number, Function, RegExp, Math ---
function _extendNativeObjects(mix, wiz) {

    // --- Type Detection ---
    wiz(Function.prototype, { __CLASS__: "function",typeFunction: true });
    wiz( Boolean.prototype, { __CLASS__: "boolean", typeBoolean:  true });
    wiz(  String.prototype, { __CLASS__: "string",  typeString:   true });
    wiz(  Number.prototype, { __CLASS__: "number",  typeNumber:   true });
    wiz(  RegExp.prototype, { __CLASS__: "regexp",  typeRegExp:   true });
    wiz(   Array.prototype, { __CLASS__: "array",   typeArray:    true });
    wiz(    Date.prototype, { __CLASS__: "date",    typeDate:     true });

    // --- Extension ---
    wiz(Date, {
//[ES]  now:        Date_now,           // Date.now():Integer
        from:       Date_from           // Date.from(dateString:String):Date
    });
    wiz(Date.prototype, {
        diff:       Date_diff,          // Date#diff(diffDate:Date/Integer):Object { days, times, toString }
        dates:      Date_dates,         // Date#dates():Object { y, m, d }
        times:      Date_times,         // Date#times():Object { h, m, s, ms }
        format:     Date_format         // Date#format(format:String = "I"):String
//[ES]  toJSON:     Date_toJSON         // Date#toJSON():JSONObject
    });
    wiz(Array, {
//[ES]  of:         Array_of,           // Array.of(...:Mix):Array
//[ES]  from:       Array_from,         // Array.from(list:FakeArray):Array
        range:      Array_range,        // Array.range(begin:Integer, end:Integer, filterOrStep:Function/Integer = 1):Array
        toArray:    Array_toArray,      // Array.toArray(mix:Mix/Array):Array
//[ES]  isArray:    Array_isArray,      // Array.isArray(mix:Mix):Boolean
        isCodedArray:Array_isCodedArray // Array.isCodedArray(mix:Mix):Boolean
    });
    wiz(Array.prototype, {
        // --- match ---
        has:        Array_has,          // [].has(find:Mix/MixArray):Boolean
        chain:      Array_chain,        // [].chain(param:Mix = undefined):Mix/undefined
        match:      Array_match,        // [].match(fn:Function, that:this):Mix
//[ES]  indexOf:    Array_indexOf,      // [].indexOf(mix:Mix, index:Integer = 0):Integer
//[ES]  lastIndexOf:Array_lastIndexOf,  // [].lastIndexOf(mix:Mix, index:Integer = 0):Integer
        // --- format ---
        at:         Array_at,           // [].at(format:String):String
        // --- filter ---
        sieve:      Array_sieve,        // [].sieve():Object
        unique:     Array_unique,       // [].unique():DenseArray
        reject:     Array_reject,       // [].reject(fn:Function):DenseArray
        select:     Array_select,       // [].select(fn:Function):DenseArray
//[ES]  filter:     Array_filter,       // [].filter(fn:Function, that:this):Array
        flatten:    Array_flatten,      // [].flatten():DenseArray
        // --- iterate ---
//[ES]  map:        Array_map,          // [].map(fn:Function, that:this):Array
        each:       Array.prototype.forEach,
                                        // [].each(fn:Function, that:this) - [alias]
//[ES]  some:       Array_some,         // [].some(fn:Function, that:this):Boolean
//[ES]  every:      Array_every,        // [].every(fn:Function, that:this):Boolean
//[ES]  forEach:    Array_forEach,      // [].forEach(fn:Function, that:this)
//[ES]  reduce:     Array_reduce,       // [].reduce(fn:Function, init:Mix):Mix
//[ES]  reduceRight:Array_reduceRight,  // [].reduceRight(fn:Function, init:Mix):Mix
        sync:       Array_sync,         // [].sync():ModArray { each, map, some, every }
        async:      Array_async,        // [].async(callback:Function, wait:Integer = 0,
                                        //          unit:Integer = 1000):ModArray { each, map, some, every }
        // --- generate ---
        copy:       Array_copy,         // [].copy(deep:Boolean = false):Array
        clean:      Array_clean,        // [].clean(typeofFilter:String = ""):DenseArray
/*
        toArray:    function() { return this; },
                                        // see: NodeList.prototype.toArray
                                        //      HTMLCollection.prototype.toArray
 */
        decode:     Array_decode,       // [].decode(code:String = "utf16",
                                        //           startIndex:Integer = 0, endIndex:Integer = undefined):String
        // --- calculate ---
        or:         Array_or,           // [].or(merge:Array):Array
        and:        Array_and,          // [].and(compare:Array):Array
        xor:        Array_xor,          // [].xor(compare:Array):Array
        sum:        Array_sum,          // [].sum():Number
        clamp:      Array_clamp,        // [].clamp(low:Number, high:Number):Array
        nsort:      Array_nsort,        // [].nsort(desc:Boolean = false):Array
        average:    Array_average,      // [].average(median:Boolean = false):Number
        // --- enumerate ---
        count:      Array_count,        // [].count():Object
        // --- manipulate ---
        fill:       Array_fill,         // [].fill(value:Primitive/Object/Array/Date, from:Integer = 0, to:Integer = length):Array
        clear:      Array_clear,        // [].clear():this
        remove:     function(find, all) { return this.replace(find, null, all); },
        shifts:     Array_shifts,       // [].shifts():DenseArray
        replace:    Array_replace,      // [].replace(find:Mix, value:Mix = null, all:Boolean = false):this
        // --- utility ---
        dump:       Array_dump,         // [].dump():String
        choice:     Array_choice,       // [].choice():Mix
        stream:     Array_stream,       // [].stream():Object
        shuffle:    Array_shuffle,      // [].shuffle():DenseArray
        first:      Array_first,        // [].first(lastIndex:Integer = 0):Mix/undefined
        last:       Array_last,         // [].last(index:Integer = 0):Mix/undefined
        // --- test ---
        test:   mix(Array_test, {       // [ test case, ... ].test(label:String = "", arg = undefined)
            tick:   null                // Array#.test.tick({ok,msg,name,pass,miss}) - Tick Callback Function
        })
    });
    wiz(String.prototype, {
        // --- match ---
        has:        String_has,         // "".has(find:String, anagram:Boolean = false):Boolean
        isURL:      String_isURL,       // "".isURL(isRelative:Boolean = false):Boolean
        // --- format ---
        at:         String_at,          // "@@".at(...:Mix):String
        up:         String_up,          // "".up(index:Integer = undedefind):String
        low:        String_low,         // "".low(index:Integer = undedefind):String
        down:       String_low,         // [alias]
//[ES]  trim:       String_trim,        // " trim both sp ".trim():String
        trims:      String_trims,       // "-trim-".trims(chr:String):String
        trimTag:    String_trimTag,     // "<tag></tag>".trimTag(chr:String, all:Boolean = false):String
        trimQuote:  String_trimQuote,   // "'quoted'".trimQuote():String
        format:     String_format,      // "%05s".format(...:Mix):String
        overflow:   String_overflow,    // "".overflow(maxLength:Integer, omit:String = "..."):String
        capitalize: String_capitalize,  // "".capitalize():String
        // --- filter ---
        unique:     String_unique,      // "abcabc".unique():String
        // --- iterate ---
        // --- generate ---
        encode:     String_encode,      // "".encode(code:String = "utf16"):CodedArray/String
        decode:     String_decode,      // "".decode(code:String = "base64"):String
//[ES]  repeat:     String_repeat,      // "".repeat(count:Integer):String
        unpack:     String_unpack,      // "key:value".unpack(glue:String = ":", joint:String = ";"):Hash
        numbers:    String_numbers,     // "1,2,3".numbers(joint:String = ","):NumberArray
//[ES]  reverse:    String_reverse,     // "".reverse():String
        // --- calculate ---
        // --- enumerate ---
        count:      String_count,       // "abc".count(find = ""):Integer/Object
        // --- manipulate ---
        insert:     String_insert,      // "".insert(str:String, index:Integer = 0):String
        remove:     String_remove,      // "".remove(str:String, index:Integer = 0):String
        // --- utility ---
        exec:       String_exec,        // "".exec():Mix/undefined
        stream:     String_stream       // "".stream(command):Object
    });
//  mix(Number, {
//[ES]  isNaN:      Number_isNaN,       // Number.isNaN(mix:Mix):Boolean
//[ES]  isFinite:   Number_isFinite,    // Number.isFinite(mix:Mix):Boolean
//[ES]  isInteger:  Number_isInteger,   // Number.isInteger(mix:Mix):Boolean
//[ES]  toInteger:  Number_toInteger    // Number.toInteger(mix:Mix):Integer
//  });
    wiz(Number.prototype, {
        // --- format ---
        pad:        Number_pad,         // 0..pad(digits:Integer = 2, radix:Integer = 10):String
        // --- generate ---
        to:         Number_to,          // 0..to(end:Integer, filterOrStep:Integer = 1):Array
        // --- calculate ---
        xor:        Number_xor,         // 0..xor(value:Integer):Integer
        rand:       Number_rand,        // 100..rand():Integer/Number
        clamp:      Number_clamp,       // 0..clamp(low:Number, high:Number):Number
        toRadians:  Number_toRadians,   // 180..toRadians() === Math.PI
        toDegrees:  Number_toDegrees,   // Math.PI.toDegrees() === 180
        // --- utility ---
        chr:        Number_chr,         // 0x32.chr():String
        wait:       Number_wait,        // 0..wait(fn_that:Function/Array, ...):Integer
        times:      Number_times        // 0..times(fn_that:Function/Array, ...):ResultMixArray
    });
    wiz(Function.prototype, {
//[ES]  bind:       Function_bind,      // fn.bind():Function
        help:   mix(Function_help, {    // fn.help(that:Object = null)
            add:    Function_help_add   // fn.help.add(url:URLString, word:StringArray/RegExp)
        }),
        callby:     Function_callby,    // fn.callby(that, ...):Mix
        nickname:   Function_nickname,  // fn.nickname(defaultName:String = ""):String
        // --- await ---
        await:      Function_await      // fn.await(waits:Integer, tick:Function = undefined):Await
    });
    wiz(RegExp, {
        esc:        RegExp_esc,         // RegExp.esc(str:String):EscapedString
        FILE:       /^(file:)\/{2,3}(?:localhost)?([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?$/i,
                    //                 localhost    /dir/f.ext ?key=value    #hash
                    //  [1]                         [2]        [3]          [4]
        URL:        /^(\w+:)\/\/((?:([\w:]+)@)?([^\/:]+)(?::(\d*))?)([^ :?#]*)(?:(\?[^#]*))?(?:(#.*))?$/,
                    //  https://    user:pass@    server   :port    /dir/f.ext   ?key=value     #hash
                    //  [1]         [3]           [4]       [5]     [6]         [7]            [8]
        PATH:       /^([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?$/
                    //  /dir/f.ext   key=value    hash
                    //  [1]          [2]          [3]
    });
    wiz(RegExp.prototype, {
        flag:       RegExp_flag         // /regexp/.flag(flag:String):RegExp
    });

//{@easing
    // This code block base idea from Robert Penner's easing equations.
    //      (c) 2001 Robert Penner, all rights reserved.
    //      http://www.robertpenner.com/easing_terms_of_use.html
    var fn,
        easing = {
            linear: "(c*t/d+b)", // linear(t, b, c, d,  q1, q1, q3, q4)
                                 //     t:Number - current time (from 0)
                                 //     b:Number - beginning value
                                 //     c:Number - change in value(delta value), (end - begin)
                                 //     d:Number - duration(unit: ms)
                                 // q1~q4:Number - tmp arg
        // --- Quad ---
            inquad: "(q1=t/d,c*q1*q1+b)",
           outquad: "(q1=t/d,-c*q1*(q1-2)+b)",
         inoutquad: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1+b:-c*0.5*((--q1)*(q1-2)-1)+b)",
        // --- Cubic ---
           incubic: "(q1=t/d,c*q1*q1*q1+b)",
          outcubic: "(q1=t/d-1,c*(q1*q1*q1+1)+b)",
        inoutcubic: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1*q1+b:c*0.5*((q1-=2)*q1*q1+2)+b)",
        outincubic: "(q1=t*2,q2=c*0.5,t<d*0.5?(q3=q1/d-1,q2*(q3*q3*q3+1)+b)" +
                                            ":(q3=(q1-d)/d,q2*q3*q3*q3+b+q2))",
        // --- Quart ---
           inquart: "(q1=t/d,c*q1*q1*q1*q1+b)",
          outquart: "(q1=t/d-1,-c*(q1*q1*q1*q1-1)+b)",
        inoutquart: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1*q1*q1+b" +
                                      ":-c*0.5*((q1-=2)*q1*q1*q1-2)+b)",
        outinquart: "(q1=t*2,q2=c*0.5,t<d*0.5?(q3=q1/d-1,-q2*(q3*q3*q3*q3-1)+b)" +
                                            ":(q4=q1-d,q3=q4/d,q2*q3*q3*q3*q3+b+q2))",
        // --- Back ---
            inback: "(q1=t/d,q2=1.70158,c*q1*q1*((q2+1)*q1-q2)+b)",
           outback: "(q1=t/d-1,q2=1.70158,c*(q1*q1*((q2+1)*q1+q2)+1)+b)",
         inoutback: "(q1=t/(d*0.5),q2=1.525,q3=1.70158," +
                        "q1<1?(c*0.5*(q1*q1*(((q3*=q2)+1)*q1-q3))+b)" +
                            ":(c*0.5*((q1-=2)*q1*(((q3*=q2)+1)*q1+q3)+2)+b))",
         outinback: "(q1=t*2,q2=c*0.5," +
                        "t<d*0.5?(q3=q1/d-1,q4=1.70158,q2*(q3*q3*((q4+1)*q3+q4)+1)+b)" +
                               ":(q3=(q1-d)/d,q4=1.70158,q2*q3*q3*((q4+1)*q3-q4)+b+q2))",
        // --- Bounce ---
          inbounce: "(q1=(d-t)/d,q2=7.5625,q3=2.75,c-(q1<(1/q3)?(c*(q2*q1*q1)+0)" +
                    ":(q1<(2/q3))?(c*(q2*(q1-=(1.5/q3))*q1+.75)+0):q1<(2.5/q3)" +
                    "?(c*(q2*(q1-=(2.25/q3))*q1+.9375)+0)" +
                    ":(c*(q2*(q1-=(2.625/q3))*q1+.984375)+0))+b)",
         outbounce: "(q1=t/d,q2=7.5625,q3=2.75,q1<(1/q3)?(c*(q2*q1*q1)+b)" +
                    ":(q1<(2/q3))?(c*(q2*(q1-=(1.5/q3))*q1+.75)+b):q1<(2.5/q3)" +
                    "?(c*(q2*(q1-=(2.25/q3))*q1+.9375)+b)" +
                    ":(c*(q2*(q1-=(2.625/q3))*q1+.984375)+b))"
    };
    for (fn in easing) {
        Math[fn] = new Function("t,b,c,d,q1,q2,q3,q4", "return " + easing[fn]);
        Math[fn].src = easing[fn];
    }
//}@easing
}

// --- Hash ------------------------------------------------
// Class Hash
function Hash(obj) { // @arg Object:
                     // @help: Hash
    this._ = obj;
}
Hash.unpack = Hash_unpack;              // Hash.unpack(data:String, glue:String = ":", joint:String = ";"):Hash

function _defineHashPrototype(wiz) {
    wiz(Hash.prototype, {
        __CLASS__: "Hash",
        // --- mixin ---
        mix:        function(extend, override) {
                                      mm_mix(this._, extend.valueOf(), override);
                                      return this; /* @help: Hash#mix */ },
        // --- match ---
        has:        function(find)  { return Object_has(this._, find.valueOf());   /* @help: Hash#has  */ },
        like:       function(value) { return Object_like(this._, value.valueOf()); /* @help: Hash#like */ },
        some:       function(fn)    { return Object_some(this._, fn);   /* @help: Hash#some  */ },
        every:      function(fn)    { return Object_every(this._, fn);  /* @help: Hash#every */ },
        match:      function(fn)    { return Object_match(this._, fn);  /* @help: Hash#match */ },
        // --- iterate ---
        map:        function(fn)    { return Object_map(this._, fn);    /* @help: Hash#map   */ },
        each:       function(fn)    {        Object_each(this._, fn);   /* @help: Hash#each  */ },
        // --- generate ---
        copy:       function()      { return new Hash(mm_copy(this._)); /* @help: Hash#copy  */ },
        cast:       function()      { return this._;                    /* @help: Hash#cast  */ },
        pack:       Hash_pack,      // Hash#pack(glue:String = ":", joint:String = ";"):String
        clean:      Hash_clean,     // Hash#clean(typeofFilter:String = ""):Hash
        // --- enumerate ---
        count:      function()      { return Object_count(this._);      /* @help: Hash#count */ },
        pick:       function(names) { return Object_pick(this._, names);/* @help: Hash#pick  */ },
        keys:       function()      { return Object.keys(this._);       /* @help: Hash#keys  */ },
        values:     function()      { return Object_values(this._);     /* @help: Hash#values*/ },
        // --- manipulate ---
        clear:      function()      { this._ = {}; return this;         /* @help: Hash#clear */ },
        // --- utility ---
        help:       function()      { return Function_help(Hash); },
        dump:       function()      { return mm_dump.callby(null, this._, arguments); /* @help: Hash#dump */ },
        toJSON:     function()      { return global.JSON.stringify.callby(null, this._, arguments); /* @help: Hash#toJSON */ },
        valueOf:    function()      { return this._; },
        toString:   function()      { return mm_dump(this._, -1, 100); }
    }, true); // override (Object#valueOf, Object#toString)
}

// --- Messaging -------------------------------------------
function Msg() {
    this._deliverable = {}; // deliverable instance db { __CLASS_UID__: instance, ... }
    this._broadcast   = []; // broadcast address
    Object.defineProperty(this, "__CLASS__",     { value: "Msg" });
    Object.defineProperty(this, "__CLASS_UID__", { value: mm_uid("mm.class") });
}
Msg.prototype = {
    bind:           Msg_bind,           // Msg#bind(...):this
    unbind:         Msg_unbind,         // Msg#unbind(...):this
    list:           Msg_list,           // Msg#list():Object/ClassNameStringArray
    to:             Msg_to,             // Msg#to(...):WrapperedObject
    post:           Msg_post,           // Msg#post(msg:String, ...):this
    send:           Msg_send            // Msg#send(msg:String, ...):ResultArray
};

// --- Await ----------------------------------------------
function Await(fn,     // @arg Function: callback({ ok, args, state })
               waits,  // @arg Integer: wait count
               tick) { // @arg Function(= null): tick callback({ ok, args, state })
                       // @help: Await
    this._db = {
        missables: 0,   // Integer: missables
        waits: waits,   // Integer: waits
        pass:  0,       // Integer: pass() called count
        miss:  0,       // Integer: miss() called count
        state: 100,     // Integer: 100(continue) or 200(success) or 400(error)
        args:  [],      // Array: pass(arg), miss(arg) collections
        tick:  tick || null,
        fn:    fn
    };
    Object.defineProperty(this, "__CLASS__",     { value: "Await" });
    Object.defineProperty(this, "__CLASS_UID__", { value: mm_uid("mm.class") });
}
Await.prototype = {
    missable:       Await_missable,     // Await#missable(missables:Integer):this
    pass:           Await_pass,         // Await#pass(value:Mix = undefined):this
    miss:           Await_miss,         // Await#miss(value:Mix = undefined):this
    state:          Await_state         // Await#state():Integer
};

// --- library scope vars ----------------------------------
var _base64_db,
    _help_db = [],
    _mm_uid_db = {},
    _mm_log_db = [],
    _mm_log_index = 0,
    _mm_conv_db,
    _mm_type_alias_db = {
        "NodeList": "list",
        "Arguments": "list",
        "NamedNodeMap": "attr",
        "HTMLCollection": "list",
        "CSSStyleDeclaration": "style"
    };

// --- implement -------------------------------------------
function HashFactory(obj) { // @arg Object/Hash:
                            // @ret Hash:
                            // @help: mm.HashFactory
    return obj instanceof Hash ? new Hash(mm_copy(obj._)) // copy constructor
                               : new Hash(obj);
}

function Interface(name,   // @arg String:
                   spec) { // @arg Object: { key: typeString, ... }
                           // @help: mm.Interface
//
//  TypeScript:
//      interface Point { x: number; y: number; }
//
//  mofmof.js:
//      mm.Interface("Point", { x: "number", y: "number" });
//
    if (name in mm) {
        throw new TypeError("ALREADY_EXISTS: " + name);
    }
    mm.Interface[name] = spec;
}

function ClassFactory(specs,      // @arg String: "Class:Traits:Interface:BaseClass"
                      properties, // @arg Object(= undefined): prototype method and literals
                      statics) {  // @arg Object(= undefined): static method and literals
                                  // @ret Function: initializer
                                  // @help: mm.Class
//{@debug
    mm.allow(specs,      "String"); // "Class:Singleton:Interface:Base"
    mm.allow(properties, "Object/undefined");
    mm.allow(statics,    "Object/undefined");
//}@debug

    properties = properties || {};

    var InheritBaseClass,
        spec = _parseClassSpec(specs); // { klass: String, traits: StringArray,
                                       //   base: String, ifs: StringArray }
    // --- validate class ---
    if (mm.Class[spec.klass]) { // already?
        return mm.Class[spec.klass];
    }
    // --- validate interface ---
//{@interface
    spec.ifs.each(function(name) {
        mm_allow(properties, name);
    });
//}@interface

    // --- class definition ---
    mm.Class[spec.klass] = spec.klass;
    mm[spec.klass] = spec.traits.has("Singleton") ? SingletonClass
                                                  : GenericClass;

    if (spec.base) {
        InheritBaseClass = function() {};
        InheritBaseClass.prototype = mm[spec.base].prototype;
        mm[spec.klass].prototype = new InheritBaseClass();

        mm_mix(mm[spec.klass].prototype, properties, true); // override mixin prototype.methods
        mm[spec.klass].prototype.constructor = mm[spec.klass];
        mm[spec.klass].prototype.__BASE__ = mm_mix({}, mm[spec.base].prototype);
    } else {
        mm_mix(mm[spec.klass].prototype, properties); // mixin prototype.methods
        mm[spec.klass].prototype.__BASE__ = null;
    }
    mm[spec.klass].prototype.callSuper = _callSuperMethod;

    statics && mm_mix(mm[spec.klass], statics);

    if (spec.traits.has("Singleton") && !spec.traits.has("SelfInit")) {
        mm["i" + spec.klass] = new mm[spec.klass];
    }
    return mm[spec.klass];

    function SingletonClass(ooo) { // @var_args Mix: constructor arguments
        if (!SingletonClass.__INSTANCE__) {
             SingletonClass.__INSTANCE__ = this; // keep self instance

            _factory(this, arguments);
        }
        return SingletonClass.__INSTANCE__;
    }

    function GenericClass(ooo) { // @var_args Mix: constructor arguments
        _factory(this, arguments);
    }

    function _factory(that, args) { // @lookup: className, properties,
        Object.defineProperty(that, "__CLASS__",     { value: spec.klass });
        Object.defineProperty(that, "__CLASS_UID__", { value: mm_uid("mm.class") });

        var obj = that, stack = [];

        // --- constructor chain --- (Base#init -> Class#init)
        while (obj = obj.__BASE__) {
            obj.init && stack.push(obj);
        }
        while (obj = stack.pop()) {
            obj.init.apply(that, args);
        }

        // [!] call Class#init(args, ...)
        properties.init && properties.init.apply(that, args);

        that.gc = function() {
            // [!] call Class#gc
            properties.gc && properties.gc.call(that);

            // --- gc chain --- (Class#gc -> Base#gc)
            obj = that;
            while (obj = obj.__BASE__) {
                obj.gc && obj.gc.call(that);
            }

            if (spec.traits.has("Singleton")) {
                delete SingletonClass.__INSTANCE__;
                delete mm["i" + spec.klass];
            }
            mm_clear(that); // destroy them all
            that.gc = function GCSentinel() {
                mm_log("GC_BAD_CALL");
            };
        };
    }
}

function _callSuperMethod(name,  // @arg String: method name
                          ooo) { // @var_args Mix: args
                                 // @ret Mix/undefined:
                                 // @inner: this.callSuper("method", args, ...)
//{@debug
    mm.allow(name, "String");
//}@debug
    var obj = this,
        args = Array.prototype.slice.call(arguments, 1);

    while (obj = obj.__BASE__) {
        if (typeof obj[name] === "function") {
            return obj[name].apply(this, args);
        }
    }
    args.unshift(name);
    return this.trap.apply(this, args); // call trap(method, ...)
}

function _parseClassSpec(ident) { // @arg StringArray: "Class:Trait:Base"
                                  // @ret Object: { klass, traits, base, ifs }
                                  //        klass - String: "Class"
                                  //        traits - StringArray: ["Singleton", "SelfInit"]
                                  //        base - String: "BaseClass"
                                  //        ifs - StringArray: ["Interface", ...]
                                  // @throw: TypeError("CLASS_NAME_NOT_FOUND"),
                                  //         TypeError("CLASS_NAME_MULTIPLE_INHERITANCE: ..."),
                                  //         TypeError("TRAITS_OR_CLASS_NAME_NOT_FOUND: ...")
                                  // @inner: parse traits and base class string
    var TRAITS = ["Singleton", "SelfInit"],
        ary = ident.split(":"), name,
        rv = { klass: "", traits: [], base: "", ifs: [] };

    rv.klass = ary.shift(); // "Class:Base" -> "Class"
    if (!rv.klass) {
        throw new TypeError("CLASS_NAME_NOT_FOUND");
    }
    while (name = ary.shift()) {
        if (name in mm.Interface) {
            rv.ifs.push(name);
        } else if (TRAITS.has(name)) {
            rv.traits.push(name);
        } else if (mm.Class[name]) { // already Class
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

// --- mixin ---
function mm_arg(arg,        // @arg Object/Function/undefined: { argument-name: value, ... }
                defaults) { // @arg Object: default argument. { argument-name: value, ... }
                            // @ret Object: arg
                            // @help: mm.arg
                            // @desc: supply default argument values
//{@debug
    mm.allow(arg,      "Object/Function/undefined");
    mm.allow(defaults, "Object");
//}@debug

    return arg ? mm_mix(arg, defaults) : defaults;
}

function mm_mix(base,       // @arg Object/Function: base object. { key: value, ... }
                extend,     // @arg Object: key/value object. { key: value, ... }
                override) { // @arg Boolean(= false): override
                            // @ret Object/Function: base
                            // @help: mm.mix
                            // @desc: mixin values. do not look prototype chain.
// [!] mm.allow prohibited

    override = override || false;

    var key, keys = Object.keys(extend), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        if (override || !(key in base)) {
            base[key] = extend[key];
        }
    }
    return base;
}

function mm_wiz(base,       // @arg Object/Function:
                extend,     // @arg Object:
                override) { // @arg Boolean(= false): override
                            // @help: mm.wiz
                            // @desc: prototype extend without enumerability,
                            //        mixin with "invisible" magic.
                            //        do not look prototype chain.
// [!] mm.allow prohibited
    override = override || false;

    var key, keys = Object.keys(extend), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        if (override || !(key in base)) {
            Object.defineProperty(base, key, {
                configurable: true, // false is immutable
                enumerable: false,  // false is invisible
                writable: true,     // false is read-only
                value: extend[key]
            });
        }
    }
}

// --- match ---
function mm_has(data,   // @arg Mix:
                find) { // @arg Mix: { key: value, ... }
                        // @ret Boolean:
                        // @help: mm.has
                        // @desc: has hash pair(s).
                        //        do not look prototype chain.
    if (data && find) {
        return typeof data.has === "function" ? data.has(find)
                                              : Object_has(data, find);
    }
    return false;
}

function mm_like(lval,   // @arg Mix: left value
                 rval) { // @arg Mix: right value
                         // @ret Boolean: true is like value and like structures
                         // @help: mm.like
                         // @desc: Like and deep matching.
                         //        This function does not search inside the prototype chain of the object.
                         //     `` 類似検索と深度探索を行い、よく似ているオブジェクトなら true を返します。
                         //        Object のプロトタイプチェーンは辿りません
    return (lval && typeof lval.like === "function") ? lval.like(rval)
                                                     : Object_like(lval, rval);
}

// --- iterate / enumerate ---
function mm_map(data, // @arg Object/Function/Array/Hash: data
                fn) { // @arg Function: callback function
                      // @ret Array: [result, ...]
                      // @help: mm.map
                      // @desc: mm#map, Array#map
//{@debug
    mm.allow(data, "Object/Function/Array/Hash");
    mm.allow(fn,   "Function");
//}@debug

    return typeof data.map === "function" ? data.map(fn)
                                          : Object_map(data, fn);
}

function mm_each(data, // @arg Object/Function/Array/Hash: data
                 fn) { // @arg Function: callback function
                       // @help: mm.each
                       // @desc: mm#each, Array#each
//{@debug
    mm.allow(data, "Object/Function/Array/Hash");
    mm.allow(fn,   "Function");
//}@debug

    typeof data.each === "function" ? data.each(fn)
                                    : Object_each(data, fn);
}

function mm_some(data, // @arg Object/Function/Array/Hash: data
                 fn) { // @arg Function: fn(value, key)
                       // @ret Boolean:
                       // @help: mm.some
                       // @desc: return true if the return fn(value, key) is truthy
//{@debug
    mm.allow(data, "Object/Function/Array/Hash");
    mm.allow(fn,   "Function");
//}@debug

    return typeof data.some === "function" ? data.some(fn)
                                           : Object_some(data, fn);
}

function mm_every(data, // @arg Object/Function/Array/Hash: data
                  fn) { // @arg Function: fn(value, key)
                        // @ret Boolean:
                        // @help: mm.every
                        // @desc: return false if the return fn(value, key) is falsy
//{@debug
    mm.allow(data, "Object/Function/Array/Hash");
    mm.allow(fn,   "Function");
//}@debug

    return typeof data.every === "function" ? data.every(fn)
                                            : Object_every(data, fn);
}

function mm_match(data, // @arg Object/Function/Array/Hash: data
                  fn) { // @arg Function: fn(value, key)
                        // @ret Boolean:
                        // @help: mm.match
                        // @desc: return value if the return fn(value, key) is truthy
//{@debug
    mm.allow(data, "Object/Function/Array/Hash");
    mm.allow(fn,   "Function");
//}@debug

    return typeof data.match === "function" ? data.match(fn)
                                            : Object_match(data, fn);
}

function mm_count(data) { // @arg Object/Function/Array/Hash: data
                          // @ret Object: { value: value-count, ... }
                          // @help: mm.count
                          // @desc: count the number of values
//{@debug
    mm.allow(data, "Object/Function/Array/Hash");
//}@debug

    return typeof data.count === "function" ? data.count()
                                            : Object_count(data);
}

function mm_pick(data,    // @arg Object/Function/Array/Hash:
                 names) { // @arg String/StringArray:
                          // @ret Array:
//{@debug
    mm.allow(data,  "Object/Function/Array/Hash");
    mm.allow(names, "String/StringArray");
//}@debug

    return typeof data.pick === "function" ? data.pick(names)
                                           : Object_pick(data, names);
}

function mm_keys(data) { // @arg Object/Function/Array/Hash/Style/Node/Global:
                         // @ret Array: [key, ...]
                         // @help: mm.keys
                         // @desc: enumerate keys
//{@debug
    mm.allow(data, "Object/Function/Array/Hash/Style/Node/Global");
//}@debug

    return typeof data.keys === "function" ? data.keys()
                                           : Object.keys(data);
}

function mm_values(data) { // @arg Object/Function/Array/Hash/Style/Node/Global:
                           // @ret Array: [value, ...]
                           // @help: mm.values
                           // @desc: enumerate values
//{@debug
    mm.allow(data, "Object/Function/Array/Hash/Style/Node/Global");
//}@debug

    return typeof data.values === "function" ? data.values()
                                             : Object_values(data);
}

// --- utility ---
function mm_nop() { // @help: mm.nop
                    // @desc: no operation function
}

function mm_uid(group) { // @arg String(= ""): uid group name.
                         // @ret Integer: unique number, at 1 to 0x1fffffffffffff
                         // @help: mm.uid
                         // @desc: get unique id
//{@debug
    mm.allow(group, "String/undefined");
//}@debug

    _mm_uid_db[group] || (_mm_uid_db[group] = 0);

    // IEEE754 fraction size. 0x1fffffffffffff = Math.pow(2, 53) - 1
    if (++_mm_uid_db[group] >= 0x1fffffffffffff) { // overflow?
          _mm_uid_db[group] = 1; // reset
    }
    return _mm_uid_db[group];
}

function mm_cast(mix) { // @arg Attr/Hash/List/FakeArray/Style/DateString/Mix:
                        // @ret Object/Array/Date/Mix:
                        // @help: mm.cast
                        // @desc: remove the characteristic
    switch (mm_type(mix)) {
    case "attr":    return _mm_cast_attr(mix);    // cast(Attr) -> Object
    case "Hash":    return mix.valueOf();         // cast(Hash) -> Object
    case "list":    return Array.from(mix);       // cast(List) -> Array
    case "style":   return _mm_cast_style(mix);   // cast(Style) -> Object
    case "string":  return Date.from(mix) || mix; // cast(DateString) -> Date/String
    }
    return mix;
}

function _mm_cast_attr(mix) { // @arg Attr: NamedNodeMap
                              // @ret Object:
                              // @inner:
    var rv = {}, i = 0, attr;

    for (; attr = mix[i++]; ) {
        rv[attr.name] = attr.value;
    }
    return rv;
}

function _mm_cast_style(mix) { // @arg Style: CSSStyleDeclaration
                               // @ret Object:
                               // @inner:
    var rv = {}, key, value, i = 0, iz = mix.length;

    if (iz) { // [Firefox][WebKit][IE]
        for (; i < iz; ++i) {
            key = mix.item(i);
            value = mix[key];
            if (value && typeof value === "string") { // skip methods
                rv[key] = value;
            }
        }
    } else {
//{@opera
        for (key in mix) {
            value = mix[key];
            if (value && typeof value === "string") {
                rv[key] = value;
            }
        }
//}@opera
    }
    return rv;
}

function mm_copy(mix,    // @arg Mix: source object
                 depth,  // @arg Integer(= 0): max depth, 0 is infinity
                 hook) { // @arg Object(= null): handle the unknown object
                         // @ret Mix/null: copied object, null is fail
                         // @throw: TypeError("UNKNOWN_TYPE: ...")
                         // @help: mm.copy
                         // @desc: Object with the reference -> deep copy
                         //        Object without the reference -> shallow copy
                         //        do not look prototype chain.
//{@debug
    mm.allow(depth, "Integer/undefined");
    mm.allow(hook,  "Function/undefined");
//}@debug

    return _recursiveCopy(mix, depth || 0, hook || null, 0);
}

function _recursiveCopy(mix, depth, hook, nest) { // @inner:
    if (depth && nest > depth) {
        return;
    }
    var rv, keys, i = 0, iz;

    switch (mm_type(mix)) {
    // --- deep copy ---
    case "undefined":
    case "null":    return "" + mix; // "null" or "undefined"
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
    // --- shallow copy (by reference) ---
    case "function":
        return mix;
    }
    if (hook) {
        return hook(mix);
    }
    throw new TypeError("UNKNOWN_TYPE: " + mix);
}

function mm_conv(from, // @arg CaseInsensitiveString: "Integer", "HexString", "ByteString"
                 to) { // @arg CaseInsensitiveString: "Integer", "HexString", "ByteString"
                       // @ret Object:
                       // @help: mm.conv
                       // @desc: convert tables

//{@debug
    mm.allow(from, "String");
    mm.allow(to,   "String");
    mm.allow(from, ["integer", "hexstring", "bytestring"].has(from.toLowerCase()));
    mm.allow(to,   ["integer", "hexstring", "bytestring"].has(  to.toLowerCase()));
//}@debug

    var num = { "integer": 1, hexstring: 2, bytestring: 4 },
        code = (num[from.toLowerCase()]) << 4 |
               (num[  to.toLowerCase()]);

    _mm_conv_db || _mm_conv_init();

    return _mm_conv_db[code] || {};

    function _mm_conv_init() {
        _mm_conv_db = { 0x12: {}, 0x21: {}, 0x14: {}, 0x41: {} };

        var i = 0, hex, bin;

        for (; i < 0x100; ++i) {
            hex = (i + 0x100).toString(16).slice(1);
            bin = String.fromCharCode(i);
            _mm_conv_db[0x12][i]   = hex;    // {   255 :   "ff" }
            _mm_conv_db[0x21][hex] = i;      // {   "ff":   255  }
            _mm_conv_db[0x14][i]   = bin;    // {   255 : "\255" }
            _mm_conv_db[0x41][bin] = i;      // { "\255":   255  }
        }
        // http://twitter.com/edvakf/statuses/15576483807
        for (i = 0x80; i < 0x100; ++i) { // [Webkit][Gecko]
            _mm_conv_db[0x41][String.fromCharCode(0xf700 + i)] = i; // "\f780" -> 0x80
        }
    }
}

function mm_dump(mix,     // @arg Mix: data
                 spaces,  // @arg Integer(= 4): spaces, -1, 0 to 8
                 depth) { // @arg Integer(= 5): max depth, 0 to 100
                          // @ret String:
                          // @help: mm.dump
                          // @desc: Dump Object
//{@debug
    mm.allow(spaces, "Integer/undefined");
    mm.allow(depth,  "Integer/undefined");
//}@debug

    spaces = spaces === void 0 ? 4 : spaces;
    depth  = depth || 5;

//{@debug
    mm.deny(spaces, (spaces < -1 || spaces > 8  ));
    mm.deny(depth,  (depth  <  1 || depth  > 100));
//}@debug

    return _recursiveDump(mix, spaces, depth, 1);
}

function _recursiveDump(mix,    // @arg Mix: value
                        spaces, // @arg Integer: spaces
                        depth,  // @arg Integer: max depth
                        nest) { // @arg Integer: nest count from 1
                                // @ret String:
                                // @inner:
    function _dumpArray(mix) {
        if (!mix.length) {
            return "[]";
        }
        var ary = [], i = 0, iz = mix.length;

        for (; i < iz; ++i) {
            ary.push(indent + _recursiveDump(mix[i], spaces, depth, nest + 1)); // recursive call
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
                         _recursiveDump(mix[key], spaces, depth, nest + 1)); // recursive call
            }
        }
        return _getName(mix) + "{" + lf + ary.join("," + lf) +
                                     lf + " ".repeat(spaces * (nest - 1)) + "}";
    }

    function _dumpNode(node) { // @arg: Node:
                               // @ret: String: "<body>"
                               //               "<div body>div:nth-child(1)>div>"
                               // @ref: HTMLElement#path
        var name = node.nodeName ? node.nodeName.toLowerCase() : "",
            roots = /^(?:html|head|body)$/;

        if (typeof node.path === "function") {
            // /^<(\w+) ?(.*)?>$/.exec( "<div body>div:nth-child(1)>div>" )
            return "<@@@@>".at(name, roots.test(name) ? "" : " " + node.path());
        }
        return name ? '<' + name + '>'
                    : node === document ? '<document>'
                                        : '<node>';
    }

    if (depth && nest > depth) {
        return "...";
    }

    var lf = spaces > 0 ? "\n" : "", // line feed
        sp = spaces > 0 ? " "  : "", // a space
        indent = " ".repeat(spaces * nest);

    switch (mm_type(mix)) {
    case "null":
    case "global":
    case "number":
    case "boolean":
    case "undefined":   return "" + mix;
    case "date":        return mix.toJSON();
    case "node":        return _dumpNode(mix);
    case "attr":        return _dumpObject(_mm_cast_attr(mix));
    case "list":
    case "array":       return _dumpArray(mix);
    case "style":       return _dumpObject(_mm_cast_style(mix));
    case "regexp":      return "/" + mix.source + "/";
    case "Hash":        return _dumpObject(mix.valueOf());
    case "object":
    case "function":    return _dumpObject(mix);
    case "string":      return '"' + _toJSONEscapedString(mix) + '"';
    }
    return "";
}

function _toJSONEscapedString(str) { // @arg String:
                                     // @ret String:
                                     // @inner: to JSON escaped string
    var JSON_ESCAPE = {
            '\b': '\\b',    // backspace       U+0008
            '\t': '\\t',    // tab             U+0009
            '\n': '\\n',    // line feed       U+000A
            '\f': '\\f',    // form feed       U+000C
            '\r': '\\r',    // carriage return U+000D
            '"':  '\\"',    // quotation mark  U+0022
            '\\': '\\\\'    // reverse solidus U+005C
        };

    return str.replace(/(?:[\b\t\n\f\r\"]|\\)/g, function(_) {
                return JSON_ESCAPE[_];
            }).replace(/(?:[\x00-\x1f])/g, function(_) {
                return "\\u00" +
                       ("0" + _.charCodeAt(0).toString(16)).slice(-2);
            });
}

function mm_pair(key,     // @arg Object/Integer/String: key
                 value) { // @arg Mix: value
                          // @ret Object: { key: value }
                          // @help: mm.pair
                          // @desc: make pair
//{@debug
    mm.allow(key, "Object/Integer/String");
//}@debug

    if (typeof key === "number" || typeof key === "string") {
        var rv = {};

        rv[key] = value;
        return rv;
    }
    return key; // Object or Object Like Object
}

function mm_wrap(mix) { // @arg Mix: result value
                        // @ret Function:
                        // @help: mm.wrap
                        // @desc: `function-producing` function
    return function() {
        return mix;
    };
}

function mm_clean(data,           // @arg Object/Function/Array/Hash:
                  typeofFilter) { // @arg String(= ""): typeof filter
                                  // @ret DenseObject: new Object as dense object
                                  // @help: mm.clean
                                  // @desc: convert sparse Object to dense Object, trim undefined, null and NaN value
                                  //        ``疎なオブジェクト(sparse object)を密なオブジェクト(dense object)に変換します。
                                  //          undefined, null および NaN の値を除去します
//{@debug
    mm.allow(data,         "Object/Function/Array/Hash");
    mm.allow(typeofFilter, "String/undefined");
//}@debug

    return typeof data.clean === "function" ? data.clean(typeofFilter)
                                            : Object_clean(data, typeofFilter);
}

function mm_clear(obj) { // @arg Object/Function/Class:
                         // @ret Object/Function/Class:
                         // @ref: mm.clear, Array#clear
                         // @help: mm.clear
                         // @desc: clear Object
//{@debug
    mm.allow(obj, "Object/Function/Class");
//}@debug

    var keys = Object.keys(obj), i = 0, iz = keys.length;

    for (; i < iz; ++i) {
        delete obj[keys[i]];
    }
    return obj;
}

// --- assert / debug ---
function mm_say(ooo) { // @var_args Mix:
                       // @help: mm.say
                       // @desc: alert(mm.dump(mix)) short hand
    alert(mm_dump.apply(null, arguments));
}

function mm_deny(mix,     // @arg Mix:
                 judge) { // @arg Function/Boolean/TypeNameString:
                          // @help: mm.deny
                          // @desc: raise an assertion in a type match
    mm_allow(mix, judge, true);
}

function mm_allow(mix,          // @arg Mix:
                  judge,        // @arg Function/Boolean/InterfaceNameString/TypeNameString:
                                //          types: "Primitive/Global/List/Node/Hash/Class"
                                //                 "null/undefined/Boolean/Number/Integer/String"
                                //                 "Date/Object/Array/Function/RegExp/CodedArray"
                  __negate__) { // @hidden Boolean(= false):
                                // @help: mm.allow
                                // @desc: raise an assertion in a type mismatch
    __negate__ = __negate__ || false;

    var assert = false, origin = "";

    if (judge == null) { // mm.allow(mix, undefined or null) -> nop
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
    if (assert) { // http://uupaa.hatenablog.com/entry/2011/11/18/115409
        debugger;
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

//{@interface
function _judgeInterface(mix, spec) {
    return Object_every(spec, function(type, key) {
        if (key in mix) { // mix has key
            return spec[key].split("/").some(function(type) {
                if (type in mm.Interface) {
                    return _judgeInterface(mix[key], mm.Interface[type]);
                }
                return _judgeType(mix[key], type);
            });
        }
        return false;
    });
}
//}@interface

function _judgeType(mix, type) {
    type = type.toLowerCase();
    if (mix == null && type === mix + "") { // "null" or "undefined"
        return true;
    }
    return type === "class"     ? !!mix.__CLASS__
         : type === "integer"   ? Number.isInteger(mix)
         : type === "primitive" ? mix == null || typeof mix !== "object"
         : type === "codedarray"? Array.isCodedArray(mix)
         : type === mm_type(mix);
}

function mm_perf() { // @ret Object: { processing, redirect, appcache, dns, dom, load, fetch }
                     //       processing - Number: Processing time
                     //       redirect - Number: redirect elapsed
                     //       appcache - Number: Application cache elapsed
                     //       dns      - Number: DomainLookup elapsed
                     //       dom      - Number: DOMContentLoaded event elapsed
                     //       load     - Number: window.load event elapsed
                     //       fetch    - Number: fetchStart to window.load event finished
                     // @help: mm.perf
                     // @desc: calc performance data

    var tm = (global.performance || 0).timing || 0;

    if (!tm) {
        return { processing: 0, redirect: 0, appcache: 0,
                 dns: 0, dom: 0, load: 0, fetch: 0 };
    }
    return {
        processing: tm.loadEventStart - tm.responseEnd,
        redirect:   tm.redirectEnd - tm.redirectStart,
        appcache:   tm.domainLookupStart - tm.fetchStart,
        dns:        tm.domainLookupEnd - tm.domainLookupStart,
        dom:        tm.domContentLoadedEventEnd - tm.domContentLoadedEventStart,
        load:       tm.loadEventEnd - tm.loadEventStart,
        fetch:      tm.loadEventEnd - tm.fetchStart
    };
}

function mm_pollution() { // @ret StringArray: [key, ...]
                          // @help: mm.pollution
                          // @desc: detect global object pollution
    if (mm_pollution._keys) {
        return mm_pollution._keys.xor( Object.keys(global) );
    }
    mm_pollution._keys = Object.keys(global);
    return [];
}

// --- type / detect ---
function mm_type(mix) { // @arg Mix: search
                        // @ret TypeLowerCaseString:
                        // @help: mm.type
                        // @desc: get type/class name
    var rv, type;

    rv = mix === null   ? "null"
       : mix === void 0 ? "undefined"
       : mix === global ? "global"
       : mix.nodeType   ? "node"
       : mix.__CLASS__  ? mix.__CLASS__ // ES Spec: [[Class]] like internal property
       : "";

    if (rv) {
        return rv;
    }
    // typeof primitive -> "number", "string", "boolean"
    type = typeof mix;
    if (type !== "object") {
        return type;
    }

    // Object.prototype.toString.call(Hoge) -> "[object Hoge]"
    // (new Hoge).constructor.name -> "Hoge" (except IE)
    // (new Hoge).constructor + "" -> "[object Hoge]" or "function Hoge()..."

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
            return "list"; // Arguments
        }
    }
    if (rv in _mm_type_alias_db) {
        return _mm_type_alias_db[rv];
    }
    return rv ? rv.toLowerCase() : "object";
}

function mm_type_alias(obj) { // @arg Object: { fullTypeName: shortTypeName, ... }
                                 // @help: mm.type.add
    Object_each(obj, function(value, key) {
        _mm_type_alias_db["[object " + key + "]"] = value;
    });
}

function mm_complex(arg1,   // @arg String/Object(= undefined):
                    arg2) { // @arg String/Number(= undefined):
                            // @ret Integer: 1 ~ 4
                            // @help: mm.complex
                            // @desc: detect argument combinations
    //  [1][get all items]  mm.complex() -> 1
    //  [2][get one item]   mm.complex(key:String) -> 2
    //  [3][set one item]   mm.complex(key:String, value:Mix) -> 3
    //  [4][set all items]  mm.complex({ key: value:Mix, ... }) -> 4

    return arg1 === void 0 ? 1
         : arg2 !== void 0 ? 3
         : arg1 && typeof arg1 === "string" ? 2 : 4;
}

// --- log ---
function mm_log(ooo) { // @var_args Mix: message
                       // @help: mm.log
                       // @desc: push log db
    _mm_log_db.push({ type: 0, time: Date.now(),
                      msg:  [].slice.call(arguments).join(" ") });
    _mm_log_db.length > mm_log.limit && mm_log_dump();
}

function mm_log_warn(ooo) { // @var_args Mix: message
                            // @help: mm.log.warn
                            // @desc: push log db
    _mm_log_db.push({ type: 1, time: Date.now(),
                      msg:  [].slice.call(arguments).join(" ") });
    _mm_log_db.length > mm_log.limit && mm_log_dump();
}

function mm_log_error(ooo) { // @var_args Mix: message
                             // @help: mm.log.error
                             // @desc: push log db
    _mm_log_db.push({ type: 2, time: Date.now(),
                      msg:  [].slice.call(arguments).join(" ") });
    _mm_log_db.length > mm_log.limit && mm_log_dump();
}

function mm_log_copy() { // @ret: Object { data: [log-data, ...], index: current-index }
                         // @help: mm.log.copy
                         // @desc: copy log
    return { data: _mm_log_db.copy(), index: _mm_log_index };
}

function mm_log_dump(url) { // @arg String(= ""): "" or url(http://example.com?log=@@)
                            // @help: mm.log.dump
                            // @desc: dump log
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

function mm_log_clear() { // @help: mm.log.clear
                          // @desc: clear log db
    _mm_log_index = 0;
    _mm_log_db = [];
}

function mm_logg(label,  // @arg String/Function: label (group name)
                 mode) { // @arg Integer(= 0x0): 0x4 is perf mode
                         // @ret Object: { out, error, valueOf }
                         // @help: mm.logg
                         // @desc: log group
//{@debug
    mm.allow(label, "String/Function");
    mm.allow(mode,  "Integer/undefined");
//}@debug

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
                          msg:  _msg(2, [].slice.call(arguments).join(" ")) });
    }
    function _logg(ooo) {
        _mm_log_db.push({ type: mode, time: Date.now(),
                          msg:  _msg(2, [].slice.call(arguments).join(" ")) });
    }
    function _out() {
        _mm_log_db.push({ type: mode, time: Date.now(),
                          msg:  _msg(3, (new Date).diff(now)) });
        --mm_logg.nest;
        _mm_log_db.length > mm_log.limit && mm_log_dump();
    }
}

// --- Messaging ---
function Msg_bind(ooo) { // @var_args Instance: register drain instance
                         // @ret this:
                         // @throw: Error("NOT_DELIVERABLE")
                         // @help: Msg#bind
                         // @desc: register the drain(destination of the message) instance
    Array.prototype.slice.call(arguments).forEach(function(instance) {
        if (instance &&
            instance.__CLASS_UID__ && typeof instance.msgbox === "function") {

            this._deliverable[instance.__CLASS_UID__] = instance; // overwrite
        } else {
            throw new Error("NOT_DELIVERABLE");
        }
    }, this);

    // update broadcast address
    this._broadcast = mm_values(this._deliverable);
    return this;
}

function Msg_unbind(ooo) { // @var_args Instance: drain instance. undefined is unbind all instance
                           // @ret this:
                           // @help: Msg#unbind
                           // @desc: unregister drain instance
    var args = arguments.length ? Array.prototype.slice.call(arguments)
                                : this._broadcast;

    args.each(function(instance) {
        if (instance.__CLASS_UID__) {
            delete this._deliverable[instance.__CLASS_UID__];
        }
    }, this);

    // update broadcast address
    this._broadcast = mm_values(this._deliverable);
    return this;
}

function Msg_list(classList) { // @arg Boolean(= false): true is return [className, ...]
                               // @ret Object/ClassNameStringArray: { __CLASS_UID__: instance, ... }
                               //                                                or [className, ...]
                               // @help: Msg#list
                               // @desc: get registered instance list
    return classList ? mm_pick(this._deliverable, "__CLASS__")
                     : mm_copy(this._deliverable);
}

function Msg_to(ooo) { // @var_args Instance: delivery to address.
                       //            undefined   is Broadcast
                       //            Instance    is Unicast
                       //            instance... is Multicast
                       // @ret WrapperedObject: { that, addr, deli, post, send }
                       // @help: Msg#to
                       // @desc: set destination address
    var deli = {}, i;

    for (i in this._deliverable) {
        deli[i] = this._deliverable[i];
    }
    return {
        that: this,
        addr: arguments.length ? Array.prototype.slice.call(arguments)
                               : this._broadcast.concat(), // shallow copy
        deli: deli,
        post: Msg_post,
        send: Msg_send
    };
}

function Msg_send(msg,   // @arg String: msg
                  ooo) { // @var_args Mix: msgbox args. msgbox(msg, arg, ...)
                         // @ret Array: [result, ...], "NOT_DELIVERABLE" is ERROR
                         // @help: Msg#send
                         // @desc: send a message synchronously
//{@debug
    mm.allow(msg, "String");
//}@debug

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

function Msg_post(msg,   // @arg String: msg
                  ooo) { // @var_args Mix: msgbox args. msgbox(msg, arg, ...)
                         // @ret this:
                         // @help: Msg#post
                         // @desc: post a message asynchronously
//{@debug
    mm.allow(msg, "String");
//}@debug

    var addr = (this.addr || this._broadcast).concat(), // shallow copy
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

function Date_from(date) { // @arg Date/String:
                           // @ret Date/null:
                           // @help: Date.from
                           // @desc: parse date string
//{@debug
    mm.allow(date, "Date/String");
//}@debug

    if (date.typeDate) {
        return date;
    }
    var DATE_PARSE = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:\.(\d*))?Z$/,
                     // [1]y    [2]m   [3]d   [4]h   [5]m   [6]s       [7]ms
        m = DATE_PARSE.exec(date), d;

    if (m) {
        return new Date(Date.UTC(+m[1], +m[2] - 1,   +m[3], // Y, M, D
                                 +m[4], +m[5], +m[6], m[7] ? +m[7] : 0));
    }
    d = new Date(date);
    return isNaN(+d) ? null : d; // date.valueOf() -> NaN -> parse error
}

function Date_diff(diffDate) { // @arg Date/Integer: diff date
                               // @ret Object: { days, times, toString }
                               //    days - Integer: days
                               //    times - Object: Date#times result
                               //    toString - Function:
                               // @help: Date#diff
                               // @desc: date.diff(time_t) or date.diff(date)
//{@debug
    mm.allow(diffDate, "Date/Integer");
//}@debug

    var span = Math.abs(+this - +diffDate),
        diff = new Date(span); // 1970-01-01 + span

    return {
        days: (span / 86400000) | 0,
        times: diff.times(),
        toString: function(format) { // @arg String(= "m:s.ms"): Date#format
            return diff.format(format || "m:s.ms");
        }
    };
}

function Date_dates() { // @ret Object: { y, m, d }
                        // @help: Date#dates
                        // @desc: get date info
    return { y:  this.getUTCFullYear(),         // 1970 -
             m:  this.getUTCMonth() + 1,        //    1 - 12
             d:  this.getUTCDate() };           //    1 - 31
}

function Date_times() { // @ret Object: { h, m, s, ms }
                        // @help: Date#times
                        // @desc: get time info
    return { h:  this.getUTCHours(),            //    0 - 23
             m:  this.getUTCMinutes(),          //    0 - 59
             s:  this.getUTCSeconds(),          //    0 - 59
             ms: this.getUTCMilliseconds() };   //    0 - 999
}

function Date_format(format) { // @arg String(= "I"): format("Y-M-D h:m:s.ms")
                               // @ret String: formated date string
                               // @help: Date#format
                               // @desc: format date
//{@debug
    mm.allow(format, "String/undefined");
//}@debug

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

function Array_range(begin,          // @arg Integer: begin `` 開始番号を数値で指定します
                     end,            // @arg Integer: end   `` 終了番号を数値で指定します。フィルタによる制限が無い限り、戻り値にはendで指定した終了番号が含まれます
                     filterOtStep) { // @arg Function/Integer(= 1): filter or skip number `` フィルター関数またはスキップ数を指定します。省略可能です
                                     // @ret Array: [begne, ... end] `` [begin, ... end] の配列を返します
                                     // @see: Array.range, Number#to
                                     // @throw: Error("BAD_ARG") `` 引数が不正です
                                     // @help: Array.range
                                     // @desc: range generator `` 連続した数値の配列を作成します
//{@debug
    mm.allow(begin,        "Integer");
    mm.allow(end,          "Integer");
    mm.allow(filterOtStep, "Function/Integer/undefined");
//}@debug

    return (begin).to(end, filterOtStep); // Number#to
}

function Array_toArray(mix) { // @arg Mix/Array:
                              // @ret Array:
                              // @help: Array.toArray
    return Array.isArray(mix) ? mix : [mix];
}

function Array_isCodedArray(mix) { // @arg Mix:
                                   // @ret Boolean:
                                   // @help: Array.isCodedArray
    return Array.isArray(mix) && !!mix.code;
}

function Array_chain(param) { // @arg Mix:
                              // @ret Mix/undefined:
                              // @help: Array#chain
                              // @desc: return value or undefined if the return fn(value, key) is truthy
    var rv, value, fn, i = 0, iz = this.length;

    for (; i < iz; i += 2) { // [<value, fn>, <value, fn>, ...]
        if (i in this) {
            value = this[i];
            fn = this[i + 1];
            if (typeof fn === "function") {
                rv = fn(value, i, param); // fn(value, index, param)
                if (rv) {
                    return rv;
                }
            }
        }
    }
    return;
}

function Array_match(fn,     // @arg Function:
                     that) { // @arg this(= undefined): fn this
                             // @ret Mix/undefined:
                             // @help: Array#match
                             // @desc: return value if the return fn(value, key) is truthy.
    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this && fn.call(that, this[i], i, this)) {
            return this[i];
        }
    }
    return;
}

function Array_at(format) { // @arg String: format `` フォーマット文字列を指定します。フォーマット文字列中の @@ を配列の各要素で置換します
                            // @ret String: "formatted string" `` 置換後の文字列を返します
                            // @this: replacement arguments `` "@@" を置換する引数を指定します
                            // @desc: placeholder( "@@" ) replacement `` 配列の各要素を引数として String#at() を実行します
                            // @help: Array#at
//{@debug
    mm.allow(format, "String");
//}@debug

    var ary = this, i = 0;

    return format.replace(/@@/g, function() {
        return ary[i++];
    });
}

function Array_has(find) { // @arg Mix/MixArray: element or [element, ...]
                           // @ret Boolean:
                           // @desc: Array has all element(s)
                           // @help: Array#has
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

function Array_copy(deep) { // @arg Boolean(= false): true is deep copy
                            // @help: Array#copy
                            // @desc: has non-copyable object -> shallow copy
                            //        copyable object -> deep copy
    return deep ? mm_copy(this)  // deep copy
                : this.concat(); // shallow copy
}

function Array_unique() { // @ret DenseArray: new Array has unique element(s)
                          // @help: Array#unique
                          // @desc: make array from unique element (trim null and undefined elements)
                          //        `` 配列の要素を走査し、ユニークな要素だけを持つ新しい配列を生成します
                          //           要素の比較は === 演算子で行います。
                          //           null, undefined, NaN を除去します
    return this.sieve().values;
}

function Array_clean(typeofFilter) { // @arg String(= ""): typeof filter. "number", "string"
                                     // @ret DenseArray: new array
                                     // @help: Array#clean
                                     // @desc: convert sparse array to dense array, trim undefined, null and NaN value
                                     //        ``疎な配列(sparse array)を密な配列(dense array)に変換します。
                                     //          undefined, null および NaN を配列から除去します
//{@debug
    mm.allow(typeofFilter, "String/undefined");
//}@debug

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

function Array_decode(code,       // @arg String(= "utf16"):
                      startIndex, // @arg Integer(= 0):
                      endIndex) { // @arg Integer(= undefined):
                                  // @ret String:
                                  // @this CodedArray: [mix, ...] + { code: String }
                                  // @help: Array#decode
                                  // @desc: decode CodedArray to String
//{@debug
    mm.allow(code,       "String/undefined");
    mm.allow(startIndex, "Integer/undefined");
    mm.allow(endIndex,   "Integer/undefined");
//}@debug

    switch ((this.code || code || "utf16").toLowerCase()) {
    case "utf8":  return _Array_fromUTF8(this, startIndex, endIndex);
    case "utf16": return _Array_fromUTF16(this, startIndex, endIndex);
    }
    return "";
}

function _Array_fromUTF8(data,       // @arg Array:
                         startIndex, // @arg Integer(= 0):
                         endIndex) { // @arg Integer(= undefined):
    var rv = [], c = 0,
        i  = startIndex || 0,
        iz =   endIndex || data.length;

    if (iz > data.length) {
        iz = data.length;
    }

    for (; i < iz; ++i) {
        c = data[i];
        if (c < 0x80) {         // 0x00 - 0x7F (1 byte)
            rv.push(c);
        } else if (c < 0xE0) {  // 0xC0 - 0xD0 (2 bytes)
            rv.push( (c & 0x1f) <<  6 | (data[++i] & 0x3f) );
        } else if (c < 0xF0) {  // 0xE0 - 0xEF (3 bytes)
            rv.push( (c & 0x0f) << 12 | (data[++i] & 0x3f) <<  6 |
                                        (data[++i] & 0x3f) );
        } else if (c < 0xF8) {  // 0xE0 - 0xE7 (4 bytes)
            rv.push( (c & 0x07) << 18 | (data[++i] & 0x3f) << 12 |
                                        (data[++i] & 0x3f) <<  6 |
                                        (data[++i] & 0x3f) );
        }
    }
    return _Array_fromUTF16(rv); // Array#utf16
}

function _Array_fromUTF16(data,       // @arg Array:
                          startIndex, // @arg Integer(= 0):
                          endIndex) { // @arg Integer(= undefined):
    var rv = [], i = 0, iz = data.length, bulkSize = 10240;

    // pre slice
    if (startIndex !== void 0 ||
          endIndex !== void 0) {

        data = data.slice(startIndex || 0, Math.max(endIndex || iz, iz));
        iz = data.length;
    }

    // avoid String.fromCharCode.apply(null, BigArray) exception
    for (; i < iz; i += bulkSize) {
        rv.push( String.fromCharCode.apply(null, data.slice(i, i + bulkSize)) );
    }
    return rv.join("");
}

function Array_count() { // @ret Object: { value: value-count, ... }
                         // @help: Array#count
                         // @desc: count the number of values
    return Object_count(this);
}

function Array_sieve() { // @ret Object: { values:Array, dups:Array }
                         // @help: Array#sieve
                         // @desc: sieve values, duplicate values
                         //        `` 配列の要素を走査し、重複する要素を分離します
                         //           要素の比較は === 演算子で行います。
                         //           null, undefined, NaN を除去します

    var ary = this.clean(), values = [], dups = [], i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        values.indexOf(ary[i]) >= 0 ? dups.push(ary[i])
                                    : values.push(ary[i]);
    }
    return { values: values, dups: dups };
}

function Array_shifts() { // @ret Array: cloned new Array
                          // @help: Array#shifts
                          // @desc: shift all elements
    var rv = this.concat(); // shallow copy

    this.length = 0;
    return rv; // return all elements
}

function Array_replace(find,  // @arg Mix: find value
                       value, // @arg Mix(= null): replace value. null or undefined is remove
                       all) { // @arg Boolean(= false): true is find all elements
                              // @ret this:
                              // @help: Array#replace
                              // @desc: replace or remove element(s)
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

function Array_shuffle() { // @ret DenseArray: new Array
                           // @help: Array#shuffle
                           // @desc: shuffle element(s)
    var rv = this.clean(), i = rv.length, j, k;

    if (i) {
        // Fisher-Yates
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

function Array_first(index) { // @arg Integer(= 0): index from first
                              // @ret Mix/undefined: element value
                              // @help: Array#first
                              // @desc: get value from first
//{@debug
    mm.allow(index, "Integer/undefined");
//}@debug

    return this[index || 0];
}

function Array_last(lastIndex) { // @arg Integer(= 0): index from last
                                 // @ret Mix/undefined: element value
                                 // @help: Array#last
                                 // @desc: get value from last
//{@debug
    mm.allow(lastIndex, "Integer/undefined");
//}@debug

    return this[this.length - (lastIndex || 0) - 1];
}

// --- calculate ---
function Array_sum() { // @ret Number: sum
                       // @desc: sum of numeric elements `` 数値要素の合計を返します。数値要素以外は無視します
                       // @help: Array#sum
    var rv = 0, ary = this.clean("number"), i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        rv += ary[i];
    }
    return rv;
}

function Array_dump() { // @ret String: [ 0x1234, 0x12, 0x0, ... ]
                        // @desc: Hex dump
                        // @help: Array#dump
    var rv, value = this, v, i, iz;

    for (rv = [], i = 0, iz = value.length; i < iz; ++i) {
        v = value[i];
        if (typeof v === "number") {
            rv[i] = v < 0 ? ("-0x" + v.hh(4).slice(1)) // Number#hh
                          : ( "0x" + v.hh(4));
        } else {
            rv[i] = "NaN";
        }
    }
    return "[ " + rv.join(", ") + " ]"; // [ 0x1234, 0x12, 0x0, ... ]
}

function Array_clamp(low,    // @arg Number: low numeric value
                     high) { // @arg Number: high numeric value
                             // @ret Array: clamped numeric elements
                             // @desc: to clamp numeric elements `` 数値要素の値をlowからhightの範囲に制限し数値要素だけの配列を返します
                             // @help: Array#clamp
//{@debug
    mm.allow(low,  "Number");
    mm.allow(high, "Number");
//}@debug

    return this.clean("number").map(function(num) {
        return num.clamp(low, high); // Number#clamp
    });
}

function Array_nsort(desc) { // @arg Boolean(= false): false is ascending(0 -> 99)
                             //                        true is descending(99 -> 0)
                             // @ret Array: new Array
                             // @desc: numeric sort
                             // @help: Array#nsort
    function ascending(a, b) { // 0, 1, .. 98, 99
        return a - b;
    }

    function descending(a, b) { // 99, 98, .. 1, 0
        return b - a;
    }

//{@debug
    mm.allow(desc, "Boolean/undefined");
//}@debug

    return this.clean("number").sort(desc ? descending : ascending);
}

function Array_average(median) { // @arg Boolean(= false): true is median `` ソートしたサンプルの中央の値を採用します
                                 //                        false is total/length `` 合計値をサンプル数で割った値を採用します
                                 // @ret Number: average
                                 // @desc: average of number elements(arithmetic mean) `` 数値要素の平均値を返します
                                 // @help: Array#average
//{@debug
    mm.allow(median, "Boolean/undefined");
//}@debug

    var ary = this.clean("number"), iz = ary.length;

    if (!median) {
        return ary.sum() / iz;
    }
    ary.nsort(); // 0, 1, .. 98, 99
    // `` 奇数ならソートした中央の値を平均値とし、偶数なら中央の2値の平均を取得
    return iz % 2 ? ary[(iz - 1) / 2]                    // odd  `` 奇数
                  : (ary[iz / 2 - 1] + ary[iz / 2]) / 2; // even `` 偶数
}

function Array_or(merge) { // @arg Array: merge `` 比較対象を配列で指定します
                           // @ret Array: filterd array `` 両方の配列に存在する要素を持つ新しい配列を返します
                           // @desc: OR operator`` 2つの配列をマージし重複する要素を取り除いた新しい配列を生成します
                           // @help: Array#or
//{@debug
    mm.allow(merge, "Array");
//}@debug

    return this.concat(merge).unique();
}

function Array_and(compare) { // @arg Array: compare `` 比較対象を配列で指定します
                              // @ret Array: filterd array `` 両方に含まれる要素からなる新しい配列を返します
                              // @desc: AND operator`` 両方の配列に存在する要素からなる新しい配列を生成します
                              // @help: Array#and
//{@debug
    mm.allow(compare, "Array");
//}@debug

    var rv = [], i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            if (compare.indexOf(this[i]) >= 0) { // has
                rv.push(this[i]);
            }
        }
    }
    return rv;
}

function Array_xor(compare) { // @arg Array: compare `` 比較対象を配列で指定します
                              // @ret Array: filterd array `` 両方に含まれない要素からなる新しい配列を返します
                              // @desc: XOR operator`` 両方の配列に存在する要素を除外した新しい配列を生成します
                              // @help: Array#xor
//{@debug
    mm.allow(compare, "Array");
//}@debug

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

function Array_fill(value, // @arg Primitive/Object/Array/Date(= undefined): fill value
                    from,  // @arg Integer(= 0): fill from index
                    to) {  // @arg Integer(= length): fill to index
                           // @ret Array: new Array
                           // @see: http://www.ruby-lang.org/ja/man/html/Array.html
                           // @desc: fill value `` 要素をvalueで上書きします。
                           // @help: Array#fill
//{@debug
    mm.allow(value, "Primitive/Array/Date");
    mm.allow(from,  "Integer/undefined");
    mm.allow(to,    "Integer/undefined");
//}@debug

    var rv = this.concat(), i = from || 0, iz = to || rv.length;

    switch (mm_type(value)) {
    case "date":   for (; i < iz; ++i) { rv[i] = new Date(value); } break;
    case "array":  for (; i < iz; ++i) { rv[i] = value.concat();  } break;
    case "object": for (; i < iz; ++i) { rv[i] = mm_copy(value);  } break;
    default:       for (; i < iz; ++i) { rv[i] = value; }
    }
    return rv;
}

function Array_clear() { // @ret this:
                         // @desc: removes all elements from self `` 配列から全ての要素を削除します。配列自身を変更します
                         // @help: Array#clear
    this.length = 0;
    return this;
}

function Array_choice() { // @ret Mix:
                          // @desc: Random choice
                          // @help: Array#choice
    var index = (Math.random() * this.length) | 0;

    return this[index];
}

function Array_reject(fn) { // @arg Function: callback(element, index)
                            // @ret DenseArray: new Array
                            // @desc: reject elements
                            // @help Array#rejct
//{@debug
    mm.allow(fn, "Function");
//}@debug

    var rv = [], ary = this.clean(), i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        fn(ary[i], i) || rv.push(ary[i]);
    }
    return rv;
}

function Array_select(fn) { // @arg Function: callback(element, index)
                            // @ret DenseArray: new Array
                            // @desc: select elements
                            // @help: Array#select
//{@debug
    mm.allow(fn, "Function");
//}@debug

    var rv = [], ary = this.clean(), i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        fn(ary[i], i) && rv.push(ary[i]);
    }
    return rv;
}

function Array_flatten() { // @ret DenseArray: flat new array
                           // @desc: array flatten `` ネストしている配列を展開し、フラットな新しい配列を返します
                           // @help: Array#flatten
    function _recursiveExpand(ary) {
        var i = 0, iz = ary.length, value;

        for (; i < iz; ++i) {
            if (i in ary) {
                value = ary[i];
                Array.isArray(value) ? _recursiveExpand(value) // recursive call
                                     : rv.push(value);
            }
        }
    }

    var rv = [];

    _recursiveExpand(this);
    return rv;
}

// --- String ----------------------------------------------
function String_trims(chr) { // @arg String: trim char
                             // @ret String: trimed string
                             // @help: String#trims
                             // @desc: trim both all spaces and strip all characters
                             //   `` trim()を行い、文字列の両端からchrを全て除去します
//{@debug
    mm.allow(chr, "String");
//}@debug

    var esc = RegExp.esc(chr);

    return this.trim().replace(RegExp("^" + esc + "+"), "").
                       replace(RegExp(esc + "+" + "$"), "");
}

function String_trimTag() { // @ret String:
                            // @help: String#trimTag
                            // @desc: trim both spaces and strip HTML tags
                            //   `` trim()を行い、HTMLタグ("<...>", "</...>")を全て削除します
    return this.trim().replace(/<\/?[^>]+>/g, "");
}

function String_trimQuote() { // @ret String: trimed string
                              // @help: String#trimQuote
                              // @desc: trim both spaces and strip single/double quotes
                              //    `` trim()を行い、両端からダブルクォート/シングルクォートを削除します。
                              //       削除するのは対応がとれているクォートだけです
    var str = this.trim(), m = /^["']/.exec(str);

    if (m) {
        m = RegExp(m[0] + "$").exec(str);
        if (m) {
            return str.trims(m[0]);
        }
    }
    return str;
}

function String_insert(str,     // @arg String:
                       index) { // @arg Integer(= 0):
                                // @ret String:
                                // @help: String#insert
                                // @desc: insert string
//{@debug
    mm.allow(str,   "String");
    mm.allow(index, "Integer/undefined");
//}@debug

    index = index || 0;

    var leftSide  = this.slice(0, index),
        rightSide = this.slice(index);

    return leftSide + str + rightSide;
}

function String_remove(str,     // @arg String:
                       index) { // @arg Integer(= 0):
                                // @ret String:
                                // @help: String#remove
                                // @desc: remove string
//{@debug
    mm.allow(str,   "String");
    mm.allow(index, "Integer/undefined");
//}@debug

    if (str) {
        index = this.indexOf(str, index || 0);
        if (index >= 0) {
            return this.slice(0, index) + this.slice(index + str.length);
        }
    }
    return this + "";
}

function String_unpack(glue,    // @arg String(= ":"):
                       joint) { // @arg String(= ";"):
                                // @ret Hash:
                                // @help: String#unpack
    return Hash.unpack(this + "", glue, joint);
}

function String_at(ooo) { // @var_args Mix: replace values
                          // @ret String: "@@:@@".at(1,2) -> "1:2"
                          // @help: String#at
                          // @desc: search for "@@", replace the argument
    var i = 0, args = arguments;

    return this.replace(/@@/g, function() {
        return args[i++];
    });
}

function String_up(index) { // @arg Integer(= undefined): position. allow negative index
                            //                            undefined equals this.toUpperCase()
                            // @ret String:
                            // @help: String#up
                            // @desc: String#toUpperCase(index)
//{@debug
    mm.allow(index, "Integer/undefined");
//}@debug
    if (index !== void 0) {
        // calc negative index
        index = index < 0 ? this.length + index : index;
        if (index in this) {
            return this.slice(0, index) + this[index].toUpperCase() +
                   this.slice(index + 1);
        }
    }
    return this.toUpperCase();
}

function String_low(index) { // @arg Integer(= undefined): position. allow negative index
                             //                            undefined equals this.toLowerCase()
                             // @ret String:
                             // @help: String#low
                             // @desc: String#toLowerCase(index)
//{@debug
    mm.allow(index, "Integer/undefined");
//}@debug
    if (index !== void 0) {
        // calc negative index
        index = index < 0 ? this.length + index : index;
        if (index in this) {
            return this.slice(0, index) + this[index].toLowerCase() +
                   this.slice(index + 1);
        }
    }
    return this.toLowerCase();
}

function String_has(find,      // @arg String: character(s) `` 比較対象の文字(列)です
                    anagram) { // @arg Boolean(= false): true is anagram search
                               // @ret Boolean:
                               // @help: String#has
                               // @desc: String has character(s) and ignore-case matching
                               //        `` 文字列が文字(列)を含んでいる場合に true を返します。
                               //           anagram が true なら順番を無視して検索します。
//{@debug
    mm.allow(find,    "String");
    mm.allow(anagram, "Boolean/undefined");
//}@debug

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

function String_isURL(isRelative) { // @arg Boolean(= false):
                                    // @ret Boolean:
                                    // @desc: is absolute url or relative url
                                    // @help: String#isURL
    if (isRelative) {
        return RegExp.URL.test("http://a.a/" + this.replace(/^\/+/, ""));
    }
    return /^(https?|wss?):/.test(this) ? RegExp.URL.test(this)
                                        : RegExp.FILE.test(this);
}

function String_count(find) { // @arg String(= ""): find character.
                              // @ret Integer/Object: count or { char: count, ... }
                              // @help: String#count
                              // @desc: count the number of character
//{@debug
    mm.allow(find, "String/undefined");
    mm.deny(find,  find && find.length > 1);
//}@debug

    var rv = {}, c, ary = this.split(""), i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        c = ary[i];
        rv[c] ? ++rv[c] : (rv[c] = 1);
    }
    return find ? (rv[find] || 0) : rv;
}

function String_numbers(joint) { // @arg String(= ","):
                                 // @ret NumberArray:
                                 // @help: String#numbers
                                 // @desc: to number array
//{@debug
    mm.allow(joint, "String/undefined");
//}@debug

    return this.trim().split(joint || ",").map(parseFloat).clean("number");
}

function String_format(ooo) { // @var_args Mix: sprintf format
                              // @ret String:
                              // @help: String#format
                              // @desc: format `` 文字列をフォーマットします
    var next = 0, index = 0, args = arguments;

    return this.replace(
                /%(?:(\d+)\$)?(#|0| )?(\d+)?(?:\.(\d+))?(l)?([%iduoxXfcs])/g, _parse);
                //   ~~~~~    ~~~~~~~ ~~~~~      ~~~~~      ~~~~~~~~~~~~~~
                //  argIndex   flag   width    precision        types
                //
    function _parse(_,        // @arg String: dummy
                    argIndex, // @arg String: matched arg index
                    flag,     // @arg String: flag (#|0| )
                    width,    // @arg String: width
                    prec,     // @arg String: precision
                    size,     // @arg String: dummy
                    types) {  // @arg String: types (%|i|d|u|o|x|X|f|c|s)

        if (types === "%") { // escape "%%" -> "%"
            return types;
        }
        index = argIndex ? parseInt(argIndex) : next++;

        // 0x0001: parse int        (%i, %d, %u, %o, %x, %X)
        // 0x0002: parse float      (%f)
        // 0x0004: to string        (%s)
        // 0x0010: negative padding control (%i, %d, %f)
        // 0x0020: to unsinged      (%u, %o, %x, %X)
        // 0x0040: add prefix       (%o -> "0", %x -> "0x", %X -> "0x")
        // 0x0080: precision        (%f, %s)
        // 0x0100: to octet         (%o)
        // 0x0200: to hex           (%x, %X)
        // 0x0800: padding          (%c)
        // 0x1000: to upper case    (%X)
        // 0x2000: get char         (%c)
        // 0x4000: check overflow   (%c)
        var BITS = {
                i: 0x0011, // "%i" padding + to int
                d: 0x0011, // "%d" padding + to int
                u: 0x0021, // "%u" padding + to unsinged
                o: 0x0161, // "%o" padding + to octet + to unsigned + add prefix("0")
                x: 0x0261, // "%x" padding + to hex   + to unsigned + add prefix("0")
                X: 0x1261, // "%X" padding + to upper case + to hex + to unsigned + add prefix("0")
                f: 0x0092, // "%f" precision + padding + to float
                c: 0x6800, // "%c" get first char + padding
                s: 0x0084  // "%s" precision + to string
            },
            bits = BITS[types], overflow, pad,
            rv = (args[index] === void 0) ? "" : args[index];

        bits & 0x0001 && (rv = parseInt(rv));
        bits & 0x0002 && (rv = parseFloat(rv));
        bits & 0x0003 && (rv = rv === rv ? rv : ""); // isNaN
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
        // padding
        if (!(bits & 0x0800 || width === void 0 || rv.length >= width)) {
            pad = ((!flag || flag === "#") ? " " : flag).repeat(width - rv.length);
            rv  = ((bits & 0x0010 && flag === "0") && !rv.indexOf("-")) ?
                        "-" + pad + rv.slice(1) :
                        pad + rv;
        }
        return rv;
    }
}

function String_unique() { // @ret String:
                           // @help: String#unique
                           // @desc: remove duplicate characters

    return this.split("").unique().join("");
}

function String_encode(code) { // @arg String(= "utf16"): "utf16", "utf8",
                               //                         "base64", "safe64", "entity"
                               // @ret CodedArray/String: [mix, ...] + { code: String }
                               // @help: String#encode
                               // @desc: encode String to CodedArray
//{@debug
    mm.allow(code, "String/undefined");
    mm.allow(code, ["", "utf16", "utf8", "base64", "safe64",
                    "entity"].has((code || "").toLowerCase()));
//}@debug

    switch ((code || "utf16").toLowerCase()) {
    case "utf8":  return _String_toUTF8Array(this);   // [...] + { code: "utf8" }
    case "utf16": return _String_toUTF16Array(this);  // [...] + { code: "utf16" }
    case "base64":return _String_toBase64Array(this); // String
    case "safe64":return _String_toBase64Array(this). // String
                            replace(/\=+$/g, "").replace(/\+/g, "-").
                                                 replace(/\//g, "_");
    case "entity":return _String_toHTMLEntity(this);  // String
    }
    return "";
}

function String_decode(code) { // @arg String(= "base64"): "base64", "safe64", "entity"
                               // @ret String:
                               // @help: String#decode
                               // @desc: decode String to String
//{@debug
    mm.allow(code, "String/undefined");
    mm.allow(code, ["", "base64", "safe64", "entity"].has((code || "").toLowerCase()));
//}@debug

    switch ((code || "base64").toLowerCase()) {
    case "base64":
    case "safe64":return _String_fromBase64(this); // String
    case "entity":return _String_fromHTMLEntity(this); // String
    }
    return "";
}

function _String_toUTF16Array(data) { // @arg String:
                                      // @ret CodedArray: [...] + { code: "utf16" }
                                      // @inner convert String to UTF16IntegerArray
    var rv = [], i = 0, iz = data.length;

    for (; i < iz; ++i) {
        rv[i] = data.charCodeAt(i) & 0x1fffff;
    }
    rv.code = "utf16";
    return rv;
}

function _String_toUTF8Array(data) { // @arg String:
                                     // @ret CodedArray: [...] + { code: "utf8" }
                                     // @inner: String to UTF8IntegerArray
    // RFC3629 - UTF-8, a transformation format of ISO 10646 -
    // +------------------+-------------------+-----------+-----------+-----------+-----------+
    // | Code             | Representation    | 1st byte  | 2nd byte  | 3rd byte  | 4th byte  |
    // +------------------+-------------------+-----------+-----------+-----------+-----------+
    // | 0x0000 -  0x007F | 00000000 0zzzzzzz | 0zzz zzzz |           |           |           |
    // +------------------+-------------------+-----------+-----------+-----------+-----------+
    // | 0x0080 -  0x07FF | 00000yyy yyzzzzzz | 110y yyyy | 10zz zzzz |           |           |
    // +------------------+-------------------+-----------+-----------+-----------+-----------+
    // | 0x0800 -  0xD7FF | xxxxyyyy yyzzzzzz | 1110 xxxx | 10yy yyyy | 10zz zzzz |           |
    // +------------------+-------------------+-----------+-----------+-----------+-----------+
    // | 0xD800 -  0xDBFF | 110110vv vvwwwwxx | 1111 0uuu | 10uu wwww | 10xx yyyy | 10zz zzzz |
    // |                  | 110111yy yyzzzzzz |           |           |           |           |
    // +------------------+-------------------+-----------+-----------+-----------+-----------+
    // | 0xE000 -  0xFFFF | xxxxyyyy yyzzzzzz | 1110 xxxx | 10yy yyyy | 10zz zzzz |           |
    // +------------------+-------------------+-----------+-----------+-----------+-----------+
    // |0x10000 -0x10FFFF | 00000000 000xxxyy | 1111 0xxx | 10yy yyyy | 10zz zzzz | 10ww wwww |
    // |                  | yyyyzzzz zzwwwwww |           |           |           |           |
    // +------------------+-------------------+-----------+-----------+-----------+-----------+
    var rv = [], i = 0, iz = data.length, c = 0, next, u;

    for (; i < iz; ++i) {
        c = data.charCodeAt(i);
        if (c < 0x80) { // 1 byte
            rv.push(c);
        } else if (c < 0x0800) { // 2 bytes
            rv.push(c >>>  6 & 0x1f | 0xc0, c        & 0x3f | 0x80);
        } else if (c >= 0xD800 && c <= 0xE000) { // 4bytes
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
        } else if (c < 0x10000) { // 3 bytes
            rv.push(c >>> 12 & 0x0f | 0xe0, c >>>  6 & 0x3f | 0x80,
                                            c        & 0x3f | 0x80);
        } else if (c < 0x110000) { // 4 bytes
            rv.push(c >>> 18 & 0x07 | 0xf0, c >>> 12 & 0x3f | 0x80,
                    c >>>  6 & 0x3f | 0x80, c        & 0x3f | 0x80);
        }
    }
    rv.code = "utf8";
    return rv;
}

function _String_toBase64Array(data) { // @arg String:
                                       // @ret String:
                                       // @inner: String to UTF8Base64String
    _base64_db || _initBase64();

    var rv = [], ary = data.encode("utf8"),
        c = 0, i = -1, iz = ary.length,
        pad = [0, 2, 1][iz % 3],
        chars = _base64_db.chars;

    --iz;
    while (i < iz) {
        c = (ary[++i] << 16) | (ary[++i] << 8) | (ary[++i]); // 24bit
        rv.push(chars[(c >> 18) & 0x3f], chars[(c >> 12) & 0x3f],
                chars[(c >>  6) & 0x3f], chars[ c        & 0x3f]);
    }
    pad > 1 && (rv[rv.length - 2] = "=");
    pad > 0 && (rv[rv.length - 1] = "=");
    return rv.join("");
}

function _String_fromBase64(data) { // @arg UTF8Base64String/UTF8Safe64String:
                                    // @ret String:
                                    // @inner: decode Base64String to String
    _base64_db || _initBase64();

    var rv = [],
        c = 0, i = -1,
        ary = data.split(""),
        iz = data.length - 1,
        codes = _base64_db.codes;

    while (i < iz) {                // 00000000|00000000|00000000 (24bit)
        c = (codes[ary[++i]] << 18) // 111111  |        |
          | (codes[ary[++i]] << 12) //       11|1111    |
          | (codes[ary[++i]] <<  6) //         |    1111|11
          |  codes[ary[++i]];       //         |        |  111111
                                    //    v        v        v
        rv.push((c >> 16) & 0xff,   // --------
                (c >>  8) & 0xff,   //          --------
                 c        & 0xff);  //                   --------
    }
    rv.length -= [0, 0, 2, 1][data.replace(/\=+$/, "").length % 4]; // cut tail

    rv.code = "utf8";
    return rv.decode();
}

function _initBase64() { // @inner: init base64
    var base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        i = 0;

    _base64_db = {
        chars: base.split(""),              // ["A", "B", ... "/"]
        codes: { "=": 0, "-": 62, "_": 63 } // URLSafe64 chars("-", "_")
    };

    for (; i < 64; ++i) {
        _base64_db.codes[base.charAt(i)] = i;
    }
}

function _String_toHTMLEntity(data) { // @arg String:
                                      // @ret String:
                                      // @inner convert String to UTF16IntegerArray
    function _toEntity(code) {
        var hash = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

        return hash[code];
    }

    return data.replace(/[&<>"]/g, _toEntity);
}

function _String_fromHTMLEntity(data) { // @arg String:
                                        // @ret String:
                                        // @inner: decode String from HTML Entity
    function _fromEntity(code) {
        var hash = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"' };

        return hash[code];
    }

    return data.replace(/&(?:amp|lt|gt|quot);/g, _fromEntity).
                replace(/\\u([0-9a-f]{4})/g, function(m, hex) { // \u0000 ~ \uffff
                    return String.fromCharCode(parseInt(hex, 16));
                });
}

function String_overflow(maxLength, // @arg Integer:         `` 文字列の最大長を指定します
                         omit) {    // @arg String(= "..."): `` 省略記号の指定です。省略可能です
                                    // @ret String:         `` 加工後の文字列を返します
                                    // @help: String#overflow
                                    // @desc: overflow string `` 最大長以下になるように文字列を切り落とし省略した事をしめす"..."を末尾に追加します
//{@debug
    mm.allow(maxLength, "Integer");
    mm.allow(omit,      "String/undefined");
//}@debug

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

function String_capitalize() { // @ret String:
                               // @help: String#capitalize
    return this.low().up(0);
}

function String_exec() { // @ret Mix/undefined: result
                         // @help: String#exec
    try {
        return (new Function(this))();
    } catch (o_o) {
    }
    return;
}

function Number_to(end,            // @arg Integer: end number `` 終了番号を数値で指定します。filterが1ならendで指定した終了番号を含みます
                   filterOrStep) { // @arg Function/Integer(= 1): filter function or step number
                                   // @ret Array: [begin, ... end]
                                   // @this: begin number
                                   // @help: Number#to
                                   // @desc: create number array `` 数値の配列を作成します
                                   // @throw: Error("BAD_ARG")
//{@debug
    mm.allow(end,          "Integer");
    mm.allow(filterOrStep, "Function/Integer/undefined");
//}@debug

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

function Number_pad(digits,  // @arg Integer(= 2): digits. 1 - 32
                    radix) { // @arg Integer(= 10): radix. 2 - 36
                             // @ret String:
                             // @help: Number#pad
                             // @desc: to uint32 and pad zero
//{@debug
    mm.allow(digits, "Integer/undefined");
    mm.allow(radix,  "Integer/undefined");
    mm.deny(digits, digits && (digits < 1 || digits > 32));
    mm.deny(radix,  radix  && (radix  < 2 || radix  > 36));
//}@debug

    digits = digits || 2;
    radix  = radix  || 10;

    var num = Math.abs(+this) >>> 0;

    // 0..pad() -> "00"
    // 9..pad() -> "09"
    // (-11.1).pad(4) -> "0011"
    if (digits === 2 && radix === 10 && num < 100) {
        return num < 10 ? "0" + num : "" + num;
    }
    return ("00000000000000000000000000000000" +
            num.toString(radix)).slice(-digits);
}

function Number_xor(value) { // @arg Integer:
                             // @ret Integer:
                             // @help: Number#xor
                             // @desc: 32bit xor value
//{@debug
    mm.allow(value, "Integer/undefined");
//}@debug

    return (this ^ value) >>> 0; // to uint32
}

function Number_wait(fn_that, // @arg Function/Array: callback or [that, callback]
                     ooo) {   // @var_args Mix(= undefined): callback.apply(that, var_args)
                              // @this Number: delay seconds
                              // @ret Integer: atom (setTimeout timer id)
                              // @help: Number#wait
                              // @desc: lazy evaluate function
//{@debug
    mm.allow(fn_that, "Function/Array");
    if (Array.isArray(fn_that)) {
        if (typeof fn_that[1] !== "function" || fn_that.length !== 2) {
            throw new Error("BAD_ARG");
        }
    }
//}@debug

    var that = fn_that[0] || null,
        fn   = fn_that[1] || fn_that,
        args = Array.prototype.slice.call(arguments, 1);

    return setTimeout(function() {
                fn.apply(that, args);
            }, this * 1000);
}

function Number_times(fn_that, // @arg Function/Array: callback or [that, callback]
                      ooo) {   // @var_args Mix(= undefined): callback.apply(that, var_args, call_count)
                               // @ret ResultMixArray: iterator results `` コールバック関数の戻り値を配列で返します
                               // @help: Number#times
                               // @desc: n times iterator function `` 関数を数回呼び出し、結果を配列で返します
//{@debug
    mm.allow(fn_that, "Function/Array");
    if (Array.isArray(fn_that)) {
        if (typeof fn_that[1] !== "function" || fn_that.length !== 2) {
            throw new Error("BAD_ARG");
        }
    }
//}@debug

    var rv   = [],
        that = fn_that[0] || null,
        fn   = fn_that[1] || fn_that,
        args = Array.prototype.slice.call(arguments, 1),
        i = 0, iz = +this | 0,
        fn_args = args ? args.concat() : [],
        fn_args_last = fn_args.length;

    if (iz > 0) {
        for (; i < iz; ++i) {
            fn_args[fn_args_last] = i; // add/update index
            rv.push(fn.apply(that, fn_args));
        }
    }
    return rv;
}

function Number_clamp(low,    // @arg Number: low numeric value
                      high) { // @arg Number: high numeric value
                              // @ret Number: clamped value
                              // @desc: to clamp numeric elements `` 値をlowからhightの範囲に制限します
                              // @help: Number#clamp
//{@debug
    mm.allow(low,  "Number");
    mm.allow(high, "Number");
//}@debug

    var num = +this, swap;

    // swap low <-> high
    if (low > high) {
        swap = [high, low];
        low  = swap[0];
        high = swap[1];
    }
    return num < low  ? low  :
           num > high ? high : num;
}

function Number_toRadians() { // @ret Number: radians value
                              // @help Number#toRadians
                              // @desc: Degree to Radian
    return this * Math.PI / 180;
}

function Number_toDegrees() { // @ret Number: degrees value
                              // @help Number#toDegrees
                              // @desc: Radian to Degree
    return this * 180 / Math.PI;
}

function Number_chr() { // @ret String:
                        // @help: Number#chr
                        // @desc: convert char code to String
    return String.fromCharCode(this);
}

function Number_rand() { // @ret Integer/Number:
                         // @help: Number#rand
                         // @desc: create random number
    var num = +this;

    return num ? (Math.random() * num) | 0 // 10..rand() -> from 0   to 10 (integer)
               :  Math.random();           //  0..rand() -> from 0.0 to 1.0 (number)
}

function Function_help(that) { // @arg this:
                               // @help: Function#help
                               // @desc: show help url
    that = that || this;
    var url = _getHelpURL(that);

    return url + "\n\n" + that + "\n\n" + url;
}

function _getHelpURL(fn) { // @arg Function/undefined:
                           // @inner: get help url
    var rv, help = /@help:\s*([^ \n\*]+)\n?/.exec("\n" + fn + "\n");

    if (help) {
        rv = _help_db.chain(help[1].trim());
    }
    return rv || "";
}

function Function_help_add(url,    // @arg URLString: help url string
                           word) { // @arg StringArray/RegExp: keywords or pattern
                                   // @desc: add help chain
//{@debug
    mm.allow(url,  "String");
    mm.allow(word, "Array/RegExp");
//}@debug

    if (Array.isArray(word)) {
        word = RegExp("^(" + word.join("|") + ")(?:([#\\.])([\\w\\,]+))?$");
    }

    _help_db.push(word, function(rex, index, param) {
        var m = rex.exec(param),
            dotfn = "@@@@#@@.@@",
            proto = "@@@@#@@.prototype.@@";

        if (!m) { return false; }
        return !m[2] ? "@@@@".at(url, m[1])
             : m[2] === "." ? dotfn.at(url, m[1], m[1], m[3])
                            : proto.at(url, m[1], m[1], m[3]);
    });
}

function Function_callby(that,  // @arg this: method this
                         ooo) { // @var_args Mix:
                                // @ret Mix:
                                // @help: Function#callby
                                // @desc: method call, expand the Arguments object
    var ary = [], args = arguments, i = 1, iz = args.length;

    for (; i < iz; ++i) {
        if (mm_type(args[i]) === "list") {
            Array.prototype.push.apply(ary, Array.from(args[i]));
        } else {
            ary.push( args[i] );
        }
    }
    return this.apply(that, ary);
}

function Function_nickname(defaultName) { // @arg String(= ""): default nickname
                                          // @ret String: function name
                                          // @help: Function#nickname
                                          // @desc: get function name
//{@debug
    mm.allow(defaultName, "String/undefined");
//}@debug
    var name = this.name || (this + "").split("(")[0].trim().slice(9); // )

    return name ? name.replace(/^mm_/, "mm.") // mm_like -> mm.like
                : defaultName; // [IE][Opera<11]
}

function RegExp_esc(str) { // @arg String:
                           // @ret EscapedString:
                           // @help: RegExp.esc
//{@debug
    mm.allow(str, "String");
//}@debug
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}

function RegExp_flag(command) { // @arg String(= ""): ""(clear). "+g"(add), "-g"(remove)
                                // @ret RegExp: new RegExp Object
                                // @help: RegExp#flag
                                // @desc: add/remove/clear RegExp flag
//{@debug
    mm.allow(command, "String/undefined");
//}@debug
    var flag = (this + "").slice(this.source.length + 2);

    if (!command) { // flag() -> clear
        flag = "";
    } else if (command[0] === "-") { // flag("-img") -> remove
        command.slice(1).split("").each(function(f) {
            flag = flag.remove(f);
        });
    } else { // flag("+img") -> add
        flag = (flag + command.trims("+")).unique();
    }
    return RegExp(this.source, flag);
}

// --- Await -----------------------------------------------
function Function_await(waits,  // @arg Integer: wait count
                        tick) { // @arg Function(= undefined): tick callback({ ok, args, state })
                                // @ret AwaitInstance:
                                // @this: callback function. callback(result)
                                //    result - Object: { ok, args, state }
                                //      ok - Boolean: true is result.state === 200
                                //      args - Array: pass(arg) and miss(arg) args collections
                                //      state - Integer: 200(success), 400(error)
                                // @help: Await#await
                                // @desc: create Await instance
//{@debug
    mm.allow(waits, "Integer");
    mm.allow(tick,  "Function/undefined");
    if (waits < 1) { throw new Error("BAD_ARG"); }
//}@debug

    return new Await(this, waits, tick);
}

function Await_missable(missables) { // @arg Integer:
//{@debug
    mm.allow(missables, "Integer");
    if (missables < 0 || missables >= this._db.waits) {
        throw new Error("BAD_ARG");
    }
//}@debug
    this._db.missables = missables;
    return this;
}

function Await_pass(value) { // @arg Mix(= undefined): value
                             // @ret this:
                             // @help: Await#pass
                             // @desc: pass a process
    ++this._db.pass;
    this._db.args.push(value);
    _Await_next(this._db);
    return this;
}

function Await_miss(value) { // @arg Mix(= undefined): value
                             // @ret this:
                             // @help: Await#miss
                             // @desc: miss a process
    ++this._db.miss;
    this._db.args.push(value);
    _Await_next(this._db);
    return this;
}

function _Await_next(db) {
    if (db.state === 100) {
        // `` miss が missables を超えて呼ばれている -> 失敗
        // `` pass + miss が waits 以上呼ばれている  -> 成功
        db.state = db.miss > db.missables ? 400        // ng
                 : db.pass + db.miss >= db.waits ? 200 // ok
                 : db.state;
    }
    db.tick && db.tick({ ok: db.state === 200, args: db.args, state: db.state }); // tick callback

    if (db.state > 100) { // change state?
        if (db.fn) {
            db.fn({ ok: db.state === 200, args: db.args, state: db.state }); // end callback
            db.fn = db.tick = null;
            db.args = []; // gc
        }
    }
}

function Await_state() { // @ret Integer: current state,
                         //                 100 is continue,
                         //                 200 is success,
                         //                 400 is error
                         // @help: Await#state
                         // @desc: get current state
    return this._db.state;
}

// --- test ----------------------------------------------
function Array_test(label, // @arg String(= ""): label
                    arg) { // @arg Mix(= undefined): test arg
                           // @this: test case
                           // @throw: TypeError("NEED_BOOLEAN_VALUE: ...")
                           //         TypeError("BAD_TYPE: ...")
                           // @help: Array#test
                           // @desc: unit test
//{@debug
    mm.allow(label, "String/undefined");
//}@debug

    if (!this.length) { return; }

    var nicknames = _enumNicknames(this.clean()), // { object, array }
        plan, group, param;

    plan = _streamTokenizer( nicknames.array.join(" > ") ); // [ ["fn1"], ["fn2", "fn3"] ]
    group = plan.shift();
    param = mm.mix(nicknames.object, { arg: arg, pass: 0, miss: 0,
                                       logg: mm_logg(label || "") });

    group && _recursiveTestCase( plan, group, param );
}

function _recursiveTestCase(plan,    // @arg StringArrayArray: [[fn1, fn2, ...], [fn3, ...]]
                            group,   // @arg Array: group
                            param) { // @arg FunctionObject: { init, fin, fn1, ... }
                                     // @throw: TypeError("NEED_BOOLEAN_VALUE: ...")
                                     //         TypeError("BAD_TYPE: ...")
                                     // @inner: do test
    var i = 0;

    group.each(function(action) { // @param String: command string. "fn1"

        var lval, rval, // left-value, right-value
            jrv, // judge function result value
            jfn, // judge function name
            msg;

        switch (mm.type(param[action])) {
        case "array": // [ left-values, right-value, override-judge-function ]
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
        case "function": // function -> sync or async lazy evaluation
            jrv = param[action](_callback);

            switch (jrv) {
            case false:  // function  sync() { return false; } -> miss
            case true:   // function  sync() { return true;  } -> pass
                _callback(jrv);
                break;
            case void 0: // function  sync(no arguments) { return undefined; } -> TypeError
                         // function async(no arguments) { ...               } -> TypeError
                         // function async(next) { 0..wait(next);                        } -> pass
                         // function async(next) { 0..wait(function() { next(true);  }); } -> pass
                         // function async(next) { 0..wait(function() { next(false); }); } -> miss
                if (param[action].length) {
                    break;
                }
            default:     // function  sync() { return 123; } -> TypeError
                debugger;
                throw new TypeError("NEED_BOOLEAN_VALUE: " + action);
            }
            break;
        default:
            debugger;
            throw new TypeError("BAD_TYPE: " + action);
        }

        // inner -
        function _callback(result, // @arg Boolean:
                           msg) {  // @arg String(= ""): log message
                                   // @lookup: param, action, i, group
            var miss = result === false, nextAction, arg;

            miss ? param.logg.error(action + ":", result, msg)
                 : param.logg(action + ":", result, msg);
            miss ? ++param.miss
                 : ++param.pass;


            // Array#test.tick の戻り値が false ならテストを中断する
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
            if (++i >= group.length) {
                nextAction = plan.shift();
                nextAction ? _recursiveTestCase( plan, nextAction, param )
                           : param.logg.out(); // end of action
            }
        }
    });
}

function _enumNicknames(ary) { // @arg FunctionArray/MixArray:
                               // @ret Object: { array, object }
                               //        array - Array: [ nickname, key, ... ]
                               //        object - Object: { nickname: fn, ... key: value ... }
                               // @desc: enum function nickname from Array
                               // @inner: enum nicknames
    var rv = { object: {}, array: [] }, i = 0, iz = ary.length, key;

    for (; i < iz; ++i) {
        key = typeof ary[i] === "function" ? ary[i].nickname("fn" + i)
                                           : "" + i;
        rv.object[key] = ary[i];
        rv.array.push(key);
    }
    return rv;
}

function _streamTokenizer(command) { // @arg String: command string. "a>b+c>d>foo"
                                     // @ret ArrayArrayString:
                                     //         exec plan. [ ["a"], ["b", "c"], ["d"], ["foo"] ]
                                     //                      ~~~~~  ~~~~~~~~~~  ~~~~~  ~~~~~~~
                                     //                      group   group       group  group
                                     //                         ________^_________
                                     //                         parallel execution
                                     // @inner: stream DSL tokenizer
    var plan = [], remain = [];

    command.match(/([\w\-\u00C0-\uFFEE]+|[/+>])/g).each(function(token) {
        token === "+" ? 0 :
        token === ">" ? (remain.length && plan.push(remain.shifts())) // Array#shifts
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

// --- stream ----------------------------------------------
function Array_stream() { // @this - FunctionArray
                          // @ret Object: { uid: number, halt: function }
                          // @help: Array#stream
                          // @desc: create Stream
    return _enumNicknames(this).array.join(" > ").stream(this);
}

function String_stream(methods) { // @arg Object/Array: { fn, ... } or [ fn, ... ]
                                  // @ret Object: { halt: function }
                                  // @this: command string. "fn1 > delay > fn2 + fn3"
                                  //            fn - FunctionNameString:
                                  //            delay - NumberString/UnitizedNumberString: "1" or "1s" is 1sec, "1ms" is 1ms
                                  // @throw: TypeError("FUNCTION_NOT_FOUND: ...")
                                  //         TypeError("NEED_BOOLEAN_VALUE: ...")
                                  // @desc: create stream
                                  // @help: String#stream
//{@debug
    mm.allow(methods, "Object/Array/undefined");
//}@debug

    var commands = "" + this,
        plan = _streamTokenizer(commands); // plan: [ [ "fn1" ], [ delay ], [ "fn2", "fn3" ] ]

    methods = Array.isArray(methods) ? _enumNicknames(methods).object
                                     : methods;
    methods.__cancel__ = false;
    methods.__halt__ = function(action, error) {
        methods.__halt__ = mm.nop;
        methods.__cancel__ = true;
        methods.halt && methods.halt(action || "user", error || false);
    };
    plan.length && _nextStream(methods, plan);

    return { halt: methods.__halt__ };
}

function _nextStream(methods, // @arg Object: { init, fin, halt, fn1, ... }
                     plan) {  // @arg StringArrayArray: [[fn1, fn2, ...], [fn3, ...]]
                              // @throw: TypeError("FUNCTION_NOT_FOUND: ...")
                              //         TypeError("NEED_BOOLEAN_VALUE: ...")
                              // @inner: exec next stream group
    if (methods.__cancel__) {
        return;
    }
    var i = 0, group = plan.shift(); // parallel execution group. [action, ...]

    group && group.each(function(action) { // @param String: command string. "fn1"
        var r, ms, delay = /^(?:(\d+ms)|(\d+s)|(\d+))$/.exec(action);

        if (delay) { // "1", "1s", "1ms"
            ms = parseInt(delay[0]) * (delay[1] ? 1 : 1000);
            setTimeout(function() {
                _judge(true);
            }, ms);
        } else if (!(action in methods)) {
            throw new TypeError("FUNCTION_NOT_FOUND: " + action);
        } else {
            try {
                // function -> sync or async lazy evaluation
                r = methods[action](_judge);
            } catch (O_o) {
//{@debug
                mm_log(mm.env.chrome ? O_o.stack.replace(/at eval [\s\S]+$/m, "")
                                     : O_o + "");
                debugger;
//}@debug
                return methods.__halt__(action, true);
            }
            switch (r) {
            case false:  // function  sync() { return false; } -> miss
            case true:   // function  sync() { return true;  } -> pass
                _judge(r);
                break;
            case void 0: // function  sync(no arguments) { return undefined; } -> TypeError
                         // function async(no arguments) { ...               } -> TypeError
                         // function async(next) { 0..wait(next);                        } -> pass
                         // function async(next) { 0..wait(function() { next(true);  }); } -> pass
                         // function async(next) { 0..wait(function() { next(false); }); } -> miss
                if (methods[action].length) { // function has argument
                    break;
                }
            default:     // function  sync() { return 123; } -> TypeError
//{@debug
                debugger;
//}@debug
                throw new TypeError("NEED_BOOLEAN_VALUE: " + action);
            }
        }

        function _judge(result) { // @arg Boolean:
            if (result === false) {
                methods.__halt__(action, false);
            } else if (++i >= group.length) {
                _nextStream(methods, plan); // recursive call
            }
        }
    });
}

// --- sync / async iterate ------------------------------------------
function Array_sync() { // @ret ModArray: Array + { map, each, some, every }
                        // @help: Array#sync
                        // @desc: TBD
    this.map  = Array.prototype.map;
    this.each = Array.prototype.each;
    this.some = Array.prototype.some;
    this.every= Array.prototype.every;
    return this;
}

function Array_async(callback, // @arg Function(= undefined): callback(result:MixArray/Boolean/undefined, error:Boolean)
                     wait,     // @arg Integer(= 0): async wait time (unit: ms)
                     unit) {   // @arg Integer(= 0): units to processed at a time.
                               //                    0 is auto detection (maybe 50000)
                               // @ret ModArray: Array + { map, each, some, every }
                               // @help: Array#async
                               // @desc: TBD
//{@debug
    mm.allow(callback, "Function/undefined");
    mm.allow(wait,     "Integer/undefined");
    mm.allow(unit,     "Integer/undefined");
    mm.allow(wait,     wait ? wait > 0 : true);
    mm.allow(unit,     unit ? unit > 0 : true);
//}@debug

    callback = callback || mm_nop;
    wait = ((wait || 0) / 1000) | 0;
    unit = unit || 0;

    if (!unit) { // auto detection
         unit = 50000; // TODO: bench and detection
    }

    this.map  = function(fn, that) { return _async_iter(this, fn, that, callback, wait, unit, "map" ); };
    this.each = function(fn, that) { return _async_iter(this, fn, that, callback, wait, unit, "each"); };
    this.some = function(fn, that) { return _async_iter(this, fn, that, callback, wait, unit, "some"); };
    this.every= function(fn, that) { return _async_iter(this, fn, that, callback, wait, unit, "every");};
    return this;
}

function _async_iter(ary,      // @arg Array:
                     fn,       // @arg Function: callback function
                     that,     // @arg Mix: callback.apply(fn_that)
                     callback, // @arg Function:
                     wait,     // @arg Integer:
                     unit,     // @arg Integer:
                     iter) {   // @arg String: iterator function name. "map", "each", "some" and "every"
                               // @ret Object: { halt }
                               // @innert:
    var i = 0, iz = ary.length, range, cmd = [], obj = {}, result;

    if (iter === "map") {
        result = Array(iz);
    }
    for (; i < iz; i += unit) {
        range = Math.min(iz, i + unit);
        switch (iter) {
        case "map":   obj["fn" + i] =  _each(ary, fn, that, i, range, true);  break;
        case "each":  obj["fn" + i] =  _each(ary, fn, that, i, range, false); break;
        case "some":  obj["fn" + i] = _every(ary, fn, that, i, range, true);  break;
        case "every": obj["fn" + i] = _every(ary, fn, that, i, range, false);
        }
        cmd.push("fn" + i, wait);
    }
    obj.end = function(next) {
        callback(result, false);
        return true; // String#stream spec (need return boolean)
    };
    obj.halt = function(action, error) {
        callback(result, error);
    };
    cmd.pop(); // remove last wait
    return (cmd.join(" > ") + " > end").stream(obj); // String#stream

    // --- internal ---
    function _each(ary, fn, that, i, iz, map) {
        return function() {
            for (var r; i < iz; ++i) {
                if (i in ary) {
                    r = fn.call(that, ary[i], i, ary);
                    map && (result[i] = r);
                }
            }
            return true; // -> next stream
        };
    }
    function _every(ary, fn, that, i, iz, some) {
        return function() {
            for (var r; i < iz; ++i) {
                if (i in ary) {
                    r = fn.call(that, ary[i], i, ary);
                    if (!r && !some || r && some) {
                        result = some ? true : false;
                        return false; // -> halt stream -> callback(result)
                    }
                }
            }
            result = some ? false : true;
            return true; // -> next stream
        };
    }
}

// --- Object ----------------------------------------------
function Object_has(data,   // @arg Object/Function:
                    find) { // @arg Object: { key: value, ... }
                            // @ret Boolean:
    var key, keys = Object.keys(find), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        if (!(key in data) || !Object_like( data[key], find[key] )) {
            return false;
        }
    }
    return true;
}

function Object_like(lval,   // @arg Mix: left value
                     rval) { // @arg Mix: right value
                             // @ret Boolean: true is like value and like structures
                             // @inner: Like and deep matching.
                             //         This function does not search inside
                             //         the prototype chain of the object.
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
    case "list":    return Array.from(lval) + "" === Array.from(rval) + "";
    case "array":   return lval + "" === rval + "";
    case "regexp":  return lval.source === rval.source;
    case "object":  return ((Object.keys(lval).length === Object.keys(rval).length) &&
                           Object_has(lval, rval));
    case "number":  return isNaN(lval) && isNaN(rval) ? true : lval === rval;
    }
    return (lval && lval.toJSON) ? lval.toJSON() === rval.toJSON()
                                 : lval === rval;
}

function Object_map(obj,  // @arg Object/Function:
                    fn) { // @arg Function: callback function
                          // @ret Array: [result, ...]
    var rv = [], key, keys = Object.keys(obj), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        rv.push( fn(obj[key], key) );
    }
    return rv;
}

function Object_each(obj,  // @arg Object/Function:
                     fn) { // @arg Function: callback function
    var key, keys = Object.keys(obj), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        fn(obj[key], key);
    }
}

function Object_some(obj,  // @arg Object/Function:
                     fn) { // @arg Function: fn(value, key)
                           // @ret Boolean:
    var key, keys = Object.keys(obj), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        if ( fn(obj[key], key) ) {
            return true;
        }
    }
    return false;
}

function Object_every(obj,  // @arg Object/Function:
                      fn) { // @arg Function: fn(value, key)
                            // @ret Boolean:
    var key, keys = Object.keys(obj), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        if ( !fn(obj[key], key) ) {
            return false;
        }
    }
    return true;
}

function Object_match(obj,  // @arg Object/Function:
                      fn) { // @arg Function: fn(value, key)
                            // @ret Mix/undefined:
    var key, keys = Object.keys(obj), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        if ( fn(obj[key], key) ) {
            return obj[key];
        }
    }
    return;
}

function Object_clean(data,           // @arg Object/Function:
                      typeofFilter) { // @arg String(= ""): typeof filter
                                      // @ret DenseObject: new Object
                                      // @desc: convert sparse object to dense object,
                                      //        trim undefined, null and NaN value
    typeofFilter = typeofFilter || "";

    var rv = {}, key, value, keys = Object.keys(data), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
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

function Object_count(obj) { // @arg Object/Function/Array:
                             // @ret Object: { value: value-count, ... }
    var rv = {}, value, keys = Object.keys(obj), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        value = obj[keys[i]] + ""; // toString(value)
        rv[value] ? ++rv[value] : (rv[value] = 1);
    }
    return rv;
}

function Object_pick(obj,     // @arg Object/Function/Array:
                     names) { // @arg String/StringArray:
                              // @ret Array: [mix, ...]
    var rv = [], key, keys = Object.keys(obj), i = 0, iz = keys.length,
        child, ary = Array.toArray(names), j, jz = ary.length;

    for (; i < iz; ++i) { // uupaa-looper
        child = obj[keys[i]];

        for (j = 0; j < jz; ++j) {
            key = ary[j];
            child.hasOwnProperty(key) && rv.push( child[key] );
        }
    }
    return rv;
}

function Object_values(obj) { // @arg Object/Function/Array/Style/Node/Global:
                              // @ret Array: [value, ...]
    var rv = [], keys = Object.keys(obj), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        rv.push( obj[keys[i]] );
    }
    return rv;
}

// --- Hash ------------------------------------------------
function Hash_clean(typeofFilter) { // @arg String(= ""):
                                    // @ret Hash:
                                    // @help: Hash#clean
//{@debug
    mm.allow(typeofFilter, "String/undefined");
//}@debug
    return new Hash(Object_clean(this._, typeofFilter));
}

function Hash_pack(glue,    // @arg String(= ":"): glue
                   joint) { // @arg String(= ";"): joint
                            // @ret String: "key:value;key:value;..."
                            // @desc: serialize hash key/values ({ key: valye, ... }) to "key:value;..."
                            // @help: Hash#pack
//{@debug
    mm.allow(glue,  "String/undefined");
    mm.allow(joint, "String/undefined");
//}@debug

    glue  = glue  || ":";
    joint = joint || ";";

    var rv = [], key, keys = Object.keys(this._), i = 0, iz = keys.length;

    for (; i < iz; ++i) { // uupaa-looper
        key = keys[i];
        rv.push(key + glue + this._[key]);
    }
    return rv.join(joint);
}

function Hash_unpack(data,    // @arg String: "key:value;..."
                     glue,    // @arg String(= ":"): glue
                     joint) { // @arg String(= ";"): joint
                              // @ret Hash: mm({ key: value, ... })
                              // @help: Hash.unpack
                              // @desc: deserialize string("key:value;...") to Has({ key: value, ... })
//{@debug
    mm.allow(data,  "String");
    mm.allow(glue,  "String/undefined");
    mm.allow(joint, "String/undefined");
//}@debug

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
            value = value in primitive ? primitive[value] // primitive -> convert
                  : isFinite(value) ? parseFloat(value)   // number    -> parse float
                  : value;                                // other     -> string
        }
        rv[key.trim()] = value;
    }
    return new Hash(rv);
}
// --- url -------------------------------------------------
//{@url
function mm_url(url) { // @arg URLObject/URLString(= ""): "https://..."
                       //      URLObject: { protocol, host, pathname, search, fragment }
                       // @ret URLString/URLObject:
                       // @desc: get current URL, parse URL, build URL
                       // @help: mm.url
//{@debug
    mm.allow(url, "Object/String/undefined");
//}@debug

    return !url ? global.location.href
         : typeof url === "string" ? _url_parse(url)
                                   : _url_build(url);
}

function _url_build(obj) { // @arg URLObject/Object: need { protocol, host, pathname, search, fragment }
                           // @ret URLString: "{protocol}//{host}{pathname}?{search}#{fragment}"
                           // @inner: build URL
    return [obj.protocol,
            obj.protocol ? (obj.protocol === "file:" ? "///" : "//") : "",
            obj.host     || "", obj.pathname || "/",
            obj.search   || "", obj.fragment || ""].join("");
}

function _url_parse(url) { // @arg URLString: abs or rel,
                           //                   "http://user:pass@example.com:8080/dir1/dir2/file.ext?a=b&c=d#fragment"
                           // @ret URLObject: { href, protocol, scheme, secure, host,
                           //                   auth, hostname, port, pathname, dir, file,
                           //                   search, query, fragment, ok }
                           //     href     - String:  "http://user:pass@example.com:8080/dir1/dir2/file.ext?a=b;c=d#fragment"
                           //     protocol - String:  "http:"
                           //     scheme   - String:  "http:"
                           //     secure   - Boolean: false
                           //     host     - String:  "user:pass@example.com:8080". has auth
                           //     auth     - String:  "user:pass"
                           //     hostname - String:  "example.com"
                           //     port     - Number:  8080
                           //     pathname - String:  "/dir1/dir2/file.ext"
                           //     dir      - String:  "/dir1/dir2"
                           //     file     - String:  "file.ext"
                           //     search   - String:  "?a=b&c=d"
                           //     query    - URLQueryObject: { a: "b", c: "d" }
                           //     fragment - String:  "#fragment"
                           //     ok       - Boolean: true is valid url
                           // @inner: parse URL

    function _extends(obj) { // @arg URLObject:
                             // @ret URLObject:
        var ary = obj.pathname.split("/");

        obj.href       = obj.href     || "";
        obj.protocol   = obj.protocol || "";
        obj.scheme     = obj.protocol;        // [alias]
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
            href: url, protocol: m[1], pathname: m[2],
                       search:   m[3], fragment: m[4] });
    }
    m = RegExp.URL.exec(url);
    if (m) {
        return _extends({
            href: url, protocol: m[1],
                       secure:   m[1] === "https:" || m[1] === "wss:",
                       host:     m[2], auth:   m[3],
                       hostname: m[4], port:   m[5] ? +m[5] : (ports[m[1]] || 0),
                       pathname: m[6], search: m[7],
                       fragment: m[8] });
    }
    m = RegExp.PATH.exec(url);
    if (m) {
        return _extends({
            href: url, pathname: m[1], search: m[2], fragment: m[3] });
    }
    return _extends({ href: url, pathname: url, ok: false });
}

function mm_url_resolve(url) { // @arg URLString: relative URL or absolute URL
                               // @ret URLString: absolute URL
                               // @desc: convert relative URL to absolute URL
                               // @help: mm.url.resolve
//{@debug
    mm.allow(url, "String");
//}@debug

    if (/^(https?|file|wss?):/.test(url)) { // is absolute url?
        return url;
    }
    var a = global.document.createElement("a");

    a.setAttribute("href", url);    // <a href="hoge.htm">
    return a.cloneNode(false).href; // -> "http://example.com/hoge.htm"
}

function mm_url_normalize(url) { // @arg URLString:
                                 // @ret URLString:
                                 // @help: mm.url.normalize
                                 // @desc: path normalize
//{@debug
    mm.allow(url, "String");
//}@debug

    var rv = [], path, obj = _url_parse(url),
        dots = /^\.+$/,
        dirs = obj.dir.split("/"),
        i = 0, iz = dirs.length;

    // normalize("dir/.../a.file") -> "/dir/a.file"
    // normalize("../../../../a.file") -> "/a.file"
    for (; i < iz; ++i) {
        path = dirs[i];
        if (path === "..") {
            rv.pop();
        } else if (!dots.test(path)) {
            rv.push(path);
        }
    }
    // tidy slash "///" -> "/"
    obj.pathname = ("/" + rv.join("/") + "/").replace(/\/+/g, "/") + obj.file;
    return _url_build(obj); // rebuild
}

function mm_url_buildQuery(obj,     // @arg URLQueryObject: { key1: "a", key2: "b", key3: [0, 1] }
                           joint) { // @arg String(= "&"): joint string "&" or "&amp;" or ";"
                                    // @ret URLQueryString: "key1=a&key2=b&key3=0&key3=1"
                                    // @help: mm.url.buileQuery
                                    // @desc: build query string
//{@debug
    mm.allow(obj,   "Object");
    mm.allow(joint, "String/undefined");
//}@debug
    joint = joint || "&";

    return mm.map(obj, function(value, key) {
        key = global.encodeURIComponent(key);

        return Array.toArray(value).map(function(v) {
            return key + "=" + global.encodeURIComponent(v); // "key3=0;key3=1"
        }).join(joint);
    }).join(joint); // "key1=a;key2=b;key3=0;key3=1"
}

function mm_url_parseQuery(query) { // @arg URLString/URLQueryString: "key1=a;key2=b;key3=0;key3=1"
                                    // @ret URLQueryObject: { key1: "a", key2: "b", key3: ["0", "1"] }
                                    // @help: mm.url.parseQuery
                                    // @desc: parse query string
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

//{@debug
    mm.allow(query, "String");
//}@debug

    var rv = {};

    if (query.indexOf("?") >= 0) {
        query = query.split("?")[1].split("#")[0];
    }
    query.replace(/&amp;|&|;/g, ";"). // "&amp;" or "&" or ";" -> ";"
          replace(/(?:([^\=]+)\=([^\;]+);?)/g, _parse);

    return rv;
}
//}@url

// --- env -------------------------------------------------
// http://code.google.com/p/mofmof-js/wiki/UserAgentStrings
// http://googlewebmastercentral-ja.blogspot.com/2011/05/android.html
// http://blogs.msdn.com/b/ie/archive/2012/07/12/ie10-user-agent-string-update.aspx
function _detectEnv(rv) { // @inner:
    if (!rv.browser) {
        return rv;
    }
    var nav = global.navigator, ua = nav.userAgent;

    rv.ua       = ua;
    rv.lang     = (nav.language || nav.browserLanguage || "").split("-", 1)[0]; // "en-us" -> "en"
    rv.secure   =  global.location.protocol === "https:";
//{@ie
    if (rv.ie) {
        rv.ie8  = !!document.querySelector;
        rv.ie9  = !!global.getComputedStyle;
        rv.ie10 = !!global.msSetImmediate;
    }
//}@ie
    rv.ipad     = /iPad/.test(ua);
    rv.chrome   = /Chrome/.test(ua);
    rv.webkit   = /WebKit/.test(ua);
    rv.safari   = rv.webkit && !rv.chrome;
    rv.mobile   = /mobile/i.test(ua);
    rv.ios      = /iPhone|iPad|iPod/.test(ua);
    rv.mac      = /Mac/.test(ua);
    rv.android  = /android/i.test(ua);
    rv.windows  = /windows/i.test(ua);
    rv.touch    = rv.ios || rv.android || (rv.ie && /touch/.test(ua));
    rv.retina   = (global.devicePixelRatio || 1) >= 2;
    return rv;
}

// --- build and export API --------------------------------
if (typeof module !== "undefined") { // is modular
    module.exports = { mm: HashFactory };
}

_extendNativeObjects(mm_mix, mm_wiz);
_defineLibraryAPIs(mm_mix);
_defineHashPrototype(mm_wiz);

mm.help.add("http://code.google.com/p/mofmof-js/wiki/",
            "Object,Array,String,Boolean,Number,Date,RegExp,Function".split(","));
mm.help.add("http://code.google.com/p/mofmof-js/wiki/",
            "mm,Class,Hash,Await,Msg".split(","));

})(this.self || global);
