"use client"

export function FeatureCards({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-blue-500/50 rounded-2xl p-6 backdrop-blur-sm border-2 border-blue-400/30 shadow-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/90">{description}</p>
    </div>
  )
}
