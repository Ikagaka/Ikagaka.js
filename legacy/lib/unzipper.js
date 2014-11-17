/*--------------------------------------------------------------------------*
 * Unzipper
 *
 *   Unzip a zip file with asynchronous.
 *
 *   Version 1.02, 2012-04-24
 *   Copyright (c) 2012 polygon planet <http://twitter.com/polygon_planet>
 *   licensed under the GPL or MIT licenses.
 *-------------------------------------------------------------------------*/
(function (globals) {
/**
 * @constructor
 * @return {UnzipStream}
 */
var UnzipStream = function() {};

UnzipStream.prototype = {
  /**
   * @lends UnzipStream.prototype
   */
  /**
   * @type {ArrayBuffer|Uint8Array}
   */
  data : null,
  /**
   * @type {Number}
   */
  pos  : 0,
  /**
   * @ignore
   */
  init : function(data) {
    this.data = new Uint8Array(data);
    this.pos = 0;
  },
  /**
   * @param {Number} size
   * @return {Uint8Array}
   */
  read : function(size) {
    var res = this.data.subarray(this.pos, this.pos + size);
    this.pos += size;
    return res;
  }
};

/**
 * @constructor
 */
var Unzipper = Pot.update(function() {}, {
 /**
  * @lends Unzipper
  */
 /**
  * @type {Object}
  */
  DIRECTORY : new Error()
});

Unzipper.prototype = {
  /**
   * @lends Unzipper.prototype
   */
  /**
   * @type {UnzipStream}
   */
  stream : null,
  /**
   * @type {Number}
   */
  fileSize : null,
  /**
   * @type {Boolean}
   */
  convertEncodingToUTF8 : false,
  /**
   * @type {Boolean|String}
   */
  encodingAvailable : false,
  /**
   * @param {String} dataUri
   * @param {Number} size
   * @param {Function} [callback]
   * @param {Function} [errback]
   * @return {Pot.Deferred}
   */
  unzip : function(dataUri, size, callback, errback) {
    var that = this;

    this.stream = new UnzipStream();
    this.fileSize = +size;

    if (typeof Encoding !== 'undefined' && Encoding.convert) {
      this.encodingAvailable = true;
    }

    return Pot.Deferred.begin(function() {
      return that.base64Decode(
        dataUri.substring(dataUri.indexOf(',') + 1),
        that.fileSize
      );

    }).then(function(buffer) {
      that.stream.init(buffer);
      return that.readCentralDir();

    }).then(function(cdir) {
      var pos     = cdir.offset;
      var entries = cdir.entries;
      var result = [];

      return Pot.Deferred.repeat(entries, function(i) {
        that.stream.pos = pos;

        return that.readCentralFileHeaders().then(function(res) {
          var headers = Pot.update({}, res);
          headers.index = i;
          pos = that.stream.pos;
          that.stream.pos = headers.offset;

          return that.extractFile(
            Pot.update({}, headers),
            callback,
            errback
          ).then(function(res) {
            result.push(res);
          });
        });

      }).then(function() {
        return result;
      });
    });
  },
  /**
   * @param {Uint8Array} data
   * @return {Pot.Deferred}
   */
  uncompress : function(data) {
    return zip_inflate(data);
  },
  /**
   * @ignore
   */
  extractFile : function(fileHeaders, callback, errback) {
    var that = this;
    var headers = Pot.update({}, fileHeaders);

    return Pot.Deferred.begin(function() {
      return that.readFileHeader(headers);

    }).then(function(headers) {
      if (!headers.external || (
          !(headers.external === 0x41FF0010) &&
          !(headers.external === 16)
        )
      ) {
        return that.stream.read(headers.compressedSize);
      } else {
        throw Unzipper.DIRECTORY;
      }

    }).then(function(data) {
      var d = new Pot.Deferred();

      if (headers.compression === 0) {
        d.begin(data);
      } else {
        Pot.Deferred.begin(function() {
          return that.uncompress(data);

        }).then(function(result) {
          d.begin(result);
        });
      }
      return d;

    }).wait(0.5).then(function(data) {
      var d;

      if (that.encodingAvailable && that.convertEncodingToUTF8) {
        d = Pot.Deferred.begin(function() {
          return Encoding.convert(data, 'UTF8');
        }).then(function(res) {
          return Pot.Deferred.wait(1.5).then(function() {
            return res;
          });
        });
      } else {
        d = Pot.Deferred.succeed(data);
      }
      return d.then(function(res) {
        return Pot.utf8Decode(that.arrayBufferToBinary(res));
      });

    }).wait(1).then(function(data) {
      var result = {
        name : headers.filename,
        data : data,
        time : headers.mtime
      };

      if (callback) {
        callback(result);
      }
      return result;

    }).rescue(function(err) {
      if (err !== Unzipper.DIRECTORY) {
        if (err && Pot.getErrorMessage(err).length) {
          if (errback) {
            errback(err);
          }
          throw err;
        }
      }
    });
  },
  /**
   * @ignore
   */
  readCentralDir : function() {
    var that = this;
    var size = this.stream.data.length;
    var max = (size < 277) ? size : 277;
    var pos = this.stream.pos;
    var bytes = 0x00000000;
    var sc = String.fromCharCode;

    this.stream.pos = pos = size - max;
    while (pos < size) {
      var c = sc(this.stream.read(1)[0]);
      bytes = ((bytes << 8) & 0xFFFFFFFF) | (c.charCodeAt(0) & 0xFF);
      if (bytes === 0x504B0506) {
        pos++;
        break;
      }
      pos++;
    }
    var centd = {};

    return Pot.Deferred.begin(function() {
      var centData = that.stream.read(18);
      var p = 0;

      Pot.forEach({
        disk        : 2,
        diskStart   : 2,
        diskEntries : 2,
        entries     : 2,
        size        : 4,
        offset      : 4,
        commentSize : 2
      }, function(n, name) {
        var v = centData.subarray(p, p + n);
        centd[name] = that['toUint' + (n << 3)](v);
        p += n;
      });

    }).then(function() {
      if (centd.commentSize === 0) {
        return '';
      } else {
        return that.arrayBufferToBinary(
          that.stream.read(centd.commentSize)
        );
      }

    }).then(function(comment) {
      centd.comment = comment;
      return centd;
    });
  },
  /**
   * @ignore
   */
  readCentralFileHeaders : function() {
    var that = this;
    var headers = {};

    return Pot.Deferred.begin(function() {
      var centData = that.stream.read(46);
      var p = 0;

      Pot.forEach({
        chkid            : 2,
        id               : 2,
        version          : 2,
        versionExtracted : 2,
        flag             : 2,
        compression      : 2,
        mtime            : 2,
        mdate            : 2,
        crc              : 4,
        compressedSize   : 4,
        size             : 4,
        filenameLen      : 2,
        extraLen         : 2,
        commentLen       : 2,
        disk             : 2,
        internal         : 2,
        external         : 4,
        offset           : 4
      }, function(n, name) {
        var v = centData.subarray(p, p + n);
        headers[name] = that['toUint' + (n << 3)](v);
        p += n;
      });

    }).then(function() {
      var doConvert = !!(that.encodingAvailable && that.convertEncodingToUTF8);

      if (headers.filenameLen === 0) {
        return '';
      } else {
        return Pot.Deferred.begin(function() {
          var nameData = that.stream.read(headers.filenameLen);

          if (doConvert) {
            return Encoding.convert(nameData, 'UTF8');
          } else {
            return nameData;
          }

        }).then(function(res) {
          return that.arrayBufferToBinary(res);

        }).then(function(res) {
          if (doConvert) {
            return Pot.utf8Decode(res);
          } else {
            return res;
          }
        });
      }

    }).then(function(filename) {
      headers.filename = filename;
      if (headers.extraLen === 0) {
        return '';
      } else {
        return that.arrayBufferToBinary(
          that.stream.read(headers.extraLen)
        );
      }

    }).then(function(extra) {
      headers.extra = extra;
      if (headers.commentLen === 0) {
        return '';
      } else {
        return that.arrayBufferToBinary(
          that.stream.read(headers.commentLen)
        );
      }

    }).then(function(comment) {
      headers.comment = comment;

      if (headers.mdate !== 0 && headers.mtime !== 0) {
        var hours   = (headers.mtime  & 0xF800) >> 11;
        var minutes = (headers.mtime  & 0x07E0) >> 5;
        var seconds = (headers.mtime  & 0x001F) *  2;
        var year    = ((headers.mdate & 0xFE00) >> 9) + 1980;
        var month   = (headers.mdate  & 0x01E0) >> 5;
        var day     = headers.mdate   & 0x001F;
        headers.mtime = +new Date(year, month - 1, day, hours, minutes, seconds);
      } else {
        headers.mtime = +new Date();
      }

      headers.storedFilename = headers.filename;
      headers.status = 'ok';

      if (headers.filename.slice(-1) === '/') {
        headers.external = 0x41FF0010;
      }
      return headers;
    });
  },
  /**
   * @ignore
   */
  readFileHeader : function(fileHeaders) {
    var that = this;
    var data = {};
    var headers = Pot.update({}, fileHeaders);

    return Pot.Deferred.begin(function() {
      var fileHeader = that.stream.read(30);
      var p = 0;

      Pot.forEach({
        chk            : 2,
        id             : 2,
        version        : 2,
        flag           : 2,
        compression    : 2,
        mtime          : 2,
        mdate          : 2,
        crc            : 4,
        compressedSize : 4,
        size           : 4,
        filenameLen    : 2,
        extraLen       : 2
      }, function(n, name) {
        var v = fileHeader.subarray(p, p + n);
        data[name] = that['toUint' + (n << 3)](v);
        p += n;
      });

      return that.arrayBufferToBinary(
        that.stream.read(data.filenameLen)
      );

    }).then(function(filename) {
      headers.filename = filename;
      if (data.extraLen === 0) {
        return '';
      } else {
        return that.arrayBufferToBinary(
          that.stream.read(data.extraLen)
        );
      }

    }).then(function(extra) {

      headers.extra = extra;
      headers.compression = data.compression;

      Pot.forEach(['size', 'compressedSize', 'crc'], function(name) {
        if (data[name]) {
          headers[name] = data[name];
        }
      });

      headers.flag  = data.flag;
      headers.mdate = data.mdate;
      headers.mtime = data.mtime;

      if (headers.mdate !== 0 && headers.mtime !== 0) {
        var hours   = (headers.mtime  & 0xF800) >> 11;
        var minutes = (headers.mtime  & 0x07E0) >> 5;
        var seconds = (headers.mtime  & 0x001F) *  2;
        var year    = ((headers.mdate & 0xFE00) >> 9) + 1980;
        var month   = (headers.mdate  & 0x01E0) >> 5;
        var day     = headers.mdate   & 0x001F;
        headers.mtime = +new Date(year, month - 1, day, hours, minutes, seconds);
      } else {
        headers.mtime = +new Date();
      }

      headers.storedFilename = headers.filename;
      headers.status = 'ok';
      return headers;
    });
  },
  /**
   * @ignore
   */
  arrayBufferToBinary : (function() {
    var sc = String.fromCharCode;

    return function(data) {
      var r = [], i = 0, len = data.length;
      for (; i < len; i++) {
        r[i] = sc(data[i]);
      }
      return r.join('');
    };
  }()),
  /**
   * @ignore
   */
  base64Decode : (function() {
    var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
              'abcdefghijklmnopqrstuvwxyz' +
              '0123456789+/=';

    return function(data, size) {
      var bytes = new Uint8Array(size), n = 0,
          p = -8, a = 0, c, d, i = 0,
          s = Pot.stringify(data), len = s.length;

      for (; i < len; i++) {
        c = map.indexOf(s.charAt(i));
        if (c >= 0) {
          a = (a << 6) | (c & 0x3F);
          if ((p += 6) >= 0) {
            d = a >> p & 0xFF;
            if (c !== 64) {
              bytes[n++] = d;
            }
            a &= 0x3F;
            p -= 8;
          }
        }
      }
      return bytes;
    };
  }()),
  /**
   * Uint16 LE
   *
   * @ignore
   */
  toUint16 : function(v) {
    return ((v[1] & 0xFF) << 8) |
            (v[0] & 0xFF);
  },
  /**
   * Uint32 LE
   *
   * @ignore
   */
  toUint32 : function(v) {
    return ((v[3] & 0xFF) << 24) |
           ((v[2] & 0xFF) << 16) |
           ((v[1] & 0xFF) <<  8) |
            (v[0] & 0xFF);
  },
  /**
   * @ignore
   */
  fromUint32 : function(v) {
    return new Uint8Array((new Uint32Array([v])).buffer);
  }
};

if (globals) {
  globals.Unzipper = Unzipper;
}
return Unzipper;

}(this));

