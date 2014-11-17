// base.js

/*
    document:
        http://code.google.com/p/mofmof-js/wiki/BaseAPI

    compile option to minimize:
        mm -v -cut dev/todo/legacy/assert/log/test/debug/anime/easing/sprintf/binary/url/HTMLEntity/ie/gecko/opera/plugin/titanium/worker/node
 */

var mm; // @global: mm - library namespace

mm || (function(global,     // @param GlobalObject:
                document) { // @param DocumentObject/undefined:

// === EXTEND ==============================================

function _api(mix) { // @param Function: mm.mix

    mm = mm_factory;
    mm.Nodes = Nodes;
    mm.Nodes.factory = Nodes_factory;

    mix(mm, {
        arg:        mm_arg,
        has:        mm_has,             // Array#has, String#has
        key:        mm_key,             // mm.val
        map:        mm_map,             // Array#map
        mix:        mm_mix,
        nop:        mm_nop,
        val:        mm_val,             // mm.key
        copy:       mm_copy,            // Array#copy
        dump:       mm_dump,            // JSON.stringify
        each:       mm_each,            // Array#forEach
        evil:       mm_evil,            // String#test, Type.allow, Type.deny
        fork:       mm_fork,            // mm.hash <-> mm.fork, mm.key, mm.val
        hash: mix(mm_hash, {            // mm.hash <-> mm.fork, mm.key, mm.val
            table:  mm_hash_table
        }),
        only:       mm_only,            // Array#only
        some:       mm_some,            // Array#some
        count:      mm_count,           // Array#count
        clear:      mm_clear,           // Array#clear
        every:      mm_every,           // Array#every
        // --- Animate ---
//{@anime
        anime:      mix(mm_anime, {
            _id:        [],
            _killID:    [],             // killing atom
            kill:       mm_anime_kill,
            frame:      mm_anime_frame,
            immeidate:  mm_anime_immediate
        }),
//}@anime
        // --- Type ---
        type: mix(Type, {
            of:         Type_of,
//{@assert
            deny:       Type_deny,      // [exception]
            allow:      Type_allow,     // [exception]
//}@assert
            isAny:      Type_isAny,
//{@url
            isURL:      Type_isURL,
//}@url
            isLike:     Type_isLike,
            isArray:    _isArray,
            isEmpty:    Type_isEmpty,
            isChar:     Type_isChar,
            isDate:     Type_isDate,
            isHash:     Type_isHash,
            isNode:     Type_isNode,
            isNull:     Type_isNull,
            isSome:     Type_isSome,    // mm.type.isEvery
            isEvery:    Type_isEvery,   // mm.type.isSome
            isStyle:    Type_isStyle,
            isFuture:   Type_isFuture,
            isRegExp:   Type_isRegExp,
            isObject:   Type_isHash,    // [alias] mm.type.isObject = mm.type.isHash
            isString:   Type_isString,
            isNumber:   Type_isNumber,
            isInteger:  Type_isInteger,
            isBoolean:  Type_isBoolean,
            isFunction: Type_isFunction,
            isFakeArray: Type_isFakeArray,
            isUndefined: Type_isUndefined,
            isPrimitive: Type_isPrimitive,
            isDenseArray: Type_isDenseArray,
            isSparseArray: Type_isSparseArray,
//{@url
            isAbsoluteURL: Type_isAbsoluteURL,
            isRelativeURL: Type_isRelativeURL,
//}@url
//{@binary
            isByteArray: Type_isByteArray,      // [TypedList]
            isWordArray: Type_isWordArray,      // [TypedList]
            isByteString: Type_isByteString,    // [TypedList]
            isWordString: Type_isWordString,    // [TypedList]
//}@binary
            isNumberArray: Type_isNumberArray,  // [TypedList]
            isStringArray: Type_isStringArray,  // [TypedList]
            BOOLEAN:    TYPE_BOOLEAN,
            NUMBER:     TYPE_NUMBER,
            STRING:     TYPE_STRING,
            FUNCTION:   TYPE_FUNCTION,
            ARRAY:      TYPE_ARRAY,
            DATE:       TYPE_DATE,
            REGEXP:     TYPE_REGEXP,
            UNDEFINED:  TYPE_UNDEFINED,
            NULL:       TYPE_NULL,
            HASH:       TYPE_HASH,
            OBJECT:     TYPE_OBJECT,            // [alias] mm.type.OBJECT = mm.type.HASH
            NODE:       TYPE_NODE,
            FAKE_ARRAY: TYPE_FAKE_ARRAY,
            STYLE:      TYPE_STYLE,
            GLOBAL:     TYPE_GLOBAL,
            PRIMITIVE:  TYPE_PRIMITIVE,
            LOOPS:      TYPE_ITERATABLE,        // [alias] mm.type.LOOPS = mm.type.ITERATABLE
            ITERATABLE: TYPE_ITERATABLE,
            // --- COMPLEX TYPE ---
            complex: mix(Type_complex, {
                NONE:   1,
                KEY:    2,
                PAIR:   3,
                HASH:   4 
            })
        }),
        Class: mix(Class, {
            has:        Class_has,
            lite:       Class_lite,
            singleton:  Class_singleton,
            prefix:     "lib,app,act,ctrl,view,model,scene".split(","), // link to mm.msgg
            suffix:     ["manager"],
            Image:      Class_Image,
            MessageGroup: MessageGroup
/*
            View:       Class_View,
            Model:      Class_Model,
            Controler:  Class_Controler,
 */
        }),
        // --- PRE-CREATE MESSAGE GROUP ---
        msgg: {
            lib:        new MessageGroup, //   LibHoge
            act:        new MessageGroup, //   ActHoge
            app:        new MessageGroup, //   AppHoge
            ctrl:       new MessageGroup, //  CtrlHoge
            view:       new MessageGroup, //  ViewHoge
            model:      new MessageGroup, // ModelHoge
            scene:      new MessageGroup, // SceneHoge
            manager:    new MessageGroup  //      HogeManager
        },
        env: _detectnEnv({
            vendernize: {
                css:    vendernize_css,
                style:  vendernize_style,
                method: vendernize_method
            },
            ios:        0,      // Number: iOS Version
//          mac:        0,      // Number: Mac OS X Version
//          chromeos:   0,      // Number: Chrome OS Version
//          unix:       0,      // Number: Unix/Linux OS Version
            android:    0,      // Number: Android OS Version
//          windows:    "",     // String: Windows OS Version ("future", "8", "7", "Vista", "XP", "2000", "other")
            nodejs:     false,  // Boolean: on Node.js
            worker:     false,  // Boolean: on WebWorkers
            browser:    false,  // Boolean: on Browser
            titanium:   false,  // Boolean: on Titanium
            ngcore:     false,  // Boolean: on ngCore
//          metro:      false,  // Boolean: on Windows Metro UI
//          googletv:   false,  // Boolean: on Google TV (Android TV)
            ibooks:     false,  // Boolean: on iBooks
//          itv:        false,  // Boolean: on iTV
            secure:     false,  // Boolean: SSL page
//          jit:        false,  // Boolean: JIT enable
            lang:       "en",   // String: Language. "en", "ja", ...
            ua:         "",     // String: UserAgent String
            ie:         0,      // Number: IE Version ( 0, 6, 7, 8, 9, 10, 11, ... )
            gecko:      0,      // Number: Gecko Engine Version (9.0, 10.0, ...)
            opera:      0,      // Number: Opera Version (10.5, 11.0, ...)
            chrome:     0,      // Number: Chrome Version (15, 16, ...)
            safari:     0,      // Number: Safari Version (5.0, 5.1, ...)
            webkit:     0,      // Number: WebKit Engine Version (533.1, ...)
//          netfront:   0,      // Number: NetFront Engine Version
            longedge:   0,      // Number: device long edge (w:800 x h:600) -> 800
            retina:     false,  // Boolean: Retina display
            ipad:       false,  // Boolean: iPad
            mobile:     false,  // Boolean: Mobile Browser
            plugin:     false,  // Boolean: Enable Browser Plugins (false: Metro IE10, iOS)
            flash:      0,      // Number: FlashPlayer Version(9+)
            silver:     0,      // Number: Silverlight Version(3+)
            ie6:        false,  // Boolean: is IE6
            ie7:        false,  // Boolean: is IE7
            ie8:        false,  // Boolean: is IE8
            ie9:        false,  // Boolean: is IE9
            ie10:       false,  // Boolean: is IE10
            ie11:       false,  // Boolean: is IE11
            ie67:       false,  // Boolean: is IE6 or IE7
            ie678:      false   // Boolean: is IE6 or IE7 or IE8
        }),
        log: mix(mm_log, {
            warn:   mm_log_warn,
            error:  mm_log_error,
            local:  true,
            remote: false,
            url:    ""          // eg: 'http://hostname/log?method=@@msg=@@"'
        }),
        iog: mix(mm_iog, {
            reset:  mm_iog_reset
        }),
//{@url
        url: mix(mm_url, {
            resolve:    mm_url_resolve,
            normalize:  mm_url_normalize,
            buildQuery: mm_url_buildQuery,
            parseQuery: mm_url_parseQuery,
            encode:     mm_url_encode, // better encodeURIComponent
            decode:     mm_url_decode  // better decodeURIComponent
        }),
//}@url
        // --- CODEC, TYPE CONVERTER ---
//{@binary
        MD5: MD5,                   // HexString/ByteArray <- ByteString/ByteArray
        SHA1: SHA1,                 // HexString/ByteArray <- ByteString/ByteArray
        HMAC: HMAC,                 // HexString/ByteArray <- ByteString/ByteArray
        CRC32: CRC32,               // Number              <- ByteString/ByteArray
        UTF8: mix(UTF8, {           // UTF8ByteArray           <- String/UTF8ByteArray
            decode: UTF8_decode     // UTF8ByteArray/String    -> String
        }),
        UTF16: mix(UTF16, {         // UTF16NumberArray        <- String/UTF16NumberArray
            decode: UTF16_decode    // UTF16NumberArray/String -> String
        }),
        Base64: mix(Base64, {       // UTF8Base64String        <- String/UTF8Base64String/ByteArray
            decode: Base64_decode   // UTF8Base64String/String -> String
        }),
//}@binary
//{@HTMLEntity
        HTMLEntity: mix(HTMLEntity, { // HTMLEntityString  <- String
            decode: HTMLEntity_decode // HTMLEntityString  -> String
        }),
//}@HTMLEntity
//{@binary
        ByteArray: mix(ByteArray, {                 // [TypedList] ByteArray            <- ByteString/ByteArray
            toByteString: ByteArray_toByteString    // [TypedList] ByteString/ByteArray -> ByteString
        }),
        ByteString: mix(ByteString, {               // [TypedList] ByteString           <- ByteString/ByteArray
            toByteArray: ByteString_toByteArray     // [TypedList] ByteString/ByteArray -> ByteArray
        }),
//}@binary
        Capitalize: mix(Capitalize, {               // "camelCase" <- ["camel", "case"]
            toLower1st: Capitalize_toLower1st,
            toUpper1st: Capitalize_toUpper1st,
            toStringArray: Capitalize_toStringArray // "camelCase" -> ["camel", "case"]
        })
    });
    mix(Object, {
        keys:       _keys               // [ES5][polyfill]
    });
    mix(Array, {
        of:         Array_of,           // [ES.next]
        from:       Array_toArray,      // [ES.next][alias]
        range:      Array_range,
        isArray:    _isArray,           // [ES5][polyfill]
        toArray:    Array_toArray
    });
    mix(Array[prototype], {
//{@legacy
        map:        Array_map,          // [ES5][polyfill]
        each:       Array[prototype].forEach || Array_forEach,
        some:       Array_some,         // [ES5][polyfill]
        every:      Array_every,        // [ES5][polyfill]
        filter:     Array_filter,       // [ES5][polyfill]
                                        // [ES5][polyfill][alias]
        reduce:     Array_reduce,       // [ES5][polyfill]
        indexOf:    Array_indexOf,      // [ES5][polyfill]
        forEach:    Array_forEach,      // [ES5][polyfill]
        lastIndexOf:Array_lastIndexOf,  // [ES5][polyfill]
        reduceRight:Array_reduceRight,  // [ES5][polyfill]
//}@legacy
        or:         Array_or,           // [Ruby]
        and:        Array_and,          // [Ruby]
        fill:       Array_fill,         // [Ruby]
        flatten:    Array_flatten,      // [Ruby]
        at:         Array_at,           // String#at
        has:        Array_has,          // String#has, mm.has
        sum:        Array_sum,
        copy:       Array_copy,
        clip:       Array_clip,
        hash:       Array_hash,
        head:       Array_head,
        tail:       Array_tail,
        swap:       Array_swap,
//{@test
        tt:         Array_test,         // [alias]
        test:       Array_test,         // String#stream
//}@test
        clean:      Array_reject,       // [alias] Array#reject
        clear:      Array_clear,        // mm.clear
        count:      Array_count,        // String#count, mm.count
        nsort:      Array_nsort,        // Array#sort
        reject:     Array_reject,
        stream:     Array_stream,       // String#stream
        unique:     Array_unique,
        average:    Array_average,
        replace:    Array_replace,
        shuffle:    Array_shuffle,
        addIfNot:   Array_addIfNot,     // String#addIfNot
        removeIf:   Array_removeIf,     // String#removeIf
        shiftAll:   Array_shiftAll      // Array#clear
    });
    mix(String[prototype], {
//{@legacy
        trim:       String_trim,        // [ES5][polyfill]
//}@legacy
        repeat:     String_repeat,      // [ES.NEXT][polyfill]
        reverse:    String_reverse,     // [ES.NEXT][polyfill]
        contains:   String_contains,    // [ES.NEXT][polyfill]
        endsWith:   String_endsWith,    // [ES.NEXT][polyfill]
        startsWith: String_startsWith,  // [ES.NEXT][polyfill]
        at:         String_at,          // Array#at
        up:         String_up,          // String#low
        low:        String_low,         // String#up
        has:        String_has,         // Array#has, mm#has
        pad:        String_pad,         // Number#dd, Number#hh, String#sprintf
        fold:       String_fold,
//{@test
        tt:         String_test,        // [alias]
        test:       String_test,        // Array#test
//}@test
        left:       String_left,        // String#left <-> String#right
        right:      String_right,       // String#left <-> String#right
        count:      String_count,       // Array#count, mm.count
        stream:     String_stream,      // Array#stream
        anagram:    String_anagram,
//{@sprintf
        sprintf:    String_sprintf,
//}@sprintf
        overflow:   String_overflow,
        trimTag:    String_trimTag,
        trimChar:   String_trimChar,
        trimQuote:  String_trimQuote,
        addIfNot:   String_addIfNot,    // Array#addIfNot
        removeIf:   String_removeIf,    // Array#removeIf
        decompress: String_decompress,
        toCharArray:String_toCharArray,
        toWordArray:String_toWordArray
    });
    mix(Number[prototype], {
        dd:         Number_dd,          // Number#hh, String#pad, String#sprintf
        hh:         Number_hh,          // Number#dd, String#pad, String#sprintf
        to:         Number_to,          // Array#range
        uid:        Number_uid,
        xor:        Number_xor,
        clip:       Number_clip,        // Math.max, Math.min
        diff:       Number_diff,        // Date#diff
        lazy:       Number_lazy,        // setTimeout
        times:      Number_times,       // Array#map
        within:     Number_within       // Date#within
    });
    mix(Date, {
        now:        Date_now,           // [ES5][polyfill]
        from:       Date_from           // Date#format
    });
    mix(Date[prototype], {
        diff:       Date_diff,          // Number#diff
        format:     Date_format,        // Date.from
        toJSON:     Date_toJSON,        // [ES5][polyfill]
        within:     Date_within         // Number#within
    });
    mix(RegExp[prototype], {
        match:      RegExp_match        // String#match
    });
    mix(Function, {
        pao:        Function_pao
    });
    mix(Function[prototype], {
        bind:       Function_bind,      // [ES5][polyfill]
        h:          Function_help,      // [alias]
        help:       Function_help,
        some:       Function_some,      // [Future]
        every:      Function_every,     // [Future]
        nickname:   Function_nickname
    });
//{@legacy
    global.JSON || (global.JSON = {
        parse:      JSON_parse,         // [ES5][polyfill]
        stringify:  JSON_stringify      // [ES5][polyfill]
    });
//}@legacy
    mix(Math, {
        easing:     {},
        toRadians:  Math.PI / 180,      // Math.toRadians - Degrees to Radians
        toDegrees:  180 / Math.PI,      // Math.toDegrees - Radians to Degrees
        PI2:        Math.PI * 2         // Math.PI * 2 = 6.283185307179586
    });

    mm._ignore = false; // mm.evil
}

// === LOCAL VARS ==========================================

var TYPE_BOOLEAN    = 0x0001,   // Type.BOOLEAN   === Type(true)
    TYPE_NUMBER     = 0x0002,   // Type.NUMBER    === Type(1234)
    TYPE_STRING     = 0x0004,   // Type.STRING    === Type("ab")
    TYPE_FUNCTION   = 0x0008,   // Type.FUNCTION  === Type(Array)
    TYPE_ARRAY      = 0x0010,   // Type.ARRAY     === Type([])
    TYPE_DATE       = 0x0020,   // Type.DATE      === Type(new Date)
    TYPE_REGEXP     = 0x0040,   // Type.REGEXP    === Type(/0/)
    TYPE_UNDEFINED  = 0x0080,   // Type.UNDEFINED === Type(undefined)
    TYPE_NULL       = 0x0100,   // Type.NULL      === Type(null)
    TYPE_HASH       = 0x0200,   // Type.HASH      === Type({})
    TYPE_OBJECT     = 0x0200,   // Type.OBJECT    === Type({}) // [alias]
    TYPE_NODE       = 0x0400,   // Type.NODE      === Type(document.body)
    TYPE_FAKE_ARRAY = 0x0800,   // Type.FAKE_ARRAY=== Type(NodeList)
    TYPE_STYLE      = 0x1000,   // Type.STYLE     === Type(CSSStyleDeclaration)
    TYPE_GLOBAL     = 0x2000,   // Type.GLOBAL    === Type(window)
    TYPE_PRIMITIVE  = TYPE_NULL | TYPE_UNDEFINED | TYPE_BOOLEAN |
                                  TYPE_NUMBER | TYPE_STRING,
    TYPE_ITERATABLE = TYPE_HASH | TYPE_ARRAY | TYPE_FUNCTION,
    TYPE_DETECTION  = {
        "[object Boolean]" : TYPE_BOOLEAN,
        "[object Number]"  : TYPE_NUMBER,
        "[object String]"  : TYPE_STRING,
        "[object Function]": TYPE_FUNCTION,
        "[object Array]"   : TYPE_ARRAY,
        "[object Date]"    : TYPE_DATE,
        "[object RegExp]"  : TYPE_REGEXP,
        "[object NodeList]": TYPE_FAKE_ARRAY,
        "[object Arguments]": TYPE_FAKE_ARRAY,
        "[object HTMLCollection]": TYPE_FAKE_ARRAY,
        "[object CSSStyleDeclaration]": TYPE_STYLE // Firefox 6+
    },
//{@anime
    // http://d.hatena.ne.jp/uupaa/20110622
    // http://uupaa.hatenablog.com/entry/2012/02/01/083607
    _animate =   global.requestAnimationFrame    ||
                 global.oRequestAnimationFrame   ||
                 global.msRequestAnimationFrame  ||
                 global.mozRequestAnimationFrame ||
                 global.webkitRequestAnimationFrame, // -> cancelRequestAnimationFrame
    _immediate = global.setImmediate       ||
                 global.oSetImmediate      ||
                 global.msSetImmediate     ||
                 global.mozSetImmediate    ||
                 global.webkitSetImmediate, // -> clearImmediate
//}@anime
    // for JavaScript source code minification
    prototype = "prototype",
    _keys = Object.keys || _Object_keys_,
    _slice = Array[prototype].slice,
    _isArray = Array.isArray || _Array_isArray_,
    _location = global.location,
    _toString = Object[prototype].toString,
    _strictMode = (function() { return !this; })();

// === IMPLEMENT ==========================================

// mm - Class and Nodes instance factory
function mm_factory(expr,   // @param ClassNameString/NodeQueryExpressionString/NodesInstance/Node/NodeArray: `` クラス名, Node検索文字列, Nodesインスタンス, Node, Nodeの配列
                    arg1,   // @param Mix/Node/NodesInstance(= undefined): class arg1 or Nodes Context `` クラスインスタンス生成時の第一引数 または Nodes に渡すコンテキスト(省略可能)
                    arg2,   // @param Mix(= undefined): class arg2  `` クラスインスタンス生成時の第二引数(省略可能)
                    arg3,   // @param Mix(= undefined): class arg3  `` クラスインスタンス生成時の第三引数(省略可能)
                    arg4) { // @param Mix(= undefined): class arg4  `` クラスインスタンス生成時の第四引数(省略可能)
                            // @return ClassInstance/NodesInstance: `` クラスインスタンス または Nodes インスタンス
                            // @help: mm#mm.factory
                            // @desc: Class and Nodes instance factory

    if (typeof expr === "string" && Class[expr]) { // `` 文字列が指定され、それが mm.Class に登録済みならクラスインスタンスを生成する
        return new Class[expr](arg1, arg2, arg3, arg4); // `` クラスインスタンスを生成し返す。適用される引数は最大で4つ
    }
    return new Nodes(expr, arg1); // `` Nodesインスタンスを生成し返す。適用される引数は最大で1つ
}

// Nodes
function Nodes(expr,      // @param Node/Nodes/DOMQueryExpressionString: Query
               context) { // @param Node/Nodes(= undefined): context
                          // @help: Nodes#Nodes
                          // @desc: create Nodes instance

    return Nodes.factory(expr, context); // lazy implementation
}

// Nodes.factory
function Nodes_factory(/* expr,   */    // @param Node/Nodes/DOMQueryExpressionString: Query
                       /* context */) { // @param Node/Nodes(= undefined): context
                                        // @return Nodes:
                                        // @help: Nodes#Nodes.factory
                                        // @desc: not impl(need override)
    throw new Error("Nodes.factory() NOT_IMPL");
}

// mm.arg
function mm_arg(arg,    // @param Hash(= undefined): key and argument value pairs `` 引数で渡された Hash または undefined を指定します
                hash) { // @param Hash: default argument lists, key and value pairs
                        //              `` arg に補完する { key: value, ... } を指定します
                        // @return Hash: arg
                        // @help: mm#mm.arg
                        // @desc: supply default argument values `` デフォルト引数を補完します
//{@assert
    Type_allow(arg,   TYPE_HASH | TYPE_UNDEFINED);
    Type_allow(pairs, TYPE_HASH);
//}@assert

    return arg ? mm_mix(arg || {}, hash, false, true)
               : hash;
}

// mm.has
function mm_has(find,   // @param Hash/Function/Array/Node/Primitive: find or [find, ...] or { key: value }
                data) { // @param Hash/Function/Array/Node/String:
                        // @return Boolean: true is has value(s) or pair(s)
                        // @help: mm#mm.has
                        // @desc: has value(s), has hash pair(s)

    function _hasChildNode(node,         // @param Node: child node
                           parentNode) { // @param Node: parent node
                                         // @desc: parentNode has childNode
        for (var i = node; i && i !== parentNode; i = i.parentNode) {
            ;
        }
        return node !== parentNode && i === parentNode;
    }

    function _hasHash(find,   // @param Hash:
                      data) { // @param Hash:
                              // @return Boolean;
        var key, ary = _keys(find), i = 0, iz = ary.length;

        for (; i < iz; ++i) {
            if (!(ary[i] in data)) { // data[key] not found
                return false;
            }
        }
        for (i = 0; i < iz; ++i) {
            key = ary[i];
            if (!Type_isLike(find[key], data[key])) {
                return false;
            }
        }
        return true;
    }

//{@assert
    Type_allow(find,  TYPE_ITERATABLE | TYPE_NODE | TYPE_PRIMITIVE);
    Type_allow(data,  TYPE_ITERATABLE | TYPE_NODE | TYPE_STRING);

    switch (Type(data)) {
    case TYPE_NODE:     Type_allow(find, TYPE_NODE); break;
    case TYPE_STRING:   Type_allow(find, TYPE_STRING | TYPE_NUMBER);
    }
//}@assert

    switch (Type(data)) {
    case TYPE_FUNCTION:
    case TYPE_HASH:
        return Type(find, TYPE_FUNCTION |
                          TYPE_HASH) ? _hasHash(find, data) // Hash has Hash
                                     : mm_val(data).has(find); // Array#has
    case TYPE_NODE:     return _hasChildNode(find, data);
    case TYPE_ARRAY:
    case TYPE_STRING:   return data.has(find); // Array#has, String#has
    }
    return false;
}

// mm.key
function mm_key(data,    // @param Hash/Array/Function/Style/Node/Global: data
                limit) { // @param Number(= 0): result length limit, 0 is all
                         // @return Array: [key, ... ]
                         // @see: Object.keys, mm.val, mm.hash, mm.fork
                         // @help: mm#mm.key
                         // @desc: enumerate keys
//{@assert
    Type_allow(data,  TYPE_ITERATABLE | TYPE_STYLE | TYPE_NODE | TYPE_GLOBAL);
    Type_allow(limit, TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    return (limit || Type(data) === TYPE_STYLE) ? mm_fork(data, limit).key
                                                : _keys(data);
}

// mm.map
function mm_map(data, // @param Hash/Array/Function:
                fn) { // @param Function: fn(value, key)
                      // @return Array: [result, ...]
                      // @help: mm#mm.map
                      // @desc: prototype pollution safety Array#map
//{@assert
    Type_allow(data, TYPE_HASH | TYPE_ARRAY | TYPE_FUNCTION);
    Type_allow(fn,   TYPE_FUNCTION);
//}@assert

    if (_isArray(data)) { // Array
        return data.map(fn);
    }

    var rv = [], ary = _keys(data), key, i = 0, iz = ary.length; // uupaa-looper

    for (; i < iz; ++i) {
        key = ary[i];
        rv.push(fn(data[key], key)); // fn(value, key)
    }
    return rv;
}

// mm.mix
function mm_mix(base,        // @param Object/Function: base object
                prop,        // @param Hash: properties
                override,    // @param Boolean(= false): override
                prototype) { // @param Boolean(= false): lookup prototype chain
                             // @return Object/Function: base
                             // @help: mm#mm.mix
                             // @desc: mixin properties and prototype members
    var ary, key, i = 0, iz;

    if (prototype) {
        for (key in prop) {
            if (override || !(key in base)) {
                base[key] = prop[key];
            }
        }
    } else {
        for (ary = _keys(prop), iz = ary.length; i < iz; ++i) { // uupaa-looper
            key = ary[i];
            if (override || !(key in base)) {
                base[key] = prop[key];
            }
        }
    }
    return base;
}

// mm.nop
function mm_nop() { // @help: mm#mm.nop
                    // @desc: no operation function
}

// mm.val
function mm_val(data,    // @param Hash/Array/Function/Style/Node/Global:
                limit) { // @param Number(= 0): result length limit, 0 is all
                         // @return Array: [value, ...]
                         // @see: Object.keys, mm.key, mm.hash, mm.fork
                         // @help: mm#mm.val
                         // @desc: enumerate values
//{@assert
    Type_allow(data,  TYPE_ITERATABLE | TYPE_STYLE | TYPE_NODE | TYPE_GLOBAL);
    Type_allow(limit, TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    return mm_fork(data, limit).val;
}

// mm.copy
function mm_copy(mix) { // @param Mix: source object
                        // @return Mix: copied object
                        // @see: Array#copy
                        // @help: mm#mm.copy
                        // @desc: copy Object (shallow copy) `` オブジェクトの浅いコピーを作成します
    switch (Type(mix)) {
    case TYPE_UNDEFINED:return void 0;          // return undefined
    case TYPE_NULL:     return null;            // return null
    case TYPE_BOOLEAN:
    case TYPE_STRING:
    case TYPE_NUMBER:   return mix.valueOf();   // return primitive value
    case TYPE_ARRAY:    return mix.concat();    // return array(shallow copy)
    case TYPE_DATE:     return new Date(+mix);  // return date(millisecond)
    case TYPE_REGEXP:   return RegExp(mix.source,
                                      (mix + "").slice(mix.source.length + 2));
    }
    return mm_mix({}, mix); // return Object/Hash(shallow copy)
}

// mm.dump
function mm_dump(mix,     // @param Mix: data
                 mode,    // @param String/Boolean(= false): false is unfold, true is fold
                          //                                 "hex" is hex dump
                 depth) { // @param Number(= 5): max depth
                          // @return String:
                          // @help: mm#mm.dump
                          // @desc: Dump Object

//{@assert
    Type_allow(mode,  TYPE_STRING | TYPE_BOOLEAN | TYPE_UNDEFINED);
    Type_allow(depth, TYPE_NUMBER | TYPE_UNDEFINED);
    Type_isString(mode) && Type_allow(mode, ["hex"]);
//}@assert

    var rv, v, i, iz;

//{@debug
    if (mode === "hex" && Type_isNumberArray(mix)) {
        for (rv = [], i = 0, iz = mix.length; i < iz; ++i) {
            v = mix[i];
            rv[i] = v < 0 ? ("-0x" + v.hh(4).slice(1))
                          : ( "0x" + v.hh(4));
        }
        return "[ " + rv.join(", ") + " ]"; // [ 0x1234, 0x12, 0x0, ... ]
    }
    rv = _mm_dump(mix, mode ? "" : "\n",
                       mode ? "" : "    ",
                       depth || 5, 1);
//}@debug

    return rv || "";
}

//{@debug
// inner - mm.dump impl
function _mm_dump(mix,    // @param Mix: value
                  lf,     // @param String: line feed
                  indent, // @param String: indent
                  depth,  // @param Number: max depth
                  nest) { // @param Number: nest count from 1
                          // @return String:

    function _dumpArray(mix) {
        var ary = [], i = 0, iz = mix.length;

        if (!iz) {
            return "[]";
        }
        for (; i < iz; ++i) {
            ary.push(tab + _mm_dump(mix[i], lf, indent, depth, nest + 1));
        }
        return "[" + lf + ary.join("," + lf) +
                     lf + indent.repeat(nest - 1) +
               "]";
    }

    function _dumpStyle(mix) { // CSSStyleDeclaration
        var pairs = mm_fork(mix),
            ary = [], i = 0, iz = pairs.key.length;

        if (!iz) {
            return "{}";
        }
        for (; i < iz; ++i) {
            ary.push(tab + '"' + pairs.key[i] + '":' + sp +
                           '"' + pairs.val[i] + '"');
        }
        return "{" + lf + ary.join("," + lf) +
                     lf + indent.repeat(nest - 1) +
               "}";
    }

    function _dumpHash(mix, type, nickname, classname) {
        var keys = _keys(mix).sort(),
            key, i = 0, iz = keys.length, ary = [],
            block = classname ? ("mm.Class." + classname + "()")
                  : nickname  ? ("function " + nickname).trim() + "()"
                  : type === TYPE_FUNCTION ? "function()"
                  : "";

        for (; i < iz; ++i) {
            key = keys[i];
            ary.push(tab + '"' + keys[i] + '":' + sp +
                     _mm_dump(mix[key], lf, indent, depth, nest + 1));
        }
        return block + "{" + lf + ary.join("," + lf) +
                             lf + indent.repeat(nest - 1) +
               "}";
    }

    function _dumpNode(mix) { // @ref: Node.path
        if (global.Node && global.Node.path) {
            return '"' + global.Node.path(mix) + '"'; // node path
        }
        return mix.tagName ? ('"<' + mix.tagName.toLowerCase() + '>"')
             : mix === document ? '"<document>"'
             : '"<Node>"';
    }

    function _escape(m) {
        return mm_dump._escape[m];
    }

    if (nest > depth) {
        return "...";
    }

    var type = Type(mix),
        tab  = indent ? indent.repeat(nest) : "",
        sp   = indent ? " " : "";

    switch (type) {
    case TYPE_NULL:     return "null";
    case TYPE_UNDEFINED:return "undefined";
    case TYPE_GLOBAL:   return "Global";
    case TYPE_STRING:   return '"' + mix.replace(mm_dump._ngword, _escape) + '"';
    case TYPE_BOOLEAN:
    case TYPE_NUMBER:   return "" + mix;
    case TYPE_DATE:     return mix.toJSON();
    case TYPE_REGEXP:   return "/" + mix.source + "/";
    case TYPE_NODE:     return _dumpNode(mix);
    case TYPE_FAKE_ARRAY: mix = Array_toArray(mix);
    case TYPE_ARRAY:    return _dumpArray(mix);
    case TYPE_STYLE:    return _dumpStyle(mix);
    case TYPE_HASH:
    case TYPE_FUNCTION: return _dumpHash(mix, type,
                                         mix.nickname ? mix.nickname() : "",
                                         mix.CLASS_NAME || "");
    }
    return "";
}
mm_dump._ngword = /(?:[\x00-\x1f]|\"|\\[bfnrt\\])/g;
//}@debug

//{@debug
// JSON escape characters
mm_dump._escape = {
    '\x00': '\\u0000',
    '\x01': '\\u0001',
    '\x02': '\\u0002',
    '\x03': '\\u0003',
    '\x04': '\\u0004',
    '\x05': '\\u0005',
    '\x06': '\\u0006',
    '\x07': '\\u0007',
    '\b'  : '\\b',      // backspace       U+0008
    '\t'  : '\\t',      // tab             U+0009
    '\n'  : '\\n',      // line feed       U+000A
    '\x0b': '\\u000b',
    '\f'  : '\\f',      // form feed       U+000C
    '\r'  : '\\r',      // carriage return U+000D
    '\x0e': '\\u000e',
    '\x0f': '\\u000f',
    '\x10': '\\u0010',
    '\x11': '\\u0011',
    '\x12': '\\u0012',
    '\x13': '\\u0013',
    '\x14': '\\u0014',
    '\x15': '\\u0015',
    '\x16': '\\u0016',
    '\x17': '\\u0017',
    '\x18': '\\u0018',
    '\x19': '\\u0019',
    '\x1a': '\\u001a',
    '\x1b': '\\u001b',
    '\x1c': '\\u001c',
    '\x1d': '\\u001d',
    '\x1e': '\\u001e',
    '\x1f': '\\u001f',
    '"'   : '\\"',      // quotation mark  U+0022
    '\\'  : '\\\\'      // reverse solidus U+005C
};
//}@debug

// mm.each
function mm_each(source, // @param Hash/Array/Function: source
                 fn) {   // @param Function: fn(value, key)
                         // @help: mm#mm.each
                         // @desc: prototype pollution safety Array#forEach
//{@assert
    Type_allow(source, TYPE_HASH | TYPE_ARRAY | TYPE_FUNCTION);
    Type_allow(fn,     TYPE_FUNCTION);
//}@assert

    if (_isArray(source)) { // Array
        return source.forEach(fn);
    }

    var ary = _keys(source), key, i = 0, iz = ary.length; // uupaa-looper

    for (; i < iz; ++i) {
        key = ary[i];
        fn(source[key], key); // fn(value, key)
    }
}

// mm.evil
function mm_evil(expr) { // @param String: JavaScript Expression
                         // @return Boolean:
                         // @help: mm#mm.evil
                         // @desc: returns true if an exception occurs `` 例外発生で true を返します
    var rv = false, ignore = mm._ignore;

    mm._ignore = true;
    try {
        (new Function(expr))();
    } catch (o_o) {
        rv = true;
    }
    mm._ignore = ignore;
    return rv;
}

// mm.fork
function mm_fork(data,    // @param Hash/Array/Function/Style/Node/Global: source
                 limit) { // @param Number(= 0): result length limit, 0 is all
                          // @return Hash: { key: [key, ...], val: [value, ...] }
                          // @see: mm.hash, mm.key, mm.val
                          // @help: mm#mm.fork
                          // @desc: hash fork to key-array and value-array
                          //         `` Hash を key の配列と value の配列に分割し
                          //            { key: `[`...`]`, val: `[`...`]` } を返します

    function _style(rv, data, limit) {
        var key, val, i = 0, j = 0, iz;

        if (data.length) { // [Firefox][WebKit][IE]
            for (iz = data.length; i < iz; ++i) {
                key = data.item(i);
                if (data[key] && typeof data[key] === "string") {
                    val = data[key];
                    rv.key.push(key);
                    rv.val.push(val);
                    if (limit > 0 && ++j >= limit) {
                        break;
                    }
                }
            }
        } else {
//{@legacy
            for (i in data) { // [Opera]
                val = data[i];
                if (val && typeof val === "string") {
                    key = i;
                    rv.key.push(key);
                    rv.val.push(val);
                    if (limit > 0 && ++j >= limit) {
                        break;
                    }
                }
            }
//}@legacy
        }
        return rv;
    }

//{@assert
    Type_allow(data,  TYPE_ITERATABLE | TYPE_STYLE | TYPE_NODE | TYPE_GLOBAL);
    Type_allow(limit, TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    var rv = { key: [], val: [] }, ary, key, i = 0, iz;

    if (Type(data) === TYPE_STYLE) { // CSSStyleDeclaration
        return _style(rv, data, limit || 0);
    }
    ary = _keys(data); // uupaa-looper
    iz = (limit || 0) > 0 ? Math.min(ary.length, limit) : ary.length;

    for (; i < iz; ++i) {
        key = ary[i];
        rv.key.push(key);
        rv.val.push(data[key]);
    }
    return rv;
}

// mm.hash - make hash, make pair
function mm_hash(key,     // @param String/Number/Hash: key or pairs { key: [...], val: [...] }
                 value) { // @param Mix(= undefined): value
                          // @return Hash: { key: value } or { key: value, ... }
                          // @help: mm#mm.hash
                          // @desc: make a pair { key, val } or unite hash { key:[], val:[] } (mm.fork result)
                          //        `` pair { key, value } の生成、または mm.fork の戻り値から Hash を合成します
//{@assert
    if (value === void 0) {
        Type_allow(key,     TYPE_HASH);
        Type_allow(key.key, TYPE_ARRAY);
        Type_allow(key.val, TYPE_ARRAY);
    } else {
        Type_allow(key,  TYPE_STRING | TYPE_NUMBER);
        Type_deny(value, TYPE_UNDEFINED);
    }
//}@assert

    if (value === void 0) {
        return key.key.hash(key.val);
    }

    // make pair
    var rv = {};

    rv[key] = value;
    return rv;
}

// mm.hash.table
function mm_hash_table(input,    // @param IgnoreCaseString: "number", "hex2", "byte"
                       output) { // @param IgnoreCaseString: "number", "hex2", "byte"
                                 // @return Hash:
                                 // @help: mm#mm.hash.table
                                 // @desc: get encoding table
//{@assert
    Type_allow(input,  TYPE_STRING);
    Type_allow(output, TYPE_STRING);
//}@assert

    // mm.hash.table("number", "hex2")   -> {  0 : "00" ..  255: "ff"}  (1)  255   -> "ff"
    // mm.hash.table("hex2",   "number") -> {"00":   0  .. "ff": 255 }  (2)  "ff"  -> 255
    // mm.hash.table("number", "byte")   -> {  0 :"\00" ..  255:"\ff"}  (3)  255   -> "\255"
    // mm.hash.table("byte",   "number") -> { "\00": 0  .. "\ff": 255}  (4) "\255" -> 255
    //                                      {"\f780":128.."\f7ff":255}
    function _init() {
        var table = mm_hash_table, i, ff, _byte_;

        mm_mix(table, { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} });
        for (i = 0; i < 0x100; ++i) {
            ff = (i + 0x100).toString(16).slice(1);
            _byte_ = String.fromCharCode(i);
            table[1][i] = ff;     // {   255 :   "ff" }
            table[2][ff] = i;     // {   "ff":   255  }
            table[3][i] = _byte_; // {   255 : "\255" }
            table[4][_byte_] = i; // { "\255":   255  }
        }
        // http://twitter.com/edvakf/statuses/15576483807
        for (i = 0x80; i < 0x100; ++i) { // [Webkit][Gecko]
            table[4][String.fromCharCode(0xf700 + i)] = i; // "\f780" -> 0x80
        }
        table._init = true;
    }

    mm_hash_table._init || _init();

    var type = {
            "number_hex2": 1,
            "hex2_number": 2,
            "number_byte": 3,
            "byte_number": 4
        };

    return mm_hash_table[type[(input + "_" + output).toLowerCase()] || 0];
}

// mm.only
function mm_only(a,   // @param Hash/Array: source array
                 b) { // @param Hash/Array: 
                      // @return Hash: { only, dup }
                      //    only - Array:
                      //    dup - Array:
                      // @see: Array#only
                      // @help: mm#mm.only
                      // @desc: split only or duplicate elements
//{@assert
    Type_allow(a, TYPE_ITERATABLE);
    Type_allow(b, TYPE_ITERATABLE);
//}@assert

//TODO: TEST
    if (_isArray(a) && _isArray(b)) { // Array
        return a.only(b);
    }

    var rv = [], dups = [], ary = _keys(a), key, i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        key = ary[i];

        if (a[key].indexOf(b[key]) >= 0) { // duplicate
            dups.push(b[key]);
        } else {
            rv.push(b[key]);
        }
    }
    return { only: rv, dup: dups };
}

// mm.some
function mm_some(source, // @param Hash/Array/Function: source
                 fn) {   // @param Function: fn(value, key)
                         // @retrn Boolean:
                         // @help: mm#mm.some
                         // @desc: prototype pollution safety Array#some
//{@assert
    Type_allow(source, TYPE_ITERATABLE);
    Type_allow(fn,     TYPE_FUNCTION);
//}@assert

    if (_isArray(source)) { // Array
        return source.some(fn);
    }

    var ary = _keys(source), key, i = 0, iz = ary.length; // uupaa-looper

    for (; i < iz; ++i) {
        key = ary[i];
        if (fn(source[key], key)) { // fn(value, key)
            return true;
        }
    }
    return false;
}

// mm.count
function mm_count(data,       // @param Hash/Array/Function:
                  find,       // @param Mix(= ""): find key
                  iterator) { // @param Function(= null): iterator(value, key):KeyString
                              // @return Number/Hash: Number(element count) or { element: count, ... }
                              // @help: mm#mm.count
                              // @desc: count the number of occurrences of an element
                              //     `` 値の出現回数をカウントします。
                              //        iteratorが指定されない場合は要素を文字列として比較します
//{@assert
    Type_allow(data,     TYPE_ITERATABLE);
    Type_allow(iterator, TYPE_FUNCTION | TYPE_UNDEFINED);
//}@assert

    if (_isArray(data)) {
        return data.count(find, iterator); // Array#count
    }

    iterator = iterator || false;

    var rv = {}, key = "", val,
        ary = _keys(data), i = 0, iz = ary.length; // uupaa-looper

    for (; i < iz; ++i) {
        key = ary[i];
        val = iterator ? iterator(data[key], key)
                       : data[key];
        rv[val] ? ++rv[val] : (rv[val] = 1);
    }
    return find ? (rv[find] || 0) : rv;
}

// mm.clear
function mm_clear(mix) { // @param Array/Hash/Function:
                         // @return Array/Hash:
                         // @help: mm#mm.clear
                         // @desc: clear hash or array
//{@assert
    Type_allow(mix, TYPE_HASH | TYPE_ARRAY | TYPE_FUNCTION);
//}@assert

    if (_isArray(mix)) {
        return mix.clear(); // Array#clear
    }

    var ary = _keys(mix), i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        delete mix[ary[i]];
    }
    mix.__proto__ && (mix.__proto__ = null);
    return mix;
}

// mm.every
function mm_every(source, // @param Hash/Array/Function: source
                  fn) {   // @param Function: fn(value, key)
                          // @retrn Boolean:
                          // @help: mm#mm.every
                          // @desc: prototype pollution safety Array#every
//{@assert
    Type_allow(source, TYPE_HASH | TYPE_ARRAY | TYPE_FUNCTION);
    Type_allow(fn,     TYPE_FUNCTION);
//}@assert

    if (_isArray(source)) { // Array
        return source.every(fn);
    }

    var ary = _keys(source), key, i = 0, iz = ary.length; // uupaa-looper

    for (; i < iz; ++i) {
        key = ary[i];
        if (!fn(source[key], key)) { // fn(value, key)
            return false;
        }
    }
    return true;
}

// mm.type
function Type(mix,     // @param Mix: any
              match) { // @param Number(= null): match types
                       // @return TypeNumber: mm.type.{{BASIC-TYPE}} value. eg: mm.type.STRING
                       // @help: Type#mm.type
                       // @desc: detect the type of the variable basic
                       //     `` 変数の基本的な型を検出します

    var rv, type, callee = _strictMode ? "" : "callee";

    rv = mix === null   ? TYPE_NULL
       : mix === void 0 ? TYPE_UNDEFINED
       : mix === global ? TYPE_GLOBAL
       : mix.nodeType   ? TYPE_NODE
       : 0;

    if (!rv) {
        type = _toString.call(mix);
        rv = TYPE_DETECTION[type] || 0;

        if (!rv) {
            rv = mix[callee] ? TYPE_FAKE_ARRAY // [IE6][IE7][IE8][strict mode]
               : mix.item    ? TYPE_FAKE_ARRAY // [IE6][IE7][IE8]
               : TYPE_OBJECT;
        }
    }
    return match ? rv & match : rv;
}

// mm.type.of
function Type_of(mix) { // @param Mix: search literal/object `` あらゆる型を受け取ります
                        // @return TypeNameString: `` 型名の文字列を返します
                        // @help: Type#Type.of
                        // @desc: get type string `` オブジェクトの型を判別し型名を返します
    switch (Type(mix)) {
    case TYPE_NODE: return "Node";
    case TYPE_NULL: return "Null";
    case TYPE_STYLE: return "Style";
    case TYPE_GLOBAL: return "Global";
    case TYPE_UNDEFINED: return "Undefined";
    case TYPE_FAKE_ARRAY: return "FakeArray";
    }
    return mix.constructor.name ||
          (mix.constructor + "").split("(")[0].trim().slice(9); // ) [IE][Opera<11]
}

//{@assert
// mm.type.deny
function Type_deny(mix,     // @param Mix:
                   types) { // @param TypeNumber/TypeString/StringArray:
                            //             eg: Type.Number | Type.ARRAY,
                            //                 "NumberArray/String"
                            //                 ["hoge", "huga", "piyo"]
                            // @help: Type#mm.type.deny
                            // @desc: type deny assertion `` 型を調べ型の一致で例外を生成します
    var assert = false;

    if (_isArray(types)) {
        if (types.has(mix)) {
            assert = true;
        }
    } else if (Type_isAny(mix, types)) {
        assert = true;
    }
    if (assert) {
        // http://uupaa.hatenablog.com/entry/2011/11/18/115409
        debugger;
        try {
            throw new Error(mm_dump(mix, true) + " = " + types);
        } catch (o_o) {
            if (!mm._ignore) {
                mm_log_error("file: @@, line: @@, stack: @@".at(
                                o_o.sourceURL || o_o.fileName || "",
                                o_o.line || o_o.lineNumber || 0,
                                o_o.stack || ""));
            }
            throw new Error((o_o.stack || o_o.message) + "");
        }
    }
}
//}@assert

//{@assert
// Type.allow
function Type_allow(mix,     // @param Mix:
                    types) { // @param TypeNumber/TypeString/StringArray:
                             //             eg: Type.Number | Type.ARRAY,
                             //                 "NumberArray/String"
                             //                 ["hoge", "huga", "piyo"]
                             // @help: Type#Type.allow
                             // @desc: type allow assertion `` 型を調べ型の不一致で例外を生成します

    var assert = false;

    if (_isArray(types)) {
        if (!types.has(mix)) {
            assert = true;
        }
    } else if (Type_isAny(mix, types, true)) {
        assert = true;
    }
    if (assert) {
        // http://uupaa.hatenablog.com/entry/2011/11/18/115409
        debugger;
        try {
            throw new Error(mm_dump(mix, true) + " = " + types);
        } catch (o_o) {
            if (!mm._ignore) {
                mm_log_error("file: @@, line: @@, stack: @@".at(
                                o_o.sourceURL || o_o.fileName || "",
                                o_o.line || o_o.lineNumber || 0,
                                o_o.stack || ""));
            }
            throw new Error((o_o.stack || o_o.message) + "");
        }
    }
}
//}@assert

// mm.type.isAny
function Type_isAny(mix,      // @param Mix:
                    types,    // @param TypeNumber/TypeString: Type.NUMBER | Type.STRING ...
                    negate) { // @param Boolean(= false):
                              // @return Boolean:
                              // @help: Type#mm.type.isAny
                              // @desc: is any types `` 何れかの型と一致するなら true を返します
    var rv = true;

    if (types == null) { // null or undefined
        return false;
    } else if (typeof types === "number") {
        rv = !!(Type(mix) & types);
    } else if (typeof types === "string") {
        rv = types.split(/[\||\/]/).some(function(judge) {
            return Type["is" + judge] &&
                  (Type["is" + judge](mix));
        });
    }
    return !!(rv ^ (negate || false));
}

// mm.type.isLike
function Type_isLike(lval,    // @param Mix: left value  `` 左辺値を指定します
                     rval,    // @param Mix: right value `` 右辺値を指定します
                     judge) { // @param Function(= _judge): the function to be called a type mismatch. judge(lval, rval):Boolean
                              //                            `` 型の不一致で呼び出す関数を指定します
                              // @return Boolean: true is like `` 類似しているなら true を返します
                              // @help: Type#mm.type.isLike
                              // @desc: like and deep matching `` 類似検索と深度探索を行い、よく似ているオブジェクトなら true を返します

    function _judge(lval, rval) {
        // --- Date like DateString ---
        if ((ltype === TYPE_DATE && rtype === TYPE_STRING) ||
            (rtype === TYPE_DATE && ltype === TYPE_STRING)) {

            return ltype === TYPE_DATE ? lval.toJSON() === Date.from(rval).toJSON()
                                       : rval.toJSON() === Date.from(lval).toJSON();
        }
        // --- Array like FakeArray ---
        if ((ltype === TYPE_ARRAY && rtype === TYPE_FAKE_ARRAY) ||
            (rtype === TYPE_ARRAY && ltype === TYPE_FAKE_ARRAY)) {

            return ((lval.length === rval.length) &&
                    (Array_toArray(lval) + "" == Array_toArray(rval) + ""));
        }
        return false;
    }

//{@assert
    Type_allow(judge,  TYPE_FUNCTION | TYPE_UNDEFINED);
//}@assert

    judge = judge || _judge;

    var ltype = Type(lval), rtype = Type(rval);

    if (ltype !== rtype) {
        return judge ? judge(lval, rval) : false;
    }
    switch (ltype) {
    case TYPE_DATE:     return lval.toJSON() === rval.toJSON();
    case TYPE_HASH:     return ((_keys(lval).length === _keys(rval).length) &&
                                mm_has(lval, rval));
    case TYPE_FAKE_ARRAY:
    case TYPE_ARRAY:    return ((lval.length === rval.length) &&
                                (Array_toArray(lval) + "" ==
                                 Array_toArray(rval) + ""));
    case TYPE_REGEXP:   return lval.source === rval.source;
    case TYPE_NUMBER:   if (isNaN(lval) && isNaN(rval)) {
                            return true;
                        }
    }
    return lval === rval;
}

// mm.type.isEmpty
function Type_isEmpty(mix) { // @param Hash/String/Array/FakeArray/null/undefined:
                             // @return Boolean:
                             // @help: Type#mm.type.isEmpty
                             // @desc: is Empty or length is zero `` 長さ または 要素数がゼロで true を返します
//{@assert
    Type_allow(mix, TYPE_HASH | TYPE_STRING | TYPE_NUMBER | TYPE_ARRAY |
                    TYPE_FAKE_ARRAY | TYPE_NULL | TYPE_UNDEFINED);
//}@assert

    if (mix == null) { // undefined or null
        return true;
    }
    if (mix.length !== void 0 && !mix.length) { // zero length
        return true;
    }
    if (Type_isHash(mix)) {
        return !_keys(mix).length;
    }
    return false;
}

// mm.type.isChar
function Type_isChar(mix) { // @param Mix: search
                            // @return Boolean:
                            // @help: Type#mm.type.isChar
                            // @desc: is character `` オブジェクトが文字なら true を返します
    return Type_isString(mix) && mix.length === 1;
}

// mm.type.isDate
function Type_isDate(mix) { // @param Mix: search
                            // @return Boolean:
                            // @help: Type#mm.type.isDate
                            // @desc: is Date `` オブジェクトが Date 型なら true を返します
    return _toString.call(mix) === "[object Date]";
}

// mm.type.isHash
function Type_isHash(mix) { // @param Mix: search
                            // @return Boolean:
                            // @help: Type#mm.type.isHash
                            // @desc: is hash `` オブジェクトが Hash (Object型) なら true を返します
    return Type(mix) === TYPE_HASH;
}

// mm.type.isNode
function Type_isNode(mix) { // @param Mix: search
                            // @return Boolean:
                            // @help: Type#mm.type.isNode
                            // @desc: is DOM Node `` オブジェクトが Hash型 なら true を返します
    return !!(mix && mix.nodeType);
}

// mm.type.isNull
function Type_isNull(mix) { // @param Mix: search
                            // @return Boolean:
                            // @help: Type#mm.type.isNull
                            // @desc: is null `` オブジェクトが null なら true を返します
    return mix === null;
}

// mm.type.isSome
function Type_isSome(mix,     // @param MixArray:
                     types) { // @param Number:
                              // @return Boolean:
                              // @help: Type#mm.type.isSome
                              // @desc: returns true if the type of some objects that match
                              //     `` 幾つかのオブジェクトの型が一致するなら true を返します
//{@assert
    Type_allow(mix,   TYPE_ARRAY);
    Type_allow(types, TYPE_NUMBER);
//}@assert

    if (_isArray(mix)) {
        var i = 0, iz = mix.length;

        for (; i < iz; ++i) {
            if (Type(mix[i], types)) {
                return true;
            }
        }
    }
    return false;
}

// mm.type.isEvery
function Type_isEvery(mix,     // @param MixArray:
                      types) { // @param Number:
                               // @return Boolean:
                               // @help: Type#mm.type.isEvery
                               // @desc: returns true if the type of all objects that match
                               //     `` 全てのオブジェクトの型が一致するなら true を返します
//{@assert
    Type_allow(mix,   TYPE_ARRAY);
    Type_allow(types, TYPE_NUMBER);
//}@assert

    if (_isArray(mix)) {
        var i = 0, iz = mix.length;

        for (; i < iz; ++i) {
            if (!Type(mix[i], types)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// mm.type.isStyle
function Type_isStyle(mix) { // @param Mix: search
                             // @return Boolean:
                             // @help: Type#mm.type.isStyle
                             // @desc: is CSSStyleDeclaration `` オブジェクトが CSSStyleDeclaration型 なら true を返します
    return Type(mix) === TYPE_STYLE;
}

// mm.type.isFuture
function Type_isFuture(mix) { // @param Mix: search
                              // @return Boolean:
                              // @help: Type#mm.type.isFuture
                              // @desc: is Future
    return mix instanceof Future;
}

// mm.type.isRegExp
function Type_isRegExp(mix) { // @param Mix: search
                              // @return Boolean:
                              // @help: Type#mm.type.isRegExp
                              // @desc: is RegExp `` オブジェクトが RegExp 型なら true を返します
    return _toString.call(mix) === "[object RegExp]";
}

// mm.type.isString
function Type_isString(mix) { // @param Mix: search
                              // @return Boolean:
                              // @help: Type#mm.type.isString
                              // @desc: is String `` オブジェクトが String 型なら true を返します
    return _toString.call(mix) === "[object String]";
}

// mm.type.isNumber
function Type_isNumber(mix) { // @param Mix: search
                              // @return Boolean:
                              // @help: Type#mm.type.isNumber
                              // @desc: is Number `` オブジェクトが Number 型なら true を返します
    return _toString.call(mix) === "[object Number]";
}

// mm.type.isInteger
function Type_isInteger(mix) { // @param Mix: search
                               // @return Boolean:
                               // @help: Type#mm.type.isInteger
                               // @desc: is Integer `` オブジェクトが整数なら true を返します
    return _toString.call(mix) === "[object Number]" &&
           mix !== Infinity && Math.floor(mix) === mix;
}

// mm.type.isBoolean
function Type_isBoolean(mix) { // @param Mix: search
                               // @return Boolean:
                               // @help: Type#mm.type.isBoolean
                               // @desc: is Boolean `` オブジェクトが Boolean 型なら true を返します
    return _toString.call(mix) === "[object Boolean]";
}

// mm.type.isFunction
function Type_isFunction(mix) { // @param Mix: search
                                // @return Boolean:
                                // @help: Type#mm.type.isFunction
                                // @desc: is Function `` オブジェクトが Function 型なら true を返します
    return _toString.call(mix) === "[object Function]";
}

// mm.type.isFakeArray
function Type_isFakeArray(mix) { // @param Mix: search
                                 // @return Boolean:
                                 // @help: Type#mm.type.isFakeArray
                                 // @desc: is FakeArray `` オブジェクトが FakeArray型 なら true を返します
    return Type(mix) === TYPE_FAKE_ARRAY;
}

// mm.type.isUndefined
function Type_isUndefined(mix) { // @param Mix: search
                                 // @return Boolean:
                                 // @help: Type#mm.type.isUndefined
                                 // @desc: is undefined `` オブジェクトが undefined 型なら true を返します
    return mix === void 0;
}

// mm.type.isPrimitive
function Type_isPrimitive(mix) { // @param Mix: search primitive/object `` あらゆる型のオブジェクトを受け取ります
                                 // @return Boolean: true is primitive  `` プリミティブならtrueを返します
                                 // @help: Type#mm.type.isPrimitive
                                 // @desc: is primitive type  `` オブジェクトがプリミティブ型なら true を返します
    return !!(Type(mix) & TYPE_PRIMITIVE);
}

// mm.type.isDenseArray
function Type_isDenseArray(mix) { // @param Mix: search primitive/object `` あらゆる型のオブジェクトを受け取ります
                                  // @return Boolean: true is dense array
                                  // @help: Type#mm.type.isDenseArray
                                  // @desc: is dense array `` 密な配列ならtrueを返します
    if (_isArray(mix)) {
        var i = mix.length;

        while (--i in mix) {
        }
        return i === -1;
    }
    return false;
}

// mm.type.isSparseArray
function Type_isSparseArray(mix) { // @param Mix: search primitive/object `` あらゆる型のオブジェクトを受け取ります
                                   // @return Boolean: true is sparse array
                                   // @help: Type#mm.type.isSparseArray
                                   // @desc: is sparse array `` 疎な配列ならtrueを返します
    if (_isArray(mix)) {
        var i = mix.length;

        while (--i in mix) {
        }
        return i !== -1;
    }
    return false;
}

//{@url
// mm.type.isURL
function Type_isURL(mix) { // @param Mix: search
                           // @return Boolean:
                           // @help: Type#mm.type.isURL
                           // @desc: is URL `` オブジェクトが URL型 なら true を返します
    return Type_isAbsoluteURL(mix) ||
           Type_isRelativeURL(mix);
}
//}@url

//{@url
// mm.type.isAbsoluteURL
function Type_isAbsoluteURL(mix) { // @param Mix: search
                                   // @return Boolean:
                                   // @help: Type#mm.type.isAbsoluteURL
                                   // @desc: is Absolute URL String
    return Type_isString(mix) &&
           mm_url._SCHEMES.test(mix) &&
           (!mix.indexOf("file") ? mm_url._FILE_SCHEME.test(mix)
                                 : mm_url._HTTP_SCHEME.test(mix));
}
//}@url

//{@url
// mm.type.isRelativeURL
function Type_isRelativeURL(mix) { // @param Mix: search
                                   // @return Boolean:
                                   // @help: Type#mm.type.isRelativeURL
                                   // @desc: is Relative URL String
    return Type_isString(mix) &&
           !mm_url._SCHEMES.test(mix) &&
           mm_url._HTTP_SCHEME.test("http://a.a/" + mix.replace(/^\/+/, ""));
}
//}@url

//{@binary
// mm.type.isByteArray
function Type_isByteArray(mix) { // @param Mix: search
                                 // @return Boolean:
                                 // @help: Type#mm.type.isByteArray
                                 // @desc: is Byte Array `` オブジェクトが 0～255までの整数の配列なら true を返します
    return _Type_isIntArray(mix, 0xff);
}
//}@binary

//{@binary
// mm.type.isWordArray
function Type_isWordArray(mix) { // @param Mix: search
                                 // @return Boolean:
                                 // @help: Type#mm.type.isWordArray
                                 // @desc: is Byte Array `` オブジェクトが 0～65535までの整数の配列なら true を返します
    return _Type_isIntArray(mix, 0xffff);
}
//}@binary

//{@binary
// inner - mm.type.isByteArraym Type.isWordArray impl
function _Type_isIntArray(mix,   // @param Mix: search
                          max) { // @param Number: max value
                                 // @return Boolean:
    if (_isArray(mix)) {
        for (var n, i = 0, iz = mix.length; i < iz; ++i) {
            n = mix[i];
            if (typeof n !== "number" ||
                n < 0 || n > max || Math.floor(n) !== n) { // int or uint

                return false;
            }
        }
        return true;
    }
    return false;
}
//}@binary

//{@binary
// mm.type.isByteString
function Type_isByteString(mix) { // @param Mix: search
                                  // @return Boolean:
                                  // @help: Type#mm.type.isByteString
                                  // @desc: is Byte String `` 0～255 の値の文字のみで構成されている文字列なら true を返します
    return _Type_isCharCodeString(mix, 0xff);
}
//}@binary

//{@binary
// mm.type.isWordString
function Type_isWordString(mix) { // @param Mix: search
                                  // @return Boolean:
                                  // @help: Type#mm.type.isWordString
                                  // @desc: is Word String `` 0～65535 の値の文字のみで構成されている文字列なら true を返します
    return _Type_isCharCodeString(mix, 0xffff);
}
//}@binary

//{@binary
// inner - mm.type.isByteString, Type.isWordString impl
function _Type_isCharCodeString(mix,   // @param Mix: search
                                max) { // @param Number: max value
                                       // @return Boolean:
    if (Type_isString(mix)) {
        for (var i = 0, iz = mix.length; i < iz; ++i) {
            if (mix.charCodeAt(i) > max) {
                return false;
            }
        }
        return true;
    }
    return false;
}
//}@binary

// mm.type.isNumberArray
function Type_isNumberArray(mix) { // @param Mix: search
                                   // @return Boolean:
                                   // @help: Type#mm.type.isNumberArray
                                   // @desc: is Number Array `` オブジェクトが数値の配列なら true を返します
    return _Type_isTypeedArray(mix, "number");
}

// mm.type.isStringArray
function Type_isStringArray(mix) { // @param Mix: search
                                   // @return Boolean:
                                   // @help: Type#mm.type.isStringArray
                                   // @desc: is String Array `` オブジェクトが文字列の配列なら true を返します
    return _Type_isTypeedArray(mix, "string");
}

// inner - mm.type.isNumberArray, Type.isStringArray impl
function _Type_isTypeedArray(mix,    // @param Mix: search
                             type) { // @param String: "number", "string", ...
                                     // @return Boolean:
    if (_isArray(mix)) {
        for (var i = 0, iz = mix.length; i < iz; ++i) {
            if (typeof mix[i] !== type) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// mm.type.complex
function Type_complex(key,     // @param String/Hash(= undefined):   `` key に相当する引数を指定します。省略可能です
                      value) { // @param String/Number(= undefined): `` value に相当する引数を指定します。省略可能です
                               // @return Number: mm.type.complex.{{CONST}}
                               // @help: Type#mm.type.complex
                               // @desc: complex type detection `` 引数のパターンを分類します

//{@assert
    Type_allow(key,   TYPE_STRING | TYPE_HASH   | TYPE_UNDEFINED);
    Type_allow(value, TYPE_STRING | TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    if (key === void 0) { // mm.type.complex(undefined, undefined) -> mm.type.complex.NONE
        return Type_complex.NONE;
    }
    if (value !== void 0) { // mm.type.complex(key, value) -> mm.type.complex.PAIR
        return Type_complex.PAIR;
    }
    return typeof key === "string" ? Type_complex.KEY   // mm.type.complex(key) -> mm.type.complex.KEY
                                   : Type_complex.HASH; // mm.type.complex({})  -> mm.type.complex.HASH
}

// Object.keys - polyfill
function _Object_keys_(source) { // @param Hash/Array: source `` Hash や Array を指定します
                                 // @return KeyStringArray: [key, ... ]
                                 // @see: mm.key, mm.val, mm.hash
                                 // @help: Object#Object.keys
                                 // @desc: enumerate Hash keys ``  Hash や Array の Key を列挙します
    var rv = [], key, ri = 0,
        has = !!source.hasOwnProperty; // [IE6][IE7][IE8] 
                                       // global/host-objects has not hasOwnProperty

    for (key in source) {
        if (!has || source.hasOwnProperty(key)) {
            rv[ri++] = key;
        }
    }
    return rv;
}

//{@legacy
// String#trim
function String_trim() { // @return String:
                         // @desc: trim both spaces
    return this.replace(/^\s+/, "").
                replace(/\s+$/, "");
}
//}@legacy

// String#repeat
function String_repeat(count) { // @param Number:  `` リピート回数を指定します。負の値は0とみなします
                                // @return String: repeated string `` リピートした文字列を返します
                                // @help: String#String.prototype.repeat
                                // @desc: repeat strings `` 文字列を繰り返します
//{@assert
    Type_allow(count, TYPE_NUMBER);
//}@assert

    return (this.length && count > 0) ? Array((count + 1) | 0).join(this)
                                      : "";
}

// String#reverse
function String_reverse() { // @return String:
                            // @help: String#String.prototype.reverse
                            // @desc: reverse characters
    return this.split("").reverse().join("");
}

// String#contains
function String_contains(find) { // @param Number/String: find string
                                 // @return Boolean:
                                 // @help: String#String.prototype.contains
                                 // @desc: `` 文字列が find を含むなら true を返します
//{@assert
    Type_allow(find, TYPE_NUMBER | TYPE_STRING);
//}@assert
    return this.indexOf(find) !== -1;
}

// String#endsWith
function String_endsWith(find) { // @param Number/String: find string
                                 // @return Boolean:
                                 // @help: String#String.prototype.endsWith
                                 // @desc: `` 文字列の末尾が一致するなら true を返します
//{@assert
    Type_allow(find, TYPE_NUMBER | TYPE_STRING);
//}@assert
    return this.slice(-("" + find).length) == find; // if case compare(String == Number)
}

// String#startsWith
function String_startsWith(find) { // @param Number/String: find string
                                   // @return Boolean:
                                   // @help: String#String.prototype.startsWith
                                   // @desc: `` 文字列の先頭が一致するなら true を返します
//{@assert
    Type_allow(find, TYPE_NUMBER | TYPE_STRING);
//}@assert
    return !this.indexOf(find);
}

// String#at
function String_at(/* var_args */) { // @param Mix: values `` 可変長引数を受け取ります
                                     // @return String: "formatted string" `` 文字列に埋め込まれた "@@" を引数の数だけ置換した文字列を返します
                                     // @see: String#sprintf
                                     // @help: String#String.prototype.at
                                     // @desc: placeholder( "@@" ) replacement `` 文字列中の "@@" を引数で置換します
    var i = 0, args = arguments;

    return this.replace(String_at._PATTERN, function() {
        return args[i++];
    });
}
String_at._PATTERN = /@@/g; // for String#at(), Array#at()

// String#up
function String_up(index) { // @param Number(= 0): position
                            // @return String:
                            // @see: String#low
                            // @help: String#String.prototype.up
                            // @desc: string.toUpperCase(index)
//{@assert
    Type_allow(index, TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    index = index || 0;

    // isNaN, over-run
    if (index !== index || index >= this.length) {
        return "" + this;
    }
    // negative
    if (index < 0) {
        index = this.length + index;
        if (index < 0) {
            return "" + this;
        }
    }
    return this.slice(0, index) + this[index].toUpperCase() +
           this.slice(index + 1);
}

// String#low
function String_low(index) { // @param Number(= 0): position
                             // @return String:
                             // @see: String#up
                             // @help: String#String.prototype.low
                             // @desc: string.toUpperCase(index)

//{@assert
    Type_allow(index, TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    index = index || 0;

    // isNaN, over-run
    if (index !== index || index >= this.length) {
        return "" + this;
    }
    // negative
    if (index < 0) {
        index = this.length + index;
        if (index < 0) {
            return "" + this;
        }
    }
    return this.slice(0, index) + this[index].toLowerCase() +
           this.slice(index + 1);
}

// String#has
function String_has(str,          // @param String: character(s)`` 比較対象の文字(列)です
                    ignoreCase) { // @param Boolean(= false): ignore-case matching `` 大小文字を無視した比較を行う場合に true を指定します。省略可能です
                                  // @return Boolean:
                                  // @see: Array#has, mm.has
                                  // @help: String#String.prototype.has
                                  // @desc: String has character(s) and ignore-case matching
                                  //        `` 文字列が文字(列)を含んでいる場合に true を返します。
//{@assert
    Type_allow(str,        TYPE_STRING);
    Type_allow(ignoreCase, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    return ignoreCase ? this.toLowerCase().indexOf(str.toLowerCase()) >= 0
                      : this.indexOf(str) >= 0;
}

// String#pad
function String_pad(size,   // @param Number(= 0):   `` 最小文字数を指定します。最文字桁数に満たない場合は fill で指定した文字で埋めます
                    fill) { // @param String(= " "): `` 隙間を埋める文字を指定します。省略可能です
                            // @return String:       `` size 以上の文字数を持つ文字列を返します
                            // @help: String#String.prototype.pad
                            // @desc: space / zero padding
                            //          `` 文字列を右寄せし、左側を空白で埋めした文字列を生成します
//{@assert
    Type_allow(size, TYPE_NUMBER | TYPE_UNDEFINED);
    Type_allow(fill, TYPE_STRING | TYPE_UNDEFINED);
//}@assert

    size = size ? size : 0;
    if (size < this.length) {                                            // 文字数より小さな値が指定された場合は、size を調整します
        size = this.length;
    }
    fill = (fill ? fill : " ").charAt(0);                                // デフォルト引数を補完し先頭文字を取り出します

    if (fill === "0" && isFinite(this)) {                                // 文字列が数値で、fillが"0"の時に...
        if (!this.indexOf("0x")) {
            // "0xff".pad(6, "0") -> "0x00ff"                            // 先頭が "0x" なら16進文字列として "0x" の位置を調整します
            return "0x" + fill.repeat(size - this.length) + this.slice(2);
        } else if (!this.indexOf("-")) {
            // "-123".pad(6, "0") -> "-00123"                            // 先頭が "-" なら "-" の位置を調整します
            return "-" + fill.repeat(size - this.length) + this.slice(1);
        }
    }
    return fill.repeat(size - this.length) + this;                       // 指定された文字数以上になるように調整し左側に詰め物をして返します
}

// String#fold
function String_fold() { // @return String:
                         // @desc: remove all space and line breaks
    return this.replace(/[\s\r\n]+/g, "");
}

//{@test
// String#test
function String_test(mix,      // @param Hash/Array:
                     title,    // @param String(= ""): test title
                     arg,      // @param Mix(= undefined): test arg
                     logger) { // @param Object(= undefined): logger object
                               // @see: String#stream, Array#test
                               // @help: String#String.prototype.test
                               // @desc: unit test

    var log = logger || mm_iog(title || this.overflow(16), true),
        hash = _isArray(mix) ? _enumNicknames(mix, true) : mix,
        command = "" + this;

    command || (command = _enumNicknames(mix).join(" > "));

    (command + " > _end_").stream(mm_mix(hash, {
            arg:    arg,                  // arg object (optional)
            log:    log,                  // log object (optional)
            _items_: 0,                   // test case items
            _pass_: 0,                    // pass count
            _miss_: 0,                    // miss count
            _test_: true,                 // true is do not stop
            _call_: String_test.callback, // pass / miss callback function
            _end_:  function() {          // end function (destructor)
                return ~log;
            }
        }));
}
String_test.callback = null;
//}@test

// String#left
function String_left(find,           // @param String: find word
                     defaultValue,   // @param String(= ""): default value
                     withFindWord) { // @param Boolean(= false): true is with find word
                                     // @return String: fragment
                                     // @see: String#right
                                     // @help: String#String.prototype.left
                                     // @desc: get left side without find word
                                     //   `` ワードで文字列を分割し左側を返します(キーワードより後ろを切り落とします)。
                                     //      返される文字列にワードは含まれません。
                                     //      ワードが見つからなければ defaultValue を返します
//{@assert
    Type_allow(find,         TYPE_STRING);
    Type_allow(defaultValue, TYPE_STRING  | TYPE_UNDEFINED);
    Type_allow(withFindWord, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    var str = "" + this, pos = str.indexOf(find);

    if (pos >= 0) {
        return withFindWord ? str.slice(0, pos + find.length) // with word
                            : str.slice(0, pos);              // without word
    }
    return defaultValue || "";
}

// String#right
function String_right(find,           // @param String: find word
                      defaultValue,   // @param String(= ""): default value
                      withFindWord) { // @param Boolean(= false): true is with find word
                                      // @return String: fragment
                                      // @see: String#left
                                      // @help: String#String.prototype.right
                                      // @desc: get right side with find word
                                      //   `` ワードで文字列を分割し、もしあれば右側を返します。
                                      //      返される文字列にワードは含まれません。
                                      //      ワードが見つからなければ defaultValue を返します
//{@assert
    Type_allow(find,         TYPE_STRING);
    Type_allow(defaultValue, TYPE_STRING  | TYPE_UNDEFINED);
    Type_allow(withFindWord, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    var str = "" + this, pos = str.indexOf(find);

    if (pos >= 0) {
        return withFindWord ? str.slice(pos)                // with word
                            : str.slice(pos + find.length); // without word
    }
    return defaultValue || "";
}

// String#count
function String_count(find,         // @param CharString(= ""): find a character
                      ignoreCase) { // @param Boolean(= false):
                                    // @return Number/Hash: Number(string count) or { string: count, ... }
                                    // @help: String#String.prototype.count
                                    // @desc: count the number of occurrences of an character
                                    //     `` 文字の出現回数をカウントします。
//{@assert
    Type_allow(find,       TYPE_STRING  | TYPE_UNDEFINED);
    Type_allow(ignoreCase, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    ignoreCase = ignoreCase || false;

    var rv = {}, i = 0, iz = this.length, key = "",
        enableStringIterator = "a"[0] === "a"; // [IE6][IE7] is false

    for (; i < iz; ++i) {
        key = enableStringIterator ? this[i]
                                   : this.charAt(i);

        ignoreCase && (key = key.toLowerCase());
        rv[key] ? ++rv[key] : (rv[key] = 1);
    }
    return find ? (rv[find] || 0) : rv;
}

// String#stream
function String_stream(mix) { // @param FunctionHash/FunctionArray:
                              //                    { fn1, fn2, fn3, fn4, ... }
                              //                    [ fn1, fn2, fn3, fn4, ... ]
                              // @this: "fn1 > fn2 + fn3"
                              // @return Object: { Number(uid), Function(halt) }
                              // @throws Error("NEED_RETURN")
                              // @see: Array#stream, String#test, Array#test
                              // @help: String#String.prototype.stream
                              // @desc: create Stream

/*
        "fn1 > fn2 + fn3"
        ~~~~~~~~~~~~~~~~~
            command

               v

        _tokenizer(command)

               v

    [ [ "fn1" ],  [ "fn2", "fn3" ] ]
        ~~~~~     ~~~~~~~~~~~~~~~~
        action         group (parallel execution group)

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
               plan
 */

    function _tokenizer(command) { // @param String: "a>b+c>d:a1>あ:a2"
                                   // @return ArrayArrayString: [["a"], ["b", "c"], ["d:a1", "あ:a2"]]
        var rv = [], remain = [];

        // allow unicode
        command.match(/([\w\-\:\u00C0-\uFFEE]+|[/+>])/g).each(function(token) {
            token === "+" ? 0 :
            token === ">" ? (remain.length && rv.push(remain.shiftAll()))
                          : remain.push(token);
        });
        remain.length && rv.push(remain.concat());
        return rv;
    }

    function halt() {
        String_stream._halt[uid] = 1; // halt switch
        hash.halted = true;
        hash.halt && hash.halt("halt");
    }

//{@assert
    Type_allow(mix, TYPE_HASH | TYPE_ARRAY | TYPE_UNDEFINED);
//}@assert

    var plan = _tokenizer(this), // plan: [ [ "fn1" ],  [ "fn2", "fn3" ] ]
        hash = _isArray(mix) ? _enumNicknames(mix, true)
                             : mm_mix({}, mix),
        uid = 3..uid();

    String_stream._halt[uid] = 0;

//{@test - for String#test
    if (hash._test_) {
        hash._items_ = plan.flatten().length - 1; // countup test case
    }
//}@test

    plan.length && _stream(plan, hash, uid);

    return { uid: uid, halt: halt };
}
String_stream._halt = {};

// inner - exec stream functions
function _stream(plan,  // @param StringArrayArray: [[fn1, fn2, ...], [fn3, ...]]
                 hash,  // @param FunctionHash: { init, fin, halt, fn1, ... }
                 uid) { // @param Number: unique id
                        // @throws Error("NEED_RETURN")

    if (!String_stream._halt[uid]) { // halted?
        var group = plan.shift();

        group && _nextStream( plan, group, hash, uid );
    }
}

// inner - next stream plan
function _nextStream(plan,  // @param StringArrayArray: [[fn1, fn2, ...], [fn3, ...]]
                     group, // @param Array: parallel execution group. [action, ...]
                     hash,  // @param FunctionHash: { init, fin, halt, fn1, ... }
                     uid) { // @param Number: unique id
                            // @throws Error("NEED_RETURN")

    var i = 0, iz = group.length, halt = 0;

    group.each(function(action) { // @param String: command string. "fn1" or "longlongtitle:alias"

        function _judge(result, // @param Boolean:
                        msg) {  // @param String(= ""): log message

            var miss = result === false;

            if (!halt) {

//{@test - for String#test
                if (hash.log) {
                    miss ? hash.log.error(key + ": ", result, msg)
                         : hash.log(key + ": ", result, msg);
                }
                if (hash._test_) {
                    miss ? ++hash._miss_
                         : ++hash._pass_;
                    if (hash._call_ && key !== "_end_") {
                        result = hash._call_({
                                    ok:     !miss,
                                    name:   key || "",
                                    msg:    msg || "",
                                    pass:   hash._pass_,
                                    miss:   hash._miss_,
                                    items:  hash._items_
                                });
                        miss = result === false;
                    } else {
                        miss = false;
                    }
                }
//}@test
                if (miss) {
                    hash.halted = !!++halt;
                    hash.halt && hash.halt(key);
                } else if (++i >= iz) {
                    _stream(plan, hash, uid); // recursive call
                }
            }
        }
        function _delay() { // "... > 1000 > ..." -> delay 1000ms
            _judge(true);
        }

        if (isFinite(action)) { // "1000" -> delay 1000ms
            setTimeout(_delay, +action);
        } else {
            var key = action, r;

            if (action.indexOf(":") >= 0) { // find alias
                key = action.left(":");
                key = key in hash ? key : action.right(":");
            }
            if (!key) {
                hash.log && hash.log.error(action, "NOT_FOUND");
                key = "halt";
            }

//{@test - for String#test
            switch (Type(hash[key])) {
            case TYPE_ARRAY:
                r = hash[key][2] || Type_isLike; // override judge function
                _judge(r(hash[key][0], hash[key][1]),
                       "= @@( @@ )".at(
                            r.nickname(),
                            mm_dump(hash[key][0], true) + ", " +
                            mm_dump(hash[key][1], true)
                      ));
                return;
            case TYPE_BOOLEAN:
                _judge(hash[key]);
                return;
            }
//}@test
            // function -> sync or async lazy evaluation
            r = hash[key](_judge);
            if (r === false || r === true) {
                _judge(r);
            } else if (r === void 0 && hash[key].length < 1) { // fn(no-arg) { no-return }
                throw new Error("NEED_RETURN: " + key);
            }
        }
    });
}

// String#anagram
function String_anagram(search,       // @param String: find character(s)`` 比較対象の文字(列)です
                        ignoreCase) { // @param Boolean(= false): ignore-case matching `` 大小文字を無視した比較を行う場合に true を指定します。省略可能です
                                      // @return Boolean:                              `` 一致する場合に true を返します
                                      // @help: String#String.prototype.anagram
                                      // @desc: String has character(s), anagram and ignore-case matching
                                      //        `` 文字列が文字(列)を含んでいる場合に true を返します。
                                      //           順番を無視して検索します。
//{@assert
    Type_allow(search,     TYPE_STRING);
    Type_allow(ignoreCase, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    var target = "" + this, key, hash;

    if (target.length < search.length) {
        return false;
    }
    if (ignoreCase) {
        target = target.toLowerCase();
        search = search.toLowerCase();
    }
    hash = target.toWordArray().count();

    for (key in search.toWordArray().count()) {
        if (hash[key]) {
            --hash[key];
        } else {
            return false;
        }
    }
    return true;
}

//{@sprintf
// String#sprintf
function String_sprintf(/* var_args */) { // @param Mix: sprintf var_args `` 可変長引数を受け取ります
                                          // @return String:              `` 文字列に埋め込まれた "%..." を引数の数だけ置換した文字列を返します
                                          // @help: String#String.prototype.sprintf
                                          // @desc: sprintf `` 文字列をフォーマットします

    function _parse(_,        // @param String: dummy
                    argIndex, // @param String: matched arg index
                    flag,     // @param String: flag (#|0| )
                    width,    // @param String: width
                    prec,     // @param String: precision
                    size,     // @param String: dummy
                    types) {  // @param String: types (%|i|d|u|o|x|X|f|c|s)

        if (types === "%") { // "%%" -> "%"
            return types;
        }
        index = argIndex ? parseInt(argIndex) : next++;

        var bits = String_sprintf._bits[types], overflow, pad,
            v = (args[index] === void 0) ? "" : args[index];

        // 0x0001: parseInt
        // 0x0002: parseFloat
        // 0x0004: toString
        // 0x0010: negative padding control
        // 0x0020: toUNSINGED
        // 0x0040: addPrefix(%o is "0", %x is "0x")
        // 0x0080: precision
        // 0x0100: toOctet
        // 0x0200: toHex
        // 0x0800: padding
        // 0x1000: toUpperCase
        // 0x2000: get char
        // 0x4000: check overflow
        bits & 0x0001 && (v = parseInt(v));
        bits & 0x0002 && (v = parseFloat(v));
        bits & 0x0003 && (v = isNaN(v) ? "": v);
        bits & 0x0004 && (v = ((types === "s" ? v : types) || "").toString());
        bits & 0x0020 && (v = v >= 0 ? v : v % 0x100000000 + 0x100000000);
        bits & 0x0300 && (v = v.toString(bits & 0x100 ? 8 : 16));
        bits & 0x0040 && flag === "#" && (v = (bits & 0x100 ? "0" : "0x") + v);
        bits & 0x0080 && prec && (v = bits & 2 ? v.toFixed(prec)
                                               : v.slice(0, prec));
        bits & 0x6000 && (overflow = (typeof v !== "number" || v < 0));
        bits & 0x2000 && (v = overflow ? "" : String.fromCharCode(v));

        v = bits & 0x1000 ? v.toString().toUpperCase()
                          : v.toString();
        // padding
        if (!(bits & 0x800 || width === void 0 || v.length >= width)) {
            pad = Array(width - v.length + 1).join((!flag ||
                                                    flag === "#") ? " " : flag);
            v = ((bits & 0x10 && flag === "0") && !v.indexOf("-")) ?
                ("-" + pad + v.slice(1)) : (pad + v);
        }
        return v;
    }

    var next = 0, index = 0, args = arguments;

    return this.replace(String_sprintf._format, _parse);
}
String_sprintf._bits = {
    i: 0x0011, // "%i" padding + toInt
    d: 0x0011, // "%d" padding + toInt
    u: 0x0021, // "%u" padding + toUnsinged
    o: 0x0161, // "%o" padding + toOctet + toUnsigned + addPrefix("0")
    x: 0x0261, // "%x" padding + toHex   + toUnsigned + addPrefix("0")
    X: 0x1261, // "%X" padding + toUpperCase + toHex  + toUnsigned + addPrefix("0")
    f: 0x0092, // "%f" precision + padding + toFloat
    c: 0x2800, // "%c" get first char + padding
    s: 0x0084  // "%s" precision + toString
};
String_sprintf._format =
    /%(?:(\d+)\$)?(#|0| )?(\d+)?(?:\.(\d+))?(l)?([%iduoxXfcs])/g;
//}@sprintf

// String#overflow
function String_overflow(maxLength, // @param Number:          `` 文字列の最大長を指定します
                         omit) {    // @param String(= "..."): `` 省略記号の指定です。省略可能です
                                    // @return String:         `` 加工後の文字列を返します
                                    // @help: String#String.prototype.overflow
                                    // @desc: overflow string `` 最大長以下になるように文字列を切り落とし省略した事をしめす"..."を末尾に追加します
//{@assert
    Type_allow(maxLength, TYPE_NUMBER);
    Type_allow(omit,      TYPE_STRING | TYPE_UNDEFINED);
//}@assert

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

// String#trimTag
function String_trimTag() { // @return String:
                            // @help: String#String.prototype.trimTag
                            // @desc: trim both spaces and strip HTML tags
                            //      `` 文字列両端の空白を除去し、文字列中の HTMLタグ("<...>", "</...>")を削除した文字列を返します
    return this.trim().replace(/<\/?[^>]+>/g, "");
}

// String#trimChar
function String_trimChar(c,     // @param String: trim char
                         all) { // @param Boolean(= false): true is trim all characters, false is trim a character
                                // @return String: trimed string `` 両端にある文字と空白を削除した文字列を返します
                                // @help: String#String.prototype.trimChar
                                // @desc: trim both spaces and strip characters
                                //   `` 文字列両端の空白を除去し、文字列の両端から指定された文字を1つまたは全て除去した文字列を返します。
    return this.trim().replace(RegExp("^" + c + (all ? "+" : "")), "").
                       replace(RegExp(c + (all ? "+" : "") + "$"), "");
}

// String#trimQuote
function String_trimQuote() { // @return String: trimed string `` 両端にあるクォートと空白を削除した文字列を返します
                              // @help: String#String.prototype.trimQuote
                              // @desc: trim both spaces and strip single/double quotes
                              //    `` 文字列両端の空白を除去し、両端のダブルクォート/シングルクォートを削除した文字列を返します。
                              //        クォートの対応がとれていない場合は空白のみを除去した文字列を返します
    var str = this.trim(),
        m = /^["']/.exec(str);

    if (m) {
        m = RegExp(m[0] + "$").exec(str);
        if (m) {
            return str.trimChar(m[0]);
        }
    }
    return str;
}

// String#addIfNot
function String_addIfNot(find) { // @param String:
                                 // @return String: new String
                                 // @help: String#String.prototype.addIfNot
                                 // @desc: add value if not exists `` 値が存在しなければ末尾に追加した新しい文字列を返します
//{@assert
    Type_allow(find, TYPE_STRING);
//}@assert

    return this.indexOf(find) < 0 ? this + find
                                  : this + "";
}

// String#removeIf
function String_removeIf(find) { // @param String:
                                 // @return String: new String
                                 // @help: String#String.prototype.removeIf
                                 // @desc: remove value if exists `` 値が存在すれば削除した新しい文字列を返します
//{@assert
    Type_allow(find, TYPE_STRING);
//}@assert

    var index = this.indexOf(find);

    return index < 0 ? this + ""
                     : this.slice(0, index) + this.slice(index + find.length);
}

// String#decompress
function String_decompress(splitter) { // @param String/RegExp(= /[,;:]/): splitter `` セパレータを文字列または正規表現で指定します。省略可能です
                                       // @return Hash: { a: "1", b: "2" }          `` Hash を返します
                                       // @help: String#String.prototype.decompress
                                       // @desc: joint string to Hash `` カンマやコロン,セミコロンで区切られた文字列から Hash を返します
//{@assert
    Type_allow(splitter, TYPE_STRING | TYPE_REGEXP | TYPE_UNDEFINED);
//}@assert

    var rv = {}, ary = this.split(splitter || String_decompress._SPLITTER),
        i = 0, iz = ary.length;

    for (; i < iz; i += 2) {
        rv[ary[i]] = ary[i + 1];
    }
    return rv;
}
String_decompress._SPLITTER = /[,;:]/; // for String#toHash()

// inner - matchPrefix
function _matchPrefix(str,          // @param String:
                      find,         // @param StringArray/String:
                      ignoreCase) { // @param Boolean(= false):
                                    // @return String:
                                    // @desc: find the matching prefix from an array of strings

    var pattern = _isArray(find) ? find.join("|") : find,
        m = RegExp("^(" + pattern + ")", ignoreCase ? "i" : "").exec(str);

    return m ? m[1] : "";
}

// inner - matchSuffix
function _matchSuffix(str,          // @param String:
                      find,         // @param StringArray/String:
                      ignoreCase) { // @param Boolean(= false):
                                    // @return String:
                                    // @desc: find the matching suffix from an array of strings

    var pattern = _isArray(find) ? find.join("|") : find,
        m = RegExp("(" + pattern + ")$", ignoreCase ? "i" : "").exec(str);

    return m ? m[1] : "";
}

// String#toCharArray
function String_toCharArray() { // @return StringArray: char array
                                // @help: String#String.prototype.toCharArray
                                // @desc: returns a string array
    return this.split("");
}

// String#toWordArray
function String_toWordArray() { // @return WordArray: `` WordArray を返します
                                // @help: String#String.prototype.toWordArray
                                // @desc: returns a string array to quantify `` 文字列を数値化し配列を返します

    var rv = [], str = "" + this, i = 0, iz = str.length;

    for (; i < iz; ++i) {
        rv[i] = str.charCodeAt(i) & 0xffff;
    }
    return rv;
}

// Array.of
function Array_of(/* var_args */) { // @param var_args:
                                    // @return Array:
                                    // @help: Array#Array.of
                                    // @desc: Array.of("red", "green", "blue")
    return _slice.call(arguments);
}

// Array.range
function Array_range(begin,    // @param Number: begin `` 開始番号を数値で指定します
                     end,      // @param Number: end   `` 終了番号を数値で指定します。フィルタによる制限が無い限り、戻り値にはendで指定した終了番号が含まれます
                     filter) { // @param Function/Number(= 1): filter or skip number `` フィルター関数またはスキップ数を指定します。省略可能です
                               // @return Array: [begne, ... end] `` [begin, ... end] の配列を返します
                               // @raise: Error("BAD_ARG") `` 引数が不正です
                               // @see: Array.range, Number#to
                               // @help: Array#Array.range
                               // @desc: range generator `` 連続した数値の配列を作成します
//{@assert
    Type_allow(begin,  TYPE_NUMBER);
    Type_allow(end,    TYPE_NUMBER);
    Type_allow(filter, TYPE_FUNCTION | TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    return (begin).to(end, filter); // Number#to
}

// Array.isArray
function _Array_isArray_(mix) { // @param Mix: search `` あらゆる型を受け取ります
                                // @return Boolean:   `` 配列なら true を返します
                                // @desc: is Array `` 配列なら true を返します
    return _toString.call(mix) === "[object Array]";
}

// inner toArray
function _toArray(mix) { // @param Array/Primitive
                         // @return Array:
    return _isArray(mix) ? mix : [mix];
}

// Array.toArray
function Array_toArray(source,     // @param Array/FakeArray/Mix: source `` 配列化する元のオブジェクトを指定します
                       sliceBegin, // @param Number(= undefined):        `` 結果の配列をスライスする場合の開始 index 番号を0以上の値で指定します。省略可能です
                       sliceEnd) { // @param Number(= undefined):        `` 結果の配列をスライスする場合の終了 index 番号を指定します。省略可能です
                                   // @return Array: [element, ...]      `` 配列を返します
                                   // @help: Array#Array.toArray
                                   // @desc: Mix to Array + slice `` オブジェクトを配列化します。FakeArray も配列化します
//{@assert
    Type_allow(sliceBegin, TYPE_NUMBER | TYPE_UNDEFINED);
    Type_allow(sliceEnd,   TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    var rv, i, iz, undef, callee = _strictMode ? "" : "callee";

    if (_isArray(source)) {
        rv = source;
    } else if (source[callee] || source.item) {
        for (rv = [], i = 0, iz = source.length; i < iz; ++i) {
            rv[i] = source[i];
        }
    } else {
        rv = [source];
    }
    if (sliceBegin !== undef) {
        rv = sliceEnd !== undef ? rv.slice(sliceBegin, sliceEnd)
                                : rv.slice(sliceBegin);
    }
    return rv;
}

//{@legacy
// Array#map
function Array_map(fn,     // @param Function:
                   that) { // @param this(= undefined): fn this
                           // @return Array: [element, ... ]
                           // @help: Array#Array.prototype.map
//{@assert
    Type_allow(fn, TYPE_FUNCTION);
//}@assert

    var i = 0, iz = this.length, rv = Array(iz);

    for (; i < iz; ++i) {
        if (i in this) {
            rv[i] = fn.call(that, this[i], i, this);
        }
    }
    return rv;
}
//}@legacy

//{@legacy
// Array#some
function Array_some(fn,     // @param Function:
                    that) { // @param this(= undefined): fn this
                            // @return Boolean:
                            // @help: Array#Array.prototype.some
//{@assert
    Type_allow(fn, TYPE_FUNCTION);
//}@assert

    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            if (fn.call(that, this[i], i, this)) {
                return true;
            }
        }
    }
    return false;
}
//}@legacy

//{@legacy
// Array#every
function Array_every(fn,     // @param Function:
                     that) { // @param this(= undefined): fn this
                             // @return Boolean:
                             // @help: Array#Array.prototype.every
//{@assert
    Type_allow(fn, TYPE_FUNCTION);
//}@assert

    var i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            if (!fn.call(that, this[i], i, this)) {
                return false;
            }
        }
    }
    return true;
}
//}@legacy

//{@legacy
// Array#filter
function Array_filter(fn,     // @param Function:
                      that) { // @param this(= undefined): fn this
                              // @return Array: [element, ... ]
                              // @help: Array#Array.prototype.filter
//{@assert
    Type_allow(fn, TYPE_FUNCTION);
//}@assert

    var rv = [], v, i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            v = this[i];
            if (fn.call(that, v, i, this)) {
                rv.push(v);
            }
        }
    }
    return rv;
}
//}@legacy

//{@legacy
// Array#reduce
function Array_reduce(fn,                // @param Function:
                      initialValue,      // @param Mix(= undefined): initial value
                      __reduceRight__) { // @hidden Boolean(= false): true is right
                                         // @return Mix:
                                         // @help: Array#Array.prototype.reduce
//{@assert
    Type_allow(fn, TYPE_FUNCTION);
//}@assert

    var that = this, rv, undef,
        backTrack = !!__reduceRight__,
        usedInitialValue = 0,
        i = backTrack ? --iz : 0,
        iz = that.length;

    if (initialValue === undef) {
        rv = initialValue;
        ++usedInitialValue;
    }

    for (; (backTrack ? i >= 0 : i < iz); (backTrack ? --i : ++i)) {
        if (i in that) {
            if (usedInitialValue) {
                rv = fn(rv, that[i], i, that);
            } else {
                rv = that[i];
                ++usedInitialValue;
            }
        }
    }
    if (!usedInitialValue) {
        throw new Error("BAD_ARG");
    }
    return rv;
}
//}@legacy

//{@legacy
// Array#indexOf
function Array_indexOf(search,      // @param Mix: search element
                       fromIndex) { // @param Number(= 0): from index
                                    // @return Number: found index or -1
                                    // @help: Array#Array.prototype.indexOf
//{@assert
    Type_allow(fromIndex, TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    var i = fromIndex || 0, iz = this.length;

    i = (i < 0) ? i + iz : i;
    for (; i < iz; ++i) {
        if (i in this) {
            if (this[i] === search) {
                return i;
            }
        }
    }
    return -1;
}
//}@legacy

//{@legacy
// Array#forEach
function Array_forEach(fn,     // @param Function:
                       that) { // @param this(= undefined): fn this
                               // @help: Array#Array.prototype.forEach
//{@assert
    Type_allow(fn, TYPE_FUNCTION);
//}@assert

    var i = 0, iz = this.length;

    if (that) {
        for (; i < iz; ++i) {
            if (i in this) {
                fn.call(that, this[i], i, this);
            }
        }
    } else { // [PERF POINT!]
        for (; i < iz; ++i) {
            if (i in this) {
                fn(this[i], i, this);
            }
        }
    }
}
//}@legacy

//{@legacy
// Array#lastIndexOf
function Array_lastIndexOf(search,      // @param Mix: search element
                           fromIndex) { // @param Number(= this.length): from index
                                        // @return Number: found index or -1
                                        // @help: Array#Array.prototype.lastIndexOf
//{@assert
    Type_allow(fromIndex, TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    var i = fromIndex, iz = this.length;

    i = (i < 0) ? i + iz + 1 : iz;
    while (--i >= 0) {
        if (i in this) {
            if (this[i] === search) {
                return i;
            }
        }
    }
    return -1;
}
//}@legacy

//{@legacy
// Array#reduceRight
function Array_reduceRight(fn,             // @param Function:
                           initialValue) { // @param Mix(= undefined): initial value
                                           // @return Mix:
                                           // @help: Array#Array.prototype.reduceRight
//{@assert
    Type_allow(fn, TYPE_FUNCTION);
//}@assert

    return Array_reduce.call(this, fn, initialValue, true);
}
//}@legacy

// Array#or
function Array_or(marge) { // @param Array:            `` 比較対象を配列で指定します
                           // @return Array: new Array `` 両方の配列に存在する要素を持つ新しい配列を返します
                           // @desc: OR operator`` 2つの配列をマージし重複する要素を取り除いた新しい配列を生成します
                           // @help: Array#Array.prototype.or
//{@assert
    Type_allow(marge, TYPE_ARRAY);
//}@assert

    return this.concat(marge).unique();
}

// Array#and
function Array_and(compare) { // @param Array:            `` 比較対象を配列で指定します
                              // @return Array: new Array `` 両方に含まれる要素からなる新しい配列を返します
                              // @desc: AND operator`` 両方の配列に存在する要素からなる新しい配列を生成します
                              // @help: Array#Array.prototype.and
//{@assert
    Type_allow(compare, TYPE_ARRAY);
//}@assert

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

// Array#fill
function Array_fill(value,      // @param Mix(= undefined):                   `` 各要素を上書きする値を指定します
                    beginIndex, // @param Number(= undefined): positive index `` 上書きを開始するindex番号を指定します
                    endIndex) { // @param Number(= undefined): positive index `` 上書きを終了するindex番号を指定します
                                // @return this:                              `` thisを返します
                                // @see: http://www.ruby-lang.org/ja/man/html/Array.html
                                // @help: Array#Array.prototype.fill
                                // @desc: array fill`` 配列の要素を指定した値で上書きします。配列自身を変更します
//{@assert
    Type_allow(beginIndex, TYPE_NUMBER | TYPE_UNDEFINED);
    Type_allow(endIndex,   TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    function _copyDate(value) { // `` Dateをコピーして返します
        return new Date(value);
    }

    function _copyArray(value) { // `` 配列をコピーして返します
        return value.concat();   // @desc: Array#copy()
    }

    function _copyHash(value) {// `` Hashをコピーして返します
        return mm_mix({}, value); // copy
    }

    var i = beginIndex || 0,
        iz = endIndex || this.length, fn;

    switch (Type(value)) {
    case TYPE_DATE:  fn = _copyDate; break;
    case TYPE_ARRAY: fn = _copyArray; break;
    case TYPE_HASH:  fn = _copyHash;
    }
    for (; i < iz; ++i) {
        this[i] = fn ? fn(value) : value;
    }
    return this;
}

// Array#flatten
function Array_flatten() { // @return Array: new Array `` 新しい配列を返します
                           // @desc: `` ネストしている配列を展開し、フラットな新しい配列を返します
                           // @help: Array#Array.prototype.flatten

    function _expand(ary) {
        var i = 0, iz = ary.length, value;

        for (; i < iz; ++i) {
            if (i in ary) {
                value = ary[i];
                _isArray(value) ? _expand(value) // `` 再起呼び出しで配列を展開します
                                : rv.push(value);
            }
        }
    }

    var rv = [];

    _expand(this);
    return rv;
}

// Array#at
function Array_at(format) { // @param String: format `` フォーマット文字列を指定します。フォーマット文字列中の @@ を配列の各要素で置換します
                            // @this: replacement arguments `` "@@" を置換する引数を指定します
                            // @return String: "formatted string" `` 置換後の文字列を返します
                            // @desc: placeholder( "@@" ) replacement `` 配列の各要素を引数として String#at() を実行します
                            // @help: Array#Array.prototype.at
//{@assert
    Type_allow(format, TYPE_STRING);
//}@assert

    var ary = this, i = 0;

    return format.replace(String_at._PATTERN, function() {
        return ary[i++];
    });
}

// Array#has
function Array_has(find) { // @param Mix/MixArray: element(s)
                           // @return Boolean:
                           // @desc: Array has element(s) `` 配列が全ての要素を含んでいると true を返します。
                           // @see String#has, mm.has
                           // @help: Array#Array.prototype.has
    if (!_isArray(find)) {
        return this.indexOf(find) >= 0;
    }

//{@assert
    Type_allow(find, TYPE_ARRAY);
//}@assert

    var i = 0, iz = find.length;

    for (; i < iz; ++i) {
        if (this.indexOf(find[i]) < 0) {
            return false;
        }
    }
    return true;
}

// Array#sum
function Array_sum() { // @return Number: sum
                       // @desc: sum of numeric elements `` 数値や数値とみなせる要素の合計を返します
                       // @help: Array#Array.prototype.sum
    var rv = 0, v, i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            v = parseFloat(this[i]);
            rv += v === v ? v : 0; // isNaN(v) ? v : 0
        }
    }
    return rv;
}

// Array#copy
function Array_copy() { // @return Array: new Array `` コピーした新しい配列を返します
                        // @help: Array#Array.prototype.copy
                        // @desc: copy (shallow copy) `` 配列の浅いコピー(shallow copy)を作成します
    return this.concat();
}

// Array#clip
function Array_clip(beginIndex, // @param Number(= 0):
                    endIndex) { // @param Number(= undefined):
                                // @return Array: [beginIndex, ... , endIndex]
                                // @help: Array#Array.prototype.clip
                                // @desc: clip range `` 開始番号から終了番号まで要素を取り出し配列を返します。引数を何も指定しないと全ての要素のコピーを返し、begin だけを指定すると begin から最後までの全ての要素を返します。
//{@assert
    Type_allow(beginIndex, TYPE_NUMBER | TYPE_UNDEFINED);
    Type_allow(endIndex,   TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    if (endIndex !== void 0) {
        return endIndex < 0 ? this.slice(beginIndex || 0, endIndex)
                            : this.slice(beginIndex || 0, endIndex + 1);
    }
    return this.slice(beginIndex);
}

// Array#hash
function Array_hash(value) { // @param Array/Primitive: [value, ...] or value `` 配列またはプリミティブ値を指定します
                             // @return Hash: { key: value, ... }             `` 生成した Hash を返します
                             // @help: Array#Array.prototype.hash
                             // @desc: make { key: value } pair from array
                             //           `` 現在の配列の各要素をKeyに、メソッドの引数をValueとしてHashを生成します
//{@assert
    Type_allow(value, TYPE_ARRAY | TYPE_PRIMITIVE);
//}@assert

    var rv = {}, i = 0, iz = this.length, j = 0, jz;

    if (_isArray(value)) {
        for (jz = value.length; i < iz; ++i) {
            rv[this[i]] = value[j];
            if (++j >= jz) {
                j = 0;
            }
        }
    } else {
        for (; i < iz; ++i) {
            rv[this[i]] = value;
        }
    }
    return rv;
}

// Array#head
function Array_head(defaultValue) { // @param Mix: default value
                                    // @return Mix: pickuped value or defaultValue
                                    // @help: Array#Array.prototype.head
                                    // @desc: pick a head value (not undefined value)
                                    //    `` 先頭の値(undefined 以外の値)を返します。見つからなければ defaultValue を返します
    var undef, i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            if (this[i] !== undef) {
                return this[i];
            }
        }
    }
    return defaultValue;
}

// Array#tail
function Array_tail(defaultValue) { // @param Mix: default value
                                    // @return Mix: pickuped value or defaultValue
                                    // @help: Array#Array.prototype.tail
                                    // @desc: pick a tail value (not undefined value)
                                    //  `` 末尾の値(undefined 以外の値)を返します。見つからなければ defaultValue を返します
    var undef, i = this.length;

    while (i--) {
        if (i in this) {
            if (this[i] !== undef) {
                return this[i];
            }
        }
    }
    return defaultValue;
}

// Array#only
function Array_only(source) { // @param Array: source array
                              // @return Hash: { only, dup }
                              //    only - Array:
                              //    dup - Array:
                              // @see: mm#mm.only
                              // @help: Array#only
                              // @desc: split only or duplicate elements

//TODO: TEST
    var rv = [], dups = [], i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this && source.indexOf(this[i]) >= 0) { // duplicate
            dups.push(this[i]);
        } else {
            rv.push(this[i]);
        }
    }
    return { only: rv, dup: dups };
}

// Array#swap
function Array_swap(beginIndex, // @param Number: beginning index of element to replace   `` 入れ替える要素の先頭を指定します
                    source) {   // @param Array: element to replace is specified in array `` 入れ替える要素を配列で指定します
                                // @return Array: new array which replaced element is returned `` 要素を入れ替えた新しい配列を返します
                                // @help: Array#Array.prototype.swap
                                // @desc: new array which replaced a part of array is returned
                                //  `` 配列の一部を入れ替えた新しい配列を返します。欠落要素もそのまま置き換えます
//{@assert
    Type_allow(beginIndex, TYPE_NUMBER);
    Type_allow(source,     TYPE_ARRAY);
//}@assert

    var rv = this.concat(), i = beginIndex, j = 0, iz = i + source.length;

    for (; i < iz; ++j, ++i) {
        rv[i] = source[j];
    }
    return rv;
}

//{@test
// Array#test
function Array_test(title, // @param String(= ""): test title
                    arg) { // @param Mix(= undefined): test arg
                           // @see: String#test
                           // @help: Array#Array.prototype.test
                           // @desc: unit test
    "".test(this, title, arg); // call String#test
}
//}@test

// Array#clear
function Array_clear() { // @return this:       `` クリア後の配列を返します
                         // @desc: removes all elements from self `` 配列から全ての要素を削除します。配列自身を変更します
                         // @help: Array#Array.prototype.clear
    this.length = 0;
    return this;
}

// Array#count
function Array_count(find,       // @param Mix(= ""): find key
                     iterator) { // @param Function(= null): iterator(element, index):String
                                 // @return Number/Hash: Number(element count) or { element: count, ... }
                                 // @help: Array#Array.prototype.count
                                 // @desc: count the number of occurrences of an element
                                 //     `` 値の出現回数をカウントします。
                                 //        iteratorが指定されない場合は要素を文字列として比較します
//{@assert
    Type_allow(iterator, TYPE_FUNCTION | TYPE_UNDEFINED);
//}@assert

    iterator = iterator || false;

    var rv = {}, i = 0, iz = this.length, key = "";

    for (; i < iz; ++i) {
        if (i in this) {
            if (iterator) {
                key = iterator(this[i], i);
            } else {
                key = this[i] + "";
            }
            rv[key] ? ++rv[key] : (rv[key] = 1);
        }
    }
    return find ? (rv[find] || 0) : rv;
}

// Array#nsort
function Array_nsort(desc) { // @param Boolean(= false): true is order by descending(99..0)
                             //                          false is order by ascending(0..99)
                             // @return this:
                             // @help: Array#Array.prototype.nsort
                             // @desc: numeric sort
    function ascending(a, b) {
        return a - b;
    }

    function descending(a, b) {
        return b - a;
    }

//{@assert
    Type_allow(desc, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    return this.sort(desc ? descending : ascending);
}

// Array#reject
function Array_reject(find) { // @param Mix/Array/Function(= undefined): reject value, replace logic,
                              //                                         undefined is reject undefined/null
                              // @return new Array:
                              // @help: Array#Array.prototype.reject
                              // @desc: array compaction, trim undefined and null and specified value elements
                              //        配列内の undefined, null, 指定された値を削除した新しい配列を返します
    function _isNaN(v) {
        return v !== v;
    }

    var rv = [], v, i = 0, iz = this.length;

    _isNaN(find) && (find = _isNaN);

    if (find == null) {                 // [].reject(), [].reject(null)
        for (; i < iz; ++i) {
            v = this[i];
            v == null || rv.push(v);
        }
    } else if (Type_isFunction(find)) { // [].reject(fn() { return true; })
        for (; i < iz; ++i) {
            v = this[i];
            v == null || find(v) || rv.push(v);
        }
    } else if (_isArray(find)) {        // [].reject([...])
        for (; i < iz; ++i) {
            v = this[i];
            v == null || find.indexOf(v) >= 0 || rv.push(v);
        }
    } else {                            // [].reject(literal)
        for (; i < iz; ++i) {
            v = this[i];
            v == null || v === find || rv.push(v);
        }
    }
    return rv;
}

// Array#stream
function Array_stream() { // @this - FunctionArray
                          // @return Object: { Number(uid), Function(halt) }
                          // @throws Error("NEED_RETURN")
                          // @see: String#stream
                          // @help: Array#Array.prototype.stream
                          // @desc: create Stream
    return _enumNicknames(this).join(" > ").stream(this);
}

// inner - enum nicknames
function _enumNicknames(ary,      // @param FunctionArray/MixArray:
                        toHash) { // @param Boolean(= false): return Hash
                                  // @return StringArray/Hash:
                                  //           [nickname, key, ...]
                                  //           or { nickname: function, key: value ... }
                                  // @desc: enum function nickname from Array

    var rv = toHash ? {} : [], i = 0, iz = ary.length, key;

    for (; i < iz; ++i) {
        key = Type_isFunction(ary[i]) ? ary[i].nickname(i) : i;
        toHash ? (rv[key] = ary[i])
               : rv.push(key);
    }
    return rv;
}

// Array#unique
function Array_unique() { // @return Array: new Array has unique element(s)
                          //             `` ユニークな要素だけを持つ新しい配列を返します
                          // @help: Array#Array.prototype.unique
                          // @desc: make array from unique elements (trim null, undefined and NaN elements)
                          //        `` 配列の要素を走査し、ユニークな要素だけを持つ新しい配列を生成します
                          //           要素の比較は === 演算子で行います。
                          //           null, undefined, NaN を除去します

    var rv = [], key, value, typedKey, i = 0, j, iz = this.length,
        found, unique = {};

    for (; i < iz; ++i) {
        value = this[i];
        key = "" + value;
        if (value != null && value === value) { // except: null, undefined, NaN
            switch (typeof value) {
            case "boolean":
            case "number":
            case "string":
                typedKey = typeof value + key; // "number123", "stringabc"
                if (!unique[typedKey]) {
                    unique[typedKey] = 1;
                    rv.push(value);
                }
                break;
            default:
                for (found = 0, j = i - 1; !found && j >= 0; --j) {
                    found = (value === this[j]);
                }
                found || (rv.push(value)); // add unique value
            }
        }
    }
    return rv;
}

// Array#average
function Array_average(median) { // @param Boolean(= false): true is median `` ソートした配列の中央の値を採用します
                                 // @return Number: average
                                 // @help: Array#Array.prototype.average
                                 // @desc: average of number elements(arithmetic mean) `` 数値要素の平均値を返します
    function numericSort(a, b) {
        return a - b;
    }

    if (!this.length) {
        return 0;
    }

//{@assert
    Type_allow(median, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    var rv = 0, ary = [], v, i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            v = this[i];
            if (typeof v === "number") {
                rv += v;
                ary.push(v);
            }
        }
    }
    iz = ary.length;

    if (median) {
        // `` 奇数ならソートした中央の値を平均値とし、偶数なら中央の2値の平均を取る
        ary.sort(numericSort);
        rv = iz % 2 ? ary[(iz - 1) / 2]                    // odd  `` 奇数
                    : (ary[iz / 2 - 1] + ary[iz / 2]) / 2; // even `` 偶数
    } else {
        rv /= iz;
    }
    return rv;
}

// Array#replace
function Array_replace(find,    // @param Mix: find value
                       value) { // @param Mix: replace value
                                // @return new Array:
                                // @help: Array#Array.prototype.replace
                                // @desc: replace elements
    var rv = [], v, i = 0, iz = this.length;

    for (; i < iz; ++i) {
        if (i in this) {
            v = this[i];
            rv.push(v === find ? value : v);
        }
    }
    return rv;
}

// Array#shuffle
function Array_shuffle(maxLength) { // @param Number(= undefined): max length
                                    // @return Array: new Array (dense array)
                                    // @help: Array#Array.prototype.shuffle
                                    // @desc: shuffle element(s) `` 要素をシャッフルした新しい配列を返します
//{@assert
    Type_allow(maxLength, TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    var rv = this.clean(), i = rv.length, j, k;

    // Fisher-Yates
    while (--i) {
        j = (Math.random() * (i + 1)) | 0;
        if (i !== j) {
            k     = rv[i];
            rv[i] = rv[j];
            rv[j] = k;
        }
    }
    if (maxLength && rv.length > maxLength) {
        rv.length = maxLength;
    }
    return rv;
}

// Array#addIfNot
function Array_addIfNot(mix) { // @param Mix:
                               // @return this:
                               // @help: Array#Array.prototype.addIfNot
                               // @desc: add value if not exists `` 値が存在しなければ末尾に追加します

    if (this.indexOf(mix) < 0) {
        this.push(mix);
    }
    return this;
}

// Array#removeIf
function Array_removeIf(mix) { // @param Mix:
                               // @return this:
                               // @help: Array#Array.prototype.removeIf
                               // @desc: remove value if exists `` 値が存在すれば削除します
    var index = this.indexOf(mix);

    if (index >= 0) {
        this.splice(index, 1);
    }
    return this;
}

// Array#shiftAll
function Array_shiftAll() { // @return Array: cloned Array
                            // @help: Array#Array.prototype.shiftAll
                            // @desc: shift all elements `` 配列から全ての要素を押し出し配列を返します
    var rv = this.concat();

    this.length = 0;
    return rv;
}

// Number#dd
function Number_dd(digits) { // @param Number(= 2): digits. 1 ~ 8
                             // @return String:
                             // @help: Number#Number.prototype.dd
                             // @desc: convert to decimal digits
    digits = digits || 2;

    return (((this + Math.pow(10, digits)) | 0) + "").slice(-digits);
}

// Number#hh
function Number_hh(digits) { // @param Number(= 2): digits. 1 ~ 8
                             // @help: Number#Number.prototype.hh
                             // @desc: convert to decimal digits
    digits = digits || 2;

    return ((this + Math.pow(16, digits)) | 0).toString(16).slice(-digits);
}

// Number#to
function Number_to(end,      // @param Number: end `` 終了番号を数値で指定します。戻り値にはendで指定した終了番号が含まれます
                   filter) { // @param Function/Number(= 1): filter or skip number `` フィルター関数またはスキップ数を指定します。省略可能です
                             // @return Array: [begne, ... end] `` [begin, ... end] の配列を返します
                             // @raise: Error("BAD_ARG") `` 引数が不正です
                             // @see: Array.range, Number#to
                             // @help: Number#Number.prototype.to
                             // @desc: range to `` 連続した数値の配列を作成します
//{@assert
    Type_allow(end,    TYPE_NUMBER);
    Type_allow(filter, TYPE_FUNCTION | TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    var rv = [], ri = 0, begin = +this, i = begin, iz = end, skip = 1,
        filterType = typeof filter,
        reverse = false;

    if (begin > end) { // 100..to(0) -> [100, ... 0]
        i = end;
        iz = begin;
        reverse = true;
    }

    if (filterType === "function") {
        for (; i <= iz; ++i) {
            if (filter(i) === true) { // `` filter が true が返すと index を採用します
                rv[ri++] = i;
            }
        }
        return reverse ? rv.reverse() : rv;
    }
    if (filterType === "number") {
        skip = filter;
    }
    if (skip <= 0 ||
        end >= 2147483647) { // [!] array index over flow
        // new Array(2147483647) in [IE6][IE7][IE8] problem
        // http://msdn.microsoft.com/en-us/library/gg622936(v=VS.85).aspx
        //  - Internet Explorer 9 Handles Array Elements
        //    with a Large Index Differently
        //
        throw new Error("BAD_ARG");
    }
    for (; i <= iz; i += skip) {
        rv[ri++] = i;
    }
    return reverse ? rv.reverse() : rv;
}

// Number#uid
function Number_uid() { // @return Number: unique number, at 1 to 0x1fffffffffffff
                        //   `` 1から順に0x1fffffffffffffまでの値を返します。0x1fffffffffffffを超えた場合は、再び1に戻ります
                        // @help: Number#Number.prototype.uid
                        // @desc: get unique number `` ユニークな数値を返します
                        //         1..uid() -> mm.Class
                        //         2..uid() -> mm.anime
                        //         3..uid() -> String#stream
    var db = Number_uid._db,
        n = +this | 0;

    db[n] || (db[n] = 0);

    // IEEE754 fraction size. 0x1fffffffffffff = Math.pow(2, 53) - 1
    if (++db[n] >= 0x1fffffffffffff) {
        // overflow `` IEEE754で正しく表現できる限界を超えたら1に戻します
        db[n] = 1;
    }
    return db[n];
}
Number_uid._db = [];

// Number#xor
function Number_xor(b) { // @param Number:
                         // @return Number:
                         // @help: Number#Number.prototype.xor
                         // @desc: A xor B
    return (this ^ b) >>> 0;
}

// Number#clip
function Number_clip(min,   // @param Number: min (or max) `` 最小値の指定です。こちらに最大値を指定することもできます
                     max) { // @param Number: max (or min) `` 最大値の指定です。こちらに最小値を指定することもできます
                            // @return Number: min <= number <= max `` 最小値以上で最大値以下に丸めた数値を返します
                            // @see: Number#within
                            // @help: Number#Number.prototype.clip
                            // @desc: clipping value `` 値を min, max で指定された範囲に丸めます。max と min を逆に指定しても動作します
//{@assert
    Type_allow(min, TYPE_NUMBER);
    Type_allow(max, TYPE_NUMBER);
//}@assert

    var val = +this;

    return min > max ? (val < max ? max : val > min ? min : val) // max <-> min
                     : (val < min ? min : val > max ? max : val);
}

// Number#diff
function Number_diff(rhs) { // @param Date/Number: other date
                            // @return Number/Object: { d, days,  h, hours,  i, minutes,
                            //                          s, seconds,  ms, milliseconds,
                            //                          toString }
                            // @see: Date#diff
                            // @help: Number#Number.prototype.diff
                            // @desc: diff(num, num) or diff(date, num)
//{@assert
    Type_allow(rhs, TYPE_DATE | TYPE_NUMBER);
//}@assert

    return Type_isNumber(rhs) ? Math.abs(this - rhs)
                              : _diffDate(this, rhs);
}

// Number#lazy
function Number_lazy(that,              // @param this:
                     callback           // @param Function: callback
                     /*, var_args */) { // @param Mix(= undefined): callback(var_args) `` コールバック関数の引数を指定します
                                        // @return Number: atom (setTimeout timer id)
                                        // @help: Number#Number.prototype.lazy
                                        // @desc: lazy callback function `` 一定時間待機後に別スレッドで関数を呼び出します
//{@assert
    Type_allow(callback, TYPE_FUNCTION);
//}@assert

    var args = _slice.call(arguments, 2);

    return setTimeout(function() {
                callback.apply(that || null, args);
            }, this * 1000);
}

// Number#times
function Number_times(that,              // @param this:
                      callback           // @param Function: callback
                                         //          callback(var_args ... , num); num at 0
                                         // `` コールバック関数を指定します。
                                         //    コールバックの最後の引数は呼び出し回数です。呼び出し回数は0から始まります
                      /*, var_args */) { // @param Mix(= undefined): iterator(, arg) `` コールバック関数の引数を指定します
                                         // @return MixArray: iterator results       `` コールバック関数の戻り値を配列で返します
                                         // @see: Array#map
                                         // @help: Number#Number.prototype.times
                                         // @desc: n times iterator function `` 関数を何度か呼び出し、呼び出し結果の配列を返します
//{@assert
    Type_allow(callback, TYPE_FUNCTION);
//}@assert

    var rv = [], i = 0, iz = +this | 0,
        args = _slice.call(arguments, 2),
        last = args.length;

    if (iz > 0) {
        for (; i < iz; ++i) {
            args[last] = i; // add last arg
            rv.push(callback.apply(that || null, args));
        }
    }
    return rv;
}

// Number#within
function Number_within(min,   // @param Number: min (or max) `` 最小値の指定です。こちらに最大値を指定することもできます
                       max) { // @param Number: max (or min) `` 最大値の指定です。こちらに最小値を指定することもできます
                              // @return Boolean:            `` 最小値以上で最大値以下なら true を返します
                              // @see: Number#clip
                              // @help: Number#Number.prototype.within
                              // @desc: within values  `` 値が min 以上で max 以下なら true を返します。max と min を逆に指定することもできます
//{@assert
    Type_allow(min, TYPE_NUMBER);
    Type_allow(max, TYPE_NUMBER);
//}@assert

    var val = +this;

    return min > max ? (val >= max && val <= min) // max <-> min
                     : (val >= min && val <= max);
}

// Date.now
function Date_now() { // @return Number: milli seconds
                      // @help: Date#Date.now
                      // @desc: get current time `` 現在時刻を返します
    return +new Date();
}

// Date.from
function Date_from(source) { // @param Date/String/Number(= undefined):
                             // @return: { Y, M, D, h, m, s, ms, time, toJSON(), toString() }
                             //    Y - Number: FullYear (1970 ~)
                             //    M - Number: Month (1 ~ 12)
                             //    D - Number: Days (1 ~ 31)
                             //    h - Number: Hours (0 ~ 23)
                             //    m - Number: Minutes (0 ~ 59)
                             //    s - Number: Seconds (0 ~ 59)
                             //    ms - Number: Milliseconds (0 ~ 99)
                             //    time - Number: Milliseconds (time_t)
                             //    date - Date: Date Object
                             //    toJSON():String - return ISODateString
                             //    toString():String - return GenericDateString
                             // @help: Date#Date.from
                             // @desc: parse date string
                             //     `` 日付文字列をパースし { Y, M, D, h, m, s, ms, time, toJSON(), toString() } を返します
//{@assert
    Type_allow(source, TYPE_DATE | TYPE_STRING | TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    function toJSON() { // @return ISODateString: "2000-01-01T00:00:00.00"
        return rv.date.toJSON();
    }
    function toString() { // @return GenericDateString: "2000-01-01 00:00:00"
        return rv.date.toJSON().slice(0, 19).replace("T", " "); // trim ms
    }

    var rv = {}, type = Type(source), date;

    date = source === void 0    ? new Date
         : type === TYPE_DATE   ? new Date(source)
         : type === TYPE_NUMBER ? new Date(new Date(source))
         : new Date(_dateFromString(source) || new Date(source));

    if (date === void 0) {
        date = new Date;
    }
    // --- static properties and methods ---
    rv.Y = date.getUTCFullYear();
    rv.M = date.getUTCMonth() + 1;
    rv.D = date.getUTCDate();
    rv.h = date.getUTCHours();
    rv.m = date.getUTCMinutes();
    rv.s = date.getUTCSeconds();
    rv.ms = date.getUTCMilliseconds();
    rv.time = date.getTime();
    rv.date = new Date(rv.time);
    rv.toJSON = toJSON;
    rv.toString = toString;
    return rv;
}

// inner - _dateFromString - from GMT or ISO8601 string
function _dateFromString(str) { // @param ISO8601DateString/RFC1123DateString:
                                // @return Date:

    //  _dateFromString("2000-01-01T00:00:00Z")          -> Date
    //  _dateFromString("2000-01-01T00:00:00.000Z")      -> Date
    //  _dateFromString("Wed, 16 Sep 2009 16:18:14 GMT") -> Date
    var parseDateString =
                /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:\.(\d*))?Z$/,
                // [1]y    [2]m   [3]d   [4]h   [5]m   [6]s       [7]ms
        m = parseDateString.exec(str), date;

    if (m) {
        date = m[7] ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6], +m[7])
                    : Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
        return new Date(date);
    }
    return new Date(str);
}

// Date#diff
function Date_diff(rhs) { // @param Date/Number: other date
                          // @return Object: { d, days,  h, hours,  i, minutes,
                          //                   s, seconds,  ms, milliseconds,
                          //                   toString }
                          // @see: Number#diff
                          // @help: Date#Date.prototype.diff
                          // @desc: diff(date, num) or diff(date, date)
//{@assert
    Type_allow(rhs, TYPE_DATE | TYPE_NUMBER);
//}@assert

    return _diffDate(this, rhs);
}

// inner - diff date
function _diffDate(lhs,   // @param Number/Date:
                   rhs) { // @param Number/Date:
                          // @return Object: { d, days,  h, hours,  i, minutes,
                          //                   s, seconds,  ms, milliseconds,
                          //                   toString }
    function _toString() {
        var rv = "";

        d && (rv += d + "/");
        (d || h)      && (rv += (h < 9 ? "0" : "") + h + ":");
        (d || h || i) && (rv += (i < 9 ? "0" : "") + i + ":");

        return rv + (s  <  9 ? "0" : "") + s + "." +
                    (ms < 99 ? "0" : "") +
                    (ms <  9 ? "0" : "") + ms;
    }

    var span = Math.abs(lhs - rhs), // ms
        ms = span % 1000,
        s = (span / 1000) | 0, d, h, i;

    d = (s / 86400) | 0; // days
    s -= d * 86400;
    h = (s / 3600) | 0;  // hours
    s -= h * 3600;
    i = (s / 60) | 0;    // minutes
    s -= i * 60;
    s |= 0;
    return { span: span,
             d: d, days: d,
             h: h, hours: h,
             i: i, minutes: i,
             s: s, seconds: s,
             ms: ms, milliseconds: ms,
             toString: _toString };
}

// Date#format
function Date_format(format) { // @param String: Date#format("Y-M-D h:m:s.ms")
                               // @return String: formated date string
                               // @help: Date#Date.prototype.format
                               // @desc: format date
    var rv = [], now = Date.from(this),
        ary = format.split(""), i = 0, iz = ary.length;

    for (; i < iz; ++i) {
        switch (ary[i]) {
        case "Y": rv.push(now.Y); break;
        case "M": rv.push(now.M < 10 ? ("0" + now.M) : now.M); break;
        case "D": rv.push(now.D < 10 ? ("0" + now.D) : now.D); break;
        case "h": rv.push(now.h < 10 ? ("0" + now.h) : now.h); break;
        case "m": if (ary[i + 1] === "s") {
                    ++i;
                    rv.push(("00" + now.ms).slice(-3));
                    break;
                  }
                  rv.push(now.m < 10 ? ("0" + now.m) : now.m); break;
        case "s": rv.push(now.s < 10 ? ("0" + now.s) : now.s); break;
        case "I": rv.push(now.toString()); break; // ISO 8601
        case "t": rv.push(now.time); break;
        default:  rv.push(ary[i]);
        }
    }
    return rv.join("");
}

// Date#toJSON
function Date_toJSON() { // @return String: "2000-01-01T00:00:00.000Z"
                         // @help: Date#Date.prototype.toJSON
                         // @desc: Date.toJSON
    var date = this,
        z = "0",
        m = date.getUTCMonth() + 1,
        d = date.getUTCDate(),
        h = date.getUTCHours(),
        min = date.getUTCMinutes(),
        sec = date.getUTCSeconds();

    return date.getUTCFullYear() + "-" +
           (m < 10 ? z + m : m) + "-" +
           (d < 10 ? z + d : d) + "T" +
           (h < 10 ? z + h : h) + ":" +
           (min < 10 ? z + min : min) + ":" +
           (sec < 10 ? z + sec : sec) + "." +
           ("00" + date.getUTCMilliseconds()).slice(-3) + "Z";
}

// Date#within
function Date_within(min,   // @param Date/Number: min (or max) `` 最小値の指定です。こちらに最大値を指定することもできます
                     max) { // @param Date/Number: max (or min) `` 最大値の指定です。こちらに最小値を指定することもできます
                            // @return Boolean:                 `` 最小値以上で最大値以下なら true を返します
                            // @see: Number#within
                            // @help: Date#Date.prototype.toJSON
                            // @desc: within values
                            //     `` 値が min 以上で max 以下なら true を返します。max と min を逆に指定することもできます
//{@assert
    Type_allow(min, TYPE_NUMBER | TYPE_DATE);
    Type_allow(max, TYPE_NUMBER | TYPE_DATE);
//}@assert

    var val = +this,
        a = +min,
        b = +max;

    return a > b ? (val >= b && val <= a) // max <-> min
                 : (val >= a && val <= b);
}

// RegExp#match
function RegExp_match(str,            // @param String:
                      defaultValue) { // @param String/StringArray:
                                      // @return Array:
                                      // @help: RegExp#RegExp.prototype.match
                                      // @see: RegExp#exec, String#match
                                      // @desc: returns an array with the results of the RegExp#exec. returns the defaultValue if no match
                                      //     `` RegExp#exec の結果を配列で返します。マッチしなければ defaultValue を返します
//{@assert
    Type_allow(str, TYPE_STRING);
//}@assert

    var match = this.exec(str);

    if (!match) {
        return _isArray(defaultValue) ? defaultValue
                                      : [null, defaultValue];
    }
    return match;
}

// Function.pao
function Function_pao(arg) { // @param Mix:
                             // @return Function:
                             // @help: Function#Function.pao
                             // @desc: `function-producing` function

    return function() {
        return arg;
    };
}

// Function#bind
function Function_bind(context                 // @param that: context
                       /*, var_args, ... */) { // @param Mix: arguments
                                               // @return Function:
                                               // @help: Function#Function.prototype.bind
                                               // @see: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
    var rv, that = this,
        args = _slice.call(arguments, 1), // IE safe
        fn = function() {};

    rv = function() {
        return that.apply(this instanceof fn ? this : context,
                    Array[prototype].concat.call(args, _slice.call(arguments)));
    };
    fn[prototype] = that[prototype];
    rv[prototype] = new fn();
    return rv;
}

// Function#help
function Function_help() { // @help: Function#Function.prototype.help
                           // @desc: show help url
    var help = /@help: ([^\n]*)\n/.exec("\n" + this),
        home = "http://code.google.com/p/mofmof-js/wiki/",
        url = "";

    if (help) {
        url = (help[1].indexOf("http:") ? home : "") + help[1];
    }
    return url + "\n\n" + this + "\n\n" + url;
}

// Function#nickname
function Function_nickname(defaultName) { // @param String(= ""): default nickname
                                          // @return String: "name" of function, or ""
                                          // @help: Function#Function.prototype.nickname
                                          // @desc: get function name or nickname `` 関数名やあだ名を取得します
                                          //        取得出来ない場合は空文字列を返します
    return (this.name ||
           (this + "").split("(" /*)*/ )[0].trim().slice(9)) || defaultName; // [IE][Opera<11]
}

//{@legacy
// JSON.parse
function JSON_parse(jsonString) { // @param JSONString:
                                  // @return Mix:
                                  // @raise: Error("SYNTAX_ERROR")
                                  // @help: JSON#JSON.parse
                                  // @desc: decode from JSONString
//{@assert
    Type_allow(jsonString, TYPE_STRING);
//}@assert

    var str = jsonString.trim(),
        unescaped = str.replace(JSON_parse._UNESCAPE, ""),
        code = "return " + str;

    if (JSON_parse._INVALID.test(unescaped)) {
        throw new Error("SYNTAX_ERROR");
    }
    return (new Function(code))(); // raise error
}
JSON_parse._UNESCAPE = /"(\\.|[^"\\])*"/g;
JSON_parse._INVALID  = /[^,:{}\[\]0-9\.\-+Eaeflnr-u \n\r\t]/;
//}@legacy

//{@legacy
// JSON.stringify
function JSON_stringify(source,   // @param Mix:
                        replacer, // @param Function(= undefined): NOT_IMPL
                        spaces) { // @param String/Number(= 0): NOT_IMPL
                                  // @return JSONString:
                                  // @see: http://developer.mozilla.org/En/Using_native_JSON
                                  // @help: JSON#JSON.stringify
                                  // @desc: encode to JSONString
//{@assert
    Type_allow(replacer, TYPE_FUNCTION | TYPE_UNDEFINED);
    Type_allow(spaces,   TYPE_STRING   | TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    return _JSON_stringify(source, replacer, spaces);
}
//}@legacy

//{@legacy
// inner - json inspect
function _JSON_stringify(mix) { // @param Mix: value
                                // @return String:
    var rv = [], ary, key, i, iz,
        leftBracket = "{", rightBracket = "}";

    if (mix === null) {
        return "null";
    }
    if (mix === void 0) {
        return "undefined";
    }
    if (mix.toJSON) { // Boolean, Number, String, Date
        return mix.toJSON();
    }
    if (mix.nodeType || Type_isRegExp(mix)) { // Node or RegExp
        // http://twitter.com/uupaa/statuses/81336979580661760
        return "{}";
    }
    if (_isArray(mix)) {
        leftBracket  = "[";
        rightBracket = "]";
        for (i = 0, iz = mix.length; i < iz; ++i) {
            rv.push(_JSON_stringify(mix[i]));
        }
    } else { // isHash or other type
        ary = _keys(mix); // uupaa-looper

        for (i = 0, iz = ary.length; i < iz; ++i) {
            key = ary[i];
            rv.push('"' + key + '":' + _JSON_stringify(mix[key]));
        }
    }
    return leftBracket + rv.join(",") + rightBracket; // "{...}" or "[...]"
}
//}@legacy

// === FUTURE ============================================

// Function#every
function Function_every(times,  // @param Number: times
                        tick) { // @param Function(= null): tick callback({ args, ok, state })
                                // @this: callback({ args, ok, state })
                                // @return FutureInstance:
                                // @help: Future#Future.prototype.every
                                // @desc: create Future instance
                                //    callback.args - obj.pass(arg), obj.miss(arg) collections. [arg, ...]
                                //    callback.ok - Boolean: true is callback.state === 200
                                //    callback.state - Number: 200(success), 400(error)

//{@assert
    Type_allow(times, TYPE_NUMBER);
    if (times <= 0) {
        throw new Error("BAD_ARG");
    }
//}@assert

    return new Future(false, times, 0, this, tick);
}

// Function#some
function Function_some(numerator,   // @param Number: numerator
                       denominator, // @param Number: max count
                       tick) {      // @param Function(= null): tick callback({ ok, args, state })
                                    // @this: callback({ args })
                                    // @return FutureInstance:
                                    // @help: Future#Future.prototype.some
                                    // @desc: create Future instance
                                    //    callback.args - obj.pass(arg), obj.miss(arg) collections. [arg, ...]
                                    //    callback.ok - Boolean: true is callback.state === 200
                                    //    callback.state - Number: 200(success), 400(error)

//{@assert
    Type_allow(numerator,   TYPE_NUMBER);
    Type_allow(denominator, TYPE_NUMBER);
    if (numerator > denominator || numerator <= 0 || denominator <= 0) {
        throw new Error("BAD_ARG");
    }
//}@assert

    return new Future(true, numerator, denominator, this, tick);
}

// Class Future
function Future(some,     // @param Boolean: true is some, false is every
                num1,     // @param Number: every = times, some = numerator
                num2,     // @param Number: every = 0,     some = denominator
                callback, // @param Function: callback({ ok, args, state })
                tick) {   // @param Function(= null): tick callback({ args })
    this._db = {
        some:  some,
        num:   some ? num1 : 0, // Number: some - numerator
        den:   some ? num2 : 0, // Number: some - denominator
        times: some ? 0 : num1, // Number: every - times
        pass:  0,               // Number: pass() called count
        miss:  0,               // Number: miss() called count
        state: 100,             // Number: 100(continue) or 200(success) or 400(error)
        args:  [],              // Array:  pass(arg), miss(arg) collections
        tick:  tick || null,
        callback: callback
    };
}

Future[prototype] = {
    pass:   Future_pass,
    miss:   Future_miss,
    state:  Future_state
};

// Future#pass
function Future_pass(value) { // @param Mix(= undefined): value
                              // @return this:
                              // @help: Future#Future.pass
                              // @desc: pass a process
    ++this._db.pass;
    this._db.args.push(value);
    Future_judge(this);
    return this;
}

// Future#miss
function Future_miss(value) { // @param Mix(= undefined): value
                              // @return this:
                              // @help: Future#Future.miss
                              // @desc: miss a process
    ++this._db.miss;
    this._db.args.push(value);
    Future_judge(this);
    return this;
}

// Future#state
function Future_state() { // @return Number: current state,
                          //                 100 is continue,
                          //                 200 is success,
                          //                 400 is error
                          // @help: Future#Future.state
                          // @desc: get current state

    return this._db.state; // `` 現在のステータスを返します。未完了で100, 正常終了で200, 失敗で400 になります
}

// inner - judge future
function Future_judge(that) { // @param this: Future instance

    var db = that._db, state = db.state, result = null;

    if (state === 100) {
        if (!db.some) {

            // --- every ---
            if (db.miss > 0) { // `` every は全て成功で成功になるため、一度でもmissが呼ばれていると失敗になります
                state = 400; // <- future.every(2).miss()
            } else if (db.pass >= db.times) { // `` timesの値(繰り返し回数)以上pass()が呼ばれていれば成功になります
                state = 200; // <- future.every(2).pass().pass()
            }
        } else if (db.some) {

            // --- some ---
            if (db.pass >= db.num) { // `` some {分子}/{分母} の分子の値(num)以上pass()が呼ばれていると成功になります
                state = 200; // <- future.some(1, 3).pass()
            } else if (db.miss > db.den - db.num) { // `` miss()の呼び出し回数が、許容数(分母 - 分子)より大きければ失敗になります
                state = 400; // <- future.some(1, 3).miss().miss().miss()
                             // <- fail (miss:3 > den:3 - num:1)
            }
        }
    }
    // make callback result
    result = { ok: state === 200, args: db.args, state: state };

    db.tick && db.tick(result); // tick callback

    if (state > 100) { // change state?
        if (db.callback) {
            db.callback(result); // end callback
            db.callback = db.tick = null; // avoid duplicate callback `` コールバック関数を無効化します
        }
        db.state = state;
    }
}

// === URL =================================================

//{@url
// mm.url
function mm_url(url) { // @param URLHash/URLString(= ""): "https://..."
                       // @return URLString/URLHash:
                       // @help: URL#mm.url
                       // @desc: url accessor
//{@assert
    Type_allow(url, TYPE_STRING | TYPE_HASH | TYPE_UNDEFINED);
//}@assert

    return !url ? mm_url_resolve()
         : Type_isString(url) ? _mm_url_parse(url)
                              : _mm_url_build(url);
}
mm_url._SCHEMES = /^(https?|file|wss?):/; // http/https/file/ws/wss
mm_url._PATH_FRAGMENT = /^([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?/;
                        //  /dir/f.ext   key=value    hash
                        //  [1]          [2]          [3]
mm_url._FILE_SCHEME   = /^(file:)\/{2,3}(?:loc\w+)?([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?/i;
                        //                 localhost /dir/f.ext ?key=value    #hash
                        //  [1]                      [2]        [3]          [4]
mm_url._HTTP_SCHEME   = /^(\w+:)\/\/((?:([\w:]+)@)?([^\/:]+)(?::(\d*))?)([^ ?#]*)(?:(\?[^#]*))?(?:(#.*))?/;
                        //  https://    user:pass@    server   :port    /dir/f.ext  ?key=value     #hash
                        //  [1]         [3]           [4]       [5]     [6]         [7]            [8]
//}@url

//{@url
// mm.url.encode
function mm_url_encode(str,      // @param String:
                       compat) { // @param Boolean(= false): true is encodeURIComponent compatible
                                 // @return String: percent encoded string
                                 // @see: http://www.ipa.go.jp/security/fy21/reports/tech1-tg/b_09.html
                                 // @help: URL#mm.url.encode
                                 // @desc: encode symbol in string. like encodeURIComponent
                                 //        `` [a-zA-Z0-9_]以外の文字を全て%xxに変換します。
                                 //           compat = true で encodeURIComponent 互換になります

    if (global.encodeURIComponent && compat) {
        return global.encodeURIComponent(str);
    }

//{@assert
    Type_allow(str,    TYPE_STRING);
    Type_allow(compat, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    compat = compat || false;

    var rv = [], i = 0, iz = str.length, c = 0,
        safe, // w = /[a-zA-Z0-9_]/
        hash = mm_hash_table("number", "hex2");

    for (; i < iz; ++i) {
        c = str.charCodeAt(i);

        if (c < 0x80) { // encode ASCII(0x00 ~ 0x7f)
            safe = c === 95 ||              // _
                   (c >= 48 && c <=  57) || // 0~9
                   (c >= 65 && c <=  90) || // A~Z
                   (c >= 97 && c <= 122);   // a~z

            if (!safe && compat) {
                safe = c === 33  || // !
                       c === 45  || // -
                       c === 46  || // .
                       c === 126 || // ~
                       (c >= 39 && c <= 42); // '()*
            }
            if (safe) {
                rv.push(str.charAt(i));
            } else {
                rv.push("%", hash[c]);
            }
        } else if (c < 0x0800) { // encode UTF-8
            rv.push("%", hash[((c >>>  6) & 0x1f) | 0xc0],
                    "%", hash[ (c         & 0x3f) | 0x80]);
        } else if (c < 0x10000) { // encode UTF-8
            rv.push("%", hash[((c >>> 12) & 0x0f) | 0xe0],
                    "%", hash[((c >>>  6) & 0x3f) | 0x80],
                    "%", hash[ (c         & 0x3f) | 0x80]);
        }
    }
    return rv.join("");
}
//}@url

//{@url
// mm.url.decode
function mm_url_decode(str) { // @param String: percent encoded string
                              // @return String:
                              // @throws: Error("BAD_ARG")
                              // @help: URL#mm.url.decode
                              // @desc: decode string. like decodeURIComponent
                              //        `` %xx 形式の文字列をデコードします
                              //           decodeURIComponent 互換です

    if (global.decodeURIComponent) {
        return global.decodeURIComponent(str);
    }

//{@assert
    Type_allow(str, TYPE_STRING);
//}@assert

    return str.replace(/(%[0-9a-f][0-9a-f])+/g, function(match) {
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
            } else if (a < 0xe0) {
                b = parseInt(ary[++i], 16);
                rv.push((a & 0x1f) <<  6 | (b & 0x3f));
            } else if (a < 0xf0) {
                b = parseInt(ary[++i], 16);
                c = parseInt(ary[++i], 16);
                rv.push((a & 0x0f) << 12 | (b & 0x3f) << 6
                                         | (c & 0x3f));
            }
        }
        return String.fromCharCode.apply(null, rv);
    });
}
//}@url

//{@url
// mm.url.resolve
function mm_url_resolve(url) { // @param URLString(= ""): relative URL or absolute URL
                               // @return URLString: absolute URL
                               // @help: URL#mm.url.resolve
                               // @desc: convert relative URL to absolute URL
//{@assert
    Type_allow(url, TYPE_STRING | TYPE_UNDEFINED);

    if (!document) {
        throw new Error("BAD_LOCATION");
    }
//}@assert

    url = url || "";
    if (!url && _location) {
        return _location.href; // current URL
    }
    if (url && mm_url._SCHEMES.test(url)) { // is absolute url?
        return url;
    }
    // convert relative url to absolute url
    var a = document.createElement("a");

    a.setAttribute("href", url);    // <a href="hoge.htm">
    return a.cloneNode(false).href; // -> "http://example.com/hoge.htm"
}
//}@url

//{@url
// inner - build URL
function _mm_url_build(hash) { // @param URLHash/Hash: need { protocol, host, pathname, search, fragment }
                               // @return URLString: "{protocol}//{host}{pathname}?{search}#{fragment}"

//{@assert
    Type_allow(hash, TYPE_HASH);
//}@assert

    //  mm.url({ protocol: "http:",
    //           host:     "user:pass@example.com:8080",
    //           pathname: "/dir1/dir2/file.ext",
    //           search:   "a=b&c=d",
    //           fragment: "fragment" })
    //
    //      -> "http://user:pass@example.com:8080/dir1/dir2/file.ext?a=b&c=d#fragment"
    var slash =  hash.protocol ? (hash.protocol === "file:" ? "///"
                                                            : "//") : "";

    return [hash.protocol, slash,
            hash.host     || "",
            hash.pathname || "/",
            hash.search   || "",
            hash.fragment || ""].join("");
}
//}@url

//{@url
// inner - parse URL
function _mm_url_parse(url) { // @param URLString: abs or rel,
                              //                   "http://user:pass@example.com:8080/dir1/dir2/file.ext?a=b&c=d#fragment"
                              // @return URLHash: { href, protocol, scheme, secure, host,
                              //                    auth, hostname, port, pathname, dir, file,
                              //                    search, query, fragment, ok }
                              //     href     - String: "http://user:pass@example.com:8080/dir1/dir2/file.ext?a=b;c=d#fragment"
                              //     protocol - String: "http:"
                              //     scheme   - String: "http:"
                              //     secure   - Boolean: false
                              //     host     - String: "user:pass@example.com:8080". has auth
                              //     auth     - String: "user:pass"
                              //     hostname - String: "example.com"
                              //     port     - Number: 8080
                              //     pathname - String: "/dir1/dir2/file.ext"
                              //     dir      - String: "/dir1/dir2"
                              //     file     - String: "file.ext"
                              //     search   - String: "?a=b&c=d"
                              //     query    - URLQueryHash: { a: "b", c: "d" }
                              //     fragment - String: "#fragment"
                              //     ok       - Boolean: true is valid url

    function _extends(hash) { // @param URLHash:
                              // @return URLHash:
        var ary = hash.pathname.split("/");

        hash.href       = hash.href     || "";
        hash.protocol   = hash.protocol || "";
        hash.scheme     = hash.protocol;        // [alias]
        hash.secure     = hash.secure   || false;
        hash.host       = hash.host     || "";
        hash.auth       = hash.auth     || "";
        hash.hostname   = hash.hostname || "";
        hash.port       = hash.port     || 0;
        hash.pathname   = hash.pathname || "";
        hash.file       = ary.pop();
        hash.dir        = ary.join("/") + "/";
        hash.search     = hash.search   || "";
        hash.query      = mm_url_parseQuery(hash.search);
        hash.fragment   = hash.fragment || "";
        hash.ok         = hash.ok       || true;
        return hash;
    }

//{@assert
    Type_allow(url, TYPE_STRING);
//}@assert

    var m, ports = { "http:": 80, "https": 443, "ws:": 81, "wss:": 816 };

    m = mm_url._FILE_SCHEME.exec(url);
    if (m) {
        return _extends({
            href:       url,
            protocol:   m[1],
            pathname:   m[2],
            search:     m[3],
            fragment:   m[4]
        });
    }

    m = mm_url._HTTP_SCHEME.exec(url);
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

    m = mm_url._PATH_FRAGMENT.exec(url);
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
        ok:         false
    });
}
//}@url

//{@url
// mm.url.normalize
function mm_url_normalize(url) { // @param URLString:
                                 // @return URLString:
                                 // @help: URL#mm.url.normalize
                                 // @desc: path normalize
//{@assert
    Type_allow(url, TYPE_STRING);
//}@assert

    var rv = [],
        path,
        dots = /^\.+$/,
        hash = _mm_url_parse(url),
        dirs = hash.dir.split("/"),
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
    path = ("/" + rv.join("/") + "/").replace(/\/+/g, "/");

    hash.pathname = path + hash.file;
    return _mm_url_build(hash); // rebuild
}
//}@url

//{@url
// mm.url.buileQuery
function mm_url_buildQuery(hash,    // @param URLQueryHash: { key1: "a", key2: "b", key3: [0, 1] }
                           joint) { // @param String(= "&"): joint string "&" or "&amp;" or ";"
                                    // @return URLQueryString: "key1=a&key2=b&key3=0&key3=1"
                                    // @help: URL#mm.url.buileQuery
                                    // @desc: build query string
//{@assert
    Type_allow(hash,  TYPE_HASH);
    Type_allow(joint, TYPE_STRING | TYPE_UNDEFINED);
//}@assert

    joint = joint || "&";

    var rv = [], i, j, jz, key, value;

    for (i in hash) {
        key   = mm_url_encode(i, true);
        value = hash[i];

        if (_isArray(value)) {
            for (j = 0, jz = value.length; j < jz; ++j) {
                rv.push(key + "=" + mm_url_encode(value[j], true)); // "key3=0;key3=1"
            }
        } else { // value is Literal
            rv.push(key + "=" + mm_url_encode(value, true)); // "key1=a;key2=b"
        }
    }
    return rv.join(joint); // "key1=a;key2=b;key3=0;key3=1"
}
//}@url

//{@url
// mm.url.parseQuery
function mm_url_parseQuery(query) { // @param URL/URLQueryString: "key1=a;key2=b;key3=0;key3=1"
                                    // @return URLQueryHash: { key1: "a", key2: "b", key3: ["0", "1"] }
                                    // @help: URL#mm.url.parseQuery
                                    // @desc: parse query string
    function _parse(_, key, value) {
        var k = mm_url_decode(key),
            v = mm_url_decode(value);

        if (rv[k]) {
            if (_isArray(rv[k])) {
                rv[k].push(v);
            } else {
                rv[k] = [rv[k], v];
            }
        } else {
            rv[k] = v;
        }
        return "";
    }

//{@assert
    Type_allow(query, TYPE_STRING);
//}@assert

    var rv = {};

    if (query.indexOf("?") >= 0) {
        query = query.split("?")[1].split("#")[0];
    }
    query.replace(/&amp;|&|;/g, ";"). // "&amp;" or "&" or ";" -> ";"
          replace(/(?:([^\=]+)\=([^\;]+);?)/g, _parse);

    return rv;
}
//}@url

// === MD5 / SHA1 / HMAC / CRC32 ===========================

// Type.MD5
function MD5(data,          // @param ByteString/ByteArray:
             toByteArray) { // @param Boolean(= false): true is result ByteArray
                            //                          false is result HexString
                            // @return HexString/ByteArray: "ffff.." or [255, 255, ...]
                            // @help: MD5#mm.MD5
                            // @desc: encode MD5 hash
//{@assert
    Type_allow(data,        "ByteString/ByteArray");
    Type_allow(toByteArray, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    MD5._A || _initMD5();
    return _crypto("MD5", data, toByteArray);
}

// Type.SHA1
function SHA1(data,          // @param ByteString/ByteArray:
              toByteArray) { // @param Boolean(= false): true is result ByteArray
                             //                          false is result HexString
                             // @return HexString/ByteArray: "ffff.." or [255, 255, ...]
                             // @help: SHA1#mm.SHA1
                             // @desc: encode SHA1 hash
//{@assert
    Type_allow(data,        "ByteString/ByteArray");
    Type_allow(toByteArray, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    return _crypto("SHA1", data, toByteArray);
}

// Type.HMAC
function HMAC(key,           // @param ByteString/ByteArray:
              data,          // @param ByteString/ByteArray:
              hashLib,       // @param Function: mm.MD5 or mm.SHA1
              toByteArray) { // @param Boolean(= false): true is result ByteArray
                             //                          false is result HexString
                             // @return HexString/ByteArray: "ffff.." or [255, 255, ...]
                             // @help: HMAC#mm.HMAC
                             // @desc: encode HMAC-MD5, HMAC-SHA1
//{@assert
    Type_allow(key,         "ByteString/ByteArray");
    Type_allow(data,        "ByteString/ByteArray");
    Type_allow(hashLib,     TYPE_FUNCTION);
    Type_allow(toByteArray, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    key  = _isArray(key)  ? key  : _ByteStringToByteArray(key);
    data = _isArray(data) ? data : _ByteStringToByteArray(data);

    // http://en.wikipedia.org/wiki/HMAC
    var blocksize = 64, // magic word(MD5.blocksize = 64, SHA1.blocksize = 64)
        i = 0, opad, ipad;

    if (key.length > blocksize) {
        key = hashLib(key, true);
    }
    opad = key.concat(); // clone
    ipad = key.concat(); // clone

    for (; i < blocksize; ++i) {
        opad[i] ^= 0x5C; // xor
        ipad[i] ^= 0x36; // xor
    }
    return hashLib(opad.concat(hashLib(ipad.concat(data), true)), toByteArray);
}

// inner -
function _crypto(kind,          // @param String: "SHA1", "SHA256", "MD5"
                 data,          // @param ByteString/ByteArray:
                 toByteArray) { // @param Boolean(= false): true is result ByteArray
                                //                          false is result HexString
                                // @return HexString/ByteArray: "ffff.." or [255, 255, ...]

    var rv, hash, i, iz, e, a, b, c, d, vals;

    rv = _isArray(data) ? data.concat() // ByteArray.clone()
                        : _ByteStringToByteArray(data);
    i = rv.length;
    e = i;

    // --- padding ---
    rv[i++] = 0x80;

    while (i % 64 !== 56) {
        rv[i++] = 0;
    }
    e *= 8;
    switch (kind) {
    case "SHA1":
        rv.push(0, 0, 0, 0,
                e >> 24 & 0xff, e >> 16 & 0xff, e >> 8 & 0xff, e & 0xff);
        hash = _SHA1(rv);
        break;
/*
    case "SHA256":
        rv.push(0, 0, 0, 0,
                e >> 24 & 0xff, e >> 16 & 0xff, e >> 8 & 0xff, e & 0xff);
        hash = _SHA256(rv);
        break;
 */
    case "MD5":
        rv.push(e & 0xff, e >> 8 & 0xff, e >> 16 & 0xff, e >> 24 & 0xff,
                0, 0, 0, 0);
        hash = _MD5(rv);
    }

    for (rv = [], i = 0, iz = hash.length; i < iz; ++i) {
        rv.push(hash[i]       & 0xff,
                hash[i] >>  8 & 0xff,
                hash[i] >> 16 & 0xff,
                hash[i] >> 24 & 0xff);
    }
    if (kind === "SHA1" || kind === "SHA256") { // swap byte order
        for (i = 0, iz = rv.length; i < iz; i += 4) {
            a = rv[i    ];
            b = rv[i + 1];
            c = rv[i + 2];
            d = rv[i + 3];
            rv[i + 3] = a;
            rv[i + 2] = b;
            rv[i + 1] = c;
            rv[i    ] = d;
        }
    }
    if (toByteArray) {
        return rv;
    }

    vals = mm_hash_table("number", "hex2");

    for (i = 0, iz = rv.length; i < iz; ++i) {
        rv[i] = vals[rv[i]];
    }
    return rv.join("");
}

// inner - init MD5
function _initMD5() {
    MD5._A = [
            0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf,
            0x4787c62a, 0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af,
            0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e,
            0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
            0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6,
            0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
            0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
            0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
            0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039,
            0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244, 0x432aff97,
            0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d,
            0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
            0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391],
    MD5._S = [
            7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
            5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
            4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
            6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21],
    MD5._X = [
            0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
            1,  6, 11,  0,  5, 10, 15,  4,  9, 14,  3,  8, 13,  2,  7, 12,
            5,  8, 11, 14,  1,  4,  7, 10, 13,  0,  3,  6,  9, 12, 15,  2,
            0,  7, 14,  5, 12,  3, 10,  1,  8, 15,  6, 13,  4, 11,  2,  9];
}

// inner - calc MD5
function _MD5(data) { // @param ByteArray:
                      // @return ByteArray:
    var a = 0x67452301, aa, ra,
        b = 0xefcdab89, bb, rb,
        c = 0x98badcfe, cc, rc,
        d = 0x10325476, dd,
        A = MD5._A,
        S = MD5._S,
        X = MD5._X,
        i = 0, iz = data.length, j, k, n, word = [];

    for (; i < iz; i += 64) {
        for (j = 0; j < 16; ++j) {
            k = i + j * 4;
            word[j] = data[k] + (data[k + 1] <<  8) +
                                (data[k + 2] << 16) +
                                (data[k + 3] << 24);
        }
        aa = a;
        bb = b;
        cc = c;
        dd = d;

        for (j = 0; j < 64; ++j) {
            n = j < 16 ? (b & c) | (~b & d) // ff - Round 1
              : j < 32 ? (b & d) | (c & ~d) // gg - Round 2
              : j < 48 ?  b ^ c ^ d         // hh - Round 3
                       :  c ^ (b | ~d);     // ii - Round 4
            n += a + word[X[j]] + A[j];

            ra = b + ((n << S[j]) | (n >>> (32 - S[j])));
            rb = b;
            rc = c;
            // rotate
            a = d;
            b = ra;
            c = rb;
            d = rc;
        }
        a += aa;
        b += bb;
        c += cc;
        d += dd;
    }
    return [a, b, c, d];
}

// inner - calc SHA-1
function _SHA1(data) { // @param ByteArray:
                       // @return ByteArray:
    var a = 0x67452301, aa,
        b = 0xefcdab89, bb,
        c = 0x98badcfe, cc,
        d = 0x10325476, dd,
        e = 0xc3d2e1f0, ee,
        i = 0, iz = data.length, j, jz, n, n16 = [];

    for (; i < iz; i += 64) {
        aa = a;
        bb = b;
        cc = c;
        dd = d;
        ee = e;

        for (j = i, jz = i + 64, n = 0; j < jz; j += 4, ++n) {
            n16[n] = (data[j]     << 24) | (data[j + 1] << 16) |
                     (data[j + 2] <<  8) |  data[j + 3];
        }
        for (j = 16; j < 80; ++j) {
            n = n16[j - 3] ^ n16[j - 8] ^ n16[j - 14] ^ n16[j - 16];
            n16[j] = (n << 1) | (n >>> 31);
        }
        for (j = 0; j < 80; ++j) {
            n = j < 20 ? ((b & c) ^ (~b & d))           + 0x5a827999
              : j < 40 ?  (b ^ c ^ d)                   + 0x6ed9eba1
              : j < 60 ? ((b & c) ^  (b & d) ^ (c & d)) + 0x8f1bbcdc
                       :  (b ^ c ^ d)                   + 0xca62c1d6;
            n += ((a << 5) | (a >>> 27)) + n16[j] + e;

            e = d;
            d = c;
            c = (b << 30) | (b >>> 2);
            b = a;
            a = n;
        }
        a += aa;
        b += bb;
        c += cc;
        d += dd;
        e += ee;
    }
    return [a, b, c, d, e];
}

/*
// inner - calc SHA-256
function _SHA256(data) { // @param ByteArray:
                         // @return ByteArray:
  // [TBD]
}
 */

// mm.CRC32
function CRC32(data,  // @param ByteString/ByteArray: UTF8String/UTF8Array
               crc) { // @param Number(= 0): previous computed CRC32
                      // @return Number:
                      // @see: via http://www.ietf.org/rfc/rfc1952.txt
                      // @help: CRC32#mm.CRC32
                      // @desc: encode CRC32

    function _init() { // @desc: create CRC32 table
        var rv = [], c = 0, i = 0, j = 0;

        for (; i < 256; ++i) {
            for (c = i, j = 0; j < 8; ++j) {
                c = c & 1 ? 0xedb88320.xor(c >>> 1)
                          : c >>> 1;
            }
            rv[i] = c;
        }
        return rv;
    }

//{@assert
    Type_allow(data, "ByteString/ByteArray");
    Type_allow(crc,  TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    data = _isArray(data) ? data
                          : _ByteStringToByteArray(data);

    var table = CRC32._table || (CRC32._table = _init()),
        c = (crc || 0).xor(0xffffffff),
        i = 0, iz = data.length;

    for (; i < iz; ++i) {
        c = (c >>> 8) ^ table[(c ^ data[i]) & 0xff];
    }
    return c.xor(0xffffffff);
}

// === UTF8 ================================================

//{@binary
// UTF8 - encode
function UTF8(data) { // @param String/UTF8ByteArray:
                      // @help: UTF8#mm.UTF8
                      // @desc: String to UTF8ByteArray
//{@assert
    Type_allow(data, "String/ByteArray");
//}@assert

    if (_isArray(data)) {
        return data;
    }

    var rv = [], i = 0, iz = data.length, c = 0;

    for (; i < iz; ++i) {
        c = data.charCodeAt(i);
        if (c < 0x80) { // ASCII(0x00 ~ 0x7f)
            rv.push(c & 0x7f);
        } else if (c < 0x0800) {
            rv.push(((c >>>  6) & 0x1f) | 0xc0, (c & 0x3f) | 0x80);
        } else if (c < 0x10000) {
            rv.push(((c >>> 12) & 0x0f) | 0xe0,
                    ((c >>>  6) & 0x3f) | 0x80, (c & 0x3f) | 0x80);
        }
    }
    return rv;
}
//}@binary

//{@binary
// UTF8#decode
function UTF8_decode(byteArray,  // @param String/UTF8ByteArray: [ Number(utf8), ... ]
                     startIndex, // @param Number(= 0):
                     endIndex) { // @param Number(= undefined):
                                 // @this UTF8ByteArray: [ Number(utf8), ... ]
                                 // @return String: string
                                 // @help: UTF8#mm.UTF8.decode
                                 // @desc: decode UTF8ByteArray to String(UCS2)
//{@assert
    Type_allow(byteArray, "String/ByteArray");
//}@assert

    if (Type_isString(byteArray)) {
        return startIndex !== void 0 ? byteArray.slice(startIndex, endIndex)
                                     : byteArray;
    }

    var rv = [], ri = -1, iz = endIndex || byteArray.length, c = 0,
        i = startIndex || 0;

    if (iz > byteArray.length) {
        iz = byteArray.length;
    }

    for (; i < iz; ++i) {
        c = byteArray[i]; // first byte
        if (c < 0x80) { // ASCII(0x00 ~ 0x7f)
            rv[++ri] = c;
        } else if (c < 0xe0) {
            rv[++ri] = (c & 0x1f) <<  6 | (byteArray[++i] & 0x3f);
        } else if (c < 0xf0) {
            rv[++ri] = (c & 0x0f) << 12 | (byteArray[++i] & 0x3f) << 6
                                        | (byteArray[++i] & 0x3f);
        }
    }
    return UTF16_decode(rv);
}
//}@binary

// === UTF16 ===============================================

//{@binary
// UTF16 - encode
function UTF16(data) { // @param String/UTF16NumberArray:
                       // @return UTF16NumberArray: [ Number(utf16), ... ]
                       // @help: UTF16#mm.UTF16
                       // @desc: String to UTF16NumberArray

//{@assert
    Type_allow(data, "String/ByteArray");
//}@assert

    if (_isArray(data)) {
        return data;
    }

    var rv = [], i = 0, iz = data.length;

    for (; i < iz; ++i) {
        rv[i] = data.charCodeAt(i);
    }
    return rv;
}
//}@binary

//{@binary
// UTF16#decode
function UTF16_decode(numberArray, // @param String/UTF16NumberArray: [ Number(utf16), ... ]
                      startIndex,  // @param Number(= 0):
                      endIndex) {  // @param Number(= undefined):
                                   // @return String: string
                                   // @help: UTF16#mm.UTF16.decode
                                   // @desc: decode UTF16NumberArray to String(UCS2)
//{@assert
    Type_allow(numberArray, "String/WordArray");
    Type_allow(startIndex,  TYPE_NUMBER | TYPE_UNDEFINED);
    Type_allow(endIndex,    TYPE_NUMBER | TYPE_UNDEFINED);
//}@assert

    if (Type_isString(numberArray)) {
        return startIndex !== void 0 ? numberArray.slice(startIndex, endIndex)
                                     : numberArray;
    }
    return _wordArrayToString(numberArray, startIndex || 0, endIndex || void 0);
}
//}@binary

// inner - WordArray to String
function _wordArrayToString(wordArray,  // @param WordArray: [ 0x1234, ... ]
                            startIndex, // @param Number(= 0):
                            endIndex) { // @param Number(= undefined):
                                        // @return String: string
                                        // @desc: decode WordArray to String(UCS2)
    var rv = [], ary = wordArray,
        i = 0, iz = ary.length, bulk = 10240, undef;

    // pre slice
    if (startIndex !== undef || endIndex !== undef) {
        ary = ary.slice(startIndex || 0, Math.max(endIndex || iz, iz));
        iz = ary.length;
    }

    // `` 巨大な配列は String.fromCharCode.apply() で例外が出るため
    //    適度なサイズ(10240)で文字列化し回避する
    for (; i < iz; i += bulk) {
        rv.push(String.fromCharCode.apply(null, ary.slice(i, i + bulk)));
    }
    return rv.join("");
}

// === Base64 ==============================================

//{@binary
// Base64 - encode
function Base64(data,          // @param String/UTF8Base64String/ByteArray:
                toURLSafe64) { // @param Boolean(= false):
                               // @return UTF8Base64String/UTF8URLSafe64String:
                               // @help: Base64#mm.Base64
                               // @desc: encode ByteArray to UTF8 + Base64 formated String

//{@assert
    Type_allow(data, "String/ByteArray");
//}@assert

    Base64._db || _initBase64();

    var rv = [],
        ary = Type_isString(data) ? UTF8(data)
                                  : data,
        c = 0, i = -1, iz = ary.length,
        pad = [0, 2, 1][iz % 3],
        chars = Base64._db.chars;

    --iz;
    while (i < iz) {
        c = (ary[++i] << 16) | (ary[++i] << 8) | (ary[++i]); // 24bit
        rv.push(chars[(c >> 18) & 0x3f], chars[(c >> 12) & 0x3f],
                chars[(c >>  6) & 0x3f], chars[ c        & 0x3f]);
    }
    pad > 1 && (rv[rv.length - 2] = "=");
    pad > 0 && (rv[rv.length - 1] = "=");

    if (toURLSafe64) {
        return rv.join("").replace(/\=+$/g, "").replace(/\+/g, "-").
                                                replace(/\//g, "_");
    }
    return rv.join("");
}
//}@binary

//{@binary
// Base64#decode
function Base64_decode(data,                 // @param UTF8Base64String/UTF8URLSafe64String:
                       toUTF16NumberArray) { // @param Boolean(= false): true is UTF16NumberArray result
                                             // @return String/UTF16NumberArray:
                                             // @help: Base64#mm.Base64.decode
                                             // @desc: decode UTF8 + Base64 formated String
//{@assert
    Type_allow(data, TYPE_STRING);
//}@assert

    Base64._db || _initBase64();

    var rv = [],
        c = 0, i = -1,
        ary = data.split(""),
        iz = data.length - 1,
        codes = Base64._db.codes;

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

    return toUTF16NumberArray ? rv
                              : UTF8_decode(rv);
}
//}@binary

//{@binary
// inner - init base64
function _initBase64() {
    var base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        i = 0,
        db = {
            chars: base.split(""),              // ["A", "B", ... "/"]
            codes: { "=": 0, "-": 62, "_": 63 } // URLSafe64 chars("-", "_")
        };

    for (; i < 64; ++i) {
        db.codes[base.charAt(i)] = i;
    }
    Base64._db = db;
}
//}@binary

// === HTMLEntity ==========================================

//{@HTMLEntity
// mm.HTMLEntity
function HTMLEntity(data) { // @param String:
                            // @return String:
                            // @help: HTMLEntity#mm.HTMLEntity
                            // @desc: encode String to HTML Entity
    function _toEntity(code) {
        var hash = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

        return hash[code];
    }

//{@assert
    Type_allow(data, TYPE_STRING);
//}@assert

    return data.replace(/[&<>"]/g, _toEntity);
}
//}@HTMLEntity

//{@HTMLEntity
// mm.HTMLEntity.decode
function HTMLEntity_decode(data) { // @param String:
                                   // @return String:
                                   // @help: HTMLEntity#mm.HTMLEntity.decode
                                   // @desc: decode String from HTML Entity
    function _fromEntity(code) {
        var hash = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"' };

        return hash[code];
    }

//{@assert
    Type_allow(data, TYPE_STRING);
//}@assert

    return data.replace(/&(?:amp|lt|gt|quot);/g, _fromEntity).
                replace(/\\u([0-9a-f]{4})/g, function(m, hex) { // \u0000 ~ \uffff
                    return String.fromCharCode(parseInt(hex, 16));
                });
}
//}@HTMLEntity

// === ByteString ==========================================

//{@binary
// mm.ByteArray
function ByteArray(data) { // @param ByteString/ByteArray:
                           // @return ByteArray:
                           // @help: ByteString#mm.ByteArray
                           // @desc: convert ByteString to ByteArray
    return _isArray(data) ? data
         : Type_isString(data) ? _ByteStringToByteArray(data)
         : [];
}
//}@binary

//{@binary
// mm.ByteArray.toByteString
function ByteArray_toByteString(data) { // @param ByteString/ByteArray:
                                        // @return ByteString:
                                        // @help: ByteString#mm.ByteArray.toByteString
                                        // @desc: convert ByteString to ByteArray
    return _isArray(data) ? _ByteArrayToByteString(data)
         : Type_isString(data) ? data
         : "";
}
//}@binary

//{@binary
// mm.ByteString
function ByteString(data) { // @param ByteString/ByteArray:
                            // @return ByteString:
                            // @help: ByteString#mm.ByteString
                            // @desc: convert ByteArray to ByteString
    return ByteArray_toByteString(data);
}
//}@binary

//{@binary
// mm.ByteString.toByteArray
function ByteString_toByteArray(data) { // @param ByteString/ByteArray:
                                        // @return ByteArray:
                                        // @help: ByteString#mm.ByteString.toByteArray
                                        // @desc: convert ByteString to ByteArray
    return ByteArray(data);
}
//}@binary

//{@binary
// inner - ByteString - encode
function _ByteArrayToByteString(data) { // @param ByteArray: [0x00, 0x01]
                                        // @return ByteString: "\00\01"
                                        // @desc: convert ByteArray to ByteString
//{@assert
    Type_allow(data, "ByteArray");
//}@assert

    var rv = [],
        hash = mm_hash_table("number", "byte"), // { 0: "\00" .. 255: "\ff" }
        iz = data.length, i = 0, bulk = iz & 0xfffffff8;

    for (; i < bulk; i += 8) {
        rv.push(hash[data[i    ] & 0xff], hash[data[i + 1] & 0xff],
                hash[data[i + 2] & 0xff], hash[data[i + 3] & 0xff],
                hash[data[i + 4] & 0xff], hash[data[i + 5] & 0xff],
                hash[data[i + 6] & 0xff], hash[data[i + 7] & 0xff]);
    }
    for (; i < iz; ++i) {
        rv.push(hash[data[i] & 0xff]);
    }
    return rv.join("");
}
//}@binary

//{@binary
// inner - ByteString - decode
function _ByteStringToByteArray(data) { // @param ByteString: "\00\01"
                                        // @return ByteArray: [0x00, 0x01]
                                        // @desc: convert ByteString to ByteArray
//{@assert
    Type_allow(data, "ByteString");
//}@assert

    var rv = [],
        hash = mm_hash_table("byte", "number"), // { "\00": 0  .. "\ff": 255}
        ary = data.split(""),
        iz = ary.length, i = 0, bulk = iz & 0xfffffff8;

    for (; i < bulk; i += 8) {
        rv.push(hash[ary[i    ]], hash[ary[i + 1]],
                hash[ary[i + 2]], hash[ary[i + 3]],
                hash[ary[i + 4]], hash[ary[i + 5]],
                hash[ary[i + 6]], hash[ary[i + 7]]);
    }
    for (; i < iz; ++i) {
        rv.push(hash[ary[i]]);
    }
    return rv;
}
//}@binary

// === Capitalize ==========================================

// Capitalize
function Capitalize(mix,           // @param StringArray/String: ["pascal", "case"], ["camel", "case"],
                                   //                            ["snake", "case"], ["hy", "phe", "na", "tion"]
                    type,          // @param String(= ""): capitalization type. "PascalCase", "camelCase",
                                   //                                     "snake_case", "hyphenation"
                    toLowerCase) { // @param Boolean(= false): exec StringArray.toLowerCase()
                                   // @return String: "PascalCase", "camelCase", "snake_case", "hy-phe-na-tion"
                                   // @help: Capitalize#mm.Capitalize
                                   // @desc: build capitalized string

//{@assert
    Type_allow(mix,         "StringArray/String");
    Type_allow(type,        TYPE_STRING);
    Type_allow(toLowerCase, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    // String("pascalCase") -> Array(["pascal", "case"]) -> String("PascalCase")
    var ary = _isArray(mix) ? mix
                            : _CapitalizedStringToStringArray(mix);

    if (toLowerCase) {
        ary = ary.map(function(v) {
            return v.toLowerCase();
        });
    }
    return _StringArrayToCapitalizedString(ary, type);
}

// Capitalize.toUpper1st
function Capitalize_toUpper1st(str) { // @param String: "aaa"
                                      // @return String: "Aaa"
                                      // @help: Capitalize#mm.Capitalize.toUpper1st
                                      // @desc: to upper first char
//{@assert
    Type_allow(str, TYPE_STRING);
//}@assert

    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Capitalize.toLower1st
function Capitalize_toLower1st(str) { // @param String: "Aaa"
                                      // @return String: "aaa"
                                      // @help: Capitalize#mm.Capitalize.toLower1st
                                      // @desc: to lower first char
//{@assert
    Type_allow(str, TYPE_STRING);
//}@assert

    return str.charAt(0).toLowerCase() + str.slice(1);
}

// Capitalize.toStringArray
function Capitalize_toStringArray(mix) { // @param StringArray/String:
                                         // @return StringArray:
                                         // @help: Capitalize#mm.Capitalize.toStringArray
                                         // @desc: convert String to StringArray
//{@assert
    Type_allow(mix, "StringArray/String");
//}@assert

    if (_isArray(mix)) { // ["pascal", "case"]
        return mix;
    }
    // "pascalCase" -> ["pascal", "case"]
    return _CapitalizedStringToStringArray(mix);
}

// inner - StringArrayToCapitalizedString
function _StringArrayToCapitalizedString(ary,    // @param ArrayString: ["pascal", "case"], ["camel", "case"],
                                                 //                     ["snake", "case"], ["hy", "phe", "na", "tion"]
                                         type) { // @param String: capitalization type. "PascalCase", "camelCase",
                                                 //                                     "snake_case", "hyphenation"
                                                 // @return String: "PascalCase", "camelCase", "snake_case", "hy-phe-na-tion"
                                                 // @desc: build capitalized string
//{@assert
    Type_allow(ary,  "StringArray");
    Type_allow(type, TYPE_STRING);
    Type_allow(type.toLowerCase(), ["pascalcase", "camelcase", "snake_case", "hyphenation"]);
//}@assert

    switch (type.toLowerCase()) {
    case "pascalcase": return ary.map(Capitalize_toUpper1st).join("");
    case "camelcase":  return Capitalize_toLower1st(
                                    ary.map(Capitalize_toUpper1st).join(""));
    case "snake_case": return ary.join("_");
    case "hyphenation":return ary.join("-");
    }
    return "";
}

// inner - CapitalizedStringToStringArray
function _CapitalizedStringToStringArray(str) { // @param String: "PascalCase", "camelCase",
                                                //                "snake_case", "hy-phe-na-tion"
                                                // @return StringArray: ["pascal", "case"], ["camel", "case"],
                                                //                      ["snake", "case"],
                                                //                      ["hy", "phe", "na", "tion"]
                                                // @desc: split capitalized string

    function _splitPascalCase(src) {
        var rv = [], remain = "";

        src.replace(/^[a-z0-9]+/, function(m) {
            rv.push(m);
            return "";
        }).replace(/[A-Z][a-z0-9]*/g, function(m) {
            if (m.length === 1) {
                remain += m;
            } else if (m.length > 1) {
                remain && (rv.push(remain), remain = "");
                rv.push(m.toLowerCase());
            }
            return "";
        });
        remain && rv.push(remain);
        return rv;
    }

    str = str.trimChar("_", true).trimChar("-", true);

    return !str ? [""]
         : str.indexOf("_") >= 0 ? str.split("_") // snake_case        -> ["snake", "case"]
         : str.indexOf("-") >= 0 ? str.split("-") // hy-phe-na-tion    -> ["hy", "phe", "na", "tion"]
         : _splitPascalCase(str);                 // Pascal, camelCase -> ["pascal", "case"]
}

// === CLASS ===============================================

// Class
function Class(classNames, // @param String: "{{Class}}" or "{{Class}}:{{ParentClass}}" (inherit)
               proto,      // @param Hash(= undefined): prototype object
               dot) {      // @param Hash(= undefined): static(dot) member
                           // @return Function: initializer
                           // @see: Class.lite, Class.singleton
                           // @help: Class#mm.Class
                           // @desc: create a generic class
                           //           (with inherit, messaging)
//{@assert
    Type_allow(classNames, TYPE_STRING);
    Type_allow(proto,      TYPE_HASH | TYPE_UNDEFINED);
    Type_allow(dot,        TYPE_HASH | TYPE_UNDEFINED);
//}@assert

    function initializer() { // @desc: instantiate
        var args = arguments, init = "init", fin = "fin",
            lv0 = this,
            lv1 = lv0[PARENT_CLASS],
            lv2 = lv1 ? lv1[PARENT_CLASS] : 0;

        // add extras property
        this.CLASS_NAME = className; // String: Class name
        this.CLASS_UID  = 1..uid();  // Number: unique number by instance

        group && Type_isFunction(this.msgbox) && mm.msgg[group].bind(lv0);

        // constructor chain (lv2.init -> lv1.init -> lv0.init)
        lv2 && lv2[init] && lv2[init].apply(lv0, args);
        lv1 && lv1[init] && lv1[init].apply(lv0, args);
               lv0[init] && lv0[init].apply(lv0, args);

        // destructor wrap and chain (lv0.fin -> lv1.fin -> lv2.fin)
        lv0.fin__ = lv0[fin] || mm_nop;
        lv0[fin] = function() { // destructor wrapper
            lv0.fin__();
            lv1 && lv1[fin] && lv1[fin].call(lv0);
            lv2 && lv2[fin] && lv2[fin].call(lv0);

            // destroy them all
            mm_clear(lv0);
        };
    }

    function inherit() {
        var prototype,
            traits = function() {};

        traits[prototype] = Class[parentClass][prototype];
        Class[className][prototype] = prototype = new traits();

        mm_mix(prototype, proto, true); // true = override

        prototype.constructor   = Class[className];
        prototype[PARENT_CLASS] = Class[parentClass][prototype];
        prototype.parent        = parent; // add parent method
    }

    // call parentClass method
    function parent(method              // @param String: method name
                    /*, var_args */ ) { // @param Mix: args
//{@assert
        Type_allow(method, TYPE_STRING);
        Type_deny(method,  "Empty");
//}@assert
        var args = _slice.call(arguments, 1),
            lv0 = this,
            lv1 = lv0[PARENT_CLASS],
            lv2 = lv1 ? lv1[PARENT_CLASS] : 0;

        if (lv1) {
            if (lv1[method]) {
                return lv1[method].apply(this, args);
            } else if (lv2 && lv2[method]) {
                return lv2[method].apply(this, args);
            }
        }
        throw new Error(method + " NOT FOUND");
    }

    var PARENT_CLASS = "PARENT_CLASS",
        className    = classNames.left(":", classNames), // "Class:Parent" -> "Class"
        parentClass  = classNames.right(":"),            // "Class:Parent" -> "Parent"
        group = _matchPrefix(className.toLowerCase(), Class.prefix, true) ||
                _matchSuffix(className.toLowerCase(), Class.suffix, true);

    if (!Class[className]) {
        Class[className] = initializer;
        Class[className][prototype] = proto || {};
        Class[className][prototype][PARENT_CLASS] = null;

        dot && mm_mix(Class[className], dot);
        proto  && parentClass && inherit();
    }
    return Class[className];
}

// Class.has
function Class_has(key) { // @param String: Class name
                          // @return Boolean:
                          // @desc: has class
    return !!Class[key];
}

// Class.lite
function Class_lite(className, // @param String: "{{Class}}"
                    proto,     // @param Hash(= undefined): prototype object
                    dot) {     // @param Hash(= undefined): static(dot) member
                               // @return Function: initializer
                               // @see: Class, Class.singleton
                               // @help: Class#mm.Class.lite
                               // @desc: create a class
                               //          (without inherit, messaging)

    function initializer() { // @desc: instantiate
        // add extras property
        this.CLASS_NAME = className; // String: Class name
        this.CLASS_UID  = 1..uid();  // Number: unique number by instance

        group && Type_isFunction(this.msgbox) && mm.msgg[group].bind(this);

        this.init && this.init.apply(this, arguments);
    }

    var group = _matchPrefix(className.toLowerCase(), Class.prefix, true) ||
                _matchSuffix(className.toLowerCase(), Class.suffix, true);

    if (!Class[className]) {
        Class[className] = initializer;
        Class[className][prototype] = proto || {};

        dot && mm_mix(Class[className], dot);
    }
    return Class[className];
}

// Class.singleton
function Class_singleton(className, // @param String: className
                         proto,     // @param Hash(= undefined): prototype member
                         dot) {     // @param Hash(= undefined): static(dot) member
                                    // @return Function: initializer
                                    // @see: Class, Class.lite
                                    // @help: Class#mm.Class.singleton
                                    // @desc: create a singleton class
                                    //             (without inherit, with messaging)
    function initializer() {

        if (!initializer.instance) {
            // add extras property
            this.CLASS_NAME = className; // String: Class name
            this.CLASS_UID  = 1..uid();   // Number: unique number by instance

            group && Type_isFunction(this.msgbox) && mm.msgg[group].bind(this);

            this.init && this.init.apply(this, arguments);
        }
        return (initializer.instance || (initializer.instance = this));
    }

    var group = _matchPrefix(className.toLowerCase(), Class.prefix, true) ||
                _matchSuffix(className.toLowerCase(), Class.suffix, true);

    if (!Class[className]) {
        Class[className] = initializer;
        Class[className][prototype] = proto || {};
        Class[className][prototype].PARENT_CLASS = null;
        Class[className].getInstance = function() { // @return Instance:
            return new Class[className]();
        };

        dot && mm_mix(Class[className], dot);
    }
    return Class[className];
}

// === Image ==============================================
// mm.Class.Image
function Class_Image(url,     // @param URLString: url
                     param,   // @param Future/Hash(= null): { onload, onerror }
                     index) { // @param Number(= Date.now): optional index
                              //      param.onload - Function: onload callback
                              //      param.onerror - Function: onerror callback
                              // @help: Image#mm.Class.Image
                              // @desc: Image wrapper 
    param = param || {};

    var node = new Image,
        isFuture = Type_isFuture(param);

    this.node = node;

    // set node.index
    node.index = index === void 0 ? Date.now() : index;

    node.onload = function() {
        isFuture ? param.pass(node)
                 : (param.onload && param.onload({ node: node, param: param }));
    };
    node.onerror = function() {
        isFuture ? param.miss(node)
                 : (param.onerror && param.onerror({ node: node, param: param }));
    };
    node.src = url;
}

// === Messaging ==========================================

// Class.MessageGroup
function MessageGroup() {
    this._delivery = {}; // Delivery instance db { CLASS_UID: instance, ... }
    this._broadcast = [];
}

MessageGroup[prototype] = {
    bind:           MessageGroup_bind,
    bound:          MessageGroup_bound,
    unbind:         MessageGroup_unbind,
    send:           MessageGroup_send,
    post:           MessageGroup_post
};

// Class.MessageGroup#bind
function MessageGroup_bind(/* var_args */) { // @param Instance: instance
                                             // @throws ERROR("NOT_DELIVERABLE"):
                                             // @help: MessageGroup#mm.Class.MessageGroup.bind
                                             // @desc: register the destination of the message
    _slice.call(arguments).forEach(function(instance) {
//{@assert
        Type_allow(instance,           TYPE_OBJECT);
        Type_allow(instance.CLASS_UID, TYPE_NUMBER);
        Type_allow(instance.msgbox,    TYPE_FUNCTION);
//}@assert

        if (instance.CLASS_UID && Type_isFunction(instance.msgbox)) {
            this._delivery[instance.CLASS_UID] = instance; // overwrite
        } else {
            throw new Error("NOT_DELIVERABLE");
        }
    }, this);

    // update broadcast address
    this._broadcast = mm_val(this._delivery);
}

// Class.MessageGroup#bound
function MessageGroup_bound(instance) { // @param Instance(= null): instance or null
                                        // @return InstanceArray/Boolean: null -> [instance, ...],
                                        //                                Instance -> false is "NOT_DELIVERABLE"
                                        // @help: MessageGroup#mm.Class.MessageGroup.bound
                                        // @desc: enumerate registered instance, is deliverable
//{@assert
    if (instance) {
        Type_allow(instance,        TYPE_HASH);
        Type_allow(instance.msgbox, TYPE_FUNCTION);
    } else {
        Type_allow(instance,        TYPE_NULL | TYPE_UNDEFINED);
    }
//}@assert
    if (instance) {
        return instance.CLASS_UID && Type_isFunction(instance.msgbox) &&
               !!this._delivery[instance.CLASS_UID]; // return Boolean
    }
    return this._broadcast; // return [Instance, ...]
}

// Class.MessageGroup#unbind
function MessageGroup_unbind(/* var_args */) { // @param Instance: bound instance
                                               // @help: MessageGroup#mm.Class.MessageGroup.unbind
                                               // @desc: unregister
    var args = arguments.length ? _slice.call(arguments)
                                : this._broadcast;

    args.forEach(function(instance) {
//{@assert
        Type_allow(instance,           TYPE_OBJECT);
        Type_allow(instance.CLASS_UID, TYPE_NUMBER);
        Type_allow(instance.msgbox,    TYPE_FUNCTION);
//}@assert

        if (instance.CLASS_UID) {
            delete this._delivery[instance.CLASS_UID];
        }
    }, this);

    // update broadcast address
    this._broadcast = mm_val(this._delivery);
}

// Class.MessageGroup#send
function MessageGroup_send(msg,   // @param String: msg
                           to,    // @param InstanceArray/Instance(= null): delivery to,
                                  //            null          is Broadcast,
                                  //            InstanceArray is Muliticast,
                                  //            Instance      is Unicast
                           arg) { // @param Mix(= undefined): msgbox(arg)
                                  // @return Array: [result, ...], "NOT_DELIVERABLE" is ERROR
                                  // @help: MessageGroup#mm.Class.MessageGroup.send
                                  // @desc: send a message synchronously

//{@assert
    Type_allow(msg, TYPE_STRING);
    Type_deny(msg,  "Empty");
    Type_allow(to,  TYPE_ARRAY | TYPE_HASH | TYPE_NULL | TYPE_UNDEFINED);
//}@assert

    var rv = [], i = 0, iz,
        ary = !to ? this._broadcast // Broadcast
            : _isArray(to) ? to     // Multicast
            : [to];                 // Unicast

    for (iz = ary.length; i < iz; ++i) {
        rv[i] = this.bound(ary[i]) ? ary[i].msgbox(msg, arg)
                                   : "NOT_DELIVERABLE";
    }
    return rv;
}

// Class.MessageGroup#post
function MessageGroup_post(msg,   // @param String: msg
                           to,    // @param InstanceArray/Instance(= null): delivery to,
                                  //            null          is Broadcast,
                                  //            InstanceArray is Muliticast,
                                  //            Instance      is Unicast
                           arg) { // @param Mix(= undefined): msgbox(arg)
                                  // @help: MessageGroup#mm.Class.MessageGroup.post
                                  // @desc: post a message asynchronously

//{@assert
    Type_allow(msg, TYPE_STRING);
    Type_deny(msg,  "Empty");
    Type_allow(to,  TYPE_ARRAY | TYPE_HASH | TYPE_NULL | TYPE_UNDEFINED);
//}@assert

    var that = this;

    0..lazy(function() {
        that.send(msg, to, arg);
    });
}

// --- mm.anime arguments ---

//{@anime
// mm.anime
function mm_anime(param,           // @param Hash: { id: spec, ... }
                  tickCallback,    // @param Function: tick callback(result, param)
                  stateCallback) { // @param Future/Function(= null): change state callback(build, param)
                                   // @return Number: killingTicket for killing animation
                                   // @help: Anime#mm.anime
                                   // @desc: easing, mass effect

//   param.id - String: id or reserved-word(_time/_delay/_easing/_freeze)
//   param.spec - Hash: animation parameters { a, b, time, delay, easing, freeze }
//
//   --- override default-value ---
//   mm.anime({ _time:   ms     }, ...): override default spec.duration value
//   mm.anime({ _delay:  ms     }, ...): override default spec.delay value
//   mm.anime({ _easing: Math.* }, ...): override default spec.easing value
//   mm.anime({ _freeze: true   }, ...): override default spec.freeze value
//
//   --- spec parameters and default values ---
//   spec.a      - NumberArray/Number: point A (begin point)
//   spec.b      - NumberArray/Number: point B (end point)
//   spec.time   - Number(= 200): duration time (unit: msec)
//   spec.delay  - Number(= 0): delay time (unit: msec)
//   spec.easing - Function(= Math.inoutquad): easing function
//   spec.freeze - Booly(= false): truly is callback() -> false to freeze value
//
//   --- spec shorthand parameters ---
//   spec.t aka spec.time 
//   spec.d aka spec.delay
//   spec.e aka spec.easing
//   spec.f aka spec.freeze
//
//
//   tickCallback.result - Hash: { id: value, ... }, value is Number or NumberArray
//   tickCallback.param  - Hash: mm.anime(param) arg
//   stateCallback.build - Boolean: true is build step, false is destruct step

//   --- tickCallback ---
//   callback({ id: value, ... }, elapsedTime, param)
//
//   --- stateCallback ---
//   callback(true,  param) // <- before callback
//   callback(false, param) // <- after callback

    function _tick() { // @lookup: param, animationID, past, mfxdb,
                       //          tickCallback, stateCallback

        var now = Date.now(),
            curt,
            spec,
            result = {},
            updateState = false,
            i = 0, iz = mfxdb.length, j, jz, remain = iz;

        if (mm_anime._killID.length &&
            mm_anime._killID.indexOf(animationID) >= 0) {
            _freeze();
        }

        for (; i < iz; ++i) {
            curt = null;
            spec = mfxdb[i];

            switch (spec.state) {
            case COMPLETED:
                --remain;
                break;

            case WAIT:
                spec.past || (spec.past = now);

                if (now >= spec.past + spec.delay) { // delay end?
                    spec.state = RUNNING; // WAIT -> RUNNING
                    curt = spec.a.concat();
                    updateState = true;
                }
                break;

            case RUNNING:
                updateState = true;
                if (now >= spec.past + spec.delay + spec.time) { // timeout?
                    spec.state = COMPLETED; // RUNNING -> COMPLETED
                    curt = spec.b.concat();
                    --remain;
                } else {
                    for (curt = [], j = 0, jz = spec.a.length; j < jz; ++j) {
                        curt.push(spec.easing(now - spec.past - spec.delay, // -> current time
                                              spec.a[j], spec.b[j] - spec.a[j],
                                              spec.time));
                    }
                    spec.c = curt.concat();
                }
                break;

            case FREEZE:
                updateState = true;
                spec.state = COMPLETED; // FREEZE -> COMPLETED
                curt = (spec.freeze ? spec.c : spec.b).concat();
                --remain;
            }

            if (curt !== null) {
                if (spec.isArray) {
                    result[spec.id] = [];
                    for (j = 0, jz = spec.a.length; j < jz; ++j) {
                        result[spec.id].push(curt[j]);
                    }
                } else {
                    result[spec.id] = curt[0];
                }
            }
        }
        if (updateState) {
            if (tickCallback(result, now - spec.past, param) === false) {
                // tickCallback() -> false
                //      false is killing animation `` アニメーションの強制終了
                _freeze();
            }
        }
        if (remain > 0) {
            _animate ? _animate(_tick)
                     : setTimeout(_tick, 4);
        } else {
            mm_anime._id.removeIf(animationID);
            if (stateCallback) {
                stateCallback(false, param); // destruct
            }
        }
    }

    function _freeze() { // @lookup: animationID, mfxdb
        var i = 0, iz = mfxdb.length;

        mm_anime._killID.removeIf(animationID);
        for (i = 0; i < iz; ++i) {
            if (mfxdb[i].state !== COMPLETED) {
                mfxdb[i].state = FREEZE;
            }
        }
    }

    function _buildMassEffectDB(param) { // @lookup:
        var rv = [], id, spec, remain = {},
            defs = { _time: 200, _delay: 0,
                     _easing: Math.inoutquad, _freeze: false };

        // --- pickup reserved words ---
        for (id in param) {
            id in defs ? (defs[id]   = param[id])
                       : (remain[id] = param[id]);
        }
        // --- build mfx db ---
        // mfxdb = [spec, ...]
        // spec = { id, a, b, c, time, delay, easing, freeze, isArray, state, past }
        for (id in remain) {
            spec = remain[id];
            if (spec.a === void 0 || spec.b === void 0) {
                ; // ignore id
            } else {
                rv.push({
                    id:     id,   // id. eg: "x", "y"
                    a:      _toArray(spec.a), // point A
                    b:      _toArray(spec.b), // point B
                    c:      _toArray(spec.a), // Current value
                    time:   [spec.time,   spec.t].head(defs._time),
                    delay:  [spec.delay,  spec.d].head(defs._delay),
                    easing: [spec.easing, spec.e].head(defs._easing),
                    freeze: [spec.freeze, spec.f].head(defs._freeze),
                    isArray: _isArray(spec.a),
                    state:  WAIT,
                    past:   0
                });
            }
        }
        return rv;
    }

    var WAIT = 0, RUNNING = 1, FREEZE = 2, COMPLETED = 4,
        animationID = 2..uid(),
        mfxdb = _buildMassEffectDB(param);

    mm_anime._id.addIfNot(animationID);

    if (stateCallback) {
        stateCallback(true, param); // build
    }
    mm_anime_frame(_tick);
    return animationID;
}
//}@anime

//{@anime
// mm.anime
function mm_anime_kill(atom) { // @param Number: Math.easing() result atom
                               // @help: Anime#mm.anime.kill
                               // @desc: killing animation
    mm_anime._killID.addIfNot(atom);
}
//}@anime

//{@anime
// mm.anime.frame
function mm_anime_frame(tick) { // @param Function: callback
                                // @return Number: id
                                // @help: Anime#mm.anime.frame
                                // @desc: requestAnimationFrame wrapper
    return _animate ? _animate(tick)
                    : setTimeout(tick, 4);
}
//}@anime

//{@anime
// mm.anime.immediate
function mm_anime_immediate(tick) { // @param Function: callback
                                    // @return Number: id
                                    // @help: Anime#mm.anime.immediate
                                    // @desc: setImmediate wrapper
    return _immediate ? _immediate(tick)
                      : setTimeout(tick, 0);
}
//}@anime

// === ENVIRONMENT DETECTION ===============================

// see: user agent strings - http://code.google.com/p/uupaa-js/wiki/UserAgent
// see: Titanium.Platform - http://code.google.com/p/uupaa-js/wiki/TitaniumPlatform
// see: Android Mobile detection - http://googlewebmastercentral-ja.blogspot.com/2011/05/android.html

function _detectnEnv(rv) { // @param Hash:
                           // @return Hash: mm.env
    function _getVersion(pattern, defaultVersion) {
        return parseFloat(rv.ua.split(pattern)[1]) || defaultVersion || 0;
    }

    var prefix = "",
        screen = global.screen,
        navigator = global.navigator,
        userAgent = navigator ? navigator.userAgent : "",
        documentElement = document ? document.documentElement : null;

    // --- detect runs ---
    if (global.require && global.Core) {            // NGCore
        rv.ngcore = true;
    } else if (document && _location) {             // PC / Mobile Browser
        rv.browser = true;
        rv.ua = userAgent;
//{@worker
    } else if (global.self && global.self.importScripts) { // WebWorkers
        rv.worker = true;
        rv.ua = userAgent;
//}@worker
//{@titanium
    } else if (global.Ti) {                         // Titanium
        rv.titanium = true;
        rv.ua = global.Ti.userAgent;
//}@titanium
//{@node
    } else if (global.require && global.process) {  // Node.js
        rv.nodejs = true;
//}@node
    }

    // --- detect Desktop OS and Mobile OS ---
    if (rv.browser || rv.worker) {
        if (/iPhone|iPad|iPod/.test(rv.ua)) {
            rv.ios = parseFloat(rv.ua.split("OS ")[1].replace("_", ".")) || 1;
            rv.ipad = /iPad/.test(rv.ua);
            rv.retina = (global.devicePixelRatio || 1) >= 2;
            rv.mobile = true;
        } else if (/Android/i.test(rv.ua)) {
            rv.android = _getVersion("Android", 1);
            rv.mobile = /mobile/i.test(rv.ua);
//      } else if (/Mac/.test(rv.ua)) { // Mac OS X Version
//          rv.mac = parseFloat(rv.ua.split("Mac OS X")[1].replace("_", ".")) || 1;
//      } else if (/Win/.test(rv.ua)) {
//          // detect Windows NT Version
//          rv.windows = _getVersion("Windows NT", 1);
//          rv.windows = rv.windows >= 6.3 ? "future"
//                     : rv.windows >= 6.2 ? "8"
//                     : rv.windows >= 6.1 ? "7"
//                     : rv.windows >= 6   ? "Vista"
//                     : rv.windows >= 5.1 ? "XP"   // windows XP or Server2003
//                     : rv.windows >= 5.0 ? "2000"
//                                         : "other";
//      } else if (/CrOS/.test(rv.ua)) {
//          rv.chromeOS = 1; // TODO:
//      } else if (/X11|Linux/.test(rv.ua)) {
//          rv.unix = 1; // TODO:
        }

        // --- Detect Browser Environment ---
        if (/WebKit/.test(rv.ua)) {
            // WebKit <- UserAgent has "WebKit"
            // Chrome <- UserAgent has "Chrome"
            // Safari <- UserAgent has not "Chrome"
            rv.webkit = _getVersion("AppleWebKit/");

            if (/Chrome/.test(rv.ua)) {
                rv.chrome = _getVersion("Chrome/");
            } else {
                rv.safari = _getVersion("Version/");
            }
//{@gecko
        } else if (global.netscape) {
            // Gecko  <- window.netscape
            rv.gecko = _getVersion("rv:");
//}@gecko
//{@ie
        } else if (document.uniqueID) {
            // mobile <- UserAgent has "IEMobile" token
            rv.mobile = /IEMobile/.test(rv.ua);

            // IE 11  <- window.requestAnimationFrame ready
            // IE 10  <- window.msSetImmediate ready
            // IE 9   <- window.getComputedStyle ready
            // IE 8   <- document.querySelector ready
            // IE 7   <- window.XMLHttpRequest ready
            // IE 6   <- document.getElementsByTagName ready
            // IE<5.5 <- document.createComment not ready
            rv.ie = global.requestAnimationFrame ? 11 :
                    global.msSetImmediate        ? 10 :
                    global.getComputedStyle      ?  9 :
                    document.querySelector       ?  8 :
                    global.XMLHttpRequest        ?  7 :
                    document.createComment       ?  6 : 0;
//}@ie
//{@opera
        } else if (global.opera) {
            // Opera <- window.opera
            rv.opera = parseFloat(global.opera.version());
//}@opera
//      } else if (/netfront/i.test(rv.ua)) {
//          // NetFront <- UserAgent has "NetFront"
//          rv.netfront = _getVersion("NetFront/");
        }

//      rv.jit = (rv.ie     >= 9)    || // IE 9+
//               (rv.gecko  >= 1.91) || // Firefox 3.5+(Geko 1.91+)
//               (rv.webkit >= 528)  || // Safari 4+, Google Chrome 2+
//               (rv.opera  >= 10.5);   // Opera 10.50+
//      ((rv.ios || rv.android) && (rv.jit = false));

        // "en-us" -> "en"
        if (navigator) {
            rv.lang = (navigator.language ||
                       navigator.browserLanguage || "").split("-", 1)[0];
        }

        if (_location) {
            rv.secure = _location.protocol === "https:";
        }

        if (screen && screen.width) {
            rv.longedge = Math.max(screen.width, screen.height);
//{@ie
        } else if (rv.ie && rv.ie < 9 && documentElement) {
            rv.longedge = Math.max(documentElement.clientWidth,
                                   documentElement.clientHeight);
//}@ie
        } else if (global.innerWidth) {
            rv.longedge = Math.max(global.innerWidth, global.innerHeight);
        }
    }

//{@titanium
    if (rv.titanium) {
        rv.lang = global.Ti.Locale.currentLanguage;
    }
//}@titanium

    // --- detect plugin ---
//{@plugin
    if (rv.browser) {
        if (global.ActiveXObject || navigator.plugins) {
            rv.plugin = true;
            rv.flash  = _detectFlashPlayerVersion(9, rv.ie);
            rv.silver = _detectSilverlightVersion(3, rv.ie);
        }
    }
//}@plugin

    // --- detect IE 6, 7, 8, 9, 10, 11 ---
//{@ie
    if (rv.ie && rv.browser) {
        rv.ie6   = rv.ie === 6;
        rv.ie7   = rv.ie === 7;
        rv.ie8   = rv.ie === 8;
        rv.ie9   = rv.ie === 9;
        rv.ie10  = rv.ie === 10;
        rv.ie11  = rv.ie === 11;
        rv.ie67  = rv.ie < 8;
        rv.ie678 = rv.ie < 9;
    }
//}@ie

    prefix  = rv.webkit ? "webkit"              // webkitBoxSizing
/*{@gecko*/ : rv.gecko  ? "Moz"     /*}@gecko*/ // MozBoxSizing
/*{@opera*/ : rv.opera  ? "O"       /*}@opera*/ // OBoxSizing
/*{@ie*/    : rv.ie     ? "ms"      /*}@ie*/    // msBoxSizing
            : "";

    rv.vendernize._css    = prefix ? ("-" + prefix.toLowerCase() + "-") : ""; // "-webkit-"
    rv.vendernize._style  = prefix;
    rv.vendernize._method = prefix.toLowerCase();

    return rv;
}

//{@plugin
// inner - detect FlashPlayer version
function _detectFlashPlayerVersion(minimumVersion, ie) {
    var rv = 0, obj, ver, match;

    try {
        obj = ie ? new global.ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                 : global.navigator.plugins["Shockwave Flash"];
        if (!obj) {
            return 0;
        }
        ver = ie ? obj.GetVariable("$version").replace(/,/g, ".")
                 : obj.description;
        match = /\d+\.\d+/.exec(ver);
        rv = match ? parseFloat(match[0]) : 0;
    } catch (o_O) {
        mm_log_error(o_O + "");
    }
    return rv < minimumVersion ? 0 : rv;
}
//}@plugin

//{@plugin
// inner - detect Silverlight version
function _detectSilverlightVersion(minimumVersion, ie) {
    var rv = 0, obj, check = minimumVersion;

    try {
        obj = ie ? new global.ActiveXObject("AgControl.AgControl")
                 : global.navigator.plugins["Silverlight Plug-In"];
        if (!obj) {
            return 0;
        }
        if (ie) {
            // try "3.0" -> "4.0" -> "5.0" ...
            while (obj.IsVersionSupported(check + ".0")) {
                rv = check++;
            }
        } else {
            rv = parseInt(/\d+\.\d+/.exec(obj.description)[0], 10);
        }
    } catch (o_O) {
        mm_log_error(o_O + "");
    }
    return rv < minimumVersion ? 0 : rv;
}
//}@plugin

// mm.env.vendernize.css
function vendernize_css(str) { // @param String: "box-sizing"
                               // @return String: "-webkit-box-sizing", "-moz-box-sizing"
                               // @help: mm#env.vendernize.css
                               // @desc: build vendernized css string
    return _vendernize(str, "_css", "hyphenation", true);
}

// mm.env.vendernize.style
function vendernize_style(str) { // @param String: "box-sizing"
                                 // @return String: "webkitBoxSizing", "MozBoxSizing"
                                 // @help: mm#env.vendernize.style
                                 // @desc: build vendernized style string
    return _vendernize(str, "_style", "PascalCase");
}

// mm.env.vendernize.method
function vendernize_method(str) { // @param String: "battery"
                                  // @return String: "webkitBattery", "mozBattery"
                                  // @help: mm#env.vendernize.method
                                  // @desc: build vendernized method-name string
    return _vendernize(str, "_method", "PascalCase");
}

// inner - vendernize
function _vendernize(str,           // @param String/Array/String: "box-sizing"
                     kind,          // @param String: "_css", "_style", "_method"
                     type,          // @param String: "hyphenation" or "PascalCase"
                     toLowerCase) { // @param Boolean(= false):
                                    // @return String: "-moz-box-sizing", "MozBoxSizing", "mozBattery"
                                    // @desc: build vendernized string
//{@assert
    Type_allow(str,         TYPE_STRING);
    Type_allow(kind,        TYPE_STRING);
    Type_allow(type,        TYPE_STRING);
    Type_allow(toLowerCase, TYPE_BOOLEAN | TYPE_UNDEFINED);
//}@assert

    var prefix = mm.env.vendernize[kind];

    return prefix ? prefix + Capitalize(str, type, toLowerCase)
                  : str;
}

// mm.log
function mm_log(/* var_args */) { // @param Mix: values `` 可変長引数を受け取ります
                                  // @return true:
                                  // @help: Log#mm.log
                                  // @desc: put log
//{@log
    _logger("log", arguments);
//}@log
    return true;
}

// mm.log.warn
function mm_log_warn(/* var_args */) { // @param Mix: values `` 可変長引数を受け取ります
                                       // @return true:
                                       // @help: Log#mm.log.warn
                                       // @desc: put warning log
//{@log
    _logger("warn", arguments);
//}@log
    return true;
}

// mm.log.error
function mm_log_error(/* var_args */) { // @param Mix: values `` 可変長引数を受け取ります
                                        // @return true:
                                        // @help: Log#mm.log.error
                                        // @desc: put error log
//{@log
    _logger("error", arguments);
//}@log
    return true;
}

//{@log
// inner - logger
function _logger(method, // @param String: "log", "error", "warn"
                 args) { // @param Arguments:
                         // @desc: console-log, remote-log

    var msg = _slice.call(args).join(" "), log = mm.log;

    if (log.remote && log.url && global.Image) {
        (new Image).src = log.url.at(method, msg);
    }
    if (log.local && global.console[method]) {
        global.console[method]("[", (new Date).toJSON(), "]:", msg);
    }
}
//}@log

// mm.iog
function mm_iog(fn,     // @param Function/FunctionNameString:
                test) { // @param Boolean(= false): unit test
                        // @return Object: { out, valueOf }
                        // @help: Log#mm.iog
                        // @desc: in-out-log( nested log )
//{@log
    function _logger(method, args) {
        method(lines[0].repeat(nest) + lines[2] + " " + fnName + "[ " +
               _slice.call(args).join(" ") + " ]");
    }
//}@log

    function iog(/* var_args */) { // @param Mix: var_args
//{@log
        _logger(mm_log, arguments);
//}@log
    }

    function error(/* var_args */) { // @param Mix: var_args
//{@log
        _logger(mm_log_error, arguments);
//}@log
    }

    function out() {
//{@log
        mm_log(lines[0].repeat(nest) + lines[3] + " " + fnName +
               "( span: " + (new Date).diff(now) + " )");
        --mm_iog.nest;
        return true;
//}@log
    }

//{@log
    mm_iog.nest === void 0 && (mm_iog.nest = 0);

    var fnName = (Type_isString(fn) ? fn : fn.nickname()) || "",
        now = Date.now(),
        nest = mm_iog.nest++,
        lines = mm.env.lang === "ja" ? ["\u2502", "\u250c", "\u2502", "\u2514"]
                                     : ["|",  "+-", "| ", "`-"];

    mm_log(lines[0].repeat(nest) + lines[1] + " " + fnName + "()");
//}@log

    iog.error = error;
    iog.valueOf = iog.out = out; // ~object, object.out()

    return iog;
}

// mm.iog.reset
function mm_iog_reset() { // @help: Log#mm.iog.reset
                          // @desc: reset nest level
    mm_iog.nest = 0;
}

//{@easing
function _buildEasingMethods() {

    // This code block from [Robert Penner's EASING EQUATIONS]
    // (c) 2001 Robert Penner, all rights reserved.
    // http://www.robertpenner.com/easing_terms_of_use.html

    // Math.easing - easing functions
    Math.easing = {
            linear: "(c*t/d+b)", // linear(t,b,c,d)
                                 //     t:Number - current time (from 0)
                                 //     b:Number - beginning value
                                 //     c:Number - change in value(delta)(end - begin)
                                 //     d:Number - duration(unit: ms)
    // Quad ---
            inquad: "(q1=t/d,c*q1*q1+b)",
           outquad: "(q1=t/d,-c*q1*(q1-2)+b)",
         inoutquad: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1+b:-c*0.5*((--q1)*(q1-2)-1)+b)",
    // Cubic ---
           incubic: "(q1=t/d,c*q1*q1*q1+b)",
          outcubic: "(q1=t/d-1,c*(q1*q1*q1+1)+b)",
        inoutcubic: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1*q1+b:c*0.5*((q1-=2)*q1*q1+2)+b)",
        outincubic: "(q1=t*2,q2=c*0.5,t<d*0.5?(q3=q1/d-1,q2*(q3*q3*q3+1)+b)" +
                                            ":(q3=(q1-d)/d,q2*q3*q3*q3+b+q2))",
    // Quart ---
           inquart: "(q1=t/d,c*q1*q1*q1*q1+b)",
          outquart: "(q1=t/d-1,-c*(q1*q1*q1*q1-1)+b)",
        inoutquart: "(q1=t/(d*0.5),q1<1?c*0.5*q1*q1*q1*q1+b" +
                                      ":-c*0.5*((q1-=2)*q1*q1*q1-2)+b)",
        outinquart: "(q1=t*2,q2=c*0.5,t<d*0.5?(q3=q1/d-1,-q2*(q3*q3*q3*q3-1)+b)" +
                                            ":(q4=q1-d,q3=q4/d,q2*q3*q3*q3*q3+b+q2))",
    // Back ---
            inback: "(q1=t/d,q2=1.70158,c*q1*q1*((q2+1)*q1-q2)+b)",
           outback: "(q1=t/d-1,q2=1.70158,c*(q1*q1*((q2+1)*q1+q2)+1)+b)",
         inoutback: "(q1=t/(d*0.5),q2=1.525,q3=1.70158," +
                        "q1<1?(c*0.5*(q1*q1*(((q3*=q2)+1)*q1-q3))+b)" +
                            ":(c*0.5*((q1-=2)*q1*(((q3*=q2)+1)*q1+q3)+2)+b))",
         outinback: "(q1=t*2,q2=c*0.5," +
                        "t<d*0.5?(q3=q1/d-1,q4=1.70158,q2*(q3*q3*((q4+1)*q3+q4)+1)+b)" +
                               ":(q3=(q1-d)/d,q4=1.70158,q2*q3*q3*((q4+1)*q3-q4)+b+q2))",
    // Bounce ---
          inbounce: "(q1=(d-t)/d,q2=7.5625,q3=2.75,c-(q1<(1/q3)?(c*(q2*q1*q1)+0)" +
                    ":(q1<(2/q3))?(c*(q2*(q1-=(1.5/q3))*q1+.75)+0):q1<(2.5/q3)" +
                    "?(c*(q2*(q1-=(2.25/q3))*q1+.9375)+0)" +
                    ":(c*(q2*(q1-=(2.625/q3))*q1+.984375)+0))+b)",
         outbounce: "(q1=t/d,q2=7.5625,q3=2.75,q1<(1/q3)?(c*(q2*q1*q1)+b)" +
                    ":(q1<(2/q3))?(c*(q2*(q1-=(1.5/q3))*q1+.75)+b):q1<(2.5/q3)" +
                    "?(c*(q2*(q1-=(2.25/q3))*q1+.9375)+b)" +
                    ":(c*(q2*(q1-=(2.625/q3))*q1+.984375)+b))"
    };
    // create easing functions
    mm_each(Math.easing, function(jsExprString, easingName) {
        Math[easingName] = new Function("t,b,c,d, q1,q2,q3,q4", // q1~q4 is tmp args
                                        "return " + jsExprString);
    });
}
//}@easing

// === EXPORT ==============================================

_api(mm_mix);

//{@easing
_buildEasingMethods();
//}@easing

})(this, this.document);
