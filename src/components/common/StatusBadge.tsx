import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status ? status.toUpperCase() : 'UNKNOWN';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (normalized) {
    case 'ACTIVE':
    case 'ADMITTED':
    case 'COMPLETED':
    case 'PUBLISHED':
    case 'PAID':
    case 'FULLY_PAID':
    case 'PASS':
    case 'PRESENT':
    case 'APPROVED':
    case 'AVAILABLE':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;

    case 'PENDING':
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
    case 'PARTIALLY_PAID':
    case 'LATE':
    case 'SCHEDULED':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;

    case 'ABSENT':
    case 'FAIL':
    case 'REJECTED':
    case 'OVERDUE':
    case 'SUSPENDED':
    case 'LOST':
    case 'CANCELLED':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;

    case 'EXCUSED':
    case 'ON_LEAVE':
    case 'SHORTLISTED':
    case 'OCCUPIED':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {normalized.replace(/_/g, ' ')}
    </span>
  );
};
