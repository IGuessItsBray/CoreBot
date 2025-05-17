const chalk = require('chalk');

const levels = {
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  debug: chalk.gray,
};

function createLogger(serviceName) {
  const logger = {
    stream: null, // 🔹 External stream like TUI

    info: (...args) => log('info', serviceName, ...args),
    warn: (...args) => log('warn', serviceName, ...args),
    error: (...args) => log('error', serviceName, ...args),
    debug: (...args) => log('debug', serviceName, ...args),
  };

  function log(level, service, ...args) {
    const color = levels[level] || ((x) => x);
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${service}] [${level.toUpperCase()}]`;
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
    const finalLog = `${prefix} ${message}`;

    // Always console.log with color
    console.log(color(prefix), ...args);

    // 🔹 Also stream raw (non-colored) version into logBox
    if (typeof logger.stream === 'function') {
      logger.stream(finalLog);
    }
  }

  return logger;
}

module.exports = createLogger;