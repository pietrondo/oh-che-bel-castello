// BUILD-TRACKER-TYPES-12
export type ResourceType = 
  | 'wood' | 'stone' | 'food' | 'gold' | 'iron' | 'tools' | 'prestige' | 'knowledge' | 'piety'
  | 'beer' | 'clothes' | 'wine' | 'jewelry'
  | 'grain' | 'flour' | 'bread' | 'wool' | 'fabric';

export type Resources = Record<ResourceType, number>;

export type SovereignTrait = 'Just' | 'Cruel' | 'Greedy' | 'Scholar' | 'Mad';

export interface Sovereign {
  name: string;
  age: number;
  traits: SovereignTrait[];
  portrait: string;
}

export interface Law {
  id: string;
  name: string;
  description: string;
  active: boolean;
  cost: number; // prestige
  effect: string;
}

export type BuildingType = 
  | 'house' | 'farm' | 'lumber_mill' | 'stone_quarry' | 'granary' 
  | 'barracks' | 'blacksmith' | 'iron_mine' | 'market' | 'keep' | 'manor' | 'church' | 'university' | 'cathedral'
  | 'road' | 'wall' | 'tower' | 'well'
  | 'brewery' | 'tailor' | 'winery' | 'jeweler'
  | 'windmill' | 'bakery' | 'sheep_farm' | 'weaving_mill';

export interface Building {
  id: string;
  type: BuildingType;
  x: number; y: number;
  assignedWorkers: number;
  efficiencyBonus: number;
}

export interface GameState {
  resources: Resources;
  time: { day: number; month: number; year: number; season: string; tick: number };
  sovereign: Sovereign;
  heir: Sovereign | null;
  buildings: Building[];
  resourceNodes: any[];
  laws: Law[];
  factions: any[];
  activeDialogue: any | null;
  defenseRating: number;
  threatLevel: number;
  taxRate: number;
  inflation: number;
  debt: number;
  population: { peasants: number; citizens: number; nobles: number; total: number; happiness: number; health: number };
  weather: string;
  caravans: any[];
  lastDialogueResult: string | null;
}
