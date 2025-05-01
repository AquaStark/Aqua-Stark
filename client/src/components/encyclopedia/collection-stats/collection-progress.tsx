interface ProgressData {
  discovered: number
  total: number
  percentage: number
}

interface CollectionProgressProps {
  data: ProgressData
}

export default function CollectionProgress({ data }: CollectionProgressProps) {
  return (
    <div>
      <h2 className="mb-3 text-xl font-bold text-white">Collection Progress</h2>
      <hr className="mb-6 border-blue-700/50" />

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold text-white">{data.percentage}% Complete</h3>
        </div>
        <p className="mb-2 text-sm text-blue-200">
          You've discovered {data.discovered} out of {data.total} fish species
        </p>

        <div className="h-4 w-full overflow-hidden rounded-full bg-blue-950">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
            style={{ width: `${data.percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
