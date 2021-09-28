'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var version = 'logger/0.1.0';
var _permanentCensorErrors = false;
var _censorErrors = false;
var LogLevels = {
  debug: 1,
  "default": 2,
  info: 2,
  warning: 3,
  error: 4,
  off: 5
};
var _logLevel = LogLevels['default'];
var _globalLogger = null;

function _checkNormalize() {
  try {
    var missing = []; // Make sure all forms of normalization are supported

    ['NFD', 'NFC', 'NFKD', 'NFKC'].forEach(function (form) {
      try {
        if ('test'.normalize(form) !== 'test') {
          throw new Error('bad normalize');
        }
      } catch (error) {
        missing.push(form);
      }
    });

    if (missing.length) {
      throw new Error('missing' + missing.join(', '));
    }

    if (String.fromCharCode(0xe9).normalize('NFD') !== String.fromCharCode(0x65, 0x0301)) {
      throw new Error('broken implementation');
    }
  } catch (err) {
    return err.message;
  }

  return null;
}

var _normalizeError = _checkNormalize();

exports.LogLevel = void 0;

(function (LogLevel) {
  LogLevel["DEBUG"] = "DEBUG";
  LogLevel["INFO"] = "INFO";
  LogLevel["WARNING"] = "WARNING";
  LogLevel["ERROR"] = "ERROR";
  LogLevel["OFF"] = "OFF";
})(exports.LogLevel || (exports.LogLevel = {}));

exports.ErrorCode = void 0;

(function (ErrorCode) {
  ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
  ErrorCode["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
  ErrorCode["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
  ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
  ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
  ErrorCode["TIMEOUT"] = "TIMEOUT";
  ErrorCode["BUFFER_OVERRUN"] = "BUFFER_OVERRUN";
  ErrorCode["NUMERIC_FAULT"] = "NUMERIC_FAULT";
  ErrorCode["MISSING_NEW"] = "MISSING_NEW";
  ErrorCode["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
  ErrorCode["MISSING_ARGUMENT"] = "MISSING_ARGUMENT";
  ErrorCode["UNEXPECTED_ARGUMENT"] = "UNEXPECTED_ARGUMENT";
  ErrorCode["CALL_EXCEPTION"] = "CALL_EXCEPTION";
  ErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
  ErrorCode["NONCE_EXPIRED"] = "NONCE_EXPIRED";
  ErrorCode["REPLACEMENT_UNDERPRICED"] = "REPLACEMENT_UNDERPRICED";
  ErrorCode["UNPREDICTABLE_GAS_LIMIT"] = "UNPREDICTABLE_GAS_LIMIT";
  ErrorCode["TRANSACTION_REPLACED"] = "TRANSACTION_REPLACED";
})(exports.ErrorCode || (exports.ErrorCode = {}));

var Logger = /*#__PURE__*/function () {
  function Logger(version) {
    _classCallCheck(this, Logger);

    Object.defineProperty(this, 'version', {
      enumerable: true,
      value: version,
      writable: false
    });
  }

  _createClass(Logger, [{
    key: "_log",
    value: function _log(logLevel, args) {
      var level = logLevel.toLocaleLowerCase();

      if (LogLevels[level] == null) {
        this.throwArgumentError('invalid log level name', 'logLevel', logLevel);
      }

      if (_logLevel > LogLevels[level]) {
        return;
      }

      console.log.apply(console, args);
    }
  }, {
    key: "debug",
    value: function debug() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this._log(Logger.levels.DEBUG, args);
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this._log(Logger.levels.INFO, args);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this._log(Logger.levels.WARNING, args);
    }
  }, {
    key: "makeError",
    value: function makeError(message, code, params) {
      // Errors are being censored
      if (_censorErrors) {
        return this.makeError('censored error', code, {});
      }

      if (!code) {
        code = Logger.errors.UNKNOWN_ERROR;
      }

      if (!params) {
        params = {};
      }

      var messageDetails = [];
      Object.keys(params).forEach(function (key) {
        try {
          messageDetails.push(key + '=' + JSON.stringify(params[key]));
        } catch (error) {
          messageDetails.push(key + '=' + JSON.stringify(params[key].toString()));
        }
      });
      messageDetails.push("code=".concat(code));
      messageDetails.push("version=".concat(this.version));
      var reason = message;

      if (messageDetails.length) {
        message += ' (' + messageDetails.join(', ') + ')';
      } // @TODO: Any??


      var error = new Error(message);
      error.reason = reason;
      error.code = code;
      Object.keys(params).forEach(function (key) {
        error[key] = params[key];
      });
      return error;
    }
  }, {
    key: "throwError",
    value: function throwError(message, code, params) {
      throw this.makeError(message, code, params);
    }
  }, {
    key: "throwArgumentError",
    value: function throwArgumentError(message, name, value) {
      return this.throwError(message, Logger.errors.INVALID_ARGUMENT, {
        argument: name,
        value: value
      });
    }
  }, {
    key: "assert",
    value: function assert(condition, message, code, params) {
      if (!!condition) {
        return;
      }

      this.throwError(message, code, params);
    }
  }, {
    key: "assertArgument",
    value: function assertArgument(condition, message, name, value) {
      if (!!condition) {
        return;
      }

      this.throwArgumentError(message, name, value);
    }
  }, {
    key: "checkNormalize",
    value: function checkNormalize(message) {

      if (_normalizeError) {
        this.throwError('platform missing String.prototype.normalize', Logger.errors.UNSUPPORTED_OPERATION, {
          operation: 'String.prototype.normalize',
          form: _normalizeError
        });
      }
    }
  }, {
    key: "checkSafeUint53",
    value: function checkSafeUint53(value, message) {
      if (typeof value !== 'number') {
        return;
      }

      if (message == null) {
        message = 'value not safe';
      }

      if (value < 0 || value >= 0x1fffffffffffff) {
        this.throwError(message, Logger.errors.NUMERIC_FAULT, {
          operation: 'checkSafeInteger',
          fault: 'out-of-safe-range',
          value: value
        });
      }

      if (value % 1) {
        this.throwError(message, Logger.errors.NUMERIC_FAULT, {
          operation: 'checkSafeInteger',
          fault: 'non-integer',
          value: value
        });
      }
    }
  }, {
    key: "checkArgumentCount",
    value: function checkArgumentCount(count, expectedCount, message) {
      if (message) {
        message = ': ' + message;
      } else {
        message = '';
      }

      if (count < expectedCount) {
        this.throwError('missing argument' + message, Logger.errors.MISSING_ARGUMENT, {
          count: count,
          expectedCount: expectedCount
        });
      }

      if (count > expectedCount) {
        this.throwError('too many arguments' + message, Logger.errors.UNEXPECTED_ARGUMENT, {
          count: count,
          expectedCount: expectedCount
        });
      }
    }
  }, {
    key: "checkNew",
    value: function checkNew(target, kind) {
      if (target === Object || target == null) {
        this.throwError('missing new', Logger.errors.MISSING_NEW, {
          name: kind.name
        });
      }
    }
  }, {
    key: "checkAbstract",
    value: function checkAbstract(target, kind) {
      if (target === kind) {
        this.throwError('cannot instantiate abstract class ' + JSON.stringify(kind.name) + ' directly; use a sub-class', Logger.errors.UNSUPPORTED_OPERATION, {
          name: target.name,
          operation: 'new'
        });
      } else if (target === Object || target == null) {
        this.throwError('missing new', Logger.errors.MISSING_NEW, {
          name: kind.name
        });
      }
    }
  }], [{
    key: "globalLogger",
    value: function globalLogger() {
      if (!_globalLogger) {
        _globalLogger = new Logger(version);
      }

      return _globalLogger;
    }
  }, {
    key: "setCensorship",
    value: function setCensorship(censorship, permanent) {
      if (!censorship && permanent) {
        this.globalLogger().throwError('cannot permanently disable censorship', Logger.errors.UNSUPPORTED_OPERATION, {
          operation: 'setCensorship'
        });
      }

      if (_permanentCensorErrors) {
        if (!censorship) {
          return;
        }

        this.globalLogger().throwError('error censorship permanent', Logger.errors.UNSUPPORTED_OPERATION, {
          operation: 'setCensorship'
        });
      }

      _censorErrors = !!censorship;
      _permanentCensorErrors = !!permanent;
    }
  }, {
    key: "setLogLevel",
    value: function setLogLevel(logLevel) {
      var level = LogLevels[logLevel.toLowerCase()];

      if (level == null) {
        Logger.globalLogger().warn('invalid log level - ' + logLevel);
        return;
      }

      _logLevel = level;
    }
  }, {
    key: "from",
    value: function from(version) {
      return new Logger(version);
    }
  }]);

  return Logger;
}();

_defineProperty(Logger, "errors", exports.ErrorCode);

_defineProperty(Logger, "levels", exports.LogLevel);

exports.Logger = Logger;
exports.version = version;
