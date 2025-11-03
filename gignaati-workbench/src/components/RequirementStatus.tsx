import type { RequirementCheck } from '@types';

interface RequirementStatusProps {
  requirement: RequirementCheck;
}

const RequirementStatus = ({ requirement }: RequirementStatusProps) => {
  const { label, required, actual, unit, met } = requirement;

  return (
    <div className="glass-panel flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-300">
          Required: {required} {unit}
        </p>
      </div>
      <div className="text-right">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            met ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
          }`}
        >
          {met ? 'Ready' : 'Needs Upgrade'}
        </span>
        <p className="mt-1 text-sm font-semibold text-white">
          {actual.toFixed(1)} {unit}
        </p>
      </div>
    </div>
  );
};

export default RequirementStatus;
