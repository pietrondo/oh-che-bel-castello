// BUILD-TRACKER-TYPES-11
export type ResourceType = 
  | 'wood' | 'stone' | 'food' | 'gold' | 'iron' | 'tools' | 'prestige' | 'knowledge' | 'piety'
  | 'beer' | 'clothes' | 'wine' | 'jewelry';

export type Resources = {
  wood: number; stone: number; food: number; gold: number; iron: number; tools: number; 
  prestige: number; knowledge: number; piety: number;
  beer: number; clothes: number; wine: number; jewelry: number;
};

export type FactionType = 'merchants' | 'clergy' | 'military';

export interface Faction {
  type: FactionType;
  name: string;
  favor: number; // -100 to 100
  bonus: string;
}

export type WeatherType = 'Clear' | 'Rain' | 'Storm' | 'Snow';

export interface Caravan {
  id: string;
  targetKingdomId: string;
  resourceType: ResourceType;
  amount: number;
  progress: number;
  status: 'Outgoing' | 'Returning' | 'Plundered';
  x: number;
  y: number;
}

export type NodeType = 'forest' | 'stone_deposit' | 'iron_deposit' | 'mountain' | 'river';
export interface ResourceNode { id: string; type: NodeType; x: number; y: number; amount?: number; }

export type BuildingType = 
  | 'house' | 'farm' | 'lumber_mill' | 'stone_quarry' | 'granary' 
  | 'barracks' | 'blacksmith' | 'iron_mine' | 'market' | 'keep' | 'manor' | 'church' | 'university' | 'cathedral'
  | 'road' | 'wall' | 'tower' | 'well'
  | 'brewery' | 'tailor' | 'winery' | 'jeweler';

export interface Building {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
  level: number;
  assignedWorkers: number;
  efficiencyBonus: number;
  condition: number;
}

export interface Law {
  id: string;
  name: string;
  description: string;
  active: boolean;
  prestigeCost: number;
  pietyRequirement: number;
}

export interface GameState {
  resources: Resources;
  time: { day: number; month: number; year: number; season: Season; tick: number };
  weather: WeatherType;
  buildings: Building[];
  resourceNodes: ResourceNode[];
  caravans: Caravan[];
  factions: Faction[];
  debt: number;
  inflation: number; // 1.0 = base
  population: { peasants: number; citizens: number; nobles: number; happiness: number; health: number; total: number; };
  technologies: any[];
  marketPrices: any[];
  kingdoms: any[];
  laws: Law[];
  activeDialogue: any | null;
  lastDialogueResult: string | null;
  defenseRating: number;
  threatLevel: number;
  taxRate: number;
}

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
