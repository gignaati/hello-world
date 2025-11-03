import type { RequirementCheck } from '@types';

export const MIN_RAM_GB = 16;
export const MIN_VRAM_GB = 12;

export const buildRequirementChecks = (
  ramTotal: number,
  topGpuVram: number | null,
): RequirementCheck[] => {
  const ramCheck: RequirementCheck = {
    label: 'System RAM',
    required: MIN_RAM_GB,
    actual: Number.isFinite(ramTotal) ? ramTotal : 0,
    unit: 'GB',
    met: ramTotal >= MIN_RAM_GB,
  };

  const vramActual = topGpuVram ?? 0;

  const vramCheck: RequirementCheck = {
    label: 'GPU VRAM',
    required: MIN_VRAM_GB,
    actual: vramActual,
    unit: 'GB',
    met: vramActual >= MIN_VRAM_GB,
  };

  return [ramCheck, vramCheck];
};

export const hasMetMinimumSpec = (checks: RequirementCheck[]): boolean =>
  checks.every((check) => check.met);
