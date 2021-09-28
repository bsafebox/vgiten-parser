'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _version_1 = require("./_version");
const error_codes_1 = require("./error-codes");
const logMethods = ['trace', 'debug', 'info', 'warn', 'error'];
const LogLevels = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5,
};
function persistLevelIfPossible(levelNum) {
    const levelName = (logMethods[levelNum] || 'silent').toUpperCase();
    if (typeof window === undefined || !this.storageKey) {
        return;
    }
    try {
        window.localStorage[this.storageKey] = levelName;
        return;
    }
    catch (ignore) {
        // ignore
    }
    // Use session cookie as fallback
    try {
        window.document.cookie =
            encodeURIComponent(this.storageKey) + '=' + levelName + ';';
    }
    catch (ignore) {
        // ignore
    }
}
function getPersistedLevel() {
    let storedLevel;
    if (typeof window === undefined || !this.storageKey)
        return storedLevel;
    try {
        storedLevel = window.localStorage[this.storageKey];
    }
    catch (ignore) { }
    if (typeof storedLevel === undefined) {
        try {
            const cookie = window.document.cookie;
            const location = cookie.indexOf(encodeURIComponent(this.storageKey) + '=');
            if (location !== -1) {
                storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
            }
        }
        catch (ignore) { }
    }
    // If the stored level is not valid, treat it as if nothing was stored.
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
class Log {
    version;
    name;
    storageKey;
    currentLevel;
    levels = LogLevels;
    static errors = error_codes_1.ErrorCode;
    static LogLevels = LogLevels;
    methodFactory;
    constructor(name, defaultLevel, factory) {
        Object.defineProperty(this, 'version', {
            enumerable: true,
            value: _version_1.version || 'develop',
            writable: false,
        });
        if (typeof name === 'string') {
            this.storageKey += ':' + name;
        }
        else if (typeof name === 'symbol') {
            this.storageKey = undefined;
        }
        this.name = name;
        // this.methodFactory = factory || defaultMethodFactory;
        let initialLevel = getPersistedLevel.call(this);
        if (!initialLevel) {
            initialLevel = defaultLevel === undefined ? 'WARN' : defaultLevel;
        }
        this.setLevel(initialLevel, false);
    }
    getLevel() {
        return this.currentLevel < LogLevels.TRACE ||
            this.currentLevel > LogLevels.ERROR
            ? LogLevels.WARN
            : this.currentLevel;
    }
    trace(...args) {
        _log.call(this, LogLevels.TRACE, args);
    }
    debug(...args) {
        _log.call(this, LogLevels.DEBUG, args);
    }
    info(...args) {
        _log.call(this, LogLevels.INFO, args);
    }
    warn(...args) {
        _log.call(this, LogLevels.WARN, args);
    }
    error(...args) {
        _log.call(this, LogLevels.ERROR, args);
    }
    setLevel(level, persist) {
        if (typeof level === 'string' &&
            this.levels[level.toLocaleUpperCase()] !== undefined) {
            level = this.levels[level.toLocaleUpperCase()];
        }
        if (typeof level === 'number' &&
            level >= 0 &&
            level <= this.levels.SILENT) {
            this.currentLevel = level;
            if (persist !== false) {
                persistLevelIfPossible.call(this, level);
            }
            // replaceLoggingMethods.call(this, level, this.name);
            if (typeof console === undefined && level < this.levels.SILENT) {
                return 'No console available for logging';
            }
        }
        else {
            throw new Error(`logger.setLevel() called with invalid level: ${level}`);
        }
    }
    setDefaultLevel(level) {
        if (!getPersistedLevel.call(this)) {
            this.setLevel(level, false);
        }
    }
}
const logger = new Log();
exports.default = logger;
//# sourceMappingURL=logger.js.map