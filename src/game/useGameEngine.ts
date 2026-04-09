import { useState, useEffect, useRef } from 'react';
import type { GameState, BuildingType, Resources, Dialogue, DialogueOption, ResourceType, Building, Caravan, WeatherType, Law, Faction } from './types';
import { INITIAL_STATE, BUILDINGS } from './constants';

const TICK_RATE = 1000;
const SAVE_KEY = 'feudal_lord_final_logic_v1';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, activeDialogue: null, lastDialogueResult: null };
      } catch (e) { return INITIAL_STATE; }
    }
    return INITIAL_STATE;
  });

  const lastTickRef = useRef<number>(0);

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

  const updateGameState = (state: GameState): GameState => {
    if (state.activeDialogue) return state;

    const nextTime = { ...state.time, tick: state.time.tick + 1 };
    
    if (nextTime.tick >= 10) {
      nextTime.tick = 0;
      nextTime.day += 1;
      if (nextTime.day > 30) {
        nextTime.day = 1; nextTime.month += 1;
        if (nextTime.month > 12) { nextTime.month = 1; nextTime.year += 1; }
      }
    }

    const nextResources = { ...state.resources };
    
    // Infrastructure & Efficiency
    const nextBuildings = state.buildings.map(b => {
        if (b.type === 'road' || b.type === 'well') return b;
        const nearRoad = state.buildings.some(r => r.type === 'road' && Math.abs(r.x - b.x) <= 2 && Math.abs(r.y - b.y) <= 2);
        return { ...b, efficiencyBonus: nearRoad ? 0.2 : 0 };
    });

    // Health Logic
    const wells = state.buildings.filter(b => b.type === 'well').length;
    const healthReq = state.population.total / 15;
    let nextHealth = state.population.health;
    if (wells < healthReq) nextHealth = Math.max(0, nextHealth - 0.5);
    else nextHealth = Math.min(100, nextHealth + 0.2);

    // Law Modifiers & Faction Favor
    const hasForcedLabor = state.laws.find(l => l.id === 'forced_labor')?.active;
    const hasTithe = state.laws.find(l => l.id === 'tithe')?.active;
    const hasConscription = state.laws.find(l => l.id === 'conscription')?.active;

    // Production logic
    const productivityMod = (state.population.happiness / 100) * (state.population.health / 100) * (hasForcedLabor ? 1.3 : 1.0);
    
    nextBuildings.forEach((b) => {
      const data = BUILDINGS[b.type];
      const workRatio = data.maxWorkers > 0 ? b.assignedWorkers / data.maxWorkers : 1;
      if (workRatio <= 0 && data.maxWorkers > 0) return;

      if (data.production) {
        Object.entries(data.production).forEach(([res, amount]) => {
          let final = (amount as number) * workRatio * productivityMod * (1 + b.efficiencyBonus);
          nextResources[res as keyof Resources] += final;
        });
      }
      if (data.consumption) {
          Object.entries(data.consumption).forEach(([res, amount]) => {
              nextResources[res as keyof Resources] -= (amount as number) * workRatio;
          });
      }
    });

    // Consumption of special goods
    if (state.population.citizens > 0) {
        if (nextResources.beer >= state.population.citizens * 0.1) nextResources.beer -= state.population.citizens * 0.1;
        else state.population.happiness -= 1;
    }
    if (state.population.nobles > 0) {
        if (nextResources.wine >= state.population.nobles * 0.1) nextResources.wine -= state.population.nobles * 0.1;
        else state.population.happiness -= 2;
    }

    // Debt & Inflation
    if (state.debt > 0) {
        const interest = state.debt * 0.05; // 5% daily interest
        nextResources.gold -= interest;
    }
    if (nextResources.gold > 5000) state.inflation += 0.001;

    // Happiness & Social
    let happiness = state.population.happiness;
    if (nextResources.food <= 0) happiness -= 5;
    if (nextHealth < 50) happiness -= 2;
    
    return { ...state, buildings: nextBuildings, resources: nextResources, population: { ...state.population, health: nextHealth, happiness: Math.max(0, Math.min(100, happiness)) }, time: nextTime };
  };

  const toggleLaw = (id: string) => {
      setGameState(prev => {
          const law = prev.laws.find(l => l.id === id);
          if (!law || (!law.active && prev.resources.prestige < law.prestigeCost)) return prev;
          
          // Apply faction impact
          const nextFactions = prev.factions.map(f => {
              if (id === 'forced_labor' && f.type === 'clergy') return { ...f, favor: f.favor - 10 };
              if (id === 'tithe' && f.type === 'merchants') return { ...f, favor: f.favor - 15 };
              if (id === 'conscription' && f.type === 'military') return { ...f, favor: f.favor + 10 };
              return f;
          });

          return {
              ...prev,
              resources: { ...prev.resources, prestige: law.active ? prev.resources.prestige : prev.resources.prestige - law.prestigeCost },
              laws: prev.laws.map(l => l.id === id ? { ...l, active: !l.active } : l),
              factions: nextFactions
          };
      });
  };

  return {
      gameState, toggleLaw,
      buildBuilding: (type: BuildingType, x: number, y: number) => {
          const data = BUILDINGS[type];
          if (Object.entries(data.cost).every(([r, a]) => gameState.resources[r as keyof Resources] >= (a as number))) {
              setGameState(prev => {
                  const nr = { ...prev.resources };
                  Object.entries(data.cost).forEach(([r, a]) => nr[r as keyof Resources] -= (a as number));
                  return { ...prev, resources: nr, buildings: [...prev.buildings, { id: Math.random().toString(), type, x, y, level: 1, assignedWorkers: 0, efficiencyBonus: 0, condition: 100 }] };
              });
          }
      },
      assignWorker: (id: string, amt: number) => {
          setGameState(prev => ({
              ...prev,
              buildings: prev.buildings.map(b => b.id === id ? { ...b, assignedWorkers: Math.max(0, Math.min(BUILDINGS[b.type].maxWorkers, b.assignedWorkers + amt)) } : b)
          }));
      },
      resolveDialogue: (idx: number) => {},
      dispatchCaravan: (k: any, r: any, a: any) => {},
      resetGame: () => { localStorage.removeItem(SAVE_KEY); window.location.reload(); }
  };
}
