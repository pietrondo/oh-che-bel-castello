import type { BuildingData, GameState, Resources, ResourceNode, Technology, MarketPrice, ForeignKingdom, Law, Faction } from './types';

export const INITIAL_RESOURCES: Resources = {
  wood: 300, stone: 200, food: 600, gold: 500, iron: 0, tools: 20, prestige: 50, knowledge: 0, piety: 0,
  beer: 0, clothes: 0, wine: 0, jewelry: 0
};

export const INITIAL_FACTIONS: Faction[] = [
  { type: 'merchants', name: 'Gilda dei Mercanti', favor: 0, bonus: 'Prezzi migliori' },
  { type: 'clergy', name: 'Alto Clero', favor: 0, bonus: 'Più Pietà' },
  { type: 'military', name: 'Ordine Militare', favor: 0, bonus: 'Più Difesa' },
];

export const INITIAL_KINGDOMS: ForeignKingdom[] = [
  { id: 'wessex', name: 'Regno di Wessex', relation: 50, power: 80, tradeBonus: 1.2, status: 'Friendly' },
  { id: 'mercia', name: 'Ducato di Mercia', relation: 0, power: 120, tradeBonus: 1.0, status: 'Neutral' },
  { id: 'vikings', name: 'Tribù Nordiche', relation: -80, power: 150, tradeBonus: 0.5, status: 'Hostile' },
];

export const INITIAL_LAWS: Law[] = [
  { id: 'forced_labor', name: 'Lavoro Forzato', description: '+30% produzione, -20 felicità, -10 favore Clero.', active: false, prestigeCost: 50, pietyRequirement: 0 },
  { id: 'tithe', name: 'Decima', description: '+2 oro/sudito, +1 pietà, -10 favore Mercanti.', active: false, prestigeCost: 100, pietyRequirement: 20 },
  { id: 'conscription', name: 'Leva', description: '+50 difesa, -30% cibo, +10 favore Militari.', active: false, prestigeCost: 150, pietyRequirement: 0 },
];

export const BUILDINGS: Record<string, BuildingData> = {
  keep: { type: 'keep', name: 'Mastio', description: 'Centro di potere.', cost: { wood: 50, stone: 100 }, production: { gold: 2, prestige: 1 }, populationProvided: 10, maxWorkers: 0 },
  house: { type: 'house', name: 'Casa', description: 'Abitazione sudditi.', cost: { wood: 30 }, populationProvided: 8, maxWorkers: 0 },
  farm: { type: 'farm', name: 'Fattoria', description: 'Produce cibo.', cost: { wood: 20 }, production: { food: 10 }, maxWorkers: 3 },
  lumber_mill: { type: 'lumber_mill', name: 'Segheria', description: 'Legname.', cost: { wood: 10, stone: 5 }, production: { wood: 8 }, maxWorkers: 2, requiresNode: 'forest' },
  stone_quarry: { type: 'stone_quarry', name: 'Cava', description: 'Pietra.', cost: { wood: 40 }, production: { stone: 6 }, maxWorkers: 3, requiresNode: 'stone_deposit' },
  iron_mine: { type: 'iron_mine', name: 'Miniera', description: 'Ferro.', cost: { wood: 60, stone: 30 }, production: { iron: 4 }, maxWorkers: 4, requiresNode: 'iron_deposit' },
  blacksmith: { type: 'blacksmith', name: 'Fabbro', description: 'Crea attrezzi.', cost: { wood: 50, stone: 50, gold: 50 }, consumption: { iron: 3, wood: 2 }, production: { tools: 2 }, maxWorkers: 2 },
  barracks: { type: 'barracks', name: 'Caserma', description: 'Difesa militare.', cost: { stone: 100, gold: 50 }, production: { gold: -2 }, maxWorkers: 5 },
  university: { type: 'university', name: 'Università', description: 'Conoscenza.', cost: { stone: 150, gold: 150, tools: 10 }, production: { knowledge: 5 }, maxWorkers: 3 },
  church: { type: 'church', name: 'Chiesa', description: 'Pietà.', cost: { stone: 100, wood: 50 }, production: { piety: 2, prestige: 1 }, maxWorkers: 1 },
  well: { type: 'well', name: 'Pozzo', description: 'Salute.', cost: { stone: 50, wood: 20 }, maxWorkers: 0 },
  road: { type: 'road', name: 'Strada', description: 'Logistica.', cost: { stone: 5, wood: 2 }, maxWorkers: 0 },
  brewery: { type: 'brewery', name: 'Birrificio', description: 'Birra per i cittadini. Richiede cibo.', cost: { wood: 100, gold: 50 }, consumption: { food: 5 }, production: { beer: 2 }, maxWorkers: 2 },
  tailor: { type: 'tailor', name: 'Sartoria', description: 'Vestiti per nobili.', cost: { wood: 150, gold: 100 }, consumption: { food: 2 }, production: { clothes: 1 }, maxWorkers: 2 },
  jeweler: { type: 'jeweler', name: 'Gioielleria', description: 'Gioielli per i ricchi.', cost: { stone: 200, gold: 300, iron: 20 }, production: { jewelry: 1 }, maxWorkers: 1 },
};

export const generateNodes = (): ResourceNode[] => {
  const nodes: ResourceNode[] = [];
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
  weather: 'Clear',
  buildings: [{ id: 'start-keep', type: 'keep', x: 22, y: 22, level: 1, assignedWorkers: 0, efficiencyBonus: 0, condition: 100 }],
  resourceNodes: generateNodes(),
  caravans: [],
  factions: INITIAL_FACTIONS,
  debt: 0,
  inflation: 1.0,
  population: { peasants: 20, citizens: 0, nobles: 0, happiness: 100, health: 100, total: 20 },
  technologies: [],
  marketPrices: [],
  kingdoms: INITIAL_KINGDOMS,
  laws: INITIAL_LAWS,
  activeDialogue: null,
  lastDialogueResult: null,
  defenseRating: 15,
  threatLevel: 0,
  taxRate: 0.1,
};
