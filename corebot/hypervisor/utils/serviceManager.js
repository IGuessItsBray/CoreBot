const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const createLogger = require('../../shared/utils/logger');
const logger = createLogger('ServiceManager');

const services = [
  {
    name: 'Bot',
    path: '../../apps/bot/index.js'
  },
  {
    name: 'Gateway',
    path: '../../apps/gateway/index.js'
  },
  {
    name: 'API',
    path: '../../apps/api/index.js'
  },
  {
    name: 'Dashboard',
    path: '../../apps/dashboard/index.js'
  },
  {
    name: 'CDN',
    path: '../../apps/cdn/index.js'
  }
];

const serviceInstances = {};

function getServiceList() {
  return services
    .filter(service => fs.existsSync(path.resolve(__dirname, service.path)))
    .map(service => service.name);
}

function startService(name) {
  const service = services.find(s => s.name === name);
  if (!service || serviceInstances[name]) return;

  const fullPath = path.resolve(__dirname, service.path);
  const proc = spawn('node', [fullPath], {
    shell: true,
    env: process.env
  });

  proc.stdout.on('data', data => {
    const line = `[${name}] ${data.toString().trim()}`;
    if (logger.stream && typeof logger.stream === 'function') {
      logger.stream(line);
    } else {
      logger.info(line);
    }
  });

  proc.stderr.on('data', data => {
    const line = `[${name}] ${data.toString().trim()}`;
    if (logger.stream && typeof logger.stream === 'function') {
      logger.stream(line);
    } else {
      logger.error(line);
    }
  });

  proc.on('close', code => {
    logger.warn(`${name} exited with code ${code}`);
    delete serviceInstances[name];
  });

  serviceInstances[name] = proc;
}

function stopService(name) {
  const proc = serviceInstances[name];
  if (proc) {
    proc.kill('SIGTERM');
    delete serviceInstances[name];
  }
}

function restartService(name) {
  stopService(name);
  setTimeout(() => startService(name), 1000);
}

function getServiceStatus(name) {
  return !!serviceInstances[name];
}

module.exports = {
  getServiceList,
  startService,
  stopService,
  restartService,
  getServiceStatus
};
