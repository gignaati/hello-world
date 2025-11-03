import { contextBridge, ipcRenderer } from 'electron';

import type { ElectronApi, RendererChannels } from '../types';

const invoke = <K extends keyof RendererChannels>(
  channel: K,
  ...args: Parameters<RendererChannels[K]>
) => ipcRenderer.invoke(channel, ...args) as ReturnType<RendererChannels[K]>;

const api: ElectronApi = {
  invoke,
  getSystemProfile: () => invoke('system-info:get'),
  checkRequirements: () => invoke('system-info:requirements'),
  openExternal: (url: string) => invoke('system:open-external', url),
};

contextBridge.exposeInMainWorld('electronAPI', api);
