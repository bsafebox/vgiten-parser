'use strict';
import { version } from './_version';
import { ErrorCode } from './error-codes';

const logMethods: string[] = ['trace', 'debug', 'info', 'warn', 'error'];

type LogLevel = string | number | undefined | null;

const LogLevels: { [name: string]: number } = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  SILENT: 5,
};

function persistLevelIfPossible(levelNum: number) {
  const levelName = (logMethods[levelNum] || 'silent').toUpperCase();

  if (typeof window === undefined || !this.storageKey) {
    return;
  }

  try {
    window.localStorage[this.storageKey] = levelName;
    return;
  } catch (ignore) {
    // ignore
  }

  // Use session cookie as fallback
  try {
    window.document.cookie =
      encodeURIComponent(this.storageKey) + '=' + levelName + ';';
  } catch (ignore) {
    // ignore
  }
}

function getPersistedLevel(): string | undefined {
  let storedLevel;
  if (typeof window === undefined || !this.storageKey) return storedLevel;

  try {
    storedLevel = window.localStorage[this.storageKey];
  } catch (ignore) {}

  if (typeof storedLevel === undefined) {
    try {
      const cookie = window.document.cookie;
      const location = cookie.indexOf(
        encodeURIComponent(this.storageKey) + '='
      );

      if (location !== -1) {
        storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
      }
    } catch (ignore) {}
  }

  // If the stored level is not valid, treat it as if nothing was stored.
  if (Log.LogLevels[storedLevel] === undefined) {
    storedLevel = undefined;
  }

  return storedLevel;
}

function _log(level: number, args: Array<any>): void {
  if (level < this.getLevel()) {
    return;
  }

  console.log.apply(console, args);
}

class Log {
  readonly version: string;
  name: string | undefined;
  storageKey: string | undefined;
  currentLevel: number;

  levels: { [name: string]: number } = LogLevels;

  static errors = ErrorCode;
  static LogLevels: { [name: string]: number } = LogLevels;
  methodFactory: Function;

  constructor(name?: string, defaultLevel?: LogLevel, factory?: Function) {
    Object.defineProperty(this, 'version', {
      enumerable: true,
      value: version || 'develop',
      writable: false,
    });

    if (typeof name === 'string') {
      this.storageKey += ':' + name;
    } else if (typeof name === 'symbol') {
      this.storageKey = undefined;
    }

    this.name = name;

    // this.methodFactory = factory || defaultMethodFactory;

    let initialLevel: LogLevel = getPersistedLevel.call(this);

    if (!initialLevel) {
      initialLevel = defaultLevel === undefined ? 'WARN' : defaultLevel;
    }

    this.setLevel(initialLevel, false);
  }

  getLevel(): number | string {
    return this.currentLevel < LogLevels.TRACE ||
      this.currentLevel > LogLevels.ERROR
      ? LogLevels.WARN
      : this.currentLevel;
  }

  trace(...args: Array<any>): void {
    _log.call(this, LogLevels.TRACE, args);
  }

  debug(...args: Array<any>): void {
    _log.call(this, LogLevels.DEBUG, args);
  }

  info(...args: Array<any>): void {
    _log.call(this, LogLevels.INFO, args);
  }

  warn(...args: Array<any>): void {
    _log.call(this, LogLevels.WARN, args);
  }

  error(...args: Array<any>): void {
    _log.call(this, LogLevels.ERROR, args);
  }

  setLevel(level: LogLevel, persist: boolean): any {
    if (
      typeof level === 'string' &&
      this.levels[level.toLocaleUpperCase()] !== undefined
    ) {
      level = this.levels[level.toLocaleUpperCase()];
    }

    if (
      typeof level === 'number' &&
      level >= 0 &&
      level <= this.levels.SILENT
    ) {
      this.currentLevel = level;

      if (persist !== false) {
        persistLevelIfPossible.call(this, level);
      }

      // replaceLoggingMethods.call(this, level, this.name);

      if (typeof console === undefined && level < this.levels.SILENT) {
        return 'No console available for logging';
      }
    } else {
      throw new Error(`logger.setLevel() called with invalid level: ${level}`);
    }
  }

  setDefaultLevel(level: number | string): void {
    if (!getPersistedLevel.call(this)) {
      this.setLevel(level, false);
    }
  }
}

const logger: Log = new Log();
export default logger;
