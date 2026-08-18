import React from 'react';
import { Clock, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';

// Icon + text + color, never color alone (accessibility requirement)
const STATUS_CONFIG = {
  Approved: { icon: CheckCircle2, cls: 'bg-green-50 text-banking-success border-green-200' },
  Pending: { icon: Clock, cls: 'bg-yellow-50 text-banking-warning border-yellow-200' },
  'Pending Review': { icon: Clock, cls: 'bg-yellow-50 text-banking-warning border-yellow-200' },
  Declined: { icon: XCircle, cls: 'bg-red-50 text-banking-error border-red-200' },
  Processing: { icon: Loader2, cls: 'bg-blue-50 text-banking-primary border-blue-200', spin: true },
  'Needs Attention': { icon: AlertTriangle, cls: 'bg-orange-50 text-orange-600 border-orange-200' },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || { icon: Clock, cls: 'bg-gray-50 text-text-secondary border-gray-200' };
  const Icon = config.icon;
  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeCls} font-medium rounded-md border ${config.cls}`}>
      <Icon size={size === 'sm' ? 11 : 13} className={config.spin ? 'animate-spin' : ''} />
      {status}
    </span>
  );
};

export default StatusBadge;
