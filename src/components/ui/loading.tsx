import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-[#FCD34D]', sizes[size])} />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text="Carregando..." />
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="h-40 flex items-center justify-center">
      <Loading size="md" />
    </div>
  );
}
