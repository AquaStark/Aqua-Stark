export type FishSpecies =
  | 'AngelFish'
  | 'GoldFish'
  | 'Betta'
  | 'NeonTetra'
  | 'Corydoras'
  | 'Hybrid';

export const fishSpeciesList: FishSpecies[] = [
  'AngelFish',
  'GoldFish',
  'Betta',
  'NeonTetra',
  'Corydoras',
  'Hybrid',
];

export const getRandomSpecies = (): FishSpecies => {
  const index = Math.floor(Math.random() * fishSpeciesList.length);
  return fishSpeciesList[index];
};
