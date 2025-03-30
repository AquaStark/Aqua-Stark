interface StatItem {
    title: string;
    value: string | number;
  }
  
  interface DiscoveriesStatsProps {
    stats: StatItem[];
  }
  
  export function DiscoveriesStats({ stats }: DiscoveriesStatsProps) {
    return (
      <div className="bg-blue-900/40 backdrop-blur-sm px-4 py-4 rounded flex items-center justify-between gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-blue-600/30 backdrop-blur-sm rounded w-full py-4"
          >
            <h3 className="text-center text-md">{stat.title}</h3>
            <p className="text-gray-100 text-center text-xl">{stat.value}</p>
          </div>
        ))}
      </div>
    );
  }