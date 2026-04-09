// BUILD-TRACKER-TYPES-13
export type ResourceType = 
  | 'wood' | 'stone' | 'food' | 'gold' | 'iron' | 'tools' | 'prestige' | 'knowledge' | 'piety'
  | 'beer' | 'clothes' | 'wine' | 'jewelry' | 'grain' | 'flour' | 'bread' | 'wool' | 'fabric';

export type Resources = Record<ResourceType, number>;

export interface Technology {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  category: 'Economy' | 'Science' | 'Military' | 'Social';
  icon: string;
}

export type BuildingType = 
  | 'house' | 'farm' | 'lumber_mill' | 'stone_quarry' | 'granary' 
  | 'barracks' | 'blacksmith' | 'iron_mine' | 'market' | 'keep' | 'manor' | 'church' | 'university' | 'cathedral'
  | 'road' | 'wall' | 'tower' | 'well' | 'brewery' | 'tailor' | 'winery' | 'jeweler'
  | 'windmill' | 'bakery' | 'sheep_farm' | 'weaving_mill';

export interface Building { id: string; type: BuildingType; x: number; y: number; level: number; assignedWorkers: number; efficiencyBonus: number; condition: number; }

export interface BuildingData {
  type: BuildingType;
  name: string;
  description: string;
  cost?: Partial<Resources>;
  production?: Partial<Resources>;
  consumption?: Partial<Resources>;
  populationProvided?: number;
  maxWorkers: number;
  requiresNode?: 'forest' | 'stone_deposit' | 'iron_deposit';
  efficiencyBonus?: number;
}

export interface ResourceNode {
  id: string;
  type: 'forest' | 'stone_deposit' | 'iron_deposit';
  x: number;
  y: number;
  amount: number;
}

export interface GameState {
  resources: Resources;
  time: { day: number; month: number; year: number; season: string; tick: number };
  technologies: Technology[];
  buildings: Building[];
  resourceNodes: ResourceNode[];
  population: { peasants: number; citizens: number; nobles: number; total: number; happiness: number; health: number };
  sovereign: Sovereign;
  heir: Sovereign;
  laws: Law[];
  factions: Faction[];
  defenseRating: number;
  threatLevel: number;
  taxRate: number;
  inflation: number;
  debt: number;
  activeDialogue: any | null;
  lastDialogueResult: string | null;
  weather: string;
}

export interface Sovereign {
  name: string;
  age: number;
  traits: string[];
  portrait: string;
}

export interface Law {
  id: string;
  name: string;
  description: string;
  active: boolean;
  cost: number;
  effect: string;
}

export interface Faction {
  type: string;
  name: string;
  favor: number;
  bonus: string;
}
