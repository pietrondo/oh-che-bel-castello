// BUILD-TRACKER-TYPES-7
export type ResourceType = 'wood' | 'stone' | 'food' | 'gold' | 'iron' | 'tools' | 'prestige' | 'knowledge';

export type Resources = {
  wood: number; stone: number; food: number; gold: number; iron: number; tools: number; prestige: number; knowledge: number;
};

export type NodeType = 'forest' | 'stone_deposit' | 'iron_deposit' | 'mountain' | 'river';

export interface ResourceNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  amount?: number;
}

export interface DialogueOption {
  text: string;
  resultText: string;
  effect: (state: GameState) => Partial<GameState>;
}

export interface Dialogue {
  id: string;
  speaker: string;
  portrait: string;
  text: string;
  options: DialogueOption[];
}

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface SocialClassPopulation { peasants: number; citizens: number; nobles: number; happiness: number; total: number; }

export type AdvisorType = 'marshal' | 'steward' | 'chancellor';
export interface Advisor { type: AdvisorType; name: string; level: number; bonus: string; }

export interface Technology { id: string; name: string; description: string; cost: number; unlocked: boolean; effect: string; }
export interface MarketPrice { type: ResourceType; buy: number; sell: number; trend: 'up' | 'down' | 'stable'; }

export type BuildingType = 
  | 'house' | 'farm' | 'lumber_mill' | 'stone_quarry' | 'granary' 
  | 'barracks' | 'blacksmith' | 'iron_mine' | 'market' | 'keep' | 'manor' | 'church' | 'university';

export interface Building {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
  level: number;
  assignedWorkers: number;
}

export interface BuildingData {
  type: BuildingType;
  name: string;
  cost: Partial<Resources>;
  production?: Partial<Resources>;
  consumption?: Partial<Resources>;
  populationProvided?: number;
  maxWorkers: number;
  description: string;
  requiresNode?: NodeType;
}

export interface GameState {
  resources: Resources;
  time: { day: number; month: number; year: number; season: Season; tick: number };
  buildings: Building[];
  resourceNodes: ResourceNode[];
  population: SocialClassPopulation;
  advisors: Advisor[];
  technologies: Technology[];
  marketPrices: MarketPrice[];
  activeDialogue: Dialogue | null;
  lastDialogueResult: string | null;
  defenseRating: number;
  threatLevel: number;
  taxRate: number;
}
