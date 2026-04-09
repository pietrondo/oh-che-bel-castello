// BUILD-TRACKER-TYPES-13
export type ResourceType = 
  | 'wood' | 'stone' | 'food' | 'gold' | 'iron' | 'tools' | 'prestige' | 'knowledge' | 'piety'
  | 'beer' | 'clothes' | 'wine' | 'jewelry' | 'grain' | 'flour' | 'bread' | 'wool' | 'fabric';

export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

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

export interface Kingdom {
  name: string;
  relations: number;
  status: 'peace' | 'war' | 'alliance' | 'trade';
  strength: number;
  activeMission?: DiplomaticMission;
}

export interface DiplomaticMission {
  id: string;
  kingdom: string;
  type: 'trade' | 'military' | 'cultural' | 'aid';
  description: string;
  requirements: Partial<Resources>;
  reward: { relations: number; resources?: Partial<Resources>; prestige?: number };
  duration: number;
  progress: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  effect?: string;
  turn?: number;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameSetup {
  sovereignName: string;
  dynastyName: string;
  region: string;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface GameState {
  resources: Resources;
  time: { day: number; month: number; year: number; season: SeasonType; tick: number };
  technologies: Technology[];
  buildings: Building[];
  resourceNodes: ResourceNode[];
  population: { 
    peasants: number; 
    citizens: number; 
    nobles: number; 
    total: number; 
    happiness: number; 
    health: number;
    unemployed: number;
    housed: number;
  };
  sovereign: Sovereign;
  heir: Sovereign;
  laws: Law[];
  factions: Faction[];
  kingdoms: Kingdom[];
  events: GameEvent[];
  status: GameStatus;
  endReason?: string;
  defenseRating: number;
  threatLevel: number;
  taxRate: number;
  inflation: number;
  debt: number;
  activeDialogue: any | null;
  lastDialogueResult: string | null;
  weather: string;
  setup?: GameSetup;
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
  effect?: { resource?: string; bonus?: number; event?: string };
}
