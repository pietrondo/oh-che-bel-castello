import type { BuildingData, GameState, Resources, ResourceNode, Technology, MarketPrice } from './types';

export const INITIAL_RESOURCES: Resources = {
  wood: 200, stone: 100, food: 400, gold: 250, iron: 0, tools: 15, prestige: 0, knowledge: 0,
};

export const generateNodes = (): ResourceNode[] => {
  const nodes: ResourceNode[] = [];
  
  // 1. Montagne (Grandi blocchi)
  for (let i = 0; i < 6; i++) {
    const mx = Math.floor(Math.random() * 40) + 5;
    const my = Math.floor(Math.random() * 40) + 5;
    for (let dx = 0; dx < 3; dx++) {
      for (let dy = 0; dy < 2; dy++) {
        nodes.push({ id: `mtn-${i}-${dx}-${dy}`, type: 'mountain', x: mx + dx, y: my + dy });
      }
    }
  }

  // 2. Fiumi (Linee orizzontali o verticali)
  const startY = Math.floor(Math.random() * 30) + 10;
  for (let x = 0; x < 50; x++) {
    nodes.push({ id: `riv-${x}`, type: 'river', x, y: startY + (x % 3 === 0 ? 1 : 0) });
  }

  // 3. Risorse standard
  const counts = { forest: 20, stone_deposit: 12, iron_deposit: 8 };
  Object.entries(counts).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 48);
      const y = Math.floor(Math.random() * 48);
      // Evita sovrapposizione con fiumi/montagne già messi (semplificato)
      if (!nodes.some(n => n.x === x && n.y === y)) {
        nodes.push({ id: `res-${type}-${i}`, type: type as any, x, y, amount: 5000 });
      }
    }
  });

  return nodes;
};

export const INITIAL_TECHS: Technology[] = [
  { id: 'crop_rotation', name: 'Rotazione Colture', description: '+25% cibo.', cost: 50, unlocked: false, effect: 'food_bonus' },
  { id: 'masonry', name: 'Massoneria', description: '-20% costo pietra.', cost: 80, unlocked: false, effect: 'stone_bonus' },
  { id: 'mining', name: 'Tecniche Minerarie', description: '+30% ferro e pietra.', cost: 100, unlocked: false, effect: 'mining_bonus' },
];

export const INITIAL_MARKET: MarketPrice[] = [
  { type: 'wood', buy: 5, sell: 2, trend: 'stable' },
  { type: 'stone', buy: 8, sell: 4, trend: 'stable' },
  { type: 'food', buy: 4, sell: 1, trend: 'stable' },
  { type: 'iron', buy: 15, sell: 7, trend: 'stable' },
  { type: 'tools', buy: 25, sell: 12, trend: 'stable' },
];

export const BUILDINGS: Record<string, BuildingData> = {
  keep: { type: 'keep', name: 'Mastio', description: 'Centro del potere.', cost: { wood: 50, stone: 100 }, production: { gold: 2, prestige: 1 }, populationProvided: 10, maxWorkers: 0 },
  house: { type: 'house', name: 'Casa', description: 'Per i sudditi.', cost: { wood: 30 }, populationProvided: 8, maxWorkers: 0 },
  farm: { type: 'farm', name: 'Fattoria', description: 'Produce cibo.', cost: { wood: 20 }, production: { food: 10 }, maxWorkers: 3 },
  lumber_mill: { type: 'lumber_mill', name: 'Segheria', description: 'Richiede Foresta.', cost: { wood: 10, stone: 5 }, production: { wood: 8 }, maxWorkers: 2, requiresNode: 'forest' },
  stone_quarry: { type: 'stone_quarry', name: 'Cava', description: 'Richiede Roccia.', cost: { wood: 40 }, production: { stone: 6 }, maxWorkers: 3, requiresNode: 'stone_deposit' },
  iron_mine: { type: 'iron_mine', name: 'Miniera', description: 'Richiede Ferro.', cost: { wood: 60, stone: 30 }, production: { iron: 4 }, maxWorkers: 4, requiresNode: 'iron_deposit' },
  blacksmith: { type: 'blacksmith', name: 'Fabbro', description: 'Crea attrezzi.', cost: { wood: 50, stone: 50, gold: 50 }, consumption: { iron: 3, wood: 2 }, production: { tools: 2 }, maxWorkers: 2 },
  barracks: { type: 'barracks', name: 'Caserma', description: 'Difesa del regno.', cost: { stone: 100, gold: 50 }, production: { gold: -2 }, maxWorkers: 5 },
  university: { type: 'university', name: 'Università', description: 'Genera conoscenza.', cost: { stone: 150, gold: 150, tools: 10 }, production: { knowledge: 5 }, maxWorkers: 3 },
};

export const INITIAL_STATE: GameState = {
  resources: INITIAL_RESOURCES,
  time: { day: 1, month: 1, year: 1, season: 'Spring', tick: 0 },
  buildings: [{ id: 'start-keep', type: 'keep', x: 22, y: 22, level: 1, assignedWorkers: 0 }],
  resourceNodes: generateNodes(),
  population: { peasants: 15, citizens: 0, nobles: 0, happiness: 100, total: 15 },
  advisors: [],
  technologies: INITIAL_TECHS,
  marketPrices: INITIAL_MARKET,
  activeDialogue: null,
  lastDialogueResult: null,
  defenseRating: 10,
  threatLevel: 0,
  taxRate: 0.1,
};
