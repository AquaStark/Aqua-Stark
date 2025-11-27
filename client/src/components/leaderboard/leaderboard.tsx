import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { useMinigameApi, LeaderboardEntry } from '@/hooks/use-minigame-api';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  gameType?: string; // If provided, shows game-specific leaderboard, otherwise global
  limit?: number;
  title?: string;
  className?: string;
}

export function Leaderboard({
  gameType,
  limit = 20,
  title,
  className,
}: LeaderboardProps) {
  const { getGameLeaderboard, getGlobalLeaderboard, loading } =
    useMinigameApi();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setError(null);
        const data = gameType
          ? await getGameLeaderboard(gameType, limit)
          : await getGlobalLeaderboard(limit);
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError('Failed to load leaderboard');
      }
    };

    loadLeaderboard();
  }, [gameType, limit, getGameLeaderboard, getGlobalLeaderboard]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className='w-5 h-5 text-yellow-400' />;
    }
    if (rank === 2) {
      return <Medal className='w-5 h-5 text-gray-300' />;
    }
    if (rank === 3) {
      return <Award className='w-5 h-5 text-amber-600' />;
    }
    return (
      <span className='text-white/60 font-bold text-sm w-5 text-center'>
        {rank}
      </span>
    );
  };

  const formatWallet = (wallet: string) => {
    if (!wallet) return 'Unknown';
    if (wallet.length <= 10) return wallet;
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const displayTitle =
    title || (gameType ? `${gameType} Leaderboard` : 'Global Leaderboard');

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <Loader2 className='w-8 h-8 animate-spin text-blue-400' />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <p className='text-red-400'>{error}</p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <p className='text-white/60'>No scores yet. Be the first to play!</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <h2 className='text-2xl font-bold text-white mb-6 flex items-center gap-2'>
        <Trophy className='w-6 h-6 text-yellow-400' />
        {displayTitle}
      </h2>

      <div className='space-y-2'>
        {leaderboard.map(entry => (
          <div
            key={entry.player_wallet || entry.player_id}
            className={cn(
              'flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10',
              'hover:bg-white/10 transition-colors',
              entry.rank <= 3 &&
                'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30'
            )}
          >
            {/* Rank */}
            <div className='flex items-center justify-center w-8'>
              {getRankIcon(entry.rank)}
            </div>

            {/* Player Info */}
            <div className='flex-1 min-w-0'>
              <p className='text-white font-medium truncate'>
                {formatWallet(
                  entry.player_wallet || entry.player_id || 'Unknown'
                )}
              </p>
            </div>

            {/* Score */}
            <div className='text-right'>
              <p className='text-yellow-400 font-bold text-lg'>
                {entry.total_score?.toLocaleString() ||
                  entry.best_score?.toLocaleString() ||
                  0}
              </p>
              {gameType ? (
                <p className='text-white/40 text-xs'>Best Score</p>
              ) : (
                <p className='text-white/40 text-xs'>Total Points</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
