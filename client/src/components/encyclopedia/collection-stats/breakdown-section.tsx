interface BreakdownItem {
  name: string
  current: number
  total: number
  color: string
}

interface BreakdownSectionProps {
  title: string
  items: BreakdownItem[]
}

export default function BreakdownSection({ title, items }: BreakdownSectionProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-white">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-200">{item.name}</span>
              <span className="text-sm text-blue-200">
                {item.current}/{item.total}
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-blue-950">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${(item.current / item.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
