const adjectives = [
  'Yellow',
  'Red',
  'Green',
  'Violet',
  'Enormous',
  'Spicy',
  'Motionless',
  'Electric',
  'Useless',
  'Ambitious',
  'Fragile',
  'Wet',
  'Skinny',
  'Abandoned',
  'Stupid',
  'Fat',
  'Purple',
  'Wooden',
  'Striped',
  'Furry',
  'Salty'
];
const nouns = [
  'staircase',
  'giraffe',
  'motor',
  'spoon',
  'fork',
  'engineer',
  'fish',
  'hole',
  'creeper',
  'book',
  'composer',
  'vegetable',
  'whisky',
  'molecule',
  'body',
  'scarecrow',
  'ant',
  'owl',
  'dinosaur',
  'burglar',
  'pussy',
  'deer'
];

const getRandomPhrase = () => {
  return [
    adjectives[Math.floor(Math.random()*adjectives.length)], 
    nouns[Math.floor(Math.random()*nouns.length)]
  ].join(' ');
};

export default getRandomPhrase;