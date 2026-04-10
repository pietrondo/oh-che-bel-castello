import { useState, useEffect, useRef } from 'react';
import type { GameState, BuildingType, Resources, GameEvent, DiplomaticMission, Kingdom, GameSetup, EventChoice, Heir, ReligiousAuthority, ExcommunicationLevel } from './types';
import { createInitialState, BUILDINGS, generateNodes, SEASONS } from './constants';
import { BUILDING_UPGRADES } from './buildingUpgrades';
import { DYNAMIC_EVENTS, getRandomEvent } from './dynamicEvents';

const TICK_RATE = 1000;
const SAVE_KEY = 'feudal_lord_research_v1';
const SAVE_SLOTS_KEY = 'feudal_lord_slots_v1';

export interface SaveSlot {
  id: number;
  name: string;
  date: number;
  gameState: GameState;
}

const RANDOM_EVENTS: Omit<GameEvent, 'turn'>[] = [
  { id: 'plague', title: '🦀 Epidemia!', description: 'Una pestilenza colpisce il regno. -15 salute, -10 felicità', type: 'negative', effect: 'health:-15,happiness:-10' },
  { id: 'bumper_crop', title: '🌾 Raccolto Abbondante!', description: 'Condizioni meteorologiche perfette. +200 cibo', type: 'positive', effect: 'food:+200' },
  { id: 'famine', title: '🍞 Carestia!', description: 'Il raccolto fallisce. -150 cibo, -20 felicità', type: 'negative', effect: 'food:-150,happiness:-20' },
  { id: 'gold_vein', title: '💰 Vena d\'Oro!', description: 'Trovata una vena nelle miniere. +150 oro', type: 'positive', effect: 'gold:+150' },
  { id: 'rebellion', title: '⚔️ Ribellione!', description: 'I contadini si ribellano! -30 felicità, -50 popolazione', type: 'negative', effect: 'happiness:-30,population:-50' },
  { id: 'royal_visit', title: '👑 Visita Reale!', description: 'Un regno alleato invia doni. +100 oro, +50 prestigio', type: 'positive', effect: 'gold:+100,prestige:+50' },
  { id: 'fire', title: '🔥 Incendio!', description: 'Un incendio distrugge scorte. -100 legno, -50 cibo', type: 'negative', effect: 'wood:-100,food:-50' },
  { id: 'scholar', title: '📚 Studioso Itinerante!', description: 'Un saggio condivide conoscenza. +50 conoscenza', type: 'positive', effect: 'knowledge:+50' },
  { id: 'bandits', title: '🗡️ Briganti!', description: 'Banditi attaccano i commerci. -80 oro', type: 'negative', effect: 'gold:-80' },
  { id: 'festival', title: '🎉 Festival del Regno!', description: 'Celebrazioni aumentano il morale. +15 felicità, +30 cibo', type: 'positive', effect: 'happiness:+15,food:+30' },
  { id: 'merchant_caravan', title: '🐫 Carovana Mercanti', description: 'Una carovana offre merci. +50 oro, +30 cibo', type: 'positive', effect: 'gold:+50,food:+30' },
  { id: 'earthquake', title: '🌍 Terremoto!', description: 'Un sisma danneggia edifici. -100 pietra, -10 salute', type: 'negative', effect: 'stone:-100,health:-10' },
  { id: 'deserter', title: '🏃 Disertore', description: 'Un soldato fugge portando info. -20 difesa, -10 prestigio', type: 'negative', effect: 'prestige:-10' },
  { id: 'holy_relic', title: '⛪ Reliquia Santa', description: 'Trovata una reliquia sacra. +100 pietà, +20 felicità', type: 'positive', effect: 'piety:+100,happiness:+20' },
  { id: 'wolf_attack', title: '🐺 Branco di Lupi', description: 'Lupi attaccano il bestiame. -40 cibo, -5 felicità', type: 'negative', effect: 'food:-40,happiness:-5' },
  { id: 'treasure', title: '💎 Tesoro Nascosto', description: 'Trovato un antico tesoro. +200 oro, +30 prestigio', type: 'positive', effect: 'gold:+200,prestige:+30' },
  { id: 'drought', title: '☀️ Siccità!', description: 'Lungo periodo senza pioggia. -80 cibo, -10 felicità', type: 'negative', effect: 'food:-80,happiness:-10' },
  { id: 'baby_birth', title: '👶 Nascita Reale', description: 'Un nuovo erede è nato! +30 felicità, +20 prestigio', type: 'positive', effect: 'happiness:+30,prestige:+20' },
  { id: 'spy_discovered', title: '🕵️ Spia Scoperta', description: 'Una spia infiltrata catturata. +20 conoscenza, -15 relazioni', type: 'neutral', effect: 'knowledge:+20' },
  { id: 'blight', title: '🐛 Infestazione!', description: 'Parassiti divorano i raccolti. -100 grano, -15 cibo', type: 'negative', effect: 'grain:-100,food:-15' },
];

const SEASONAL_EVENTS: Record<string, Omit<GameEvent, 'turn'>[]> = {
  spring: [
    { id: 'spring_festival', title: '🌸 Festival di Primavera', description: 'Il popolo celebra il risveglio della natura. +20 felicità, +50 cibo', type: 'positive', effect: 'happiness:+20,food:+50' },
    { id: 'spring_rains', title: '🌧️ Piogge Fertili', description: 'Piogge benefiche irrigano i campi. +30% grano prossimo tick', type: 'positive', effect: 'grain:+50' },
    { id: 'flower_bloom', title: '🌷 Fioritura Straordinaria', description: 'I campi fioriscono in anticipo. +15 felicità, +20 prestigio', type: 'positive', effect: 'happiness:+15,prestige:+20' },
    { id: 'spring_cleaning', title: '🧹 Pulizia di Primavera', description: 'I cittadini puliscono il regno. +5 salute, +10 felicità', type: 'positive', effect: 'health:+5,happiness:+10' },
  ],
  summer: [
    { id: 'summer_heat', title: '☀️ Ondata di Calore', description: 'Temperature torride stressano il popolo. -10 felicità, -20 cibo', type: 'negative', effect: 'happiness:-10,food:-20' },
    { id: 'summer_harvest', title: '🌾 Raccolto Estivo', description: 'I primi frutti della terra. +100 cibo, +10 felicità', type: 'positive', effect: 'food:+100,happiness:+10' },
    { id: 'thunderstorm', title: '⛈️ Tempesta Estiva', description: 'Fulmini danneggiano edifici. -50 legno, -5 salute', type: 'negative', effect: 'wood:-50,health:-5' },
    { id: 'summer_fair', title: '🎪 Fiera Estiva', description: 'Mercanti da tutto il regno. +80 oro, +15 felicità', type: 'positive', effect: 'gold:+80,happiness:+15' },
  ],
  autumn: [
    { id: 'autumn_harvest', title: '🍂 Grande Raccolto', description: 'Il miglior raccolto dell\'anno! +200 cibo, +200 grano', type: 'positive', effect: 'food:+200,grain:+200' },
    { id: 'hunter_moon', title: '🌕 Luna del Cacciatore', description: 'Caccia abbondante nei boschi. +80 cibo, +10 prestigio', type: 'positive', effect: 'food:+80,prestige:+10' },
    { id: 'autumn_winds', title: '💨 Venti d\'Autunno', description: 'Venti freddi anticipano l\'inverno. -5 salute, -10 felicità', type: 'negative', effect: 'health:-5,happiness:-10' },
    { id: 'wine_festival', title: '🍷 Festa del Vino', description: 'Celebrazione della vendemmia. +50 vino, +25 felicità', type: 'positive', effect: 'wine:+50,happiness:+25' },
  ],
  winter: [
    { id: 'heavy_snow', title: '❄️ Neve Abbondante', description: 'Neve isola il regno. -30 cibo, -10 felicità', type: 'negative', effect: 'food:-30,happiness:-10' },
    { id: 'winter_solstice', title: '🕯️ Solstizio d\'Inverno', description: 'Celebrazioni della luce. +15 pietà, +20 felicità', type: 'positive', effect: 'piety:+15,happiness:+20' },
    { id: 'frozen_lakes', title: '🧊 Laghi Ghiacciati', description: 'Pesca sul ghiaccio possibile. +40 cibo, +5 salute', type: 'positive', effect: 'food:+40,health:+5' },
    { id: 'winter_illness', title: '🤒 Malanni Invernali', description: 'Influenze stagionali diffuse. -10 salute, -5 felicità', type: 'negative', effect: 'health:-10,happiness:-5' },
    { id: 'hearth_warmth', title: '🔥 Calore del Focolare', description: 'Le famiglie si riuniscono. +10 felicità, +5 salute', type: 'positive', effect: 'happiness:+10,health:+5' },
  ],
};

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    const setupSaved = localStorage.getItem('feudal_lord_setup_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, activeDialogue: null };
      } catch (e) { 
        const setup = setupSaved ? JSON.parse(setupSaved) : undefined;
        return { ...createInitialState(setup), resourceNodes: generateNodes() }; 
      }
    }
    const setup = setupSaved ? JSON.parse(setupSaved) : undefined;
    return { ...createInitialState(setup), resourceNodes: generateNodes() };
  });

  const lastTickRef = useRef<number>(0);
  const eventsProcessedRef = useRef<Set<string>>(new Set());
  const conspiracyChanceRef = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    let animationFrameId: number;
    const tick = (time: number) => {
      if (time - lastTickRef.current >= TICK_RATE) {
        setGameState((prevState) => updateGameState(prevState));
        lastTickRef.current = time;
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const addEvent = (state: GameState, event: GameEvent): GameState => {
    const newEvent = { ...event, turn: state.time.tick };
    return { ...state, events: [newEvent, ...state.events].slice(0, 10) };
  };

  const generateDiplomaticMission = (kingdom: Kingdom): DiplomaticMission | null => {
    if (kingdom.status === 'war') return null;
    const missions: Omit<DiplomaticMission, 'progress' | 'duration'>[] = [
      { id: `trade_${kingdom.name}`, kingdom: kingdom.name, type: 'trade', description: 'Stabilisci rotta commerciale', requirements: { gold: 100 }, reward: { relations: 15, resources: { gold: 50 } }, risk: 10, successChance: 80 },
      { id: `military_${kingdom.name}`, kingdom: kingdom.name, type: 'military', description: 'Esercitazione congiunta', requirements: { food: 200, tools: 10 }, reward: { relations: 20, prestige: 30 }, risk: 30, successChance: 60 },
      { id: `cultural_${kingdom.name}`, kingdom: kingdom.name, type: 'cultural', description: 'Scambio culturale', requirements: { knowledge: 50 }, reward: { relations: 25, resources: { knowledge: 30 } }, risk: 5, successChance: 85 },
      { id: `aid_${kingdom.name}`, kingdom: kingdom.name, type: 'aid', description: 'Invia aiuti umanitari', requirements: { food: 150, gold: 50 }, reward: { relations: 30, prestige: 20 }, risk: 5, successChance: 90 },
    ];
    const selected = missions[Math.floor(Math.random() * missions.length)];
    return { ...selected, progress: 0, duration: 3 };
  };

  const applyEventEffect = (state: GameState, effect: string): GameState => {
    const next = { ...state, resources: { ...state.resources }, population: { ...state.population } };
    effect.split(',').forEach(e => {
      const [key, val] = e.split(':');
      const amount = parseInt(val);
      if (key in next.resources) {
        next.resources[key as keyof Resources] = Math.max(0, next.resources[key as keyof Resources] + amount);
      } else if (key === 'happiness') {
        next.population.happiness = Math.max(0, Math.min(100, next.population.happiness + amount));
      } else if (key === 'health') {
        next.population.health = Math.max(0, Math.min(100, next.population.health + amount));
      } else if (key === 'population') {
        const loss = Math.min(next.population.peasants, Math.abs(amount));
        next.population.peasants -= loss;
        next.population.total -= loss;
      }
    });
    return next;
  };

  const checkWinLose = (state: GameState): { status: 'playing' | 'won' | 'lost', reason?: string } => {
    if (state.population.total <= 0) {
      return { status: 'lost', reason: 'La tua popolazione è stata sterminata. Il regno è caduto.' };
    }
    if (state.population.happiness <= 0) {
      return { status: 'lost', reason: 'Rivoluzione! Il popolo ti ha deposto.' };
    }
    if (state.population.health <= 0) {
      return { status: 'lost', reason: 'La peste ha divorato il tuo regno.' };
    }
    if (state.time.year >= 50 && state.population.total >= 500 && state.resources.gold >= 5000) {
      return { status: 'won', reason: 'Hai costruito un impero glorioso che sopravviverà per secoli!' };
    }
    return { status: 'playing' };
  };

  const updateGameState = (state: GameState): GameState => {
    if (state.status !== 'playing') return state;
    if (state.activeDialogue) return state;

    const nextTime = { ...state.time, tick: state.time.tick + 1 };
    if (nextTime.tick >= 10) {
      nextTime.tick = 0; nextTime.day += 1;
      if (nextTime.day > 30) {
        nextTime.day = 1;
        nextTime.month += 1;
        if (nextTime.month > 12) {
          nextTime.month = 1;
          nextTime.year += 1;
        }
        if (nextTime.month % 3 === 1) {
          nextTime.season = nextTime.month === 1 ? 'spring' : nextTime.month === 4 ? 'summer' : nextTime.month === 7 ? 'autumn' : 'winter';
        }
      }
    }

    const nextResources = { ...state.resources };
    
    const hasAgri3 = state.technologies.find(t => t.id === 'agriculture_3')?.unlocked;
    const hasMed = state.technologies.find(t => t.id === 'anatomy')?.unlocked;
    const hasArmor = state.technologies.find(t => t.id === 'heavy_armor')?.unlocked;

    let totalHousing = 0;
    let totalJobs = 0;
    const productivityMod = (state.population.happiness / 100) * (state.population.health / 100);
    
    state.buildings.forEach((b) => {
      const data = BUILDINGS[b.type];
      const upgrades = BUILDING_UPGRADES[b.type];
      const upgrade = upgrades[b.level - 1];
      let housing = data.populationProvided || 0;
      let jobs = data.maxWorkers || 0;
      if (upgrade?.populationProvidedBonus) housing += upgrade.populationProvidedBonus;
      if (upgrade?.maxWorkersBonus) jobs += upgrade.maxWorkersBonus;
      if (housing > 0) totalHousing += housing;
      if (jobs > 0) totalJobs += jobs;
    });

    const productionOrder = ['grain', 'flour', 'bread', 'wool', 'fabric', 'clothes', 'wine', 'beer', 'jewelry', 'tools'];
    const consumptionResources = new Set<string>();
    const productionMap = new Map<string, number>();

    state.buildings.forEach((b) => {
      const data = BUILDINGS[b.type];
      const workRatio = data.maxWorkers > 0 ? Math.min(1, b.assignedWorkers / data.maxWorkers) : 1;
      if (workRatio <= 0 && data.maxWorkers > 0) return;

      if (data.consumption) {
        Object.entries(data.consumption).forEach(([res, amount]) => {
          consumptionResources.add(res);
        });
      }
    });

    state.buildings.forEach((b) => {
      const data = BUILDINGS[b.type];
      const upgrades = BUILDING_UPGRADES[b.type];
      const upgrade = upgrades[b.level - 1];
      const workRatio = data.maxWorkers > 0 ? Math.min(1, b.assignedWorkers / data.maxWorkers) : 1;
      if (workRatio <= 0 && data.maxWorkers > 0) return;

      if (data.consumption) {
        Object.entries(data.consumption).forEach(([res, amount]) => {
          let consumed = (amount as number) * workRatio;
          if (upgrade?.consumptionMultiplier) consumed *= upgrade.consumptionMultiplier;
          const available = nextResources[res as keyof Resources];
          const used = Math.min(available, consumed);
          nextResources[res as keyof Resources] -= used;
          if (used < consumed && Math.random() < 0.1) {
            state = addEvent(state, { id: `shortage_${res}`, title: '⚠️ Carenza', description: `${res} insufficiente per la produzione`, type: 'negative' });
          }
        });
      }

      if (data.production) {
        Object.entries(data.production).forEach(([res, amount]) => {
          let final = (amount as number) * workRatio * productivityMod;
          if (upgrade?.productionMultiplier) final *= upgrade.productionMultiplier;
          if (res === 'grain' && hasAgri3) final *= 1.3;
          const season = SEASONS.find(s => s.id === nextTime.season);
          if (season && res === 'grain' && season.effects.grain) final *= season.effects.grain;
          nextResources[res as keyof Resources] += final;
        });
      }
    });

    const foodCons = (state.population.peasants * 0.3) + (state.population.citizens * 0.5) + (state.population.nobles * 0.8);
    nextResources.food = Math.max(0, nextResources.food - foodCons);

    const employed = Math.min(totalJobs, state.population.total);
    const unemployed = Math.max(0, state.population.total - employed);
    const housedPop = Math.min(totalHousing, state.population.total);
    
    const season = SEASONS.find(s => s.id === nextTime.season);
    let nextHappiness = state.population.happiness;
    nextHappiness += (unemployed > 0 ? -0.5 : 0.2);
    nextHappiness += (housedPop < state.population.total ? -0.5 : 0.1);
    nextHappiness += (nextResources.food < foodCons ? -1 : 0);
    if (season?.effects.happiness) nextHappiness += season.effects.happiness / 30;
    nextHappiness = Math.max(0, Math.min(100, nextHappiness));

    let nextHealth = state.population.health;
    if (hasMed) nextHealth = Math.min(100, nextHealth + 0.1);
    if (nextResources.food < foodCons * 0.5) nextHealth = Math.max(0, nextHealth - 0.5);
    if (season?.effects.health) nextHealth += season.effects.health / 30;
    nextHealth = Math.max(0, Math.min(100, nextHealth));

    const factionMerchants = state.factions.find(f => f.type === 'merchants');
    const factionClergy = state.factions.find(f => f.type === 'clergy');
    const factionMilitary = state.factions.find(f => f.type === 'military');

    let factionDefenseBonus = 0;
    if (factionMerchants && factionMerchants.favor >= 50) {
      nextResources.gold += nextResources.gold * 0.05;
    }
    if (factionClergy && factionClergy.favor >= 50) {
      nextResources.piety += 2;
    }
    if (factionMilitary && factionMilitary.favor >= 50) {
      factionDefenseBonus = 20;
    }

    state.factions.forEach(faction => {
      if (faction.favor > 50) {
        faction.favor = Math.min(100, faction.favor + 0.5);
      } else if (faction.favor < -50) {
        faction.favor = Math.max(-100, faction.favor - 0.5);
      }
    });

    if (nextTime.day % 7 === 0 && Math.random() < 0.25) {
      // Generate dynamic events with choices
      const eventType = Math.random() < 0.4 ? 'crisis' : Math.random() < 0.7 ? 'opportunity' : Math.random() < 0.85 ? 'positive' : 'negative';
      const event = getRandomEvent(eventType as any);
      
      if (!eventsProcessedRef.current.has(`${event.id}_${nextTime.tick}`)) {
        state = addEvent(state, { ...event, turn: nextTime.tick });
        eventsProcessedRef.current.add(`${event.id}_${nextTime.tick}`);
      }
    }

    // Conspiracy system based on faction favor and sovereign health
    if (nextTime.day % 10 === 0) {
      let baseConspiracyChance = 0.05;
      
      // Low faction favor increases conspiracy chance
      state.factions.forEach(faction => {
        if (faction.favor < -30) {
          baseConspiracyChance += Math.abs(faction.favor) / 200;
        }
        if (faction.favor < -60) {
          baseConspiracyChance += 0.1;
        }
      });
      
      // Low happiness and health increase conspiracy
      if (state.population.happiness < 40) {
        baseConspiracyChance += (40 - state.population.happiness) / 100;
      }
      if (state.population.health < 40) {
        baseConspiracyChance += (40 - state.population.health) / 100;
      }
      
      // Add accumulated conspiracy chance from events
      baseConspiracyChance += conspiracyChanceRef.current;
      
      // Decay conspiracy chance over time
      conspiracyChanceRef.current = Math.max(0, conspiracyChanceRef.current - 0.01);
      
      if (Math.random() < baseConspiracyChance) {
        const conspiracyEvents = DYNAMIC_EVENTS.filter(e => 
          e.id === 'court_betrayal' || 
          e.id === 'assassination_attempt' || 
          e.id === 'poison_plot' ||
          e.id === 'noble_conspiracy'
        );
        const conspiracy = conspiracyEvents[Math.floor(Math.random() * conspiracyEvents.length)];
        
        if (conspiracy && !eventsProcessedRef.current.has(`conspiracy_${nextTime.tick}`)) {
          state = addEvent(state, { ...conspiracy, turn: nextTime.tick });
          eventsProcessedRef.current.add(`conspiracy_${nextTime.tick}`);
        }
      }
    }

    // Succession system: aging, death, births
    if (nextTime.day % 30 === 0) {
      // Age sovereign and heirs
      const sovereignAgeChance = state.sovereign.age >= 60 ? 0.1 : state.sovereign.age >= 50 ? 0.05 : 0.02;
      const healthModifier = (100 - state.population.health) / 200;
      const deathChance = sovereignAgeChance + healthModifier;
      
      if (Math.random() < deathChance && state.sovereign.age >= 40) {
        // Sovereign death - trigger succession
        const successionEvent = DYNAMIC_EVENTS.find(e => e.id === 'succession_crisis');
        if (successionEvent && !eventsProcessedRef.current.has(`succession_${nextTime.year}`)) {
          state = addEvent(state, { ...successionEvent, turn: nextTime.tick });
          eventsProcessedRef.current.add(`succession_${nextTime.year}`);
        }
      }
      
      // Birth chance based on sovereign age and happiness
      if (state.sovereign.age < 50 && state.population.happiness > 50 && Math.random() < 0.03) {
        const birthEvent = DYNAMIC_EVENTS.find(e => e.id === 'heir_birth');
        if (birthEvent && !eventsProcessedRef.current.has(`birth_${nextTime.year}_${nextTime.month}`)) {
          state = addEvent(state, { ...birthEvent, turn: nextTime.tick });
          eventsProcessedRef.current.add(`birth_${nextTime.year}_${nextTime.month}`);
          
          // Add new heir
          const newHeir: Heir = {
            id: `heir_${Date.now()}`,
            name: state.setup?.dynastyName || 'Royal' + ' ' + (state.heirs.length + 1),
            age: 0,
            relation: 'son',
            claimStrength: 100,
            traits: [],
            isFavorite: false,
            successionOrder: state.heirs.length + 1,
            alive: true
          };
          state.heirs.push(newHeir);
        }
      }
      
      // Age heirs
      state.heirs.forEach(heir => {
        if (heir.alive && heir.age < 80) {
          heir.age += 1/12; // Age by 1 month per tick
          
          // Coming of age event
          if (heir.age >= 16 && heir.age - 1/12 < 16) {
            const comingOfAgeEvent = DYNAMIC_EVENTS.find(e => e.id === 'heir_coming_of_age');
            if (comingOfAgeEvent && !eventsProcessedRef.current.has(`comingofage_${heir.id}`)) {
              state = addEvent(state, { ...comingOfAgeEvent, turn: nextTime.tick });
              eventsProcessedRef.current.add(`comingofage_${heir.id}`);
            }
          }
        }
      });
    }

    // Religious system: piety generation, excommunication, crusades
    if (nextTime.day % 15 === 0) {
      // Generate piety from buildings and clergy favor
      let pietyGenerated = 0;
      
      // Piety from church/cathedral buildings
      state.buildings.forEach(building => {
        if (building.type === 'church') {
          pietyGenerated += 4 * (building.level / 2);
        } else if (building.type === 'cathedral') {
          pietyGenerated += 18 * (building.level / 3);
        }
      });
      
      // Piety from clergy faction favor
      const clergyFaction = state.factions.find(f => f.type === 'clergy');
      if (clergyFaction && clergyFaction.favor > 0) {
        pietyGenerated += clergyFaction.favor / 20;
      }
      
      // Piety from laws (Divine Right)
      const divineRightLaw = state.laws.find(l => l.id === 'divine_right' && l.active);
      if (divineRightLaw) {
        pietyGenerated += 2;
      }
      
      // Piety from theology tech
      const theologyTech = state.technologies.find(t => t.id === 'theology' && t.unlocked);
      if (theologyTech) {
        pietyGenerated += 5;
      }
      
      if (pietyGenerated > 0) {
        nextResources.piety += pietyGenerated;
      }
      
      // Excommunication progression based on piety and relations with Pope
      let currentExcommunication: ExcommunicationLevel = 'none';
      if (state.religiousAuthority.excommunicationLevel !== 'none') {
        // Check if we can reduce excommunication through piety or payments
        if (nextResources.piety >= 50) {
          if (state.religiousAuthority.excommunicationLevel === 'major') {
            state.religiousAuthority.excommunicationLevel = 'minor';
            nextResources.piety -= 50;
          } else if (state.religiousAuthority.excommunicationLevel === 'minor') {
            state.religiousAuthority.excommunicationLevel = 'warning';
            nextResources.piety -= 30;
          } else if (state.religiousAuthority.excommunicationLevel === 'warning') {
            state.religiousAuthority.excommunicationLevel = 'none';
            nextResources.piety -= 20;
          }
        }
        
        // Increase heresy level if excommunicated and not paying attention
        if (state.religiousAuthority.excommunicationLevel !== 'none') {
          state.religiousAuthority.heresyLevel = Math.min(100, state.religiousAuthority.heresyLevel + 5);
        }
      }
      
      // Trigger excommunication events based on heresy level and papal relations
      if (state.religiousAuthority.popeRelation <= -50 && Math.random() < 0.3) {
        // High chance of excommunication threat
        const excommEvents = DYNAMIC_EVENTS.filter(e => 
          e.id === 'excommunication_threat' || 
          e.id === 'excommunication_major'
        );
        const excommEvent = excommEvents[Math.floor(Math.random() * excommEvents.length)];
        if (excommEvent && !eventsProcessedRef.current.has(`excomm_${nextTime.tick}`)) {
          state = addEvent(state, { ...excommEvent, turn: nextTime.tick });
          eventsProcessedRef.current.add(`excomm_${nextTime.tick}`);
          
          // Set excommunication level based on event type
          if (excommEvent.id === 'excommunication_major') {
            state.religiousAuthority.excommunicationLevel = 'major';
          } else if (excommEvent.id === 'excommunication_threat') {
            state.religiousAuthority.excommunicationLevel = 'warning';
          }
        }
      }
      
      // Crusade system - random crusade calls
      if (!state.religiousAuthority.crusadeActive && Math.random() < 0.1) {
        const crusadeEvent = DYNAMIC_EVENTS.find(e => e.id === 'crusade_call');
        if (crusadeEvent && !eventsProcessedRef.current.has(`crusade_${nextTime.year}`)) {
          state = addEvent(state, { ...crusadeEvent, turn: nextTime.tick });
          eventsProcessedRef.current.add(`crusade_${nextTime.year}`);
          state.religiousAuthority.crusadeActive = true;
        }
      }
      
      // Heresy spread events
      if (state.religiousAuthority.heresyLevel >= 30 && Math.random() < 0.2) {
        const heresyEvent = DYNAMIC_EVENTS.find(e => e.id === 'heresy_spread');
        if (heresyEvent && !eventsProcessedRef.current.has(`heresy_${nextTime.tick}`)) {
          state = addEvent(state, { ...heresyEvent, turn: nextTime.tick });
          eventsProcessedRef.current.add(`heresy_${nextTime.tick}`);
        }
      }
    }

    if (nextTime.day % 20 === 0 && Math.random() < 0.4) {
      const seasonalPool = SEASONAL_EVENTS[nextTime.season];
      if (seasonalPool && seasonalPool.length > 0) {
        const seasonalEvent = seasonalPool[Math.floor(Math.random() * seasonalPool.length)];
        const eventKey = `seasonal_${seasonalEvent.id}_${nextTime.year}_${nextTime.month}`;
        if (!eventsProcessedRef.current.has(eventKey)) {
          state = addEvent(state, seasonalEvent);
          if (seasonalEvent.effect) {
            state = applyEventEffect(state, seasonalEvent.effect);
            Object.assign(nextResources, state.resources);
          }
          eventsProcessedRef.current.add(eventKey);
        }
      }
    }

    if (nextTime.day % 15 === 0) {
      state.kingdoms.forEach((kingdom, idx) => {
        if (!kingdom.activeMission && kingdom.status !== 'war' && Math.random() < 0.3) {
          const mission = generateDiplomaticMission(kingdom);
          if (mission) {
            const canAfford = Object.entries(mission.requirements).every(([res, amt]) => nextResources[res as keyof Resources] >= amt);
            if (canAfford) {
              Object.entries(mission.requirements).forEach(([res, amt]) => {
                nextResources[res as keyof Resources] -= amt;
              });
              state = addEvent(state, { 
                id: `mission_${mission.id}`, 
                title: '📜 Missione Diplomatica', 
                description: `${mission.description} con ${kingdom.name}`, 
                type: 'neutral' 
              });
              state.kingdoms[idx].activeMission = mission;
            }
          }
        }
      });
    }

    state.kingdoms.forEach((kingdom, idx) => {
      if (kingdom.activeMission) {
        kingdom.activeMission.progress += 1;
        if (kingdom.activeMission.progress >= kingdom.activeMission.duration) {
          const m = kingdom.activeMission;
          const successRoll = Math.random() * 100;
          const isSuccess = successRoll <= m.successChance;
          
          if (isSuccess) {
            state = addEvent(state, { 
              id: `mission_complete_${m.id}`, 
              title: '✅ Missione Completata', 
              description: `Missione con ${m.kingdom} completata con successo!`, 
              type: 'positive' 
            });
            state.kingdoms[idx].relations = Math.min(100, state.kingdoms[idx].relations + m.reward.relations);
            if (m.reward.prestige) {
              nextResources.prestige += m.reward.prestige;
            }
            if (m.reward.resources) {
              Object.entries(m.reward.resources).forEach(([res, amt]) => {
                nextResources[res as keyof Resources] += amt;
              });
            }
            if (m.reward.knowledge) {
              nextResources.knowledge += m.reward.knowledge;
            }
            if (m.reward.piety) {
              nextResources.piety += m.reward.piety;
            }
            state.kingdoms[idx].missionsCompleted += 1;
            
            // Change status if relations are high enough
            if (state.kingdoms[idx].relations >= 80) {
              state.kingdoms[idx].status = 'alliance';
            } else if (state.kingdoms[idx].relations >= 40) {
              state.kingdoms[idx].status = 'trade';
            }
          } else {
            state = addEvent(state, { 
              id: `mission_failed_${m.id}`, 
              title: '❌ Missione Fallita', 
              description: `La missione con ${m.kingdom} è fallita.`, 
              type: 'negative' 
            });
            state.kingdoms[idx].relations = Math.max(-100, state.kingdoms[idx].relations - 5);
            
            // Small chance of negative consequences based on risk
            if (Math.random() * 100 < m.risk) {
              state = addEvent(state, { 
                id: `mission_backfire_${m.id}`, 
                title: '⚠️ Conseguenze Negative', 
                description: `La missione fallita ha causato tensioni con ${m.kingdom}.`, 
                type: 'negative' 
              });
              state.kingdoms[idx].relations = Math.max(-100, state.kingdoms[idx].relations - 10);
            }
          }
          state.kingdoms[idx].activeMission = undefined;
        }
      }
    });

    let defense = 25;
    if (hasArmor) defense += 50;
    defense += factionDefenseBonus;

    const winLose = checkWinLose({ ...state, resources: nextResources, population: { ...state.population, health: nextHealth, happiness: nextHappiness } });

    return { 
      ...state, 
      resources: nextResources, 
      population: { 
        ...state.population, 
        health: nextHealth, 
        happiness: nextHappiness,
        unemployed,
        housed: housedPop
      }, 
      defenseRating: defense, 
      time: nextTime,
      status: winLose.status,
      endReason: winLose.reason
    };
  };

  const unlockTech = (id: string) => {
      setGameState(prev => {
          const tech = prev.technologies.find(t => t.id === id);
          if (tech && !tech.unlocked && prev.resources.knowledge >= tech.cost) {
              return {
                  ...prev,
                  resources: { ...prev.resources, knowledge: prev.resources.knowledge - tech.cost },
                  technologies: prev.technologies.map(t => t.id === id ? { ...t, unlocked: true } : t)
              };
          }
          return prev;
      });
  };

  return {
      gameState, unlockTech,
      interactFaction: (factionType: string, delta: number) => {
        setGameState(prev => ({
          ...prev,
          factions: prev.factions.map(f => {
            if (f.type === factionType) {
              const newFavor = Math.max(-100, Math.min(100, f.favor + delta));
              return { ...f, favor: newFavor };
            }
            return f;
          })
        }));
      },
      buildBuilding: (type: BuildingType, x: number, y: number) => {
          const data = BUILDINGS[type];
          if (!data || !data.cost) return;
          const canAfford = Object.entries(data.cost).every(([res, amount]) => gameState.resources[res as keyof Resources] >= amount);
          if (canAfford) {
              const newResources = { ...gameState.resources };
              Object.entries(data.cost).forEach(([res, amount]) => {
                  newResources[res as keyof Resources] -= amount;
              });
              setGameState(prev => ({
                  ...prev,
                  resources: newResources,
                  buildings: [...prev.buildings, { id: Math.random().toString(), type, x, y, level: 1, assignedWorkers: 0, efficiencyBonus: 0, condition: 100 }]
              }));
          }
      },
      upgradeBuilding: (id: string) => {
        setGameState(prev => {
          const buildingIndex = prev.buildings.findIndex(b => b.id === id);
          if (buildingIndex === -1) return prev;
          
          const building = prev.buildings[buildingIndex];
          const upgrades = BUILDING_UPGRADES[building.type];
          const currentUpgrade = upgrades[building.level - 1];
          const nextLevel = building.level + 1;
          
          if (nextLevel > 5) return prev;
          
          const nextUpgrade = upgrades[nextLevel - 1];
          if (!nextUpgrade.cost) return prev;
          
          const canAfford = Object.entries(nextUpgrade.cost).every(
            ([res, amount]) => prev.resources[res as keyof Resources] >= amount
          );
          
          if (!canAfford) return prev;
          
          const newResources = { ...prev.resources };
          Object.entries(nextUpgrade.cost).forEach(([res, amount]) => {
            newResources[res as keyof Resources] -= amount;
          });
          
          const updatedBuildings = [...prev.buildings];
          updatedBuildings[buildingIndex] = { ...building, level: nextLevel };
          
          return {
            ...prev,
            resources: newResources,
            buildings: updatedBuildings
          };
        });
      },
      assignWorker: (id: string, amt: number) => {
          setGameState(prev => ({
              ...prev,
              buildings: prev.buildings.map(b => b.id === id ? { ...b, assignedWorkers: Math.max(0, Math.min(BUILDINGS[b.type].maxWorkers, b.assignedWorkers + amt)) } : b)
          }));
      },
      enactLaw: (id: string) => {
          setGameState(prev => {
              const law = prev.laws.find(l => l.id === id);
              if (law && !law.active && prev.resources.gold >= law.cost) {
                  return {
                      ...prev,
                      resources: { ...prev.resources, gold: prev.resources.gold - law.cost },
                      laws: prev.laws.map(l => l.id === id ? { ...l, active: true } : l)
                  };
              }
              return prev;
          });
      },
      updateDiplomacy: (kingdom: string, delta: number) => {
          setGameState(prev => ({
              ...prev,
              kingdoms: prev.kingdoms.map(k => {
                  if (k.name === kingdom) {
                      const newRelations = Math.max(-100, Math.min(100, k.relations + delta));
                      let newStatus: 'peace' | 'war' | 'alliance' | 'trade' | 'vassal' | 'suzerain' = k.status;
                      if (newRelations >= 80) newStatus = 'alliance';
                      else if (newRelations <= -50) newStatus = 'war';
                      else if (newRelations >= 40) newStatus = 'trade';
                      else newStatus = 'peace';
                      return { ...k, relations: newRelations, status: newStatus };
                  }
                  return k;
              })
          }));
      },
      dismissEvent: (index: number) => {
          setGameState(prev => ({
              ...prev,
              events: prev.events.filter((_, i) => i !== index)
          }));
      },
      chooseEventOption: (eventIndex: number, choiceId: string) => {
        setGameState(prev => {
          const event = prev.events[eventIndex];
          if (!event || !event.choices) return prev;
          
          const choice = event.choices.find(c => c.id === choiceId);
          if (!choice) return prev;
          
          // Check requirements
          if (choice.requirements) {
            const canAfford = Object.entries(choice.requirements).every(([key, value]) => {
              if (key === 'gold') return prev.resources.gold >= value;
              if (key === 'knowledge') return prev.resources.knowledge >= value;
              if (key === 'piety') return prev.resources.piety >= value;
              if (key === 'prestige') return prev.resources.prestige >= value;
              if (key === 'defense') return prev.defenseRating >= value;
              if (key in prev.resources) return prev.resources[key as keyof Resources] >= value;
              return true;
            });
            
            if (!canAfford) return prev;
          }
          
          // Apply effects
          const next = { ...prev };
          const nextResources = { ...prev.resources };
          
          if (choice.effects.resources) {
            Object.entries(choice.effects.resources).forEach(([key, value]) => {
              nextResources[key as keyof Resources] = Math.max(0, nextResources[key as keyof Resources] + value);
            });
          }
          
          if (choice.effects.happiness) {
            next.population = { ...next.population, happiness: Math.max(0, Math.min(100, next.population.happiness + choice.effects.happiness)) };
          }
          
          if (choice.effects.health) {
            next.population = { ...next.population, health: Math.max(0, Math.min(100, next.population.health + choice.effects.health)) };
          }
          
          if (choice.effects.population) {
            const popChange = choice.effects.population;
            next.population = { 
              ...next.population, 
              peasants: Math.max(0, next.population.peasants + popChange),
              total: Math.max(0, next.population.total + popChange)
            };
          }
          
          if (choice.effects.defense) {
            next.defenseRating = Math.max(0, next.defenseRating + choice.effects.defense);
          }
          
          if (choice.effects.relations) {
            next.kingdoms = next.kingdoms.map(k => {
              const relationChange = choice.effects.relations?.find(r => r.kingdom === k.name);
              if (relationChange) {
                return { ...k, relations: Math.max(-100, Math.min(100, k.relations + relationChange.delta)) };
              }
              return k;
            });
          }
          
          if (choice.effects.factionFavor) {
            next.factions = next.factions.map(f => {
              const favorChange = choice.effects.factionFavor?.find(ff => ff.faction === f.type);
              if (favorChange) {
                return { ...f, favor: Math.max(-100, Math.min(100, f.favor + favorChange.delta)) };
              }
              return f;
            });
          }
          
          if (choice.effects.conspiracyChance) {
            conspiracyChanceRef.current = Math.max(0, Math.min(1, conspiracyChanceRef.current + choice.effects.conspiracyChance));
          }
          
          if (choice.effects.successionLaw) {
            next.successionLaw = choice.effects.successionLaw;
          }
          
          // Remove the event and add a result notification
          const newEvents = prev.events.filter((_, i) => i !== eventIndex);
          
          return {
            ...next,
            resources: nextResources,
            events: newEvents
          };
        });
      },
      resetGame: () => { 
          eventsProcessedRef.current.clear();
          localStorage.removeItem(SAVE_KEY);
          localStorage.removeItem('feudal_lord_setup_v1');
          window.location.reload(); 
      },
      startNewGame: (setup: GameSetup) => {
        eventsProcessedRef.current.clear();
        localStorage.removeItem(SAVE_KEY);
        localStorage.setItem('feudal_lord_setup_v1', JSON.stringify(setup));
        const newState = createInitialState(setup);
        setGameState({ ...newState, resourceNodes: generateNodes() });
      },
      saveGame: (slotId: number, name: string) => {
        const slots = JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY) || '[]') as SaveSlot[];
        const existingIndex = slots.findIndex(s => s.id === slotId);
        const newSlot: SaveSlot = {
          id: slotId,
          name,
          date: Date.now(),
          gameState: gameState
        };
        if (existingIndex >= 0) {
          slots[existingIndex] = newSlot;
        } else {
          slots.push(newSlot);
        }
        localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
      },
      loadGame: (slotId: number) => {
        const slots = JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY) || '[]') as SaveSlot[];
        const slot = slots.find(s => s.id === slotId);
        if (slot) {
          eventsProcessedRef.current.clear();
          setGameState(slot.gameState);
        }
      },
      deleteSave: (slotId: number) => {
        const slots = JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY) || '[]') as SaveSlot[];
        const filtered = slots.filter(s => s.id !== slotId);
        localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(filtered));
      },
      getSaveSlots: (): SaveSlot[] => {
        return JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY) || '[]') as SaveSlot[];
      },
      setTaxRate: (newRate: number) => {
        setGameState(prev => ({
          ...prev,
          taxRate: Math.max(0, Math.min(0.5, newRate)),
          population: {
            ...prev.population,
            happiness: Math.max(0, Math.min(100, prev.population.happiness + (prev.taxRate - newRate) * 20))
          }
        }));
      },
      takeLoan: (amount: number) => {
        setGameState(prev => {
          const interest = amount * 0.1; // 10% interest
          return {
            ...prev,
            resources: { ...prev.resources, gold: prev.resources.gold + amount },
            debt: prev.debt + amount + interest
          };
        });
      },
      repayDebt: (amount: number) => {
        setGameState(prev => {
          const repayAmount = Math.min(amount, prev.debt, prev.resources.gold);
          return {
            ...prev,
            resources: { ...prev.resources, gold: prev.resources.gold - repayAmount },
            debt: Math.max(0, prev.debt - repayAmount)
          };
        });
      },
      startDiplomaticMission: (kingdomName: string, missionType: string) => {
        setGameState(prev => {
          const kingdomIndex = prev.kingdoms.findIndex(k => k.name === kingdomName);
          if (kingdomIndex === -1 || prev.kingdoms[kingdomIndex].status === 'war') return prev;
          
          const DIPLOMATIC_MISSIONS = {
            trade: {
              type: 'trade',
              description: 'Invia mercanti per stabilire rotte commerciali.',
              requirements: { gold: 50 },
              reward: { relations: 15, gold: 30 },
              duration: 10,
              risk: 10,
              successChance: 80
            },
            military: {
              type: 'military',
              description: 'Offri supporto militare in cambio di alleanza.',
              requirements: { gold: 100, tools: 20 },
              reward: { relations: 25 },
              duration: 15,
              risk: 30,
              successChance: 60
            },
            cultural: {
              type: 'cultural',
              description: 'Scambia studiosi e artisti per migliorare i rapporti.',
              requirements: { knowledge: 40 },
              reward: { relations: 20, knowledge: 20 },
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
          
          const missionTemplate = DIPLOMATIC_MISSIONS[missionType as keyof typeof DIPLOMATIC_MISSIONS];
          if (!missionTemplate) return prev;
          
          const canAfford = Object.entries(missionTemplate.requirements).every(
            ([res, amt]) => prev.resources[res as keyof Resources] >= (amt as number)
          );
          
          if (!canAfford) return prev;
          
          const newResources = { ...prev.resources };
          Object.entries(missionTemplate.requirements).forEach(([res, amt]) => {
            newResources[res as keyof Resources] -= amt as number;
          });
          
          let successChance = missionTemplate.successChance;
          successChance += Math.max(-30, Math.min(30, prev.kingdoms[kingdomIndex].relations / 3));
          
          const mission: DiplomaticMission = {
            id: `mission_${missionType}_${kingdomName}_${Date.now()}`,
            kingdom: kingdomName,
            type: missionTemplate.type as any,
            description: missionTemplate.description,
            requirements: missionTemplate.requirements,
            reward: missionTemplate.reward,
            duration: missionTemplate.duration,
            progress: 0,
            risk: missionTemplate.risk,
            successChance
          };
          
          const updatedKingdoms = [...prev.kingdoms];
          updatedKingdoms[kingdomIndex] = { 
            ...updatedKingdoms[kingdomIndex], 
            activeMission: mission,
            lastInteraction: prev.time.tick
          };
          
          return {
            ...prev,
            resources: newResources,
            kingdoms: updatedKingdoms
          };
        });
      }
  };
}
