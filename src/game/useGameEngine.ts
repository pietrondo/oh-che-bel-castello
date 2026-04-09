import { useState, useEffect, useRef } from 'react';
import type { GameState, BuildingType, Resources, Dialogue, Sovereign, SovereignTrait, Law } from './types';
import { INITIAL_STATE, BUILDINGS } from './constants';

const TICK_RATE = 1000;
const SAVE_KEY = 'feudal_lord_dynasty_v1';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, activeDialogue: null };
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
    let nextSovereign = { ...state.sovereign };
    let nextHeir = state.heir ? { ...state.heir } : null;
    
    // Time & Aging
    if (nextTime.tick >= 10) {
      nextTime.tick = 0;
      nextTime.day += 1;
      if (nextTime.day > 30) {
        nextTime.day = 1;
        nextTime.month += 1;
        if (nextTime.month > 12) { 
            nextTime.month = 1; nextTime.year += 1; 
            nextSovereign.age += 1; // Sovereign ages every year
            if (nextHeir) nextHeir.age += 1;
        }
      }
    }

    // Death & Succession
    if (nextSovereign.age > 60 + Math.random() * 20) {
        if (nextHeir) {
            nextSovereign = { ...nextHeir, age: nextHeir.age };
            nextHeir = { name: `Principe ${nextSovereign.name.split(' ')[1]} II`, age: 0, traits: ['Just'], portrait: '👶' };
        }
    }

    const nextResources = { ...state.resources };
    const hasSerfdom = state.laws.find(l => l.id === 'serfdom')?.active;
    const hasDivineRight = state.laws.find(l => l.id === 'divine_right')?.active;

    // Production Chains
    state.buildings.forEach((b) => {
      const data = BUILDINGS[b.type];
      const workRatio = data.maxWorkers > 0 ? b.assignedWorkers / data.maxWorkers : 1;
      if (workRatio <= 0 && data.maxWorkers > 0) return;

      // Consumption Check
      let canProduce = true;
      if (data.consumption) {
          canProduce = Object.entries(data.consumption).every(([res, amt]) => nextResources[res as keyof Resources] >= (amt as number) * workRatio);
      }

      if (canProduce) {
          if (data.consumption) {
              Object.entries(data.consumption).forEach(([res, amt]) => {
                  nextResources[res as keyof Resources] -= (amt as number) * workRatio;
              });
          }
          if (data.production) {
              Object.entries(data.production).forEach(([res, amt]) => {
                  let final = (amt as number) * workRatio;
                  if (res === 'grain' && hasSerfdom) final *= 1.5;
                  if (res === 'piety' && hasDivineRight) final += 2;
                  nextResources[res as keyof Resources] += final;
              });
          }
      }
    });

    // Auto-consume bread for food
    if (nextResources.bread > 0) {
        const consumed = Math.min(nextResources.bread, state.population.total * 0.5);
        nextResources.bread -= consumed;
        nextResources.food += consumed * 2; // Bread is more efficient than raw food
    }

    return { ...state, time: nextTime, sovereign: nextSovereign, heir: nextHeir, resources: nextResources };
  };

  const toggleLaw = (id: string) => {
      setGameState(prev => {
          const law = prev.laws.find(l => l.id === id);
          if (!law || (!law.active && prev.resources.prestige < law.cost)) return prev;
          return {
              ...prev,
              resources: { ...prev.resources, prestige: law.active ? prev.resources.prestige : prev.resources.prestige - law.cost },
              laws: prev.laws.map(l => l.id === id ? { ...l, active: !l.active } : l)
          };
      });
  };

  return {
      gameState, toggleLaw,
      buildBuilding: (type: BuildingType, x: number, y: number) => {
          const data = BUILDINGS[type];
          setGameState(prev => ({
              ...prev,
              resources: { ...prev.resources, wood: prev.resources.wood - (data.cost.wood || 0), stone: prev.resources.stone - (data.cost.stone || 0) },
              buildings: [...prev.buildings, { id: Math.random().toString(), type, x, y, level: 1, assignedWorkers: 0, efficiencyBonus: 0 }]
          }));
      },
      assignWorker: (id: string, amt: number) => {
          setGameState(prev => ({
              ...prev,
              buildings: prev.buildings.map(b => b.id === id ? { ...b, assignedWorkers: Math.max(0, Math.min(BUILDINGS[b.type].maxWorkers, b.assignedWorkers + amt)) } : b)
          }));
      },
      resetGame: () => { localStorage.removeItem(SAVE_KEY); window.location.reload(); }
  };
}
