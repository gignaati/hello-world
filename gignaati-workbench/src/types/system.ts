export interface MemoryInfo {
  totalGB: number;
  freeGB: number;
}

export interface GpuInfo {
  name: string;
  vendor: string;
  vramTotalGB: number | null;
  vramFreeGB: number | null;
  driverVersion?: string | null;
}

export interface CpuInfo {
  brand: string;
  manufacturer: string;
  physicalCores: number;
  logicalCores: number;
  speedGHz: number | null;
}

export interface NpuInfo {
  name: string;
  vendor?: string;
  type?: string;
}

export interface SystemOverview {
  hostname: string;
  platform: string;
  distro: string;
  release: string;
  arch: string;
  uptime: number;
}

export interface RequirementCheck {
  label: string;
  required: number;
  actual: number;
  unit: 'GB';
  met: boolean;
}

export interface SystemProfile {
  cpu: CpuInfo;
  gpus: GpuInfo[];
  memory: MemoryInfo;
  npu?: NpuInfo | null;
  overview: SystemOverview;
  requirements: RequirementCheck[];
  timestamp: number;
}

export interface IntegrationHealth {
  service: 'ollama' | 'n8n';
  status: 'online' | 'offline' | 'unknown';
  endpoint: string;
  lastChecked: number | null;
  meta?: Record<string, string | number | boolean | null>;
}

export type RendererChannels = {
  'system-info:get': () => Promise<SystemProfile>;
  'system-info:requirements': () => Promise<RequirementCheck[]>;
  'system:open-external': (url: string) => Promise<void>;
};

export type ElectronApi = {
  invoke: <K extends keyof RendererChannels>(channel: K, ...args: Parameters<RendererChannels[K]>) => ReturnType<RendererChannels[K]>;
  getSystemProfile: () => Promise<SystemProfile>;
  checkRequirements: () => Promise<RequirementCheck[]>;
  openExternal: (url: string) => Promise<void>;
};
