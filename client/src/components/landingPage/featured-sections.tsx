"use client"
import { FeatureCards } from "./featured-card"
import { mockGameFeatures } from "@/data/mock-data"

export function FeaturesSection() {
  return (
    <section className="w-full max-w-5xl mx-auto mb-16 bg-blue-600/50 rounded-3xl p-8 backdrop-blur-sm border-2 border-blue-400/50">
      <h2 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockGameFeatures.map((feature) => (
          <FeatureCards key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  )
}
