import { FishType } from "@/types/game"

// Tipos
export interface GameState {
  happiness: number
  food: number
  energy: number
}

// Datos mock
export const MOCK_FISH: FishType[] = [
  {
    id: 1,
    name: "Fish 1",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
    rarity: "Common",
    generation: 1,
    position: { x: 20, y: 30 },
  },
  {
    id: 2,
    name: "Fish 2",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png",
    rarity: "Rare",
    generation: 2,
    position: { x: 60, y: 50 },
  }
]

export const MOCK_AQUARIUMS = [
  {
    id: 1,
    name: "My First Aquarium",
    fishes: [
      {
        id: 1,
        name: "Fish 1",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
        rarity: "Common",
        generation: 1,
        position: {
          x: 20,
          y: 30,
        },
      },
      {
        id: 2,
        name: "Fish 2",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png",
        rarity: "Rare",
        generation: 2,
        position: {
          x: 60,
          y: 50,
        },
      },
      {
        id: 1002,
        name: "Orange Tropical Fish",
        image: "/fish/fish3.png",
        position: {
          x: 19.92373700867351,
          y: 13.148434305299475,
        },
        rarity: "Epic",
        generation: 1,
      },
      {
        id: 1003,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 34.84478166965058,
          y: 15.651300761001652,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1004,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 53.8114279768477,
          y: 12.714147941513268,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1021,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 99.45412796014267,
          y: 77.8325872690493,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1022,
        name: "Scarlet Fin",
        image: "/fish/fish4.png",
        position: {
          x: 10.926553081644629,
          y: 92.33073947964952,
        },
        rarity: "Legendary",
        generation: 1,
      },
      {
        id: 1023,
        name: "Blue Striped Fish",
        image: "/fish/fish1.png",
        position: {
          x: 37.41776180896658,
          y: 92.7869342547109,
        },
        rarity: "Rare",
        generation: 1,
      },
      {
        id: 1005,
        name: "Orange Tropical Fish",
        image: "/fish/fish3.png",
        position: {
          x: 75.94390439581386,
          y: 17.383691808091907,
        },
        rarity: "Epic",
        generation: 1,
      },
      {
        id: 1006,
        name: "Blue Striped Fish",
        image: "/fish/fish1.png",
        position: {
          x: 96.43924833994426,
          y: 10.41381204547111,
        },
        rarity: "Rare",
        generation: 1,
      },
      {
        id: 1007,
        name: "Scarlet Fin",
        image: "/fish/fish4.png",
        position: {
          x: 16.615195839498487,
          y: 34.02895698758101,
        },
        rarity: "Legendary",
        generation: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Second Aquarium",
    fishes: [
      {
        id: 1010,
        name: "Orange Tropical Fish",
        image: "/fish/fish3.png",
        position: {
          x: 70.05569317581224,
          y: 31.26631587656123,
        },
        rarity: "Epic",
        generation: 1,
      },
      {
        id: 1011,
        name: "Orange Tropical Fish",
        image: "/fish/fish3.png",
        position: {
          x: 91.14938452529759,
          y: 33.20991149672498,
        },
        rarity: "Epic",
        generation: 1,
      },
      {
        id: 1012,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 10.253050507519218,
          y: 54.014670923439134,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1013,
        name: "Scarlet Fin",
        image: "/fish/fish4.png",
        position: {
          x: 35.53506518483831,
          y: 51.64727505958646,
        },
        rarity: "Legendary",
        generation: 1,
      },
      {
        id: 1014,
        name: "Blue Striped Fish",
        image: "/fish/fish1.png",
        position: {
          x: 55.924685872284,
          y: 51.613485479669805,
        },
        rarity: "Rare",
        generation: 1,
      },
      {
        id: 1015,
        name: "Blue Striped Fish",
        image: "/fish/fish1.png",
        position: {
          x: 73.15494690534074,
          y: 51.74235618279098,
        },
        rarity: "Rare",
        generation: 1,
      },
      {
        id: 1016,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 96.63664192851878,
          y: 56.432516918853956,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1008,
        name: "Blue Striped Fish",
        image: "/fish/fish1.png",
        position: {
          x: 38.41527892022816,
          y: 32.311624025414105,
        },
        rarity: "Rare",
        generation: 1,
      },
      {
        id: 1009,
        name: "Scarlet Fin",
        image: "/fish/fish4.png",
        position: {
          x: 54.40434159964886,
          y: 33.03874247904683,
        },
        rarity: "Legendary",
        generation: 1,
      },
      {
        id: 1019,
        name: "Blue Striped Fish",
        image: "/fish/fish1.png",
        position: {
          x: 56.438322043841985,
          y: 78.17636306311563,
        },
        rarity: "Rare",
        generation: 1,
      },
      {
        id: 1020,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 73.84620164417161,
          y: 79.8683451312364,
        },
        rarity: "Uncommon",
        generation: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Tropical Paradise",
    fishes: [
      {
        id: 1017,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 11.642240240337966,
          y: 77.27788079887628,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1018,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 36.09742337674216,
          y: 73.69031619074282,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1024,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 58.60029316383985,
          y: 91.16121958646791,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1025,
        name: "Orange Tropical Fish",
        image: "/fish/fish3.png",
        position: {
          x: 71.89998567269247,
          y: 93.15724230000063,
        },
        rarity: "Epic",
        generation: 1,
      },
      {
        id: 1026,
        name: "Blue Striped Fish",
        image: "/fish/fish1.png",
        position: {
          x: 98.843712282763,
          y: 95.09803219315081,
        },
        rarity: "Rare",
        generation: 1,
      },
      {
        id: 1027,
        name: "Blue Striped Fish",
        image: "/fish/fish1.png",
        position: {
          x: 15.117327054788731,
          y: 114.13066384421461,
        },
        rarity: "Rare",
        generation: 1,
      },
      {
        id: 1028,
        name: "Tropical Coral Fish",
        image: "/fish/fish2.png",
        position: {
          x: 32.428387693635344,
          y: 118.0093915526919,
        },
        rarity: "Uncommon",
        generation: 2,
      },
      {
        id: 1029,
        name: "Scarlet Fin",
        image: "/fish/fish4.png",
        position: {
          x: 52.16473243069036,
          y: 117.70677107374183,
        },
        rarity: "Legendary",
        generation: 1,
      },
    ],
  },
];

export const INITIAL_GAME_STATE: GameState = {
  happiness: 80,
  food: 90,
  energy: 75,
}
