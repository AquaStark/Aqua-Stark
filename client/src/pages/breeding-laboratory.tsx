"use client";
import { useState } from "react";
import { LaboratoryHeader } from "@/components/breeding-laboratory/laboratory-header";
import { LaboratoryTabs } from "@/components/breeding-laboratory/laboratory-tabs";
//import { DiscoveriesStats } from "@/components/breeding-laboratory/discoveries-stats";
//import { DiscoveryRegistry } from "@/components/breeding-laboratory/discovery-registry";
//import { UndiscoveredSpecies } from "@/components/breeding-laboratory/undiscovered-species";
import { bubblesData, backgroundBubblesData, particlesData,  } from "@/data/breeding-data";

export default function BreedingLaboratory() {
  const [bubbles] = useState(bubblesData);
  const [backgroundBubbles] = useState(backgroundBubblesData);
  const [particles] = useState(particlesData);

 

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700 animated-background">
      {/* Background elements */}
      <div className="water-movement"></div>

      {backgroundBubbles.map((bubble) => (
        <div
          key={`bg-bubble-${bubble.id}`}
          className="background-bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: "-100px",
            "--duration": `${bubble.duration}s`,
            "--delay": `${bubble.delay}s`,
            "--drift": `${bubble.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {particles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className="floating-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            "--float-duration": `${particle.duration}s`,
            "--float-delay": `${particle.delay}s`,
            "--float-x": `${particle.floatX}px`,
            "--float-y": `${particle.floatY}px`,
          } as React.CSSProperties}
        />
      ))}

      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            "--duration": `${bubble.animationDuration}s`,
          } as React.CSSProperties}
        />
      ))}

      <LaboratoryHeader />
      
      <div className="w-[90%] mx-auto text-gray-300">
        <LaboratoryTabs />
        </div>

      {/* Footer */}
      <footer className="relative z-10 mt-8 bg-blue-800 py-6 border-t-2 border-blue-400/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80">© 2025 Aqua Stark - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}