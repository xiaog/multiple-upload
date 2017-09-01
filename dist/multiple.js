(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.multiple = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var _upload = _dereq_('./lib/upload');

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = _upload2.default.defaultOptions; /* global window */

module.exports = {
  Upload: _upload2.default,
  defaultOptions: defaultOptions
};

},{"./lib/upload":5}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailedError = function (_Error) {
  _inherits(DetailedError, _Error);

  function DetailedError(error) {
    var causingErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var xhr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, DetailedError);

    var _this = _possibleConstructorReturn(this, (DetailedError.__proto__ || Object.getPrototypeOf(DetailedError)).call(this, error.message));

    _this.originalRequest = xhr;
    _this.causingError = causingErr;

    var message = error.message;
    if (causingErr != null) {
      message += ", caused by " + causingErr.toString();
    }
    if (xhr != null) {
      message += ", originated from request (response code: " + xhr.status + ", response text: " + xhr.responseText + ")";
    }
    _this.message = message;
    return _this;
  }

  return DetailedError;
}(Error);

exports.default = DetailedError;

},{}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilename = getFilename;

var _base = _dereq_('base62');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFilename() {
  _base2.default.setCharacterSet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
  var code = String(Date.now() / 7173 + Math.random(0, 1) * 17779);
  return code.substr(0, 8);
}

},{"base62":6}],4:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getSource = getSource;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileSource = function () {
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      return this._file.slice(start, end);
    }
  }, {
    key: "close",
    value: function close() {}
  }]);

  return FileSource;
}();

function getSource(input) {
  if (typeof input.slice === "function" && typeof input.size !== "undefined") {
    return new FileSource(input);
  }

  throw new Error("source object may only be an instance of File or Blob in this environment");
}

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _source = _dereq_('./source');

var _filename = _dereq_('./filename');

var _error = _dereq_('./error');

var _error2 = _interopRequireDefault(_error);

var _extend = _dereq_('extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var newRequest = function newRequest() {
  return new window.XMLHttpRequest();
};

var defaultOptions = {
  endpoint: "",
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  headers: {},
  chunkSize: Infinity,
  withCredentials: false,
  uploadUrl: null,
  uploadSize: null,
  overridePatchMethod: false,
  retryDelays: null
};

var Upload = function () {
  function Upload(file, options) {
    _classCallCheck(this, Upload);

    this.options = (0, _extend2.default)(true, {}, defaultOptions, options);

    // The underlying File/Blob object
    this.file = file;

    // The URL against which the file will be uploaded
    this.url = null;

    // The underlying XHR object for the current PUT request
    this._xhr = null;

    // The offset used in the current PUT request
    this._offset = null;

    // True if the current PUT request has been aborted
    this._aborted = false;

    // The file's size in bytes
    this._size = null;

    // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.
    this._source = null;

    // The current count of attempts which have been made. Null indicates none.
    this._retryAttempt = 0;

    // The timeout's ID which is used to delay the next retry
    this._retryTimeout = null;

    // The offset of the remote upload before the latest attempt was started.
    this._offsetBeforeRetry = 0;

    // The uuid is upyun return id for multiple upload
    this._uuid = null;
  }

  _createClass(Upload, [{
    key: '_emitXhrError',
    value: function _emitXhrError(xhr, err, causingErr) {
      this._emitError(new _error2.default(err, causingErr, xhr));
    }
  }, {
    key: '_emitError',
    value: function _emitError(err) {
      if (typeof this.options.onError === "function") {
        this.options.onError(err);
      } else {
        throw err;
      }
    }
  }, {
    key: '_emitSuccess',
    value: function _emitSuccess() {
      if (typeof this.options.onSuccess === "function") {
        this.options.onSuccess();
      }
    }
    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     * @param  {number} bytesSent  Number of bytes sent to the server.
     * @param  {number} bytesTotal Total number of bytes to be sent to the server.
     */

  }, {
    key: '_emitProgress',
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === "function") {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }

    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param  {number} chunkSize  Size of the chunk that was accepted by the
     *                             server.
     * @param  {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param  {number} bytesTotal Total number of bytes to be sent to the server.
     */

  }, {
    key: '_emitChunkComplete',
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === "function") {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }
  }, {
    key: '_setupXHR',
    value: function _setupXHR(xhr) {
      var headers = this.options.headers;

      for (var name in headers) {
        xhr.setRequestHeader(name, headers[name]);
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      var file = this.file;
      if (!file) {
        this._emitError(new Error("no file to upload provided"));
        return;
      }

      if (!this.options.endpoint) {
        this._emitError(new Error("no endpoint provided"));
        return;
      }
      var ext = '.' + file.name.split('.').pop();
      this.url = this.options.endpoint + (0, _filename.getFilename)() + ext;

      var source = this._source = (0, _source.getSource)(file, this.options.chunkSize);
      var size = source.size;
      this._size = size;
      var xhr = newRequest();
      xhr.open("PUT", this.url, true);

      xhr.onload = function (e) {
        if (!(xhr.status >= 200 && xhr.status < 300)) {
          _this._emitXhrError(xhr, new Error("unexpected response while creating upload"));
          return;
        }
        var nextId = Number(e.currentTarget.getResponseHeader('x-upyun-next-part-id'));
        _this._uuid = e.currentTarget.getResponseHeader('x-upyun-multi-uuid');
        _this._offset = 0;
        _this._startUpload(nextId);
      };

      xhr.onerror = function (err) {
        _this._emitXhrError(xhr, new Error("failed to create upload"), err);
      };

      this._setupXHR(xhr);
      xhr.setRequestHeader("X-Upyun-Multi-Stage", "initiate");
      xhr.setRequestHeader("X-Upyun-Multi-Length", size);

      xhr.send(null);
    }
  }, {
    key: '_startUpload',
    value: function _startUpload(nextId) {
      var _this2 = this;

      if (this._aborted) {
        return;
      }

      var xhr = this._xhr = newRequest();

      xhr.open("PUT", this.url, true);

      xhr.onload = function (e) {
        if (!(xhr.status >= 200 && xhr.status < 300)) {
          _this2._emitXhrError(xhr, new Error("unexpected response while uploading chunk"));
          return;
        }
        nextId = Number(e.currentTarget.getResponseHeader('x-upyun-next-part-id'));

        _this2._emitProgress(_this2._offset, _this2._size);
        //this._offset = offset;
        if (nextId == -1) return _this2._complete();

        _this2._startUpload(nextId);
      };

      xhr.onerror = function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this2._aborted) {
          return;
        }

        _this2._emitXhrError(xhr, new Error("failed to upload chunk at offset " + _this2._offset), err);
      };

      this._setupXHR(xhr);

      xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");
      xhr.setRequestHeader("x-upyun-multi-uuid", this._uuid);
      xhr.setRequestHeader("x-upyun-part-id", String(nextId));
      xhr.setRequestHeader("X-Upyun-Multi-Stage", "upload");
      var start = this._offset;
      var end = this._offset + this.options.chunkSize;

      // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.
      if (end === Infinity || end > this._size) {
        end = this._size;
      }
      this._offset = end;

      xhr.send(this._source.slice(start, end));
    }
  }, {
    key: '_complete',
    value: function _complete() {
      var _this3 = this;

      // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.
      if (this._aborted) {
        return;
      }

      var xhr = this._xhr = newRequest();

      xhr.open("PUT", this.url, true);

      xhr.onload = function () {
        if (!(xhr.status >= 200 && xhr.status < 300)) {
          _this3._emitXhrError(xhr, new Error("unexpected response while uploading chunk"));
          return;
        }

        var offset = _this3._offset;
        if (isNaN(offset)) {
          _this3._emitXhrError(xhr, new Error("invalid or missing offset value"));
          return;
        }

        // this._emitProgress(offset, this._size);
        // this._emitChunkComplete(offset - this._offset, offset, this._size);

        _this3._offset = offset;
        console.log(offset, _this3._size);
        if (offset == _this3._size) {
          // Yay, finally done :)
          _this3._emitSuccess();
          _this3._source.close();
          return;
        }
      };

      xhr.onerror = function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this3._aborted) {
          return;
        }

        _this3._emitXhrError(xhr, new Error("failed to upload chunk at offset " + _this3._offset), err);
      };

      this._setupXHR(xhr);

      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.setRequestHeader("X-Upyun-Multi-Stage", "complete");
      xhr.setRequestHeader("x-upyun-multi-uuid", this._uuid);
      var data = this.options.onCompletePostData || {};
      xhr.send(JSON.stringify(data));
    }
  }]);

  return Upload;
}();

Upload.defaultOptions = defaultOptions;

exports.default = Upload;

},{"./error":2,"./filename":3,"./source":4,"extend":7}],6:[function(_dereq_,module,exports){
module.exports = (function (Base62) {
    "use strict";

    var DEFAULT_CHARACTER_SET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    Base62.encode = function(integer){
        if (integer === 0) {return '0';}
        var s = '';
        while (integer > 0) {
            s = Base62.characterSet[integer % 62] + s;
            integer = Math.floor(integer/62);
        }
        return s;
    };

    var defaultCharsetDecode = function defaultCharsetDecode (base62String) {
        var value = 0,
            i = 0,
            length = base62String.length,
            charValue;

        for (; i < length; i++) {
            charValue = base62String.charCodeAt(i);

            if (charValue < 58) {
                charValue = charValue - 48;
            } else if (charValue < 91) {
                charValue = charValue - 29;
            } else {
                charValue = charValue - 87;
            }

            value += charValue * Math.pow(62, length - i - 1);
        }

        return value;
    };

    var customCharsetDecode = function customCharsetDecode (base62String) {
        var val = 0,
            i = 0,
            length = base62String.length,
            characterSet = Base62.characterSet;

        for (; i < length; i++) {
            val += characterSet.indexOf(base62String[i]) * Math.pow(62, length - i - 1);
        }

        return val;
    };

    var decodeImplementation = null;

    Base62.decode = function(base62String){
        return decodeImplementation(base62String);
    };

    Base62.setCharacterSet = function(chars) {
        var arrayOfChars = chars.split(""), uniqueCharacters = [];

        if(arrayOfChars.length !== 62) throw Error("You must supply 62 characters");

        arrayOfChars.forEach(function(char){
            if(!~uniqueCharacters.indexOf(char)) uniqueCharacters.push(char);
        });

        if(uniqueCharacters.length !== 62) throw Error("You must use unique characters.");

        Base62.characterSet = arrayOfChars;

        decodeImplementation = chars === DEFAULT_CHARACTER_SET ? defaultCharsetDecode : customCharsetDecode;
    };

    Base62.setCharacterSet(DEFAULT_CHARACTER_SET);
    return Base62;
}({}));

},{}],7:[function(_dereq_,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}]},{},[1])(1)
});
//# sourceMappingURL=multiple.js.map
