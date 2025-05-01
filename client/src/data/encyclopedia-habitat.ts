export interface Habitat {
    name: string;
    description: string;
    image: string;
    characteristics: string[];
    commonSpecies: string[];
}

export interface SizeCompatibility {
    size: string;
    recommendation: string;
}

// Aquatic Habitats
export const aquaticEnvironments: Habitat[] = [
    {
      name: "Freshwater",
      description: "Low salinity environments like rivers, lakes, and ponds",
      image: "/habitat/freshwater.png",
      characteristics: [
        "pH range typically between 6.0 and 8.0",
        "Temperature range of 18-28°C (64-82°F)",
        "Often contains plants, rocks, and driftwood",
        "Lower maintenance requirements than saltwater"
      ],
      commonSpecies: [
        "Crimson Flasher",
        "Azure Drifter",
        "Emerald Whisker",
        "Bubble Floater"
      ]
    },
    {
      name: "Saltwater",
      description: "Marine environments with high salinity like oceans and seas",
      image: "/habitat/saltwater.png",
      characteristics: [
        "pH range typically between 8.0 and 8.4",
        "Temperature range of 24-28°C (75-82°F)",
        "Often includes live rock, coral, and sand substrate",
        "Requires stable water parameters and regular maintenance"
      ],
      commonSpecies: [
        "Coral Nibbler"
      ]
    },
    {
      name: "Deep Sea",
      description: "Extreme environments with high pressure and low light",
      image: "/habitat/deepsea.png",
      characteristics: [
        "Cold temperatures between 4-10°C (39-50°F)",
        "High pressure environment",
        "Minimal to no light penetration",
        "Specialized equipment required for simulation"
      ],
      commonSpecies: [
        "Celestial Glowfin"
      ]
    }
  ];

export const sizeCompatibility: SizeCompatibility[] = [
    {
      size: "Small Fish",
      recommendation: "Best kept with other small fish or peaceful medium-sized species"
    },
    {
      size: "Medium Fish",
      recommendation: "Compatible with small to medium fish depending on temperament"
    },
    {
      size: "Large Fish",
      recommendation: "Should be kept with other large fish or in species-only tanks"
    }
  ];