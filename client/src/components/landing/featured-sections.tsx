'use client';
import { FeatureCards } from './featured-card';

const mockGameFeatures = [
  {
    title: 'Fish Breeding',
    description: 'Breed and evolve unique fish with genetics',
    icon: '🐠',
  },
  {
    title: 'NFT Marketplace',
    description: 'Trade fish and decorations on StarkNet',
    icon: '🏪',
  },
  {
    title: 'Aquarium Customization',
    description: 'Build and decorate your dream aquarium',
    icon: '🏠',
  },
  {
    title: 'Community Events',
    description: 'Participate in tournaments and special events',
    icon: '🎮',
  },
];

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
