import { useCallback, useEffect, useMemo, useState } from 'react';

import type { RequirementCheck, SystemProfile } from '@types';

import HardwareStatCard from '@components/HardwareStatCard';
import IntegrationCard from '@components/IntegrationCard';
import RequirementStatus from '@components/RequirementStatus';
import SectionHeader from '@components/SectionHeader';
import { checkN8nStatus, getN8nUrl } from '@services/n8n';
import { getOllamaStatus } from '@services/ollama';
import { fetchRequirementChecks, fetchSystemProfile } from '@services/systemInfo';
import { formatGigabytes, formatUptime } from '@utils/format';
import { hasMetMinimumSpec } from '@utils/requirements';

const DashboardScreen = () => {
  const [profile, setProfile] = useState<SystemProfile | null>(null);
  const [requirements, setRequirements] = useState<RequirementCheck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ollamaStatus, setOllamaStatus] = useState<'online' | 'offline' | 'unknown'>('unknown');
  const [n8nStatus, setN8nStatus] = useState<'online' | 'offline' | 'unknown'>('unknown');
  const n8nUrl = useMemo(() => getN8nUrl(), []);

  const loadSystemProfile = useCallback(async () => {
    try {
      setLoading(true);
      const [systemProfile, requirementChecks] = await Promise.all([
        fetchSystemProfile(),
        fetchRequirementChecks(),
      ]);
      setProfile(systemProfile);
      setRequirements(requirementChecks);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSystemProfile();
  }, [loadSystemProfile]);

  useEffect(() => {
    const checkIntegrations = async () => {
      const [ollama, n8n] = await Promise.all([getOllamaStatus(), checkN8nStatus(n8nUrl)]);
      setOllamaStatus(ollama);
      setN8nStatus(n8n);
    };

    void checkIntegrations();

    const interval = setInterval(() => {
      void checkIntegrations();
    }, 60_000);

    return () => clearInterval(interval);
  }, [n8nUrl]);

  const isSystemReady = useMemo(
    () => (requirements.length > 0 ? hasMetMinimumSpec(requirements) : undefined),
    [requirements],
  );

  const handleRefresh = () => {
    void loadSystemProfile();
  };

  return (
    <div className="space-y-10 px-6 pb-10 pt-12 md:px-10 lg:px-16">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary-300/80">
            Gignaati Workbench
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Local AI Agent Control Center
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Provision and monitor your n8n automations and Ollama models on hardware that meets the
            baseline requirements for AI-enabled workflows.
          </p>
        </div>
        <div className="glass-panel flex flex-col gap-2 px-6 py-4 text-sm text-slate-200">
          <span className="text-xs uppercase tracking-wide text-slate-400">System Readiness</span>
          {isSystemReady === undefined ? (
            <span className="font-semibold text-warning">Evaluating...</span>
          ) : isSystemReady ? (
            <span className="font-semibold text-success">Ready for agent deployment</span>
          ) : (
            <span className="font-semibold text-danger">Upgrades required</span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center rounded-lg border border-primary-500 px-3 py-1.5 text-xs font-semibold text-primary-200 transition hover:bg-primary-500/10"
          >
            Refresh profile
          </button>
        </div>
      </header>

      <section className="space-y-6">
        <SectionHeader
          title="Hardware Overview"
          subtitle={
            profile
              ? `Host ${profile.overview.hostname} | ${profile.overview.platform} ${profile.overview.release} | Uptime ${formatUptime(profile.overview.uptime)}`
              : 'Collecting hardware profile...'
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <HardwareStatCard
            title="CPU"
            value={
              profile
                ? `${profile.cpu.manufacturer} ${profile.cpu.brand}`
                : loading
                  ? 'Loading...'
                  : 'Unknown'
            }
            caption={
              profile
                ? `${profile.cpu.physicalCores} physical / ${profile.cpu.logicalCores} logical cores`
                : undefined
            }
            meta={
              profile?.cpu.speedGHz
                ? `${profile.cpu.speedGHz.toFixed(2)} GHz`
                : loading
                  ? 'Sampling frequency...'
                  : undefined
            }
          />
          <HardwareStatCard
            title="GPU"
            value={
              profile?.gpus.length
                ? profile.gpus[0].name
                : loading
                  ? 'Detecting...'
                  : 'No GPU detected'
            }
            caption={
              profile?.gpus.length
                ? `${profile.gpus[0].vendor} | ${profile.gpus[0].vramTotalGB ?? 0} GB VRAM`
                : undefined
            }
            meta={profile?.gpus[0]?.driverVersion ? `Driver ${profile.gpus[0].driverVersion}` : undefined}
          />
          <HardwareStatCard
            title="System RAM"
            value={profile ? formatGigabytes(profile.memory.totalGB) : loading ? 'Loading...' : 'N/A'}
            caption={
              profile ? `${formatGigabytes(profile.memory.freeGB)} available` : undefined
            }
          />
          <HardwareStatCard
            title="NPU"
            value={profile?.npu?.name ?? 'Not detected'}
            caption={
              profile?.npu?.vendor
                ? `${profile.npu.vendor}${profile.npu.type ? ` | ${profile.npu.type}` : ''}`
                : undefined
            }
          />
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          title="Minimum Specification"
          subtitle="Gignaati Workbench requires at least 16 GB of RAM and 12 GB of dedicated VRAM."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {requirements.map((requirement) => (
            <RequirementStatus key={requirement.label} requirement={requirement} />
          ))}
          {requirements.length === 0 && !loading ? (
            <p className="text-sm text-slate-400">No requirement data available.</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          title="Integrations"
          subtitle="Manage low-code automations with n8n and serve local LLMs with Ollama."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <IntegrationCard
            name="Ollama"
            status={ollamaStatus}
            description="Install, run, and manage local large language models accessible to your agents."
            href="https://ollama.ai/"
            ctaLabel="Open Ollama docs"
          />
          <IntegrationCard
            name="n8n Automations"
            status={n8nStatus}
            description="Visual workflow builder to orchestrate automations, API calls, and agent pipelines."
            href={n8nStatus === 'online' ? n8nUrl : 'https://n8n.io/'}
            ctaLabel={n8nStatus === 'online' ? 'Open n8n Console' : 'Visit n8n.io'}
          />
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="border-b border-slate-700/60 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">n8n Live Canvas</h3>
            <p className="text-xs text-slate-400">
              Your self-hosted n8n instance is embedded below when reachable at {n8nUrl}.
            </p>
          </div>
          <div className="h-[32rem] w-full bg-slate-950">
            {n8nStatus === 'online' ? (
              <iframe
                title="n8n"
                src={n8nUrl}
                className="size-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-slate-400">
                Waiting for n8n to become available at {n8nUrl}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardScreen;
