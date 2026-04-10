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
  status: 'peace' | 'war' | 'alliance' | 'trade' | 'vassal' | 'suzerain';
  strength: number;
  activeMission?: DiplomaticMission;
  missionsCompleted: number;
  lastInteraction: number;
}

export interface DiplomaticMission {
  id: string;
  kingdom: string;
  type: 'trade' | 'military' | 'cultural' | 'aid' | 'marriage' | 'embassy' | 'tribute' | 'espionage';
  description: string;
  requirements: Partial<Resources>;
  reward: { relations: number; resources?: Partial<Resources>; prestige?: number; knowledge?: number; piety?: number };
  duration: number;
  progress: number;
  risk: number; // 0-100, chance of failure or negative consequences
  successChance: number; // Based on relations, resources invested, kingdom traits
}

export interface EventChoice {
  id: string;
  text: string;
  description?: string;
  requirements?: Partial<Resources> & { gold?: number; knowledge?: number; piety?: number; prestige?: number; defense?: number };
  effects: {
    resources?: Partial<Resources>;
    happiness?: number;
    health?: number;
    population?: number;
    defense?: number;
    relations?: { kingdom: string; delta: number }[];
    factionFavor?: { faction: string; delta: number }[];
    conspiracyChance?: number;
    successionLaw?: SuccessionLaw;
  };
  probability?: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'crisis' | 'opportunity';
  effect?: string;
  turn?: number;
  choices?: EventChoice[];
  chosenChoice?: string;
  image?: string; // Emoji or icon for the event
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
  heirs: Heir[];
  successionLaw: SuccessionLaw;
  religiousAuthority: ReligiousAuthority;
  piety: number;
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

export type SuccessionLaw = 'primogeniture' | 'ultimogeniture' | 'elective' | 'gavelkind';

export interface Heir {
  id: string;
  name: string;
  age: number;
  relation: 'son' | 'daughter' | 'brother' | 'sister' | 'cousin' | 'nephew' | 'niece';
  claimStrength: number;
  traits: string[];
  isFavorite: boolean;
  successionOrder: number;
  alive: boolean;
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

export type ExcommunicationLevel = 'none' | 'warning' | 'minor' | 'major';

export interface ReligiousAuthority {
  popeRelation: number;
  bishopInfluence: number;
  excommunicationLevel: ExcommunicationLevel;
  crusadeActive: boolean;
  heresyLevel: number;
  inquisitionActive: boolean;
}
