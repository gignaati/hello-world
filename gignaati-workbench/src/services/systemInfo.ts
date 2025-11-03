import type { RequirementCheck, SystemProfile } from '@types';

export const fetchSystemProfile = async (): Promise<SystemProfile> => {
  return window.electronAPI.getSystemProfile();
};

export const fetchRequirementChecks = async (): Promise<RequirementCheck[]> => {
  return window.electronAPI.checkRequirements();
};
