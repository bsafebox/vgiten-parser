
/**
 * vgiten : @bsafebox/logger v0.0.1
 * (c) 2020-2021 by nbsdev, All rights reserved.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Log = {}));
})(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
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

  var LogLevels = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5
  };
  var Log = function Log(name, defaultLevel, factory) {
    _classCallCheck(this, Log);

    this.version = version ;
    this.name = name;
  };

  _defineProperty(Log, "LogLevels", LogLevels);

  exports.Log = Log;
  exports.LogLevels = LogLevels;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
