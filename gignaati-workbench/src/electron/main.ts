import { app, BrowserWindow, ipcMain, shell } from 'electron';

import { cpu, graphics, mem, osInfo, time } from 'systeminformation';

import type { SystemProfile } from '../types';
import { buildRequirementChecks } from '../utils/requirements';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const isMac = process.platform === 'darwin';
const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

const gatherSystemProfile = async (): Promise<SystemProfile> => {
  const [memoryInfo, cpuInfo, graphicsInfo, osInfoData, timeInfo] = await Promise.all([
    mem(),
    cpu(),
    graphics(),
    osInfo(),
    time(),
  ]);

  const memoryTotalGb = memoryInfo.total / 1024 ** 3;
  const memoryFreeGb = memoryInfo.available / 1024 ** 3;

  const gpuControllers = graphicsInfo.controllers ?? [];
  const gpus = gpuControllers.map((controller) => ({
    name: controller.model || controller.name || 'Unknown GPU',
    vendor: controller.vendor || 'Unknown',
    vramTotalGB: controller.vram ? controller.vram / 1024 : null,
    vramFreeGB: null,
    driverVersion: controller.driverVersion ?? null,
  }));

  const topGpuVram = gpus
    .map((gpu) => gpu.vramTotalGB ?? 0)
    .reduce((max, value) => Math.max(max, value), 0);

  const requirements = buildRequirementChecks(memoryTotalGb, topGpuVram || null);

  const potentialNpu = gpuControllers.find((controller) =>
    /(neural|npu|tensor)/i.test(controller.name ?? controller.model ?? ''),
  );

  return {
    cpu: {
      brand: cpuInfo.brand,
      manufacturer: cpuInfo.manufacturer,
      physicalCores: cpuInfo.physicalCores ?? 0,
      logicalCores: cpuInfo.cores ?? 0,
      speedGHz: cpuInfo.speed ? Number(cpuInfo.speed) : null,
    },
    gpus,
    memory: {
      totalGB: Number(memoryTotalGb.toFixed(2)),
      freeGB: Number(memoryFreeGb.toFixed(2)),
    },
    npu: potentialNpu
      ? {
          name: potentialNpu.model || potentialNpu.name || 'Neural Processor',
          vendor: potentialNpu.vendor,
          type: potentialNpu.bus,
        }
      : null,
    overview: {
      hostname: osInfoData.hostname ?? 'Unknown Host',
      platform: osInfoData.platform,
      distro: osInfoData.distro,
      release: osInfoData.release,
      arch: osInfoData.arch,
      uptime: timeInfo.uptime,
    },
    requirements,
    timestamp: Date.now(),
  };
};

const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1180,
    minHeight: 720,
    backgroundColor: '#020617',
    titleBarStyle: isMac ? 'hiddenInset' : 'default',
    trafficLightPosition: isMac ? { x: 12, y: 18 } : undefined,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      sandbox: false,
    },
  });

  await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
};

const registerIpcHandlers = () => {
  ipcMain.handle('system-info:get', async () => gatherSystemProfile());

  ipcMain.handle('system-info:requirements', async () => {
    const profile = await gatherSystemProfile();
    return profile.requirements;
  });

  ipcMain.handle('system:open-external', async (_event, url: string) => {
    if (!url) return;
    await shell.openExternal(url);
  });
};

const init = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  if (require('electron-squirrel-startup')) {
    app.quit();
    return;
  }

  await app.whenReady();

  registerIpcHandlers();
  await createMainWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
};

void init();

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});
