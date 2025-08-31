import { Droplets, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface DirtCounterProps {
  spotCount: number;
  maxSpots: number;
  cleanlinessScore: number;
  totalSpotsCreated?: number;
  totalSpotsRemoved?: number;
  isSpawnerActive?: boolean;
  className?: string;
  variant?: 'compact' | 'detailed' | 'minimal';
  showTrend?: boolean;
}

export function DirtCounter({
  spotCount,
  maxSpots,
  cleanlinessScore,
  totalSpotsCreated = 0,
  totalSpotsRemoved = 0,
  isSpawnerActive = true,
  className = '',
  variant = 'compact',
  showTrend = false,
}: DirtCounterProps) {
  // Calculate cleanliness status and colors
  const getCleanlinessStatus = (score: number) => {
    if (score >= 90) return { label: 'Pristine', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', icon: CheckCircle };
    if (score >= 80) return { label: 'Very Clean', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: CheckCircle };
    if (score >= 70) return { label: 'Clean', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: CheckCircle };
    if (score >= 60) return { label: 'Acceptable', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: Droplets };
    if (score >= 40) return { label: 'Needs Attention', color: 'text-orange-400', bgColor: 'bg-orange-500/20', icon: AlertTriangle };
    if (score >= 20) return { label: 'Dirty', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: AlertTriangle };
    return { label: 'Very Dirty', color: 'text-red-500', bgColor: 'bg-red-500/30', icon: AlertTriangle };
  };

    const getDirtSpotColor = (current: number, max: number) => {
      if (max <= 0) return 'text-blue-400';
      const ratio = current / max;
      if (ratio >= 0.8) return 'text-red-400';
      if (ratio >= 0.6) return 'text-orange-400';
      if (ratio >= 0.4) return 'text-yellow-400';
      return 'text-blue-400';
  };

  const getEfficiency = () => {
    if (totalSpotsCreated === 0) return 0;
    return Math.round((totalSpotsRemoved / totalSpotsCreated) * 100);
  };

  const status = getCleanlinessStatus(cleanlinessScore);
  const StatusIcon = status.icon;
  const efficiency = getEfficiency();

  // Minimal variant - just cleanliness score
  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm ${className}`}>
        <StatusIcon className="w-3 h-3" />
        <span className={`text-sm font-medium ${status.color}`}>
          {cleanlinessScore}%
        </span>
      </div>
    );
  }

  // Compact variant - original functionality with enhancements
  if (variant === 'compact') {
    return (
      <div className={`bg-black/80 backdrop-blur-sm rounded-lg px-4 py-3 text-white flex items-center gap-6 border border-gray-700/50 ${className}`}>
        {/* Dirt Spots */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-500/20 rounded-full">
            <Droplets className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Dirt Spots</div>
            <div className="flex items-center gap-1">
              <span className={`text-lg font-bold ${getDirtSpotColor(spotCount, maxSpots)}`}>
                {spotCount}
              </span>
              <span className="text-gray-500">/{maxSpots}</span>
            </div>
          </div>
        </div>

        {/* Cleanliness Score */}
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-full ${status.bgColor}`}>
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Cleanliness</div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${status.color}`}>
                {cleanlinessScore}%
              </span>
              {showTrend && (
                <span className="text-xs text-gray-500">
                  {status.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* System Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSpawnerActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-xs text-gray-400">
            {isSpawnerActive ? 'Active' : 'Paused'}
          </span>
        </div>
      </div>
    );
  }

  // Detailed variant - comprehensive statistics
  return (
    <div className={`bg-black/85 backdrop-blur-sm rounded-lg p-4 text-white border border-gray-700/50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          Dirt System Status
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSpawnerActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-xs text-gray-400">
            {isSpawnerActive ? 'Active' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Current Dirt Spots */}
        <div className={`p-3 rounded-lg ${status.bgColor} border border-gray-600/30`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Active Spots</span>
            <Droplets className="w-3 h-3 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold ${getDirtSpotColor(spotCount, maxSpots)}`}>
              {spotCount}
            </span>
            <span className="text-sm text-gray-500">/{maxSpots}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                spotCount / maxSpots >= 0.8 ? 'bg-red-400' :
                spotCount / maxSpots >= 0.6 ? 'bg-orange-400' :
                spotCount / maxSpots >= 0.4 ? 'bg-yellow-400' : 'bg-blue-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, maxSpots > 0 ? (spotCount / maxSpots) * 100 : 0))}%`}}
            />
          </div>
        </div>

        {/* Cleanliness Score */}
        <div className={`p-3 rounded-lg ${status.bgColor} border border-gray-600/30`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Cleanliness</span>
            <StatusIcon className={`w-3 h-3 ${status.color}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold ${status.color}`}>
              {cleanlinessScore}%
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {status.label}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                cleanlinessScore >= 80 ? 'bg-green-400' :
                cleanlinessScore >= 60 ? 'bg-yellow-400' :
                cleanlinessScore >= 40 ? 'bg-orange-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, cleanlinessScore))}%`}}
            />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {(totalSpotsCreated > 0 || totalSpotsRemoved > 0) && (
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Created</div>
            <div className="text-sm font-semibold text-green-400">{totalSpotsCreated}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Cleaned</div>
            <div className="text-sm font-semibold text-blue-400">{totalSpotsRemoved}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" />
              Efficiency
            </div>
            <div className={`text-sm font-semibold ${
              efficiency >= 80 ? 'text-green-400' :
              efficiency >= 60 ? 'text-yellow-400' :
              efficiency >= 40 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {efficiency}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}