interface IntegrationCardProps {
  name: string;
  status: 'online' | 'offline' | 'unknown';
  description: string;
  href?: string;
  ctaLabel?: string;
}

const statusStyles: Record<IntegrationCardProps['status'], string> = {
  online: 'bg-success/20 text-success',
  offline: 'bg-danger/20 text-danger',
  unknown: 'bg-warning/20 text-warning',
};

const IntegrationCard = ({ name, status, description, href, ctaLabel }: IntegrationCardProps) => {
  const handleOpen = () => {
    if (href) {
      void window.electronAPI.openExternal(href);
    }
  };

  return (
    <div className="glass-panel flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
            {status === 'unknown' ? 'Checking' : status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-300">{description}</p>
      </div>
      {href ? (
        <button
          type="button"
          onClick={handleOpen}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
        >
          {ctaLabel ?? 'Open'}
        </button>
      ) : null}
    </div>
  );
};

export default IntegrationCard;
