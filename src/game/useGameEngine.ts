import { useState, useEffect, useRef } from 'react';
import type { GameState, BuildingType, Resources } from './types';
import { INITIAL_STATE, BUILDINGS, generateNodes } from './constants';

const TICK_RATE = 1000;
const SAVE_KEY = 'feudal_lord_research_v1';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, activeDialogue: null };
      } catch (e) { return { ...INITIAL_STATE, resourceNodes: generateNodes() }; }
    }
    return { ...INITIAL_STATE, resourceNodes: generateNodes() };
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
      nextTime.tick = 0; nextTime.day += 1;
      if (nextTime.day > 30) { nextTime.day = 1; nextTime.month += 1; if (nextTime.month > 12) { nextTime.month = 1; nextTime.year += 1; } }
    }

    const nextResources = { ...state.resources };
    
    // Tech Check
    const hasAgri3 = state.technologies.find(t => t.id === 'agriculture_3')?.unlocked;
    const hasMed = state.technologies.find(t => t.id === 'anatomy')?.unlocked;
    const hasArmor = state.technologies.find(t => t.id === 'heavy_armor')?.unlocked;

    const productivityMod = (state.population.happiness / 100) * (state.population.health / 100);
    
    state.buildings.forEach((b) => {
      const data = BUILDINGS[b.type];
      const workRatio = data.maxWorkers > 0 ? b.assignedWorkers / data.maxWorkers : 1;
      if (workRatio <= 0 && data.maxWorkers > 0) return;

      if (data.production) {
        Object.entries(data.production).forEach(([res, amount]) => {
          let final = (amount as number) * workRatio * productivityMod;
          if (res === 'grain' && hasAgri3) final *= 1.3;
          nextResources[res as keyof Resources] += final;
        });
      }
      if (data.consumption) {
          Object.entries(data.consumption).forEach(([res, amount]) => {
              nextResources[res as keyof Resources] -= (amount as number) * workRatio;
          });
      }
    });

    // Consumption & Health
    const foodCons = (state.population.peasants * 0.4) + (state.population.citizens * 0.6) + (state.population.nobles * 1.0);
    nextResources.food = Math.max(0, nextResources.food - foodCons);
    
    let nextHealth = state.population.health;
    if (hasMed) nextHealth = Math.min(100, nextHealth + 0.1);

    let defense = 25;
    if (hasArmor) defense += 50;

    return { ...state, resources: nextResources, population: { ...state.population, health: nextHealth }, defenseRating: defense, time: nextTime };
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
      assignWorker: (id: string, amt: number) => {
          setGameState(prev => ({
              ...prev,
              buildings: prev.buildings.map(b => b.id === id ? { ...b, assignedWorkers: Math.max(0, Math.min(BUILDINGS[b.type].maxWorkers, b.assignedWorkers + amt)) } : b)
          }));
      },
      resetGame: () => { localStorage.removeItem(SAVE_KEY); window.location.reload(); }
  };
}
