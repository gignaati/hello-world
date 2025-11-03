export const formatGigabytes = (value: number): string => `${value.toFixed(1)} GB`;

export const formatPercentage = (value: number | null, fallback = 'N/A'): string => {
  if (value === null || Number.isNaN(value)) {
    return fallback;
  }

  return `${value.toFixed(1)}%`;
};

export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);

  const parts = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' ') : `${Math.floor(seconds)}s`;
};
