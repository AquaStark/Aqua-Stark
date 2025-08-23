import { Progress } from '@/components/ui/progress';
import type { FishIndicatorState } from '@/types/fishIndicators';
import { cn } from '@/lib/utils';

interface FishStatusProps {
  indicators: Pick<FishIndicatorState, 'hunger' | 'energy' | 'happiness'>;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md';
}

function barColor(value: number): string {
  if (value >= 70) return 'bg-emerald-500';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

function Row({
  label,
  value,
  size = 'md',
  showLabel = true,
}: {
  label: string;
  value: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}) {
  return (
    <div className={cn('flex flex-col gap-1', size === 'sm' ? 'gap-0.5' : 'gap-1')}>
      {showLabel && (
        <div className={cn('flex items-center justify-between', size === 'sm' ? 'text-[10px]' : 'text-xs')}>
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{Math.round(value)}%</span>
        </div>
      )}
      <Progress value={value} indicatorClassName={cn('transition-all', barColor(value))} className={cn(size === 'sm' ? 'h-2' : 'h-3')} />
    </div>
  );
}

export function FishStatus({ indicators, className, showLabels = true, size = 'md' }: FishStatusProps) {
  const { hunger, energy, happiness } = indicators;

  return (
    <div className={cn('w-full space-y-2', size === 'sm' ? 'space-y-1.5' : 'space-y-2', className)}>
      <Row /**label="Hunger"*/ value={hunger} size={size} showLabel={showLabels} label={"🍽️"} />
      <Row /**label="Energy"*/ value={energy} size={size} showLabel={showLabels} label={"⚡"} />
      <Row /**label="Happiness"*/ value={happiness} size={size} showLabel={showLabels} label={"😊"} />
    </div>
  );
}

export default FishStatus;
