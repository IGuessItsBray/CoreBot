const os = require('os');

// Get average CPU usage over 100ms
async function getCPUUsage() {
  const start = cpuInfo();

  await new Promise(resolve => setTimeout(resolve, 100));

  const end = cpuInfo();
  const idleDiff = end.idle - start.idle;
  const totalDiff = end.total - start.total;

  const cpuPercent = 100 - Math.round((idleDiff / totalDiff) * 100);
  return `${cpuPercent}%`;
}

function cpuInfo() {
  const cpus = os.cpus();
  const total = cpus.reduce((acc, cpu) => {
    const { user, nice, sys, idle, irq } = cpu.times;
    acc.idle += idle;
    acc.total += user + nice + sys + idle + irq;
    return acc;
  }, { idle: 0, total: 0 });
  return total;
}

// Get current memory usage
function getMemoryUsage() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usedMB = Math.round(used / 1024 / 1024);
    const totalMB = Math.round(total / 1024 / 1024);
    return `${usedMB}MB / ${totalMB}MB`;
  }

module.exports = {
  getCPUUsage,
  getMemoryUsage
};