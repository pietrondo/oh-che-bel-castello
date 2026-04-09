import { useState, useEffect, useRef } from 'react';
import type { GameState, BuildingType, Resources, GameEvent, DiplomaticMission, Kingdom, GameSetup } from './types';
import { createInitialState, BUILDINGS, generateNodes, SEASONS } from './constants';
import { BUILDING_UPGRADES } from './buildingUpgrades';

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
      { id: `trade_${kingdom.name}`, kingdom: kingdom.name, type: 'trade', description: 'Stabilisci rotta commerciale', requirements: { gold: 100 }, reward: { relations: 15, resources: { gold: 50 } } },
      { id: `military_${kingdom.name}`, kingdom: kingdom.name, type: 'military', description: 'Esercitazione congiunta', requirements: { food: 200, tools: 10 }, reward: { relations: 20, prestige: 30 } },
      { id: `cultural_${kingdom.name}`, kingdom: kingdom.name, type: 'cultural', description: 'Scambio culturale', requirements: { knowledge: 50 }, reward: { relations: 25, resources: { knowledge: 30 } } },
      { id: `aid_${kingdom.name}`, kingdom: kingdom.name, type: 'aid', description: 'Invia aiuti umanitari', requirements: { food: 150, gold: 50 }, reward: { relations: 30, prestige: 20 } },
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

    if (nextTime.day % 7 === 0 && Math.random() < 0.15) {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      if (!eventsProcessedRef.current.has(`${event.id}_${nextTime.tick}`)) {
        state = addEvent(state, event);
        if (event.effect) {
          state = applyEventEffect(state, event.effect);
          Object.assign(nextResources, state.resources);
        }
        eventsProcessedRef.current.add(`${event.id}_${nextTime.tick}`);
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
                      let newStatus: 'peace' | 'war' | 'alliance' | 'trade' = k.status;
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
      }
  };
}
