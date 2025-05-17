const blessed = require('blessed');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const metrics = require('./utils/metrics');
const serviceManager = require('./utils/serviceManager');
const createLogger = require('../shared/utils/logger');

let originalLog = console.log;

const promptUser = async () => {
  const configFiles = fs
    .readdirSync(path.resolve(__dirname, '../config'))
    .filter(file => file.endsWith('.json'));

  const { config } = await inquirer.prompt([
    {
      type: 'list',
      name: 'config',
      message: chalk.cyan('Select configuration to use:'),
      choices: configFiles
    }
  ]);

  const serviceList = serviceManager.getServiceList();
  const { selectedServices } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedServices',
      message: chalk.green('Select services to start:'),
      choices: serviceList
    }
  ]);

  return { config, selectedServices };
};

const startUI = ({ config, selectedServices }) => {
  setTimeout(() => {
    const screen = blessed.screen({
      smartCSR: true,
      title: '✨ Hypervisor ✨'
    });

    const metricsBox = blessed.box({
      top: 0,
      left: 0,
      width: '50%',
      height: '30%',
      label: ' Live Metrics ',
      border: { type: 'line' },
      style: { border: { fg: 'cyan' } },
      tags: true
    });

    const servicesBox = blessed.box({
      top: '30%',
      left: 0,
      width: '50%',
      height: '70%',
      label: ' Services ',
      border: { type: 'line' },
      style: { border: { fg: 'green' } },
      tags: true
    });

    const logBox = blessed.box({
      top: 0,
      left: '50%',
      width: '50%',
      height: '100%',
      label: ' Logs ',
      border: { type: 'line' },
      style: { border: { fg: 'yellow' } },
      tags: true,
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        track: { bg: 'gray' },
        style: { bg: 'yellow' }
      }
    });

    screen.append(metricsBox);
    screen.append(servicesBox);
    screen.append(logBox);
    screen.render();

    console.log = (...args) => {
      const line = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
      logBox.pushLine(line);
      logBox.setScrollPerc(100);
      screen.render();
    };

    const logger = createLogger('Hypervisor');
    logger.info('Hypervisor initialized!');
    logger.info(`Loaded config: ${config}`);

    selectedServices.forEach(name => {
      logger.info(`Starting ${name}...`);
      serviceManager.startService(name);
    });

    async function updateMetrics() {
      const cpu = await metrics.getCPUUsage();
      const mem = metrics.getMemoryUsage();
      metricsBox.setContent(`CPU Usage: ${cpu}\nMemory Usage: ${mem}`);
      screen.render();
    }

    function updateServices() {
      const list = serviceManager.getServiceList();
      const statusList = list.map(name => {
        const running = serviceManager.getServiceStatus(name);
        return `${running ? '{green-fg}●{/green-fg}' : '{red-fg}○{/red-fg}'} ${name}`;
      });
      servicesBox.setContent(statusList.join('\n'));
      screen.render();
    }

    screen.key(['r'], () => {
        console.log = originalLog;
        screen.destroy();
      
        // Fully reset stdin state
        const stdin = process.stdin;
        if (stdin.isTTY) {
          stdin.setRawMode(false);
          stdin.removeAllListeners('data'); // remove blessed listeners
          stdin.pause();
        }
      
        // Re-enable clean stdin for inquirer
        process.stdin = fs.createReadStream('/dev/tty');
        process.stdin.setRawMode(false);
        process.stdin.resume();
      
        setTimeout(async () => {
          process.stdout.write('\x1B[?25h');
      
          const services = serviceManager.getServiceList();
          const { toRestart } = await inquirer.prompt([
            {
              type: 'list',
              name: 'toRestart',
              message: chalk.yellow('Restart which service?'),
              choices: services
            }
          ]);
      
          serviceManager.restartService(toRestart);
          startUI({ config, selectedServices });
        }, 150);
      });

    screen.key(['escape', 'q', 'C-c'], () => {
      console.log = originalLog;
      process.exit(0);
    });

    updateMetrics();
    updateServices();
    setInterval(() => {
      updateMetrics();
      updateServices();
    }, 3000);
  }, 100);
};

promptUser().then(startUI);