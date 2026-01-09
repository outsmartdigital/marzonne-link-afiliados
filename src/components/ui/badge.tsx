import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-[#FEF9E7] text-black border border-[#FCD34D]',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
}: {
  status: 'pending' | 'approved' | 'rejected' | 'paid';
}) {
  const statusConfig = {
    pending: { variant: 'warning' as const, label: 'Pendente' },
    approved: { variant: 'success' as const, label: 'Aprovado' },
    rejected: { variant: 'danger' as const, label: 'Rejeitado' },
    paid: { variant: 'info' as const, label: 'Pago' },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
