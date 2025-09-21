'use client';
import { FeatureCards } from '@/components';
import mockData from '@/data/mock-data';
// Define proper interface for game features
interface GameFeature {
  title: string;
  description: string;
  icon: string;
}

// Type guard to validate game features
const isGameFeature = (feature: any): feature is GameFeature => {
  return (
    typeof feature === 'object' &&
    feature !== null &&
    typeof feature.title === 'string' &&
    typeof feature.description === 'string' &&
    typeof feature.icon === 'string'
  );
};

// Type guard to validate mock data structure
const hasGameFeatures = (
  data: any
): data is { mockGameFeatures: GameFeature[] } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.mockGameFeatures) &&
    data.mockGameFeatures.every(isGameFeature)
  );
};

const mockGameFeatures: GameFeature[] = hasGameFeatures(mockData)
  ? mockData.mockGameFeatures
  : [];

export function FeaturesSection() {
  return (
    <section className='w-full max-w-5xl mx-auto mb-16 bg-blue-600/50 rounded-3xl p-8 backdrop-blur-sm border-2 border-blue-400/50'>
      <h2 className='text-3xl font-bold text-white text-center mb-8 drop-shadow-lg'>
        Features
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {mockGameFeatures.map(feature => (
          <FeatureCards key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
