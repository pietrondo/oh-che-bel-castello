import type { BuildingData, GameState, Resources, Sovereign, Law } from './types';

export const INITIAL_RESOURCES: Resources = {
  wood: 300, stone: 200, food: 500, gold: 500, iron: 0, tools: 20, prestige: 100, knowledge: 0, piety: 0,
  beer: 0, clothes: 0, wine: 0, jewelry: 0, grain: 0, flour: 0, bread: 0, wool: 0, fabric: 0
};

export const INITIAL_LAWS: Law[] = [
  { id: 'serfdom', name: 'Servitù della Gleba', description: '+50% produzione grano, -20 felicità contadini.', active: false, cost: 50, effect: 'grain_boost' },
  { id: 'mercantilism', name: 'Protezionismo', description: '+20% oro dai mercati, -10 relazioni esterne.', active: false, cost: 80, effect: 'gold_boost' },
  { id: 'divine_right', name: 'Diritto Divino', description: '+2 pietà/tick, i nobili pagano più tasse.', active: false, cost: 150, effect: 'piety_boost' },
  { id: 'martial_law', name: 'Legge Marziale', description: '+100 difesa, la felicità cala costantemente.', active: false, cost: 200, effect: 'defense_boost' }
];

export const INITIAL_SOVEREIGN: Sovereign = {
  name: 'Re Alberto I',
  age: 45,
  traits: ['Just'],
  portrait: '👑'
};

export const BUILDINGS: Record<string, BuildingData> = {
  keep: { type: 'keep', name: 'Mastio Reale', description: 'Centro del potere.', cost: { wood: 100, stone: 200 }, production: { gold: 5, prestige: 2 }, populationProvided: 15, maxWorkers: 0 },
  house: { type: 'house', name: 'Casa', description: 'Abitazione sudditi.', cost: { wood: 30 }, populationProvided: 8, maxWorkers: 0 },
  farm: { type: 'farm', name: 'Fattoria', description: 'Produce Grano.', cost: { wood: 20 }, production: { grain: 10 }, maxWorkers: 3 },
  windmill: { type: 'windmill', name: 'Mulino', description: 'Trasforma Grano in Farina.', cost: { wood: 80, stone: 40 }, consumption: { grain: 8 }, production: { flour: 8 }, maxWorkers: 2 },
  bakery: { type: 'bakery', name: 'Forno', description: 'Trasforma Farina in Pane.', cost: { stone: 100, gold: 50 }, consumption: { flour: 6 }, production: { bread: 12 }, maxWorkers: 2 },
  sheep_farm: { type: 'sheep_farm', name: 'Allevamento', description: 'Produce Lana.', cost: { wood: 50 }, production: { wool: 5 }, maxWorkers: 2 },
  weaving_mill: { type: 'weaving_mill', name: 'Filanda', description: 'Trasforma Lana in Tessuto.', cost: { wood: 100, tools: 5 }, consumption: { wool: 4 }, production: { fabric: 4 }, maxWorkers: 3 },
  tailor: { type: 'tailor', name: 'Sartoria', description: 'Trasforma Tessuto in Vestiti.', cost: { gold: 100, tools: 10 }, consumption: { fabric: 3 }, production: { clothes: 2 }, maxWorkers: 2 },
  lumber_mill: { type: 'lumber_mill', name: 'Segheria', description: 'Legname.', cost: { wood: 10, stone: 5 }, production: { wood: 10 }, maxWorkers: 2, requiresNode: 'forest' },
  stone_quarry: { type: 'stone_quarry', name: 'Cava', description: 'Pietra.', cost: { wood: 40 }, production: { stone: 8 }, maxWorkers: 3, requiresNode: 'stone_deposit' },
  iron_mine: { type: 'iron_mine', name: 'Miniera', description: 'Estrae Ferro.', cost: { wood: 60, stone: 30 }, production: { iron: 4 }, maxWorkers: 4, requiresNode: 'iron_deposit' },
  blacksmith: { type: 'blacksmith', name: 'Fabbro', description: 'Crea attrezzi.', cost: { wood: 50, stone: 50, gold: 50 }, consumption: { iron: 3, wood: 2 }, production: { tools: 2 }, maxWorkers: 2 },
  barracks: { type: 'barracks', name: 'Caserma', description: 'Difesa militare.', cost: { stone: 150, gold: 100 }, production: { gold: -5 }, maxWorkers: 8 },
  well: { type: 'well', name: 'Pozzo', description: 'Salute.', cost: { stone: 50 }, maxWorkers: 0 },
  road: { type: 'road', name: 'Strada', description: 'Logistica.', cost: { stone: 5 }, maxWorkers: 0 },
  wall: { type: 'wall', name: 'Mura', description: 'Difesa fisica.', cost: { stone: 30 }, maxWorkers: 0 },
  tower: { type: 'tower', name: 'Torre', description: 'Arciere di guardia.', cost: { stone: 100, iron: 10 }, maxWorkers: 2 },
  church: { type: 'church', name: 'Chiesa', description: 'Genera Pietà.', cost: { stone: 100, wood: 50 }, production: { piety: 2, prestige: 1 }, maxWorkers: 1 },
  university: { type: 'university', name: 'Università', description: 'Genera Conoscenza.', cost: { stone: 150, gold: 150, tools: 10 }, production: { knowledge: 5 }, maxWorkers: 3 },
  cathedral: { type: 'cathedral', name: 'Cattedrale', description: 'Gloria a Dio.', cost: { stone: 500, gold: 500, tools: 50 }, production: { piety: 10, prestige: 10 }, maxWorkers: 5 },
  manor: { type: 'manor', name: 'Maniero', description: 'Per i Nobili.', cost: { stone: 200, gold: 300 }, populationProvided: 5, maxWorkers: 2 },
  granary: { type: 'granary', name: 'Granaio', description: 'Stoccaggio cibo.', cost: { wood: 100, stone: 50 }, maxWorkers: 1 },
  market: { type: 'market', name: 'Mercato', description: 'Commercio.', cost: { wood: 100, gold: 100 }, production: { gold: 15 }, maxWorkers: 2 },
  brewery: { type: 'brewery', name: 'Birrificio', description: 'Birra.', cost: { wood: 80, gold: 50 }, production: { beer: 5 }, maxWorkers: 2 },
  winery: { type: 'winery', name: 'Vinicola', description: 'Vino.', cost: { wood: 150, gold: 200 }, production: { wine: 3 }, maxWorkers: 2 },
  jeweler: { type: 'jeweler', name: 'Gioielleria', description: 'Gioielli.', cost: { stone: 200, gold: 500 }, production: { jewelry: 1 }, maxWorkers: 1 },
};

export const generateNodes = (): any[] => {
  const nodes: any[] = [];
  for (let i = 0; i < 6; i++) {
    const mx = Math.floor(Math.random() * 40) + 5; const my = Math.floor(Math.random() * 40) + 5;
    for (let dx = 0; dx < 3; dx++) for (let dy = 0; dy < 2; dy++) nodes.push({ id: `mtn-${i}-${dx}-${dy}`, type: 'mountain', x: mx + dx, y: my + dy });
  }
  const startY = Math.floor(Math.random() * 30) + 10;
  for (let x = 0; x < 50; x++) nodes.push({ id: `riv-${x}`, type: 'river', x, y: startY + (x % 3 === 0 ? 1 : 0) });
  const counts = { forest: 30, stone_deposit: 15, iron_deposit: 10 };
  Object.entries(counts).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 48); const y = Math.floor(Math.random() * 48);
      if (!nodes.some(n => n.x === x && n.y === y)) nodes.push({ id: `res-${type}-${i}`, type: type as any, x, y, amount: 5000 });
    }
  });
  return nodes;
};

export const INITIAL_STATE: GameState = {
  resources: INITIAL_RESOURCES,
  time: { day: 1, month: 1, year: 1, season: 'Spring', tick: 0 },
  sovereign: INITIAL_SOVEREIGN,
  heir: { name: 'Principe Giovanni', age: 18, traits: ['Scholar'], portrait: '🧒' },
  buildings: [{ id: 'start-keep', type: 'keep', x: 22, y: 22, level: 1, assignedWorkers: 0, efficiencyBonus: 0 }],
  resourceNodes: generateNodes(),
  laws: INITIAL_LAWS,
  factions: [],
  activeDialogue: null,
  defenseRating: 20,
  threatLevel: 0,
  taxRate: 0.1,
  inflation: 1.0,
  debt: 0,
  population: { peasants: 20, citizens: 0, nobles: 0, total: 20, happiness: 100, health: 100 },
  weather: 'Clear',
  caravans: [],
  lastDialogueResult: null
};
