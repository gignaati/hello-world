interface HardwareStatCardProps {
  title: string;
  value: string;
  caption?: string;
  meta?: string;
}

const HardwareStatCard = ({ title, value, caption, meta }: HardwareStatCardProps) => {
  return (
    <div className="glass-panel h-full p-6">
      <p className="text-sm uppercase tracking-wide text-primary-300/80">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {caption ? <p className="mt-2 text-sm text-slate-300/90">{caption}</p> : null}
      {meta ? <p className="mt-4 text-xs text-slate-400">{meta}</p> : null}
    </div>
  );
};

export default HardwareStatCard;
