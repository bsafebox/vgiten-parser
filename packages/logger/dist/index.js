
/**
 * vgiten : @bsafebox/logger v0.0.1
 * (c) 2020-2021 by nbsdev, All rights reserved.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.logger = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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

  var version = 'v0.1.0';

  var ErrorCode;

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
  })(ErrorCode || (ErrorCode = {}));

  var logMethods = ['trace', 'debug', 'info', 'warn', 'error'];
  var LogLevels = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5
  };

  function persistLevelIfPossible(levelNum) {
    var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === undefined || !this.storageKey) {
      return;
    }

    try {
      window.localStorage[this.storageKey] = levelName;
      return;
    } catch (ignore) {// ignore
    } // Use session cookie as fallback


    try {
      window.document.cookie = encodeURIComponent(this.storageKey) + '=' + levelName + ';';
    } catch (ignore) {// ignore
    }
  }

  function getPersistedLevel() {
    var storedLevel;
    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === undefined || !this.storageKey) return storedLevel;

    try {
      storedLevel = window.localStorage[this.storageKey];
    } catch (ignore) {}

    if (_typeof(storedLevel) === undefined) {
      try {
        var cookie = window.document.cookie;
        var location = cookie.indexOf(encodeURIComponent(this.storageKey) + '=');

        if (location !== -1) {
          storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
        }
      } catch (ignore) {}
    } // If the stored level is not valid, treat it as if nothing was stored.


    if (Log.LogLevels[storedLevel] === undefined) {
      storedLevel = undefined;
    }

    return storedLevel;
  }

  function _log(level, args) {
    if (level < this.getLevel()) {
      return;
    }

    console.log.apply(console, args);
  }

  var Log = /*#__PURE__*/function () {
    function Log(name, defaultLevel, factory) {
      _classCallCheck(this, Log);

      _defineProperty(this, "levels", LogLevels);

      Object.defineProperty(this, 'version', {
        enumerable: true,
        value: version ,
        writable: false
      });

      if (typeof name === 'string') {
        this.storageKey += ':' + name;
      } else if (_typeof(name) === 'symbol') {
        this.storageKey = undefined;
      }

      this.name = name; // this.methodFactory = factory || defaultMethodFactory;

      var initialLevel = getPersistedLevel.call(this);

      if (!initialLevel) {
        initialLevel = defaultLevel === undefined ? 'WARN' : defaultLevel;
      }

      this.setLevel(initialLevel, false);
    }

    _createClass(Log, [{
      key: "getLevel",
      value: function getLevel() {
        return this.currentLevel < LogLevels.TRACE || this.currentLevel > LogLevels.ERROR ? LogLevels.WARN : this.currentLevel;
      }
    }, {
      key: "trace",
      value: function trace() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _log.call(this, LogLevels.TRACE, args);
      }
    }, {
      key: "debug",
      value: function debug() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        _log.call(this, LogLevels.DEBUG, args);
      }
    }, {
      key: "info",
      value: function info() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        _log.call(this, LogLevels.INFO, args);
      }
    }, {
      key: "warn",
      value: function warn() {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        _log.call(this, LogLevels.WARN, args);
      }
    }, {
      key: "error",
      value: function error() {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        _log.call(this, LogLevels.ERROR, args);
      }
    }, {
      key: "setLevel",
      value: function setLevel(level, persist) {
        if (typeof level === 'string' && this.levels[level.toLocaleUpperCase()] !== undefined) {
          level = this.levels[level.toLocaleUpperCase()];
        }

        if (typeof level === 'number' && level >= 0 && level <= this.levels.SILENT) {
          this.currentLevel = level;

          if (persist !== false) {
            persistLevelIfPossible.call(this, level);
          } // replaceLoggingMethods.call(this, level, this.name);


          if ((typeof console === "undefined" ? "undefined" : _typeof(console)) === undefined && level < this.levels.SILENT) {
            return 'No console available for logging';
          }
        } else {
          throw new Error("logger.setLevel() called with invalid level: ".concat(level));
        }
      }
    }, {
      key: "setDefaultLevel",
      value: function setDefaultLevel(level) {
        if (!getPersistedLevel.call(this)) {
          this.setLevel(level, false);
        }
      }
    }]);

    return Log;
  }();

  _defineProperty(Log, "errors", ErrorCode);

  _defineProperty(Log, "LogLevels", LogLevels);

  var logger = new Log();

  return logger;

}));
