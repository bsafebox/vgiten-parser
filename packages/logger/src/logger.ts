'use strict';

import { version } from './_version';

// 减小minize 文件大小
const noop = function () {};

const logMethods = ['trace', 'debug', 'info', 'warn', 'error'];

export const LogLevels: { [name: string]: number } = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  SILENT: 5,
};

export class Log {
  readonly version: string;
  name: string | undefined;



  static LogLevels: { [name: string]: number } = LogLevels;
  constructor(name: string | undefined, defaultLevel:string|number|undefined, factory) {
    this.version = version || '0.0.0';
    this.name = name;
  }
}

export default const logger = new Log()
