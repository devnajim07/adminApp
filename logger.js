'use strict';

const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file'); 

const env = process.env.NODE_ENV || 'development'; 
const logDir = path.join(__dirname, 'logs'); 
let baseFilename = '';

if (module.parent?.parent?.filename) {
  baseFilename = module.parent.parent.filename;
} else if (module.parent?.filename) {
  baseFilename = module.parent.filename;
}

const logFilename = 'Admin_' + path.basename(baseFilename, path.extname(baseFilename));

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Format timestamp as required
const tsFormat = () => moment().format('YYYY-MM-DD HH:mm:ss:SSS').trim();

// Create the logger instance
const logger = createLogger({
  level: env === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({ label: path.basename(module.parent?.filename || 'unknown') }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
    new DailyRotateFile({
      filename: `${logDir}/${logFilename}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '5m',
      maxFiles: '21d',
      format: format.combine(
        format.timestamp({ format: tsFormat }),
        format.json()
      ),
    }),
  ],
});

module.exports = logger;
