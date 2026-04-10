import type { BuildingData, GameState, Resources, Law, Technology, Faction, SeasonType, GameSetup, DiplomaticMission, Heir, SuccessionLaw } from './types';

export const INITIAL_RESOURCES: Resources = {
  wood: 400, stone: 300, food: 800, gold: 700, iron: 0, tools: 30, prestige: 100, knowledge: 60, piety: 0,
  beer: 0, clothes: 0, wine: 0, jewelry: 0, grain: 0, flour: 0, bread: 0, wool: 0, fabric: 0
};

const REGION_BONUSES: Record<string, Partial<Resources> & { happiness?: number }> = {
  north: { stone: 100, iron: 20 },
  south: { food: 150, grain: 100, wine: 30 },
  east: { wood: 150, knowledge: 30 },
  west: { gold: 150, food: 50 },
  central: { wood: 50, stone: 50, food: 50, gold: 50, happiness: 5 }
};

const DIFFICULTY_MODIFIERS = {
  easy: { resourceMultiplier: 1.5, negativeEventChance: 0.7 },
  normal: { resourceMultiplier: 1.0, negativeEventChance: 1.0 },
  hard: { resourceMultiplier: 0.75, negativeEventChance: 1.2 }
};

export const INITIAL_TECHS: Technology[] = [
  { id: 'agriculture_3', name: 'Rotazione Triennale', description: '+30% produzione grano e cibo.', cost: 100, unlocked: false, category: 'Economy', icon: '🌾' },
  { id: 'anatomy', name: 'Medicina Scolastica', description: '+20% salute globale della popolazione.', cost: 150, unlocked: false, category: 'Science', icon: '⚕️' },
  { id: 'double_entry', name: 'Contabilità', description: 'Riduce l\'inflazione del 50%.', cost: 200, unlocked: false, category: 'Economy', icon: '⚖️' },
  { id: 'heavy_armor', name: 'Armature a Piastre', description: '+50 potenza difensiva fissa.', cost: 300, unlocked: false, category: 'Military', icon: '🛡️' },
  { id: 'theology', name: 'Teologia Avanzata', description: '+5 pietà/tick e sblocca Cattedrale.', cost: 250, unlocked: false, category: 'Social', icon: '⛪' },
];

export const SEASONS: { id: SeasonType; name: string; effects: { grain?: number; food?: number; happiness?: number; health?: number } }[] = [
  { id: 'spring', name: 'Primavera', effects: { grain: 1.2, happiness: 5 } },
  { id: 'summer', name: 'Estate', effects: { grain: 1.0, food: 5, health: 2 } },
  { id: 'autumn', name: 'Autunno', effects: { grain: 1.5, food: 10, happiness: 3 } },
  { id: 'winter', name: 'Inverno', effects: { grain: 0.5, food: -10, happiness: -5, health: -3 } },
];

export const INITIAL_LAWS: Law[] = [
  { id: 'serfdom', name: 'Servitù della Gleba', description: '+50% produzione grano, -20 felicità contadini.', active: false, cost: 50, effect: 'grain_boost' },
  { id: 'divine_right', name: 'Diritto Divino', description: '+2 pietà/tick, i nobili pagano più tasse.', active: false, cost: 150, effect: 'piety_boost' },
  { id: 'martial_law', name: 'Legge Marziale', description: '+100 difesa, la felicità cala costantemente.', active: false, cost: 200, effect: 'defense_boost' }
];

export const DIPLOMATIC_MISSIONS: Record<string, Omit<DiplomaticMission, 'id' | 'progress' | 'kingdom'>> = {
  trade: {
    type: 'trade',
    description: 'Invia mercanti per stabilire rotte commerciali.',
    requirements: { gold: 50 },
    reward: { relations: 15, resources: { gold: 30 } },
    duration: 10,
    risk: 10,
    successChance: 80
  },
  military: {
    type: 'military',
    description: 'Offri supporto militare in cambio di alleanza.',
    requirements: { gold: 100, tools: 20 },
    reward: { relations: 25, resources: {} },
    duration: 15,
    risk: 30,
    successChance: 60
  },
  cultural: {
    type: 'cultural',
    description: 'Scambia studiosi e artisti per migliorare i rapporti.',
    requirements: { knowledge: 40 },
    reward: { relations: 20, resources: { knowledge: 20 } },
    duration: 12,
    risk: 5,
    successChance: 85
  },
  aid: {
    type: 'aid',
    description: 'Fornisci aiuti umanitari durante una crisi.',
    requirements: { food: 100, bread: 50 },
    reward: { relations: 30, piety: 15 },
    duration: 8,
    risk: 5,
    successChance: 90
  },
  marriage: {
    type: 'marriage',
    description: 'Organizza un matrimonio reale per unire le dinastie.',
    requirements: { gold: 300, prestige: 50 },
    reward: { relations: 50 },
    duration: 20,
    risk: 40,
    successChance: 50
  },
  embassy: {
    type: 'embassy',
    description: 'Costruisci un\'ambasciata permanente.',
    requirements: { gold: 200, stone: 100 },
    reward: { relations: 25, knowledge: 15 },
    duration: 25,
    risk: 15,
    successChance: 75
  },
  tribute: {
    type: 'tribute',
    description: 'Offri tributi per evitare conflitti.',
    requirements: { gold: 150, jewelry: 5 },
    reward: { relations: 20 },
    duration: 5,
    risk: 5,
    successChance: 95
  },
  espionage: {
    type: 'espionage',
    description: 'Invia spie per raccogliere informazioni.',
    requirements: { gold: 80 },
    reward: { relations: -10, knowledge: 40 },
    duration: 10,
    risk: 50,
    successChance: 40
  }
};

export const BUILDING_CATEGORIES: Record<string, string[]> = {
  'Base': ['house', 'farm', 'lumber_mill', 'stone_quarry', 'well', 'road'],
  'Industria': ['windmill', 'bakery', 'blacksmith', 'iron_mine'],
  'Corte': ['keep', 'barracks', 'university', 'church', 'cathedral']
};

export const BUILDINGS: Record<string, BuildingData> = {
  keep: { type: 'keep', name: 'Mastio Reale', description: 'Simbolo di potere.', cost: { gold: 400, stone: 250 }, production: { gold: 8, prestige: 2, knowledge: 1 }, populationProvided: 18, maxWorkers: 0 },
  house: { type: 'house', name: 'Casa', description: 'Abitazione sudditi.', cost: { wood: 25 }, populationProvided: 6, maxWorkers: 0 },
  farm: { type: 'farm', name: 'Fattoria', description: 'Produce Grano.', cost: { wood: 15 }, production: { grain: 8 }, maxWorkers: 2 },
  windmill: { type: 'windmill', name: 'Mulino', description: 'Crea Farina.', cost: { wood: 60, stone: 30 }, consumption: { grain: 6 }, production: { flour: 8 }, maxWorkers: 2 },
  bakery: { type: 'bakery', name: 'Forno', description: 'Crea Pane.', cost: { stone: 80, gold: 40 }, consumption: { flour: 5 }, production: { bread: 10 }, maxWorkers: 2 },
  lumber_mill: { type: 'lumber_mill', name: 'Segheria', description: 'Legname.', cost: { wood: 15, stone: 10 }, production: { wood: 10 }, maxWorkers: 3, requiresNode: 'forest' },
  stone_quarry: { type: 'stone_quarry', name: 'Cava', description: 'Pietra.', cost: { wood: 30 }, production: { stone: 8 }, maxWorkers: 3, requiresNode: 'stone_deposit' },
  iron_mine: { type: 'iron_mine', name: 'Miniera', description: 'Estrae Ferro.', cost: { wood: 50, stone: 25 }, production: { iron: 4 }, maxWorkers: 4, requiresNode: 'iron_deposit' },
  blacksmith: { type: 'blacksmith', name: 'Fabbro', description: 'Attrezzi.', cost: { wood: 40, stone: 40, gold: 60 }, consumption: { iron: 3, wood: 2 }, production: { tools: 3 }, maxWorkers: 3 },
  barracks: { type: 'barracks', name: 'Caserma', description: 'Difesa.', cost: { stone: 120, gold: 80 }, production: { gold: -3 }, maxWorkers: 6 },
  well: { type: 'well', name: 'Pozzo', description: 'Salute.', cost: { stone: 40 }, maxWorkers: 0 },
  university: { type: 'university', name: 'Università', description: 'Conoscenza.', cost: { stone: 180, gold: 180 }, production: { knowledge: 10 }, maxWorkers: 4 },
  church: { type: 'church', name: 'Chiesa', description: 'Pietà.', cost: { stone: 80, wood: 40 }, production: { piety: 4 }, maxWorkers: 2 },
  cathedral: { type: 'cathedral', name: 'Cattedrale', description: 'Divinità.', cost: { stone: 700, gold: 900 }, production: { piety: 18, prestige: 12 }, maxWorkers: 8 },
  brewery: { type: 'brewery', name: 'Birrificio', description: 'Birra.', cost: { wood: 80, gold: 80 }, production: { beer: 6 }, maxWorkers: 3 },
  tailor: { type: 'tailor', name: 'Sartoria', description: 'Vestiti.', cost: { gold: 120, tools: 4 }, production: { clothes: 3 }, maxWorkers: 3 },
  granary: { type: 'granary', name: 'Granaio', description: 'Conserva cibo.', cost: { wood: 40, stone: 25 }, maxWorkers: 2 },
  market: { type: 'market', name: 'Mercato', description: 'Commercio.', cost: { wood: 60, gold: 40 }, production: { gold: 6 }, maxWorkers: 3 },
  manor: { type: 'manor', name: 'Maniero', description: 'Residenza nobiliare.', cost: { stone: 350, gold: 250 }, populationProvided: 12, maxWorkers: 4 },
  wall: { type: 'wall', name: 'Mura', description: 'Difesa statica.', cost: { stone: 25 }, maxWorkers: 0 },
  tower: { type: 'tower', name: 'Torre', description: 'Punta difensiva.', cost: { stone: 120 }, maxWorkers: 3 },
  road: { type: 'road', name: 'Strada', description: 'Movimento veloce.', cost: { wood: 4 }, maxWorkers: 0 },
  winery: { type: 'winery', name: 'Vigneto', description: 'Produce vino.', cost: { wood: 50, gold: 35 }, production: { wine: 5 }, maxWorkers: 2 },
  jeweler: { type: 'jeweler', name: 'Gioielliere', description: 'Crea gioielli.', cost: { gold: 180, tools: 8 }, production: { jewelry: 2 }, maxWorkers: 3 },
  sheep_farm: { type: 'sheep_farm', name: 'Allevamento Pecore', description: 'Produce lana.', cost: { wood: 35 }, production: { wool: 6 }, maxWorkers: 2 },
  weaving_mill: { type: 'weaving_mill', name: 'Tessitoria', description: 'Crea tessuto.', cost: { wood: 60, gold: 25 }, consumption: { wool: 4 }, production: { fabric: 5 }, maxWorkers: 3 },
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

export function createInitialState(setup?: GameSetup): GameState {
  let resources = { ...INITIAL_RESOURCES };
  let population = { peasants: 25, citizens: 0, nobles: 0, total: 25, happiness: 100, health: 100, unemployed: 25, housed: 20 };
  let sovereignName = 'Re Alberto I';
  
  if (setup) {
    // Apply region bonuses
    const regionBonus = REGION_BONUSES[setup.region] || {};
    Object.entries(regionBonus).forEach(([key, value]) => {
      if (key === 'happiness') {
        population.happiness += value as number;
      } else if (key in resources) {
        resources[key as keyof Resources] += value as number;
      }
    });
    
    // Apply difficulty modifiers
    const diffModifier = DIFFICULTY_MODIFIERS[setup.difficulty];
    if (diffModifier.resourceMultiplier !== 1.0) {
      Object.keys(resources).forEach(key => {
        if (key !== 'prestige' && key !== 'knowledge' && key !== 'piety') {
          resources[key as keyof Resources] = Math.floor(resources[key as keyof Resources] * diffModifier.resourceMultiplier);
        }
      });
    }
    
    sovereignName = setup.sovereignName;
    population.happiness = Math.min(100, Math.max(0, population.happiness));
  }
  
  const initialHeir: Heir = {
    id: 'heir-initial',
    name: `${sovereignName.split(' ')[0]} II`,
    age: 18,
    relation: 'son',
    claimStrength: 100,
    traits: ['Scholar'],
    isFavorite: false,
    successionOrder: 1,
    alive: true
  };

  return {
    resources,
    time: { day: 1, month: 1, year: 1, season: 'spring', tick: 0 },
    technologies: INITIAL_TECHS,
    buildings: [{ id: 'start-keep', type: 'keep', x: 22, y: 22, level: 1, assignedWorkers: 0, efficiencyBonus: 0, condition: 100 }],
    resourceNodes: generateNodes(),
    population,
    sovereign: { name: sovereignName, age: 45, traits: ['Just'], portrait: '👑' },
    heir: { name: `${sovereignName.split(' ')[0]} II`, age: 18, traits: ['Scholar'], portrait: '🧒' },
    heirs: [initialHeir],
    successionLaw: 'primogeniture',
    religiousAuthority: {
      popeRelation: 50,
      bishopInfluence: 30,
      excommunicationLevel: 'none',
      crusadeActive: false,
      heresyLevel: 0,
      inquisitionActive: false
    },
    piety: 0,
    laws: INITIAL_LAWS,
    factions: [
      { type: 'merchants', name: 'Gilda Mercanti', favor: 0, bonus: 'Trade', effect: { resource: 'gold', bonus: 0.1 } } as Faction,
      { type: 'clergy', name: 'Alto Clero', favor: 0, bonus: 'Faith', effect: { resource: 'piety', bonus: 0.2 } } as Faction,
      { type: 'military', name: 'Ordine Militare', favor: 0, bonus: 'Defense', effect: { event: 'defense_boost' } } as Faction
    ],
    kingdoms: [
      { name: 'Wessex', relations: 50, status: 'peace' as const, strength: 80, missionsCompleted: 0, lastInteraction: 0 },
      { name: 'Mercia', relations: 30, status: 'peace' as const, strength: 60, missionsCompleted: 0, lastInteraction: 0 },
      { name: 'Vichinghi', relations: -20, status: 'war' as const, strength: 70, missionsCompleted: 0, lastInteraction: 0 },
      { name: 'Francia', relations: 40, status: 'trade' as const, strength: 90, missionsCompleted: 0, lastInteraction: 0 }
    ],
    events: [],
    status: 'playing',
    defenseRating: 25,
    threatLevel: 0,
    taxRate: 0.1,
    inflation: 1.0,
    debt: 0,
    activeDialogue: null,
    lastDialogueResult: null,
    weather: 'Clear',
    setup
  };
}

export const INITIAL_STATE = createInitialState();
