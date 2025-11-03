import type { ElectronApi } from './system';

declare global {
  interface Window {
    electronAPI: ElectronApi;
  }
}

export {};
