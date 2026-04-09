import type { BuildingData, GameState, Resources, Law, Technology, Faction } from './types';

export const INITIAL_RESOURCES: Resources = {
  wood: 350, stone: 250, food: 600, gold: 600, iron: 0, tools: 25, prestige: 100, knowledge: 50, piety: 0,
  beer: 0, clothes: 0, wine: 0, jewelry: 0, grain: 0, flour: 0, bread: 0, wool: 0, fabric: 0
};

export const INITIAL_TECHS: Technology[] = [
  { id: 'agriculture_3', name: 'Rotazione Triennale', description: '+30% produzione grano e cibo.', cost: 100, unlocked: false, category: 'Economy', icon: '🌾' },
  { id: 'anatomy', name: 'Medicina Scolastica', description: '+20% salute globale della popolazione.', cost: 150, unlocked: false, category: 'Science', icon: '⚕️' },
  { id: 'double_entry', name: 'Contabilità', description: 'Riduce l\'inflazione del 50%.', cost: 200, unlocked: false, category: 'Economy', icon: '⚖️' },
  { id: 'heavy_armor', name: 'Armature a Piastre', description: '+50 potenza difensiva fissa.', cost: 300, unlocked: false, category: 'Military', icon: '🛡️' },
  { id: 'theology', name: 'Teologia Avanzata', description: '+5 pietà/tick e sblocca Cattedrale.', cost: 250, unlocked: false, category: 'Social', icon: '⛪' },
];

export const INITIAL_LAWS: Law[] = [
  { id: 'serfdom', name: 'Servitù della Gleba', description: '+50% produzione grano, -20 felicità contadini.', active: false, cost: 50, effect: 'grain_boost' },
  { id: 'divine_right', name: 'Diritto Divino', description: '+2 pietà/tick, i nobili pagano più tasse.', active: false, cost: 150, effect: 'piety_boost' },
  { id: 'martial_law', name: 'Legge Marziale', description: '+100 difesa, la felicità cala costantemente.', active: false, cost: 200, effect: 'defense_boost' }
];

export const BUILDING_CATEGORIES: Record<string, string[]> = {
  'Base': ['house', 'farm', 'lumber_mill', 'stone_quarry', 'well', 'road'],
  'Industria': ['windmill', 'bakery', 'blacksmith', 'iron_mine'],
  'Corte': ['keep', 'barracks', 'university', 'church', 'cathedral']
};

export const BUILDINGS: Record<string, BuildingData> = {
  keep: { type: 'keep', name: 'Mastio Reale', description: 'Simbolo di potere.', cost: { gold: 500, stone: 300 }, production: { gold: 10, prestige: 2, knowledge: 1 }, populationProvided: 20, maxWorkers: 0 },
  house: { type: 'house', name: 'Casa', description: 'Abitazione sudditi.', cost: { wood: 30 }, populationProvided: 8, maxWorkers: 0 },
  farm: { type: 'farm', name: 'Fattoria', description: 'Produce Grano.', cost: { wood: 20 }, production: { grain: 10 }, maxWorkers: 3 },
  windmill: { type: 'windmill', name: 'Mulino', description: 'Crea Farina.', cost: { wood: 80, stone: 40 }, consumption: { grain: 8 }, production: { flour: 8 }, maxWorkers: 2 },
  bakery: { type: 'bakery', name: 'Forno', description: 'Crea Pane.', cost: { stone: 100, gold: 50 }, consumption: { flour: 6 }, production: { bread: 12 }, maxWorkers: 2 },
  lumber_mill: { type: 'lumber_mill', name: 'Segheria', description: 'Legname.', cost: { wood: 10, stone: 5 }, production: { wood: 12 }, maxWorkers: 2, requiresNode: 'forest' },
  stone_quarry: { type: 'stone_quarry', name: 'Cava', description: 'Pietra.', cost: { wood: 40 }, production: { stone: 10 }, maxWorkers: 3, requiresNode: 'stone_deposit' },
  iron_mine: { type: 'iron_mine', name: 'Miniera', description: 'Estrae Ferro.', cost: { wood: 60, stone: 30 }, production: { iron: 5 }, maxWorkers: 4, requiresNode: 'iron_deposit' },
  blacksmith: { type: 'blacksmith', name: 'Fabbro', description: 'Attrezzi.', cost: { wood: 50, stone: 50, gold: 50 }, consumption: { iron: 3, wood: 2 }, production: { tools: 2 }, maxWorkers: 2 },
  barracks: { type: 'barracks', name: 'Caserma', description: 'Difesa.', cost: { stone: 150, gold: 100 }, production: { gold: -5 }, maxWorkers: 8 },
  well: { type: 'well', name: 'Pozzo', description: 'Salute.', cost: { stone: 50 }, maxWorkers: 0 },
  university: { type: 'university', name: 'Università', description: 'Conoscenza.', cost: { stone: 200, gold: 200 }, production: { knowledge: 8 }, maxWorkers: 4 },
  church: { type: 'church', name: 'Chiesa', description: 'Pietà.', cost: { stone: 100, wood: 50 }, production: { piety: 3 }, maxWorkers: 1 },
  cathedral: { type: 'cathedral', name: 'Cattedrale', description: 'Divinità.', cost: { stone: 800, gold: 1000 }, production: { piety: 15, prestige: 10 }, maxWorkers: 6 },
  brewery: { type: 'brewery', name: 'Birrificio', description: 'Birra.', cost: { wood: 100, gold: 100 }, production: { beer: 5 }, maxWorkers: 2 },
  tailor: { type: 'tailor', name: 'Sartoria', description: 'Vestiti.', cost: { gold: 150, tools: 5 }, production: { clothes: 2 }, maxWorkers: 2 },
  granary: { type: 'granary', name: 'Granaio', description: 'Conserva cibo.', cost: { wood: 50, stone: 30 }, maxWorkers: 2 },
  market: { type: 'market', name: 'Mercato', description: 'Commercio.', cost: { wood: 80, gold: 50 }, production: { gold: 5 }, maxWorkers: 3 },
  manor: { type: 'manor', name: 'Maniero', description: 'Residenza nobiliare.', cost: { stone: 400, gold: 300 }, populationProvided: 15, maxWorkers: 5 },
  wall: { type: 'wall', name: 'Mura', description: 'Difesa statica.', cost: { stone: 30 }, maxWorkers: 0 },
  tower: { type: 'tower', name: 'Torre', description: 'Punta difensiva.', cost: { stone: 150 }, maxWorkers: 4 },
  road: { type: 'road', name: 'Strada', description: 'Movimento veloce.', cost: { wood: 5 }, maxWorkers: 0 },
  winery: { type: 'winery', name: 'Vigneto', description: 'Produce vino.', cost: { wood: 60, gold: 40 }, production: { wine: 4 }, maxWorkers: 2 },
  jeweler: { type: 'jeweler', name: 'Gioielliere', description: 'Crea gioielli.', cost: { gold: 200, tools: 10 }, production: { jewelry: 1 }, maxWorkers: 2 },
  sheep_farm: { type: 'sheep_farm', name: 'Allevamento Pecore', description: 'Produce lana.', cost: { wood: 40 }, production: { wool: 5 }, maxWorkers: 2 },
  weaving_mill: { type: 'weaving_mill', name: 'Tessitoria', description: 'Crea tessuto.', cost: { wood: 70, gold: 30 }, consumption: { wool: 4 }, production: { fabric: 4 }, maxWorkers: 2 },
};

export function generateNodes(): import('./types').ResourceNode[] {
  return [
    { id: 'node-forest-1', type: 'forest', x: 5, y: 5, amount: 1000 },
    { id: 'node-forest-2', type: 'forest', x: 40, y: 8, amount: 800 },
    { id: 'node-stone-1', type: 'stone_deposit', x: 38, y: 35, amount: 600 },
    { id: 'node-stone-2', type: 'stone_deposit', x: 10, y: 40, amount: 500 },
    { id: 'node-iron-1', type: 'iron_deposit', x: 15, y: 15, amount: 400 },
    { id: 'node-iron-2', type: 'iron_deposit', x: 35, y: 25, amount: 350 },
  ];
}

export const INITIAL_STATE: GameState = {
  resources: INITIAL_RESOURCES,
  time: { day: 1, month: 1, year: 1, season: 'Spring', tick: 0 },
  technologies: INITIAL_TECHS,
  buildings: [{ id: 'start-keep', type: 'keep', x: 22, y: 22, level: 1, assignedWorkers: 0, efficiencyBonus: 0, condition: 100 }],
  resourceNodes: generateNodes(),
  population: { peasants: 25, citizens: 0, nobles: 0, total: 25, happiness: 100, health: 100 },
  sovereign: { name: 'Re Alberto I', age: 45, traits: ['Just'], portrait: '👑' },
  heir: { name: 'Principe Giovanni', age: 18, traits: ['Scholar'], portrait: '🧒' },
  laws: INITIAL_LAWS,
  factions: [
    { type: 'merchants', name: 'Gilda Mercanti', favor: 0, bonus: 'Trade' } as Faction,
    { type: 'clergy', name: 'Alto Clero', favor: 0, bonus: 'Faith' } as Faction,
    { type: 'military', name: 'Ordine Militare', favor: 0, bonus: 'Defense' } as Faction
  ],
  defenseRating: 25,
  threatLevel: 0,
  taxRate: 0.1,
  inflation: 1.0,
  debt: 0,
  activeDialogue: null,
  lastDialogueResult: null,
  weather: 'Clear'
};
