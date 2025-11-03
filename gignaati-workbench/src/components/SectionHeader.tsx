import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
};

export default SectionHeader;
